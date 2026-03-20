# OpenFrame Education

## Current State
The app is a multi-role EdTech platform with Admin, Teacher, Field Executive, Student, and Parent dashboards. Key existing features: Internet Identity login for teachers, GPS check-in for FEs, class level dropdowns, referral/commission system, blog, Pragati magazine.

## Requested Changes (Diff)

### Add
- FE Dashboard: Daily Task Tracking section (nav + render) with task list CRUD
- FE Dashboard: Attendance section for FEs to mark their own daily attendance
- GPS check-ins saved to localStorage key `FE_GPS_CHECKINS` (array of check-in objects)
- Admin FE Locations section reads from localStorage `FE_GPS_CHECKINS` instead of SAMPLE_FE_VISIT_LOGS

### Modify
- TeacherDashboard login: add pending-retry logic so that when `isLoginError` and user clicks login, call `clear()` first then auto-retry when `isLoginIdle` resumes, fixing the "Internet identity login failed" loop
- Class levels everywhere: replace grouped entries ("Nursery – UKG", "1st to 5th", etc.) with 13 individual levels: Nursery, UKG, LKG, 1st Standard, 2nd Standard, 3rd Standard, 4th Standard, 5th Standard, 6th Standard, 7th Standard, 8th Standard, 9th Standard, 10th Standard, 11th Standard, 12th Standard
- FE Dashboard navItems: replace grouped class nav entries with proper label structure

### Remove
- Admin FE Locations: remove SAMPLE_FE_VISIT_LOGS dependency for FE location display

## Implementation Plan
1. Fix TeacherDashboard login: add `useRef` pendingRetry, `useEffect` watching `isLoginIdle`, wrap login button onClick
2. Fix GPS sync: in FieldExecDashboard `handleGpsCheckIn`, after `setGpsCheckIns`, also write to localStorage. On mount, load from localStorage into state.
3. Fix Admin GPS panel: read from `FE_GPS_CHECKINS` localStorage and display live data (with fallback empty state)
4. Fix class levels: update `classLevels` array in TeacherDashboard, FieldExecDashboard, and any other dropdowns to 13 individual levels
5. Add Daily Task Tracking section to FE dashboard: simple add/complete/delete task list stored in localStorage
6. Add Attendance section to FE dashboard: FE marks Present/Absent/Half-day for themselves each day, stored in localStorage
