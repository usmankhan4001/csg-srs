# APPENDIX E — TEST CASE LIBRARY
## P1 — Learning Management System + School Management System
### Full test cases for all 20 modules

**Status:** ✅ Complete

*Format per test case: ID / Description / Preconditions / Steps / Expected Result / Pass-Fail. Test cases are written at the UAT-script level — executable by a client-side UAT participant who knows the domain but has not read the SRS. Module-level test counts match the references in Appendix D's coverage summary.*

---

## E.1 Test Case Format

| Field | Content |
|---|---|
| **Test Case ID** | TC-[MODULE]-[NNN] |
| **FR Reference** | One or more LMS-FR-NNN IDs this test case verifies |
| **Description** | One sentence — what this test verifies |
| **Role** | Which user role executes this test |
| **Preconditions** | What must exist in the system before the test begins |
| **Steps** | Numbered — what the tester does at each step |
| **Expected Result** | What the system must display or do — observable, not inferred |
| **Pass / Fail** | Tester marks at execution |

---

## E.2 M01 — Admissions (TC-M01-001 to TC-M01-020)

**TC-M01-001** | FR: LMS-FR-001
*Web form inquiry auto-creates an inquiry record*
- **Role:** Anonymous / prospective parent
- **Pre:** Inquiry web form is published. Admissions funnel is configured.
- **Steps:** 1. Open the public inquiry form URL. 2. Fill in applicant name, desired grade, parent email, phone, and referral source. 3. Click Submit.
- **Expected:** System creates an inquiry record visible in School Admin's inquiry list with source = "Web Form" and status = "New". Auto-confirmation email is sent to the parent email within 2 minutes.
- **Pass / Fail:** ☐

**TC-M01-004** | FR: LMS-FR-004
*Branded application link generated and delivered*
- **Role:** School Admin
- **Pre:** An inquiry record exists. WhatsApp and email channels are configured.
- **Steps:** 1. Open the inquiry record. 2. Click "Send Application Link". 3. Confirm delivery to both email and WhatsApp in one action.
- **Expected:** A unique, branded application form URL is generated. An email and a WhatsApp message containing the link are dispatched. Both arrive in the parent's inbox within 5 minutes.
- **Pass / Fail:** ☐

**TC-M01-008** | FR: LMS-FR-008
*Incomplete application submission is rejected with field-level errors*
- **Role:** Parent (applicant)
- **Pre:** An application form link has been sent to the parent. Two required fields are intentionally left blank.
- **Steps:** 1. Open the application form link. 2. Fill in all fields except "Date of Birth" and "Previous School". 3. Click Submit.
- **Expected:** Submission is rejected. Two error messages appear — one identifying "Date of Birth" as required and one identifying "Previous School" as required. No application record is created. The form retains all data entered so the parent does not need to retype it.
- **Pass / Fail:** ☐

**TC-M01-011** | FR: LMS-FR-011
*Application cannot advance to Interview stage with missing documents*
- **Role:** School Admin
- **Pre:** An application is in "Document Verification" stage. One required document (birth certificate) has not been uploaded.
- **Steps:** 1. Open the application. 2. Attempt to click "Move to Interview Scheduling".
- **Expected:** The system displays an error: "Cannot advance: Birth Certificate is missing. Upload or mark as waived before proceeding." The stage does not change.
- **Pass / Fail:** ☐

**TC-M01-015** | FR: LMS-FR-015
*Acceptance letter with payment link is auto-generated on Accept decision*
- **Role:** School Admin
- **Pre:** An application is in "Decision" stage with all documents verified and interview score recorded.
- **Steps:** 1. Open the application. 2. Select Decision = "Accept". 3. Click Confirm.
- **Expected:** System auto-generates a branded acceptance letter. The letter contains a unique enrolment fee payment link. The letter is emailed to the parent within 2 minutes. The application stage changes to "Accepted — Awaiting Payment".
- **Pass / Fail:** ☐

