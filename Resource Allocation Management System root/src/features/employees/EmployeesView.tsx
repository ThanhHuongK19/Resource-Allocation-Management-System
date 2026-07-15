import React from "react";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { AllocBar } from "../../components/ui/AllocBar";
import { DEPT_COLORS } from "../../data/deptColors";
import { allocColor, initials } from "../../lib/resource";
import type { Allocation, Employee, Project } from "../../types/resource";
import Pagination from "../../components/ui/Pagination";

interface EmployeesViewProps {
  employees: Employee[];
  projects: Project[];
  allocations: Allocation[];
  empSearch: string;
  setEmpSearch: (value: string) => void;
  filteredEmps: Employee[];
  totalAlloc: (id: string) => number;
  empAllocs: (id: string) => Allocation[];
  deleteEmployee: (id: string) => void;
  setShowAddEmp: (value: boolean) => void;
  onEditEmployee?: (id: string) => void;
}

export function EmployeesView({
  employees,
  projects,
  allocations,
  empSearch,
  setEmpSearch,
  filteredEmps,
  totalAlloc,
  empAllocs,
  deleteEmployee,
  setShowAddEmp,
  onEditEmployee,
}: EmployeesViewProps) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const totalPages = Math.max(1, Math.ceil(filteredEmps.length / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filteredEmps.slice(start, start + pageSize);
  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);
  return (
    <div className="w-full max-w-6xl mx-auto space-y-5">
      <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Employees</h2>
            <p className="text-sm text-slate-500">
              {employees.length} team members
            </p>
          </div>
          <button
            onClick={() => setShowAddEmp(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
          >
            <Plus size={14} />
            Add Employee
          </button>
        </div>

        <div className="relative mt-5">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={empSearch}
            onChange={(e) => setEmpSearch(e.target.value)}
            placeholder="Search by name, role, or department…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {[
                  "Employee",
                  "Role",
                  "Department",
                  "Allocation",
                  "Projects",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((emp, i) => {
                const t = totalAlloc(emp.id);
                const color = allocColor(t);
                const ea = empAllocs(emp.id);
                const deptColor = DEPT_COLORS[emp.department] || "#64748B";
                return (
                  <tr
                    key={emp.id}
                    className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors ${i === filteredEmps.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: color }}
                        >
                          {initials(emp.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 leading-snug">
                            {emp.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {emp.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                      {emp.role}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-md text-white"
                        style={{ background: deptColor }}
                      >
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 min-w-[140px]">
                      <AllocBar pct={t} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {ea.map((a) => {
                          const proj = projects.find(
                            (p) => p.id === a.projectId,
                          );
                          if (!proj) return null;
                          return (
                            <span
                              key={a.id}
                              className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold text-white"
                              style={{ background: proj.color }}
                              title={`${proj.name} — ${a.percentage}%`}
                            >
                              {proj.code}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEditEmployee && (
                          <button
                            onClick={() => onEditEmployee(emp.id)}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                            title="Edit employee"
                          >
                            <Edit size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteEmployee(emp.id)}
                          className="text-slate-200 hover:text-red-500 transition-colors"
                          title="Delete employee"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredEmps.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-400"
                  >
                    No employees match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden" />
        <div className="hidden md:block">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="text-sm text-slate-500">Show</div>
            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 border rounded"
              >
                {[5, 10, 20, 50].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="text-sm text-slate-500">per page</div>
            </div>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {filteredEmps.map((emp) => {
            const t = totalAlloc(emp.id);
            const color = allocColor(t);
            const ea = empAllocs(emp.id);
            const deptColor = DEPT_COLORS[emp.department] || "#64748B";
            return (
              <div key={emp.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: color }}
                    >
                      {initials(emp.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 truncate">
                        {emp.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate">
                        {emp.id}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="text-slate-200 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-600">{emp.role}</span>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-md text-white"
                    style={{ background: deptColor }}
                  >
                    {emp.department}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Allocation</span>
                    <span className="font-mono font-semibold text-slate-700">
                      {t}%
                    </span>
                  </div>
                  <AllocBar pct={t} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ea.length === 0 ? (
                    <span className="text-xs text-slate-400">
                      No active projects
                    </span>
                  ) : (
                    ea.map((a) => {
                      const proj = projects.find((p) => p.id === a.projectId);
                      if (!proj) return null;
                      return (
                        <span
                          key={a.id}
                          className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold text-white"
                          style={{ background: proj.color }}
                        >
                          {proj.code}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
          {filteredEmps.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-slate-400">
              No employees match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
