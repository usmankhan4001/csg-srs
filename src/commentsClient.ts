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
}

const LS = {
  token: "srs_user_token",
  name: "srs_user_name",
  uname: "srs_user_username",
  queue: "srs_comment_queue",
  cache: (fp: string) => `srs_comments_cache:${fp}`,
};

// ---- user ----
export function getUser(): CurrentUser | null {
  const token = localStorage.getItem(LS.token);
  if (!token) return null;
  return {
    token,
    username: localStorage.getItem(LS.uname) || "",
    displayName: localStorage.getItem(LS.name) || "",
  };
}
function setUser(token: string, username: string, displayName: string) {
  localStorage.setItem(LS.token, token);
  localStorage.setItem(LS.uname, username);
  localStorage.setItem(LS.name, displayName);
}
export function logout() {
  localStorage.removeItem(LS.token);
  localStorage.removeItem(LS.uname);
  localStorage.removeItem(LS.name);
}

export async function register(username: string, displayName: string, password: string) {
  const r = await fetch("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, displayName, password }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Registration failed");
  setUser(data.token, username.trim().toLowerCase(), data.displayName);
}

export async function login(username: string, password: string) {
  const r = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || "Login failed");
  setUser(data.token, username.trim().toLowerCase(), data.displayName);
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
