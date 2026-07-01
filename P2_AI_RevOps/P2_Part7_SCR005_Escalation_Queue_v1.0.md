# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-005: Escalation Queue
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
List all escalated conversations awaiting or in claim, showing wait time, trigger reason, and routing, so Human Agents can claim and Sales Ops Managers can monitor.

## Wireframe — Desktop
- **Top filter bar**: status (Unclaimed / Claimed / Resolved), team, language.
- **Main table**: Lead name, escalation reason code(s), wait time (live elapsed counter), routed team, claim status, Claim button.
- **SLA breach indicator**: rows approaching/exceeding the SLA threshold flagged with a distinct icon + color, sorted to the top by default.

## Wireframe — Tablet
- Table scrolls horizontally; SLA breach flag column stays pinned.

## Wireframe — Mobile
- Rows become cards, sorted by wait time descending; Claim button is the most prominent element.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Filter bar | Multi-select inputs | User input | Default, active-filter |
| Escalation queue table | Table, live | Module 9 | Loading, loaded, error, empty |
| Reason code tags | Tag list, per row | Module 9 | One tag, multiple tags |
| SLA breach indicator | Icon + color | Module 9 | Normal, approaching, breached |
| Claim button | Button, per row | Module 9 | Available, claiming, claimed-by-other |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Click Claim | Click/tap | Claims the escalation; first claim wins | "Claim an escalation" |
| Filter by team/language | Select filter | List narrows to matching escalations | "View escalation queue" |
| Click a reason-code tag | Click/tap | Expands to show the specific trigger detail | Same as list access |

## Validation Rules
No free-text input fields; filter selections are constrained to enum/multi-select values.

## Loading State
Table renders with skeleton rows; wait-time counters begin updating live once data loads.

## Empty State
"No escalations waiting" shown when the queue is empty for the current filter.

## Error State
"Unable to load escalation queue — retry."

---

**Layer 3 Gate Check:** ✅ All gates passed.
