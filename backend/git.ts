import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { DATA_DIR } from "./indexer.ts";

const run = promisify(execFile);

// All git operations run against DATA_DIR — the persistent content root —
// not ROOT (the app code checkout), so history is tracked where files are
// actually written and survives independently of code deploys.
async function git(args: string[]): Promise<string> {
  const { stdout } = await run("git", args, { cwd: DATA_DIR });
  return stdout.trim();
}

// Like git(), but preserves exact bytes (no trim) — required for `show`,
// where the output IS file content and a trailing newline is meaningful.
async function gitRaw(args: string[]): Promise<string> {
  const { stdout } = await run("git", args, { cwd: DATA_DIR, maxBuffer: 20 * 1024 * 1024 });
  return stdout;
}

export async function isGitRepo(): Promise<boolean> {
  try {
    await git(["rev-parse", "--is-inside-work-tree"]);
    return true;
  } catch {
    return false;
  }
}

// Make DATA_DIR a git repo with an initial commit if it isn't one yet
// (fresh volume on first boot). Safe to call on every startup.
export async function ensureGitRepo(): Promise<void> {
  if (await isGitRepo()) return;
  try {
    await run("git", ["init", "-q"], { cwd: DATA_DIR });
    await run("git", ["config", "user.email", "srs-app@local"], { cwd: DATA_DIR });
    await run("git", ["config", "user.name", "SRS App"], { cwd: DATA_DIR });
    // in containerized/volume setups git refuses to operate on a directory
    // owned by a different uid unless explicitly marked safe
    await run("git", ["config", "--global", "--add", "safe.directory", DATA_DIR], {});
    await run("git", ["add", "-A"], { cwd: DATA_DIR });
    const status = await run("git", ["status", "--porcelain"], { cwd: DATA_DIR }).then((r) => r.stdout.trim());
    if (status) await run("git", ["commit", "-q", "-m", "chore: initial content snapshot"], { cwd: DATA_DIR });
  } catch (e) {
    console.warn("Could not initialize git repo in DATA_DIR:", e);
  }
}

// Commit a single file (used for auto-commit on save), attributed to the
// editor who made the change so file history shows real names. Returns the
// short hash.
export async function commitFile(
  relPath: string,
  message: string,
  author?: { name: string; username: string }
): Promise<string | null> {
  if (!(await isGitRepo())) return null;
  try {
    await git(["add", "--", relPath]);
    // nothing staged? (no change) -> skip
    const status = await git(["status", "--porcelain", "--", relPath]);
    if (!status) return null;
    const args = ["commit"];
    if (author) args.push(`--author=${author.name} <${author.username}@users.local>`);
    args.push("-m", message, "--", relPath);
    await git(args);
    return await git(["rev-parse", "--short", "HEAD"]);
  } catch (e) {
    return null;
  }
}

export async function fileHistory(relPath: string, limit = 20) {
  if (!(await isGitRepo())) return [];
  try {
    const out = await git([
      "log",
      `-${limit}`,
      "--pretty=format:%h|%an|%ad|%s",
      "--date=short",
      "--",
      relPath,
    ]);
    if (!out) return [];
    return out.split("\n").map((l) => {
      const [hash, author, date, ...rest] = l.split("|");
      return { hash, author, date, subject: rest.join("|") };
    });
  } catch {
    return [];
  }
}

// Verify `hash` is a real commit that actually touched relPath, before using
// it in any git command — prevents path/ref injection via user-supplied hash.
async function validCommitForFile(relPath: string, hash: string): Promise<boolean> {
  if (!/^[0-9a-f]{4,40}$/i.test(hash)) return false;
  try {
    const touched = await git(["log", "--pretty=format:%H", "--", relPath]);
    return touched.split("\n").some((full) => full.toLowerCase().startsWith(hash.toLowerCase()));
  } catch {
    return false;
  }
}

// Read a file's content as it existed at a given commit (read-only preview).
export async function fileAtCommit(relPath: string, hash: string): Promise<string | null> {
  if (!(await isGitRepo())) return null;
  if (!(await validCommitForFile(relPath, hash))) return null;
  try {
    return await gitRaw(["show", `${hash}:${relPath}`]);
  } catch {
    return null;
  }
}

