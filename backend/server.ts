import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ROOT } from "./indexer.ts";
import {
  getStore,
  reindex,
  resolveProduct,
  buildTree,
  readDocFile,
  writeDocFile,
  searchChunks,
  extractMessageIds,
  getBundle,
} from "./store.ts";
import { WIREFRAME_DIR } from "./indexer.ts";
import {
  checkPassword,
  issueToken,
  editingEnabled,
  requireEditor,
} from "./auth.ts";
import { commitFile, isGitRepo, fileHistory } from "./git.ts";
import { registerUser, loginUser, verifyUserToken } from "./users.ts";
import { listComments, addComment, commentLog, setResolved } from "./comments.ts";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const PORT = Number(process.env.BACKEND_PORT) || 8787;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-pro";
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const GIT_AUTOCOMMIT = (process.env.GIT_AUTOCOMMIT || "true") !== "false";

getStore(); // warm the index

app.use("/wireframes", express.static(WIREFRAME_DIR));

// In production, serve the built frontend (dist/) from the same server, so the
// whole app runs as one container on one port. In dev, Vite serves the client.
const DIST_DIR = path.join(ROOT, "dist");
const SERVE_STATIC = fs.existsSync(DIST_DIR);
if (SERVE_STATIC) app.use(express.static(DIST_DIR));

// ---- Config / products -------------------------------------------------
app.get("/api/config", (_req, res) => {
  const s = getStore();
  res.json({
    products: s.products,
    editingEnabled: editingEnabled(),
    defaultProduct: s.products[0]?.id || "",
  });
});

app.get("/api/tree", (req, res) => {
  res.json(buildTree(String(req.query.product || "")));
});

// Full offline bundle for one product (tree + files + search + ids + reqs).
app.get("/api/bundle", (req, res) => {
  res.json(getBundle(String(req.query.product || "")));
});

app.get("/api/file", async (req, res) => {
  const p = String(req.query.path || "");
  const md = readDocFile(p);
  if (md == null) return res.status(404).json({ error: "Not found" });
  res.json({ path: p, content: md, history: await fileHistory(p, 12) });
});

app.get("/api/search", (req, res) => {
  const q = String(req.query.q || "").trim();
  const product = String(req.query.product || "");
  if (!q) return res.json({ results: [] });
  const results = searchChunks(q, product, 20).map((r) => ({
    id: r.chunk.id,
    filePath: r.chunk.filePath,
    part: r.chunk.part,
    heading: r.chunk.heading,
    headingAnchor: r.chunk.headingAnchor,
    matchType: r.matchType,
    snippet: r.chunk.searchText.slice(0, 220),
  }));
  res.json({ results });
});

app.get("/api/lookup/:id", (req, res) => {
  const store = getStore();
  const pid = resolveProduct(String(req.query.product || ""));
  const id = String(req.params.id).toUpperCase();
  const chunkId = (store.idLookup[pid] || {})[id];
  if (!chunkId) return res.status(404).json({ error: "Unknown ID" });
  const chunk = store.byId.get(chunkId)!;
  res.json({
    id,
    chunkId,
    filePath: chunk.filePath,
    heading: chunk.heading,
    headingAnchor: chunk.headingAnchor,
    part: chunk.part,
  });
});

app.get("/api/requirements", (req, res) => {
  const pid = resolveProduct(String(req.query.product || ""));
  res.json(getStore().requirements[pid] || []);
});

app.get("/api/wireframes", (_req, res) => {
  if (!fs.existsSync(WIREFRAME_DIR)) return res.json({ images: [] });
  const images = fs
    .readdirSync(WIREFRAME_DIR)
    .filter((f) => /\.(png|jpg|jpeg|svg|webp)$/i.test(f));
  res.json({ images });
});

// ---- Auth --------------------------------------------------------------
app.post("/api/auth", (req, res) => {
  if (!editingEnabled())
    return res.status(403).json({ error: "Editing is disabled on this server." });
  const { password } = req.body as { password?: string };
  if (!checkPassword(String(password || "")))
    return res.status(401).json({ error: "Incorrect password." });
  res.json({ token: issueToken() });
});

// ---- Users (open self-registration) -----------------------------------
app.post("/api/users/register", (req, res) => {
  const { username, displayName, password } = req.body || {};
  const r = registerUser(username, displayName, password);
  if (!r.ok) return res.status(400).json({ error: r.error });
  res.json({ token: r.token, displayName: String(displayName).trim() });
});

app.post("/api/users/login", (req, res) => {
  const { username, password } = req.body || {};
  const r = loginUser(username, password);
  if (!r.ok) return res.status(401).json({ error: r.error });
  res.json({ token: r.token, displayName: r.displayName });
});

app.get("/api/users/me", (req, res) => {
  const id = verifyUserToken(bearer(req));
  res.json({ user: id });
});

// ---- Comments (read open; write requires a user) ----------------------
function bearer(req: any): string {
  const h = req.headers.authorization || "";
  return h.startsWith("Bearer ") ? h.slice(7) : "";
}

app.get("/api/comments", (req, res) => {
  const p = String(req.query.path || "");
  res.json({ comments: listComments(p) });
});

app.get("/api/comments/log", (req, res) => {
  res.json({ comments: commentLog(String(req.query.product || "")) });
});

app.post("/api/comments", (req, res) => {
  const id = verifyUserToken(bearer(req));
  if (!id) return res.status(401).json({ error: "Sign in to comment." });
  const b = req.body || {};
  const result = addComment(id, {
    id: b.id,
    product: b.product,
    filePath: b.path ?? b.filePath,
    anchor: b.anchor,
    quote: b.quote,
    prefix: b.prefix,
    suffix: b.suffix,
    text: b.text,
    createdAt: b.createdAt,
  });
  if ("error" in result) return res.status(400).json({ error: result.error });
  res.json({ comment: result });
});

