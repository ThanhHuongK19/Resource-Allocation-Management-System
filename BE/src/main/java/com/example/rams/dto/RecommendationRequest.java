package com.example.rams.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RecommendationRequest(
        @NotBlank String roleKeyword,
        @NotNull @Min(1) @Max(100) Integer minimumAvailable
) {
}
