import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { verifyUserToken, type Identity } from "./users.ts";

const EDIT_PASSWORD = process.env.EDIT_PASSWORD || "";

export function editingEnabled(): boolean {
  return EDIT_PASSWORD.length > 0;
}

export function checkPassword(pw: string): boolean {
  if (!EDIT_PASSWORD) return false;
  const a = Buffer.from(String(pw));
  const b = Buffer.from(EDIT_PASSWORD);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function bearer(req: Request): string {
  const h = req.headers.authorization || "";
  return h.startsWith("Bearer ") ? h.slice(7) : "";
}

// Resolve the signed-in editor identity for a request, or null.
export function getEditor(req: Request): Identity | null {
  const id = verifyUserToken(bearer(req));
  if (!id || id.role !== "editor") return null;
  return id;
}

// Express middleware: require the caller to be signed in AND promoted to
// editor (see /api/users/promote). Editing is attributed to their real
// account, not a shared password — that's what makes locking + git commit
// attribution meaningful.
export function requireEditor(req: Request, res: Response, next: NextFunction) {
  if (!editingEnabled())
    return res.status(403).json({ error: "Editing is disabled (no EDIT_PASSWORD set)." });
  const id = getEditor(req);
  if (!id) {
    const signedIn = !!verifyUserToken(bearer(req));
    return res.status(401).json({
      error: signedIn
        ? "Your account isn't an editor yet — unlock editing first."
        : "Sign in to edit.",
    });
  }
  (req as any).editor = id;
  next();
}