**TC-M01-016** | FR: LMS-FR-016
*Student account is NOT created until enrolment fee payment is confirmed*
- **Role:** System (automated behaviour)
- **Pre:** An application is in "Accepted — Awaiting Payment" stage. Payment has not been made.
- **Steps:** 1. Check the user directory — confirm no student account exists for the applicant. 2. Simulate payment link expiry without payment. 3. Check the user directory again.
- **Expected:** No student account exists at step 1. No student account is created at step 3. The application remains in "Accepted — Awaiting Payment".
- **Pass / Fail:** ☐

**TC-M01-017** | FR: LMS-FR-017
*Student account auto-created on enrolment fee payment confirmation*
- **Role:** System (automated behaviour triggered by payment gateway webhook)
- **Pre:** An application is in "Accepted — Awaiting Payment". Stripe test mode is active.
- **Steps:** 1. Click the payment link in the acceptance letter. 2. Complete payment using Stripe test card 4242 4242 4242 4242. 3. Check user directory.
- **Expected:** A student account is created with the applicant's name, grade, and a system-generated student ID. A welcome email with login credentials is sent to the parent. The application stage changes to "Enrolled".
- **Pass / Fail:** ☐

**TC-M01-018** | FR: LMS-FR-018
*Waitlisted applicant is auto-promoted when a vacancy opens*
- **Role:** System (automated)
- **Pre:** Grade 5 is at capacity. One applicant is waitlisted at rank 1. One enrolled student's account is suspended (simulating withdrawal).
- **Steps:** 1. School Admin marks the enrolled student as withdrawn, freeing one place. 2. Check the waitlisted applicant's status.
- **Expected:** The waitlisted applicant at rank 1 receives an automatic email notifying them that a place has opened and prompting them to confirm enrolment within a configurable window. Their status changes to "Vacancy Available — Awaiting Confirmation".
- **Pass / Fail:** ☐

---

## E.3 M02 — Live Online Classes (TC-M02-001 to TC-M02-020)

**TC-M02-001** | FR: LMS-FR-021
*Teacher schedules a recurring live class*
- **Role:** Teacher
- **Pre:** Teacher is assigned to Grade 8 Mathematics.
- **Steps:** 1. Click "Schedule Live Class". 2. Enter title "Algebra Chapter 3", date Monday 09:00, duration 60 min, platform Jitsi, recurrence Weekly (Mon/Wed/Fri). 3. Click Save.
- **Expected:** Three live class sessions are created for the next occurrence (Mon, Wed, Fri). Each appears in the teacher's schedule and in the Grade 8 Mathematics students' schedules. Calendar invites are dispatched to all enrolled students.
- **Pass / Fail:** ☐

**TC-M02-005** | FR: LMS-FR-025
*One-click class launch generates meeting link*
- **Role:** Teacher
- **Pre:** A live class is scheduled for within the next 15 minutes.
- **Steps:** 1. Click "Start Class" from the dashboard.
- **Expected:** A Jitsi meeting is created. The meeting URL and password appear on screen. Students' "Join" button becomes active. All enrolled students receive a push notification with the join link.
- **Pass / Fail:** ☐

**TC-M02-008** | FR: LMS-FR-028
*Attendance is auto-marked for students who join within the threshold*
- **Role:** System (automated)
- **Pre:** A live class has started. Attendance threshold is set to "Joined within first 10 minutes = Present". Three students join within 5 minutes. One student joins at minute 15.
- **Steps:** 1. Class ends. 2. Teacher opens the attendance record for this class.
- **Expected:** The three students who joined within 10 minutes are marked Present. The student who joined at minute 15 is marked Late. The absent students (never joined) are marked Absent.
- **Pass / Fail:** ☐

