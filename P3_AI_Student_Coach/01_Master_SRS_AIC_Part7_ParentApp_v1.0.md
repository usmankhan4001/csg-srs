# MASTER SRS — P3 AI STUDENT COACH
## Part 7 — Screen Specifications
### Parent App (full surface)

*Layer 3 — UI/UX & Experience · Standalone screen-spec document within the Part 7 set*

| Field | Value |
|---|---|
| Surface | Parent App (mobile-first, also web) |
| Screens | SCR-PHOME-001, SCR-PCONSENT-001, SCR-PCAREER-001, SCR-PWELL-001, SCR-PWEEKLY-001, SCR-PSETTINGS-001 |
| Modules | 4.10 Consent & Safety · 4.4 Career Coach · 4.5 Wellbeing Coach |

---

## SCR-PHOME-001 — Parent Home

**Purpose:** Show a summary card per linked child and route to detail screens.

**Wireframe — Mobile (primary form factor)**
```
┌─────────────────────────────┐
│ [Logo]            [Bell] [⚙]│
├─────────────────────────────┤
│  Zainab — Grade 9             │
│  ✓ Active · 4 sessions/week   │
│  [View career →] [Insights →] │
├─────────────────────────────┤
│  Ahmed — Grade 6               │
│  ⚠ Consent pending             │
│  [Give consent →]              │
└─────────────────────────────┘
```
**Tablet/Desktop:** Cards arranged 2-per-row instead of stacked.

| Components | Type | Data Source | States |
|---|---|---|---|
| Child summary card | Card | P1 enrollment + P3 usage (4.4/4.5) | active, consent-pending, suspended |
| Notification bell | Icon button | Notification service | default, unread-badge |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| View career | Tap | Routes to SCR-PCAREER-001 for that child | Parent (own children only) |
| View insights | Tap | Routes to SCR-PWEEKLY-001 | Parent |
| Give consent | Tap | Routes to SCR-PCONSENT-001 | Parent |

**Validation:** N/A. **Loading:** Skeleton cards. **Empty:** "No children linked yet — contact your school to link your account."
**Error:** "Couldn't load your children's data right now" with retry.

---

## SCR-PCONSENT-001 — Consent Request / Manage Consent

**Purpose:** Let the parent review, give, or withdraw consent for a child's P3 use.

**Wireframe — Mobile**
```
┌─────────────────────────────┐
│ ← Back   Consent — Ahmed     │
├─────────────────────────────┤
│  What the coach does (and    │
│  doesn't do) [Read notice]    │
│                                │
│  Scope: ☑ Tutoring ☑ Revision │
│         ☑ Career ☑ Wellbeing  │
│                                │
│  [Approve consent →]           │
│  Status: Pending since 2 days  │
└─────────────────────────────┘
```
**Tablet/Desktop:** Notice and scope shown side-by-side instead of stacked.

