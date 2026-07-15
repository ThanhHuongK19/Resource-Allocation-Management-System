import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  Users,
  FolderKanban,
  Zap,
} from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { AllocBar } from "../../components/ui/AllocBar";
import { allocColor, initials } from "../../lib/resource";
import type { Allocation, Employee, Project } from "../../types/resource";

interface DashboardViewProps {
  employees: Employee[];
  projects: Project[];
  allocations: Allocation[];
  overloadedEmps: Employee[];
  availableEmps: Employee[];
  avgUtil: number;
  totalAlloc: (id: string) => number;
  empAllocs: (id: string) => Allocation[];
  projAllocs: (id: string) => Allocation[];
}

export function DashboardView({
  employees,
  projects,
  allocations,
  overloadedEmps,
  availableEmps,
  avgUtil,
  totalAlloc,
  empAllocs,
  projAllocs,
}: DashboardViewProps) {
  return (
    <div className="w-full p-6 lg:p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          label="Total Employees"
          value={employees.length}
          icon={Users}
          color="#4361EE"
          bg="#EEF2FF"
        />
        <StatCard
          label="Active Projects"
          value={projects.filter((p) => p.status === "Active").length}
          icon={FolderKanban}
          color="#10B981"
          bg="#ECFDF5"
        />
        <StatCard
          label="Overloaded (>90%)"
          value={overloadedEmps.length}
          icon={AlertTriangle}
          color="#EF4444"
          bg="#FEF2F2"
          sub={overloadedEmps.length > 0 ? "Action needed" : undefined}
        />
        <StatCard
          label="Avg Utilization"
          value={`${avgUtil}%`}
          icon={TrendingUp}
          color="#8B5CF6"
          bg="#F5F3FF"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden h-full">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-sm font-semibold text-slate-700">
              Overloaded &gt; 90%
            </span>
            <span className="ml-auto bg-red-50 text-red-600 text-xs font-mono px-2 py-0.5 rounded-full font-semibold">
              {overloadedEmps.length}
            </span>
          </div>
          <div className="p-5 space-y-4 min-h-[160px]">
            {overloadedEmps.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-sm text-slate-400">
                No overloaded employees
              </div>
            ) : (
              overloadedEmps.map((emp) => {
                const t = totalAlloc(emp.id);
                return (
                  <div key={emp.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {initials(emp.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-700 truncate">
                        {emp.name}
                      </div>
                      <AllocBar pct={t} size="sm" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden h-full">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span className="text-sm font-semibold text-slate-700">
              Available &lt; 100%
            </span>
            <span className="ml-auto bg-emerald-50 text-emerald-600 text-xs font-mono px-2 py-0.5 rounded-full font-semibold">
              {availableEmps.length}
            </span>
          </div>
          <div className="p-5 space-y-4 min-h-[160px]">
            {availableEmps.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-sm text-slate-400">
                All employees fully allocated
              </div>
            ) : (
              availableEmps.map((emp) => {
                const t = totalAlloc(emp.id);
                return (
                  <div key={emp.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {initials(emp.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium text-slate-700 truncate">
                          {emp.name}
                        </span>
                        <span className="text-xs text-emerald-600 font-mono font-semibold shrink-0 ml-2">
                          +{100 - t}% free
                        </span>
                      </div>
                      <AllocBar pct={t} size="sm" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-primary" />
            <span className="text-sm font-semibold text-slate-700">
              Team Utilization
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {[
              { color: "#10B981", label: "< 70%" },
              { color: "#F59E0B", label: "70–90%" },
              { color: "#EF4444", label: "> 90%" },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ background: color }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="p-6 sm:p-8 space-y-4">
          {employees.map((emp) => {
            const t = totalAlloc(emp.id);
            const color = allocColor(t);
            const ea = empAllocs(emp.id);
            return (
              <div
                key={emp.id}
                className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-4"
              >
                <div className="w-full sm:w-52 flex-shrink-0">
                  <div className="text-sm font-semibold text-slate-700 truncate">
                    {emp.name}
                  </div>
                  <div className="text-sm text-slate-500 truncate">
                    {emp.role}
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-2 h-6 relative w-full">
                  {ea.map((alloc) => {
                    const proj = projects.find((p) => p.id === alloc.projectId);
                    if (!proj) return null;
                    return (
                      <div
                        key={alloc.id}
                        className="h-5 rounded-sm flex items-center justify-center overflow-hidden"
                        style={{
                          width: `${alloc.percentage}%`,
                          background: proj.color,
                          minWidth: alloc.percentage >= 8 ? undefined : "0px",
                        }}
                        title={`${proj.code}: ${alloc.percentage}%`}
                      >
                        {alloc.percentage >= 12 && (
                          <span className="text-white text-[10px] font-bold font-mono">
                            {proj.code}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {t < 100 && (
                    <div
                      className="h-5 rounded-sm bg-slate-100"
                      style={{ width: `${100 - t}%` }}
                    />
                  )}
                </div>
                <span
                  className="font-mono text-sm font-bold w-12 text-right flex-shrink-0"
                  style={{ color }}
                >
                  {t}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
