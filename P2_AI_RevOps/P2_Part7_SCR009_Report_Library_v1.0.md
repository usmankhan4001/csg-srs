# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-009: Report Library
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
Browse all completed research reports, view staleness status, and use a report to generate a campaign.

## Wireframe — Desktop
- **Top filter bar**: market/geography, product/service, status (Fresh / Stale).
- **Main grid**: report cards — title, target market/product, generated date, staleness flag badge, "Generate Campaign" button.
- **Detail view** (opens on card click): full report content in sections, with source attribution footer.

## Wireframe — Tablet
- Grid becomes 2-column; detail view opens as a full-panel overlay.

## Wireframe — Mobile
- Grid becomes a single-column list; detail view opens full-screen.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Filter bar | Multi-select inputs | User input | Default, active-filter |
| Report grid/list | Card grid | Module 4 | Loading, loaded, error, empty |
| Staleness flag badge | Icon + label | Module 4 | Fresh, stale |
| Report detail view | Sectioned content | Module 4 | Loading, loaded, error |
| Source attribution footer | Text list | Module 4 | Static |
| "Generate Campaign" button | Button | Triggers Module 5 | Idle, stale-override-prompt, generating |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Click a report card | Click/tap | Opens the full report detail view | "View completed research reports" |
| Click "Generate Campaign" | Click/tap | Triggers campaign generation; if stale, shows override prompt first | "Submit research request" / Marketing Manager |
| Apply filter | Select filter value | Narrows the report grid | "View completed research reports" |

## Validation Rules
No free-text input fields; filters are constrained to enum/select values.

## Loading State
Grid renders with skeleton cards; detail view loads independently.

## Empty State
"No research reports yet" shown when no reports exist for the current filter.

## Error State
"Unable to load reports — retry." A detail-view-only failure does not affect the grid's usability.

---

**Layer 3 Gate Check:** ✅ All gates passed.
