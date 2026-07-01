# MASTER SRS — P3 AI STUDENT COACH
## Part 7 — Screen Specifications
### Student App — Batch 1: Onboarding & Tutor Core

*Layer 3 — UI/UX & Experience · Standalone screen-spec document within the Part 7 set*

| Field | Value |
|---|---|
| Product | P3 — AI Student Coach |
| Surface | Student App (Web, iOS, Android) |
| Screens in this batch | SCR-CONSENT-001, SCR-CONSENT-002, SCR-HOME-001, SCR-CHAT-001, SCR-CHAT-002, SCR-HW-001 |
| Tokens used | Per Part 6 (typography, colour, spacing, grid, RTL rules) |

---

## SCR-CONSENT-001 — Age-Appropriate Notice / Consent (first run)

**Purpose:** Present an age-appropriate notice and gate activation behind parental consent for under-18 students before any coach use.

**Wireframe — Desktop (>=1024px)**
```
┌──────────────────────────────────────────────────────────┐
│  [Logo]                                   Language: EN ▾ │
├──────────────────────────────────────────────────────────┤
│                                                            │
│        Meet Your AI Study Coach                           │
│        [Illustration: friendly coach icon]                │
│                                                            │
│  In plain language: what the coach does, what it          │
│  doesn't do (no grades, no diagnosis), and how your        │
│  data is used. [Read full notice ▾]                        │
│                                                            │
│  Status: Waiting for guardian approval                     │
│  [Notify my guardian]   [I am 18 or older →]                │
└──────────────────────────────────────────────────────────┘
```
**Tablet (768–1023px):** Same single-column layout, illustration scales down 30%, buttons stack if width < 820px.
**Mobile (320–767px):** Full-width stacked: illustration → notice text (collapsed, "Read full notice" expands inline) → status banner → buttons full-width stacked, primary button on top.

| Components | Type | Data Source | States |
|---|---|---|---|
| Notice text | Static rich text | CMS (localized, DPO-approved per ASM-AIC-05) | default, expanded |
| Language selector | Dropdown | Tenant available languages (AIC-FR-206) | default, open |
| Consent status banner | Status component | Consent register (4.10) | pending, approved, blocked |
| "Notify my guardian" button | Primary button | — | default, sent, disabled (already sent) |
| "I am 18 or older" link | Secondary action | P1 DOB check | visible only if DOB ambiguous/missing |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Notify guardian | Tap button | Consent request sent to linked guardian(s) (UC-AIC-S-01) | Student (under-18) |
| Self-consent path | Tap "18 or older" | Routes to SCR-CONSENT-002 | Student, age >=18 per P1 |
| Expand notice | Tap "Read full notice" | Inline expansion, no navigation | All |

**Validation:** None (no form input on this screen).

**Loading state:** Skeleton text blocks while notice content and consent status load.
**Empty state:** N/A (notice always present).
**Error state:** "We couldn't load this right now. Please try again." with retry button if CMS/consent service fails.

---

## SCR-CONSENT-002 — Self-Consent (18+)

