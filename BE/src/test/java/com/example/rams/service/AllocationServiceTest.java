package com.example.rams.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.example.rams.dto.AllocationRequest;
import com.example.rams.entity.Employee;
import com.example.rams.entity.Project;
import com.example.rams.entity.ProjectStatus;
import com.example.rams.exception.AllocationExceededException;
import com.example.rams.exception.CompletedProjectAllocationException;
import com.example.rams.repository.AllocationRepository;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AllocationServiceTest {

    @Mock
    private AllocationRepository allocationRepository;

    @Mock
    private EmployeeService employeeService;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private AllocationService allocationService;

    @Test
    void createRejectsAllocationWhenEmployeeWouldExceed100Percent() {
        Employee employee = employee();
        Project project = project(ProjectStatus.ACTIVE);
        when(employeeService.getEntity(1L)).thenReturn(employee);
        when(projectService.getEntity(2L)).thenReturn(project);
        when(allocationRepository.sumAllocationByEmployeeId(1L)).thenReturn(80);

        AllocationRequest request = new AllocationRequest(
                1L,
                2L,
                30,
                "Backend Developer",
                LocalDate.now(),
                LocalDate.now().plusMonths(3)
        );

        assertThatThrownBy(() -> allocationService.create(request))
                .isInstanceOf(AllocationExceededException.class)
                .hasMessage("Employee allocation exceeds 100%");
    }

    @Test
    void createRejectsCompletedProject() {
        when(employeeService.getEntity(1L)).thenReturn(employee());
        when(projectService.getEntity(2L)).thenReturn(project(ProjectStatus.COMPLETED));

        AllocationRequest request = new AllocationRequest(
                1L,
                2L,
                10,
                "Backend Developer",
                null,
                null
        );

        assertThatThrownBy(() -> allocationService.create(request))
                .isInstanceOf(CompletedProjectAllocationException.class);
    }

    private Employee employee() {
        Employee employee = new Employee();
        employee.setId(1L);
        employee.setEmployeeCode("EMP001");
        employee.setFullName("Tuan Ho Anh");
        employee.setEmail("tuanha@company.com");
        employee.setRole("Senior Developer");
        employee.setDepartment("FSOFT-Q1");
        return employee;
    }

    private Project project(ProjectStatus status) {
        Project project = new Project();
        project.setId(2L);
        project.setProjectCode("NCG");
        project.setProjectName("National Credit Guard");
        project.setCustomer("NCG Corp");
        project.setStatus(status);
        return project;
    }
}
