# Deploying to Dokploy

This app ships as a **single Docker container**: Express serves both the API and
the built frontend on **one port (8787)**. Dokploy builds it straight from the
GitHub repo using the included `Dockerfile`.

Repo: `https://github.com/usmankhan4001/csg-srs` (branch `main`)

---

## 1. Prerequisites
- A server with **Dokploy** installed (`curl -sSL https://dokploy.com/install.sh | sh`).
- Your GitHub account connected to Dokploy (**Settings → Git → GitHub**), or use
  the public HTTPS repo URL.
- Your **Gemini API key**.

## 2. Create the application
1. In Dokploy: **Create Application** → give it a name (e.g. `csg-srs`).
2. **Source → GitHub** (or *Git* with the repo URL): select
   `usmankhan4001/csg-srs`, branch **`main`**.
3. **Build Type → `Dockerfile`** (path: `./Dockerfile`). Dokploy auto-detects it.

## 3. Environment variables
Add these under the app's **Environment** tab:

```
GEMINI_API_KEY=<your-real-gemini-key>
EDIT_PASSWORD=<a-strong-password>
AUTH_SECRET=<a-long-random-string>
GIT_AUTOCOMMIT=true
NODE_ENV=production
BACKEND_PORT=8787
DATA_DIR=/data
# optional: GEMINI_MODEL=gemini-2.5-flash   # faster/cheaper than the 2.5-pro default
```

> Never commit real keys to the repo — set them here only. `.env` is gitignored.

`DATA_DIR` is what makes edits, comments, accounts, and the search index
survive redeploys — see section 6 below. Skip it only if you're fine with a
fully ephemeral, read-only-in-practice deployment (section 6, option A).

## 4. Port + domain
1. **Ports / Networking:** map the app to container port **`8787`**.
2. **Domains:** add your domain (or the free Dokploy `*.traefik.me` host), point
   it at port **`8787`**, and enable **HTTPS (Let's Encrypt)**.
3. (Optional) **Health check path:** `/api/config`.

## 5. Deploy
Click **Deploy**. First build takes a few minutes (installs deps, `npm run
build`). When it's green, open your domain — the app loads, and the SRS
Assistant works once the Gemini key is set.

On first request, the server seeds `DATA_DIR` from the content baked into the
image, initializes it as its own git repo (separate from the app's own repo
history), and builds the search index there. This happens automatically —
there is nothing to run manually.

Pushes to `main` can auto-redeploy if you enable Dokploy's **GitHub webhook**.

---

## 6. Persistence of in-app edits (important)

Everything the app writes at runtime — edited Markdown, the git history of
those edits, the search index, registered user accounts, comments, and file
locks — lives under **one directory**, controlled by the `DATA_DIR` env var.
`ROOT` (the code checkout baked into the image) and `DATA_DIR` (the
persistent content root) are deliberately separate so a redeploy can replace
the app's code without touching the content.

- **A. GitHub is the source of truth (simplest, no volume).** Don't set
  `DATA_DIR` (or leave it unset so it defaults to the app's own checkout).
  Treat the deployed app as read-mostly: make content changes by committing to
  the repo and letting Dokploy redeploy. Any in-app edits made between
  redeploys are lost when the container is replaced. No volumes needed.

- **B. The running app is the source of truth (recommended — mount one volume).**
  Set `DATA_DIR=/data` (as in section 3) and mount **one** volume there:
  ```
  /data
  ```
  On first boot the server copies `_Shared/` and every product folder
  (`P1_LMS_SMS/`, `P2_AI_RevOps/`, `P3_AI_Student_Coach/`, …) from the image
  into `/data`, git-inits it with an initial commit, and builds the index
  there. From then on, all edits, their commit history, the rebuilt index,
  `users.json`, `comments/`, and `locks.json` persist across redeploys —
  because they all live under this one mounted path.

  In Dokploy → **Advanced → Volumes**, add a single named volume:
  ```
  Host/Volume: csg-srs-data   ->   Mount path: /data
  ```

That's it — no per-product volume mounts, and no separate mount for `.git`,
`users.json`, or `comments/`; they're all just subpaths of the same `/data`
volume now.

### Optional: push edits back to GitHub
To have the `/data` git history flow to GitHub too, give the container a
deploy key or token-scoped remote and add a `git push` step (a Dokploy
scheduled task, or a small cron inside the container) that runs `git -C /data
push`. Not required for the app to function — `/data`'s git history is
already durable as long as the volume persists.

---

## 7. Adding more products later
Drop a new top-level folder (e.g. `P4_Something/`) with its `.md` files into
the repo, commit, and redeploy — it's auto-detected on the next server boot
and appears in the product dropdown, no code changes needed.

If you're running with a mounted `/data` volume (option B above), a fresh
image redeploy does **not** overwrite an already-seeded product folder (the
seed step only copies a folder if it doesn't already exist at `/data/<name>`).
To ship an update to existing product content, either edit it in-app (so it's
tracked by `/data`'s own git history), or shell into the container and copy
the updated files into `/data/<product>/` directly.

## Alternative: Docker Compose (any host)
If you're not using Dokploy's UI, the same image runs anywhere:

```bash
docker build -t csg-srs .
docker run -d -p 8787:8787 \
  -e GEMINI_API_KEY=... -e EDIT_PASSWORD=... -e AUTH_SECRET=... \
  -e NODE_ENV=production -e BACKEND_PORT=8787 -e DATA_DIR=/data \
  -v csg_data:/data \
  --name csg-srs csg-srs
```
Open `http://<host>:8787`.