| Components | Type | Data Source | States |
|---|---|---|---|
| Notice summary | Static text | DPO-approved copy | default, expanded |
| Consent scope checkboxes | Checkbox group | 4.10.8 | default |
| Status indicator | Status text | Consent register | pending, approved, withdrawn |
| Approve / Withdraw button | Button | — | default, submitting |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Approve consent | Tap | Consent recorded (UC-S-01); activation unblocked | Parent (child's guardian) |
| Withdraw consent | Tap (if already approved) | Access suspended within window (UC-S-02) | Parent |

**Validation:** >=1 scope item selected before approval (4.10.8).
**Loading:** N/A. **Empty:** N/A.
**Error:** "Couldn't save this right now — try again." If DOB is missing in P1, screen shows "We need to confirm a detail with your school before this can proceed" (4.10.9).

---

## SCR-PCAREER-001 — Child Career Recommendations (read-only)

**Purpose:** Let the parent view the child's career recommendations without editing.

**Wireframe — Mobile**
```
┌─────────────────────────────┐
│ ← Back   Zainab — Career     │
├─────────────────────────────┤
│  Software Engineer            │
│  Data Scientist                │
│  [View full report →]          │
└─────────────────────────────┘
```
**Tablet/Desktop:** Same list, wider card layout.

| Components | Type | Data Source | States |
|---|---|---|---|
| Recommendation list | List (read-only) | Career Coach (4.4) | populated, empty |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| View full report | Tap | Opens child's saved PDF report if generated | Parent (read-only) |

**Validation:** N/A. **Loading:** Skeleton list. **Empty:** "Your child hasn't received recommendations yet."
**Error:** "Couldn't load this right now" with retry.

---

## SCR-PWELL-001 — Child Wellbeing Summary Alerts

**Purpose:** Show summary-level wellbeing notices for a child, never confidential detail.

**Wireframe — Mobile**
```
┌─────────────────────────────┐
│ ← Back   Wellbeing — Ahmed    │
├─────────────────────────────┤
│  We noticed Ahmed may be       │
│  going through a hard time.    │
│  A counselor has reached out.  │
│  [Learn how to support →]      │
└─────────────────────────────┘
```
**Tablet/Desktop:** Same content, centered card layout.

| Components | Type | Data Source | States |
|---|---|---|---|
| Summary alert card | Card | Wellbeing Coach summary output (4.5, BR-AIC-W-07) | none (default), alert-present |
| Support guidance link | Link | Resource content | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Learn how to support | Tap | Shows general (non-clinical) parent guidance content | Parent |

**Validation:** N/A. **Loading:** N/A. **Empty:** "No wellbeing alerts right now."
**Error:** N/A — this screen never fails open with fabricated reassurance; if data can't load, it shows "Couldn't load right now" rather than a blank "all clear" state.

---

## SCR-PWEEKLY-001 — Weekly Insight Summary

**Purpose:** Give the parent a concise weekly digest of usage and progress.

**Wireframe — Mobile**
```
┌─────────────────────────────┐
│ ← Back   This Week — Zainab   │
├─────────────────────────────┤
│  5 tutoring sessions            │
│  2 quizzes completed (avg 78%)  │
│  Top improvement: Algebra        │
└─────────────────────────────┘
```
**Tablet/Desktop:** Same stat list, 2-column layout.

| Components | Type | Data Source | States |
|---|---|---|---|
| Weekly stat list | List/stat cards | Usage + revision performance (4.3/4.8) | populated, empty (low activity week) |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| (read-only) | — | — | Parent |

**Validation:** N/A. **Loading:** Skeleton stats. **Empty:** "Quiet week — no major activity to report."
**Error:** "Couldn't load this week's summary" with retry.

---

## SCR-PSETTINGS-001 — Notification Settings

**Purpose:** Let the parent choose notification channels.

**Wireframe — Mobile**
```
┌─────────────────────────────┐
│ ← Back   Notifications        │
├─────────────────────────────┤
│  Weekly summary: [Email ▾]     │
│  Wellbeing alerts: [Push+SMS▾] │
└─────────────────────────────┘
```
**Tablet/Desktop:** Same list, standard settings pattern.

| Components | Type | Data Source | States |
|---|---|---|---|
| Channel selectors | Dropdown | {push, email, SMS} per category | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Change channel | Select | Updates notification routing | Parent |

**Validation:** >=1 channel selected for wellbeing alerts (cannot fully disable safety-critical alerts).
**Loading:** N/A. **Empty:** N/A.
**Error:** "Couldn't save your preference — try again."

---

### Layer 3 gate status — Part 7, Parent App

| Gate item | Status |
|---|---|
| Screen coverage | 6 of 6 Parent App screens specified |
| Wireframes per breakpoint | Pass — mobile-primary noted, tablet/desktop variant given |
| Component / action / validation / state tables | Pass for all 6 |

*Next: Part 7 — Teacher Console (7 screens).*
