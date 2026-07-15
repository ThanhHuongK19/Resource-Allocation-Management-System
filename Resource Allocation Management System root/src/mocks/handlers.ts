import { rest } from "msw";

// Mock data derived from BE/src/main/resources/data.sql
const employees = [
  {
    id: 1,
    employeeCode: "EMP001",
    fullName: "Tuan Ho Anh",
    email: "tuanha@company.com",
    role: "Senior Java Developer",
    department: "FSOFT-Q1",
  },
  {
    id: 2,
    employeeCode: "EMP002",
    fullName: "Nguyen Van A",
    email: "nguyenvana@company.com",
    role: "Java Developer",
    department: "FSOFT-Q1",
  },
  {
    id: 3,
    employeeCode: "EMP003",
    fullName: "Tran Thi B",
    email: "tranthib@company.com",
    role: "Frontend Developer",
    department: "FSOFT-Q2",
  },
  {
    id: 4,
    employeeCode: "EMP004",
    fullName: "Le Van C",
    email: "levanc@company.com",
    role: "QA Engineer",
    department: "FSOFT-QA",
  },
  {
    id: 5,
    employeeCode: "EMP005",
    fullName: "Pham Thi D",
    email: "phamthid@company.com",
    role: "Project Manager",
    department: "PMO",
  },
];

const projects = [
  {
    id: 1,
    projectCode: "NCG",
    projectName: "National Credit Guard",
    customer: "NCG Corp",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "ACTIVE",
  },
  {
    id: 2,
    projectCode: "GRID",
    projectName: "Grid Infrastructure",
    customer: "Grid Solutions Ltd",
    startDate: "2026-02-01",
    endDate: "2026-10-31",
    status: "ACTIVE",
  },
  {
    id: 3,
    projectCode: "AI-INT",
    projectName: "Internal AI Tools",
    customer: "Internal",
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    status: "PLANNING",
  },
  {
    id: 4,
    projectCode: "LEGACY",
    projectName: "Legacy Migration",
    customer: "Acme Corp",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "COMPLETED",
  },
];

let allocations = [
  {
    id: 1,
    employeeId: employees.find((e) => e.employeeCode === "EMP001")!.id,
    employeeCode: "EMP001",
    employeeName: "Tuan Ho Anh",
    projectId: projects.find((p) => p.projectCode === "NCG")!.id,
    projectCode: "NCG",
    projectName: "National Credit Guard",
    allocationPercent: 50,
    roleInProject: "Backend Developer",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },
  {
    id: 2,
    employeeId: employees.find((e) => e.employeeCode === "EMP001")!.id,
    employeeCode: "EMP001",
    employeeName: "Tuan Ho Anh",
    projectId: projects.find((p) => p.projectCode === "GRID")!.id,
    projectCode: "GRID",
    projectName: "Grid Infrastructure",
    allocationPercent: 30,
    roleInProject: "Backend Developer",
    startDate: "2026-02-01",
    endDate: "2026-10-31",
  },
  {
    id: 3,
    employeeId: employees.find((e) => e.employeeCode === "EMP002")!.id,
    employeeCode: "EMP002",
    employeeName: "Nguyen Van A",
    projectId: projects.find((p) => p.projectCode === "NCG")!.id,
    projectCode: "NCG",
    projectName: "National Credit Guard",
    allocationPercent: 40,
    roleInProject: "Java Developer",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },
  {
    id: 4,
    employeeId: employees.find((e) => e.employeeCode === "EMP003")!.id,
    employeeCode: "EMP003",
    employeeName: "Tran Thi B",
    projectId: projects.find((p) => p.projectCode === "GRID")!.id,
    projectCode: "GRID",
    projectName: "Grid Infrastructure",
    allocationPercent: 80,
    roleInProject: "Frontend Developer",
    startDate: "2026-02-01",
    endDate: "2026-10-31",
  },
  {
    id: 5,
    employeeId: employees.find((e) => e.employeeCode === "EMP004")!.id,
    employeeCode: "EMP004",
    employeeName: "Le Van C",
    projectId: projects.find((p) => p.projectCode === "AI-INT")!.id,
    projectCode: "AI-INT",
    projectName: "Internal AI Tools",
    allocationPercent: 60,
    roleInProject: "QA Engineer",
    startDate: "2026-03-01",
    endDate: "2026-09-30",
  },
  {
    id: 6,
    employeeId: employees.find((e) => e.employeeCode === "EMP005")!.id,
    employeeCode: "EMP005",
    employeeName: "Pham Thi D",
    projectId: projects.find((p) => p.projectCode === "NCG")!.id,
    projectCode: "NCG",
    projectName: "National Credit Guard",
    allocationPercent: 95,
    roleInProject: "Project Manager",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
  },
];

