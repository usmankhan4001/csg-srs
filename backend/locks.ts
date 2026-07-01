// In-memory per-file edit locks. Prevents two editors from silently
// clobbering each other's changes. A lock expires on its own (TTL) if the
// holder's tab crashes or closes without releasing it, so nothing gets stuck
// locked forever; the editing UI sends a heartbeat to renew while open.
export interface LockInfo {
  username: string;
  displayName: string;
  acquiredAt: number;
  expiresAt: number;
}

const TTL_MS = 5 * 60 * 1000; // 5 minutes, renewed by heartbeat
const locks = new Map<string, LockInfo>();

function isExpired(lock: LockInfo): boolean {
  return lock.expiresAt < Date.now();
}

// Public read: current lock on a file, or null if none/expired.
export function getLock(filePath: string): LockInfo | null {
  const lock = locks.get(filePath);
  if (!lock) return null;
  if (isExpired(lock)) {
    locks.delete(filePath);
    return null;
  }
  return lock;
}

// Acquire or renew a lock for (username) on filePath. Fails if someone else
// holds a non-expired lock.
export function acquireLock(
  filePath: string,
  who: { username: string; displayName: string }
): { ok: boolean; lock?: LockInfo; error?: string } {
  const existing = getLock(filePath);
  if (existing && existing.username !== who.username) {
    return { ok: false, error: `${existing.displayName} is currently editing this document.`, lock: existing };
  }
  const lock: LockInfo = {
    username: who.username,
    displayName: who.displayName,
    acquiredAt: existing?.username === who.username ? existing.acquiredAt : Date.now(),
    expiresAt: Date.now() + TTL_MS,
  };
  locks.set(filePath, lock);
  return { ok: true, lock };
}

// Returns an error string if `username` does NOT currently hold the lock
// (used as a safety net on save even if the UI's own checks are bypassed).
export function checkLockOwnership(filePath: string, username: string): string | null {
  const lock = getLock(filePath);
  if (!lock) return null; // no lock held is fine (e.g. lock expired mid-edit)
  if (lock.username !== username)
    return `${lock.displayName} is currently editing this document — your changes were not saved.`;
  return null;
}

export function releaseLock(filePath: string, username: string): void {
  const lock = locks.get(filePath);
  if (lock && lock.username === username) locks.delete(filePath);
}
