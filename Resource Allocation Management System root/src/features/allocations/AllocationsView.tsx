import { Plus, Search, Trash2, Edit } from "lucide-react";
import { AllocBar } from "../../components/ui/AllocBar";
import { allocColor, allocLabel, initials } from "../../lib/resource";
import type { Allocation, Employee, Project } from "../../types/resource";

interface AllocationsViewProps {
  allocations: Allocation[];
  employees: Employee[];
  projects: Project[];
  allocSearch: string;
  setAllocSearch: (value: string) => void;
  filteredAllocs: Allocation[];
  totalAlloc: (id: string) => number;
  deleteAllocation: (id: string) => void;
  setShowAddAlloc: (value: boolean) => void;
  onEditAllocation?: (id: string) => void;
}

export function AllocationsView({
  allocations,
  employees,
  projects,
  allocSearch,
  setAllocSearch,
  filteredAllocs,
  totalAlloc,
  deleteAllocation,
  setShowAddAlloc,
  onEditAllocation,
}: AllocationsViewProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-5">
      <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Allocations</h2>
            <p className="text-sm text-slate-500">
              {allocations.length} active assignments
            </p>
          </div>
          <button
            onClick={() => {
              setShowAddAlloc(true);
            }}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
          >
            <Plus size={14} />
            Assign Resource
          </button>
        </div>

        <div className="relative mt-5">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={allocSearch}
            onChange={(e) => setAllocSearch(e.target.value)}
            placeholder="Search by employee or project…"
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
                  "Project",
                  "Alloc %",
                  "Employee Total",
                  "Status",
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
              {filteredAllocs.map((alloc, i) => {
                const emp = employees.find((e) => e.id === alloc.employeeId);
                const proj = projects.find((p) => p.id === alloc.projectId);
                if (!emp || !proj) return null;
                const empTotal = totalAlloc(emp.id);
                const color = allocColor(empTotal);
                const label = allocLabel(empTotal);
                return (
                  <tr
                    key={alloc.id}
                    className={`border-b border-slate-50 hover:bg-blue-50/20 transition-colors ${i === filteredAllocs.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: color }}
                        >
                          {initials(emp.name)}
                        </div>
                        <span className="font-semibold text-slate-700">
                          {emp.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                          style={{ background: proj.color }}
                        >
                          <span className="text-white text-[9px] font-bold">
                            {proj.code[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-slate-700 font-medium leading-snug">
                            {proj.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {proj.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-base font-bold text-slate-800">
                        {alloc.percentage}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 min-w-[140px]">
                      <AllocBar pct={empTotal} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: color + "20", color }}
                      >
                        {label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEditAllocation && (
                          <button
                            onClick={() => onEditAllocation(alloc.id)}
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                            title="Edit allocation"
                          >
                            <Edit size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteAllocation(alloc.id)}
                          className="text-slate-200 hover:text-red-500 transition-colors"
                          title="Delete allocation"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredAllocs.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-400"
                  >
                    No allocations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {filteredAllocs.map((alloc) => {
            const emp = employees.find((e) => e.id === alloc.employeeId);
            const proj = projects.find((p) => p.id === alloc.projectId);
            if (!emp || !proj) return null;
            const empTotal = totalAlloc(emp.id);
            const color = allocColor(empTotal);
            const label = allocLabel(empTotal);
            return (
              <div key={alloc.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: color }}
                    >
                      {initials(emp.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-700 truncate">
                        {emp.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate">
                        {proj.name}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAllocation(alloc.id)}
                    className="text-slate-200 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: color + "20", color }}
                  >
                    {label}
                  </span>
                  <span className="text-sm font-mono font-semibold text-slate-700">
                    {alloc.percentage}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Employee total</span>
                    <span className="font-mono font-semibold text-slate-700">
                      {empTotal}%
                    </span>
                  </div>
                  <AllocBar pct={empTotal} />
                </div>
              </div>
            );
          })}
          {filteredAllocs.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-slate-400">
              No allocations found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
