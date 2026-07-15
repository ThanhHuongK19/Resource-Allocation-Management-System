import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

export function RiskView() {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081";
  const [role, setRole] = useState("");
  const [needed, setNeeded] = useState<number>(2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/ai/risk-detection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleKeyword: role, neededCount: needed }),
      });
      const text = await res.text();
      if (!res.ok) {
        setError(text || `Server returned ${res.status}`);
        return;
      }
      const json = text ? JSON.parse(text) : null;
      setResult(json);
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="text-emerald-600 p-2 rounded bg-emerald-50">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              AI Risk Detection
            </h2>
            <p className="text-sm text-slate-500">
              Analyze team risk for upcoming needs.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-600 mb-1">
              Role keyword
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Java Developer"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">
              Needed count
            </label>
            <input
              type="number"
              value={needed}
              onChange={(e) => setNeeded(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800"
              min={1}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={submit}
            disabled={loading || !role.trim()}
            className="px-4 py-2 rounded bg-amber-500 text-white font-semibold disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Detect Risk"}
          </button>
        </div>

        {error && <div className="mt-4 text-red-600">Error: {error}</div>}

        {result && (
          <div className="mt-4 bg-slate-50 p-4 rounded">
            <div className="text-sm text-slate-600">
              Team utilization (avg):
            </div>
            <div className="font-bold text-xl mt-1">
              {result.teamUtilization}%
            </div>
            <div className="mt-3 text-sm text-slate-600">
              Matching available resources (≥50%):
            </div>
            <div className="font-mono font-semibold">
              {result.matchingAvailableResources}
            </div>
            {result.matchingResources &&
              result.matchingResources.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm text-slate-600">
                    Matching resources:
                  </div>
                  <ul className="list-disc ml-5 mt-1 text-sm text-slate-700">
                    {result.matchingResources.map((r: any) => (
                      <li key={r.employeeId}>
                        {r.employee} — available: {r.available}%
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            <div className="mt-3 text-sm text-slate-600">Risks:</div>
            {result.risks && result.risks.length ? (
              <ul className="list-disc ml-5 mt-1 text-sm text-slate-700">
                {result.risks.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-slate-700 mt-1">
                No immediate risks detected.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
