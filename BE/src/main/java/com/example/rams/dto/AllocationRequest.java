package com.example.rams.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record AllocationRequest(
        @NotNull Long employeeId,
        @NotNull Long projectId,
        @NotNull @Min(1) @Max(100) Integer allocationPercent,
        @NotBlank @Size(max = 100) String roleInProject,
        LocalDate startDate,
        LocalDate endDate
) {
}
