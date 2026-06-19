import type {
  TreeNode,
  SearchHit,
  LookupResult,
  Requirement,
  AppConfig,
  FileResponse,
} from "./types";

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
  const r = await getJSON("/api/config");
  return r.json();
}

export async function fetchTree(product: string): Promise<TreeNode[]> {
  const r = await getJSON(`/api/tree?${qp(product)}`);
  return r.json();
}

export async function fetchFile(path: string): Promise<FileResponse> {
  const r = await getJSON(`/api/file?path=${encodeURIComponent(path)}`);
  if (!r.ok) throw new Error(`Could not load ${path}`);
  return r.json();
}

export async function search(q: string, product: string): Promise<SearchHit[]> {
  const r = await fetch(`/api/search?q=${encodeURIComponent(q)}&${qp(product)}`);
  return (await r.json()).results;
}

export async function lookupId(id: string, product: string): Promise<LookupResult | null> {
  const r = await fetch(`/api/lookup/${encodeURIComponent(id)}?${qp(product)}`);
  if (!r.ok) return null;
  return r.json();
}

export async function fetchRequirements(product: string): Promise<Requirement[]> {
  const r = await getJSON(`/api/requirements?${qp(product)}`);
  return r.json();
}

export async function fetchWireframeImages(): Promise<Set<string>> {
  const r = await getJSON("/api/wireframes");
  const { images } = await r.json();
  return new Set<string>(images);
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
  return r.json();
}
