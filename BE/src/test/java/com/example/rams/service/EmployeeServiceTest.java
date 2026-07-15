package com.example.rams.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.rams.dto.EmployeeRequest;
import com.example.rams.entity.Employee;
import com.example.rams.exception.DuplicateCodeException;
import com.example.rams.repository.AllocationRepository;
import com.example.rams.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private AllocationRepository allocationRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    void createRejectsDuplicateEmailIgnoringCase() {
        EmployeeRequest request = new EmployeeRequest(
                "EMP006",
                "Nguyen Van E",
                "TUANHA@company.com",
                "Java Developer",
                "FSOFT-Q1"
        );
        when(employeeRepository.existsByEmployeeCode("EMP006")).thenReturn(false);
        when(employeeRepository.existsByEmailIgnoreCase("TUANHA@company.com")).thenReturn(true);

        assertThatThrownBy(() -> employeeService.create(request))
                .isInstanceOf(DuplicateCodeException.class)
                .hasMessage("Email already exists: TUANHA@company.com");

        verify(employeeRepository, never()).save(org.mockito.ArgumentMatchers.any(Employee.class));
    }
}
