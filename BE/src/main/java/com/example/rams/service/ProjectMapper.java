package com.example.rams.service;

import com.example.rams.dto.ProjectResponse;
import com.example.rams.entity.Project;

final class ProjectMapper {

    private ProjectMapper() {
    }

    static ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getProjectCode(),
                project.getProjectName(),
                project.getCustomer(),
                project.getStartDate(),
                project.getEndDate(),
                project.getStatus()
        );
    }
}
