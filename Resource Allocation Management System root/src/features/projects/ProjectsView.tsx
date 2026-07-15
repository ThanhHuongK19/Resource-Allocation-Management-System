import { Plus, Search, Trash2, Edit } from "lucide-react";
import type { Allocation, Employee, Project } from "../../types/resource";

interface ProjectsViewProps {
  projects: Project[];
  employees: Employee[];
  projSearch: string;
  setProjSearch: (value: string) => void;
  filteredProjs: Project[];
  projAllocs: (id: string) => Allocation[];
  deleteProject: (id: string) => void;
  setShowAddProj: (value: boolean) => void;
  onEditProject?: (id: string) => void;
}

export function ProjectsView({
  projects,
  employees,
  projSearch,
  setProjSearch,
  filteredProjs,
  projAllocs,
  deleteProject,
  setShowAddProj,
  onEditProject,
}: ProjectsViewProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-5">
      <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Projects</h2>
            <p className="text-sm text-slate-500">
              {projects.length} tracked,{" "}
              {projects.filter((p) => p.status === "Active").length} active
            </p>
          </div>
          <button
            onClick={() => setShowAddProj(true)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
          >
            <Plus size={14} />
            Add Project
          </button>
        </div>

        <div className="relative mt-5">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={projSearch}
            onChange={(e) => setProjSearch(e.target.value)}
            placeholder="Search by name, code, or client…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">
        {filteredProjs.map((proj) => {
          const pa = projAllocs(proj.id);
          const uniqueEmps = [...new Set(pa.map((a) => a.employeeId))];
          const totalCap = pa.reduce((s, a) => s + a.percentage, 0);
          return (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-bold font-mono tracking-tight"
                    style={{ background: proj.color }}
                  >
                    {proj.code.slice(0, 4)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{proj.name}</div>
                    <div className="text-xs text-slate-500">{proj.client}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${proj.status === "Active" ? "bg-emerald-50 text-emerald-600" : proj.status === "Planning" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    {proj.status}
                  </span>
                  {onEditProject && (
                    <button
                      onClick={() => onEditProject(proj.id)}
                      className="text-slate-400 hover:text-slate-700 transition-colors ml-1"
                      title="Edit project"
                    >
                      <Edit size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="text-slate-200 hover:text-red-500 transition-colors ml-1"
                    title="Delete project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                    Team Size
                  </div>
                  <div className="font-mono text-xl font-bold text-slate-800 mt-0.5">
                    {uniqueEmps.length}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                    Total Capacity
                  </div>
                  <div className="font-mono text-xl font-bold text-slate-800 mt-0.5">
                    {totalCap}%
                  </div>
                </div>
              </div>

              {pa.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {pa.map((a) => {
                    const emp = employees.find((e) => e.id === a.employeeId);
                    if (!emp) return null;
                    return (
                      <span
                        key={a.id}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono"
                      >
                        {emp.name.split(" ").slice(-1)[0]} · {a.percentage}%
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {filteredProjs.length === 0 && (
          <div className="xl:col-span-2 text-center py-16 text-slate-400 text-sm">
            No projects match your search.
          </div>
        )}
      </div>
    </div>
  );
}
