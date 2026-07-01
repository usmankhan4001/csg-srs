# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-014: Executive ROI Summary
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
Give Executive and Business Owner a quarterly, automatically scheduled summary combining conversion and cost data, clearly labeled Preliminary or Final.

## Wireframe — Desktop
- **Top band**: Quarter picker, with a "Preliminary" / "Final" status badge.
- **Summary KPI cards row**: Total Conversions, Conversion Rate vs. Target, Total AI Spend, Cost per Conversion, Staffing Reduction Estimate.
- **Narrative block**: auto-generated highlights in plain text.
- **Bottom links**: "View full Pipeline Conversion Report" (SCR-P2-012), "View full Cost Monitoring Report" (SCR-P2-013).
- **Top-right**: Export/Print to PDF button.

## Wireframe — Tablet
- KPI cards wrap to 2-column; narrative block and links remain full-width below.

## Wireframe — Mobile
- KPI cards stack single-column; narrative block collapses to a "Read summary" expandable section.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Quarter picker | Select dropdown | Module 12 | Default (most recent), selected |
| Preliminary/Final badge | Status badge | Module 12 | Preliminary, Final |
| Summary KPI cards | Card row | Module 12 (combines Module 8 + Module 11 data) | Loading, loaded, error |
| Narrative block | Generated text | Module 12 | Loading, loaded, error |
| Detail report links | Links | Navigate to SCR-P2-012/013 | N/A |
| Export/Print button | Button | Module 12 | Idle, exporting |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Select a quarter | Dropdown select | Loads that period's summary | "View Executive ROI Summary" |
| Click a detail link | Click/tap | Navigates to the corresponding full report | Permission for that destination report |
| Click Export/Print | Click/tap | Downloads a board-ready PDF | "Export report to CSV/PDF" |

## Validation Rules

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Quarter selection | Enum | From available completed/in-progress quarters | Yes, default most recent | N/A |

## Loading State
KPI cards and narrative block load independently with skeleton placeholders.

## Empty State
"Report not yet generated for this period" shown if the selected quarter hasn't reached its scheduled generation date yet.

## Error State
"Unable to load ROI summary — retry."

---

**Layer 3 Gate Check:** ✅ All gates passed.