app.post("/api/comments/resolve", (req, res) => {
  const id = verifyUserToken(bearer(req));
  if (!id) return res.status(401).json({ error: "Sign in required." });
  const { filePath, commentId, resolved } = req.body || {};
  const ok = setResolved(String(filePath), String(commentId), !!resolved);
  res.json({ ok });
});

// ---- Editing (protected) ----------------------------------------------
app.put("/api/file", requireEditor, async (req, res) => {
  const { path: relPath, content } = req.body as { path?: string; content?: string };
  if (!relPath || typeof content !== "string")
    return res.status(400).json({ error: "path and content required" });
  const result = writeDocFile(relPath, content);
  if (!result.ok) return res.status(400).json({ error: result.error });

  reindex(); // refresh chunks/search/ids/requirements

  let commit: string | null = null;
  if (GIT_AUTOCOMMIT && (await isGitRepo())) {
    commit = await commitFile(relPath, `docs: edit ${relPath}`);
  }
  res.json({ ok: true, committed: commit });
});

app.post("/api/reindex", requireEditor, (_req, res) => {
  const s = reindex();
  res.json({ ok: true, products: s.products.length, chunks: s.chunks.length });
});

// ---- Chat (SSE, product-scoped) ---------------------------------------
const systemPrompt = (productName: string) => `You are the SRS Assistant for the "${productName}" Software Requirements Specification (a Lighthouse Global School System product). You are an expert business analyst who knows this specification intimately and help the delivery team understand requirements, decisions, risks, budgets, screens and test cases.

GROUNDING (strict):
- Use ONLY the provided context chunks. Never invent facts, numbers, dates, or IDs, and never fill gaps with outside knowledge.
- Quote exact figures, currency amounts, dates, percentages and IDs VERBATIM from the context — never round or approximate.
- If the context does not contain the answer, say so plainly in one line and suggest the specific Part/Appendix or search terms the user should try. Do not pad.

ANSWER QUALITY (be genuinely useful, not bland):
- Open with a one-line **bold** direct answer to the exact question.
- Then give the substance: synthesise across the provided chunks, connect related requirements/decisions/risks, and explain the "why" when the context gives a rationale.
- Whenever you list 3+ related items, present them as a Markdown table with meaningful columns including a |---| separator row. Use bullet lists for shorter enumerations.
- Mention concrete IDs (LMS-FR-057, DEC-P1-028, RISK-AI-001, SCR-ADM-001, TC-M01-001, Part 8.1, etc.) inline — they auto-render as clickable links.
- Cite every claim inline as [Part X — Section Name] or [Appendix X], using the SOURCE labels in the context.
- End with a short "Related" line pointing to 1–3 IDs or sections worth opening next, when useful.

FORMAT (GitHub-flavored Markdown):
- Space after "#" in headings and after "- " in bullets.
- Tables need a blank line before them and a "| --- | --- |" separator row directly under the header, else they will not render.
- Never emit stray "*", "#", or "|" outside valid Markdown.`;

app.post("/api/chat", async (req, res) => {
  const { message, history, product } = req.body as {
    message: string;
    history?: { role: "user" | "assistant"; content: string }[];
    product?: string;
  };
  if (!message || typeof message !== "string")
    return res.status(400).json({ error: "message required" });

  const store = getStore();
  const pid = resolveProduct(product);
  const productName = store.products.find((p) => p.id === pid)?.name || pid;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  const send = (event: string, data: unknown) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  const ctxChunks: typeof store.chunks = [];
  const usedIds = new Set<string>();
  const lookup = store.idLookup[pid] || {};
  for (const id of extractMessageIds(message)) {
    const cid = lookup[id];
    if (cid && !usedIds.has(cid)) {
      usedIds.add(cid);
      ctxChunks.push(store.byId.get(cid)!);
    }
  }
  for (const r of searchChunks(message, pid, 14)) {
    if (!usedIds.has(r.chunk.id)) {
      usedIds.add(r.chunk.id);
      ctxChunks.push(r.chunk);
    }
    if (ctxChunks.length >= 14) break;
  }

  send(
    "sources",
    ctxChunks.map((c) => ({
      id: c.id,
      filePath: c.filePath,
      part: c.part,
      heading: c.heading,
      headingAnchor: c.headingAnchor,
    }))
  );

  const contextBlock = ctxChunks
    .map((c) => `[SOURCE: ${c.part} — ${c.heading}]\n${c.content}`)
    .join("\n\n---\n\n");

  if (!GEMINI_KEY) {
    send("error", {
      message:
        "GEMINI_API_KEY is not set. Add it to your .env file to enable chat. The retrieved source sections are shown above.",
    });
    send("done", {});
    return res.end();
  }

  const geminiHistory = (history || []).slice(-6).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const userTurn = `Context chunks:\n\n${contextBlock}\n\n---\n\nQuestion: ${message}`;

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: systemPrompt(productName),
    });
    const chat = model.startChat({
      history: geminiHistory,
      generationConfig: { maxOutputTokens: 3000, temperature: 0.45 },
    });
    const result = await chat.sendMessageStream(userTurn);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) send("delta", { text });
    }
    send("done", {});
    res.end();
  } catch (err: any) {
    send("error", { message: err?.message || "Chat request failed." });
    send("done", {});
    res.end();
  }
});

// SPA fallback: anything that isn't an API/asset route returns index.html.
if (SERVE_STATIC) {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/wireframes"))
      return next();
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`SRS backend listening on http://localhost:${PORT}`);
  if (SERVE_STATIC) console.log("Serving built frontend from dist/.");
});
