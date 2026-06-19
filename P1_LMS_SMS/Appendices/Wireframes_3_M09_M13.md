# APPENDIX B — SCREEN WIREFRAMES (3/5)
## M09 Accounting · M10 HR · M11 Payroll · M12 Library · M13 Communication

**Status:** ✅ Complete
*Referenced from [Part 7 — Screen Specifications](../01_Master_SRS/Layer_3_UI_UX/Part_7_Screen_Specifications.md). This is the canonical Appendix B location for all wireframes per the production guide.*


---

## SCR-ACC-001 — Chart of Accounts
**Purpose:** Accountant manages the ledger account structure.

```
┌─────────────────────────────────────────────────────────────────┐
│ Chart of Accounts                              [+ Add Account]  │
├─────────────────────────────────────────────────────────────────┤
│ ▾ Assets                                                          │
│    1000 — Cash                                                    │
│    1100 — Accounts Receivable (Fees Receivable)                  │
│ ▾ Liabilities                                                     │
│    2000 — Accounts Payable                                        │
│    2100 — Salaries Payable                                        │
│ ▾ Revenue                                                          │
│    3000 — Tuition Revenue                                         │
│    3100 — Transport Revenue                                       │
│ ▾ Expenses                                                         │
│    4000 — Salaries Expense                                        │
│    4100 — Utilities Expense                                       │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Collapsible account-type tree · Account code + name per row
**Actions:** Add Account (modal: code, name, type, parent account) → Click account to view ledger detail
**Validation:** Account code must be unique · Account code numeric range must match its type (1xxx=Asset etc.)
**Loading:** Skeleton tree · **Empty:** "No accounts configured — using default chart" · **Error:** "Couldn't save account — Retry"
**Reflow:** Tablet/Mobile — same collapsible tree, full width.

---

## SCR-ACC-002 — Journal Entry
**Purpose:** Accountant records a manual journal entry with double-entry enforcement.

```
┌─────────────────────────────────────────────────────────────────┐
│ New Journal Entry                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Date: [22/06/2026]      Reference: [Manual adjustment_______]    │
├──────────────────────┬──────────────┬──────────────┬─────────────┤
│ Account                │ Description    │ Debit          │ Credit       │
├──────────────────────┼──────────────┼──────────────┼─────────────┤
│ [1000 Cash ▾]          │ Office supplies│ [10,000]       │              │
│ [4200 Supplies Exp ▾] │ Office supplies│                │ [10,000]     │
│ [+ Add Line]           │                │                │              │
├──────────────────────┴──────────────┼──────────────┼─────────────┤
│                            Totals:     │ 10,000         │ 10,000      │
│                            Balance:    │ ✅ Balanced                  │
└─────────────────────────────────────┴──────────────┴─────────────┘
                                                        [Post Entry →]
```
**Components:** Date/reference header · Line-item table (account dropdown, description, debit, credit) · Live balance validator
**Actions:** Add line → Enter amounts → Post Entry (blocked until balanced)
**Validation:** Debit total must equal Credit total — Post button disabled and shows ❌ Unbalanced with the difference amount until corrected (Part 9.4 `409` rejection if attempted)
**Loading:** N/A · **Empty:** N/A · **Error:** "Journal entry is unbalanced. Difference: PKR 1,000"
**Reflow:** Tablet — table scrolls. Mobile — each line becomes a stacked card with account/description/debit/credit fields.

---

## SCR-ACC-003 — Financial Statements
**Purpose:** Generate trial balance, P&L, or balance sheet.

```
┌─────────────────────────────────────────────────────────────────┐
│ Financial Statements                                              │
├─────────────────────────────────────────────────────────────────┤
│ Statement: [Trial Balance ▾]   Period: [Jul 2026 - Jun 2027]     │
│                                                  [Generate →]     │
├──────────────────────┬──────────────┬──────────────────────────┤
│ Account                │ Debit          │ Credit                    │
├──────────────────────┼──────────────┼──────────────────────────┤
│ 1000 Cash              │ 4,500,000      │                            │
│ 1100 Fees Receivable   │ 800,000        │                            │
│ 3000 Tuition Revenue   │                │ 5,000,000                  │
│ 4000 Salaries Expense  │ 300,000        │                            │
├──────────────────────┼──────────────┼──────────────────────────┤
│ TOTAL                  │ 5,600,000      │ 5,600,000  ✅ Balanced     │
└──────────────────────┴──────────────┴──────────────────────────┘
                                            [Export PDF] [Export Excel]
