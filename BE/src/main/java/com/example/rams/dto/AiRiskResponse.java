package com.example.rams.dto;

import java.util.List;

public record AiRiskResponse(
        Integer teamUtilization,
        Integer matchingAvailableResources,
        List<RecommendedResource> matchingResources,
        List<String> risks
) {
}
