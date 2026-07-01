import type {
  TreeNode,
  SearchHit,
  LookupResult,
  Requirement,
  AppConfig,
  FileResponse,
} from "./types";
import {
  ensureProduct,
  getTree,
  getFile,
  getRequirements,
  clientSearch,
  clientLookup,
  invalidateBundles,
} from "./dataClient";

async function getJSON(url: string, tries = 5): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return r;
      if (r.status < 500) return r;
      lastErr = new Error(`HTTP ${r.status}`);
    } catch (e) {
      lastErr = e;
    }
    await new Promise((res) => setTimeout(res, 600 * (i + 1)));
  }
  throw lastErr instanceof Error ? lastErr : new Error("request failed");
}

const qp = (product?: string) => (product ? `product=${encodeURIComponent(product)}` : "");

export async function fetchConfig(): Promise<AppConfig> {
  try {
    const r = await getJSON("/api/config");
    const config: AppConfig = await r.json();
    try { localStorage.setItem("srs_config_cache", JSON.stringify(config)); } catch {}
    return config;
  } catch {
    const cached = localStorage.getItem("srs_config_cache");
    if (cached) return JSON.parse(cached) as AppConfig;
    throw new Error("Could not load configuration (offline, no cache)");
  }
}

// Reads are served from the per-product offline bundle (client-side), so they
// work without a network connection once the product has been loaded.
export async function fetchTree(product: string): Promise<TreeNode[]> {
  await ensureProduct(product);
  return getTree();
}

export async function fetchFile(path: string): Promise<FileResponse> {
  const content = getFile(path);
  if (content == null) throw new Error(`Could not load ${path}`);
  // history + lock status are online-only niceties; ignore failures (offline)
  let history: FileResponse["history"] = [];
  let lock: FileResponse["lock"] = null;
  try {
    const r = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
    if (r.ok) {
      const j = await r.json();
      history = j.history || [];
      lock = j.lock || null;
    }
  } catch {
    /* offline — no history/lock info */
  }
  return { path, content, history, lock };
}

export async function search(q: string, product: string): Promise<SearchHit[]> {
  await ensureProduct(product);
  return clientSearch(q);
}

export async function lookupId(id: string, product: string): Promise<LookupResult | null> {
  await ensureProduct(product);
  return clientLookup(id);
}

export async function fetchRequirements(product: string): Promise<Requirement[]> {
  await ensureProduct(product);
  return getRequirements();
}

export async function fetchWireframeImages(): Promise<Set<string>> {
  try {
    const r = await getJSON("/api/wireframes");
    const { images } = await r.json();
    return new Set<string>(images);
  } catch {
    return new Set<string>();
  }
}

// ---- Editing (attributed to the signed-in user; see commentsClient.ts) ---
async function authedJSON(url: string, method: string, token: string, body?: unknown) {
  const r = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `${method} ${url} failed`);
  return data;
}

export interface LockResult {
  ok: boolean;
  lock?: { username: string; displayName: string; acquiredAt: number; expiresAt: number } | null;
  error?: string;
}

export async function lockFile(path: string, token: string): Promise<LockResult> {
  const r = await fetch("/api/file/lock", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ path }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return { ok: false, error: data.error, lock: data.lock || null };
  return { ok: true, lock: data.lock };
}

export async function unlockFile(path: string, token: string): Promise<void> {
  try {
    await authedJSON("/api/file/unlock", "POST", token, { path });
  } catch {
    /* best-effort */
  }
}

export async function saveFile(
  path: string,
  content: string,
  token: string
): Promise<{ ok: boolean; committed: string | null }> {
  const data = await authedJSON("/api/file", "PUT", token, { path, content });
  invalidateBundles(); // edited content changed on the server
  return data;
}

export async function fetchVersion(path: string, hash: string): Promise<string> {
  const r = await fetch(
    `/api/file/version?path=${encodeURIComponent(path)}&hash=${encodeURIComponent(hash)}`
  );
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "Could not load version");
  return data.content;
}

export async function restoreVersion(
  path: string,
  hash: string,
  token: string
): Promise<{ ok: boolean; committed: string | null; content: string }> {
  const data = await authedJSON("/api/file/restore", "POST", token, { path, hash });
  invalidateBundles();
  return data;
}
