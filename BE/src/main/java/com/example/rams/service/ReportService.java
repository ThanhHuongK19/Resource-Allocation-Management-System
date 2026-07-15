package com.example.rams.service;

import com.example.rams.dto.AvailableResourceResponse;
import com.example.rams.dto.EmployeeUtilizationResponse;
import com.example.rams.dto.RecommendationRequest;
import com.example.rams.dto.RecommendationResponse;
import com.example.rams.dto.RiskRequest;
import com.example.rams.dto.RiskResponse;
import com.example.rams.entity.Employee;
import com.example.rams.repository.AllocationRepository;
import com.example.rams.repository.EmployeeRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final EmployeeRepository employeeRepository;
    private final AllocationRepository allocationRepository;

    public ReportService(EmployeeRepository employeeRepository, AllocationRepository allocationRepository) {
        this.employeeRepository = employeeRepository;
        this.allocationRepository = allocationRepository;
    }

    public List<EmployeeUtilizationResponse> utilization() {
        return employeeRepository.findAll().stream()
                .map(employee -> {
                    int allocation = totalAllocation(employee.getId());
                    return new EmployeeUtilizationResponse(
                            employee.getId(),
                            employee.getEmployeeCode(),
                            employee.getFullName(),
                            employee.getRole(),
                            employee.getDepartment(),
                            allocation
                    );
                })
                .sorted(Comparator.comparing(EmployeeUtilizationResponse::allocation).reversed())
                .toList();
    }

    public List<AvailableResourceResponse> availableResources(Integer minimumAvailable) {
        int min = minimumAvailable == null ? 1 : minimumAvailable;
        return employeeRepository.findAll().stream()
                .map(this::toAvailableResource)
                .filter(resource -> resource.available() >= min)
                .sorted(Comparator.comparing(AvailableResourceResponse::available).reversed())
                .toList();
    }

    public List<EmployeeUtilizationResponse> overloaded() {
        return utilization().stream()
                .filter(employee -> employee.allocation() > 90)
                .toList();
    }

    public RecommendationResponse recommend(RecommendationRequest request) {
        String keyword = request.roleKeyword().toLowerCase(Locale.ROOT);
        List<AvailableResourceResponse> matches = availableResources(request.minimumAvailable()).stream()
                .filter(resource -> resource.role().toLowerCase(Locale.ROOT).contains(keyword))
                .toList();
        return new RecommendationResponse(matches);
    }

    public RiskResponse detectRisk(RiskRequest request) {
        RecommendationResponse recommendation = recommend(
                new RecommendationRequest(request.roleKeyword(), request.minimumAvailable())
        );
        int totalEmployees = (int) employeeRepository.count();
        int teamUtilization = totalEmployees == 0
                ? 0
                : Math.round((float) utilization().stream().mapToInt(EmployeeUtilizationResponse::allocation).sum() / totalEmployees);
        int matching = recommendation.recommendedResources().size();
        List<String> risks = new ArrayList<>();

        if (teamUtilization > 90) {
            risks.add("Team is using " + teamUtilization + "% capacity.");
        }
        if (matching < request.neededCount()) {
            risks.add("Only " + matching + " matching resource(s) available above "
                    + request.minimumAvailable() + "%.");
        }
        if (risks.isEmpty()) {
            risks.add("No major capacity risk detected for the requested role.");
        }
        return new RiskResponse(teamUtilization, matching, risks);
    }

    private AvailableResourceResponse toAvailableResource(Employee employee) {
        int allocation = totalAllocation(employee.getId());
        return new AvailableResourceResponse(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getFullName(),
                employee.getRole(),
                employee.getDepartment(),
                allocation,
                100 - allocation
        );
    }

    private int totalAllocation(Long employeeId) {
        return allocationRepository.sumAllocationByEmployeeId(employeeId);
    }
}
