# OpenFrame Education - Teacher Dashboard Redesign

## Current State
- Teacher Management page exists at `/teacher-dashboard` (TeacherManagementPage.tsx)
- Internet Identity login only, teachers can log in freely without pre-created profiles
- Sidebar with: Dashboard, My Classes, Students, Attendance, Homework, Class Tracking, Reports, Notifications, Profile
- Attendance supports photo/document upload
- Admin Panel has 8 teacher management sections
- UI uses generic blue color scheme, not a dark professional SaaS style

## Requested Changes (Diff)

### Add
- Dark blue professional SaaS-style UI theme (navy/slate sidebar, dark header)
- Dashboard overview stats: Total Classes Assigned, Total Students, Today's Classes, Pending Homework, Attendance % today
- My Classes: Nursery-12th with Section A/B/C, subject, student count, clickable to class details
- Students section: class-wise list, search, filter by class, view student profile modal
- Attendance: date picker, daily + monthly % display, edit attendance option, photo/document upload
- Homework: Add/Edit/Delete with title, description, subject, due date, file attachment (PDF/Image)
- Class Tracking: log completed classes, add session notes, mark syllabus complete, pending syllabus view
- Reports: attendance report + class performance report, CSV download/export
- Notifications: teacher can send messages to students/parents (stored); receive Admin messages
- Profile: view/edit name, subjects, assigned classes
- Admin Panel: new section to view teacher-sent notifications and class tracking logs

### Modify
- Full visual redesign of TeacherManagementPage.tsx to dark blue SaaS dashboard style
- All sidebar sections upgraded with richer UI and more functionality
- Attendance system enhanced with monthly stats and edit capability
- Reports section upgraded with CSV export

### Remove
- Generic/light color theme replaced with dark professional theme

## Implementation Plan
1. Redesign TeacherManagementPage.tsx with dark blue SaaS sidebar + layout
2. Build Dashboard Overview with stat cards
3. Build My Classes section with class cards and detail view
4. Build Students section with search/filter/profile view
5. Build enhanced Attendance system (date picker, monthly %, edit, photo upload)
6. Build Homework module (CRUD, file attach)
7. Build Class Tracking (completed/pending, notes)
8. Build Reports with CSV export
9. Build Notifications (send + receive)
10. Build Profile (view/edit)
11. Update Admin Panel to show teacher notifications and class tracking logs
