package com.example.rams.dto;

import com.example.rams.entity.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record ProjectRequest(
        @NotBlank @Size(max = 20) String projectCode,
        @NotBlank @Size(max = 200) String projectName,
        @NotBlank @Size(max = 100) String customer,
        LocalDate startDate,
        LocalDate endDate,
        @NotNull ProjectStatus status
) {
}
