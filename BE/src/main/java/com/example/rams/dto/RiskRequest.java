package com.example.rams.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RiskRequest(
        @NotBlank String roleKeyword,
        @NotNull @Min(1) Integer neededCount,
        @NotNull @Min(1) Integer minimumAvailable
) {
}
