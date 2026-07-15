package com.example.rams.dto;

import java.util.List;

public record AiRecommendationResponse(
        List<RecommendedResource> recommendedResources
) {
}
