package com.example.rams.service;

import com.example.rams.dto.EmployeeRequest;
import com.example.rams.dto.EmployeeResponse;
import com.example.rams.dto.WorkloadResponse;
import com.example.rams.entity.Employee;
import com.example.rams.exception.DuplicateCodeException;
import com.example.rams.exception.EmployeeNotFoundException;
import com.example.rams.repository.AllocationRepository;
import com.example.rams.repository.EmployeeRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AllocationRepository allocationRepository;

    public EmployeeService(EmployeeRepository employeeRepository, AllocationRepository allocationRepository) {
        this.employeeRepository = employeeRepository;
        this.allocationRepository = allocationRepository;
    }

    @Transactional
    public EmployeeResponse create(EmployeeRequest request) {
        if (employeeRepository.existsByEmployeeCode(request.employeeCode())) {
            throw new DuplicateCodeException("Employee code already exists: " + request.employeeCode());
        }
        if (employeeRepository.existsByEmailIgnoreCase(request.email())) {
            throw new DuplicateCodeException("Email already exists: " + request.email());
        }
        Employee employee = new Employee();
        employee.setEmployeeCode(request.employeeCode());
        employee.setFullName(request.fullName());
        employee.setEmail(request.email());
        employee.setRole(request.role());
        employee.setDepartment(request.department());
        return EmployeeMapper.toResponse(employeeRepository.save(employee));
    }

    public List<EmployeeResponse> findAll() {
        return employeeRepository.findAll().stream()
                .map(EmployeeMapper::toResponse)
                .toList();
    }

    public EmployeeResponse findById(Long id) {
        return EmployeeMapper.toResponse(getEntity(id));
    }

    public WorkloadResponse getWorkload(Long id) {
        Employee employee = getEntity(id);
        int total = allocationRepository.sumAllocationByEmployeeId(id);
        return new WorkloadResponse(employee.getId(), employee.getFullName(), total, 100 - total);
    }

    Employee getEntity(Long id) {
        return employeeRepository.findById(id).orElseThrow(() -> new EmployeeNotFoundException(id));
    }
}
