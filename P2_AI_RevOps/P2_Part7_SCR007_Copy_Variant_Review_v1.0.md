# PART 7 — SCREEN SPECIFICATIONS
## SCR-P2-007: Copy Variant Review
### Product: P2 — AI Marketing & Sales RevOps Engine | Layer 3 — UI/UX & Experience

---

## Purpose
Let Marketing Manager review and approve/reject AI-generated copy variants (ad copy, social, email, voice scripts), including side-by-side A/B comparison and Sales Ops review of voice scripts.

## Wireframe — Desktop
- **Top filter bar**: asset type (ad copy / social / email / voice script), campaign, language.
- **Main comparison grid**: 2+ variant columns side-by-side, each tagged with its unique variant ID, each with its own Approve/Reject control.
- **Inline highlight**: any copy segment that couldn't be verified against the Knowledge Base is visually flagged within the text.
- **Low-variance warning banner**: appears above the grid if generated variants are flagged as near-identical.
- **Voice script variants only**: an additional "Reviewed by Sales Ops" status indicator, separate from Marketing Manager approval.

## Wireframe — Tablet
- Variant columns stack vertically; swipeable tabs let the reviewer flip between variants.

## Wireframe — Mobile
- One variant shown at a time with paging dots; swipe to compare.

## Components List

| Component | Type | Data Source | States |
|---|---|---|---|
| Filter bar | Multi-select inputs | User input | Default, active-filter |
| Variant comparison grid | Multi-column content render | Module 6 | Loading, loaded, error, empty |
| Unverified-claim inline flag | Text highlight | Module 6 | None present, one or more flagged |
| Low-variance warning banner | Banner | Module 6 | Hidden, visible |
| Approve/Reject control, per variant | Button + reason field | Module 6 | Idle, approving/rejecting, done |
| "Reviewed by Sales Ops" status | Toggle/badge | Module 6 (voice scripts only) | Not reviewed, reviewed |

## Actions Available

| Action | Trigger | Outcome | Permission Required |
|---|---|---|---|
| Approve a specific variant | Click/tap | That variant becomes eligible for use | "Approve voice agent scripts for live use" / Marketing Manager approval rights |
| Reject a variant + reason | Click/tap + text input | Variant returns to draft with reason logged | Same as above |
| Dismiss/acknowledge low-variance warning | Click "Regenerate" or "Proceed anyway" | Triggers regeneration or proceeds with explicit acknowledgment | Marketing Manager |
| Mark voice script "Reviewed" | Click/tap | Sets Sales Ops review status, separate from approval | "Review voice agent objection-handling scripts" |

## Validation Rules

| Field | Type | Format | Required | Min/Max |
|---|---|---|---|---|
| Rejection reason | String | Free text | Yes, when rejecting | Max 500 chars |

## Loading State
Each variant column loads independently with its own skeleton.

## Empty State
"No copy variants pending review" when the filtered queue is empty.

## Error State
"Unable to load copy variants — retry." A single variant's render failure shows "Unable to load this variant" within its column without blocking review of the others.

---

**Layer 3 Gate Check:** ✅ All gates passed.
