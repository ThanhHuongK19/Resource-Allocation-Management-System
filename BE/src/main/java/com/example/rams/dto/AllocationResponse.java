package com.example.rams.dto;

import java.time.LocalDate;

public record AllocationResponse(
        Long id,
        Long employeeId,
        String employeeCode,
        String employeeName,
        Long projectId,
        String projectCode,
        String projectName,
        Integer allocationPercent,
        String roleInProject,
        LocalDate startDate,
        LocalDate endDate
) {
}
