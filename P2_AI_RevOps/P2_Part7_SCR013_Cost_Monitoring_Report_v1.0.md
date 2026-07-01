# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-013: Cost Monitoring Report
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
Show LLM API, GPU, and voice/telephony cost broken down by component against the configured threshold, for System Admin and Business Owner.

## Wireframe — Desktop
- **Top band**: prominent month-to-date total spend vs. configured threshold (<$1,000/month), shown as a progress bar with exact figures.
- **Filter bar**: date range, component (LLM API / GPU / Voice).
- **Main**: stacked area/bar chart showing daily or weekly cost by component.
- **Below chart**: itemized table — component, cost, % of total, trend vs. prior period.
- **Notice area** (conditional): "Data as of [timestamp]" banner during billing provider outages.

## Wireframe — Tablet
- Threshold progress bar and chart stack full-width; table remains below, horizontally scrollable if needed.

## Wireframe — Mobile
- Threshold progress bar stays at top; chart simplifies to current total only with a "View breakdown" expand link; table becomes stacked cards.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Threshold progress bar | Progress indicator + numeric | Module 11 | Under threshold, near threshold, exceeded |
| Filter bar | Multi-select inputs | User input | Default, active-filter |
| Stacked cost chart | Chart | Module 12 | Loading, loaded, error |
| Itemized cost table | Table | Module 12 | Loading, loaded, error |
| "Data as of" notice banner | Banner | Module 12 | Hidden, visible |
| Export button | Button | Module 12 | Idle, exporting |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Apply filter | Select filter value | Refreshes chart and table | "View Cost Monitoring view" |
| Click Export | Click/tap | Downloads CSV or PDF | "Export report to CSV/PDF" |
| Click a chart segment | Click/tap | Highlights the corresponding table row | Same as filter access |

## Validation Rules

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Date range filter | Date pair | ISO 8601 | No, default current month | End date ≥ start date |

## Loading State
Threshold progress bar, chart, and table each load independently with skeleton placeholders.

## Empty State
Not generally applicable; a brand-new deployment shows "$0.00 spent this month" rather than an empty-state message.

## Error State
During a billing provider outage, shows the last successfully retrieved figures with the "Data as of [timestamp]" notice rather than blank or zero values.

---

**Layer 3 Gate Check:** ✅ All gates passed.
