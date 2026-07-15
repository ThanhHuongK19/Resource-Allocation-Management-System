package com.example.rams.service;

import com.example.rams.dto.ProjectRequest;
import com.example.rams.dto.ProjectResponse;
import com.example.rams.entity.Project;
import com.example.rams.exception.DuplicateCodeException;
import com.example.rams.exception.ProjectNotFoundException;
import com.example.rams.repository.ProjectRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional
    public ProjectResponse create(ProjectRequest request) {
        if (projectRepository.existsByProjectCode(request.projectCode())) {
            throw new DuplicateCodeException("Project code already exists: " + request.projectCode());
        }
        Project project = new Project();
        apply(project, request);
        return ProjectMapper.toResponse(projectRepository.save(project));
    }

    public List<ProjectResponse> findAll() {
        return projectRepository.findAll().stream()
                .map(ProjectMapper::toResponse)
                .toList();
    }

    public ProjectResponse findById(Long id) {
        return ProjectMapper.toResponse(getEntity(id));
    }

    Project getEntity(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new ProjectNotFoundException(id));
    }

    private void apply(Project project, ProjectRequest request) {
        project.setProjectCode(request.projectCode());
        project.setProjectName(request.projectName());
        project.setCustomer(request.customer());
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.setStatus(request.status());
    }
}
