package com.example.rams.dto;

public record AvailableResourceResponse(
        Long employeeId,
        String employeeCode,
        String employeeName,
        String role,
        String department,
        Integer allocation,
        Integer available
) {
}
