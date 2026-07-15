package com.example.rams.dto;

public record AiRecommendationRequest(
        String roleKeyword,
        Integer minimumAvailable
) {
}
