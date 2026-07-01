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
// contains at least one .md file somewhere inside it. Products live under
// DATA_DIR (the persistent content root), not ROOT (the app code checkout).
export function discoverProducts(): Product[] {
  const out: Product[] = [];
  for (const entry of fs.readdirSync(DATA_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith(".") || NON_PRODUCT.has(entry.name)) continue;
    if (walk(path.join(DATA_DIR, entry.name)).length === 0) continue;
    out.push({ id: entry.name, name: prettyName(entry.name) });
  }
  out.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  return out;
}

// When DATA_DIR is a separate persistent volume (production), seed it once
// from the content baked into the ROOT checkout, and make sure it's its own
// git repo so file history/versioning is tracked where the content actually
// lives. No-op (and safe to call repeatedly) once DATA_DIR is populated.
export function ensureDataDir(): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (DATA_DIR === ROOT) return; // local dev / simple deploys: nothing to seed

  const candidates = [SHARED_ROOT, ...topLevelProductCandidates(ROOT)];
  for (const name of candidates) {
    const src = path.join(ROOT, name);
    const dest = path.join(DATA_DIR, name);
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.cpSync(src, dest, { recursive: true });
    }
  }

  if (!fs.existsSync(path.join(DATA_DIR, ".gitignore"))) {
    fs.writeFileSync(
      path.join(DATA_DIR, ".gitignore"),
      "comments/\nusers.json\nlocks.json\n"
    );
  }
}

// Same rule as discoverProducts(): a real product dir has an .md file in it
// somewhere. This keeps runtime/scratch dirs (comments/, stray html, etc.)
// out of the seed step.
function topLevelProductCandidates(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (e) =>
        e.isDirectory() &&
        !e.name.startsWith(".") &&
        !NON_PRODUCT.has(e.name) &&
        walk(path.join(dir, e.name)).length > 0
    )
    .map((e) => e.name);
}

const prettyName = (s: string) => s.replace(/_/g, " ").trim();

// ---- ID extraction patterns ---------------------------------------------
// Generalized across products: each product prefixes its requirement/risk/
// decision/screen IDs differently (P1: LMS-FR-001, RISK-AI-001, DEC-P1-001;
// P2: AI-FR-001, AI-BR-014, DEC-P2-001, SCR-P2-001; P3: AIC-FR-001,
// AIC-RISK-001, DEC-AIC-0001). These patterns key off the category keyword
// (FR/NFR/TR/BR/RISK/SCR/TC/DEC/etc.) with a flexible product-prefix, rather
// than hard-coding one product's exact convention, so a new product's docs
// get working cross-links without touching this file.
const ID_PATTERNS: Record<string, RegExp> = {
  FR: /[A-Z]{2,6}-FR-\d+/g,
  NFR: /[A-Z]{2,6}-NFR-\d+/g,
  TR: /[A-Z]{2,6}-TR-\d+/g,
  UIR: /[A-Z]{2,6}-UIR-\d+/g,
  DEC: /DEC-[A-Z0-9]+-\d+/g,
  // bare "BR-005" (P1), prefixed "AI-BR-014" (P2), or category-first
  // "BR-AIC-008" (P3) — one pattern, no overlap between the alternatives
  BR: /(?:(?:[A-Z]{2,6}-)?BR-\d+|BR-[A-Z]{2,6}-\d+)/g,
  // "RISK-AI-001" (P1, category-first) or "AIC-RISK-001" (P3, product-first)
  RISK: /(?:RISK-[A-Z]+-\d+|[A-Z]{2,6}-RISK-\d+)/g,
  SCR: /SCR-[A-Z0-9]+-\d+/g,
  TC: /TC-[A-Z0-9]+-\d+/g,
  // Layer-1 strategy identifiers seen in P3 (objectives/KPIs/assumptions/
  // constraints/dependencies/drivers), e.g. OBJ-AIC-01, KPI-AIC-05
  REF: /(?:OBJ|KPI|ASM|CON|DEP|DRV)-[A-Z]{2,6}-\d+/g,
};