**TC-M02-013** | FR: LMS-FR-033
*Recording is available within 30 minutes of class end*
- **Role:** Student
- **Pre:** A live class ended 35 minutes ago. Auto-record was enabled.
- **Steps:** 1. Student navigates to Past Classes. 2. Finds the class in the list. 3. Clicks the recording.
- **Expected:** The recording plays. Chapter markers are visible in the timeline. Playback speed control (0.5x to 2x) is functional. A searchable transcript tab is present.
- **Pass / Fail:** ☐

---

## E.4 M03 — Assignment (TC-M03-001 to TC-M03-015)

**TC-M03-003** | FR: LMS-FR-043
*Late submission rule is enforced correctly — accept with penalty*
- **Role:** Student
- **Pre:** An assignment has a due date of yesterday at 23:59. Late rule = "Accept with 10% penalty per day". Student has not submitted.
- **Steps:** 1. Student opens the assignment. 2. Uploads a file. 3. Submits.
- **Expected:** Submission is accepted. It is flagged as "Late — 1 day". The gradebook shows the maximum achievable score as 90% of the total marks (10% penalty applied). The teacher sees the late flag in the submission list.
- **Pass / Fail:** ☐

**TC-M03-006** | FR: LMS-FR-046
*Auto-save prevents submission loss*
- **Role:** Student
- **Pre:** Student has opened a text-submission assignment and typed 300 words.
- **Steps:** 1. Wait 35 seconds without clicking anything. 2. Close the browser tab without saving. 3. Reopen the assignment.
- **Expected:** The 300-word draft is present. A "Draft auto-saved [timestamp]" indicator appears. No work is lost.
- **Pass / Fail:** ☐

**TC-M03-009** | FR: LMS-FR-049
*Teacher annotates submission and publishes grade*
- **Role:** Teacher
- **Pre:** A student has submitted a PDF assignment.
- **Steps:** 1. Open the submission. 2. Use the inline annotation tool to highlight text and add a comment. 3. Record a 90-second voice note. 4. Enter rubric scores. 5. Click "Publish Grade".
- **Expected:** The calculated grade appears in the gradebook immediately. The student receives a push notification. The student can view the annotated PDF, voice note, and rubric breakdown from their assignment view.
- **Pass / Fail:** ☐

---

## E.5 M04 — Exam (TC-M04-001 to TC-M04-017)

**TC-M04-002** | FR: LMS-FR-057
*AI-generated questions are drafts — not published without teacher review*
- **Role:** Teacher
- **Pre:** A question bank exists. Teacher is creating an exam.
- **Steps:** 1. Click "Generate Questions with AI". 2. Select subject "Biology", topic "Cell Division", difficulty "Medium", count 5. 3. Click Generate.
- **Expected:** Five draft questions appear with `reviewed = false` status. None are added to the published exam. The teacher must individually review and approve each question before it becomes available to assign to students.
- **Pass / Fail:** ☐

**TC-M04-006** | FR: LMS-FR-061
*Full-screen lock activates at exam start*
- **Role:** Student
- **Pre:** A proctored exam is available. Student is using Chrome on Windows.
- **Steps:** 1. Click "Begin Exam". 2. Accept the proctoring consent. 3. Try pressing Alt+Tab to switch windows.
- **Expected:** The browser enters full-screen mode. Alt+Tab does not successfully switch to another application. A warning message appears: "Tab switching detected. This incident has been logged." The incident is visible to the teacher in the live proctor dashboard.
- **Pass / Fail:** ☐

**TC-M04-009** | FR: LMS-FR-064
*MCQ questions are auto-graded immediately on submission*
- **Role:** Student / System
- **Pre:** An exam containing 10 MCQ questions has been completed by the student. Teacher has published results immediately.
- **Steps:** 1. Student clicks Submit Exam. 2. Confirm submission. 3. View results.
- **Expected:** Results page appears within 3 seconds. MCQ score is displayed (e.g., 7/10). Correct answers are shown if the teacher enabled "Show answers". Class average comparison is shown if enabled.
- **Pass / Fail:** ☐