export const handlers = [
  // Employees
  rest.get("/employees", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(employees));
  }),

  rest.get("/employees/:id", (req, res, ctx) => {
    const { id } = req.params;
    const found = employees.find((e) => String(e.id) === String(id));
    if (!found) return res(ctx.status(404), ctx.json({ message: "Not found" }));
    return res(ctx.status(200), ctx.json(found));
  }),

  rest.post("/employees", async (req, res, ctx) => {
    const body = await req.json();
    const nextId = employees.length + 1;
    const created = {
      id: nextId,
      employeeCode: body.employeeCode || `EMP-${nextId}`,
      fullName: body.fullName || "New Employee",
      email: body.email || `user${nextId}@example.com`,
      role: body.role || "Unknown",
      department: body.department || "Unknown",
    };
    employees.push(created);
    return res(ctx.status(201), ctx.json(created));
  }),

  // Projects
  rest.get("/projects", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(projects));
  }),

  rest.get("/projects/:id", (req, res, ctx) => {
    const { id } = req.params;
    const found = projects.find((p) => String(p.id) === String(id));
    if (!found) return res(ctx.status(404), ctx.json({ message: "Not found" }));
    return res(ctx.status(200), ctx.json(found));
  }),

  rest.post("/projects", async (req, res, ctx) => {
    const body = await req.json();
    const nextId = projects.length + 1;
    const created = {
      id: nextId,
      projectCode: body.projectCode || `P-${nextId}`,
      projectName: body.projectName || "New Project",
      customer: body.customer || "Unknown",
      startDate: body.startDate || null,
      endDate: body.endDate || null,
      status: body.status || "Planning",
    };
    projects.push(created);
    return res(ctx.status(201), ctx.json(created));
  }),

  // Allocations
  rest.get("/allocations", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(allocations));
  }),

  rest.get("/allocations/:id", (req, res, ctx) => {
    const { id } = req.params;
    const found = allocations.find((a) => String(a.id) === String(id));
    if (!found) return res(ctx.status(404), ctx.json({ message: "Not found" }));
    return res(ctx.status(200), ctx.json(found));
  }),

  rest.post("/allocations", async (req, res, ctx) => {
    const body = await req.json();
    const nextId = allocations.length + 1;
    const created = {
      id: nextId,
      employeeId: body.employeeId,
      employeeCode: body.employeeCode || `EMP-${body.employeeId}`,
      employeeName: body.employeeName || "Unknown",
      projectId: body.projectId,
      projectCode: body.projectCode || `P-${body.projectId}`,
      projectName: body.projectName || "Unknown",
      allocationPercent: body.allocationPercent || body.percentage || 0,
      roleInProject: body.roleInProject || "Developer",
      startDate: body.startDate || null,
      endDate: body.endDate || null,
    };
    allocations.push(created);
    return res(ctx.status(201), ctx.json(created));
  }),

  rest.put("/allocations/:id", async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();
    const idx = allocations.findIndex((a) => String(a.id) === String(id));
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ message: "Not found" }));
    allocations[idx] = { ...allocations[idx], ...body };
    return res(ctx.status(200), ctx.json(allocations[idx]));
  }),

  rest.delete("/allocations/:id", (req, res, ctx) => {
    const { id } = req.params;
    allocations = allocations.filter((a) => String(a.id) !== String(id));
    return res(ctx.status(204));
  }),

  // Reports
  rest.get("/reports/utilization", (req, res, ctx) => {
    const util = employees.map((emp) => ({
      employeeId: emp.id,
      employeeCode: emp.employeeCode,
      employeeName: emp.fullName,
      role: emp.role,
      department: emp.department,
      allocation: allocations
        .filter((a) => a.employeeId === emp.id)
        .reduce((s, x) => s + (x.allocationPercent || 0), 0),
    }));
    return res(ctx.status(200), ctx.json(util));
  }),

  rest.get("/reports/available", (req, res, ctx) => {
    const minimum = Number(req.url.searchParams.get("minimumAvailable")) || 0;
    const avail = employees
      .map((emp) => {
        const total = allocations
          .filter((a) => a.employeeId === emp.id)
          .reduce((s, x) => s + (x.allocationPercent || 0), 0);
        const available = Math.max(0, 100 - total);
        return {
          employeeId: emp.id,
          employeeCode: emp.employeeCode,
          employeeName: emp.fullName,
          role: emp.role,
          department: emp.department,
          allocation: total,
          available,
        };
      })
      .filter((r) => r.available >= minimum);
    return res(ctx.status(200), ctx.json(avail));
  }),

  rest.get("/reports/overloaded", (req, res, ctx) => {
    const overloaded = employees
      .map((emp) => ({
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        employeeName: emp.fullName,
        role: emp.role,
        department: emp.department,
        allocation: allocations
          .filter((a) => a.employeeId === emp.id)
          .reduce((s, x) => s + (x.allocationPercent || 0), 0),
      }))
      .filter((r) => r.allocation > 100);
    return res(ctx.status(200), ctx.json(overloaded));
  }),

  rest.post("/ai/recommendations", async (req, res, ctx) => {
    const body = await req.json();
    const recommended = employees
      .filter((emp) =>
        emp.role.toLowerCase().includes((body.roleKeyword || "").toLowerCase()),
      )
      .map((emp) => ({
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        employeeName: emp.fullName,
        role: emp.role,
        department: emp.department,
        allocation: allocations
          .filter((a) => a.employeeId === emp.id)
          .reduce((s, x) => s + (x.allocationPercent || 0), 0),
        available: Math.max(
          0,
          100 -
            allocations
              .filter((a) => a.employeeId === emp.id)
              .reduce((s, x) => s + (x.allocationPercent || 0), 0),
        ),
      }))
      .filter((r) => r.available >= (body.minimumAvailable || 1));
    return res(
      ctx.status(200),
      ctx.json({ recommendedResources: recommended }),
    );
  }),

  rest.post("/ai/risk-detection", async (req, res, ctx) => {
    const body = await req.json();
    const matching = employees.filter((emp) =>
      emp.role.toLowerCase().includes((body.roleKeyword || "").toLowerCase()),
    );
    const teamUtil = matching.reduce(
      (s, emp) =>
        s +
        allocations
          .filter((a) => a.employeeId === emp.id)
          .reduce((x, y) => x + (y.allocationPercent || 0), 0),
      0,
    );
    const risks = [];
    if (matching.length < body.neededCount)
      risks.push("Not enough matching resources");
    if (teamUtil < body.neededCount * 100) risks.push("Team utilization low");
    return res(
      ctx.status(200),
      ctx.json({
        teamUtilization: teamUtil,
        matchingAvailableResources: matching.length,
        risks,
      }),
    );
  }),
];
