# OpenFrame Education -- Analytics Dashboard

## Current State
The platform has 4 role-based dashboards: AdminDashboard, TeacherDashboard, StudentDashboard, FieldExecDashboard. Each has multiple sections but no chart-based analytics. The shadcn `chart.tsx` component (Recharts wrapper) is already available.

## Requested Changes (Diff)

### Add
- Analytics section inside AdminDashboard: 6 stat cards + 5 charts (revenue line, enrollment line, teacher performance bar, attendance pie, FE performance bar). Daily/Weekly/Monthly filter. CSV download.
- Analytics section inside TeacherDashboard: student performance line chart, class attendance bar chart, homework completion pie chart. Filter by class and date range.
- Analytics section inside StudentDashboard: personal performance growth line chart, subject-wise marks bar chart, attendance donut chart. "Improvement vs Last Month" insight badge.
- Analytics section inside FieldExecDashboard: daily visits bar chart, leads collected line chart, conversion rate pie chart. Check-in/check-out stats. Location summary table (no map library).
- Auto-insights text (e.g. "Revenue increased by 25%") derived from sample data comparisons.
- Low attendance and performance drop alerts/badges where relevant.

### Modify
- Each dashboard's existing sidebar/section list to include an "Analytics" entry.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/components/analytics/` with reusable chart components using shadcn chart.tsx (Recharts).
2. Add Analytics section to AdminDashboard with 5 charts + 6 stat cards + filter + CSV export.
3. Add Analytics section to TeacherDashboard with 3 charts + class/date filters.
4. Add Analytics section to StudentDashboard with 3 charts + improvement badge.
5. Add Analytics section to FieldExecDashboard with 3 charts + location summary table.
6. All charts use realistic sample/mock data.
7. Validate (lint + typecheck + build).
