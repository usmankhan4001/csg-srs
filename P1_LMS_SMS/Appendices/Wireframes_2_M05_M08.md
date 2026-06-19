# APPENDIX B — SCREEN WIREFRAMES (2/5)
## M05 Gradebook · M06 Attendance · M07 Timetable · M08 Fee Management

**Status:** ✅ Complete
*Referenced from [Part 7 — Screen Specifications](../01_Master_SRS/Layer_3_UI_UX/Part_7_Screen_Specifications.md). This is the canonical Appendix B location for all wireframes per the production guide.*


---

## SCR-GBK-001 — Gradebook Grid
**Purpose:** Teacher's spreadsheet-style grade entry across all assignments/exams in a class.

```
┌─────────────────────────────────────────────────────────────────┐
│ Gradebook — Grade 8 Mathematics            [Import CSV] [Export]│
├─────────────────────────────────────────────────────────────────┤
│ Categories: Homework 20% │ Quizzes 30% │ Final Exam 50%         │
├──────────────┬───────┬───────┬───────┬───────┬─────────────────┤
│ Student        │ HW1   │ HW2   │ Quiz1 │ Final │ Total           │
├──────────────┼───────┼───────┼───────┼───────┼─────────────────┤
│ Ahmed Khan     │ 18/20 │ 19/20 │ 27/30 │ 88/100│ 82%             │
│ Sara Ali       │ 15/20 │ 17/20 │ 24/30 │ 76/100│ 74%             │
│ Bilal Hassan   │ 20/20 │ 20/20 │ 30/30 │ 95/100│ 96%             │
└──────────────┴───────┴───────┴───────┴───────┴─────────────────┘
   ↑ click any cell to edit grade inline
```
**Components:** Category weight header bar · Spreadsheet grid (frozen first column) · Inline editable cells · Import/Export buttons
**Actions:** Click cell to edit → Tab/Enter to move to next cell → Import grades from CSV → Apply drop-lowest/curve rule (via category settings) → Override calculated total with reason
**Validation:** Grade entry cannot exceed the assignment's max marks · Override requires a reason text entry
**Loading:** Skeleton grid · **Empty:** "No assignments graded yet" · **Error:** "Couldn't save grade — Retry"
**Reflow:** Tablet — grid scrolls horizontally with frozen student name column. Mobile — switches to one-student-at-a-time card view with a student selector dropdown.

---

## SCR-GBK-002 — Grade Calculation Settings
**Purpose:** Configure weighted categories, drop-lowest, and curving rules.

```
┌─────────────────────────────────────────────────────────────────┐
│ Grade Calculation — Grade 8 Mathematics                          │
├─────────────────────────────────────────────────────────────────┤
│ Categories                                            [+ Add]    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Homework      Weight: [20]%   Drop lowest: [1 ▾]             │ │
│ │ Quizzes       Weight: [30]%   Drop lowest: [0 ▾]             │ │
│ │ Final Exam    Weight: [50]%   Drop lowest: [0 ▾]             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ Total Weight: 100% ✅                                            │
│                                                                    │
│ Curve Adjustment                                                  │
│ ( ) None  (•) Linear  ( ) Bell Curve                              │
│ Apply to: [Quiz1 ▾]   Target average: [75]%                      │
│                                                                    │
│                                              [Save Settings]      │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Category list with weight + drop-lowest inputs · Weight total validator (must = 100%) · Curve method radio + target input
**Actions:** Add/edit category → Adjust weights → Apply curve → Save
**Validation:** Total weight must equal 100% before Save is enabled — shows ❌ if not
**Loading:** N/A · **Empty:** "No categories configured" · **Error:** "Weights must total 100% — currently 95%"
**Reflow:** Tablet/Mobile — same single-column layout.

---

## SCR-GBK-003 — Report Card Generator
**Purpose:** Generate and distribute report cards for a class.

```
┌─────────────────────────────────────────────────────────────────┐
│ Report Cards — Grade 8 Mathematics — Term 1                      │
├─────────────────────────────────────────────────────────────────┤
│ Template: [School Standard Template ▾]   [Preview Template]      │
│                                                                    │
│ Select Students:  ☑ Select All (25)                              │
│ ☑ Ahmed Khan      ☑ Sara Ali       ☑ Bilal Hassan                │
│ ☑ ... 22 more                                                     │
│                                                                    │
│ Include: ☑ Grades  ☑ Attendance %  ☑ Teacher Comments            │
│          ☑ Class Rank  ☐ Psychologist Insights                   │
│                                                                    │
│ Distribution: ☑ Email to parent  ☑ Publish to portal             │
│                                                                    │
│                                    [Generate Preview]  [Generate →]│
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Template selector + preview · Student multi-select with select-all · Content inclusion checkboxes · Distribution method checkboxes
**Actions:** Preview template → Select students → Generate Preview (one sample PDF) → Generate (bulk async job, returns job_id)
**Validation:** At least one student must be selected
**Loading:** "Generating 25 report cards…" progress bar with count · **Empty:** N/A · **Error:** "3 of 25 failed to generate — [view errors]"
**Reflow:** Tablet/Mobile — same vertical layout, student list becomes scrollable checkbox list.

