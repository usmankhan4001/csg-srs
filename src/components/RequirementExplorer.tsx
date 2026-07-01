import { useEffect, useMemo, useState } from "react";
import { fetchRequirements } from "../api";
import type { Requirement } from "../types";

type SortKey = keyof Pick<
  Requirement,
  "id" | "module" | "priority" | "statement" | "testCaseId"
>;

export default function RequirementExplorer({
  product,
  onOpenId,
  onOpenTestCase,
}: {
  product: string;
  onOpenId: (id: string) => void;
  onOpenTestCase: (tcId: string) => void;
}) {
  const [rows, setRows] = useState<Requirement[]>([]);
  const [q, setQ] = useState("");
  const [module, setModule] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({
    key: "id",
    dir: 1,
  });

  useEffect(() => {
    if (product) fetchRequirements(product).then(setRows);
  }, [product]);

  const modules = useMemo(
    () => [...new Set(rows.map((r) => r.module))].sort(),
    [rows]
  );
  const priorities = useMemo(
    () => [...new Set(rows.map((r) => r.priority).filter(Boolean))].sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    let out = rows.filter(
      (r) =>
        (module === "all" || r.module === module) &&
        (priority === "all" || r.priority === priority) &&
        (!ql ||
          r.id.toLowerCase().includes(ql) ||
          r.statement.toLowerCase().includes(ql) ||
          r.testCaseId.toLowerCase().includes(ql))
    );
    out = [...out].sort((a, b) => {
      const av = a[sort.key] || "";
      const bv = b[sort.key] || "";
      return (
        av.localeCompare(bv, undefined, { numeric: true }) * sort.dir
      );
    });
    return out;
  }, [rows, q, module, priority, sort]);

  const th = (key: SortKey, label: string) => (
    <th
      onClick={() =>
        setSort((s) =>
          s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }
        )
      }
      className="px-2 py-1.5 cursor-pointer select-none hover:bg-slate-200 whitespace-nowrap"
    >
      {label}
      {sort.key === key ? (sort.dir === 1 ? " ▲" : " ▼") : ""}
    </th>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 items-center bg-white dark:bg-[#1a1b1e]">
        <h2 className="font-bold text-base mr-2">
          Requirement Explorer{" "}
          <span className="text-slate-400 font-normal text-sm">
            ({filtered.length} of {rows.length})
          </span>
        </h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by ID, text, test case…"
          className="px-2 py-1 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded text-sm flex-1 min-w-[200px]"
        />
        <select
          value={module}
          onChange={(e) => setModule(e.target.value)}
          className="px-2 py-1 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded text-sm"
        >
          <option value="all">All modules</option>
          {modules.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-2 py-1 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded text-sm"
        >
          <option value="all">All priorities</option>
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-left text-slate-600 dark:text-slate-300 z-10">
            <tr>
              {th("id", "ID")}
              {th("module", "Module")}
              {th("priority", "Priority")}
              {th("statement", "Statement")}
              {th("testCaseId", "Test Case")}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 align-top">
                <td className="px-2 py-1.5 whitespace-nowrap">
                  <button
                    className="xlink"
                    onClick={() => onOpenId(r.id)}
                  >
                    {r.id}
                  </button>
                </td>
                <td className="px-2 py-1.5 whitespace-nowrap text-slate-600 dark:text-slate-300">
                  {r.module}
                </td>
                <td className="px-2 py-1.5">
                  <span
                    className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                      r.priority === "Must"
                        ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                        : r.priority === "Should"
                        ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {r.priority || "—"}
                  </span>
                </td>
                <td className="px-2 py-1.5">{r.statement}</td>
                <td className="px-2 py-1.5 whitespace-nowrap">
                  {r.testCaseId ? (
                    <button
                      className="xlink soft"
                      onClick={() => onOpenTestCase(r.testCaseId)}
                    >
                      {r.testCaseId}
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
