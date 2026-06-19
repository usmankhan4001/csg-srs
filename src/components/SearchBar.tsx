import { useEffect, useRef, useState } from "react";
import { search } from "../api";
import type { SearchHit } from "../types";

export default function SearchBar({
  product,
  onPick,
}: {
  product: string;
  onPick: (hit: SearchHit) => void;
}) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!q.trim()) {
      setHits([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setHits(await search(q, product));
        setOpen(true);
      } catch {
        /* ignore */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, product]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // group by part, ID matches float to top
  const idHits = hits.filter((h) => h.matchType === "id");
  const textHits = hits.filter((h) => h.matchType === "text");
  const grouped = new Map<string, SearchHit[]>();
  for (const h of textHits) {
    if (!grouped.has(h.part)) grouped.set(h.part, []);
    grouped.get(h.part)!.push(h);
  }

  const pick = (h: SearchHit) => {
    setOpen(false);
    setQ("");
    onPick(h);
  };

  return (
    <div className="relative w-full max-w-xl" ref={boxRef}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => hits.length && setOpen(true)}
        placeholder="Search requirements, IDs (LMS-FR-057), decisions, screens…"
        className="w-full px-3 py-1.5 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
      {open && (idHits.length > 0 || grouped.size > 0) && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-[60vh] overflow-auto text-sm">
          {idHits.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] uppercase tracking-wide text-slate-400 bg-slate-50">
                Exact ID match
              </div>
              {idHits.map((h) => (
                <button
                  key={h.id}
                  onClick={() => pick(h)}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 border-b border-slate-100"
                >
                  <span className="inline-block bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mr-2 align-middle">
                    ID
                  </span>
                  <span className="font-semibold">{h.heading}</span>
                  <div className="text-xs text-slate-500 truncate">
                    {h.part}
                  </div>
                </button>
              ))}
            </div>
          )}
          {[...grouped.entries()].map(([part, list]) => (
            <div key={part}>
              <div className="px-3 py-1 text-[11px] uppercase tracking-wide text-slate-400 bg-slate-50">
                {part}
              </div>
              {list.map((h) => (
                <button
                  key={h.id}
                  onClick={() => pick(h)}
                  className="w-full text-left px-3 py-2 hover:bg-indigo-50 border-b border-slate-100"
                >
                  <div className="font-semibold">{h.heading}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {h.snippet}
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