```
**Components:** Statement type dropdown · Date range picker · Statement table · Balance verification footer
**Actions:** Select type/period → Generate → Export
**Validation:** N/A (read-only report; the underlying ledger enforces balance at entry time)
**Loading:** "Generating statement…" · **Empty:** "No transactions in this period" · **Error:** "Couldn't generate — Retry"
**Reflow:** Tablet — table scrolls. Mobile — table becomes a simplified summary list (full detail via export).

---

## SCR-ACC-004 — Bank Reconciliation
**Purpose:** Match ledger transactions against the bank statement.

```
┌─────────────────────────────────────────────────────────────────┐
│ Bank Reconciliation — June 2026          [Upload Bank Statement] │
├─────────────────────────────────────────────────────────────────┤
│ Bank Balance: PKR 4,520,000    Ledger Balance: PKR 4,500,000     │
│ Difference: PKR 20,000 ⚠️                                         │
├──────────────────────┬──────────────┬──────────┬─────────────────┤
│ Transaction            │ Amount         │ Bank      │ Ledger          │
├──────────────────────┼──────────────┼──────────┼─────────────────┤
│ Tuition payment - Ahmed│ 30,000         │ ✅        │ ✅ Matched      │
│ Bank fee               │ 500            │ ✅        │ ☐ Unmatched     │
│                         │                │           │ [Create Entry] │
└──────────────────────┴──────────────┴──────────┴─────────────────┘
```
**Components:** Balance comparison header · Upload statement button (CSV/OFX) · Transaction matching table
**Actions:** Upload statement → Auto-match transactions → Create Entry for unmatched items → Mark reconciled
**Validation:** Cannot mark period as fully reconciled while unmatched items remain
**Loading:** "Matching transactions…" · **Empty:** "Upload a bank statement to begin" · **Error:** "Couldn't parse file — check format"
**Reflow:** Tablet — table scrolls. Mobile — cards per transaction.

---

## SCR-HR-001 — Staff Directory
**Purpose:** Admin browses all staff records.

```
┌─────────────────────────────────────────────────────────────────┐
│ Staff Directory                                  [+ Add Staff]  │
├─────────────────────────────────────────────────────────────────┤
│ [All] [Teaching] [Non-Teaching]            [Search staff...]     │
├──────────────┬──────────────┬──────────────┬──────────┬─────────┤
│ Name           │ Role           │ Department     │ Status    │ Action  │
├──────────────┼──────────────┼──────────────┼──────────┼─────────┤
│ Ms. Fatima     │ Teacher        │ Mathematics    │ Active    │ [View]  │
│ Mr. Tariq      │ Librarian      │ Library        │ Active    │ [View]  │
│ Mr. Hassan     │ Teacher        │ English        │ On Leave  │ [View]  │
└──────────────┴──────────────┴──────────────┴──────────┴─────────┘
```
**Components:** Type filter tabs · Search · Staff table with status badge
**Actions:** Add Staff → View (opens SCR-HR-002)
**Validation:** N/A
**Loading:** Skeleton table · **Empty:** "No staff records yet" · **Error:** "Couldn't load directory — Retry"
**Reflow:** Tablet — table scrolls. Mobile — cards with avatar + name + role.

---

## SCR-HR-002 — Staff Profile
**Purpose:** Full staff record with qualifications, contract, and documents.

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back    Ms. Fatima — Mathematics Teacher          [Edit]      │
├───────────────────────────────┬───────────────────────────────────┤
│ [Photo]                       │ Qualifications                    │
│ Ms. Fatima Iqbal               │ M.Sc Mathematics — 2015            │
│ Joined: 1 Sep 2020              │ Cambridge PDQ — 2018               │
│ Contract: Full-time              │ [+ Add Qualification]              │
│                                 ├───────────────────────────────────┤
│ Email: fatima@school.edu        │ Documents                          │
│ Phone: +92 300 9876543          │ ✅ CV   ✅ Degree   ✅ CNIC        │
│                                 │ [Upload Document]                  │
├───────────────────────────────┴───────────────────────────────────┤
│ Leave Balance: 12 days remaining          [View Leave History →] │
│ Classes Taught: Grade 8A, 8B, 9A           [View Workload →]     │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Photo + basic info panel · Qualifications list · Document checklist with upload · Leave balance widget · Workload summary
**Actions:** Edit profile → Add qualification → Upload document → View leave history → View workload report
**Validation:** N/A (view mode); Edit mode validates required fields
**Loading:** Skeleton panels · **Empty:** N/A · **Error:** "Couldn't load profile — Retry"
**Reflow:** Tablet — two columns stack. Mobile — same, full width single column.

---

## SCR-HR-003 — Leave Request / Approval
**Purpose:** Staff submits leave; Admin approves.

```
┌─────────────────────────────────────────────────────────────────┐
│ Leave Requests                                                    │
├─────────────────────────────────────────────────────────────────┤
│ [Pending 3] [Approved] [Rejected]                                 │
├──────────────┬──────────────┬──────────────┬──────────┬─────────┤
│ Staff          │ Dates          │ Reason         │ Balance   │ Action  │
├──────────────┼──────────────┼──────────────┼──────────┼─────────┤
│ Mr. Hassan     │ 24-26 Jun      │ Family emergency│ 8 days   │[Approve]│
│                │                │                │ remaining │[Reject] │
└──────────────┴──────────────┴──────────────┴──────────┴─────────┘
```
**Components:** Status tabs with pending count · Request table with leave balance shown inline · Approve/Reject buttons
**Actions:** Approve (triggers timetable substitution flag per LMS-FR-136) → Reject (with note)
**Validation:** Cannot approve if it would put balance negative — shows warning, requires override reason
**Loading:** Skeleton table · **Empty:** "No leave requests" · **Error:** "Couldn't process — Retry"
**Reflow:** Tablet — table scrolls. Mobile — cards with action buttons full width.

---

## SCR-HR-004 — Teacher Workload Report
**Purpose:** Admin views teaching hours and class distribution per teacher.

```
┌─────────────────────────────────────────────────────────────────┐
│ Teacher Workload Report                          [Export]       │
├──────────────┬──────────────┬──────────────┬──────────┬─────────┤
│ Teacher        │ Subject        │ Classes        │ Hrs/Week  │ Status  │
├──────────────┼──────────────┼──────────────┼──────────┼─────────┤
│ Ms. Fatima     │ Mathematics    │ 8A, 8B, 9A     │ 18        │ ✅ Normal│
│ Mr. Ali        │ Science        │ 7A, 7B, 8A,8B  │ 26        │ ⚠️ High  │
└──────────────┴──────────────┴──────────────┴──────────┴─────────┘
```
**Components:** Workload table with hours/week and status flag (colour-coded against the configured max)
**Actions:** Export → Click teacher to drill into timetable
**Validation:** N/A
**Loading:** Skeleton table · **Empty:** "No workload data" · **Error:** "Couldn't load report — Retry"
**Reflow:** Tablet/Mobile — cards.

---

## SCR-PAY-001 — Payroll Run
**Purpose:** Accountant processes monthly payroll.

```
┌─────────────────────────────────────────────────────────────────┐
│ Process Payroll — June 2026                                       │
├─────────────────────────────────────────────────────────────────┤
│ 23 active staff · Estimated total: PKR 4,600,000                  │
│                                                                    │
│ ⚠️ 1 staff member has incomplete payroll profile:                 │
│    Mr. Tariq — missing bank account details  [Fix Profile]       │
│                                                                    │
│                                          [Process Payroll →]      │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Summary stats · Warning list for incomplete profiles · Process button
**Actions:** Fix Profile (inline) → Process Payroll (async job per Part 9.4 sequence — posts to ledger, generates payslips)
**Validation:** Process button disabled while any staff has an incomplete profile, unless admin explicitly excludes that staff member from this run
**Loading:** "Processing payroll for 23 staff…" progress bar · **Empty:** N/A · **Error:** "Payroll partially processed — 1 staff failed: [reason]"
**Reflow:** Tablet/Mobile — same single-column layout.

