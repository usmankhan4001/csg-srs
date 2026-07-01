# MASTER SRS — P3 AI STUDENT COACH
## Part 7 — Screen Specifications
### Student App — Batch 4: Wellbeing, Profile & Settings (closes Student App surface)

*Layer 3 — UI/UX & Experience · Standalone screen-spec document within the Part 7 set*

| Field | Value |
|---|---|
| Surface | Student App (Web, iOS, Android) |
| Screens in this batch | SCR-WELL-001, SCR-WELL-002, SCR-PLAN-001, SCR-PROFILE-001, SCR-PROFILE-002, SCR-PROFILE-003, SCR-SETTINGS-001 |
| Modules | 4.5 Wellbeing Coach · 4.8 Personalization · 4.6 Student Learning Profile |
| Safety note | SCR-WELL-002 (safe response) wording shown is a structural placeholder; final text requires clinician/DPO sign-off (ASM-AIC-03) per Module 4.5. |

---

## SCR-WELL-001 — Wellbeing Check-in

**Purpose:** Let the student do a private, non-diagnostic mood/stress check-in.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Check In                                     │
├──────────────────────────────────────────────────────────┤
│  How are you feeling today?                                  │
│  😟  😐  🙂  😄        (1–10 scale, optional)                  │
│                                                               │
│  Want to add a note? (optional)                               │
│  [                                                    ]      │
│                                                               │
│  This is private and not a diagnosis. A caring adult          │
│  reviews patterns to support you.                             │
│                                          [Submit →]            │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Mood scale becomes large tappable emoji row, full width; note field collapses to "Add a note" expandable.

| Components | Type | Data Source | States |
|---|---|---|---|
| Mood/stress scale | Slider/emoji selector | 1–10 (4.5.8) | unselected, selected |
| Optional note | Textarea | 0–1,000 chars | empty, typing |
| Disclosure text | Static text | Safety copy (DPO-approved) | always visible |
| Submit button | Primary button | — | enabled, submitting |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Submit check-in | Tap | Recorded as self-report, routed to Psychologist context, not treated as diagnosis (UC-W-02) | Student |

**Validation:** Mood 1–10; note 0–1,000 chars (4.5.8).
**Loading:** N/A. **Empty:** N/A (form default).
**Error:** "Couldn't save your check-in — try again." If risk language is detected in the note, this screen yields immediately to SCR-WELL-002 regardless of submit state (AIC-FR-099 — safety bypasses normal flow).

---

## SCR-WELL-002 — Support & Safe Response (system-triggered)

**Purpose:** Display a supportive, non-clinical response and connect the student to a human when a wellbeing risk signal is detected. This screen is never navigated to manually — it is triggered by the safety/wellbeing detection pipeline (4.5/4.10) from any screen in the app.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│                                                              │
│   Thank you for telling me. You deserve support from         │
│   someone who can help — I've connected you with a           │
│   counselor now.                                              │
│                                                                │
│   You can also reach [Configured Regional Helpline]           │
│   any time. You are not alone.                                 │
│                                                                │
│              [I understand]      [I need help now]            │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Identical centered layout, full-screen takeover (no navigation chrome), large tap targets per ACC-AIC-08.

| Components | Type | Data Source | States |
|---|---|---|---|
| Safe-response message | Static text (DPO/clinician-approved per level) | Module 4.5 escalation level (L1/L2/L3) | L1 (non-blocking banner variant), L2, L3 |
| Helpline reference | Text/link | Helpline registry (4.11) | populated, "default helpline" fallback |
| Acknowledge button | Button | — | default |
| "I need help now" button | Button | — | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Tap "I understand" | Tap | Returns to prior screen; escalation already fired in background (cannot be cancelled, BR-AIC-W-04/EC-AIC-W-02) | Student |
| Tap "I need help now" | Tap | Surfaces immediate contact options (helpline, school contact) | Student |

**Validation:** N/A. **Loading:** N/A — this screen must render within 1 second of detection (AIC-UIR-005); no loading state is acceptable here.
**Empty:** N/A. **Error:** If the helpline registry has no entry for the tenant region, the helpline line is omitted (never a fabricated number) and the connect-to-human action proceeds regardless (BR-AIC-W-10).

---

## SCR-PLAN-001 — My Study Plan / Recommendations

**Purpose:** Show the student's personalized recommendations and an optional sequenced study plan.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        My Study Plan                                 │
├──────────────────────────────────────────────────────────┤
│  Next best step: Review Quadratic Equations  [Why? →]         │
│  [✓ Done] [✗ Not now]                                          │
│                                                                │
│  14-day plan:                                                 │
│  Day 1–3: Algebra review     Day 4–6: Practice quizzes          │
│  Day 7: Mock test            ...                                │
│                                          [Generate new plan →]  │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Plan rendered as a vertical timeline list instead of a horizontal block.

| Components | Type | Data Source | States |
|---|---|---|---|
| Recommendation card | Card | Personalization engine (4.8) | populated, low-confidence, capped (volume cap reached) |
| Accept/dismiss controls | Button pair | AIC-FR-148 | default |
| Plan timeline | Timeline/list | AIC-FR-145 | populated, empty |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Mark done | Tap | Recommendation accepted; feeds future generation | Student |
| Dismiss | Tap, optional reason | Deprioritized for cooldown period (UC-N-04) | Student |
| Generate new plan | Tap | New sequence within stage scope (UC-N-05) | Student |

