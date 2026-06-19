# APPENDIX B — SCREEN WIREFRAMES (1/5)
## M01 Admissions · M02 Live Classes · M03 Assignment · M04 Exam

**Status:** ✅ Complete
*Referenced from [Part 7 — Screen Specifications](../01_Master_SRS/Layer_3_UI_UX/Part_7_Screen_Specifications.md). This is the canonical Appendix B location for all wireframes per the production guide.*
 — ASCII wireframes (desktop primary) + reflow notes

*Each screen follows Part 7's required elements: ID, Purpose, Wireframe, Components, Actions, Validation, States. Tablet/Mobile shown as reflow notes rather than separate full diagrams — the layout principle is stated once and applies consistently per Part 6.4's breakpoint rules.*

---

## SCR-ADM-001 — Admissions Dashboard
**Purpose:** Gives School Admin a single view of the inquiry-to-enrolment funnel.

```
┌─────────────────────────────────────────────────────────────────┐
│ Admissions                                    [+ New Inquiry]   │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│ │Inquiries│ │Applied  │ │Accepted │ │Enrolled │  ← KPI cards    │
│ │   42    │ │   28    │ │   19    │ │   15    │                │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                │
├─────────────────────────────────────────────────────────────────┤
│ Funnel                                                           │
│ Inquiry ████████████████████████████████████████ 42             │
│ Applied ████████████████████████████ 28                         │
│ Interview █████████████████████ 22                              │
│ Accepted ██████████████████ 19                                  │
│ Enrolled ███████████████ 15                                     │
├─────────────────────────────────────────────────────────────────┤
│ Recent Applications                          [Search] [Filter▾] │
│ ┌───────────────┬────────┬───────────┬──────────┬─────────────┐│
│ │ Applicant     │ Grade  │ Stage     │ Source   │ Action      ││
│ ├───────────────┼────────┼───────────┼──────────┼─────────────┤│
│ │ Ahmed Khan    │ Gr 5   │ Interview │ Web Form │ [View]      ││
│ │ Sara Ali      │ Gr 3   │ Documents │ Referral │ [View]      ││
│ └───────────────┴────────┴───────────┴──────────┴─────────────┘│
└─────────────────────────────────────────────────────────────────┘
```
**Components:** KPI cards (data: live count from applications table) · Funnel chart (data: stage counts) · Application table (sortable, filterable) · Search bar · Filter dropdown (stage, grade, source)
**Actions:** New Inquiry (opens SCR-ADM-002) → View (opens SCR-ADM-004) → Export table to CSV
**Validation:** N/A (read-only dashboard)
**Loading:** Skeleton cards + skeleton table rows · **Empty:** "No applications yet — click New Inquiry to get started" · **Error:** "Couldn't load admissions data — Retry"
**Reflow:** Tablet — KPI cards wrap to 2×2 grid. Mobile — KPI cards stack vertically, funnel becomes horizontal scroll, table becomes card list (one applicant per card).

---

## SCR-ADM-002 — Inquiry / Application Form Builder
**Purpose:** Lets School Admin build the public-facing application form with conditional logic.

```
┌─────────────────────────────────────────────────────────────────┐
│ Form Builder — Grade 5 Application          [Preview] [Publish] │
├───────────────────────┬───────────────────────────────────────────┤
│ Field Palette          │  Form Canvas                            │
│ ┌───────────────────┐  │  ┌────────────────────────────────────┐ │
│ │ □ Text             │  │  │ Step 1 of 3: Student Information   │ │
│ │ □ Number           │  │  ├────────────────────────────────────┤ │
│ │ □ Date             │  │  │ [Drag field here]                  │ │
│ │ □ Dropdown         │  │  │ Full Name *          [text input]  │ │
│ │ □ Checkbox         │  │  │ Date of Birth *      [date picker] │ │
│ │ □ File Upload      │  │  │ Grade Applying For * [dropdown]    │ │
│ │ □ Signature        │  │  │                                     │ │
│ └───────────────────┘  │  │ ⚙ Conditional: IF Grade=AS Level    │ │
│                        │  │   SHOW "Previous O-Level results"   │ │
│                        │  └────────────────────────────────────┘ │
│                        │  [+ Add Step]                           │
└───────────────────────┴───────────────────────────────────────────┘
```
**Components:** Field palette (draggable) · Form canvas (drop zone, multi-step) · Conditional logic editor (IF/THEN rule builder) · Step navigator · Preview toggle
**Actions:** Drag field to canvas → Configure field (label, required, validation) → Add conditional rule → Add step → Preview → Publish
**Validation:** Each field requires a label before it can be saved · At least one field per step · Required toggle per field
**Loading:** "Loading form…" · **Empty:** Empty canvas shows "Drag a field from the palette to begin" · **Error:** "Couldn't save form — your changes are kept locally, retry saving"
**Reflow:** Tablet — palette collapses to a floating button. Mobile — not supported for form building (admin-only desktop tool); shows "Please use a desktop browser to build forms."