---

## SCR-PAY-002 — Payslip View
**Purpose:** Staff views their own payslip.

```
┌─────────────────────────────────────────────────────────────────┐
│ Payslip — June 2026                              [Download PDF]│
├─────────────────────────────────────────────────────────────────┤
│ Ms. Fatima Iqbal — Mathematics Teacher                            │
│                                                                    │
│ Earnings                                                            │
│   Basic Salary                          PKR 180,000               │
│   Housing Allowance                     PKR  20,000               │
│ Deductions                                                          │
│   Tax                                   PKR (15,000)               │
│   Provident Fund                        PKR (10,000)               │
│ ─────────────────────────────────────────────                     │
│ Net Pay                                  PKR 175,000               │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Earnings/deductions breakdown · Net pay total · Download button
**Actions:** Download PDF
**Validation:** N/A (read-only; access restricted to own payslip only, `403` if URL manipulated per Part 9.4)
**Loading:** Skeleton panel · **Empty:** "No payslip for this period yet" · **Error:** "Couldn't load payslip — Retry"
**Reflow:** Tablet/Mobile — same single-column layout, full width.

---

## SCR-PAY-003 — Salary Configuration
**Purpose:** Admin configures a staff member's salary components.

```
┌─────────────────────────────────────────────────────────────────┐
│ Salary Configuration — Ms. Fatima                                 │
├─────────────────────────────────────────────────────────────────┤
│ Basic Salary           [PKR 180,000_____]                         │
│ Housing Allowance      [PKR  20,000_____]                         │
│ Transport Allowance    [PKR  5,000______]                         │
│                                                                    │
│ Deductions                                                          │
│ Tax Rate               [8.3]%                                      │
│ Provident Fund          [5.5]%                                     │
│                                                                    │
│ Bank Account            [____________________]                    │
│                                                                    │
│                                              [Save Configuration] │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Earnings input fields · Deduction percentage inputs · Bank account field
**Actions:** Configure → Save
**Validation:** All earnings fields required before payroll can include this staff member · Bank account required (validated against payroll run check, RISK-adjacent rule)
**Loading:** N/A · **Empty:** N/A (new staff shows blank form) · **Error:** "Couldn't save — Retry"
**Reflow:** Tablet/Mobile — single column, full width inputs.

