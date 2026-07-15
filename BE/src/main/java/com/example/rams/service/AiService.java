package com.example.rams.service;

import com.example.rams.dto.AiRecommendationRequest;
import com.example.rams.dto.AiRecommendationResponse;
import com.example.rams.dto.AiRiskRequest;
import com.example.rams.dto.AiRiskResponse;
import com.example.rams.dto.RecommendedResource;
import com.example.rams.entity.Employee;
import com.example.rams.repository.AllocationRepository;
import com.example.rams.repository.EmployeeRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private final EmployeeRepository employeeRepository;
    private final AllocationRepository allocationRepository;

    public AiService(EmployeeRepository employeeRepository, AllocationRepository allocationRepository) {
        this.employeeRepository = employeeRepository;
        this.allocationRepository = allocationRepository;
    }

    public AiRecommendationResponse recommend(AiRecommendationRequest req) {
        String kw = req.roleKeyword() == null ? "" : req.roleKeyword().toLowerCase(Locale.ROOT);
        int minAvail = req.minimumAvailable() == null ? 0 : req.minimumAvailable();
        List<RecommendedResource> list = employeeRepository.findAll().stream()
                .filter(e -> e.getRole() != null && e.getRole().toLowerCase(Locale.ROOT).contains(kw))
                .map(e -> {
                    int used = allocationRepository.sumAllocationByEmployeeId(e.getId());
                    int available = Math.max(0, 100 - used);
                    return new RecommendedResource(e.getId(), e.getFullName(), available);
                })
                .filter(r -> r.available() >= minAvail)
                .sorted(Comparator.comparingInt(RecommendedResource::available).reversed())
                .collect(Collectors.toList());
        return new AiRecommendationResponse(list);
    }

    public AiRiskResponse detectRisk(AiRiskRequest req) {
        String kw = req.roleKeyword() == null ? "" : req.roleKeyword().toLowerCase(Locale.ROOT);
        int needed = req.neededCount() == null ? 0 : req.neededCount();

        List<Employee> matching = employeeRepository.findAll().stream()
                .filter(e -> e.getRole() != null && e.getRole().toLowerCase(Locale.ROOT).contains(kw))
                .collect(Collectors.toList());

        int teamUtil = matching.stream()
                .mapToInt(e -> allocationRepository.sumAllocationByEmployeeId(e.getId()))
                .sum();

        List<RecommendedResource> matchingResources = matching.stream()
            .map(e -> {
                int used = allocationRepository.sumAllocationByEmployeeId(e.getId());
                int available = Math.max(0, 100 - used);
                return new RecommendedResource(e.getId(), e.getFullName(), available);
            })
            .collect(Collectors.toList());

        int matchingAvailable = (int) matchingResources.stream()
            .filter(r -> r.available() >= 50)
            .count();

        List<String> risks = new ArrayList<>();
        if (matching.size() < needed) risks.add("Not enough matching resources");
        if (teamUtil < needed * 100) risks.add("Team utilization low");

        // respond with aggregated team utilization (rounded average if matching exists)
        int teamUtilPercent = matching.isEmpty() ? 0 : Math.round((float) teamUtil / matching.size());

        return new AiRiskResponse(teamUtilPercent, matchingAvailable, matchingResources, risks);
    }
}