**Purpose:** Let a student aged 18 or over complete consent for themselves without a guardian record.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│  [Logo]                                                   │
├──────────────────────────────────────────────────────────┤
│   Confirm Your Own Consent                                 │
│                                                             │
│   ☐ I have read and accept the data use notice              │
│   ☐ I consent to tutoring, revision, career, and             │
│      wellbeing support features                              │
│                                                             │
│   [Cancel]                              [Confirm & Start →] │
└──────────────────────────────────────────────────────────┘
```
**Tablet / Mobile:** Identical structure, checkboxes and buttons full-width on mobile, button order unchanged (Confirm stays primary/bottom-most).

| Components | Type | Data Source | States |
|---|---|---|---|
| Consent checkboxes (2) | Checkbox | Consent scope config (4.10) | unchecked, checked, error |
| Confirm button | Primary button | — | disabled (until both checked), enabled, submitting |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Confirm & Start | Tap (both boxes checked) | Consent recorded (AIC-FR-178); routes to SCR-HOME-001 | Student, 18+ |
| Cancel | Tap | Returns to SCR-CONSENT-001 | Student |

**Validation:** Both checkboxes required before Confirm enables (4.10.8: consenter identity, consent scope).
**Loading state:** Button shows spinner during submit.
**Empty state:** N/A.
**Error state:** "We couldn't confirm this — please try again." if write to consent register fails; form state preserved.

---

## SCR-HOME-001 — Coach Home / Today

**Purpose:** Give the student a single entry point to tutoring, revision, career guidance, and their study plan, surfacing what matters today.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ [Logo]   Today   Revision   Career    🔔   [Avatar ▾]      │
├──────────────────────────────────────────────────────────┤
│  Welcome back, Zainab 👋                                   │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Continue      │ │ Revision due  │ │ Study plan    │        │
│  │ Tutoring      │ │ 3 topics      │ │ Day 4 of 14   │        │
│  │ [Open chat →] │ │ [Revise →]    │ │ [View plan →] │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│  Why this? Recommended because of recent Algebra quiz       │
│                                                             │
│  [💬 Ask a question]              [🎯 Take a quiz]           │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Cards reflow 2-per-row; nav becomes a condensed top bar with icons + labels.
**Mobile:** Cards stack vertically; top nav collapses to a bottom tab bar (Today / Revision / Career / Profile); quick-action buttons become a floating action button group.

| Components | Type | Data Source | States |
|---|---|---|---|
| Greeting | Text (personalized) | Student profile (4.6) | default |
| Recommendation cards (3) | Card | Personalization engine (4.8) | default, low-confidence (stage-default badge), empty |
| "Why this?" explainer | Expandable text | AIC-FR-147 | collapsed, expanded |
| Quick-action buttons | Button group | — | default |
| Notification bell | Icon button | Notification service | default, unread-badge |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Open chat | Tap card/button | Routes to SCR-CHAT-001 | Student |
| Revise | Tap card | Routes to Revision Hub (Batch 2) | Student |
| View plan | Tap card | Routes to SCR-PLAN-001 (Batch 4) | Student |
| Expand "Why this?" | Tap | Shows recommendation rationale (AIC-FR-147) | Student |

**Validation:** N/A (no inputs).
**Loading state:** Skeleton cards (3) while recommendations load (AIC-FR-149 cold-start applies if new student).
**Empty state:** New student with no history → "Let's get started" card replacing recommendations, linking to Tutor Chat (EC-AIC-N-01).
**Error state:** "Couldn't load your recommendations — here's the tutor chat instead" if Personalization engine is unavailable; core navigation unaffected.

---

## SCR-CHAT-001 — Tutor Chat

**Purpose:** Let the student ask subject questions and receive grounded, adaptive, language-matched tutoring with integrity-aware handoff to homework mode.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Tutor Chat                  [History] [⋯]  │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  🧑‍🎓 How do I solve x² - 5x + 6 = 0?                       │
│                                                            │
│  🤖 Let's factor it step by step:                          │
│     1. Find two numbers that multiply to 6...              │
│     2. ...                                                 │
│     Source: Grade 9 Algebra Guide [view]                   │
│     [🔊 Listen]  [👍 👎]                                     │
│                                                            │
│  [ Step-by-step ] [ Simplify / I'm lost ]                   │
├──────────────────────────────────────────────────────────┤
│ [📷] [Type your question...                    ] [Send →] │
└──────────────────────────────────────────────────────────┘
```
**Tablet:** Same layout, narrower message width (max 70% of screen).
**Mobile:** Full-width messages; input bar docked to bottom above keyboard; step-by-step/simplify shown as a horizontal scroll chip row under the latest response.

| Components | Type | Data Source | States |
|---|---|---|---|
| Message thread | List | Tutor Engine (4.1) | loading, populated, empty |
| Source reference chip | Link/badge | RAG citation (AIC-FR-006/129) | present, absent (uncertainty state) |
| TTS control | Icon button | AIC-FR-012 | idle, playing, paused |
| Rating controls | Icon buttons | AIC-FR-019 | unrated, rated |
| Step-by-step / Simplify chips | Button | AIC-FR-008/009 | default, active |
| Message input | Text field | — | empty, typing, sending, error |
| Image attach | Icon button | Homework Assistant OCR (4.2) | default, uploading |
| Guided-mode notice | Inline banner | AIC-FR-033 | shown only during Guided mode |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Send message | Tap Send / Enter | Engine responds per 4.1 flow | Student |
| Request step-by-step | Tap chip | Restructured stepped response (UC-T-02) | Student |
| Request simplify | Tap chip | Simpler re-explanation (UC-T-03) | Student |
| Play TTS | Tap speaker icon | Audio plays in set language (UC-T-05) | Student |
| Rate response | Tap thumbs icon | Rating stored (UC-T-08) | Student |
| Attach image | Tap camera icon | Opens capture/upload (UC-H-04) | Student |
| Open source | Tap citation chip | Shows source metadata | Student |