---

## SCR-LIB-001 — Catalog Search
**Purpose:** Search and browse the library catalog.

```
┌─────────────────────────────────────────────────────────────────┐
│ Library                          [Search: "photosynthesis"___]   │
├─────────────────────────────────────────────────────────────────┤
│ Filters: [Subject ▾] [Availability ▾] [Format ▾]                 │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│ │[cover]   │ │[cover]   │ │[cover]   │ │[cover]   │             │
│ │Biology    │ │Plant     │ │Cell      │ │Bio Lab    │             │
│ │101        │ │Science   │ │Biology   │ │Manual     │             │
│ │✅Available│ │⚠️Checked │ │✅Available│ │📱E-book   │             │
│ │           │ │  Out     │ │           │ │           │             │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Search bar · Filter dropdowns · Book cover grid with availability badge
**Actions:** Search/filter → Click book (opens SCR-LIB-002)
**Validation:** N/A
**Loading:** Skeleton grid · **Empty:** "No books match your search" · **Error:** "Couldn't load catalog — Retry"
**Reflow:** Tablet — 3-column grid. Mobile — 2-column grid.

---

## SCR-LIB-002 — Book Detail
**Purpose:** View book details and reserve/borrow.

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back                                                            │
├───────────────────┬─────────────────────────────────────────────┤
│ [Book Cover]        │ Biology 101                                 │
│                     │ by Dr. Sarah Ahmed                          │
│                     │ ISBN: 978-1234567890                        │
│                     │ Category: Science                            │
│                     │                                               │
│                     │ Status: ✅ Available (2 of 3 copies)         │
│                     │ Location: Shelf B-12                         │
│                     │                                               │
│                     │              [Reserve]    [Issue to Student] │
└───────────────────┴─────────────────────────────────────────────┘
```
**Components:** Cover image · Metadata panel · Availability status with copy count · Action buttons (role-dependent: students see Reserve, librarians see Issue)
**Actions:** Reserve (joins queue if unavailable) → Issue to Student (librarian picks student, sets due date)
**Validation:** Cannot issue if zero copies available — Reserve becomes the only option
**Loading:** Skeleton panel · **Empty:** N/A · **Error:** "Couldn't load book — Retry"
**Reflow:** Tablet/Mobile — cover stacks above metadata, full width.