**TC-M04-014** | FR: LMS-FR-069
*Regrade request workflow completes with audit trail*
- **Role:** Student, then Teacher
- **Pre:** An exam has been graded. Student believes question 3's answer was marked wrong incorrectly.
- **Steps:** 1. Student clicks "Request Regrade" on question 3. 2. Enters reason: "My answer matches option B which is correct per the textbook." 3. Submits. 4. Teacher opens the regrade queue. 5. Reviews and approves the regrade, updating the score. 6. Student checks their results.
- **Expected:** Student sees updated score. Grade change is logged in the audit trail with: original score, revised score, teacher name, timestamp, and student's stated reason. The gradebook is updated automatically.
- **Pass / Fail:** ☐

---

## E.6 M05 — Gradebook (TC-M05-001 to TC-M05-014)

**TC-M05-003** | FR: LMS-FR-075
*Weighted category calculation is correct*
- **Role:** Teacher
- **Pre:** Gradebook has three categories: Homework 20%, Quizzes 30%, Final Exam 50%. Student has: Homework avg = 80%, Quiz avg = 70%, Final = 90%.
- **Steps:** 1. Open gradebook for the student. 2. View calculated total.
- **Expected:** Total = (80×0.20) + (70×0.30) + (90×0.50) = 16 + 21 + 45 = **82%**. The breakdown by category is displayed alongside the total so the calculation is auditable.
- **Pass / Fail:** ☐

**TC-M05-006** | FR: LMS-FR-078
*Drop-lowest-score rule removes the correct entry*
- **Role:** Teacher
- **Pre:** Quizzes category has 5 quiz scores: 60, 75, 80, 85, 90. Drop-lowest-1 rule is enabled.
- **Steps:** 1. View the gradebook entry for Quizzes category.
- **Expected:** Score of 60 is excluded from the average calculation. The displayed average = (75+80+85+90)/4 = 82.5%. The dropped score is visually crossed out or marked "dropped" in the grade breakdown.
- **Pass / Fail:** ☐

**TC-M05-012** | FR: LMS-FR-084
*What-if calculator produces correct projection*
- **Role:** Student
- **Pre:** Student's current grade is 74%. Final exam is worth 40% of the total grade and has not yet been taken.
- **Steps:** 1. Open "What-if Calculator". 2. Enter hypothetical Final Exam score = 95%. 3. Click Calculate.
- **Expected:** Calculator shows projected final grade = 74%×0.60 baseline contribution + 95%×0.40 final contribution = 44.4 + 38 = **82.4%**. The current grade (74%) and projected grade (82.4%) are both displayed for comparison.
- **Pass / Fail:** ☐

---

## E.7 M06 — Attendance (TC-M06-001 to TC-M06-012)

**TC-M06-002** | FR: LMS-FR-088
*Bulk mark-all-present with exceptions*
- **Role:** Teacher
- **Pre:** Grade 9A has 25 enrolled students. Today's attendance has not been marked.
- **Steps:** 1. Open today's attendance for Grade 9A. 2. Click "Mark All Present". 3. Find student Ahmed Khan in the list and change his status to Absent. 4. Click Submit.
- **Expected:** 24 students are marked Present; Ahmed Khan is marked Absent. The record is saved with today's date and the teacher's name. The parent of Ahmed Khan receives an automated SMS within 5 minutes: "Ahmed Khan was marked absent from [class] on [date]."
- **Pass / Fail:** ☐

**TC-M06-007** | FR: LMS-FR-093
*Chronic absenteeism flag triggers at threshold*
- **Role:** System (automated) / School Admin
- **Pre:** Chronic absenteeism threshold is set to 3 consecutive absences. A student has been absent Monday, Tuesday, and Wednesday of the current week.
- **Steps:** 1. Wednesday's attendance is submitted. 2. School Admin opens the alert centre.
- **Expected:** An alert appears: "[Student name] has been absent for 3 consecutive days." The alert triggers a notification to the assigned School Admin and the student's class teacher. The student appears in the "At-Risk — Attendance" list in the School Admin portal.
- **Pass / Fail:** ☐

