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
# optional: GEMINI_MODEL=gemini-2.5-flash   # faster/cheaper than the 2.5-pro default
```

> Never commit real keys to the repo — set them here only. `.env` is gitignored.

## 4. Port + domain
1. **Ports / Networking:** map the app to container port **`8787`**.
2. **Domains:** add your domain (or the free Dokploy `*.traefik.me` host), point
   it at port **`8787`**, and enable **HTTPS (Let's Encrypt)**.
3. (Optional) **Health check path:** `/api/config`.

## 5. Deploy
Click **Deploy**. First build takes a few minutes (installs deps, `npm run
build`, `npm run index`). When it's green, open your domain — the app loads, and
the SRS Assistant works once the Gemini key is set.

Pushes to `main` can auto-redeploy if you enable Dokploy's **GitHub webhook**.

---

## 6. Persistence of in-app edits (important)
The in-app editor writes to the Markdown files and **auto-commits to git inside
the container**. A plain redeploy rebuilds the image from GitHub, so edits made
only inside the running container would be lost. Pick one:

- **GitHub is the source of truth (simplest).** Treat the deployed app as
  read-mostly. Make content changes by committing to the repo (locally or via the
  app, then `git push`), and let Dokploy redeploy. No volumes needed.

- **The running app is the source of truth (mount volumes).** Add **Volume
  Mounts** so edits + history survive redeploys. In Dokploy → **Volumes**, create
  named volumes mounted at:
  ```
  /app/_Shared
  /app/P1_LMS_SMS        # one per product folder
  /app/.git              # keeps commit history across redeploys
  ```
  Named volumes are seeded from the image on first deploy, then persist. With
  this setup, content lives on the server; to also back it up to GitHub, run
  `git push` from the container (or a scheduled job) — see below.

### User accounts & comments persistence (important)
Registered users and comments are stored on disk at **`/app/users.json`** and
**`/app/comments/`** (both gitignored). To keep them across redeploys, mount
volumes there too:
```
/app/users.json
/app/comments
```
Set a strong **`AUTH_SECRET`** (it signs both editor and user login tokens) and
**`EDIT_PASSWORD`** in the environment. Registration is open by design (anyone
can create an account and comment); attribution is by account.

### Optional: push edits back to GitHub
To have in-container commits flow to GitHub, give the container a deploy key or a
token-scoped remote and add a `git push` step (e.g. a Dokploy scheduled task or a
small cron in the container). Not required for the app to function.

---

## 7. Adding more products later
Drop a new top-level folder (e.g. `P2_REVOPS/`) into the repo with its `.md`
files, commit, and redeploy. It's auto-detected and appears in the product
dropdown — no code or config changes.

## Alternative: Docker Compose (any host)
If you're not using Dokploy's UI, the same image runs anywhere:

```bash
docker build -t csg-srs .
docker run -d -p 8787:8787 \
  -e GEMINI_API_KEY=... -e EDIT_PASSWORD=... -e AUTH_SECRET=... \
  -e NODE_ENV=production -e BACKEND_PORT=8787 \
  -v csg_shared:/app/_Shared -v csg_p1:/app/P1_LMS_SMS -v csg_git:/app/.git \
  --name csg-srs csg-srs
```
Open `http://<host>:8787`.
