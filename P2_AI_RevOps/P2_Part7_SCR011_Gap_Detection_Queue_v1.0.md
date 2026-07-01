# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-011: Gap-Detection Queue
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
Show Sales Ops Manager and Marketing Manager which prospect questions agents couldn't answer, deduplicated and frequency-counted, to prioritize Knowledge Base additions.

## Wireframe — Desktop
- **Top filter bar**: date range, language, source module/agent.
- **Main list table**: representative question phrasing (deduplicated), frequency count, first-seen/last-seen dates, language, "Add to Knowledge Base" button per row.

## Wireframe — Tablet
- Table scrolls horizontally; frequency count column stays pinned.

## Wireframe — Mobile
- Rows become cards, sorted by frequency count descending by default.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Filter bar | Multi-select inputs | User input | Default, active-filter |
| Gap queue table | Table | Module 15 | Loading, loaded, error, empty |
| Frequency count badge | Numeric badge, per row | Module 15 | Single occurrence, multiple |
| "Add to Knowledge Base" button | Button | Navigates to SCR-P2-010 | Idle |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Click "Add to Knowledge Base" | Click/tap | Opens SCR-P2-010's Edit panel pre-filled with the gap question as context | "View gap-detection queue" + "Create/edit Knowledge Base entries" |
| Apply filter | Select filter value | Narrows the gap list | "View gap-detection queue" |

## Validation Rules
No free-text input fields; filters are constrained to enum/select values.

## Loading State
Table renders with skeleton rows.

## Empty State
"No content gaps detected" shown when no unanswered questions exist for the current filter.

## Error State
"Unable to load gap-detection queue — retry."

---

**Layer 3 Gate Check:** ✅ All gates passed.
