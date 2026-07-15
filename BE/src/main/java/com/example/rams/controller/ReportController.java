package com.example.rams.controller;

import com.example.rams.dto.AvailableResourceResponse;
import com.example.rams.dto.EmployeeUtilizationResponse;
import com.example.rams.dto.RecommendationRequest;
import com.example.rams.dto.RecommendationResponse;
import com.example.rams.dto.RiskRequest;
import com.example.rams.dto.RiskResponse;
import com.example.rams.service.ReportService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/reports/utilization")
    public List<EmployeeUtilizationResponse> utilization() {
        return reportService.utilization();
    }

    @GetMapping("/reports/available")
    public List<AvailableResourceResponse> available(@RequestParam(required = false) Integer minimumAvailable) {
        return reportService.availableResources(minimumAvailable);
    }

    @GetMapping("/reports/overloaded")
    public List<EmployeeUtilizationResponse> overloaded() {
        return reportService.overloaded();
    }

    @PostMapping("/ai/recommendations")
    public RecommendationResponse recommend(@Valid @RequestBody RecommendationRequest request) {
        return reportService.recommend(request);
    }

    @PostMapping("/ai/risk-detection")
    public RiskResponse detectRisk(@Valid @RequestBody RiskRequest request) {
        return reportService.detectRisk(request);
    }
}
