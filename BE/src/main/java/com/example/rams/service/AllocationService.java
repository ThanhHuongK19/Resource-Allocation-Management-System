package com.example.rams.service;

import com.example.rams.dto.AllocationRequest;
import com.example.rams.dto.AllocationResponse;
import com.example.rams.entity.Allocation;
import com.example.rams.entity.Employee;
import com.example.rams.entity.Project;
import com.example.rams.entity.ProjectStatus;
import com.example.rams.exception.AllocationExceededException;
import com.example.rams.exception.AllocationNotFoundException;
import com.example.rams.exception.CompletedProjectAllocationException;
import com.example.rams.repository.AllocationRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AllocationService {

    private static final Logger log = LoggerFactory.getLogger(AllocationService.class);

    private final AllocationRepository allocationRepository;
    private final EmployeeService employeeService;
    private final ProjectService projectService;

    public AllocationService(
            AllocationRepository allocationRepository,
            EmployeeService employeeService,
            ProjectService projectService
    ) {
        this.allocationRepository = allocationRepository;
        this.employeeService = employeeService;
        this.projectService = projectService;
    }

    @Transactional
    public AllocationResponse create(AllocationRequest request) {
        Employee employee = employeeService.getEntity(request.employeeId());
        Project project = projectService.getEntity(request.projectId());
        validateProject(project);
        validateAllocationLimit(employee.getId(), null, request.allocationPercent());

        Allocation allocation = new Allocation();
        allocation.setEmployee(employee);
        allocation.setProject(project);
        apply(allocation, request);
        Allocation saved = allocationRepository.save(allocation);
        log.info("Created allocation id={} employeeId={} projectId={} percent={}",
                saved.getId(), employee.getId(), project.getId(), saved.getAllocationPercent());
        return AllocationMapper.toResponse(saved);
    }

    @Transactional
    public AllocationResponse update(Long id, AllocationRequest request) {
        Allocation allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new AllocationNotFoundException(id));
        Employee employee = employeeService.getEntity(request.employeeId());
        Project project = projectService.getEntity(request.projectId());
        validateProject(project);
        validateAllocationLimit(employee.getId(), id, request.allocationPercent());

        allocation.setEmployee(employee);
        allocation.setProject(project);
        apply(allocation, request);
        Allocation saved = allocationRepository.save(allocation);
        log.info("Updated allocation id={} employeeId={} projectId={} percent={}",
                saved.getId(), employee.getId(), project.getId(), saved.getAllocationPercent());
        return AllocationMapper.toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Allocation allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new AllocationNotFoundException(id));
        allocationRepository.delete(allocation);
        log.info("Removed allocation id={} employeeId={} projectId={}",
                id, allocation.getEmployee().getId(), allocation.getProject().getId());
    }

    public List<AllocationResponse> findAll() {
        return allocationRepository.findAll().stream()
                .map(AllocationMapper::toResponse)
                .toList();
    }

    public AllocationResponse findById(Long id) {
        return AllocationMapper.toResponse(allocationRepository.findById(id)
                .orElseThrow(() -> new AllocationNotFoundException(id)));
    }

    private void apply(Allocation allocation, AllocationRequest request) {
        allocation.setAllocationPercent(request.allocationPercent());
        allocation.setRoleInProject(request.roleInProject());
        allocation.setStartDate(request.startDate());
        allocation.setEndDate(request.endDate());
    }

    private void validateProject(Project project) {
        if (project.getStatus() == ProjectStatus.COMPLETED) {
            throw new CompletedProjectAllocationException();
        }
    }

    private void validateAllocationLimit(Long employeeId, Long excludedAllocationId, Integer newPercent) {
        int current = excludedAllocationId == null
                ? allocationRepository.sumAllocationByEmployeeId(employeeId)
                : allocationRepository.sumAllocationByEmployeeIdExcluding(employeeId, excludedAllocationId);
        if (current + newPercent > 100) {
            throw new AllocationExceededException();
        }
    }
}
