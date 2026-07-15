export function initials(name: string) {
  const parts = name.split(" ");
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function allocColor(pct: number) {
  if (pct > 100) return "#DC2626";
  if (pct >= 91) return "#EF4444";
  if (pct >= 70) return "#F59E0B";
  return "#10B981";
}

export function allocLabel(pct: number) {
  if (pct > 100) return "Over 100%";
  if (pct >= 91) return "Overloaded";
  if (pct >= 70) return "High Load";
  if (pct > 0) return "Available";
  return "Free";
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function projectColor(key: string) {
  const palette = [
    "#4361EE",
    "#10B981",
    "#8B5CF6",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#EC4899",
    "#7C3AED",
    "#F97316",
    "#0EA5A4",
  ];
  if (!key) return palette[0];
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  const idx = Math.abs(h) % palette.length;
  return palette[idx];
}

import type { ProjectStatus } from "../types/resource";

export function normalizeProjectStatus(s?: string): ProjectStatus {
  const v = (s || "").toString().trim().toLowerCase();
  if (v === "active") return "Active";
  if (v === "planning" || v === "pending") return "Planning";
  if (v === "completed" || v === "complete") return "Completed";
  // fallback
  return "Active";
}
