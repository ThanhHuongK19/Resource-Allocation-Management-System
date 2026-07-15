package com.example.rams.service;

import com.example.rams.dto.EmployeeResponse;
import com.example.rams.entity.Employee;

final class EmployeeMapper {

    private EmployeeMapper() {
    }

    static EmployeeResponse toResponse(Employee employee) {
        return new EmployeeResponse(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getFullName(),
                employee.getEmail(),
                employee.getRole(),
                employee.getDepartment()
        );
    }
}