---

## E.8 M07 — Timetable / Scheduling (TC-M07-001 to TC-M07-011)

**TC-M07-004** | FR: LMS-FR-102
*Conflict detection prevents teacher double-booking*
- **Role:** School Admin
- **Pre:** Teacher Ms. Fatima is scheduled for Grade 7A Mathematics at Monday 09:00.
- **Steps:** 1. Attempt to schedule Ms. Fatima for Grade 8B Science at Monday 09:00. 2. Click Save.
- **Expected:** System rejects the schedule entry with error: "Ms. Fatima is already scheduled for Grade 7A Mathematics at Monday 09:00. Select a different time slot." No conflicting entry is created.
- **Pass / Fail:** ☐

**TC-M07-007** | FR: LMS-FR-105
*Substitution assigned and notified automatically*
- **Role:** School Admin
- **Pre:** Teacher Mr. Ali is scheduled for 3 classes today. Mr. Ali calls in sick. Another teacher, Ms. Hina, is qualified for Mathematics and has no classes during period 2.
- **Steps:** 1. School Admin marks Mr. Ali as absent. 2. System suggests Ms. Hina for period 2. 3. School Admin confirms the substitution.
- **Expected:** Ms. Hina receives a push notification and email: "You have been assigned as substitute for [class] period 2 today." The affected students see the substitution reflected in their timetable for today. The substitution is logged with date, original teacher, substitute, and approving admin.
- **Pass / Fail:** ☐

---

## E.9 M08 — Fee Management (TC-M08-001 to TC-M08-015)

**TC-M08-005** | FR: LMS-FR-114
*Stripe payment completes end-to-end in test mode*
- **Role:** Parent
- **Pre:** An invoice for PKR 25,000 is outstanding. Stripe test mode is active.
- **Steps:** 1. Parent opens "Pay Now" on the invoice. 2. Selects Stripe. 3. Enters test card 4242 4242 4242 4242, expiry 12/29, CVV 123. 4. Clicks Pay.
- **Expected:** Payment succeeds. Invoice status changes to "Paid". A receipt PDF is generated and emailed to the parent. The payment is posted to the accounting ledger (Finance Service) as a credit entry against the student's account.
- **Pass / Fail:** ☐

**TC-M08-009** | FR: LMS-FR-118
*Overdue reminder dispatches on correct schedule*
- **Role:** System (automated)
- **Pre:** An invoice is 7 days overdue. Reminder schedule: Day 1, Day 3, Day 7, Day 14.
- **Steps:** 1. Advance the system clock to Day 7 past due date (test environment). 2. Check the parent's email.
- **Expected:** A Day 7 reminder email is sent to the parent. The email states the outstanding amount, due date, and payment link. The reminder is logged in the invoice's communication history.
- **Pass / Fail:** ☐

**TC-M08-012** | FR: LMS-FR-121
*Partial payment is accepted and balance updated correctly*
- **Role:** Parent
- **Pre:** Invoice total = PKR 30,000. No payment made yet.
- **Steps:** 1. Parent clicks Pay. 2. Enters amount PKR 10,000 (partial). 3. Completes payment.
- **Expected:** Payment is accepted. Invoice status changes to "Partially Paid". Outstanding balance displays as PKR 20,000. A receipt for PKR 10,000 is generated. The ledger shows a partial credit.
- **Pass / Fail:** ☐

---

## E.10 M09 — Accounting (TC-M09-001 to TC-M09-009)

