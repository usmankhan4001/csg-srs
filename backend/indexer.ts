import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..");
export const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : ROOT;

export const INDEX_DIR = path.join(ROOT, "index");
export const WIREFRAME_DIR = path.join(ROOT, "docs", "wireframes");

// The shared folder is available to every product.
export const SHARED_ROOT = "_Shared";

// Top-level folders that are NOT products (app code, build output, etc.).
const NON_PRODUCT = new Set([
  "node_modules", "index", "src", "backend", "docs", "dist", "build",
  "public", ".git", ".claude", ".vscode", SHARED_ROOT,
]);

export interface Product {
  id: string; // folder name, e.g. "P1_LMS_SMS"
  name: string; // prettified, e.g. "P1 LMS SMS"
}

// A product is any top-level dir (not in the denylist, not dotfile) that
// contains at least one .md file somewhere inside it.
export function discoverProducts(): Product[] {
  const out: Product[] = [];
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".") || NON_PRODUCT.has(entry.name)) continue;
    if (walk(path.join(ROOT, entry.name)).length === 0) continue;
    out.push({ id: entry.name, name: prettyName(entry.name) });
  }
  out.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  return out;
}

const prettyName = (s: string) => s.replace(/_/g, " ").trim();

// ---- ID extraction patterns ---------------------------------------------
const ID_PATTERNS: Record<string, RegExp> = {
  LMS_FR: /LMS-FR-\d+/g,
  LMS_NFR: /LMS-NFR-\d+/g,
  LMS_TR: /LMS-TR-\d+/g,
  DEC: /DEC-P1-\d+/g,
  BR: /BR-\d+/g,
  RISK: /RISK-[A-Z]+-\d+/g,
  SCR: /SCR-[A-Z]+-\d+/g,
  TC: /TC-[A-Z0-9]+-\d+/g,
};

const PREFERRED_SOURCE: Record<string, string[]> = {
  LMS_FR: ["Part_4_Functional"],
  LMS_NFR: ["Part_10_Non"],
  LMS_TR: ["Part_9_Tech"],
  DEC: ["Decision_Log"],
  BR: ["Part_3", "Part_4_Functional"],
  RISK: ["Risk_Register", "Part_16"],
  SCR: ["Wireframes_"],
  TC: ["Appendix_E"],
};

export interface ExtractedIds {
  LMS_FR: string[];
  LMS_NFR: string[];
  LMS_TR: string[];
  DEC: string[];
  BR: string[];
  RISK: string[];
  SCR: string[];
  TC: string[];
}

export interface Chunk {
  id: string;
  product: string; // owning product id, or "_Shared"
  file: string;
  fileName: string;
  filePath: string; // relative to repo root (posix)
  part: string;
  layer: string;
  heading: string;
  headingAnchor: string;
  content: string;
  searchText: string;
  hasDiagram: boolean;
  ids: ExtractedIds;
}

export interface RequirementRow {
  id: string;
  product: string;
  module: string;
  priority: string;
  statement: string;
  source: string;
  serviceComponent: string;
  screenPrefix: string;
  testCaseId: string;
  chunkId: string;
}

// id_lookup is scoped per product (each product includes its own + shared IDs)
export type IdLookup = Record<string, Record<string, string>>;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s—-]/g, "")
    .trim()
    .replace(/[\s—]+/g, "-")
    .replace(/-+/g, "-");

const prettyFileName = (fileName: string, h1: string) =>
  h1 ? h1.replace(/^#\s*/, "").trim() : fileName.replace(/\.md$/, "").replace(/_/g, " ");

function walk(dir: string, acc: string[] = []): string[] {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
      acc.push(full);
  }
  return acc;
}

function extractIds(text: string): ExtractedIds {
  const out: any = {};
  for (const [key, re] of Object.entries(ID_PATTERNS)) {
    const matches = text.match(re) || [];
    out[key] = [...new Set(matches)].sort();
  }
  return out as ExtractedIds;
}

function stripMermaid(text: string): { clean: string; count: number } {
  let count = 0;
  const clean = text.replace(/```mermaid[\s\S]*?```/g, () => {
    count++;
    return "[diagram]";
  });
  return { clean, count };
}