const PREFERRED_SOURCE: Record<string, string[]> = {
  FR: ["Part_4_Functional", "Part4"],
  NFR: ["Part_10_Non", "Part10"],
  TR: ["Part_9_Tech", "Part9"],
  DEC: ["Decision_Log"],
  BR: ["Part_3", "Part_4_Functional", "Part3", "Part4"],
  RISK: ["Risk_Register", "Part_16", "Part16"],
  SCR: ["Wireframes_", "Part7", "Part_7"],
  TC: ["Appendix_E"],
};

export interface ExtractedIds {
  FR: string[];
  NFR: string[];
  TR: string[];
  UIR: string[];
  DEC: string[];
  BR: string[];
  RISK: string[];
  SCR: string[];
  TC: string[];
  REF: string[];
}

export interface Chunk {
  id: string;
  product: string; // owning product id, or "_Shared"
  file: string;
  fileName: string;
  filePath: string; // relative to repo root (posix)
  part: string; // display title, disambiguated with a module qualifier when
  // multiple files in the product share the same H1 (see disambiguateParts)
  partGroup: string; // the pre-disambiguation base title — stable grouping
  // key for the sidebar tree's virtual "Part N" folders on flat products
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
  const relPath = path.relative(DATA_DIR, filePath).split(path.sep).join("/");
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
      partGroup: part, // overwritten by disambiguateParts() if this H1 repeats
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
  ensureDataDir();
  const products = discoverProducts();
  const sharedFiles = walk(path.join(DATA_DIR, SHARED_ROOT));

  const chunks: Chunk[] = [];
  // shared chunks (tagged _Shared) are included in every product
  const sharedChunks: Chunk[] = [];
  for (const f of sharedFiles.sort())
    sharedChunks.push(...chunkFile(f, SHARED_ROOT));
  chunks.push(...sharedChunks);

