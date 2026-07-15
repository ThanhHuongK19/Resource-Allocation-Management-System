import { useMemo, useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  ChevronRight,
  FolderKanban,
  GitBranch,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { normalizeProjectStatus } from "../lib/resource";
import { PROJECT_STATUSES } from "../types/resource";
import { Modal } from "../components/ui/Modal";
import { AllocBar } from "../components/ui/AllocBar";
import { DEPT_COLORS } from "../data/deptColors";
import { DashboardView } from "../features/dashboard/DashboardView";
import { EmployeesView } from "../features/employees/EmployeesView";
import { ProjectsView } from "../features/projects/ProjectsView";
import { AllocationsView } from "../features/allocations/AllocationsView";
import { ReportsView } from "../features/reports/ReportsView";
import {
  allocColor,
  allocLabel,
  initials,
  uid,
  projectColor,
} from "../lib/resource";
import type {
  Allocation,
  Employee,
  Project,
  ProjectStatus,
  ReportTab,
  View,
} from "../types/resource";

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [reportTab, setReportTab] = useState<ReportTab>("available");

  const [showAddEmp, setShowAddEmp] = useState(false);
  const [showAddProj, setShowAddProj] = useState(false);
  const [showAddAlloc, setShowAddAlloc] = useState(false);
  const [allocError, setAllocError] = useState("");

  const [newEmp, setNewEmp] = useState({
    name: "",
    role: "",
    department: "Engineering",
  });
  const [newProj, setNewProj] = useState({
    name: "",
    code: "",
    client: "",
    status: PROJECT_STATUSES[0] as ProjectStatus,
    color: "#4361EE",
  });
  const [newAlloc, setNewAlloc] = useState({
    employeeId: "",
    projectId: "",
    percentage: 20,
  });

  const [empSearch, setEmpSearch] = useState("");
  const [projSearch, setProjSearch] = useState("");
  const [allocSearch, setAllocSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalAlloc = (id: string) =>
    allocations
      .filter((a) => a.employeeId === id)
      .reduce((s, a) => s + a.percentage, 0);

  const empAllocs = (id: string) =>
    allocations.filter((a) => a.employeeId === id);
  const projAllocs = (id: string) =>
    allocations.filter((a) => a.projectId === id);

  const availableEmps = useMemo(
    () => employees.filter((e) => totalAlloc(e.id) < 100),
    [employees, allocations],
  );
  const overloadedEmps = useMemo(
    () => employees.filter((e) => totalAlloc(e.id) > 90),
    [employees, allocations],
  );
  const avgUtil = useMemo(() => {
    if (!employees.length) return 0;
    return Math.round(
      employees.reduce((s, e) => s + totalAlloc(e.id), 0) / employees.length,
    );
  }, [employees, allocations]);

  const addEmployee = () => {
    if (!newEmp.name.trim()) return;
    // create locally; edit feature removed
    setEmployees((p) => [...p, { id: uid(), ...newEmp }]);
    setNewEmp({ name: "", role: "", department: "Engineering" });
    setShowAddEmp(false);
  };

  const deleteEmployee = (id: string) => {
    setEmployees((p) => p.filter((e) => e.id !== id));
    setAllocations((p) => p.filter((a) => a.employeeId !== id));
  };

  const addProject = () => {
    if (!newProj.name.trim()) return;
    // create locally; edit feature removed
    setProjects((p) => [...p, { id: uid(), ...newProj }]);
    setNewProj({
      name: "",
      code: "",
      client: "",
      status: PROJECT_STATUSES[0] as ProjectStatus,
      color: "#4361EE",
    });
    setShowAddProj(false);
  };

  const deleteProject = (id: string) => {
    setProjects((p) => p.filter((pr) => pr.id !== id));
    setAllocations((p) => p.filter((a) => a.projectId !== id));
  };

  const addAllocation = () => {
    const { employeeId, projectId, percentage } = newAlloc;
    if (!employeeId || !projectId || percentage <= 0) return;
    const cur = totalAlloc(employeeId);
    // edit functionality removed — always create a new allocation
    if (
      allocations.find(
        (a) => a.employeeId === employeeId && a.projectId === projectId,
      )
    ) {
      setAllocError("Employee is already assigned to this project.");
      return;
    }
    if (cur + percentage > 100) {
      setAllocError(
        `Cannot add ${percentage}%. Current: ${cur}% — only ${100 - cur}% remaining.`,
      );
      return;
    }
    // create locally; consider POST /allocations to backend
    setAllocations((p) => [
      ...p,
      { id: uid(), employeeId, projectId, percentage },
    ]);
    setNewAlloc({ employeeId: "", projectId: "", percentage: 20 });
    setAllocError("");
    setShowAddAlloc(false);
  };

  // Load data from backend on mount
  useEffect(() => {
    async function load() {
      try {
        const API_BASE =
          import.meta.env.VITE_API_BASE || "http://localhost:8081";
        const [empRes, projRes, allocRes] = await Promise.all([
          fetch(`${API_BASE}/employees`),
          fetch(`${API_BASE}/projects`),
          fetch(`${API_BASE}/allocations`),
        ]);
        if (empRes.ok) {
          const empJson = await empRes.json();
          setEmployees(
            empJson.map((e: any) => ({
              id: String(e.id),
              name: e.fullName || e.name || "",
              role: e.role || "",
              department: e.department || "",
            })),
          );
        }
        if (projRes.ok) {
          const projJson = await projRes.json();
          setProjects(
            projJson.map((p: any) => ({
              id: String(p.id),
              name: p.projectName || p.name || "",
              code: p.projectCode || p.code || "",
              client: p.customer || p.client || "",
              status: normalizeProjectStatus(p.status),
              color:
                p.color ||
                projectColor(p.projectCode || p.code || p.projectName),
            })),
          );
        }
        if (allocRes.ok) {
          const allocJson = await allocRes.json();
          setAllocations(
            allocJson.map((a: any) => ({
              id: String(a.id),
              employeeId: String(a.employeeId),
              projectId: String(a.projectId),
              percentage: a.allocationPercent || a.percentage || 0,
            })),
          );
        }
      } catch (e) {
        // ignore network errors for now
        // console.error('Failed to load initial data', e);
      }
    }
    load();
  }, []);

  const deleteAllocation = (id: string) =>
    setAllocations((p) => p.filter((a) => a.id !== id));

  const filteredEmps = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(empSearch.toLowerCase()) ||
      e.role.toLowerCase().includes(empSearch.toLowerCase()) ||
      e.department.toLowerCase().includes(empSearch.toLowerCase()),
  );

  const filteredProjs = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(projSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(projSearch.toLowerCase()) ||
      p.client.toLowerCase().includes(projSearch.toLowerCase()),
  );

  const filteredAllocs = allocations.filter((a) => {
    const e = employees.find((x) => x.id === a.employeeId);
    const p = projects.find((x) => x.id === a.projectId);
    const q = allocSearch.toLowerCase();
    return (
      !q ||
      e?.name.toLowerCase().includes(q) ||
      p?.name.toLowerCase().includes(q) ||
      p?.code.toLowerCase().includes(q)
    );
  });

  const navItems: { id: View; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "employees", label: "Employees", icon: Users },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "allocations", label: "Allocations", icon: GitBranch },
    { id: "reports", label: "Reports", icon: BarChart2 },
  ];

  const allocFormEmployee = employees.find((e) => e.id === newAlloc.employeeId);
  const allocFormCurrent = allocFormEmployee
    ? totalAlloc(allocFormEmployee.id)
    : 0;
  const allocFormMax = 100 - allocFormCurrent;
  const allocFormWouldExceed = allocFormCurrent + newAlloc.percentage > 100;
  const allocFormAvailableProjects = projects.filter(
    (p) =>
      !allocations.find(
        (a) => a.employeeId === newAlloc.employeeId && a.projectId === p.id,
      ),
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background font-[Plus_Jakarta_Sans,sans-serif]">
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 lg:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:static lg:translate-x-0 lg:w-56 shrink-0 flex flex-col h-full ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#1E2A4A" }}
      >
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Activity size={14} className="text-white" />
            </div>
            <div>
              <div className="text-white text-sm font-bold leading-none">
                RAMS
              </div>
              <div className="text-white/40 text-[10px] font-medium mt-0.5">
                Resource Allocation
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = view === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setView(id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  active
                    ? "bg-primary text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                <Icon size={15} />
                {label}
                {id === "reports" && overloadedEmps.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-mono w-5 h-5 rounded-full flex items-center justify-center">
                    {overloadedEmps.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/5 space-y-2">
          <div className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-2">
            Quick Stats
          </div>
          {[
            { label: "Employees", value: employees.length },
            {
              label: "Projects",
              value: projects.filter((p) => p.status === "Active").length,
            },
            { label: "Overloaded", value: overloadedEmps.length },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-white/40 text-xs">{label}</span>
              <span className="text-white/80 text-xs font-mono font-bold">
                {value}
              </span>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="shrink-0 bg-white border-b border-slate-100 px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
                <span>RAMS</span>
                <ChevronRight size={11} />
                <span className="capitalize">{view}</span>
              </div>
              <h1 className="text-base font-bold text-slate-800 capitalize leading-none truncate">
                {view === "dashboard" ? "Overview" : view}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400">Avg Utilization</div>
              <div
                className="font-mono text-sm font-bold"
                style={{ color: allocColor(avgUtil) }}
              >
                {avgUtil}%
              </div>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "#4361EE" }}
            >
              RM
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {view === "dashboard" && (
              <DashboardView
                employees={employees}
                projects={projects}
                allocations={allocations}
                overloadedEmps={overloadedEmps}
                availableEmps={availableEmps}
                avgUtil={avgUtil}
                totalAlloc={totalAlloc}
                empAllocs={empAllocs}
                projAllocs={projAllocs}
              />
            )}

            {view === "employees" && (
              <EmployeesView
                employees={employees}
                projects={projects}
                allocations={allocations}
                empSearch={empSearch}
                setEmpSearch={setEmpSearch}
                filteredEmps={filteredEmps}
                totalAlloc={totalAlloc}
                empAllocs={empAllocs}
                deleteEmployee={deleteEmployee}
                setShowAddEmp={setShowAddEmp}
              />
            )}

            {view === "projects" && (
              <ProjectsView
                projects={projects}
                employees={employees}
                projSearch={projSearch}
                setProjSearch={setProjSearch}
                filteredProjs={filteredProjs}
                projAllocs={projAllocs}
                deleteProject={deleteProject}
                setShowAddProj={setShowAddProj}
              />
            )}

            {view === "allocations" && (
              <AllocationsView
                allocations={allocations}
                employees={employees}
                projects={projects}
                allocSearch={allocSearch}
                setAllocSearch={setAllocSearch}
                filteredAllocs={filteredAllocs}
                totalAlloc={totalAlloc}
                deleteAllocation={deleteAllocation}
                setShowAddAlloc={setShowAddAlloc}
              />
            )}

            {view === "reports" && (
              <ReportsView
                availableEmps={availableEmps}
                overloadedEmps={overloadedEmps}
                employees={employees}
                projects={projects}
                reportTab={reportTab}
                setReportTab={setReportTab}
                totalAlloc={totalAlloc}
                empAllocs={empAllocs}
              />
            )}
          </div>
        </div>
      </main>

      {showAddEmp && (
        <Modal title="Add Employee" onClose={() => setShowAddEmp(false)}>
          <div className="space-y-4">
            {[
              {
                label: "Full Name",
                key: "name",
                placeholder: "e.g. Nguyen Van An",
              },
              {
                label: "Role / Title",
                key: "role",
                placeholder: "e.g. Senior Developer",
              },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  {label}
                </label>
                <input
                  value={(newEmp as Record<string, string>)[key]}
                  onChange={(e) =>
                    setNewEmp((p) => ({ ...p, [key]: e.target.value }))
                  }
                  placeholder={placeholder}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Department
              </label>
              <select
                value={newEmp.department}
                onChange={(e) =>
                  setNewEmp((p) => ({ ...p, department: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                {Object.keys(DEPT_COLORS).map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddEmp(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addEmployee}
                disabled={!newEmp.name.trim()}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Employee
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showAddProj && (
        <Modal title="Add Project" onClose={() => setShowAddProj(false)}>
          <div className="space-y-4">
            {[
              {
                label: "Project Name",
                key: "name",
                placeholder: "e.g. Payment Gateway Revamp",
              },
              { label: "Code / Alias", key: "code", placeholder: "e.g. PGREV" },
              { label: "Client", key: "client", placeholder: "e.g. Acme Corp" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  {label}
                </label>
                <input
                  value={(newProj as Record<string, string>)[key]}
                  onChange={(e) =>
                    setNewProj((p) => ({ ...p, [key]: e.target.value }))
                  }
                  placeholder={placeholder}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Status
                </label>
                <select
                  value={newProj.status}
                  onChange={(e) =>
                    setNewProj((p) => ({
                      ...p,
                      status: e.target.value as ProjectStatus,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                >
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Color
                </label>
                <input
                  type="color"
                  value={newProj.color}
                  onChange={(e) =>
                    setNewProj((p) => ({ ...p, color: e.target.value }))
                  }
                  className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer bg-slate-50 px-1"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddProj(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addProject}
                disabled={!newProj.name.trim()}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add Project
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showAddAlloc && (
        <Modal
          title="Assign Resource to Project"
          onClose={() => {
            setShowAddAlloc(false);
            setAllocError("");
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Employee
              </label>
              <select
                value={newAlloc.employeeId}
                onChange={(e) =>
                  setNewAlloc((p) => ({
                    ...p,
                    employeeId: e.target.value,
                    projectId: "",
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="">Select employee…</option>
                {employees.map((e) => {
                  const t = totalAlloc(e.id);
                  const avail = 100 - t;
                  return (
                    <option key={e.id} value={e.id} disabled={avail <= 0}>
                      {e.name} — {t}% allocated (
                      {avail > 0 ? `+${avail}% free` : "FULL"})
                    </option>
                  );
                })}
              </select>
            </div>

            {newAlloc.employeeId && (
              <div className="bg-slate-50 rounded-lg px-4 py-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>Current allocation</span>
                  <span
                    className="font-mono font-bold"
                    style={{ color: allocColor(allocFormCurrent) }}
                  >
                    {allocFormCurrent}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(allocFormCurrent + newAlloc.percentage, 100)}%`,
                      background: allocFormWouldExceed ? "#EF4444" : "#4361EE",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>After: {allocFormCurrent + newAlloc.percentage}%</span>
                  <span>Max: 100%</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Project
              </label>
              <select
                value={newAlloc.projectId}
                onChange={(e) =>
                  setNewAlloc((p) => ({ ...p, projectId: e.target.value }))
                }
                disabled={!newAlloc.employeeId}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
              >
                <option value="">Select project…</option>
                {allocFormAvailableProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Allocation %{" "}
                <span className="text-slate-400 normal-case font-normal">
                  (max {allocFormMax}%)
                </span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={Math.max(allocFormMax, 1)}
                  value={newAlloc.percentage}
                  onChange={(e) =>
                    setNewAlloc((p) => ({
                      ...p,
                      percentage: Number(e.target.value),
                    }))
                  }
                  className="flex-1 accent-primary"
                />
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newAlloc.percentage}
                    onChange={(e) =>
                      setNewAlloc((p) => ({
                        ...p,
                        percentage: Number(e.target.value),
                      }))
                    }
                    className="w-16 px-2 py-2 text-sm font-mono font-bold text-center text-slate-800 bg-slate-50 border-none focus:outline-none"
                  />
                  <span className="pr-2.5 text-sm text-slate-500 font-mono">
                    %
                  </span>
                </div>
              </div>
            </div>

            {allocError && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 flex items-start gap-2.5 text-sm text-red-700">
                <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                {allocError}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  setShowAddAlloc(false);
                  setAllocError("");
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addAllocation}
                disabled={
                  !newAlloc.employeeId ||
                  !newAlloc.projectId ||
                  allocFormWouldExceed
                }
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Assign
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
