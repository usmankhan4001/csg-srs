import fs from "node:fs";
import path from "node:path";
// @ts-ignore - flexsearch ships loose types
import FlexSearch from "flexsearch";
import {
  buildIndex,
  discoverProducts,
  INDEX_DIR,
  ROOT,
  SHARED_ROOT,
  type Chunk,
  type RequirementRow,
  type Product,
  type IdLookup,
} from "./indexer.ts";

export interface Store {
  products: Product[];
  chunks: Chunk[];
  byId: Map<string, Chunk>;
  idLookup: IdLookup; // per product
  requirements: Record<string, RequirementRow[]>;
  search: Map<string, any>; // per-product FlexSearch.Document (own + shared)
}

let store: Store | null = null;

const ALL_ID_RE =
  /\b(?:LMS-FR-\d+|LMS-NFR-\d+|LMS-TR-\d+|DEC-P1-\d+|BR-\d+|RISK-[A-Z]+-\d+|SCR-[A-Z]+-\d+|TC-[A-Z0-9]+-\d+)\b/g;

export function extractMessageIds(text: string): string[] {
  return [...new Set(text.toUpperCase().match(ALL_ID_RE) || [])];
}

function buildSearchIndexes(store: Omit<Store, "search">): Map<string, any> {
  const indexes = new Map<string, any>();
  const shared = store.chunks.filter((c) => c.product === SHARED_ROOT);
  for (const p of store.products) {
    const idx = new FlexSearch.Document({
      document: {
        id: "id",
        index: [
          { field: "heading", tokenize: "forward" },
          { field: "searchText", tokenize: "forward" },
          { field: "part", tokenize: "forward" },
        ],
        store: true,
      },
      tokenize: "forward",
    });
    for (const c of store.chunks) if (c.product === p.id) idx.add(c);
    for (const c of shared) idx.add(c);
    indexes.set(p.id, idx);
  }
  return indexes;
}

export function getStore(): Store {
  if (store) return store;
  const chunksPath = path.join(INDEX_DIR, "chunks.json");
  let products: Product[];
  let chunks: Chunk[];
  let idLookup: IdLookup;
  let requirements: Record<string, RequirementRow[]>;

  if (fs.existsSync(chunksPath) && fs.existsSync(path.join(INDEX_DIR, "products.json"))) {
    products = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, "products.json"), "utf8"));
    chunks = JSON.parse(fs.readFileSync(chunksPath, "utf8"));
    idLookup = JSON.parse(fs.readFileSync(path.join(INDEX_DIR, "id_lookup.json"), "utf8"));
    requirements = JSON.parse(
      fs.readFileSync(path.join(INDEX_DIR, "requirements.json"), "utf8")
    );
    console.log(`Loaded ${chunks.length} chunks (${products.length} products) from index/.`);
  } else {
    const built = buildIndex();
    products = built.products;
    chunks = built.chunks;
    idLookup = built.idLookup;
    requirements = built.requirements;
  }

  const base = {
    products,
    chunks,
    byId: new Map(chunks.map((c) => [c.id, c])),
    idLookup,
    requirements,
  };
  store = { ...base, search: buildSearchIndexes(base) };
  return store;
}

// Rebuild the entire index from disk (after an edit) and refresh the store.
export function reindex(): Store {
  const built = buildIndex();
  const base = {
    products: built.products,
    chunks: built.chunks,
    byId: new Map(built.chunks.map((c) => [c.id, c])),
    idLookup: built.idLookup,
    requirements: built.requirements,
  };
  store = { ...base, search: buildSearchIndexes(base) };
  return store;
}

export function resolveProduct(p?: string): string {
  const s = getStore();
  if (p && s.products.some((x) => x.id === p)) return p;
  return s.products[0]?.id || "";
}

// ---- Search ------------------------------------------------------------
export interface SearchResult {
  chunk: Chunk;
  matchType: "id" | "text";
  score: number;
}

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

