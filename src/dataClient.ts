// Client-side data layer. Loads a per-product "bundle" (tree + file contents +
// search chunks + id lookup + requirements) and answers all read operations
// locally, so the app works fully offline once a product has been loaded. The
// bundle response is cached by the service worker for offline use.
// @ts-ignore - flexsearch ships loose types
import FlexSearch from "flexsearch";
import type { TreeNode, SearchHit, LookupResult, Requirement } from "./types";

interface BundleChunk {
  id: string;
  product: string;
  filePath: string;
  part: string;
  heading: string;
  headingAnchor: string;
  searchText: string;
}
interface Bundle {
  product: string;
  productName: string;
  tree: TreeNode[];
  files: Record<string, string>;
  chunks: BundleChunk[];
  idLookup: Record<string, string>;
  requirements: Requirement[];
}

interface Active {
  product: string;
  bundle: Bundle;
  byId: Map<string, BundleChunk>;
  search: any;
}

const cache = new Map<string, Active>();
let active: Active | null = null;

const STOP = new Set([
  "the","and","for","are","was","what","which","who","whom","whose","how","why",
  "when","where","list","show","tell","give","all","any","item","items","this",
  "that","these","those","with","from","into","have","has","had","does","did",
  "can","will","shall","about","there","their","them","they","you","your","our",
  "its","his","her","out","get","set","use","used","per","via","see","explain",
  "describe","summary","summarize","overview","please","need","want","find",
]);
function queryTerms(q: string): string[] {
  const raw = (q.toLowerCase().match(/[a-z0-9][a-z0-9-]{1,}/g) || []).filter(
    (t) => t.length >= 3 && !STOP.has(t)
  );
  return [...new Set(raw)];
}

const ALL_ID_RE =
  /\b(?:LMS-FR-\d+|LMS-NFR-\d+|LMS-TR-\d+|DEC-P1-\d+|BR-\d+|RISK-[A-Z]+-\d+|SCR-[A-Z]+-\d+|TC-[A-Z0-9]+-\d+)\b/g;

function buildActive(bundle: Bundle): Active {
  const search = new FlexSearch.Document({
    document: {
      id: "id",
      index: [
        { field: "heading", tokenize: "forward" },
        { field: "searchText", tokenize: "forward" },
        { field: "part", tokenize: "forward" },
      ],
      store: false,
    },
    tokenize: "forward",
  });
  for (const c of bundle.chunks) search.add(c);
  return { product: bundle.product, bundle, byId: new Map(bundle.chunks.map((c) => [c.id, c])), search };
}

export async function ensureProduct(product: string): Promise<Active> {
  if (active && active.product === product) return active;
  if (cache.has(product)) {
    active = cache.get(product)!;
    return active;
  }
  const res = await fetch(`/api/bundle?product=${encodeURIComponent(product)}`);
  if (!res.ok) throw new Error("Could not load product data");
  const bundle: Bundle = await res.json();
  const a = buildActive(bundle);
  cache.set(product, a);
  active = a;
  return a;
}

// Drop cached bundles (e.g. after a save) so the next read refetches.
export function invalidateBundles() {
  cache.clear();
  active = null;
}

export function getTree(): TreeNode[] {
  return active?.bundle.tree || [];
}

export function getFile(path: string): string | null {
  return active?.bundle.files[path] ?? null;
}

export function getRequirements(): Requirement[] {
  return active?.bundle.requirements || [];
}

export function clientLookup(id: string): LookupResult | null {
  if (!active) return null;
  const chunkId = active.bundle.idLookup[id.toUpperCase()];
  if (!chunkId) return null;
  const c = active.byId.get(chunkId);
  if (!c) return null;
  return {
    id: id.toUpperCase(),
    chunkId,
    filePath: c.filePath,
    heading: c.heading,
    headingAnchor: c.headingAnchor,
    part: c.part,
  };
}

export function clientSearch(query: string, limit = 20): SearchHit[] {
  if (!active) return [];
  const out: SearchHit[] = [];
  const used = new Set<string>();

  // exact IDs first
  for (const id of new Set(query.toUpperCase().match(ALL_ID_RE) || [])) {
    const cid = active.bundle.idLookup[id];
    if (cid && !used.has(cid)) {
      used.add(cid);
      const c = active.byId.get(cid)!;
      out.push(hit(c, "id"));
    }
  }

  const terms = queryTerms(query);
  const agg = new Map<string, { terms: Set<string>; score: number }>();
  const add = (id: string, term: string, w: number) => {
    const r = agg.get(id) || { terms: new Set<string>(), score: 0 };
    r.terms.add(term);
    r.score += w;
    agg.set(id, r);
  };
  const run = (q: string, term: string) => {
    const res = active!.search.search(q, { limit: 60, enrich: false });
    for (const field of res as any[]) {
      const w = field.field === "heading" ? 4 : field.field === "part" ? 1 : 1.5;
      for (const id of field.result) add(id as string, term, w);
    }
  };
  if (terms.length) for (const t of terms) run(t, t);
  else run(query, query);

  const ranked = [...agg.entries()]
    .filter(([id]) => !used.has(id))
    .sort((a, b) => b[1].terms.size - a[1].terms.size || b[1].score - a[1].score);
  for (const [id] of ranked) {
    const c = active.byId.get(id);
    if (c) out.push(hit(c, "text"));
    if (out.length >= limit) break;
  }
  return out.slice(0, limit);
}

function hit(c: BundleChunk, matchType: "id" | "text"): SearchHit {
  return {
    id: c.id,
    filePath: c.filePath,
    part: c.part,
    heading: c.heading,
    headingAnchor: c.headingAnchor,
    matchType,
    snippet: c.searchText.slice(0, 220),
  };
}