  const perProductChunks: Record<string, Chunk[]> = {};
  for (const p of products) {
    const files = walk(path.join(DATA_DIR, p.id)).sort();
    const pc: Chunk[] = [];
    for (const f of files) pc.push(...chunkFile(f, p.id));
    disambiguateParts(pc);
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

// Turn a filename into a readable module label when the chunk's own heading
// doesn't carry one (P1 keeps one module per "## M01 — ..." heading; P2/P3
// spread each module across its own file with generic sub-headings like
// "## Requirement List", so the filename is the only thing that names it).
export function moduleFromFileName(fileName: string): string {
  let s = fileName.replace(/\.md$/i, "").replace(/_v\d+(\.\d+)?$/i, "");
  const stop = new Set([
    "master", "srs", "part", "p1", "p2", "p3", "p4", "lms", "sms", "aic",
  ]);
  const parts = s
    .split(/_+/)
    .filter(Boolean)
    .filter((p) => !stop.has(p.toLowerCase()) && !/^part\d*$/i.test(p) && !/^\d+$/.test(p));
  return parts
    .join(" ")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // AIArchitecture -> AI Architecture
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // TutorEngine -> Tutor Engine
    .trim();
}

// P1 has one file per "Part", so its H1 (e.g. "PART 4 — FUNCTIONAL
// REQUIREMENTS") is already a unique, useful label. P2/P3 spread one Part
// across many files (one per module/screen), so EVERY one of those files has
// the identical H1 — which would make every AI citation and search-result
// group for, say, all 17 P2 modules read as the same "Part 4" label. Detect
// that collision per product and disambiguate with the file's own module
// name, so citations/search stay specific ("Part 4 — Functional Requirements
// — Lead Intake" instead of 17-way-identical "Part 4 — Functional
// Requirements").
// Some products' files use a single generic wrapper H1 on almost every file
// (P3: "# MASTER SRS — P3 AI STUDENT COACH" everywhere) with only a handful
// carrying the real "# PART N — ..." title. The filename's own "PartN" token
// is the one signal that's consistent across every file, so group by that
// number first, then borrow the most specific title seen for that number
// (falling back to a synthesized "PART N" only if every file for that
// number uses the generic wrapper).
function regroupByPartNumber(chunks: Chunk[]): void {
  const GENERIC_RE = /^(MASTER SRS|SRS)\b/i;
  const infoByFile = new Map<string, { partNum: number | null; title: string }>();
  for (const c of chunks) {
    if (infoByFile.has(c.fileName)) continue;
    const m = c.fileName.match(/Part[_\s]?(\d+)/i);
    infoByFile.set(c.fileName, { partNum: m ? parseInt(m[1], 10) : null, title: c.part });
  }

  const isContinued = (s: string) => /\(continued\)/i.test(s);
  const bestTitleByNum = new Map<number, string>();
  for (const { partNum, title } of infoByFile.values()) {
    if (partNum == null) continue;
    const current = bestTitleByNum.get(partNum);
    if (!current) {
      bestTitleByNum.set(partNum, title);
      continue;
    }
    const currentGeneric = GENERIC_RE.test(current);
    const titleGeneric = GENERIC_RE.test(title);
    if (currentGeneric && !titleGeneric) {
      bestTitleByNum.set(partNum, title); // any specific title beats the generic wrapper
    } else if (!currentGeneric && !titleGeneric && isContinued(current) && !isContinued(title)) {
      bestTitleByNum.set(partNum, title); // prefer the clean title over a "(continued)" one
    }
  }

  const groupByFile = new Map<string, string>();
  for (const [fileName, { partNum, title }] of infoByFile) {
    if (partNum == null) {
      groupByFile.set(fileName, title);
      continue;
    }
    const best = bestTitleByNum.get(partNum)!;
    groupByFile.set(fileName, GENERIC_RE.test(best) ? `PART ${partNum}` : best);
  }

  for (const c of chunks) c.partGroup = groupByFile.get(c.fileName) || c.part;
}

// Turns the grouping above into the citation-facing "part" label, adding a
// module qualifier only when multiple files share the same group (so a
// single-file Part keeps its plain title, unchanged from before).
function disambiguateParts(chunks: Chunk[]): void {
  regroupByPartNumber(chunks);
  const filesByGroup = new Map<string, Set<string>>();
  for (const c of chunks) {
    if (!filesByGroup.has(c.partGroup)) filesByGroup.set(c.partGroup, new Set());
    filesByGroup.get(c.partGroup)!.add(c.fileName);
  }
  for (const c of chunks) {
    const files = filesByGroup.get(c.partGroup)!;
    c.part =
      files.size > 1 ? `${c.partGroup} — ${moduleFromFileName(c.fileName)}` : c.partGroup;
  }
}

// A product's own requirement-ID prefix varies (LMS-FR, AI-FR, AIC-FR, ...),
// so this scans ALL of the product's chunks for "| <PREFIX>-FR-### | ... |"
// rows rather than assuming one designated "Part 4" file exists.
function buildRequirements(
  productChunks: Chunk[],
  idLookup: Record<string, string>,
  product: string
): RequirementRow[] {
  // Optional traceability/enrichment table (service component, screen
  // prefix, test case) — P1 has one (Appendix D); not every product does.
  const traceabilityChunks = productChunks.filter(
    (c) => /traceability|appendix[_-]?d/i.test(c.fileName)
  );
  const dMap: Record<
    string,
    { service: string; screenPrefix: string; testCaseId: string }
  > = {};
  const dText = traceabilityChunks.map((c) => c.content).join("\n");
  for (const line of dText.split(/\r?\n/)) {
    const m = line.match(
      /^\|\s*([A-Z]{2,6}-FR-\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*(TC-[A-Z0-9]+-\d+)\s*\|/
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
  for (const chunk of productChunks) {
    const isModuleHeading =
      /^M\d+\b/i.test(chunk.heading) || /^Module\s*\d+/i.test(chunk.heading);
    const module = isModuleHeading ? chunk.heading : moduleFromFileName(chunk.fileName);
    for (const line of chunk.content.split(/\r?\n/)) {
      const m = line.match(
        /^\|\s*([A-Z]{2,6}-FR-\d+)\s*\|\s*(.+?)\s*\|\s*(Must|Should|Could|Won't|May)\s*\|\s*([^|]*?)\s*\|/i
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
