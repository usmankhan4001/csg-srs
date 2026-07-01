// User identity + comments data layer with offline queue and sync.

export interface CommentT {
  id: string;
  product: string;
  filePath: string;
  anchor: string;
  quote?: string;
  prefix?: string;
  suffix?: string;
  author: string;
  authorName: string;
  text: string;
  createdAt: string;
  resolved?: boolean;
  pending?: boolean; // not yet synced to server
}

export interface CurrentUser {
  token: string;
  username: string;
  displayName: string;
  role?: "editor";
}

const LS = {
  token: "srs_user_token",
  queue: "srs_comment_queue",
  cache: (fp: string) => `srs_comments_cache:${fp}`,
};

// The token is a signed "<payload>.<sig>" pair; decode the payload (no
// signature check needed client-side — it's just for display, the server
// re-verifies on every request) so role/name always reflect the latest token.
function decodeToken(token: string): Omit<CurrentUser, "token"> | null {
  try {
    const [b64] = token.split(".");
    let std = b64.replace(/-/g, "+").replace(/_/g, "/");
    while (std.length % 4) std += "="; // atob is strict about padding
    const p = JSON.parse(atob(std));
    if (typeof p.exp === "number" && p.exp < Date.now()) return null;
    return { username: p.username, displayName: p.displayName, role: p.role };
  } catch {
    return null;
  }
}

// ---- user ----
export function getUser(): CurrentUser | null {
  const token = localStorage.getItem(LS.token);
  if (!token) return null;
  const id = decodeToken(token);
  if (!id) {
    localStorage.removeItem(LS.token); // expired/corrupt
    return null;
  }
  return { token, ...id };
}
export function isEditor(): boolean {
  return getUser()?.role === "editor";
}
function setToken(token: string) {
  localStorage.setItem(LS.token, token);
}
export function logout() {
  localStorage.removeItem(LS.token);
}

export async function register(username: string, displayName: string, password: string) {
  const r = await fetch("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, displayName, password }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Registration failed");
  setToken(data.token);
}

export async function login(username: string, password: string) {
  const r = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Login failed");
  setToken(data.token);
}

// Elevate the signed-in user to editor by entering the shared EDIT_PASSWORD
// once; stores the freshly re-issued token (role=editor baked in).
export async function promote(password: string): Promise<void> {
  const user = getUser();
  if (!user) throw new Error("Sign in first.");
  const r = await fetch("/api/users/promote", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
    body: JSON.stringify({ password }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Incorrect password");
  setToken(data.token);
}

// ---- queue ----
function getQueue(): CommentT[] {
  try {
    return JSON.parse(localStorage.getItem(LS.queue) || "[]");
  } catch {
    return [];
  }
}
function setQueue(q: CommentT[]) {
  localStorage.setItem(LS.queue, JSON.stringify(q));
}
function cacheFor(fp: string): CommentT[] {
  try {
    return JSON.parse(localStorage.getItem(LS.cache(fp)) || "[]");
  } catch {
    return [];
  }
}
function setCache(fp: string, list: CommentT[]) {
  localStorage.setItem(LS.cache(fp), JSON.stringify(list));
}

export function pendingCount(): number {
  return getQueue().length;
}

// ---- comments ----
export async function fetchComments(filePath: string): Promise<CommentT[]> {
  const queued = getQueue().filter((c) => c.filePath === filePath);
  try {
    const r = await fetch(`/api/comments?path=${encodeURIComponent(filePath)}`);
    if (!r.ok) throw new Error();
    const server: CommentT[] = (await r.json()).comments || [];
    setCache(filePath, server);
    // merge queued ones not yet on server
    const ids = new Set(server.map((c) => c.id));
    return [...server, ...queued.filter((c) => !ids.has(c.id))].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
  } catch {
    // offline: cached + queued
    const cached = cacheFor(filePath);
    const ids = new Set(cached.map((c) => c.id));
    return [...cached, ...queued.filter((c) => !ids.has(c.id))].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
  }
}

// Optimistically add a comment; POST now if possible else queue for later sync.
export async function addComment(input: {
  product: string;
  filePath: string;
  anchor: string;
  quote?: string;
  prefix?: string;
  suffix?: string;
  text: string;
}): Promise<CommentT> {
  const user = getUser();
  if (!user) throw new Error("Sign in to comment.");
  const comment: CommentT = {
    id: crypto.randomUUID(),
    product: input.product,
    filePath: input.filePath,
    anchor: input.anchor,
    quote: input.quote,
    prefix: input.prefix,
    suffix: input.suffix,
    author: user.username,
    authorName: user.displayName,
    text: input.text.trim(),
    createdAt: new Date().toISOString(),
    pending: true,
  };
  // optimistic cache
  setCache(input.filePath, [...cacheFor(input.filePath), comment]);

  const ok = await postComment(comment, user.token);
  if (!ok) {
    setQueue([...getQueue(), comment]);
  } else {
    comment.pending = false;
  }
  return comment;
}

export async function resolveComment(
  filePath: string,
  commentId: string,
  resolved: boolean,
  token: string
): Promise<boolean> {
  try {
    const r = await fetch("/api/comments/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ filePath, commentId, resolved }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export async function deleteCommentApi(
  filePath: string,
  commentId: string,
  token: string
): Promise<boolean> {
  try {
    const r = await fetch("/api/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ filePath, commentId }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

async function postComment(c: CommentT, token: string): Promise<boolean> {
  try {
    const r = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        id: c.id,
        product: c.product,
        path: c.filePath,
        anchor: c.anchor,
        quote: c.quote,
        prefix: c.prefix,
        suffix: c.suffix,
        text: c.text,
        createdAt: c.createdAt,
      }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

// Flush queued comments to the server (call when back online).
export async function syncQueue(): Promise<number> {
  const user = getUser();
  if (!user) return 0;
  let queue = getQueue();
  if (!queue.length) return 0;
  const remaining: CommentT[] = [];
  let synced = 0;
  for (const c of queue) {
    const ok = await postComment(c, user.token);
    if (ok) synced++;
    else remaining.push(c);
  }
  setQueue(remaining);
  return synced;
}

export async function fetchLog(product: string): Promise<CommentT[]> {
  const cacheKey = `srs_log_cache:${product}`;
  try {
    const r = await fetch(`/api/comments/log?product=${encodeURIComponent(product)}`);
    if (!r.ok) throw new Error();
    const comments: CommentT[] = (await r.json()).comments || [];
    try { localStorage.setItem(cacheKey, JSON.stringify(comments)); } catch {}
    return comments;
  } catch {
    try { return JSON.parse(localStorage.getItem(cacheKey) || "[]"); } catch { return []; }
  }
}
