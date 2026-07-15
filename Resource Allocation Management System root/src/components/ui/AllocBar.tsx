import { allocColor } from "../../lib/resource";

interface AllocBarProps {
  pct: number;
  size?: "sm" | "md";
}

export function AllocBar({ pct, size = "md" }: AllocBarProps) {
  const color = allocColor(pct);
  const h = size === "sm" ? "h-1" : "h-1.5";

  return (
    <div className={`flex items-center gap-2 ${size === "sm" ? "" : ""}`}>
      <div className={`flex-1 ${h} rounded-full bg-slate-100 overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(pct, 100)}%`, background: color }}
        />
      </div>
      <span
        className="font-mono text-xs font-bold tabular-nums shrink-0"
        style={{ color, minWidth: "2.5rem", textAlign: "right" }}
      >
        {pct}%
      </span>
    </div>
  );
}