**Validation:** Dismiss reason 0–300 chars; plan horizon 1–90 days (4.8.8).
**Loading:** Skeleton timeline. **Empty:** "I'm still learning what works for you — here are some good starting points." (cold-start, AIC-FR-149).
**Error:** "Here are some general suggestions for now." if profile/graph temporarily unavailable.

---

## SCR-PROFILE-001 — My Learning Profile

**Purpose:** Let the student see what the coach has learned about them.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        My Learning Profile                            │
├──────────────────────────────────────────────────────────┤
│  Strong topics: Algebra, Cell Biology                          │
│  Weak topics: Trigonometry, Essay structure                     │
│  Learning style: Example-led (inferred, confidence: medium)     │
│                                                                  │
│  [Edit preferences →]   [Something not right? →]                │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Same stacked sections, full width.

| Components | Type | Data Source | States |
|---|---|---|---|
| Strong/weak topic lists | List | Student Learning Profile (4.6) | populated, empty (new student) |
| Learning style + confidence | Text/badge | AIC-FR-107 | populated |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Edit preferences | Tap | Routes to SCR-PROFILE-002 | Student (own only) |
| Request correction | Tap | Routes to SCR-PROFILE-003 | Student (own only) |

**Validation:** N/A. **Loading:** Skeleton text. **Empty:** "I'm just getting to know how you learn — this will improve as we go." (EC-AIC-P-01).
**Error:** "Couldn't load your profile right now" with retry; cached values shown if available, marked stale.

---

## SCR-PROFILE-002 — Preferences

**Purpose:** Let the student set language, explanation style, and TTS preference.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Preferences                                    │
├──────────────────────────────────────────────────────────┤
│  Language: [ Urdu ▾ ]                                          │
│  Explanation style: [ Detailed ▾ ]                             │
│  Read responses aloud: [ On ◯  Off ● ]                          │
│                                          [Save →]               │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Fields stack full-width.

| Components | Type | Data Source | States |
|---|---|---|---|
| Language dropdown | Dropdown | {en, ur, ar} (4.6.8) | default |
| Explanation style dropdown | Dropdown | {concise, detailed, example-led} | default |
| TTS toggle | Switch | {on, off} | default |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Save | Tap | Updates profile preferences; applies to next response | Student (own only) |

**Validation:** Language must be one of {en, ur, ar} (4.6.8). **Loading:** N/A. **Empty:** N/A.
**Error:** "Couldn't save your preferences — try again."

---

## SCR-PROFILE-003 — Request a Correction

**Purpose:** Let the student flag an inferred attribute as wrong.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Request a Correction                           │
├──────────────────────────────────────────────────────────┤
│  Attribute: Learning style — Example-led                       │
│  What should this be instead?                                 │
│  [                                                    ]       │
│                                          [Submit correction →] │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Same single-column form.

| Components | Type | Data Source | States |
|---|---|---|---|
| Attribute reference | Read-only text | Selected attribute (4.6) | default |
| Correction text field | Textarea | 1–500 chars (4.6.8) | empty, typing, error |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Submit correction | Tap | Marks attribute student-corrected (UC-P-03); audit written | Student (own only) |

**Validation:** Correction text 1–500 chars, required (4.6.8).
**Loading:** N/A. **Empty:** N/A.
**Error:** "Tell me what to correct and I'll update it." on empty submit (4.6.9).

---

## SCR-SETTINGS-001 — Settings

**Purpose:** Central hub for account, notification, and consent-related settings.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Settings                                      │
├──────────────────────────────────────────────────────────┤
│  Account                                                      │
│   Notification preferences            [>]                     │
│   Consent status: Approved by guardian [View →]                │
│  About                                                         │
│   Privacy notice                       [>]                     │
│   Data export request                  [>]                     │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Same grouped list, standard mobile settings pattern.

| Components | Type | Data Source | States |
|---|---|---|---|
| Settings list | Grouped list | — | default |
| Consent status row | Status text | Consent register (4.10) | approved, pending, withdrawn |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| View consent | Tap | Shows consent detail (read-only for under-18; self-manage if 18+) | Student |
| Request data export | Tap | Submits a portability request to School Admin/DPO (UC-P-05) | Student (own only) |

**Validation:** N/A. **Loading:** N/A. **Empty:** N/A.
**Error:** "Couldn't submit your request — try again."

---

### Layer 3 gate status — Part 7, Student App Batch 4

| Gate item | Status |
|---|---|
| Screen coverage (this batch) | 7 screens specified |
| All 3 wireframes per screen | Pass |
| Component / action / validation / state tables | Pass for all 7 |
| Safety-critical screen (SCR-WELL-002) special handling | Pass — no loading state, fail-safe helpline omission, escalation non-cancellable |

---

## STUDENT APP SURFACE — CLOSE-OUT

| Batch | Screens | Count |
|---|---|---|
| 1 — Onboarding & Tutor Core | CONSENT-001/002, HOME-001, CHAT-001/002, HW-001 | 6 |
| 2 — Revision Hub | REV-001, QUIZ-001/002/003, FLASH-001/002, SUMM-001, MOCK-001/002/003, SAVED-001 | 11 |
| 3 — Career Hub | CAR-001/002/003/004/005 | 5 |
| 4 — Wellbeing, Profile & Settings | WELL-001/002, PLAN-001, PROFILE-001/002/003, SETTINGS-001 | 7 |
| **Student App total** | | **29 screens** |

*Student App surface complete. Next: Part 7 — Parent App (6 screens), then Teacher Console (7 screens), then School Admin Console (6 screens), then Super Admin Console (9 screens).*