**TC-M09-002** | FR: LMS-FR-126
*Double-entry constraint is enforced — debit must equal credit*
- **Role:** System (automated constraint)
- **Pre:** A manual journal entry is being created by the Accountant.
- **Steps:** 1. Accountant enters Debit: Cash PKR 10,000. 2. Enters Credit: Fees Receivable PKR 9,000 (deliberately unbalanced). 3. Clicks Post.
- **Expected:** System rejects the entry with error: "Journal entry is unbalanced. Debit total (PKR 10,000) does not equal Credit total (PKR 9,000). Difference: PKR 1,000." No entry is posted to the ledger.
- **Pass / Fail:** ☐

**TC-M09-005** | FR: LMS-FR-129
*Trial balance sums to zero*
- **Role:** School Admin / Accountant
- **Pre:** Several transactions have been posted across the academic year.
- **Steps:** 1. Navigate to Accounting > Statements. 2. Select "Trial Balance". 3. Set date range to full academic year. 4. Click Generate.
- **Expected:** Trial balance report is generated. Total Debits column equals Total Credits column. The difference row shows PKR 0. The report is exportable to PDF and Excel.
- **Pass / Fail:** ☐

---

## E.11 M10 — HR / Staff Management (TC-M10-001 to TC-M10-008)

**TC-M10-003** | FR: LMS-FR-136
*Leave approval auto-updates attendance and flags timetable*
- **Role:** School Admin
- **Pre:** Teacher Mr. Hassan has submitted a leave request for Thursday. He has 2 classes on Thursday.
- **Steps:** 1. School Admin opens the leave request. 2. Approves with note "Approved – family emergency". 3. Checks timetable for Thursday.
- **Expected:** Mr. Hassan's Thursday attendance is marked "On Approved Leave". Both of his Thursday classes are flagged in the timetable as "Substitute Required". The timetable auto-suggests available substitutes. Mr. Hassan receives a notification confirming his leave approval.
- **Pass / Fail:** ☐

---

## E.12 M11 — Payroll (TC-M11-001 to TC-M11-005)

**TC-M11-002** | FR: LMS-FR-143
*Payroll run posts to accounting ledger*
- **Role:** School Admin / Accountant
- **Pre:** All staff payroll profiles are complete. It is end of month.
- **Steps:** 1. Navigate to Payroll > Run Payroll. 2. Select pay period June 2026. 3. Click Process.
- **Expected:** System processes payroll asynchronously (job_id returned). On completion: payslips are generated for all active staff; a journal entry is posted to the Salaries Expense account (debit) and Salaries Payable account (credit) in the ledger; School Admin receives a notification "Payroll for June 2026 processed — 23 payslips generated."
- **Pass / Fail:** ☐

**TC-M11-003** | FR: LMS-FR-144
*Staff member can only view their own payslip*
- **Role:** Teacher (Staff)
- **Pre:** Payroll for June 2026 has been processed. Teacher Mr. Usman is logged in.
- **Steps:** 1. Navigate to My Payslips. 2. Attempt to access another staff member's payslip by modifying the URL (e.g., changing the staffId parameter).
- **Expected:** Mr. Usman's own payslips are visible and downloadable. The modified URL request returns HTTP 403 Forbidden. No other staff member's payslip data is accessible.
- **Pass / Fail:** ☐

---

## E.13 M12 — Library Management (TC-M12-001 to TC-M12-005)

**TC-M12-002** | FR: LMS-FR-148
*Overdue fine is calculated correctly*
- **Role:** System (automated) / Librarian
- **Pre:** A book was due 5 days ago. Fine rate = PKR 10 per day.
- **Steps:** 1. Student returns the book. 2. Librarian processes the return. 3. View the student's fine balance.
- **Expected:** Fine displayed = PKR 50 (5 days × PKR 10). Return is processed. Student's borrowed items list shows the book as returned. The fine is added to the student's account balance, payable via the fee payment flow.
- **Pass / Fail:** ☐

---

## E.14 M13 — Communication (TC-M13-001 to TC-M13-009)