---

## SCR-ADM-003 — Public Application Form (Applicant-facing)
**Purpose:** What the prospective parent fills out.

```
┌─────────────────────────────────────────────────────────────────┐
│         [School Logo]   Lighthouse International School         │
│                  Grade 5 Application — Step 1 of 3               │
│         ●━━━━━━○━━━━━━○                                          │
├─────────────────────────────────────────────────────────────────┤
│  Student Full Name *                                             │
│  [________________________________]                              │
│                                                                    │
│  Date of Birth *                                                  │
│  [____/____/______]                                               │
│                                                                    │
│  Grade Applying For *                                             │
│  [Grade 5 ▾]                                                      │
│                                                                    │
│  Parent / Guardian Email *                                        │
│  [________________________________]                              │
│                                                                    │
│  Parent / Guardian Phone *                                        │
│  [________________________________]                              │
│                                                                    │
│  How did you hear about us?                                       │
│  [Select... ▾]                                                    │
│                                                                    │
│                              [Save & Continue Later]  [Next →]   │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Progress indicator (3 dots) · Branded header with school logo · Field inputs per builder config · Save-and-resume link
**Actions:** Fill fields → Next (validates current step) → Save & Continue Later (emails resume link) → Submit (final step)
**Validation:** All `*` fields required before Next is enabled · Email format check · Phone format check · Date of Birth must result in age appropriate for selected grade (warning, not hard block)
**Loading:** N/A (static form) · **Empty:** N/A · **Error:** Inline red text under each invalid field: "This field is required" / "Enter a valid email address"
**Reflow:** Tablet — same single-column layout, wider margins. Mobile — full-width inputs, sticky Next button at bottom of viewport.

---

## SCR-ADM-004 — Application Detail / Review
**Purpose:** Admin reviews one application, verifies documents, moves through stages.

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back    Ahmed Khan — Grade 5 Application        Stage: ●●●○○  │
├───────────────────────────────┬───────────────────────────────────┤
│ Application Details            │ Document Checklist               │
│                                 │ ✅ Birth Certificate              │
│ Name: Ahmed Khan                │ ✅ Previous School Transcript     │
│ DOB: 12 Mar 2016                │ ⚠️  Vaccination Record — Missing  │
│ Parent: Bilal Khan               │ ✅ Passport Copy                  │
│ Email: bilal@email.com          │                                   │
│ Phone: +92 300 1234567          │ [Request Missing Document]        │
│ Source: Web Form                │                                   │
│                                 ├───────────────────────────────────┤
│ Internal Notes                  │ Interview                        │
│ [________________________]      │ Scheduled: 22 Jun, 10:00 AM       │
│ [Add Note]                      │ Interviewer: Ms. Fatima           │
│                                 │ [Schedule Interview]               │
├───────────────────────────────┴───────────────────────────────────┤
│ [Reject]              [Waitlist]              [Accept →]          │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Stage progress dots · Application detail panel (read-only) · Document checklist with status icons · Internal notes (admin-only, timestamped) · Interview scheduling card · Decision action bar
**Actions:** Add internal note → Request missing document (sends auto-email) → Schedule interview (opens calendar picker) → Reject/Waitlist/Accept (triggers Part 3.3 workflow)
**Validation:** Cannot click Accept while a document is flagged ⚠️ Missing unless admin explicitly overrides with reason
**Loading:** Skeleton panels · **Empty:** N/A (always has data once opened) · **Error:** "Couldn't load application — Retry"
**Reflow:** Tablet — two columns stack to one. Mobile — same, with sticky decision bar at bottom.

---

## SCR-ADM-005 — Interview Scheduler
**Purpose:** Calendar-based interview booking with interviewer assignment.

```
┌─────────────────────────────────────────────────────────────────┐
│ Schedule Interview — Ahmed Khan                          [✕]    │
├─────────────────────────────────────────────────────────────────┤
│ Interviewer:  [Ms. Fatima ▾]                                     │
│                                                                    │
│         June 2026                                                │
│  Mo Tu We Th Fr Sa Su                                            │
│              1  2  3  4                                          │
│   5  6  7  8  9 10 11                                            │
│  12 13 14 15 16 17 18                                            │
│  19 20 21 [22] 23 24 25  ← selected                              │
│  26 27 28 29 30                                                  │
│                                                                    │
│ Available slots on 22 June:                                       │
│ ( ) 09:00 AM   (•) 10:00 AM   ( ) 11:30 AM   ( ) 02:00 PM        │
│                                                                    │
│ ☑ Send calendar invite to parent                                  │
│ ☑ Send calendar invite to interviewer                             │
│                                                                    │
│                                    [Cancel]   [Confirm Schedule]  │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Interviewer dropdown · Calendar widget (highlights interviewer's existing bookings as unavailable) · Time slot radio list · Notification checkboxes
**Actions:** Select date → select available slot → Confirm Schedule (creates calendar invites via Part 4.10.4)
**Validation:** Cannot select a date/time where the interviewer already has a booking · Cannot schedule in the past
**Loading:** "Checking interviewer availability…" · **Empty:** "No available slots this week — try another interviewer" · **Error:** "Couldn't create the calendar invite — interview saved, please send invites manually"
**Reflow:** Tablet — modal width 90%. Mobile — full-screen modal, calendar becomes a date-picker dropdown instead of grid.

---

## SCR-CLS-001 — Live Class Schedule List
**Purpose:** Teacher's view of all scheduled, live, and past classes.

```
┌─────────────────────────────────────────────────────────────────┐
│ Live Classes                                  [+ Schedule Class] │
├─────────────────────────────────────────────────────────────────┤
│ [Today] [This Week] [Upcoming] [Past]                            │
├─────────────────────────────────────────────────────────────────┤
│ 🔴 LIVE NOW                                                      │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Grade 8 Mathematics — Algebra Ch.3        [Join as Host →]  │ │
│ │ Started 09:05 AM · 22 students joined                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                    │
│ TODAY                                                             │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🕐 11:00 AM  Grade 7 Science — Photosynthesis    [Start]     │ │
│ │ 🕐 02:00 PM  Grade 9 English — Essay Workshop     [Start]    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                    │
│ THIS WEEK                                                         │
│ Wed 24 Jun · Grade 8 Mathematics · 09:00 AM      [Edit] [Cancel] │
│ Fri 26 Jun · Grade 8 Mathematics · 09:00 AM      [Edit] [Cancel] │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Tab filter (Today/Week/Upcoming/Past) · Live-now banner card (pulsing red dot) · Today's class list · Upcoming list with recurrence indicator
**Actions:** Schedule Class (opens SCR-CLS-002) → Start (launches SCR-CLS-003) → Join as Host → Edit/Cancel a scheduled session
**Validation:** Cannot cancel a class that has already started
**Loading:** Skeleton list · **Empty:** "No classes scheduled — click Schedule Class to create one" · **Error:** "Couldn't load schedule — Retry"
**Reflow:** Tablet — same list, narrower cards. Mobile — cards stack full-width, tab filter becomes horizontal scroll chips.

---

## SCR-CLS-002 — Schedule Live Class (Modal)
**Purpose:** Configure a new live class session.

```
┌─────────────────────────────────────────────────────────────────┐
│ Schedule Live Class                                       [✕]   │
├─────────────────────────────────────────────────────────────────┤
│ Title *           [Algebra Chapter 3___________________]         │
│ Class/Section *   [Grade 8 Mathematics ▾]                        │
│ Date *            [22 / 06 / 2026]    Time * [09:00 AM]          │
│ Duration *        [60 min ▾]                                     │
│ Platform *        ( ) Zoom  (•) Jitsi  ( ) Google Meet  ( ) Teams│
│ Recurrence        ( ) None  (•) Weekly  ( ) Daily  ( ) Custom    │
│                   Repeat on: ☑Mon ☐Tue ☑Wed ☐Thu ☑Fri           │
│ Max Participants  [50_____]                                      │
│ ☑ Enable waiting room    ☑ Auto-record    ☐ Lock after start    │
│                                                                    │
│ Pre-class materials  [📎 Attach files]                           │
│                                                                    │
│                                    [Cancel]      [Schedule]       │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Title input · Class/section dropdown · Date/time pickers · Duration dropdown · Platform radio group · Recurrence selector with day checkboxes · Toggle switches · File attach
**Actions:** Configure fields → Schedule (creates session(s) per Part 4.1.3) → Cancel
**Validation:** Title required · Date cannot be in the past · At least one recurrence day if Weekly selected · Conflict check against teacher's existing timetable (RISK-T-001-adjacent rule, Part 9.4 `409 TEACHER_DOUBLE_BOOKED`)
**Loading:** Submit button shows spinner during conflict check · **Empty:** N/A · **Error:** "This time conflicts with [other class name] — choose a different time"
**Reflow:** Tablet — modal 85% width. Mobile — full-screen, fields stack single column.

---

## SCR-CLS-003 — Live Class Room (Teacher View)
**Purpose:** In-session controls during a live class.

```
┌─────────────────────────────────────────────────────────────────┐
│ Grade 8 Mathematics — Algebra Ch.3        🔴 LIVE  00:23:14      │
├──────────────────────────────────────┬────────────────────────────┤
│                                       │ Participants (22)          │
│        [Main video / Screen share]   │ 🎤 Ms. Fatima (Host)        │
│                                       │ 🔇 Ahmed Khan               │
│                                       │ 🔇 Sara Ali       ✋ raised │
│                                       │ 🔇 22 more...                │
│                                       ├────────────────────────────┤
│                                       │ Chat                        │
│                                       │ Sara: can you repeat that? │
│                                       │ [Type a message...]        │
├──────────────────────────────────────┴────────────────────────────┤
│ [🎤Mute All] [📹] [🖥 Share] [✏️ Whiteboard] [📊 Poll] [⛓ Breakout]│
│ [⏺ Recording: ON] [🔒 Lock Class] [📎 Files]      [End Class]    │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Video/screen-share canvas · Participant list with mic/hand-raise state · Live chat panel · Control toolbar (mute all, camera, share, whiteboard, poll, breakout, recording toggle, lock, files, end)
**Actions:** Mute individual/all · Remove participant · Launch poll/quiz · Create breakout rooms · Toggle recording · End class (triggers attendance export + recording processing, Part 4.1.3)
**Validation:** End Class requires confirmation dialog ("End for everyone? This cannot be undone.")
**Loading:** "Connecting to session…" · **Empty:** N/A (always has the teacher) · **Error:** "Connection lost — reconnecting…" with auto-retry
**Reflow:** Tablet — participant panel collapsible to icon. Mobile — video full-screen, toolbar becomes bottom sheet, participant/chat as swipeable tabs.

---

## SCR-CLS-004 — Live Class Room (Student View)
**Purpose:** Student's in-session experience.

```
┌─────────────────────────────────────────────────────────────────┐
│ Grade 8 Mathematics                       🔴 LIVE  00:23:14      │
├──────────────────────────────────────┬────────────────────────────┤
│                                       │ Chat                       │
│      [Teacher's shared screen]       │ Ms.Fatima: Open your books │
│                                       │ Ahmed: got it!             │
│                                       │                             │
│      [Your camera — small tile]      │ [Type a message...]        │
│                                       │                             │
├──────────────────────────────────────┴────────────────────────────┤
│ [🎤Mute] [📹Camera] [✋Raise Hand] [😀React] [I'm Lost 🆘] [Leave]│
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Shared screen viewer · Self-camera tile · Live chat · Reaction emoji picker · "I'm Lost" private signal button · Control bar
**Actions:** Toggle mic/camera · Raise hand (joins queue) · Send chat · React with emoji · Click "I'm Lost" (private alert to teacher only) · Leave class
**Validation:** N/A
**Loading:** "Joining class…" with pre-class technical check (camera/mic/bandwidth test) shown first · **Empty:** N/A · **Error:** "Couldn't join — check your internet connection" with Retry
**Reflow:** Tablet — chat collapses to toggle button. Mobile — full-screen shared content, controls as bottom bar, chat/participants as swipe-up sheet.

---

## SCR-CLS-005 — Recording Library
**Purpose:** Browse and watch past class recordings.

```
┌─────────────────────────────────────────────────────────────────┐
│ Class Recordings                          [Search recordings...] │
├─────────────────────────────────────────────────────────────────┤
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐           │
│ │ [thumbnail]    │ │ [thumbnail]    │ │ [thumbnail]    │           │
│ │ Algebra Ch.3   │ │ Photosynthesis │ │ Essay Workshop │           │
│ │ 22 Jun · 58min │ │ 20 Jun · 45min │ │ 18 Jun · 52min │           │
│ └───────────────┘ └───────────────┘ └───────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Search bar · Recording thumbnail grid (date, duration shown)
**Actions:** Click recording → opens player (SCR-CLS-005b below)
**Validation:** N/A
**Loading:** Skeleton thumbnail grid · **Empty:** "No recordings yet" · **Error:** "Couldn't load recordings — Retry"
**Reflow:** Tablet — 2-column grid. Mobile — 1-column grid, full-width cards.

### SCR-CLS-005b — Recording Player
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back     Algebra Chapter 3 — 22 June 2026                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                    │
│                  [Video Player — 16:9]                            │
│                                                                    │
│  ▶ ━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━  23:14 / 58:02  [1x▾] [⛶]  │
├─────────────────────────────────────────────────────────────────┤
│ Chapters                          │ Transcript (searchable)       │
│ 00:00 Introduction                │ [Search transcript...]        │
│ 05:30 Linear Equations            │ "Today we'll cover linear..." │
│ 22:10 Practice Problems           │                                │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Video player with scrubber, speed control (0.5x–2x), fullscreen toggle · Chapter list (click jumps to timestamp) · Searchable transcript panel
**Actions:** Play/pause/seek · Change speed · Click chapter to jump · Search transcript · Download (if enabled)
**Validation:** N/A
**Loading:** "Loading recording…" buffering spinner · **Empty:** N/A · **Error:** "Recording unavailable — contact your teacher"
**Reflow:** Tablet — chapters/transcript stack below video. Mobile — same, full-width.

---

## SCR-ASN-001 — Assignment List
**Purpose:** Teacher's view of all assignments across their classes; Student's view filtered to their own.

```
┌─────────────────────────────────────────────────────────────────┐
│ Assignments                                [+ Create Assignment] │
├─────────────────────────────────────────────────────────────────┤
│ [All] [Pending] [Submitted] [Graded] [Overdue]    [Grade 8A ▾]  │
├──────────────────────────┬──────────┬─────────────┬─────────────┤
│ Title                     │ Due      │ Submissions │ Status      │
├──────────────────────────┼──────────┼─────────────┼─────────────┤
│ Algebra Worksheet 3       │ 25 Jun   │ 18/25       │ Open        │
│ Lab Report — Photosynthesis│ 20 Jun  │ 25/25       │ Grading     │
│ Essay: My Summer          │ 15 Jun   │ 25/25       │ Graded      │
└──────────────────────────┴──────────┴─────────────┴─────────────┘
```
**Components:** Status tab filter · Class dropdown filter · Assignment table (title, due date, submission count, status badge)
**Actions:** Create Assignment (opens SCR-ASN-002) → Click row (opens SCR-ASN-003 submission queue, or student's own submission view)
**Validation:** N/A
**Loading:** Skeleton table · **Empty:** "No assignments yet" · **Error:** "Couldn't load assignments — Retry"
**Reflow:** Tablet — table scrolls horizontally. Mobile — table becomes card list, one assignment per card.

---

## SCR-ASN-002 — Create / Edit Assignment
**Purpose:** Teacher configures a new assignment.

```
┌─────────────────────────────────────────────────────────────────┐
│ Create Assignment                                                │
├─────────────────────────────────────────────────────────────────┤
│ Title *          [Algebra Worksheet 3________________]           │
│ Instructions     [Rich text editor...........................]  │
│                  [B][I][U] [🔗] [📷] [Ω]                          │
│ Type *           (•)File Upload ( )Text ( )URL ( )Group          │
│ Rubric           [Select rubric ▾]  [+ Create New Rubric]        │
│                                                                    │
│ Due Date *        [25/06/2026]  Time [11:59 PM]                  │
│ Late Submission   (•)Accept with penalty  10% per day            │
│                   ( )Accept without penalty  ( )Do not accept    │
│ Attempts          [1 ▾]                                          │
│ Plagiarism Check  ☑ Enable Turnitin check                        │
│ Visibility        (•)Publish now  ( )Schedule for later          │
│                                                                    │
│                              [Save as Draft]   [Publish →]       │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Title input · Rich text editor toolbar · Type radio group · Rubric selector + create-new link · Due date/time pickers · Late rule radio + penalty input · Attempts dropdown · Plagiarism toggle · Visibility radio
**Actions:** Configure → Save as Draft → Publish (notifies students per LMS-FR-041)
**Validation:** Title required · Due date cannot be in the past · Penalty % required if "Accept with penalty" selected
**Loading:** N/A · **Empty:** N/A · **Error:** "Couldn't publish — check required fields"
**Reflow:** Tablet — same single column, full width. Mobile — toolbar icons reduce to a "More" overflow menu.

---

## SCR-ASN-003 — Submission Queue (Teacher)
**Purpose:** Browse all student submissions for one assignment.

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back   Algebra Worksheet 3 — Submissions      [Download All]  │
├─────────────────────────────────────────────────────────────────┤
│ [All 25] [Submitted 18] [Late 3] [Missing 4] [Graded 0]         │
├──────────────────┬──────────────┬─────────────┬─────────────────┤
│ Student            │ Status        │ Submitted    │ Grade         │
├──────────────────┼──────────────┼─────────────┼─────────────────┤
│ Ahmed Khan         │ ✅ On time     │ 24 Jun 8pm   │ [Grade →]      │
│ Sara Ali           │ ⚠️ Late        │ 25 Jun 11am  │ [Grade →]      │
│ Bilal Hassan       │ ❌ Missing     │ —            │ [Remind]       │
└──────────────────┴──────────────┴─────────────┴─────────────────┘
```
**Components:** Status filter tabs with counts · Submission table · Bulk download button
**Actions:** Filter by status → Grade (opens SCR-ASN-004) → Remind (sends notification to student who hasn't submitted)
**Validation:** N/A
**Loading:** Skeleton table · **Empty:** "No submissions yet" · **Error:** "Couldn't load submissions — Retry"
**Reflow:** Tablet — table scrolls. Mobile — card list per student.

---

## SCR-ASN-004 — Grading Interface
**Purpose:** Teacher grades one submission with annotation and rubric.

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back   Grading: Ahmed Khan — Algebra Worksheet 3   [1 of 25 →]│
├────────────────────────────────────┬──────────────────────────────┤
│ [Submitted PDF — annotatable]      │ Rubric                       │
│                                     │ Accuracy        [8/10]       │
│  ✏️ Annotation tools:               │ Method shown    [5/5]        │
│  [Highlight][Comment][Draw]        │ Presentation    [3/5]        │
│                                     │ ─────────────────────────    │
│  "Good work here!" 💬               │ Total: 16/20                 │
│                                     │                               │
│                                     │ Overall Feedback              │
│                                     │ [Text box......................] │
│                                     │ [🎤 Record voice note]         │
│                                     │                               │
│                                     │ [Return for Revision]         │
│                                     │ [Publish Grade →]             │
└────────────────────────────────────┴──────────────────────────────┘
```
**Components:** PDF/document viewer with annotation tools (highlight, comment, draw) · Rubric criteria with point inputs (auto-sums) · Feedback text box · Voice note recorder (up to 5 min) · Navigation between submissions
**Actions:** Annotate document → Score rubric criteria → Record/type feedback → Return for Revision (sends back to student) → Publish Grade (notifies student per LMS-FR-049)
**Validation:** All rubric criteria must be scored before Publish is enabled · Voice note max 5 minutes
**Loading:** "Loading submission…" · **Empty:** N/A · **Error:** "Couldn't load this file type for annotation — download to review"
**Reflow:** Tablet — rubric panel below document, full width. Mobile — document viewer full-screen with rubric as bottom sheet.

---

## SCR-ASN-005 — Student Submission View
**Purpose:** Student submits work and later views feedback.

```
┌─────────────────────────────────────────────────────────────────┐
│ Algebra Worksheet 3                          Due: 25 Jun, 11:59pm│
├─────────────────────────────────────────────────────────────────┤
│ Instructions: Complete problems 1-10 from Chapter 3...           │
│                                                                    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │           📎 Drag files here or click to browse              │ │
│ │                  worksheet3_ahmed.pdf ✅ uploaded              │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                    │
│ Draft auto-saved 2 minutes ago                                    │
│                                                                    │
│                                          [Preview]    [Submit →] │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Instructions panel · File drop zone with upload progress · Auto-save indicator · Preview + Submit buttons. After grading, view switches to: **Feedback view** — score, rubric breakdown, annotated document, voice note player, Resubmit button (if allowed)
**Actions:** Upload file → Preview → Submit (confirmation dialog with timestamp) → (post-grade) View feedback → Resubmit if permitted
**Validation:** File type/size restrictions enforced (Part 4.2.3 — 50MB default) · Cannot submit after deadline unless late submission is allowed
**Loading:** Upload progress bar · **Empty:** N/A · **Error:** "File too large — max 50MB" / "Unsupported file type"
**Reflow:** Tablet — same layout, full width. Mobile — drop zone becomes a tap-to-browse button (drag-drop not applicable on mobile).

---

## SCR-EXM-001 — Exam List
**Purpose:** Teacher/Student view of all exams per class.

```
┌─────────────────────────────────────────────────────────────────┐
│ Exams                                          [+ Create Exam]  │
├─────────────────────────────────────────────────────────────────┤
│ [Upcoming] [Active] [Past]                                       │
├──────────────────────────┬──────────┬─────────────┬─────────────┤
│ Title                     │ Date      │ Duration    │ Status      │
├──────────────────────────┼──────────┼─────────────┼─────────────┤
│ Mid-Term: Algebra         │ 28 Jun    │ 90 min       │ Scheduled   │
│ Quiz: Chapter 2           │ 20 Jun    │ 30 min       │ Graded      │
└──────────────────────────┴──────────┴─────────────┴─────────────┘
```
**Components:** Status tabs · Exam table with countdown for upcoming
**Actions:** Create Exam (SCR-EXM-002) → Click row (Teacher: results SCR-EXM-006; Student: take exam SCR-EXM-004 if active, or results if past)
**Validation:** N/A
**Loading:** Skeleton table · **Empty:** "No exams scheduled" · **Error:** "Couldn't load exams — Retry"
**Reflow:** Tablet — table scrolls. Mobile — card list.

---

## SCR-EXM-002 — Create Exam
**Purpose:** Configure exam settings, questions, and proctoring.

```
┌─────────────────────────────────────────────────────────────────┐
│ Create Exam — Step 2 of 3: Questions          [← Settings][Next→]│
├─────────────────────────────────────────────────────────────────┤
│ Question Bank (Algebra)              [+ Add Manually] [🤖 AI Gen]│
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ☑ Q1 — Solve for x: 2x+5=15        MCQ    Medium   5 marks  │ │
│ │ ☑ Q2 — Factor: x²-9                Short   Hard     8 marks  │ │
│ │ ☐ Q3 — Graph the equation y=2x     Essay   Hard    10 marks  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ Selected: 2 questions · 13 marks                                 │
│                                                                    │
│ [🤖 Generate Questions with AI]                                  │
│   Topic: [Quadratic Equations__]  Difficulty: [Medium▾] Count:[5]│
│   [Generate →]                                                   │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Question bank list with checkboxes, type/difficulty/marks columns · Selected count summary · AI generation panel (topic, difficulty, count inputs)
**Actions:** Select existing questions → Add manually → Generate with AI (creates drafts, `reviewed=false`, per LMS-FR-057) → Review/approve each AI draft before it's selectable
**Validation:** AI-generated questions cannot be added to the exam until individually reviewed and approved by the teacher (hard gate, not just a UI suggestion)
**Loading:** "Generating questions…" (AI call in progress, ~3-5 sec) · **Empty:** "No questions in bank yet — generate or add manually" · **Error:** "AI generation failed — try again or add manually"
**Reflow:** Tablet — same layout. Mobile — question bank becomes single-column cards, AI panel collapses to expandable section.

---

## SCR-EXM-003 — AI Question Review
**Purpose:** Teacher reviews AI-drafted questions before they enter the bank.

```
┌─────────────────────────────────────────────────────────────────┐
│ Review AI-Generated Questions (5)              [Approve All ✓]  │
├─────────────────────────────────────────────────────────────────┤
│ Draft 1 of 5                                          ⚠️ Unreviewed│
│ Q: What is the value of x in 3x - 7 = 14?                        │
│ Type: MCQ    Difficulty: Medium                                   │
│ A) x=5  B) x=7 ✓  C) x=9  D) x=3                                  │
│                                                                    │
│ [✏️ Edit]      [❌ Reject]      [✅ Approve]                      │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Single-draft review card with question, type, difficulty, options, correct answer highlighted · Edit/Reject/Approve actions · Progress indicator (1 of 5)
**Actions:** Edit inline → Reject (deletes draft) → Approve (sets `reviewed=true`, becomes selectable) → Approve All (bulk, only after spot-checking is recommended in UI copy)
**Validation:** A question must have a correct answer marked before it can be approved
**Loading:** N/A · **Empty:** "All drafts reviewed" · **Error:** N/A
**Reflow:** Tablet/Mobile — same single-card layout, already optimized for narrow screens.

---

## SCR-EXM-004 — Exam Taking Interface (Student)
**Purpose:** Student takes a proctored exam.

```
┌─────────────────────────────────────────────────────────────────┐
│ Mid-Term: Algebra          ⏱ 47:23 remaining     🔒 Proctored    │
├─────────────────────────────────────────────────────────────────┤
│ Question 4 of 20                                    [🚩 Flag]    │
│                                                                    │
│ Solve for x: 2x + 5 = 15                                          │
│                                                                    │
│ ( ) x = 3                                                          │
│ (•) x = 5                                                          │
│ ( ) x = 7                                                          │
│ ( ) x = 10                                                         │
│                                                                    │
│                                                                    │
│ [← Previous]                              [Next →]               │
├─────────────────────────────────────────────────────────────────┤
│ 1 2 3 [4] 5 6 7 8 9 10 ... 20          [Submit Exam]             │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Countdown timer · Proctoring lock indicator · Question display (type varies: MCQ/short answer/essay/coding) · Flag for review toggle · Question navigator grid (colour-coded: answered/unanswered/flagged) · Submit button
**Actions:** Select/type answer (auto-saves every 30 sec) → Flag for review → Navigate questions → Submit (confirmation with unanswered-question warning)
**Validation:** Submit shows warning if any questions unanswered: "3 questions unanswered — submit anyway?" · Full-screen lock active throughout — tab switch attempts logged
**Loading:** "Loading exam…" with pre-exam technical check screen first (camera/mic/bandwidth) · **Empty:** N/A · **Error:** "Connection lost — your answers are saved, reconnecting…"
**Reflow:** Tablet — same layout. Mobile — question navigator becomes a collapsible drawer; full-screen lock enforced via PWA fullscreen API.

---

## SCR-EXM-005 — Live Proctor Dashboard
**Purpose:** Teacher monitors all students during a live proctored exam.

```
┌─────────────────────────────────────────────────────────────────┐
│ Proctoring: Mid-Term Algebra        22 active · 2 flagged ⚠️     │
├─────────────────────────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │
│ │[webcam]│ │[webcam]│ │[webcam]│⚠️│[webcam]│ │[webcam]│         │
│ │ Ahmed  │ │ Sara   │ │ Bilal  │ │ Hina ⚠️│ │ Omar   │         │
│ │ Q12/20 │ │ Q8/20  │ │ Q15/20 │ │ Q5/20  │ │ Q18/20 │         │
│ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘         │
│  ... grid continues for all 22 students ...                      │
├─────────────────────────────────────────────────────────────────┤
│ Flagged Incidents                                                 │
│ Hina Malik — Tab switch detected at 10:42 AM        [Review →]   │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Webcam grid (one tile per student, progress shown) · Flag indicator on tiles with incidents · Incident log panel
**Actions:** Click a tile to enlarge · Click incident → review webcam capture at that timestamp → mark as resolved or flag for investigation
**Validation:** N/A
**Loading:** "Connecting to student feeds…" · **Empty:** N/A (only shown during active exam) · **Error:** "Lost connection to [student]'s feed — they remain in the exam"
**Reflow:** Tablet — grid reduces to 3 columns. Mobile — not recommended for proctoring (desktop-only feature); shows "Proctoring dashboard requires a desktop browser."

---

## SCR-EXM-006 — Exam Results & Analytics
**Purpose:** Teacher/Student view exam outcomes.

```
┌─────────────────────────────────────────────────────────────────┐
│ Mid-Term: Algebra — Results                    [Export Results] │
├─────────────────────────────────────────────────────────────────┤
│ Class Average: 74%        Highest: 98%       Lowest: 42%        │
│                                                                    │
│ Score Distribution                                                │
│ 90-100 ████ 4        80-89 ██████ 6       70-79 ████████ 8      │
│ 60-69  ███ 3          <60  █ 1                                   │
│                                                                    │
│ Question Analysis (hardest first)                                 │
│ Q14 — 35% correct  ⚠️ Most missed                                 │
│ Q7  — 52% correct                                                 │
├──────────────┬────────┬─────────┬─────────────────────────────────┤
│ Student        │ Score  │ Rank    │ Action                        │
├──────────────┼────────┼─────────┼─────────────────────────────────┤
│ Ahmed Khan     │ 92%    │ 2nd     │ [View Answers]                │
│ Sara Ali       │ 76%    │ 9th     │ [View Answers]                │
└──────────────┴────────┴─────────┴─────────────────────────────────┘
```
**Components:** Summary stats (avg/high/low) · Score distribution histogram · Question-wise difficulty analysis · Per-student results table with rank
**Actions:** Export results (CSV/PDF) → View Answers (per student) → Click question for detailed analysis
**Validation:** N/A
**Loading:** Skeleton charts · **Empty:** "Results not yet available — grading in progress" · **Error:** "Couldn't load results — Retry"
**Reflow:** Tablet — charts stack vertically. Mobile — histogram becomes a simplified bar list; table becomes cards.

*(Student's own results view is a simplified single-row version of this screen — score, rank if enabled, correct answers if enabled by teacher, certificate download if applicable.)*

---

*Lighthouse Global School System — P1 — Appendix B Wireframes (1/5) — Internal — v1.0*
