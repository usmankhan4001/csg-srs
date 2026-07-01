# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-008: Request Research Report
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
Let Marketing Manager or Sales Ops Manager submit a research request specifying a target product/service and market/geography, triggering the Research Agent.

## Wireframe — Desktop
- **Form** (left, ~60% width): Target Product/Service Name, Target Market/Geography, Priority (Normal/Urgent dropdown), Submit button.
- **Right panel (~40% width)**: "Your Active Requests" mini-list — request name, status, submitted timestamp, ETA.

## Wireframe — Tablet
- Form and Active Requests panel stack vertically.

## Wireframe — Mobile
- Single-column form; Active Requests panel becomes a collapsible section below, collapsed by default.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Target product/service field | Text input | User input | Default, error |
| Target market/geography field | Text input | User input | Default, error |
| Priority dropdown | Enum select | User input | Default (Normal), selected |
| Submit button | Button | Triggers Module 4 | Idle, submitting, submitted |
| Active Requests list | List | Module 4, live | Loading, loaded, error, empty |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Submit the form | Click Submit | Creates a research request; 48-hour SLA timer starts | "Submit research request" |
| Click an active request | Click/tap | Navigates to SCR-P2-009 filtered to that report | Same as above |

## Validation Rules

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Target product/service name | String | Free text | Yes | Max 200 chars |
| Target market/geography | String | Free text | Yes | Max 100 chars |
| Priority | Enum | Normal/Urgent | No, default Normal | N/A |

## Loading State
Submit button shows an inline spinner and disables during submission.

## Empty State
"No active requests" shown in the side panel when there are none in progress.

## Error State
Empty target market field → "Please specify a target market or geography." A submission-network failure shows "Unable to submit request — retry" without clearing entered form values.

---

**Layer 3 Gate Check:** ✅ All gates passed.
