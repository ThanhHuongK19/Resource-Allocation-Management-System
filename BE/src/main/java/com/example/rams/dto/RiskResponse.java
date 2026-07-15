package com.example.rams.dto;

import java.util.List;

public record RiskResponse(
        Integer teamUtilization,
        Integer matchingAvailableResources,
        List<String> risks
) {
}