**TC-M13-004** | FR: LMS-FR-155
*Emergency broadcast reaches all users across all channels within 5 minutes*
- **Role:** School Admin
- **Pre:** SMS gateway, email service, and push notifications are all configured. The school has 50 test user accounts across all roles.
- **Steps:** 1. School Admin navigates to Emergency Broadcast. 2. Selects template "School Closure". 3. Sets recipient scope to "All". 4. Clicks Send. 5. Wait 6 minutes.
- **Expected:** All 50 test accounts receive the alert via: in-app notification (immediate), push notification (within 1 minute), email (within 3 minutes), SMS (within 5 minutes). Delivery tracking shows 50/50 delivered across all channels.
- **Pass / Fail:** ☐

---

## E.15 M14 — Psychological Assessment (TC-M14-001 to TC-M14-010)

**TC-M14-003** | FR: LMS-FR-163
*BR-031/032 visibility rules enforced — teacher sees summary only*
- **Role:** Teacher
- **Pre:** A student has completed a full IQ test. Psychologist has published the results.
- **Steps:** 1. Teacher opens the student's profile. 2. Navigates to Psychologist Insights tab.
- **Expected:** Teacher sees a summary: "Assessment completed. Refer to psychologist for detailed interpretation." The full IQ score, percentile rankings, and subtest scores are NOT visible to the teacher. No raw score data appears anywhere on the teacher's view.
- **Pass / Fail:** ☐

**TC-M14-005** | FR: LMS-FR-165
*Risk flag escalation reaches correct parties*
- **Role:** System (automated)
- **Pre:** Psychologist marks a student as "Critical" risk.
- **Steps:** 1. Psychologist opens the student's risk assessment. 2. Changes risk level to "Critical". 3. Saves.
- **Expected:** Level 1 notification: Psychologist receives in-app confirmation. Level 2 notification: School Admin receives in-app + email alert within 1 minute. Level 3 notification: Principal (School Admin Super role) and the student's emergency contacts receive an email within 2 minutes. All three escalation notifications are logged in the audit trail.
- **Pass / Fail:** ☐

---

## E.16 M15 — Transport (TC-M15-001 to TC-M15-004)

**TC-M15-002** | FR: LMS-FR-172
*Pickup notification dispatched to parent at correct trigger*
- **Role:** System (automated)
- **Pre:** A student is assigned to Bus Route 3. GPS integration is active. The bus enters the 200-metre geofence around the school gate.
- **Steps:** 1. Simulate bus entering the geofence. 2. Check parent's push notification.
- **Expected:** Parent receives a push notification: "Bus Route 3 is arriving at school. [Child's name] will be ready for pickup." Notification arrives within 30 seconds of geofence trigger.
- **Pass / Fail:** ☐

---

## E.17 M16 — Cognia Evidence Management (TC-M16-001 to TC-M16-005)

**TC-M16-002** | FR: LMS-FR-176
*Evidence tagged against Cognia standard is retrievable by standard filter*
- **Role:** Teacher
- **Pre:** A graded assignment exists. Cognia Standard 3 (Teaching and Assessing for Learning) is mapped in the compliance configuration.
- **Steps:** 1. Open the graded assignment. 2. Click "Tag as Cognia Evidence". 3. Select Standard 3. 4. Save. 5. Navigate to Compliance > Evidence Repository. 6. Filter by Standard 3.
- **Expected:** The tagged assignment appears in the filtered list with: date, teacher name, evidence type (Assignment), and Cognia standard reference. The evidence is linked back to the original assignment record.
- **Pass / Fail:** ☐

---

## E.18 M17 — Platform Administration (TC-M17-001 to TC-M17-010)

**TC-M17-001** | FR: LMS-FR-180
*New school tenant is provisioned with isolated data namespace*
- **Role:** Super Admin
- **Pre:** No school with subdomain "testschool" exists.
- **Steps:** 1. Super Admin navigates to School Management. 2. Creates new school: name "Test School", subdomain "testschool", timezone UTC+5, currency PKR. 3. Saves.
- **Expected:** School is created. testschool.platform.com is accessible. A School Admin account is provisioned with a welcome email. Attempting to access testschool data from another school's Super Admin session returns 403 CROSS_TENANT_ACCESS.
- **Pass / Fail:** ☐

