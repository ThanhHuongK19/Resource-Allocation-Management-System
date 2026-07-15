package com.example.rams.dto;

public record EmployeeResponse(
        Long id,
        String employeeCode,
        String fullName,
        String email,
        String role,
        String department
) {
}
