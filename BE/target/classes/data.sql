INSERT INTO employee (employee_code, full_name, email, role, department)
VALUES
    ('EMP001', 'Tuan Ho Anh', 'tuanha@company.com', 'Senior Java Developer', 'FSOFT-Q1'),
    ('EMP002', 'Nguyen Van A', 'nguyenvana@company.com', 'Java Developer', 'FSOFT-Q1'),
    ('EMP003', 'Tran Thi B', 'tranthib@company.com', 'Frontend Developer', 'FSOFT-Q2'),
    ('EMP004', 'Le Van C', 'levanc@company.com', 'QA Engineer', 'FSOFT-QA'),
    ('EMP005', 'Pham Thi D', 'phamthid@company.com', 'Project Manager', 'PMO')
ON CONFLICT (employee_code) DO NOTHING;

INSERT INTO project (project_code, project_name, customer, start_date, end_date, status)
VALUES
    ('NCG', 'National Credit Guard', 'NCG Corp', '2026-01-01', '2026-12-31', 'ACTIVE'),
    ('GRID', 'Grid Infrastructure', 'Grid Solutions Ltd', '2026-02-01', '2026-10-31', 'ACTIVE'),
    ('AI-INT', 'Internal AI Tools', 'Internal', '2026-03-01', '2026-09-30', 'PLANNING'),
    ('LEGACY', 'Legacy Migration', 'Acme Corp', '2025-01-01', '2025-12-31', 'COMPLETED')
ON CONFLICT (project_code) DO NOTHING;

INSERT INTO allocation (employee_id, project_id, allocation_percent, role_in_project, start_date, end_date)
SELECT e.employee_id, p.project_id, v.allocation_percent, v.role_in_project, v.start_date::date, v.end_date::date
FROM (
    VALUES
        ('EMP001', 'NCG', 50, 'Backend Developer', '2026-01-01', '2026-12-31'),
        ('EMP001', 'GRID', 30, 'Backend Developer', '2026-02-01', '2026-10-31'),
        ('EMP002', 'NCG', 40, 'Java Developer', '2026-01-01', '2026-12-31'),
        ('EMP003', 'GRID', 80, 'Frontend Developer', '2026-02-01', '2026-10-31'),
        ('EMP004', 'AI-INT', 60, 'QA Engineer', '2026-03-01', '2026-09-30'),
        ('EMP005', 'NCG', 95, 'Project Manager', '2026-01-01', '2026-12-31')
) AS v(employee_code, project_code, allocation_percent, role_in_project, start_date, end_date)
JOIN employee e ON e.employee_code = v.employee_code
JOIN project p ON p.project_code = v.project_code
WHERE NOT EXISTS (
    SELECT 1
    FROM allocation a
    WHERE a.employee_id = e.employee_id
      AND a.project_id = p.project_id
      AND a.role_in_project = v.role_in_project
);
