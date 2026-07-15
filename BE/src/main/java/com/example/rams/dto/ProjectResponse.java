package com.example.rams.dto;

import com.example.rams.entity.ProjectStatus;
import java.time.LocalDate;

public record ProjectResponse(
        Long id,
        String projectCode,
        String projectName,
        String customer,
        LocalDate startDate,
        LocalDate endDate,
        ProjectStatus status
) {
}
