# OpenFrame Education

## Current State
The Field Executive (FE) dashboard stores GPS check-ins in `localStorage["FE_GPS_CHECKINS"]` and enrollment leads in `localStorage["oe_leads"]`. The Admin panel reads from the same localStorage keys. Since localStorage is per-device/browser, data submitted on the FE's device never appears in the Admin panel on a different device.

## Requested Changes (Diff)

### Add
- Backend: `GpsCheckIn` type with fields: id (Nat), feId (Text), time (Text), date (Text), lat (Float), lng (Float), purpose (Text), leadName (Text)
- Backend: `createGpsCheckIn(checkIn: GpsCheckIn)` - public shared, anyone can call
- Backend: `getAllGpsCheckIns()` - returns all GPS check-ins, admin can view
- FE Dashboard: "Enroll Student" form that calls `createDemoBooking` on the backend (instead of localStorage)
- FE Dashboard: GPS Check-In button saves to backend via `createGpsCheckIn` (in addition to localStorage for immediate local display)

### Modify
- Admin FE Locations section: read from backend `getAllGpsCheckIns()` instead of localStorage
- Admin Enrollments section: read from backend `getAllDemoBookings()` instead of localStorage `oe_leads`
- FE Dashboard: enrollment form saves to backend, not just localStorage
- FE Dashboard: GPS check-in saves to backend, not just localStorage

### Remove
- Dependency on localStorage for cross-device data sharing (GPS and enrollments)

## Implementation Plan
1. Update `src/backend/main.mo`: Add GpsCheckIn type, storage map, createGpsCheckIn, getAllGpsCheckIns
2. Update frontend FE dashboard to call backend for GPS check-in and enrollment submission
3. Update Admin dashboard FE Locations to poll backend getAllGpsCheckIns
4. Update Admin Enrollments/FE leads to read from backend getAllDemoBookings
