# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-006: Campaign Approval Queue
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
Let Marketing Manager review, approve, or reject AI-generated campaign content before publish; let System Admin monitor queue bottlenecks.

## Wireframe — Desktop
- **Top filter bar**: status (Pending / Approved / Rejected), campaign, language variant.
- **Main list**: Campaign name, asset type, language, source research report link, time-in-queue, Approve/Reject buttons inline.
- **Preview panel** (opens on row click): renders the actual draft content with language-variant tabs, side-by-side with Approve/Reject controls. A stale-report override banner appears here if the source report is flagged stale.

## Wireframe — Tablet
- Preview panel becomes a slide-over.

## Wireframe — Mobile
- List rows become cards; tapping opens the preview full-screen with Approve/Reject as fixed bottom buttons.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Filter bar | Multi-select inputs | User input | Default, active-filter |
| Approval queue table | Table | Module 5 | Loading, loaded, error, empty |
| Preview panel | Content render, tabbed by language | Module 5/6 | Loading, loaded, error |
| Approve button | Button | Module 5 | Idle, approving, approved |
| Reject button + reason field | Button + text input | Module 5 | Idle, rejecting, rejected |
| Stale-report override banner | Banner | Module 4/5 | Hidden, visible |
| Time-in-queue indicator | Per row | Module 5 | Normal, flagged-bottleneck |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Click a queue row | Click/tap | Opens preview panel | "Approve/reject campaign content" or "View approval queue" |
| Click Approve | Click/tap | Content becomes eligible for scheduling/publish | "Approve/reject campaign content" |
| Click Reject + enter reason | Click/tap + text input | Content returns to draft status with reason logged | "Approve/reject campaign content" |
| Approve one language variant, reject another | Click/tap per tab | Per-language partial approval applied | "Approve/reject campaign content" |
| Override stale-report banner | Click "Proceed anyway" | Acknowledges and proceeds despite stale source data | Marketing Manager only |

## Validation Rules

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Rejection reason | String | Free text | Yes, when rejecting | Max 500 chars |

## Loading State
Queue table and preview panel load independently.

## Empty State
"No campaign content pending approval" shown when the queue is empty for the current filter.

## Error State
"Unable to load approval queue — retry." A preview-panel-only failure does not affect the queue list's usability.

---

**Layer 3 Gate Check:** ✅ All gates passed.