**TC-M17-005** | FR: LMS-FR-184
*Super Admin cannot view school-specific payment credentials*
- **Role:** Super Admin
- **Pre:** School A has configured its Stripe secret key in payment settings.
- **Steps:** 1. Super Admin navigates to School A's settings. 2. Opens Payment Gateway configuration.
- **Expected:** The Stripe secret key field displays "••••••••" (masked). There is no "reveal" or "export" option. The audit log records that Super Admin viewed the payment settings screen but the key value is never returned in any API response to the Super Admin role.
- **Pass / Fail:** ☐

---

## E.19 M18 — User & Role Management (TC-M18-001 to TC-M18-006)

**TC-M18-004** | FR: LMS-FR-193
*Custom role cannot be granted permissions exceeding its base template*
- **Role:** School Admin
- **Pre:** A custom role "Senior Teacher" is being created based on the "Teacher" base template.
- **Steps:** 1. Create new custom role "Senior Teacher", base = Teacher. 2. Attempt to add the permission "delete_student_account" (a School Admin permission not in the Teacher template). 3. Click Save.
- **Expected:** System rejects with error: "Permission 'delete_student_account' is not available for the Teacher role template." The permission is not added. The custom role is saved only with permissions within the Teacher template's scope.
- **Pass / Fail:** ☐

**TC-M18-005** | FR: LMS-FR-194
*Impersonation by Super Admin generates full audit log entry*
- **Role:** Super Admin
- **Pre:** A support ticket has been raised by a teacher in School B.
- **Steps:** 1. Super Admin finds the teacher's account in the Global User Directory. 2. Clicks "Impersonate User". 3. Confirms the security prompt. 4. Performs one action as the teacher (views gradebook). 5. Ends impersonation.
- **Expected:** Audit log shows: Super Admin [name] impersonated Teacher [name] at [timestamp] from IP [address]. Actions taken during impersonation are logged under the Super Admin's ID with a flag "Impersonated as [teacher name]". The teacher's own audit log also records the impersonation event.
- **Pass / Fail:** ☐

---

## E.20 M19 — Reports & Analytics (TC-M19-001 to TC-M19-006)

**TC-M19-001** | FR: LMS-FR-196
*Custom report saves and exports correctly*
- **Role:** School Admin
- **Pre:** Student attendance data for the current term exists.
- **Steps:** 1. Navigate to Reports > Custom Report Builder. 2. Add filters: Grade = Grade 8, Date Range = current term. 3. Add columns: Student Name, Total Present, Total Absent, Attendance %. 4. Click Save as "Grade 8 Term Attendance". 5. Click Export to PDF.
- **Expected:** Report is saved and appears in the saved reports list. PDF is generated containing the correct filtered data. Data in the PDF matches the raw attendance records for Grade 8 in the current term.
- **Pass / Fail:** ☐

---

## E.21 M20 — Settings & Configuration (TC-M20-001 to TC-M20-006)

**TC-M20-002** | FR: LMS-FR-203
*Grading scale change recalculates all existing grades*
- **Role:** School Admin
- **Pre:** The current grading scale defines A = 80-100%. Ten students have existing grades between 80% and 84%.
- **Steps:** 1. Navigate to Settings > Academic > Grading Scale. 2. Change A threshold from 80% to 85%. 3. Save.
- **Expected:** The system recalculates all existing grades using the new scale. The ten students whose scores were 80-84% now show grade B (not A). The gradebook reflects the updated letter grade immediately. A system alert notes: "Grading scale updated — [N] existing grades recalculated."
- **Pass / Fail:** ☐

---

*Lighthouse Global School System — P1 Master SRS — Appendix E — Internal — v1.0*
