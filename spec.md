# OpenFrame Education - FE Enrollment & Admin Management System

## Current State
The platform already has a FieldExecDashboard at `/dashboard/field-exec` with GPS check-in, enrollment form, leaderboard, and daily tasks. The AdminDashboard at `/dashboard/admin` has an Enrollment Leads section and FE Locations section. The backend has `DemoBooking`, `GpsCheckIn`, and `UserProfile` models.

## Requested Changes (Diff)

### Add
- `FieldExecutive` record type in backend (id, name, phone, location, status, createdAt)
- `FEEnrollment` record type in backend (id, studentName, studentPhone, classLevel, courseType, feId, feName, createdAt)
- Backend functions: createFieldExecutive, getAllFieldExecutives, updateFieldExecutive, createFEEnrollment, getAllFEEnrollments, getFEEnrollmentsByFE
- FE Portal login page at `/fe-portal` with username/password (stored in localStorage, persisted on refresh)
- New FE Portal dashboard showing: total enrollments, daily target progress bar (100 enrollments/day)
- Enrollment form inside FE Portal: Student Name, Phone, Class (Nursery/LKG/UKG/1-12), Course Type (Tuition/Olympiad/MCQ), auto-attaches FE ID
- Admin panel new section: "FE Management" with FE list (Name | Phone | Location | Total Enrollments | Status), activate/deactivate button
- Admin panel new section: "FE Enrollments" with full table (Student Name | Phone | Class | Course | FE Name | Date), search/filter by student name, phone, date, FE
- Leaderboard in Admin panel: top FEs by enrollment count
- Export to CSV/Excel button in Admin FE Enrollments section

### Modify
- Admin Dashboard: add FE enrollment stats cards (Total FE Enrollments Today, Total Active FEs)
- FieldExecDashboard: keep existing features but add link to new `/fe-portal` for the new dedicated system

### Remove
- Nothing removed

## Implementation Plan
1. Add FieldExecutive and FEEnrollment types + CRUD functions to backend main.mo
2. Build `/fe-portal` page with login (localStorage session), dashboard stats, enrollment form
3. Add "FE Management" and "FE Enrollments" sections to AdminDashboard
4. Wire all data through backend actor hooks
5. Add export CSV logic on the admin enrollments table
6. Add route `/fe-portal` in App.tsx
