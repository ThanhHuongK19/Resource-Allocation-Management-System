package com.example.rams.dto;

import java.util.List;

public record RecommendationResponse(
        List<AvailableResourceResponse> recommendedResources
) {
}
