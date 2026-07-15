-- Employee utilization report
SELECT
    e.employee_id,
    e.employee_code,
    e.full_name,
    COALESCE(SUM(a.allocation_percent), 0) AS allocation
FROM employee e
LEFT JOIN allocation a ON a.employee_id = e.employee_id
GROUP BY e.employee_id, e.employee_code, e.full_name
ORDER BY allocation DESC;

-- Available resource report
SELECT
    e.employee_id,
    e.employee_code,
    e.full_name,
    100 - COALESCE(SUM(a.allocation_percent), 0) AS available
FROM employee e
LEFT JOIN allocation a ON a.employee_id = e.employee_id
GROUP BY e.employee_id, e.employee_code, e.full_name
HAVING COALESCE(SUM(a.allocation_percent), 0) < 100
ORDER BY available DESC;

-- Overloaded employee report
SELECT
    e.employee_id,
    e.employee_code,
    e.full_name,
    COALESCE(SUM(a.allocation_percent), 0) AS allocation
FROM employee e
LEFT JOIN allocation a ON a.employee_id = e.employee_id
GROUP BY e.employee_id, e.employee_code, e.full_name
HAVING COALESCE(SUM(a.allocation_percent), 0) > 90
ORDER BY allocation DESC;