---

## SCR-GBK-004 — Student Grade View (What-If Calculator)
**Purpose:** Student's real-time gradebook with projection tool.

```
┌─────────────────────────────────────────────────────────────────┐
│ My Grades — Mathematics                       Current: 82% (B)  │
├─────────────────────────────────────────────────────────────────┤
│ Homework (20%)      18/20, 19/20                    Avg: 92%    │
│ Quizzes (30%)       27/30                            Avg: 90%    │
│ Final Exam (50%)    Not yet taken                                 │
├─────────────────────────────────────────────────────────────────┤
│ 🧮 What-If Calculator                                             │
│ If I score [85]% on the Final Exam...                            │
│ → Projected final grade: 88% (A-)                                │
├─────────────────────────────────────────────────────────────────┤
│ Grade Trend                                                       │
│  100│                                              ●              │
│   80│              ●          ●                                  │
│   60│  ●                                                          │
│      └──────────────────────────────────────────────────         │
│      Sep    Oct    Nov    Dec                                    │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Category breakdown with averages · What-if slider/input with live projection · Grade trend line chart
**Actions:** Adjust what-if input → see live recalculation (client-side, no save needed)
**Validation:** What-if input must be 0-100
**Loading:** Skeleton chart · **Empty:** "No grades yet this term" · **Error:** "Couldn't load grade history — Retry"
**Reflow:** Tablet/Mobile — chart becomes simplified sparkline, what-if calculator stays prominent (key feature).

---

## SCR-ATT-001 — Attendance Marking Grid
**Purpose:** Teacher marks daily attendance.

```
┌─────────────────────────────────────────────────────────────────┐
│ Attendance — Grade 8A — 22 June 2026, Period 2     [Mark All ✅]│
├──────────────────┬──────────┬──────────┬──────────┬─────────────┤
│ Student            │ Present   │ Absent    │ Late      │ Excused    │
├──────────────────┼──────────┼──────────┼──────────┼─────────────┤
│ Ahmed Khan         │   (•)     │   ( )     │   ( )     │   ( )      │
│ Sara Ali           │   ( )     │   (•)     │   ( )     │   ( )      │
│ Bilal Hassan       │   (•)     │   ( )     │   ( )     │   ( )      │
│ ... 22 more students                                                │
├─────────────────────────────────────────────────────────────────┤
│ Notes for Sara Ali: [Called in sick________________]              │
│                                                                    │
│                                                  [Submit Register]│
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Mark-all-present quick action · Per-student radio button row (4 states) · Optional notes field per absence
**Actions:** Mark All Present → adjust exceptions → add note → Submit Register (triggers auto-SMS to parents of absent students per LMS-FR-088)
**Validation:** Every enrolled student must have a status before Submit is enabled — `422 INCOMPLETE_ATTENDANCE` otherwise
**Loading:** N/A · **Empty:** N/A (always has roster) · **Error:** "Couldn't submit — [N] students missing a status"
**Reflow:** Tablet — radio grid stays, narrower. Mobile — becomes swipeable card per student with 4 large tap targets.

---

## SCR-ATT-002 — Attendance Reports
**Purpose:** Admin/Teacher analytics on attendance trends.

