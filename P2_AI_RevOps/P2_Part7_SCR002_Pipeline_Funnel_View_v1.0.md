# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-002: Pipeline Funnel View
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
Show the full lead/deal pipeline broken down by configurable stage, with filtering and drill-down to individual records.

## Wireframe — Desktop
- **Top filter bar**: date range, channel multi-select, stage multi-select; Export button right-aligned.
- **Main funnel/bar chart**: horizontal bars sized by lead count per stage, stage labels pulled live from Module 8 configuration.
- **Below chart**: drill-down data table — Lead ID, Name, Stage, Channel, Last Activity, Owner, inline stage-override control per row.
- **Bottom**: pagination controls.

## Wireframe — Tablet
- Filter bar collapses into a "Filters" button opening a slide-down panel.
- Funnel chart renders narrower.
- Table becomes horizontally scrollable; Owner and Last Activity hide behind a "more" toggle.

## Wireframe — Mobile
- Funnel chart simplifies to a vertical stack of stage cards.
- Tapping a stage card opens the filtered lead list as a full-screen sheet.
- Export button moves into an overflow menu.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Filter bar (date, channel, stage) | Multi-select inputs | User input | Default applied, active-filter |
| Funnel/bar chart | Chart | Module 8/12, live | Loading, loaded, error, zero-state |
| Drill-down data table | Table, sortable/filterable | Module 8 | Loading, loaded, error, empty |
| Inline stage-override control | Dropdown per row | Module 8 | Default, saving, error |
| Export button | Button | Triggers CSV export | Idle, exporting, complete |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Apply filter | Select filter value | Refreshes chart and table | "View pipeline dashboard" |
| Click a funnel stage | Click/tap | Table drills down to that stage's records | Same as above |
| Click a lead row | Click/tap | Navigate to SCR-P2-003 | View lead/deal record |
| Use inline stage-override dropdown | Select new stage | Manual override applied, takes precedence over automated transitions | "Manually edit lead/deal record" |
| Click Export | Click/tap | Downloads CSV of the filtered table | "Bulk export records" |

## Validation Rules

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Date range filter | Date pair | ISO 8601 | No, default last 30 days | End date ≥ start date |
| Channel filter | Multi-select enum | Web/Ads/WhatsApp/Referral/Email | No, default all | N/A |
| Stage filter | Multi-select | From configured stage list | No, default all | N/A |

## Loading State
Funnel chart and table show independent skeleton placeholders.

## Empty State
"No leads match this filter" shown in place of the table when a filter combination returns zero records; funnel chart still renders with zero-count bars.

## Error State
"Unable to load pipeline data — retry"; an error in the table does not prevent the funnel chart from rendering if its own data call succeeded independently.

---

**Layer 3 Gate Check:** ✅ All gates passed.
