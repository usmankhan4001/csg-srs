# P1 LMS+SMS — SRS Knowledge Base

A searchable knowledge base + AI assistant for the Lighthouse Global School
System **P1 LMS+SMS** Software Requirements Specification. Internal, read-only,
no auth.

## Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind
- **Backend:** Node + Express (keeps the Anthropic key server-side)
- **AI:** Google **Gemini** (`gemini-2.0-flash` by default) with keyword/ID-based RAG (FlexSearch — no vector DB)
- **Rendering:** react-markdown + remark-gfm, Mermaid diagrams inline

## Data location
The docs are read directly from the repo-root folders **`P1_LMS_SMS/`** and
**`_Shared/`** (the unified export places them here rather than under
`docs/P1_LMS_SMS/` as the original build note assumed). This is configured in
`backend/indexer.ts` → `DOC_ROOTS`. The docs folder is the only data store.

## Setup
```bash
npm install
cp .env.example .env        # then paste your GEMINI_API_KEY into .env
npm run index               # builds index/chunks.json, id_lookup.json, requirements.json
npm run dev                 # backend :8787 + client :5173 (open http://localhost:5173)
```
Get a free Gemini key at <https://aistudio.google.com/app/apikey>, then open the
`.env` file and set `GEMINI_API_KEY=...`. `npm run dev` also (re)builds the index
automatically on server start if `index/` is missing. Re-run `npm run index`
after editing the source docs.

> Without `GEMINI_API_KEY`, everything works except live chat answers — the chat
> panel still runs retrieval and shows the cited source sections, with a note to
> add the key.

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
