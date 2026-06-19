# SRS Knowledge Base (multi-product)

A searchable knowledge base + AI assistant for Lighthouse Global School System
Software Requirements Specifications. Hosts **many products** (P1, P2, …) in one
app. Viewing is open; **editing is behind a password**. Changes are versioned in
git.

## Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind
- **Backend:** Node + Express (keeps the AI key server-side)
- **AI:** Google **Gemini** (`gemini-2.5-pro` by default) with keyword/ID-based RAG (FlexSearch — no vector DB)
- **Rendering:** react-markdown + remark-gfm, Mermaid diagrams inline (zoom/pan)

## Multi-product layout
Each **top-level folder** in the repo that contains `.md` files is auto-detected
as a product (e.g. `P1_LMS_SMS/`, and any future `P2_xxx/`, `P3_xxx/`). The
`_Shared/` folder (Decision Log, ID Register, etc.) is available to every
product. To add a product: drop its folder at the repo root and restart — it
appears in the product dropdown automatically. App code (`src/`, `backend/`,
`node_modules`, `index`, `docs`, `dist`) is excluded from product detection.

## Setup
```bash
npm install
cp .env.example .env        # set GEMINI_API_KEY, EDIT_PASSWORD, AUTH_SECRET
npm run index               # builds index/ (chunks, id_lookup, requirements, products)
npm run dev                 # backend :8787 + client :5173 (open http://localhost:5173)
```
Get a free Gemini key at <https://aistudio.google.com/app/apikey>, then open the
`.env` file and set `GEMINI_API_KEY=...`. `npm run dev` also (re)builds the index
automatically on server start if `index/` is missing. Re-run `npm run index`
after editing the source docs.

> Without `GEMINI_API_KEY`, everything works except live chat answers — the chat
> panel still runs retrieval and shows the cited source sections, with a note to
> add the key.

## Editing (password-gated, Obsidian-style)
Viewing is open to anyone who can reach the app. To edit:
1. Set `EDIT_PASSWORD` and a long random `AUTH_SECRET` in `.env`.
2. Click **Edit** in the header → enter the password (unlocks for ~8 hours, token stored locally).
3. You get a split editor: raw Markdown on the left, **live preview** on the right. `Ctrl/⌘+S` or **Save**.
4. On save the file is written to disk, the search/cross-link index is rebuilt, and — if `GIT_AUTOCOMMIT=true` — the change is **auto-committed to git** (`docs: edit <path>`). Recent edits show under each document.

Write endpoints (`PUT /api/file`, `POST /api/reindex`) require a valid editor
token; all read endpoints are open.

## Versioning & GitHub
This repo is git-initialised and every saved edit is auto-committed, so you have
full history. To push to GitHub for backup/versioning:

```bash
# 1. Create an EMPTY *private* repo on github.com (no README/license).
# 2. Then, from this folder:
git remote add origin https://github.com/<you>/<repo>.git
git branch -M main
git push -u origin main
```
`.env` (your real keys) is gitignored and never committed; `.env.example`
contains only placeholders. **Keep the repo private** — it holds confidential
SRS content.

## Features
- **File tree** mirroring `P1_LMS_SMS/` + `_Shared/`, resizable 3-pane layout (tabs on mobile).
- **Markdown viewer** with inline Mermaid, heading anchors, smooth-scroll.
- **Cross-link engine** — `LMS-FR-###`, `LMS-NFR-###`, `LMS-TR-###`, `DEC-P1-###`,
  `BR-###`, `RISK-XXX-###`, `SCR-XXX-###`, `TC-XXX-###`, and `(Part 8.1)` /
  `(Section 14.5)` references become clickable chips that navigate the viewer.
  Targets are resolved from `index/id_lookup.json` (the best-defining chunk per
  ID), so no part numbers are hard-coded.
- **Header search** (debounced 300ms): exact ID matches first with an `ID` badge,
  then FlexSearch results grouped by Part; click navigates + flashes the section.
- **Requirement Explorer** — all 207 Part-4 requirements as a filterable/sortable
  table (ID, Module, Priority, Statement, linked Test Case → Appendix E).
- **Wireframes** — if `docs/wireframes/SCR-ID.png` (optionally `-desktop/-tablet/-mobile`)
  exists it renders above the ASCII block with the text layout collapsed into a
  "Show text layout" toggle; otherwise the ASCII wireframe shows as-is.
- **AI chat** — SSE streaming, answers strictly from retrieved chunks with
  citations; citation/source chips navigate the viewer.

## Adding Frame0 wireframe images
Drop PNGs into **`docs/wireframes/`** named exactly after the Screen ID, e.g.
`SCR-ADM-001.png` (or `SCR-ADM-001-desktop.png`). Restart the server (or just the
page picks up the list on load). Missing screens keep their ASCII fallback.
Full checklist of IDs:
```bash
grep -h "^## SCR-" P1_LMS_SMS/Appendices/Wireframes_*.md | sed 's/## //'
```

## API
| Route | Purpose |
|---|---|
| `GET /api/tree` | sidebar folder/file tree |
| `GET /api/file?path=` | raw markdown of one file |
| `GET /api/search?q=` | FlexSearch + exact-ID results |
| `GET /api/lookup/:id` | exact chunk target for one ID |
| `GET /api/requirements` | computed 207-row requirement table |
| `GET /api/wireframes` | list of wireframe images present on disk |
| `POST /api/chat` | SSE streaming RAG chat |

## Notes / deviations from the original build prompt
- Docs live at the repo root (`P1_LMS_SMS/`, `_Shared/`), not `docs/P1_LMS_SMS/`.
- The Risk Register ships as `.xlsx`; `RISK-*` IDs are resolved wherever they
  appear in the markdown (incl. `Part_16_Risk_Register.md`) via `id_lookup`.
- Cross-link resolution is data-driven via `id_lookup.json` rather than the
  hard-coded "Part 4 / Part 16" mapping, since this export is organised by Layer.
