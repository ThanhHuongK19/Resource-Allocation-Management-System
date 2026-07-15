package com.example.rams.dto;

public record WorkloadResponse(
        Long employeeId,
        String employeeName,
        Integer totalAllocation,
        Integer available
) {
}
