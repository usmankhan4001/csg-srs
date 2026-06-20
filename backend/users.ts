import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { ROOT } from "./indexer.ts";

const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me";
const USERS_FILE = path.join(ROOT, "users.json");
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface User {
  username: string;
  displayName: string;
  salt: string;
  hash: string;
  createdAt: string;
}
export interface Identity {
  username: string;
  displayName: string;
}

function load(): User[] {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch {
    return [];
  }
}
function save(users: User[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

const hashPw = (pw: string, salt: string) =>
  crypto.scryptSync(pw, salt, 64).toString("hex");

const sign = (payload: string) =>
  crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");

export function issueUserToken(id: Identity): string {
  const payload = JSON.stringify({ ...id, exp: Date.now() + TTL_MS });
  const b64 = Buffer.from(payload).toString("base64url");
  return `${b64}.${sign(b64)}`;
}

export function verifyUserToken(token?: string): Identity | null {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig || sign(b64) !== sig) return null;
  try {
    const p = JSON.parse(Buffer.from(b64, "base64url").toString());
    if (typeof p.exp !== "number" || p.exp < Date.now()) return null;
    return { username: p.username, displayName: p.displayName };
  } catch {
    return null;
  }
}

export function registerUser(
  username: string,
  displayName: string,
  password: string
): { ok: boolean; token?: string; error?: string } {
  username = String(username || "").trim().toLowerCase();
  displayName = String(displayName || "").trim();
  if (!/^[a-z0-9_.-]{3,32}$/.test(username))
    return { ok: false, error: "Username must be 3–32 chars (letters, numbers, . _ -)." };
  if (displayName.length < 2) return { ok: false, error: "Enter your display name." };
  if (String(password || "").length < 4) return { ok: false, error: "Password too short." };

  const users = load();
  if (users.some((u) => u.username === username))
    return { ok: false, error: "That username is taken." };
  const salt = crypto.randomBytes(16).toString("hex");
  users.push({
    username,
    displayName,
    salt,
    hash: hashPw(password, salt),
    createdAt: new Date().toISOString(),
  });
  save(users);
  return { ok: true, token: issueUserToken({ username, displayName }) };
}

export function loginUser(
  username: string,
  password: string
): { ok: boolean; token?: string; displayName?: string; error?: string } {
  username = String(username || "").trim().toLowerCase();
  const user = load().find((u) => u.username === username);
  if (!user) return { ok: false, error: "No such user." };
  const attempt = hashPw(String(password || ""), user.salt);
  const a = Buffer.from(attempt);
  const b = Buffer.from(user.hash);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b))
    return { ok: false, error: "Incorrect password." };
  return { ok: true, token: issueUserToken(user), displayName: user.displayName };
}
