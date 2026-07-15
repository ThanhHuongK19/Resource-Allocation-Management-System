package com.example.rams.service;

import com.example.rams.dto.AllocationResponse;
import com.example.rams.entity.Allocation;

final class AllocationMapper {

    private AllocationMapper() {
    }

    static AllocationResponse toResponse(Allocation allocation) {
        return new AllocationResponse(
                allocation.getId(),
                allocation.getEmployee().getId(),
                allocation.getEmployee().getEmployeeCode(),
                allocation.getEmployee().getFullName(),
                allocation.getProject().getId(),
                allocation.getProject().getProjectCode(),
                allocation.getProject().getProjectName(),
                allocation.getAllocationPercent(),
                allocation.getRoleInProject(),
                allocation.getStartDate(),
                allocation.getEndDate()
        );
    }
}
