import { AlertTriangle, CheckCircle2, UserCheck } from "lucide-react";
import { AllocBar } from "../../components/ui/AllocBar";
import { allocColor, allocLabel, initials } from "../../lib/resource";
import type {
  Allocation,
  Employee,
  Project,
  ReportTab,
} from "../../types/resource";

interface ReportsViewProps {
  availableEmps: Employee[];
  overloadedEmps: Employee[];
  employees: Employee[];
  projects: Project[];
  reportTab: ReportTab;
  setReportTab: (value: ReportTab) => void;
  totalAlloc: (id: string) => number;
  empAllocs: (id: string) => Allocation[];
}

export function ReportsView({
  availableEmps,
  overloadedEmps,
  employees,
  projects,
  reportTab,
  setReportTab,
  totalAlloc,
  empAllocs,
}: ReportsViewProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-5">
      <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm sm:p-6 lg:p-8">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Reports</h2>
          <p className="text-sm text-slate-500">
            Resource utilization analysis
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-1 bg-white border border-slate-100 p-1 rounded-xl w-full sm:w-fit shadow-sm">
          {[
            {
              id: "available" as const,
              label: "Available Resources",
              icon: UserCheck,
              color: "#10B981",
            },
            {
              id: "overloaded" as const,
              label: "Overloaded Employees",
              icon: AlertTriangle,
              color: "#EF4444",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto ${reportTab === tab.id ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:text-slate-700"}`}
            >
              <tab.icon size={13} />
              {tab.label}
              <span
                className="font-mono text-xs px-1.5 py-0.5 rounded-full"
                style={
                  reportTab === tab.id
                    ? { background: "rgba(255,255,255,0.15)", color: "white" }
                    : {
                        background:
                          tab.id === "available" ? "#ECFDF5" : "#FEF2F2",
                        color: tab.color,
                      }
                }
              >
                {tab.id === "available"
                  ? availableEmps.length
                  : overloadedEmps.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {reportTab === "available" && (
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 text-sm text-emerald-700 flex items-center gap-3">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>
              <strong>
                {availableEmps.length} employee
                {availableEmps.length !== 1 ? "s" : ""}
              </strong>{" "}
              have capacity available for new project assignments (total
              allocation &lt; 100%).
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {[
                      "Employee",
                      "Role",
                      "Current Alloc",
                      "Available Capacity",
                      "Active Projects",
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
                  {availableEmps
                    .sort((a, b) => totalAlloc(a.id) - totalAlloc(b.id))
                    .map((emp, i) => {
                      const t = totalAlloc(emp.id);
                      const avail = 100 - t;
                      const ea = empAllocs(emp.id);
                      return (
                        <tr
                          key={emp.id}
                          className={`border-b border-slate-50 hover:bg-emerald-50/20 ${i === availableEmps.length - 1 ? "border-b-0" : ""}`}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">
                                {initials(emp.name)}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800">
                                  {emp.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {emp.department}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-600">
                            {emp.role}
                          </td>
                          <td className="px-5 py-4">
                            <div className="w-28">
                              <AllocBar pct={t} />
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-mono text-base font-bold text-emerald-600">
                              +{avail}%
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1 flex-wrap">
                              {ea.length === 0 ? (
                                <span className="text-xs text-slate-400">
                                  Unassigned
                                </span>
                              ) : (
                                ea.map((a) => {
                                  const proj = projects.find(
                                    (p) => p.id === a.projectId,
                                  );
                                  if (!proj) return null;
                                  return (
                                    <span
                                      key={a.id}
                                      className="text-[10px] font-mono font-bold text-white px-1.5 py-0.5 rounded"
                                      style={{ background: proj.color }}
                                    >
                                      {proj.code}
                                    </span>
                                  );
                                })
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-slate-100">
              {availableEmps
                .sort((a, b) => totalAlloc(a.id) - totalAlloc(b.id))
                .map((emp) => {
                  const t = totalAlloc(emp.id);
                  const avail = 100 - t;
                  const ea = empAllocs(emp.id);
                  return (
                    <div key={emp.id} className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {initials(emp.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 truncate">
                            {emp.name}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            {emp.role}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Current alloc</span>
                          <span className="font-mono font-semibold text-slate-700">
                            {t}%
                          </span>
                        </div>
                        <AllocBar pct={t} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          Available capacity
                        </span>
                        <span className="font-mono font-bold text-emerald-600">
                          +{avail}%
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ea.length === 0 ? (
                          <span className="text-xs text-slate-400">
                            Unassigned
                          </span>
                        ) : (
                          ea.map((a) => {
                            const proj = projects.find(
                              (p) => p.id === a.projectId,
                            );
                            if (!proj) return null;
                            return (
                              <span
                                key={a.id}
                                className="text-[10px] font-mono font-bold text-white px-1.5 py-0.5 rounded"
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
            </div>
          </div>
        </div>
      )}

      {reportTab === "overloaded" && (
        <div className="space-y-3">
          <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-sm text-red-700 flex items-center gap-3">
            <AlertTriangle size={16} className="shrink-0" />
            <span>
              <strong>
                {overloadedEmps.length} employee
                {overloadedEmps.length !== 1 ? "s" : ""}
              </strong>{" "}
              are overloaded with total allocation exceeding 90%. Review and
              rebalance assignments.
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {[
                      "Employee",
                      "Role",
                      "Total Alloc",
                      "Load Level",
                      "Project Breakdown",
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
                  {overloadedEmps
                    .sort((a, b) => totalAlloc(b.id) - totalAlloc(a.id))
                    .map((emp, i) => {
                      const t = totalAlloc(emp.id);
                      const ea = empAllocs(emp.id);
                      const label = allocLabel(t);
                      const color = allocColor(t);
                      return (
                        <tr
                          key={emp.id}
                          className={`border-b border-slate-50 hover:bg-red-50/20 ${i === overloadedEmps.length - 1 ? "border-b-0" : ""}`}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0">
                                {initials(emp.name)}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800">
                                  {emp.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {emp.department}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-600">
                            {emp.role}
                          </td>
                          <td className="px-5 py-4">
                            <div className="w-28">
                              <AllocBar pct={t} />
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className="text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ background: color + "20", color }}
                            >
                              {label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-1 flex-wrap">
                              {ea.map((a) => {
                                const proj = projects.find(
                                  (p) => p.id === a.projectId,
                                );
                                if (!proj) return null;
                                return (
                                  <span
                                    key={a.id}
                                    className="text-[10px] font-mono px-2 py-0.5 rounded-md"
                                    style={{
                                      background: proj.color + "20",
                                      color: proj.color,
                                    }}
                                  >
                                    {proj.code} {a.percentage}%
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  {overloadedEmps.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <div className="text-sm text-slate-500">
                          No overloaded employees — great job!
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-slate-100">
              {overloadedEmps
                .sort((a, b) => totalAlloc(b.id) - totalAlloc(a.id))
                .map((emp) => {
                  const t = totalAlloc(emp.id);
                  const ea = empAllocs(emp.id);
                  const label = allocLabel(t);
                  const color = allocColor(t);
                  return (
                    <div key={emp.id} className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0">
                          {initials(emp.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 truncate">
                            {emp.name}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            {emp.role}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Load level</span>
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: color + "20", color }}
                        >
                          {label}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Total alloc</span>
                          <span className="font-mono font-semibold text-slate-700">
                            {t}%
                          </span>
                        </div>
                        <AllocBar pct={t} />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ea.map((a) => {
                          const proj = projects.find(
                            (p) => p.id === a.projectId,
                          );
                          if (!proj) return null;
                          return (
                            <span
                              key={a.id}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md"
                              style={{
                                background: proj.color + "20",
                                color: proj.color,
                              }}
                            >
                              {proj.code} {a.percentage}%
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              {overloadedEmps.length === 0 && (
                <div className="px-5 py-16 text-center text-sm text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  No overloaded employees — great job!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
