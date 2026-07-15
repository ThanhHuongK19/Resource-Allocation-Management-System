package com.example.rams.dto;

public record EmployeeUtilizationResponse(
        Long employeeId,
        String employeeCode,
        String employeeName,
        String role,
        String department,
        Integer allocation
) {
}