export function searchChunks(query: string, product: string, limit = 12): SearchResult[] {
  const s = getStore();
  const pid = resolveProduct(product);
  const idx = s.search.get(pid);
  const lookup = s.idLookup[pid] || {};
  const out: SearchResult[] = [];
  const used = new Set<string>();

  for (const id of extractMessageIds(query)) {
    const chunkId = lookup[id];
    if (chunkId && !used.has(chunkId)) {
      used.add(chunkId);
      out.push({ chunk: s.byId.get(chunkId)!, matchType: "id", score: 1000 });
    }
  }

  if (!idx) return out.slice(0, limit);

  const terms = queryTerms(query);
  const agg = new Map<string, { terms: Set<string>; score: number }>();
  const addHit = (id: string, term: string, weight: number) => {
    const rec = agg.get(id) || { terms: new Set<string>(), score: 0 };
    rec.terms.add(term);
    rec.score += weight;
    agg.set(id, rec);
  };
  const runSearch = (q: string, term: string) => {
    const res = idx.search(q, { limit: 60, enrich: true });
    for (const field of res as any[]) {
      const w = field.field === "heading" ? 4 : field.field === "part" ? 1 : 1.5;
      for (const item of field.result) addHit(item.id as string, term, w);
    }
  };

  if (terms.length) for (const t of terms) runSearch(t, t);
  else runSearch(query, query);

  const ranked = [...agg.entries()]
    .filter(([id]) => !used.has(id))
    .sort((a, b) => {
      const cov = b[1].terms.size - a[1].terms.size;
      return cov !== 0 ? cov : b[1].score - a[1].score;
    });
  for (const [id, rec] of ranked) {
    out.push({ chunk: s.byId.get(id)!, matchType: "text", score: rec.terms.size * 10 + rec.score });
    if (out.length >= limit) break;
  }
  return out.slice(0, limit);
}

// ---- Tree --------------------------------------------------------------
export interface TreeNode {
  name: string;
  path?: string;
  type: "dir" | "file";
  children?: TreeNode[];
  title?: string;
}

export function buildTree(product: string): TreeNode[] {
  const s = getStore();
  const pid = resolveProduct(product);
  const titleByPath = new Map<string, string>();
  for (const c of s.chunks) if (!titleByPath.has(c.filePath)) titleByPath.set(c.filePath, c.part);

  function walk(dir: string, relBase: string): TreeNode[] {
    const nodes: TreeNode[] = [];
    if (!fs.existsSync(dir)) return nodes;
    const entries = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => !e.name.startsWith("."));
    entries.sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    for (const e of entries) {
      const rel = relBase ? `${relBase}/${e.name}` : e.name;
      if (e.isDirectory()) {
        const children = walk(path.join(dir, e.name), rel);
        if (children.length) nodes.push({ name: e.name, type: "dir", children });
      } else if (e.name.toLowerCase().endsWith(".md")) {
        nodes.push({ name: e.name, path: rel, type: "file", title: titleByPath.get(rel) || e.name });
      }
    }
    return nodes;
  }

  const roots = [pid, SHARED_ROOT].filter((r) => fs.existsSync(path.join(ROOT, r)));
  return roots.map((r) => ({ name: r, type: "dir" as const, children: walk(path.join(ROOT, r), r) }));
}

// ---- File read/write ---------------------------------------------------
const validDocRoots = (): string[] => [
  ...getStore().products.map((p) => p.id),
  SHARED_ROOT,
];

function safeDocPath(relPath: string): string | null {
  const normalized = relPath.split("\\").join("/");
  const abs = path.resolve(ROOT, normalized);
  if (!abs.startsWith(ROOT)) return null;
  const top = normalized.split("/")[0];
  if (!validDocRoots().includes(top)) return null;
  if (!abs.toLowerCase().endsWith(".md")) return null;
  return abs;
}

export function readDocFile(relPath: string): string | null {
  const abs = safeDocPath(relPath);
  if (!abs || !fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, "utf8");
}

export function writeDocFile(relPath: string, content: string): { ok: boolean; abs?: string; error?: string } {
  const abs = safeDocPath(relPath);
  if (!abs) return { ok: false, error: "Invalid path" };
  if (!fs.existsSync(abs)) return { ok: false, error: "File does not exist" };
  fs.writeFileSync(abs, content, "utf8");
  return { ok: true, abs };
}