---

## SCR-LIB-003 — Circulation Desk
**Purpose:** Librarian processes issues and returns.

```
┌─────────────────────────────────────────────────────────────────┐
│ Circulation Desk                                                   │
├─────────────────────────────────────────────────────────────────┤
│ Scan or enter Student ID: [____________]  [Scan]                  │
│                                                                    │
│ Ahmed Khan — Grade 5                                               │
│ Currently borrowed: 2 books                                        │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Biology 101          Due: 29 Jun        [Return]             │ │
│ │ Math Olympiad         Due: 25 Jun ⚠️ Overdue  [Return]       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                    │
│ Issue new book: [Scan ISBN or search______]    [Issue]            │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Student ID scan/search · Current loans list with due dates · Return button per loan · New issue search
**Actions:** Scan student → Return (calculates fine if overdue) → Issue new book
**Validation:** Cannot issue if student has unpaid fines exceeding the configured limit
**Loading:** "Looking up student…" · **Empty:** N/A · **Error:** "Student not found — check ID"
**Reflow:** Tablet/Mobile — same vertical flow, full width.

---

## SCR-LIB-004 — My Borrowed Items (Student)
**Purpose:** Student views their own loans and fines.

```
┌─────────────────────────────────────────────────────────────────┐
│ My Library                                                         │
├─────────────────────────────────────────────────────────────────┤
│ Borrowed Items (2)                                                 │
│ Biology 101          Due: 29 Jun           [Renew]                │
│ Math Olympiad         Due: 25 Jun ⚠️ Overdue — PKR 50 fine        │
│                                                                    │
│ Outstanding Fines: PKR 50                       [Pay Fine →]      │
│                                                                    │
│ Reservations (1)                                                    │
│ Chemistry Basics — Queue position: 2                               │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Borrowed items list with renew action · Fine summary with pay link · Reservation queue status
**Actions:** Renew (if not reserved by another student) → Pay Fine (routes to fee payment flow)
**Validation:** Cannot renew if book is reserved by someone else
**Loading:** Skeleton list · **Empty:** "No items borrowed" · **Error:** "Couldn't load — Retry"
**Reflow:** Tablet/Mobile — same single-column list.

---

## SCR-COM-001 — Inbox / Messages
**Purpose:** Threaded messaging for all roles.

```
┌─────────────────────────────────────────────────────────────────┐
│ Messages                                          [+ New Message]│
├───────────────────────┬───────────────────────────────────────────┤
│ ● Ms. Fatima (Teacher)│  Ms. Fatima — Re: Ahmed's progress          │
│   "Re: Ahmed's..."    │  ──────────────────────────────────────    │
│   2 min ago            │  Hi, I wanted to update you on Ahmed's     │
│ ○ School Admin         │  recent quiz performance...                │
│   "Fee reminder"       │                                              │
│   Yesterday            │  [Reply...........................] [Send]│
│ ○ Parent Forum          │                                              │
│   "PTM schedule"        │                                              │
└───────────────────────┴───────────────────────────────────────────┘
```
**Components:** Thread list (unread dot indicator) · Open thread panel · Reply composer with attach
**Actions:** Select thread → Reply → New Message (compose to individual/group)
**Validation:** Message body cannot be empty
**Loading:** Skeleton thread list · **Empty:** "No messages yet" · **Error:** "Couldn't send — Retry"
**Reflow:** Tablet — same two-pane. Mobile — single pane, thread list and open thread are separate views with back navigation.

---

## SCR-COM-002 — Compose Announcement
**Purpose:** Admin/Teacher posts an announcement.