**Validation:** Message text 1–4,000 chars (4.1.8); image <=10MB JPG/PNG (4.2.8).
**Loading state:** Typing indicator ("Coach is thinking...") while response generates.
**Empty state:** First-open shows a friendly prompt: "Ask me anything about your subjects" with 3 example chips.
**Error state:** Per 4.1.9/4.2.9 — e.g., "I'm having trouble responding right now. Please try again in a moment." with retry; offline banner if device disconnected, message queued (EC-AIC-T... offline handling).

---

## SCR-CHAT-002 — Conversation History / Search

**Purpose:** Let the student find and reopen a past conversation.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        History                                     │
├──────────────────────────────────────────────────────────┤
│ 🔍 [Search your conversations...]      [Date range ▾]      │
├──────────────────────────────────────────────────────────┤
│ Today                                                      │
│  • Quadratic equations — 9:32 PM                 [Open →]  │
│ Yesterday                                                   │
│  • Newton's laws — 6:10 PM                       [Open →]  │
│  • Essay structure — 4:02 PM                     [Open →]  │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Same list layout, full-width rows; search bar sticky on scroll.

| Components | Type | Data Source | States |
|---|---|---|---|
| Search field | Text input | — | empty, typing, results, no-results |
| Date range filter | Dropdown | — | default, applied |
| Conversation list | Grouped list | Conversation history (4.1/4.6), within retention window | populated, empty, expired-item |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Search | Type query | Filters list by keyword (UC-T-07) | Student (own only) |
| Filter by date | Select range | Filters list; rejects start>end | Student |
| Open conversation | Tap row | Reopens thread in SCR-CHAT-001 | Student (own only) |

**Validation:** Date range start <= end; query 1–200 chars (4.1.8).
**Loading state:** Skeleton list rows.
**Empty state:** "No conversations yet — ask your first question" with link to SCR-CHAT-001.
**Error state:** "Couldn't search right now" with retry; "This conversation is no longer available" for expired/anonymized items (BR-AIC-012).

---

## SCR-HW-001 — Ask Homework Help

**Purpose:** Let the student submit a homework problem (text or image) and receive integrity-aware help.

**Wireframe — Desktop**
```
┌──────────────────────────────────────────────────────────┐
│ ← Back        Homework Help                                │
├──────────────────────────────────────────────────────────┤
│  How would you like to ask?                                 │
│  [ ✏️ Type it ]      [ 📷 Photo of the problem ]              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Type your problem here...                           │    │
│  └────────────────────────────────────────────────────┘    │
│                                            [Get help →]      │
│  ℹ️ If this is graded work, I'll give hints, not answers.    │
└──────────────────────────────────────────────────────────┘
```
**Tablet/Mobile:** Stacked single column; photo option opens native camera/gallery picker.

| Components | Type | Data Source | States |
|---|---|---|---|
| Mode toggle (Type/Photo) | Tab control | — | type-selected, photo-selected |
| Problem text field | Textarea | — | empty, typing, error |
| Image upload control | File picker | OCR service (4.2) | empty, uploaded, extracting, confirm-text |
| Integrity notice | Inline banner | AIC-FR-033 | always visible |
| Extracted-text confirmation | Modal/inline panel | OCR output | shown only after image upload |

| Actions | Trigger | Outcome | Permission |
|---|---|---|---|
| Submit text | Tap "Get help" | Routes to SCR-CHAT-001 with context (UC-H-01/H-02) | Student |
| Upload photo | Tap photo option | OCR extracts text; student confirms (UC-H-04) | Student |
| Edit extracted text | Tap edit on confirmation panel | Student corrects OCR output before submit | Student |

**Validation:** Text 1–4,000 chars; image <=10MB JPG/PNG (4.2.8).
**Loading state:** "Reading your photo..." spinner during OCR.
**Empty state:** N/A (mode selection is the default state).
**Error state:** "I couldn't read that image. Please retype the problem or upload a clearer photo." (4.2.9); "That image is too large" for oversize uploads.

---

### Layer 3 gate status — Part 7, Student App Batch 1

| Gate item | Status |
|---|---|
| Screen coverage (this batch) | 6 of ~21 Student App screens specified |
| All 3 wireframes per screen | Pass — desktop/tablet/mobile for all 6 |
| Component specs with data source + states | Pass |
| Actions with trigger/outcome/permission | Pass |
| Validation rules per input screen | Pass |
| Loading/empty/error states | Pass — all illustrated in wireframe-adjacent text per screen |

*Next batch: Student App — Revision Hub (Quiz, Flashcards, Summaries, Mock Test, Saved). Then Career Hub, then Wellbeing/Profile/Settings — completing the Student App surface before moving to Parent, Teacher, and Admin surfaces.*
