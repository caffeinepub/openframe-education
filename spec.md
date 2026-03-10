# OpenFrame Education

## Current State
Multi-section landing page with hero, about, classes, features, why choose us, demo form, testimonials, pricing, teachers, CTA, and startup India sections. All five dashboards are implemented. Enrollment flow goes to /enroll.

## Requested Changes (Diff)

### Add
- New `CompetitiveExamsSection` component on the homepage covering:
  - Hero subsection: "Prepare for India's Top Competitive Exams" headline, subheadline, Register Now (/enroll) and WhatsApp buttons
  - Exams We Cover: 3 columns — School Entrance Exams, Scholarship Exams, Olympiad Exams (with listed items)
  - Why Choose Us: 4 feature boxes (Expert Guidance, Study Materials & Mock Tests, Online Learning Support, Certification & Skill Development)
  - CTA: "Start Your Competitive Exam Preparation Today", Register Now + WhatsApp buttons, footer line with DPIIT recognition

### Modify
- LandingPage.tsx: import and render `CompetitiveExamsSection` before the `StartupIndiaSection`

### Remove
- Nothing

## Implementation Plan
1. Create `src/frontend/src/components/landing/CompetitiveExamsSection.tsx`
2. Update `src/frontend/src/pages/LandingPage.tsx` to include the new section
