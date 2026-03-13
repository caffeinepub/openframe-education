# OpenFrame Education – Teacher Management System

## Current State

The platform has:
- Admin Dashboard at `/dashboard/admin` with sections: overview, enrollment-leads, magazine-orders, leaderboard, fe-management, withdrawals, commission-reports, demo-bookings, students, attendance, payments, referrals, class-schedule, study-materials, blog-manager, settings
- Teacher Dashboard at `/dashboard/teacher` (basic, not feature-complete)
- DashboardLayout component with sidebar nav
- localStorage-backed stores: blogStore, referralStore
- App routes defined in App.tsx

## Requested Changes (Diff)

### Add
- `src/frontend/src/utils/teacherStore.ts`: localStorage-backed store for all teacher management data (teachers, students, classes, attendance, class tracking, homework, notifications)
- New route `/teacher-dashboard` pointing to a full Teacher Management Dashboard page
- Teacher login page embedded in the `/teacher-dashboard` route (email + password, no backend auth)
- New Admin Panel sections: Teachers, Students (school), Classes, Attendance Reports, Class Tracking, Homework, Notifications, Teacher Analytics
- Teacher Dashboard page with sidebar: Dashboard, My Classes, Students, Attendance, Homework, Reports, Profile, Logout

### Modify
- `AdminDashboard.tsx`: Add 8 new nav items and renderContent cases for teacher management sections
- `App.tsx`: Add `/teacher-dashboard` route

### Remove
- Nothing removed

## Implementation Plan

1. Create `teacherStore.ts` with types and localStorage CRUD for:
   - Teacher accounts (id, name, email, password, phone, subject, qualification, assignedClasses, profilePhoto)
   - School students (id, name, classId, section, rollNumber, parentName, parentPhone, dob)
   - Classes (id, className, section, teacherId) – pre-seeded with Nursery, LKG, UKG, 1–12 × sections A,B,C
   - Attendance records (studentId, classId, teacherId, date, status, documentUrl)
   - Class tracking records (teacherId, classId, subject, date, startTime, endTime, topicCovered, homeworkGiven)
   - Homework (teacherId, classId, title, description, fileUrl, dueDate)
   - Notifications (title, message, sentBy, sentTo, date, read)

2. Create `TeacherManagementPage.tsx` at `/teacher-dashboard`:
   - Shows a login form (email + password) if not logged in as a teacher
   - On login: looks up teacher by email+password from teacherStore, stores session in sessionStorage
   - After login: shows full Teacher Dashboard with sidebar
   - Sidebar sections: Dashboard (summary stats), My Classes, Students, Attendance (mark + upload doc), Homework (upload file), Class Tracking, Reports, Profile, Notifications, Logout

3. Update `AdminDashboard.tsx`:
   - Add nav items: teachers, school-students, school-classes, teacher-attendance, class-tracking, teacher-homework, teacher-notifications, teacher-analytics
   - Implement each section's UI:
     - Teachers: table + add/edit/delete teacher form (includes setting email/password)
     - School Students: table + add/edit/delete
     - School Classes: show all classes with section and assigned teacher
     - Attendance Reports: filterable table by class/date
     - Class Tracking: view all entries submitted by teachers
     - Homework: view all homework entries
     - Notifications: compose and send notification to specific teacher or all teachers
     - Teacher Analytics: cards showing total teachers, students, today's attendance %, classes today

4. Update `App.tsx` to add the `/teacher-dashboard` route
