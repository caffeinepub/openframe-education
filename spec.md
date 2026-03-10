# OpenFrame Education – Blog System

## Current State

The OpenFrame Education platform has:
- A multi-section homepage (LandingPage.tsx)
- A Navbar with links to About, Classes, Features, Pricing, Teachers, Contact, and Pragati Magazine
- Five dashboards: Admin, Student, Parent, Teacher, Field Executive
- An AdminDashboard with referral tracking, enrollment leads, FE management, withdrawals, commission reports, leaderboard
- An EnrollmentFormPage at /enroll
- A PragatiPage at /pragati
- Routing via TanStack Router in App.tsx

## Requested Changes (Diff)

### Add
- New public `/blog` page: "Education Blog" listing all published blog posts in a 3-column card grid
- New public `/blog/:slug` page: Full blog post view with large image, title, content, social share buttons, related blogs, footer note
- Blog categories: Competitive Exams, Scholarships, Olympiad Exams, Career Guidance, Study Tips
- 4 sample pre-filled blog posts (one per category mix), each with title, short description, content, author, date, category, slug, and a placeholder image
- "Blog" nav link added to Navbar (routes to /blog)
- Admin Blog Manager section inside AdminDashboard: table of all blogs, Add/Edit/Delete, Publish/Unpublish toggles
- Blog add/edit form with fields: Title, Slug (auto-generated from title), Category (dropdown), Short Description, Content (rich textarea), SEO Title, Meta Description, Keywords, Image upload (via blob-storage), Published toggle
- Blob-storage used for real image file uploads in the admin blog manager

### Modify
- Navbar: add "Blog" link pointing to /blog
- App.tsx: add /blog and /blog/$slug routes
- AdminDashboard: add a "Blog Manager" tab/section

### Remove
- Nothing removed

## Implementation Plan

1. Backend: Create Blog data model with fields: id, title, slug, category, shortDescription, content, authorName, date, imageUrl, seoTitle, metaDescription, keywords, published. CRUD operations: createBlog, updateBlog, deleteBlog, publishBlog, unpublishBlog, getBlogs, getBlogBySlug. Seed 4 sample blogs.
2. Blob-storage: used for image uploads in admin blog form.
3. Frontend – BlogPage (/blog): filter bar by category, 3-col card grid, each card with image/title/short desc/author/date/Read More button.
4. Frontend – BlogDetailPage (/blog/:slug): hero image, title, content, social share (WhatsApp, Facebook, Twitter/copy link), related blogs grid at bottom, footer note.
5. Frontend – Admin Blog Manager: new tab inside AdminDashboard, table with all blogs, publish toggle, edit/delete buttons, Add New Blog form in a dialog with all required fields including image upload.
6. Navbar: add Blog link.
7. App.tsx: register new routes.
