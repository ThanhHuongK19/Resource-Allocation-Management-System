# Resource Allocation Management System (RAMS)

A full-stack application that helps Project Managers and Resource Managers at an
outsourcing company allocate people across multiple parallel projects, track each
employee's workload, find available resources, and report on utilization — with
AI-assisted resource recommendation and risk detection.

The core rule the system enforces: **an employee's total allocation across all
projects can never exceed 100%.**

```
NCG:         50%
GRID:        30%
Internal AI: 20%
------------------
Total:      100%  ✅ valid   (101%+ is rejected)
```

- **Backend** — Java 17, Spring Boot 3, Spring Data JPA, PostgreSQL, Maven
- **Frontend** — React 18, TypeScript, Vite, Tailwind CSS, shadcn/Radix UI
- **Infra** — Docker Compose (backend + PostgreSQL), Swagger/OpenAPI, Postman

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Business Rules](#business-rules)
6. [Data Model](#data-model)
7. [Getting Started](#getting-started)
8. [Configuration](#configuration)
9. [API Reference](#api-reference)
10. [Reports](#reports)
11. [AI Features](#ai-features)
12. [Error Handling](#error-handling)
13. [Testing](#testing)
14. [API Docs & Postman](#api-docs--postman)
15. [Seed Data](#seed-data)
16. [Troubleshooting](#troubleshooting)

---

## Features

- **Employee management** — create and list employees, view an employee's workload.
- **Project management** — create and list projects with lifecycle status (`PLANNING`, `ACTIVE`, `COMPLETED`).
- **Resource allocation** — assign employees to projects with a validated allocation percentage.
- **Workload tracking** — per-employee total allocation and remaining availability.
- **Reporting** — utilization, available resources, and overloaded employees.
- **AI assistant** — resource recommendation and capacity/risk detection.
- **Validation & structured errors** — bean validation with a global exception handler.
- **Interactive UI** — dashboard, employees, projects, allocations, reports, and AI views.

---

## Tech Stack

| Layer     | Technology                                                                 |
|-----------|-----------------------------------------------------------------------------|
| Backend   | Java 17, Spring Boot 3.3, Spring Web, Spring Data JPA, Bean Validation       |
| Database  | PostgreSQL 16 (H2 in-memory for tests)                                       |
| Build     | Maven (Spring Boot Maven Plugin)                                            |
| API Docs  | springdoc-openapi (Swagger UI)                                              |
| Frontend  | React 18, TypeScript, Vite 6, Tailwind CSS 4, Radix UI, Recharts, lucide    |
| Tooling   | Docker & Docker Compose, Postman, MSW (optional API mocking)               |

---

## Project Structure

```
Resource-Allocation-Management-System/
├── BE/                                   # Spring Boot backend
│   ├── src/main/java/com/example/rams/
│   │   ├── config/                       # CORS, OpenAPI/Swagger
│   │   ├── controller/                   # REST controllers
│   │   ├── dto/                          # Request/response records
│   │   ├── entity/                       # JPA entities (Employee, Project, Allocation)
│   │   ├── exception/                    # Custom exceptions + GlobalExceptionHandler
│   │   ├── repository/                   # Spring Data JPA repositories
│   │   └── service/                      # Business logic + mappers
│   ├── src/main/resources/
│   │   ├── application.yml                # App + datasource configuration
│   │   └── data.sql                      # Seed data
│   ├── src/test/java/...                 # Service unit tests
│   ├── sql/
│   │   ├── schema.sql                    # DDL (CREATE TABLE) script
│   │   └── reports.sql                   # Reference reporting queries
│   └── Dockerfile
├── Resource Allocation Management System root/   # React + Vite frontend
│   ├── src/
│   │   ├── app/                          # App shell + shadcn/ui components
│   │   ├── components/ui/                # Custom UI (AllocBar, Modal, StatCard, …)
│   │   ├── features/                     # dashboard, employees, projects,
│   │   │                                 #   allocations, reports, ai
│   │   ├── lib/ types/ data/ mocks/      # helpers, types, palettes, MSW mocks
│   │   └── main.tsx
│   └── package.json
├── postman/
│   └── Resource_Allocation_Management.postman_collection.json
├── docker-compose.yml                    # backend + PostgreSQL
├── RUN_GUIDE.md                          # concise run guide
└── README.md                             # this file
```

---

## Architecture

The backend follows a classic layered design (Controller → Service → Repository → DB):

```
        HTTP request
            │
            ▼
   ┌─────────────────┐    validation (@Valid on DTO records)
   │   Controller    │    thin, maps HTTP <-> service
   └────────┬────────┘
            ▼
   ┌─────────────────┐    business rules (allocation limit, project status),
   │    Service      │    transactions, logging, DTO <-> entity mapping
   └────────┬────────┘
            ▼
   ┌─────────────────┐    Spring Data JPA + JPQL aggregate queries
   │   Repository    │
   └────────┬────────┘
            ▼
      PostgreSQL (employee, project, allocation)
```

- **DTOs** are Java `record`s; requests are validated with Jakarta Bean Validation.
- **Mappers** (`EmployeeMapper`, `ProjectMapper`, `AllocationMapper`) keep entities and DTOs decoupled.
- **Cross-cutting concerns**: CORS (`CorsConfig`), OpenAPI metadata (`OpenApiConfig`), and a `@RestControllerAdvice` global exception handler.

The frontend is a single-page React app that talks to the backend over REST
(`VITE_API_BASE`, default `http://localhost:8081`) and gracefully falls back to
local state when the API is unreachable.

---

## Business Rules

All allocation rules are enforced in `AllocationService`:

1. **Allocation range** — `allocationPercent` must satisfy `0 < percent <= 100`
   (`@Min(1)`, `@Max(100)` on the request; also a DB `CHECK` constraint).
2. **Total ≤ 100%** — the sum of an employee's allocations across all projects
   cannot exceed 100%. On update, the allocation being edited is excluded from the
   sum. Violations throw `AllocationExceededException` → `400 Bad Request`.
3. **No allocation to completed projects** — allocating to a project with status
   `COMPLETED` throws `CompletedProjectAllocationException` → `400 Bad Request`.

Allocation create / update / remove operations are logged at `INFO` level.

---

## Data Model

Three tables: `employee`, `project`, and `allocation` (a join table carrying the
allocation percentage and project role).

```
┌────────────────────┐          ┌────────────────────┐
│      employee      │          │      project       │
├────────────────────┤          ├────────────────────┤
│ employee_id  (PK)  │          │ project_id   (PK)  │
│ employee_code (UQ) │          │ project_code (UQ)  │
│ full_name          │          │ project_name       │
│ email        (UQ)  │          │ customer           │
│ role               │          │ start_date         │
│ department         │          │ end_date           │
└─────────┬──────────┘          │ status (enum)      │
          │                     └─────────┬──────────┘
          │ 1                          1  │
          │                               │
          │        ┌───────────────────┐  │
          └───────<│    allocation     │>─┘
             N     ├───────────────────┤   N
                   │ allocation_id (PK)│
                   │ employee_id  (FK) │
                   │ project_id   (FK) │
                   │ allocation_percent│  CHECK 1..100
                   │ role_in_project   │
                   │ start_date        │
                   │ end_date          │
                   └───────────────────┘
```

- `project.status ∈ { PLANNING, ACTIVE, COMPLETED }`.
- Foreign keys use `ON DELETE CASCADE`; indexes exist on `allocation.employee_id`
  and `allocation.project_id`.
- Full DDL: [`BE/sql/schema.sql`](BE/sql/schema.sql). Hibernate can also
  create/update the schema automatically (`spring.jpa.hibernate.ddl-auto=update`).

---

## Getting Started

### Prerequisites

- **Java 17+** and **Maven 3.9+**
- **Node.js 20+** (npm, or pnpm if you prefer)
- **Docker Desktop** (recommended) — or a local PostgreSQL 16 instance

### 1. Run the backend + database with Docker (recommended)

From the repository root:

```bash
docker compose up -d --build
```

This starts:

| Service   | Container       | URL / Port                      |
|-----------|-----------------|---------------------------------|
| Backend   | `rams-backend`  | http://localhost:8081           |
| PostgreSQL| `rams-postgres` | localhost:5432                  |

Default database credentials (aligned across `docker-compose.yml` and `application.yml`):

```
Database: resource_allocation
Username: rams
Password: rams_password
```

To reset the database volume (this deletes local data):

```bash
docker compose down -v
docker compose up -d --build
```

### 2. Run the backend without Docker

Point Spring at a running PostgreSQL instance (via environment variables — see
[Configuration](#configuration)), then:

```bash
cd BE
mvn spring-boot:run
```

Backend runs at **http://localhost:8081**.

### 3. Run the frontend

```bash
cd "Resource Allocation Management System root"
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** (Vite default) and calls the backend at
`http://localhost:8081`. Backend CORS already allows ports `5173`/`5174`.

> Using pnpm instead? `pnpm install && pnpm dev` works too.

---

## Configuration

### Backend (environment variables)

| Variable                      | Default                                                     | Description             |
|-------------------------------|-------------------------------------------------------------|-------------------------|
| `SPRING_DATASOURCE_URL`       | `jdbc:postgresql://localhost:5432/resource_allocation`      | JDBC URL                |
| `SPRING_DATASOURCE_USERNAME`  | `rams`                                                      | DB user                 |
| `SPRING_DATASOURCE_PASSWORD`  | `rams_password`                                            | DB password             |
| `SERVER_PORT`                 | `8081`                                                     | HTTP port               |

### Frontend (`.env` in the frontend folder)

| Variable          | Default                   | Description                                    |
|-------------------|---------------------------|------------------------------------------------|
| `VITE_API_BASE`   | `http://localhost:8081`   | Backend base URL                               |
| `VITE_USE_MOCKS`  | `false`                   | Set to `true` to serve mock APIs via MSW in dev|

---

## API Reference

Base URL: `http://localhost:8081`

### Employees

| Method | Endpoint                    | Description                          |
|--------|-----------------------------|--------------------------------------|
| POST   | `/employees`                | Create an employee                   |
| GET    | `/employees`                | List all employees                   |
| GET    | `/employees/{id}`           | Get an employee by id                |
| GET    | `/employees/{id}/workload`  | Get an employee's workload           |

**Create employee** — `POST /employees`

```json
{
  "employeeCode": "EMP001",
  "fullName": "Tuan Ho Anh",
  "email": "tuanha@company.com",
  "role": "Senior Java Developer",
  "department": "FSOFT-Q1"
}
```

**Workload** — `GET /employees/1/workload`

```json
{
  "employeeId": 1,
  "employeeName": "Tuan Ho Anh",
  "totalAllocation": 80,
  "available": 20
}
```

### Projects

| Method | Endpoint            | Description             |
|--------|---------------------|-------------------------|
| POST   | `/projects`         | Create a project        |
| GET    | `/projects`         | List all projects       |
| GET    | `/projects/{id}`    | Get a project by id     |

**Create project** — `POST /projects`

```json
{
  "projectCode": "NCG",
  "projectName": "National Credit Guard",
  "customer": "NCG Corp",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "status": "ACTIVE"
}
```

### Allocations

| Method | Endpoint             | Description                            |
|--------|----------------------|----------------------------------------|
| POST   | `/allocations`       | Create an allocation (validates rules) |
| GET    | `/allocations`       | List all allocations                   |
| GET    | `/allocations/{id}`  | Get an allocation by id                |
| PUT    | `/allocations/{id}`  | Update an allocation                   |
| DELETE | `/allocations/{id}`  | Remove an allocation                   |

**Create allocation** — `POST /allocations`

```json
{
  "employeeId": 1,
  "projectId": 2,
  "allocationPercent": 50,
  "roleInProject": "Backend Developer",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31"
}
```

Exceeding 100% total returns `400 Bad Request`:

```json
{
  "timestamp": "2026-07-16T09:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Employee allocation exceeds 100%",
  "path": "/allocations"
}
```

### Reports

| Method | Endpoint                                   | Description                                   |
|--------|--------------------------------------------|-----------------------------------------------|
| GET    | `/reports/utilization`                     | Total allocation per employee                 |
| GET    | `/reports/available?minimumAvailable=50`   | Employees with remaining availability         |
| GET    | `/reports/overloaded`                      | Employees allocated > 90%                      |

### AI

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| POST   | `/ai/recommendations`  | Recommend available resources        |
| POST   | `/ai/risk-detection`   | Detect capacity risk for a need      |

See [AI Features](#ai-features) for request/response shapes.

---

## Reports

Reporting logic lives in `ReportService`; reference SQL is in
[`BE/sql/reports.sql`](BE/sql/reports.sql). All three reports use
`LEFT JOIN` + `GROUP BY` + `SUM` so employees with no allocations still appear.

**Employee utilization** — total allocation per employee.

```sql
SELECT e.employee_id, e.full_name, COALESCE(SUM(a.allocation_percent), 0) AS allocation
FROM employee e
LEFT JOIN allocation a ON a.employee_id = e.employee_id
GROUP BY e.employee_id, e.full_name
ORDER BY allocation DESC;
```

**Available resources** — employees with `total < 100%` (optionally filter by a
minimum free percentage via `?minimumAvailable=`).

**Overloaded employees** — employees with `total > 90%`.

---

## AI Features

The AI features are heuristic (rule-based) — no external LLM key required. They
operate over live allocation data. Served by `AiController`.

### Resource recommendation — `POST /ai/recommendations`

> "Find a Java Developer with at least 50% availability."

Request:

```json
{
  "roleKeyword": "Java Developer",
  "minimumAvailable": 50
}
```

Response — employees whose role matches the keyword and whose remaining
availability meets the minimum, sorted by most-available first:

```json
{
  "recommendedResources": [
    { "employeeId": 2, "employee": "Nguyen Van A", "available": 60 }
  ]
}
```

### Risk detection — `POST /ai/risk-detection`

> "Next sprint we need 2 more Java Developers."

Request (accepts `roleKeyword`/`role` and `neededCount`/`needed`):

```json
{
  "roleKeyword": "Java Developer",
  "neededCount": 2
}
```

Response — team utilization, how many matching people still have ≥50% free, the
matching resources, and any detected risks:

```json
{
  "teamUtilization": 92,
  "matchingAvailableResources": 1,
  "matchingResources": [
    { "employeeId": 2, "employee": "Nguyen Van A", "available": 60 }
  ],
  "risks": [
    "Not enough matching resources"
  ]
}
```

---

## Error Handling

A single `@RestControllerAdvice` (`GlobalExceptionHandler`) produces consistent
error payloads:

| Exception                                                     | HTTP status |
|---------------------------------------------------------------|-------------|
| `EmployeeNotFoundException`, `ProjectNotFoundException`, `AllocationNotFoundException` | `404 Not Found` |
| `AllocationExceededException`, `CompletedProjectAllocationException`, `DuplicateCodeException` | `400 Bad Request` |
| Bean validation (`MethodArgumentNotValidException`)           | `400 Bad Request` |
| Any other exception                                           | `500 Internal Server Error` |

Validation errors include a per-field map:

```json
{
  "timestamp": "2026-07-16T09:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/employees",
  "validationErrors": {
    "email": "must be a well-formed email address",
    "fullName": "must not be blank"
  }
}
```

Request validation constraints: `@NotBlank`, `@Email`, `@Size`, `@NotNull`,
`@Min(1)`, `@Max(100)`.

---

## Testing

Service-layer unit tests live under `BE/src/test/java` (using H2 in-memory DB and
Spring Boot Test). Run them with:

```bash
cd BE
mvn test
```

Covered: `AllocationServiceTest`, `EmployeeServiceTest`.

---

## API Docs & Postman

With the backend running:

- **Swagger UI** — http://localhost:8081/swagger-ui.html
- **OpenAPI JSON** — http://localhost:8081/v3/api-docs

**Postman** — import
[`postman/Resource_Allocation_Management.postman_collection.json`](postman/Resource_Allocation_Management.postman_collection.json).
The collection uses `{{baseUrl}} = http://localhost:8081`.

---

## Seed Data

On startup the backend loads [`BE/src/main/resources/data.sql`](BE/src/main/resources/data.sql)
(idempotent — uses `ON CONFLICT DO NOTHING`). It provides 5 employees, 4 projects
(including one `COMPLETED` project to demonstrate rule #3), and sample allocations —
e.g. `Pham Thi D` at 95% to exercise the overloaded report.

---

## Troubleshooting

- **Frontend can't reach the API** — confirm the backend is on `:8081` and that
  `VITE_API_BASE` matches. The UI falls back to local state when the API is down.
- **Database credentials changed** — recreate the Postgres volume:
  `docker compose down -v && docker compose up -d --build`.
- **Port already in use** — override `SERVER_PORT` (backend) or Vite's `--port`.
- **`Ambiguous mapping` at backend startup** — the AI endpoints are intended to be
  served only by `AiController`. If a duplicate `/ai/recommendations` or
  `/ai/risk-detection` handler also exists in `ReportController`, remove it so the
  context can start.

---

## Deliverables Checklist

| Deliverable                 | Location                                                        |
|-----------------------------|----------------------------------------------------------------|
| Source code (Git)           | this repository (`BE/`, `Resource Allocation Management System root/`) |
| SQL create-table script     | [`BE/sql/schema.sql`](BE/sql/schema.sql)                        |
| README                      | this file                                                      |
| Postman collection          | [`postman/`](postman/)                                          |
| API screenshots             | Swagger UI at `/swagger-ui.html`                               |
| AI features                 | `AiService` + `/ai/*` endpoints                                |
