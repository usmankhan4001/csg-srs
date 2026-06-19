import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { ROOT } from "./indexer.ts";

const run = promisify(execFile);

async function git(args: string[]): Promise<string> {
  const { stdout } = await run("git", args, { cwd: ROOT });
  return stdout.trim();
}

export async function isGitRepo(): Promise<boolean> {
  try {
    await git(["rev-parse", "--is-inside-work-tree"]);
    return true;
  } catch {
    return false;
  }
}

// Commit a single file (used for auto-commit on save). Returns the short hash.
export async function commitFile(relPath: string, message: string): Promise<string | null> {
  if (!(await isGitRepo())) return null;
  try {
    await git(["add", "--", relPath]);
    // nothing staged? (no change) -> skip
    const status = await git(["status", "--porcelain", "--", relPath]);
    if (!status) return null;
    await git(["commit", "-m", message, "--", relPath]);
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
