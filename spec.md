# OpenFrame Education

## Current State

The app has:
- Landing page with all marketing sections
- Login page with role-based demo access
- 5 dashboards: Admin, Student, Parent, Teacher, FieldExec
- localStorage-backed referral system (referralStore utility)
- EnrollmentLead type: studentName, parentName, mobile, classLevel, courseSelected, cityVillage, referralCode, feAccountId, status, paymentStatus, commissionAmount, commissionPaid, createdAt
- Admin panel has: Overview, Enrollment Leads (table with Approve/Reject/Mark Paid), FE Management, Withdrawals, Commission Reports, Demo Bookings, Students, Attendance, Payments, Referrals, Certificates, Study Materials, Class Schedule
- FieldExec dashboard has: Overview (stats), Commission Plan, Pragati Magazine, Course Programs, Add Referral (form), My Leads, Share Link, My Referrals, Withdraw

## Requested Changes (Diff)

### Add

**Admin Panel – Enrollment Leads:**
- Page title: "Student Enrollment Leads"
- Table columns: Student Name, Parent Name, Mobile Number, Class, Course, City, Field Executive (name/ID), Date, Status
- Four action buttons per row: Approve, Reject, Contact Student (opens WhatsApp), Mark Payment Received
- Show parent name in a dedicated column (currently only shown as sub-text under student name)
- Add "Contact Student" button that opens `https://wa.me/<mobile>` for each lead row

**Admin Panel – Magazine Orders section:**
- New nav item "Magazine Orders" in Admin panel
- Shows all Pragati Study Magazine orders submitted from FE dashboard
- Columns: Student Name, Mobile, Address, Quantity, FE Name/ID, Date, Status
- Admin can mark order as "Fulfilled"

**Field Executive Dashboard – Enrollment Form (new section):**
- Rename/repurpose "Add Referral" to "Enroll Student"
- Form fields: Student Name, Parent Name, Mobile Number, Class (dropdown: Nursery-UKG / 1st-5th / 6th-8th / 9th-10th / 11th-12th), Course Plan (Basic / Standard / Premium)
- Button: "Enroll Student"
- On submit → saves as EnrollmentLead to localStorage → appears in Admin Enrollment Leads

**Field Executive Dashboard – Magazine Order Form:**
- In the "Pragati Magazine" section, add a Magazine Order Form below the existing promo content
- Fields: Student Name, Mobile Number, Address, Quantity
- Button: "Submit Order"
- On submit → saves as MagazineOrder to localStorage → appears in Admin Magazine Orders

**Leaderboard section (both Admin and FE dashboard):**
- Admin: new "Leaderboard" nav item showing top FEs by enrollment count this month
- FE: new "Leaderboard" section showing top FEs (rankings 1-10) with rank, name, and student count
- Title: "Top Field Executives This Month"

**localStorage types (new):**
- `MagazineOrder`: orderId, studentName, mobile, address, quantity, feAccountId, referralCode, status ("Pending"/"Fulfilled"), createdAt

### Modify

**Admin – Enrollment Leads table:**
- Add dedicated "Parent Name" column (currently hidden as sub-text)
- Add dedicated "Mobile Number" column
- Add "Date" column (formatted as "DD Mon")
- Add "Contact Student" button (WhatsApp link) alongside Approve/Reject
- Add "Mark Payment Received" as a separate button visible after Approve (rename from "Mark Paid" to "Mark Payment Received")
- Section title shown as "Student Enrollment Leads"

**FE Dashboard – "Add Referral" section:**
- Rename nav label from "Add Referral" to "Enroll Student"
- Rename form title to "Enroll a Student"
- Change Course Plan dropdown to show: Basic / Standard / Premium (remove "Pragati Magazine" option from this form — it belongs to the Magazine Order Form)
- Change submit button from "Submit Referral" to "Enroll Student"

**Overview stats on FE Dashboard:**
- Update stats cards to: "Students Enrolled", "Magazine Sold", "Commission Earned", "Bonus Earned"
- Values come from feAccount localStorage state

### Remove

- "Pragati Magazine" as a plan option in the Enroll Student form (moved to dedicated Magazine Order Form)

## Implementation Plan

1. **Add MagazineOrder type and localStorage helpers** in `referralStore.ts`: `saveMagazineOrder`, `getMagazineOrders`, `fulfillMagazineOrder`
2. **Update Admin Dashboard:**
   - Update Enrollment Leads table: add Parent Name column, Mobile Number column, Date column, Contact Student WhatsApp button, rename "Mark Paid" to "Mark Payment Received", update section title to "Student Enrollment Leads"
   - Add "Magazine Orders" nav item and section (table + fulfill action)
   - Add "Leaderboard" nav item and section (ranked list of FEs by enrollment count)
3. **Update Field Executive Dashboard:**
   - Rename "Add Referral" nav item/section to "Enroll Student"
   - Update enroll form: remove Pragati Magazine plan option, change button to "Enroll Student"
   - Add Magazine Order Form in the Pragati Magazine section
   - Update Overview stats labels
   - Add "Leaderboard" nav item and section
