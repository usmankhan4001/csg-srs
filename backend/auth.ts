import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me";
const EDIT_PASSWORD = process.env.EDIT_PASSWORD || "";
const TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

const sign = (payload: string) =>
  crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");

export function editingEnabled(): boolean {
  return EDIT_PASSWORD.length > 0;
}

export function checkPassword(pw: string): boolean {
  if (!EDIT_PASSWORD) return false;
  const a = Buffer.from(String(pw));
  const b = Buffer.from(EDIT_PASSWORD);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function issueToken(): string {
  const payload = JSON.stringify({ exp: Date.now() + TTL_MS });
  const b64 = Buffer.from(payload).toString("base64url");
  return `${b64}.${sign(b64)}`;
}

export function verifyToken(token?: string): boolean {
  if (!token) return false;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return false;
  if (sign(b64) !== sig) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(b64, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

// Express middleware: require a valid editor token for write operations.
export function requireEditor(req: Request, res: Response, next: NextFunction) {
  if (!editingEnabled())
    return res.status(403).json({ error: "Editing is disabled (no EDIT_PASSWORD set)." });
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!verifyToken(token))
    return res.status(401).json({ error: "Not authorized — log in to edit." });
  next();
}
