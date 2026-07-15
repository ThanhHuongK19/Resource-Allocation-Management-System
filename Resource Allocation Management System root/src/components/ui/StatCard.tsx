import type { ElementType } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ElementType;
  color: string;
  bg: string;
  sub?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  sub,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow min-h-[96px] flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: bg }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {sub && (
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{ background: bg, color }}
          >
            {sub}
          </span>
        )}
      </div>
      <div className="font-mono text-3xl font-bold text-slate-800 mb-0">
        {value}
      </div>
      <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
