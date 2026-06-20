import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "./indexer.ts";
import type { Identity } from "./users.ts";

const COMMENTS_DIR = path.join(DATA_DIR, "comments");

export interface Comment {
  id: string; // client-generated uuid (for idempotent offline sync)
  product: string;
  filePath: string;
  anchor: string; // nearest heading anchor (scopes the quote; "" = general)
  quote?: string; // the exact selected text the comment is attached to
  prefix?: string; // a few chars of text before the quote (disambiguation)
  suffix?: string; // a few chars of text after the quote
  author: string; // username
  authorName: string; // display name
  text: string;
  createdAt: string; // ISO
  resolved?: boolean;
}

function fileFor(filePath: string): string {
  const safe = filePath.replace(/[^a-z0-9]/gi, "_");
  return path.join(COMMENTS_DIR, `${safe}.json`);
}

function read(filePath: string): Comment[] {
  try {
    return JSON.parse(fs.readFileSync(fileFor(filePath), "utf8"));
  } catch {
    return [];
  }
}
function write(filePath: string, comments: Comment[]) {
  fs.mkdirSync(COMMENTS_DIR, { recursive: true });
  fs.writeFileSync(fileFor(filePath), JSON.stringify(comments, null, 2));
}

export function listComments(filePath: string): Comment[] {
  return read(filePath).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

// Idempotent add — if a comment with the same id exists, it's a no-op (used so
// offline-queued comments can be re-sent safely).
export function addComment(
  who: Identity,
  input: {
    id: string;
    product: string;
    filePath: string;
    anchor?: string;
    quote?: string;
    prefix?: string;
    suffix?: string;
    text: string;
    createdAt?: string;
  }
): Comment | { error: string } {
  if (!input.text || !input.text.trim()) return { error: "Empty comment" };
  if (!input.filePath || !input.id) return { error: "Missing fields" };
  const comments = read(input.filePath);
  const existing = comments.find((c) => c.id === input.id);
  if (existing) return existing;
  const comment: Comment = {
    id: input.id,
    product: input.product || "",
    filePath: input.filePath,
    anchor: input.anchor || "",
    quote: input.quote,
    prefix: input.prefix,
    suffix: input.suffix,
    author: who.username,
    authorName: who.displayName,
    text: input.text.trim(),
    createdAt: input.createdAt || new Date().toISOString(),
  };
  comments.push(comment);
  write(input.filePath, comments);
  return comment;
}

export function setResolved(filePath: string, id: string, resolved: boolean): boolean {
  const comments = read(filePath);
  const c = comments.find((x) => x.id === id);
  if (!c) return false;
  c.resolved = resolved;
  write(filePath, comments);
  return true;
}

// The full comment log for a product (newest first).
export function commentLog(product: string): Comment[] {
  if (!fs.existsSync(COMMENTS_DIR)) return [];
  const all: Comment[] = [];
  for (const f of fs.readdirSync(COMMENTS_DIR)) {
    if (!f.endsWith(".json")) continue;
    try {
      const arr: Comment[] = JSON.parse(
        fs.readFileSync(path.join(COMMENTS_DIR, f), "utf8")
      );
      for (const c of arr) if (!product || c.product === product) all.push(c);
    } catch {
      /* skip */
    }
  }
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
