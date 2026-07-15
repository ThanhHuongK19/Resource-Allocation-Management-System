# Resource Allocation Management System - Run Guide

## 1. Requirements

- Java 17+
- Maven 3.9+
- Node.js 20+
- pnpm
- Docker Desktop, or a local PostgreSQL server

If `pnpm` is not recognized after installing Node.js, enable it through Corepack:

```bash
corepack enable
```

## 2. Start Backend + PostgreSQL With Docker

From the project root:

```bash
docker compose up -d --build
```

Default database settings:

```text
Database: resource_allocation
Username: rams
Password: rams_password
Port: 5432
```

Backend URL:

```text
http://localhost:8081
```

These values are already aligned between `docker-compose.yml` and `BE/src/main/resources/application.yml`.
If you previously started Docker with different credentials, recreate the Postgres volume or override the Spring datasource environment variables. Recreating the volume deletes local database data:

```bash
docker compose down -v
docker compose up -d
```

The create-table script is available at `BE/sql/schema.sql`. Spring Boot can also create/update tables automatically with `spring.jpa.hibernate.ddl-auto=update`.

## 3. Run Backend Without Docker

```bash
cd BE
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8081
```

Swagger UI:

```text
http://localhost:8081/swagger-ui.html
```

OpenAPI JSON:

```text
http://localhost:8081/v3/api-docs
```

## 4. Run Frontend

```bash
cd "FE/Resource Allocation Management System"
pnpm install
pnpm dev
```

Frontend URL:

```text
http://localhost:5173
```

If the API URL changes, create a `.env` file in the frontend folder:

```env
VITE_API_BASE_URL=http://localhost:8081
```

## 5. Postman

Import:

```text
postman/Resource_Allocation_Management.postman_collection.json
```

The collection uses `{{baseUrl}} = http://localhost:8081`.

## 6. Main API Checklist

- `POST /employees`
- `GET /employees`
- `GET /employees/{id}`
- `GET /employees/{id}/workload`
- `POST /projects`
- `GET /projects`
- `GET /projects/{id}`
- `POST /allocations`
- `PUT /allocations/{id}`
- `DELETE /allocations/{id}`
- `GET /reports/utilization`
- `GET /reports/available?minimumAvailable=50`
- `GET /reports/overloaded`
- `POST /ai/recommendations`
- `POST /ai/risk-detection`

## 7. Business Rules

- Allocation percent must be from 1 to 100.
- Total allocation for one employee cannot exceed 100%.
- Allocation to a `COMPLETED` project is rejected.
- Invalid inputs return structured validation errors.
