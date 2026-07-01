# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-012: Pipeline Conversion Report
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
Show conversion rate trends and funnel performance over time, with drill-down to records, export, and scheduled delivery.

## Wireframe — Desktop
- **Top filter bar**: date range, channel, stage.
- **Main**: Conversion rate trend line chart with the KPI target line overlaid (8%→12%→15% phased target); below it, a stage-by-stage conversion table, each row linking to a drill-down view.
- **Top-right controls**: Export button, "Schedule Delivery" button.

## Wireframe — Tablet
- Chart and table stack full-width; controls move into a single "Actions" menu.

## Wireframe — Mobile
- Chart simplifies to current-period value + trend arrow; table becomes a stacked card list.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Filter bar | Multi-select inputs | User input | Default, active-filter |
| Conversion rate trend chart | Line chart | Module 12 | Loading, loaded, error, zero-state |
| Stage conversion table | Table | Module 8/12 | Loading, loaded, error, empty |
| Drill-down link, per stage row | Link | Navigates to SCR-P2-002, filtered | N/A |
| Export button | Button | Module 12 | Idle, exporting |
| Schedule Delivery control | Form/modal | Module 12 | Idle, configuring, saved |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Apply filter | Select filter value | Refreshes chart and table | "View Pipeline Conversion dashboard" |
| Click a stage row | Click/tap | Opens SCR-P2-002 filtered to that stage and date range | Same as above |
| Click Export | Click/tap | Downloads CSV or PDF | "Export report to CSV/PDF" |
| Configure Schedule Delivery | Set frequency + recipients | Report auto-delivers per schedule | "Schedule automated report delivery" |

## Validation Rules

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Date range filter | Date pair | ISO 8601 | No, default last 30 days | End date ≥ start date |
| Delivery frequency | Enum | Daily/Weekly/Monthly/Quarterly | Yes, if scheduling | N/A |

## Loading State
Chart and table render independently with skeleton placeholders.

## Empty State
Chart shows a flat zero-state line with "No conversion data for this period"; table shows "No data" row.

## Error State
"Unable to load conversion data — retry."

---

**Layer 3 Gate Check:** ✅ All gates passed.
