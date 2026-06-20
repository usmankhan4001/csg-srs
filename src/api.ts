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
  // history is an online-only nicety; ignore failures (e.g. offline)
  let history: FileResponse["history"] = [];
  try {
    const r = await fetch(`/api/file?path=${encodeURIComponent(path)}`);
    if (r.ok) history = (await r.json()).history || [];
  } catch {
    /* offline — no history */
  }
  return { path, content, history };
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

// ---- Auth + editing ----------------------------------------------------
export async function login(password: string): Promise<string> {
  const r = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!r.ok) {
    const { error } = await r.json().catch(() => ({ error: "Login failed" }));
    throw new Error(error || "Login failed");
  }
  return (await r.json()).token;
}

export async function saveFile(
  path: string,
  content: string,
  token: string
): Promise<{ ok: boolean; committed: string | null }> {
  const r = await fetch("/api/file", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ path, content }),
  });
  if (!r.ok) {
    const { error } = await r.json().catch(() => ({ error: "Save failed" }));
    throw new Error(error || "Save failed");
  }
  invalidateBundles(); // edited content changed on the server
  return r.json();
}