function chunkFile(filePath: string, product: string): Chunk[] {
  const raw = fs.readFileSync(filePath, "utf8");
  const relPath = path.relative(ROOT, filePath).split(path.sep).join("/");
  const fileName = path.basename(filePath);
  const layer = relPath.split("/")[1] || relPath.split("/")[0];
  const h1Match = raw.match(/^#\s+(.+)$/m);
  const part = prettyFileName(fileName, h1Match ? h1Match[0] : "");

  const lines = raw.split(/\r?\n/);
  type Seg = { heading: string; body: string[] };
  const segs: Seg[] = [];
  let current: Seg = { heading: "Overview", body: [] };
  for (const line of lines) {
    const m = line.match(/^##\s+(.+)$/);
    if (m) {
      if (current.body.length || current.heading !== "Overview") segs.push(current);
      current = { heading: m[1].trim(), body: [line] };
    } else current.body.push(line);
  }
  segs.push(current);

  const chunks: Chunk[] = [];
  let idx = 0;
  for (const seg of segs) {
    const content = seg.body.join("\n").trim();
    if (!content) continue;
    const { clean, count } = stripMermaid(content);
    chunks.push({
      id: `${relPath}#${idx}`,
      product,
      file: part,
      fileName,
      filePath: relPath,
      part,
      layer,
      heading: seg.heading,
      headingAnchor: slugify(seg.heading),
      content,
      searchText: clean,
      hasDiagram: count > 0,
      ids: extractIds(content),
    });
    idx++;
  }
  return chunks;
}

export function buildIndex() {
  const products = discoverProducts();
  const sharedFiles = walk(path.join(ROOT, SHARED_ROOT));

  const chunks: Chunk[] = [];
  // shared chunks (tagged _Shared) are included in every product
  const sharedChunks: Chunk[] = [];
  for (const f of sharedFiles.sort())
    sharedChunks.push(...chunkFile(f, SHARED_ROOT));
  chunks.push(...sharedChunks);

  const perProductChunks: Record<string, Chunk[]> = {};
  for (const p of products) {
    const files = walk(path.join(ROOT, p.id)).sort();
    const pc: Chunk[] = [];
    for (const f of files) pc.push(...chunkFile(f, p.id));
    perProductChunks[p.id] = pc;
    chunks.push(...pc);
  }

  const byId = new Map(chunks.map((c) => [c.id, c]));

  // ---- id_lookup per product (own chunks + shared) ----------------------
  const idLookup: IdLookup = {};
  const requirements: Record<string, RequirementRow[]> = {};

  for (const p of products) {
    const scope = [...perProductChunks[p.id], ...sharedChunks];
    idLookup[p.id] = buildIdLookup(scope);
    requirements[p.id] = buildRequirements(perProductChunks[p.id], idLookup[p.id], p.id);
  }

  fs.mkdirSync(INDEX_DIR, { recursive: true });
  fs.writeFileSync(path.join(INDEX_DIR, "products.json"), JSON.stringify(products));
  fs.writeFileSync(path.join(INDEX_DIR, "chunks.json"), JSON.stringify(chunks));
  fs.writeFileSync(path.join(INDEX_DIR, "id_lookup.json"), JSON.stringify(idLookup));
  fs.writeFileSync(path.join(INDEX_DIR, "requirements.json"), JSON.stringify(requirements));

  const reqCount = Object.values(requirements).reduce((n, r) => n + r.length, 0);
  console.log(
    `Indexed ${chunks.length} chunks across ${products.length} product(s) ` +
      `[${products.map((p) => p.id).join(", ")}] + ${SHARED_ROOT}. ` +
      `${reqCount} requirements.`
  );
  return { products, chunks, byId, idLookup, requirements };
}

function buildIdLookup(scope: Chunk[]): Record<string, string> {
  const candidates: Record<string, { chunkId: string; score: number }[]> = {};
  for (const chunk of scope) {
    for (const [type, ids] of Object.entries(chunk.ids)) {
      for (const id of ids as string[]) {
        const preferred = PREFERRED_SOURCE[type] || [];
        let score = 0;
        if (chunk.heading.includes(id)) score += 100;
        if (preferred.some((kw) => chunk.fileName.includes(kw))) score += 50;
        const freq = (chunk.content.match(new RegExp(id, "g")) || []).length;
        score += Math.min(freq, 10);
        (candidates[id] ||= []).push({ chunkId: chunk.id, score });
      }
    }
  }
  const lookup: Record<string, string> = {};
  for (const [id, cands] of Object.entries(candidates)) {
    cands.sort((a, b) => b.score - a.score);
    lookup[id] = cands[0].chunkId;
  }
  return lookup;
}

function buildRequirements(
  productChunks: Chunk[],
  idLookup: Record<string, string>,
  product: string
): RequirementRow[] {
  const part4 = productChunks.filter((c) => c.fileName.includes("Part_4_Functional"));
  const dMap: Record<
    string,
    { service: string; screenPrefix: string; testCaseId: string }
  > = {};
  const dText = productChunks
    .filter((c) => c.fileName.includes("Appendix_D_Traceability"))
    .map((c) => c.content)
    .join("\n");
  for (const line of dText.split(/\r?\n/)) {
    const m = line.match(
      /^\|\s*(LMS-FR-\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*(TC-[A-Z0-9]+-\d+)\s*\|/
    );
    if (m)
      dMap[m[1]] = {
        service: m[4].trim(),
        screenPrefix: m[5].trim(),
        testCaseId: m[6].trim(),
      };
  }

  const rows: RequirementRow[] = [];
  const seen = new Set<string>();
  for (const chunk of part4) {
    const module = /^M\d+/.test(chunk.heading) ? chunk.heading : "";
    for (const line of chunk.content.split(/\r?\n/)) {
      const m = line.match(
        /^\|\s*(LMS-FR-\d+)\s*\|\s*(.+?)\s*\|\s*(Must|Should|Could|Won't|May)\s*\|\s*([^|]*?)\s*\|/i
      );
      if (!m) continue;
      const id = m[1];
      if (seen.has(id)) continue;
      seen.add(id);
      const d = dMap[id] || { service: "", screenPrefix: "", testCaseId: "" };
      rows.push({
        id,
        product,
        module: module || "—",
        priority: m[3].trim(),
        statement: m[2].trim(),
        source: m[4].trim(),
        serviceComponent: d.service,
        screenPrefix: d.screenPrefix,
        testCaseId: d.testCaseId,
        chunkId: idLookup[id] || chunk.id,
      });
    }
  }
  for (const [id, d] of Object.entries(dMap)) {
    if (seen.has(id)) continue;
    seen.add(id);
    rows.push({
      id,
      product,
      module: "—",
      priority: "",
      statement: "",
      source: "",
      serviceComponent: d.service,
      screenPrefix: d.screenPrefix,
      testCaseId: d.testCaseId,
      chunkId: idLookup[id] || "",
    });
  }
  rows.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  return rows;
}

const invoked = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invoked && path.basename(invoked).startsWith("indexer")) {
  buildIndex();
}