```
┌─────────────────────────────────────────────────────────────────┐
│ Attendance Reports — Grade 8A                  [Export ▾]       │
├─────────────────────────────────────────────────────────────────┤
│ This Month: 94% average attendance                                │
│                                                                    │
│ Trend                                                              │
│  100%│●●●●  ●●●  ●●●●●●  ●●  ●●●●●                               │
│   90%│                                                            │
│      └────────────────────────────────────────                   │
│       Week1   Week2   Week3   Week4                              │
├─────────────────────────────────────────────────────────────────┤
│ Defaulter List (below 80% attendance)                            │
│ ┌─────────────────┬──────────────┬──────────────┐                │
│ │ Student           │ Attendance %  │ Action        │                │
│ ├─────────────────┼──────────────┼──────────────┤                │
│ │ Omar Sheikh        │ 68%           │ [Notify Parent]│                │
│ └─────────────────┴──────────────┴──────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Summary stat · Trend line chart · Defaulter table with threshold-based filtering
**Actions:** Export (PDF/Excel/CSV) → Notify Parent (manual trigger in addition to auto-SMS)
**Validation:** N/A
**Loading:** Skeleton chart + table · **Empty:** "No attendance data for this period" · **Error:** "Couldn't load report — Retry"
**Reflow:** Tablet/Mobile — chart simplifies, table becomes cards.

---

## SCR-ATT-003 — Leave Request Form
**Purpose:** Parent/Student submits an absence excuse.

```
┌─────────────────────────────────────────────────────────────────┐
│ Submit Leave Request                                       [✕]  │
├─────────────────────────────────────────────────────────────────┤
│ Student          [Ahmed Khan ▾] (if parent has multiple children)│
│ Date Range *      [22/06/2026]  to  [23/06/2026]                 │
│ Reason *          [Medical appointment_______________________]   │
│ Supporting Doc     [📎 Attach (optional)]                         │
│                                                                    │
│                                       [Cancel]   [Submit Request] │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Student selector (parent multi-child) · Date range picker · Reason text area · Optional file attach
**Actions:** Fill form → Submit (creates pending request, notifies admin/teacher per LMS-FR-092)
**Validation:** Date range required, end date ≥ start date · Reason required
**Loading:** N/A · **Empty:** N/A · **Error:** "Couldn't submit — check required fields"
**Reflow:** Tablet/Mobile — full-screen modal, same field stack.

---

## SCR-TTB-001 — Timetable Builder
**Purpose:** Admin builds the weekly class schedule via drag-and-drop.

```
┌─────────────────────────────────────────────────────────────────┐
│ Timetable Builder — Grade 8A                  [Auto-Generate 🤖]│
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│          │ Mon      │ Tue      │ Wed      │ Thu      │ Fri      │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ 08:00    │[Math/    │[Science/ │[Math/    │[English/ │[Math/    │
│ -09:00   │ Ms.Fatima]│Mr.Ali]  │ Ms.Fatima]│Ms.Hina]  │ Ms.Fatima]│
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ 09:00    │[English/ │[Math/    │[Art/     │[Science/ │[PE/      │
│ -10:00   │ Ms.Hina] │ Ms.Fatima]│Mr.Tariq] │Mr.Ali]   │Coach Sam]│
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│10:00-10:15│         Break                                       │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│   ...    │   ...    │   ...    │   ...    │   ...    │   ...    │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
        [drag subject blocks from palette →]  [Save Draft] [Publish]
```
**Components:** Week grid with time slots · Subject/teacher blocks (colour-coded, draggable) · Auto-generate AI button · Conflict highlight (red border on clash)
**Actions:** Drag block to slot → Auto-generate (async job) → Resolve conflicts → Save Draft → Publish (notifies students/teachers, syncs calendars)
**Validation:** Dropping a block creates `409 TEACHER_DOUBLE_BOOKED` if teacher already scheduled at that time — block shows red border with tooltip
**Loading:** "Generating optimal timetable…" (AI job) · **Empty:** "No timetable yet — drag blocks or auto-generate" · **Error:** "Couldn't publish — 2 conflicts remain"
**Reflow:** Tablet — grid scrolls horizontally. Mobile — builder not supported (admin desktop tool); view-only mode available.

---

## SCR-TTB-002 — Timetable View (Student/Teacher, Read-Only)
**Purpose:** Daily/weekly schedule view for students and teachers.

```
┌─────────────────────────────────────────────────────────────────┐
│ My Timetable                              [Week ▾]  [Sync to 📅]│
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│          │ Mon      │ Tue      │ Wed      │ Thu      │ Fri      │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ 08:00    │ Math     │ Science  │ Math     │ English  │ Math     │
│          │ Rm 204   │ Lab 1    │ Rm 204   │ Rm 110   │ Rm 204   │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ 09:00    │ English  │ Math     │ Art      │ Science  │ PE       │
│          │ Rm 110   │ Rm 204   │ Studio   │ Lab 1    │ Gym      │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```
**Components:** Week/Day toggle · Colour-coded subject blocks · Calendar sync button (Google/Outlook)
**Actions:** Toggle week/day view → Sync to external calendar
**Validation:** N/A (read-only)
**Loading:** Skeleton grid · **Empty:** "Timetable not yet published" · **Error:** "Couldn't load timetable — Retry"
**Reflow:** Tablet — same grid, narrower columns. Mobile — switches to Day view by default with swipe between days; grid not shown (too narrow).