```
┌─────────────────────────────────────────────────────────────────┐
│ New Announcement                                                   │
├─────────────────────────────────────────────────────────────────┤
│ Title *           [School closed for public holiday__________]   │
│ Content            [Rich text editor.............................]│
│ Priority           ( )Normal (•)Important ( )Urgent ( )Emergency  │
│ Target              (•)All  ( )By Role  ( )By Class  ( )Individual│
│ Schedule            (•)Send now  ( )Schedule for later             │
│ ☑ Pin this announcement                                            │
│                                                                    │
│                                   [Cancel]      [Post Announcement]│
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Title/content inputs · Priority radio (colour-coded) · Target audience radio · Schedule toggle · Pin checkbox
**Actions:** Configure → Post (or schedule)
**Validation:** Title and content required
**Loading:** N/A · **Empty:** N/A · **Error:** "Couldn't post — check required fields"
**Reflow:** Tablet/Mobile — single column, full width.

---

## SCR-COM-003 — Emergency Broadcast
**Purpose:** Admin sends an instant multi-channel emergency alert.

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ Emergency Broadcast                                             │
├─────────────────────────────────────────────────────────────────┤
│ Template: (•)School Closure ( )Weather ( )Health ( )Custom        │
│ Message   [School will be closed tomorrow due to heavy rain.____] │
│ Channels  ☑ SMS  ☑ Email  ☑ Push  ☑ In-app                       │
│ Recipients (•)All  ( )Specific grades                              │
│                                                                    │
│              ⚠️ This sends immediately to all 1,250 users          │
│                                          [Cancel]   [Send Now →]  │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Template radio (pre-filled message per type) · Message text area · Channel checkboxes · Recipient scope radio · Recipient count warning
**Actions:** Select template → Edit message → Send Now (confirmation dialog required: "Send to 1,250 users now?")
**Validation:** Message required · At least one channel must be selected · Rate limited to 5/hour per school (Appendix C.2)
**Loading:** "Broadcasting to 1,250 recipients…" with live delivery count · **Empty:** N/A · **Error:** "Some deliveries failed — [view delivery report]"
**Reflow:** Tablet/Mobile — same single column, Send button sticky at bottom given the gravity of the action.

---

## SCR-COM-004 — Parent-Teacher Meeting Scheduler
**Purpose:** Teacher sets availability; Parent books a slot.

```
┌─────────────────────────────────────────────────────────────────┐
│ Parent-Teacher Meetings — Ms. Fatima                               │
├─────────────────────────────────────────────────────────────────┤
│ Available Slots — 26 June 2026                                    │
│ 09:00 ✅Open   09:20 ✅Open   09:40 📅Booked (Ahmed's parent)     │
│ 10:00 ✅Open   10:20 ✅Open                                        │
│                                                                    │
│ [+ Add More Slots]                                                 │
├─────────────────────────────────────────────────────────────────┤
│ My Bookings                                                          │
│ 09:40 — Bilal Khan (Ahmed's father)         [Add Notes] [Cancel]  │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Slot grid (teacher view: manage availability; parent view: book open slots) · Bookings list with notes
**Actions:** Teacher: Add slots → Parent: Book slot (creates calendar invite) → Add meeting notes after
**Validation:** Cannot book an already-booked slot (race condition handled server-side with optimistic lock)
**Loading:** "Checking availability…" · **Empty:** "No slots available yet" · **Error:** "This slot was just booked by someone else — choose another"
**Reflow:** Tablet/Mobile — slot grid becomes a vertical list of time buttons, full width.

---

## SCR-COM-005 — Discussion Forum
**Purpose:** Class/school discussion threads.

```
┌─────────────────────────────────────────────────────────────────┐
│ Grade 8A Forum — Mathematics                    [+ New Thread]  │
├─────────────────────────────────────────────────────────────────┤
│ 📌 Pinned: Homework help thread          12 replies   2hrs ago  │
│ How to solve quadratic equations?         8 replies   1 day ago  │
│ Study group for Friday's quiz             3 replies   2 days ago │
└─────────────────────────────────────────────────────────────────┘
```
**Components:** Pinned thread indicator · Thread list with reply count and last activity
**Actions:** New Thread → Open thread (nested reply view) → Pin/unpin (moderator only)
**Validation:** Thread title required · Anonymous posting toggle available for sensitive topics
**Loading:** Skeleton list · **Empty:** "No discussions yet — start one!" · **Error:** "Couldn't load forum — Retry"
**Reflow:** Tablet/Mobile — same single-column list.

---

*Lighthouse Global School System — P1 — Appendix B Wireframes (3/5) — Internal — v1.0*
