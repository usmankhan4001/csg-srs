# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-001: Dashboard
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

*Note on wireframes: layout specified as an annotated component map (region → contents → behavior). Pixel-precise visual wireframe images for all screens are compiled separately in Appendix B (Wireframes Package) once the design phase begins.*

## Purpose
Give every internal role a single landing view summarizing pipeline health, escalations, and cost/alert status scoped to their permissions.

## Wireframe — Desktop (>1024px)
- **Top bar**: logo/deployment name (left), role indicator + notifications bell (right).
- **Left rail**: persistent nav (Dashboard, Leads & Pipeline, Conversations, Campaigns, Research, Knowledge Base, Analytics, Admin), icon + label.
- **Main content, 3-column KPI row**: cards for Pipeline-by-stage count, Escalations pending, Monthly AI spend vs. threshold — each card role-filtered per Part 2.4.
- **Below KPI row, 2-column split**: left = Pipeline Funnel mini-chart (links to SCR-P2-002); right = Recent Alerts panel (Module 16, top 5).
- **Bottom band**: Quick Actions row (role-dependent buttons).

## Wireframe — Tablet (640–1024px)
- Left rail collapses to icon-only rail.
- KPI row becomes 2-column, wrapping to a second row.
- Pipeline Funnel and Recent Alerts stack vertically.

## Wireframe — Mobile (<640px)
- Left rail collapses to a hamburger menu.
- KPI cards stack single-column, full width.
- Pipeline Funnel mini-chart simplifies to a single total-count summary with a "View full funnel" link.
- Quick Actions row becomes a horizontally scrollable button strip.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| KPI Card — Pipeline by Stage | Card, numeric + trend arrow | Module 8 (CRM), live | Loading, loaded, error |
| KPI Card — Escalations Pending | Card, numeric | Module 9 | Loading, loaded, error, zero-state |
| KPI Card — Monthly AI Spend | Card, numeric + progress bar vs. threshold | Module 11 | Loading, loaded, error |
| Pipeline Funnel mini-chart | Bar/funnel chart | Module 8/12 | Loading, loaded, error, zero-state |
| Recent Alerts panel | List, top 5 | Module 16 | Loading, loaded, error, zero-state |
| Quick Actions row | Button group, role-filtered | Part 2.4 permissions | Static |
| Date range filter (optional) | Date-pair input | User input | Default applied, invalid-range |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Click a KPI card | Click/tap | Navigate to the corresponding detail screen | View permission for that data |
| Click "View all escalations" | Click/tap | Navigate to SCR-P2-005 | "View escalation queue" |
| Click a Quick Action button | Click/tap | Navigate to the relevant creation/request screen | Permission for that specific action |
| Adjust date range filter | Select dates | Refreshes KPI cards and funnel chart | None |

## Validation Rules

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Date range filter | Date pair | ISO 8601 | No, default last 30 days | End date ≥ start date |

## Loading State
Each card/panel shows an independent skeleton placeholder; cards do not block each other.

## Empty State
Escalations Pending card and Recent Alerts panel show "No escalations right now" / "No recent alerts" when counts are zero.

## Error State
If a single data source fails, only that card shows "Unable to load — retry"; the rest of the dashboard renders normally.

---

**Layer 3 Gate Check:** ✅ All gates passed.