---

## SCR-TTB-003 — Substitution Manager
**Purpose:** Admin assigns a substitute when a teacher is absent.

```
┌─────────────────────────────────────────────────────────────────┐
│ Substitution — Today, 22 June 2026                               │
├─────────────────────────────────────────────────────────────────┤
│ Mr. Hassan is marked absent — 3 classes affected                 │
│                                                                    │
│ Period 1 — Grade 9 Mathematics, 08:00-09:00                      │
│ Suggested substitutes (qualified in Mathematics, available):     │
│ (•) Ms. Hina      ( ) Mr. Tariq                                  │
│ [Assign Ms. Hina →]                                               │
│                                                                    │
│ Period 3 — Grade 10 Mathematics, 10:00-11:00     [Pending ⚠️]    │
│ Period 5 — Grade 9 Mathematics, 01:00-02:00      [Pending ⚠️]    │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Absence banner · Per-period substitution card with qualified/available suggestions
**Actions:** Select substitute → Assign (notifies substitute + affected students per LMS-FR-105)
**Validation:** Cannot assign a substitute already booked in that time slot
**Loading:** "Finding available substitutes…" · **Empty:** "No qualified substitutes available — contact admin manually" · **Error:** "Couldn't notify substitute — assignment saved, please call them"
**Reflow:** Tablet/Mobile — cards stack, same single-column flow.

---

## SCR-FEE-001 — Fee Structure Builder
**Purpose:** Admin defines fee heads and amounts per grade.

```
┌─────────────────────────────────────────────────────────────────┐
│ Fee Structure — Academic Year 2026-27          [+ Add Fee Head] │
├──────────────┬──────────┬──────────────┬──────────┬─────────────┤
│ Fee Head       │ Grade     │ Amount (PKR)  │ Plan      │ Action      │
├──────────────┼──────────┼──────────────┼──────────┼─────────────┤
│ Tuition        │ Grade 5   │ 25,000        │ Monthly   │ [Edit]      │
│ Admission      │ All       │ 50,000        │ One-time  │ [Edit]      │
│ Transport      │ Grade 5   │ 5,000         │ Monthly   │ [Edit]      │
│ Sibling Discount│ All      │ -10%          │ —         │ [Edit]      │
└──────────────┴──────────┴──────────────┴──────────┴─────────────┘
```
**Components:** Fee head table with grade/amount/plan/action · Add Fee Head modal (head name, grade scope, amount, plan type, discount rules)
**Actions:** Add/Edit fee head → Set discount rules (sibling/staff/scholarship)
**Validation:** Amount must be a positive number · Discount percentage 0-100
**Loading:** Skeleton table · **Empty:** "No fee structure configured yet" · **Error:** "Couldn't save — Retry"
**Reflow:** Tablet — table scrolls. Mobile — cards.

---

## SCR-FEE-002 — Invoice List
**Purpose:** Admin/Parent view of all invoices.

```
┌─────────────────────────────────────────────────────────────────┐
│ Invoices                                    [Bulk Generate]      │
├─────────────────────────────────────────────────────────────────┤
│ [All] [Paid] [Outstanding] [Overdue]          [Search student...]│
├──────────────┬──────────┬──────────────┬──────────┬─────────────┤
│ Student        │ Invoice # │ Amount (PKR)  │ Due Date  │ Status      │
├──────────────┼──────────┼──────────────┼──────────┼─────────────┤
│ Ahmed Khan     │ INV-2026-0142│30,000      │ 1 Jul     │ ⚠️ Overdue  │
│ Sara Ali       │ INV-2026-0143│30,000      │ 1 Jul     │ ✅ Paid     │
└──────────────┴──────────┴──────────────┴──────────┴─────────────┘
```
**Components:** Status tabs with counts · Search · Invoice table · Bulk Generate button (opens confirmation: "Generate invoices for all 450 students for July?")
**Actions:** Bulk Generate → Click invoice (opens SCR-FEE-003)
**Validation:** N/A
**Loading:** Skeleton table · **Empty:** "No invoices generated yet" · **Error:** "Couldn't load invoices — Retry"
**Reflow:** Tablet — table scrolls. Mobile — cards with status colour strip.

---

## SCR-FEE-003 — Invoice Detail / Payment
**Purpose:** Parent views and pays an invoice.

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back     Invoice INV-2026-0142                                │
├─────────────────────────────────────────────────────────────────┤
│ Student: Ahmed Khan — Grade 5                Due: 1 July 2026   │
│                                                                    │
│ Tuition Fee                              PKR 25,000               │
│ Transport Fee                            PKR  5,000               │
│ ─────────────────────────────────────────────────                │
│ Total                                    PKR 30,000               │
│ Outstanding                              PKR 30,000               │
│                                                                    │
│ Pay with:                                                          │
│ [💳 Stripe]  [🅿️ PayPal]  [📱 JazzCash]  [📱 Easypaisa]          │
│                                                                    │
│ Or pay partial:  [Amount: PKR ______]    [Pay Now →]             │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Invoice line items · Outstanding balance · Payment method icon buttons · Partial payment input
**Actions:** Select gateway → Pay Now (redirects to gateway, returns with receipt per Part 9.4 sequence) → Partial payment
**Validation:** Partial payment amount cannot exceed outstanding balance, must be > 0
**Loading:** "Redirecting to payment gateway…" · **Empty:** N/A · **Error:** "Payment declined — [gateway reason] — try another method"
**Reflow:** Tablet/Mobile — gateway buttons stack vertically, full width tap targets.

---

## SCR-FEE-004 — Payment History
**Purpose:** Parent/Admin view of all past payments.

```
┌─────────────────────────────────────────────────────────────────┐
│ Payment History — Ahmed Khan                  [Download All 📄] │
├──────────────┬──────────────┬──────────┬─────────────┬──────────┤
│ Date           │ Description    │ Amount    │ Method      │ Receipt    │
├──────────────┼──────────────┼──────────┼─────────────┼──────────┤
│ 1 Jun 2026     │ June Tuition   │PKR 30,000│ Stripe      │ [📄 PDF]   │
│ 1 May 2026     │ May Tuition    │PKR 30,000│ JazzCash    │ [📄 PDF]   │
└──────────────┴──────────────┴──────────┴─────────────┴──────────┘
```
**Components:** Payment history table · Per-row receipt download · Bulk download
**Actions:** Download receipt (single or all)
**Validation:** N/A
**Loading:** Skeleton table · **Empty:** "No payments recorded yet" · **Error:** "Couldn't load history — Retry"
**Reflow:** Tablet — table scrolls. Mobile — cards.

---

## SCR-FEE-005 — Outstanding / Aging Report
**Purpose:** Admin/CEO view of overdue fees by aging bucket.

```
┌─────────────────────────────────────────────────────────────────┐
│ Outstanding Fees — Aging Report                  [Export]       │
├─────────────────────────────────────────────────────────────────┤
│ Total Outstanding: PKR 2,450,000 across 82 students               │
│                                                                    │
│ 0-30 days   ████████████████ PKR 1,200,000  (49%)                │
│ 31-60 days  ████████ PKR 650,000             (27%)                │
│ 61-90 days  ████ PKR 400,000                 (16%)                │
│ 90+ days    ██ PKR 200,000                   (8%)                 │
├──────────────┬──────────┬──────────────┬──────────┬─────────────┤
│ Student        │ Grade     │ Outstanding   │ Days Overdue│ Action      │
├──────────────┼──────────┼──────────────┼──────────┼─────────────┤
│ Omar Sheikh    │ Grade 7   │ PKR 90,000    │ 95 days     │[Send Notice]│
└──────────────┴──────────┴──────────────┴──────────┴─────────────┘
```
**Components:** Total summary · Aging bucket bar chart · Sortable defaulter table
**Actions:** Export · Send Final Notice (per Part 4.6.5 escalation) · Sort by days overdue
**Validation:** N/A
**Loading:** Skeleton chart + table · **Empty:** "No outstanding fees — fully collected!" · **Error:** "Couldn't load report — Retry"
**Reflow:** Tablet/Mobile — bars become a stacked horizontal list, table becomes cards.

---

*Lighthouse Global School System — P1 — Appendix B Wireframes (2/5) — Internal — v1.0*
