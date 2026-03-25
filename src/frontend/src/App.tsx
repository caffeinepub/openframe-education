import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { BlogDetailPage } from "./pages/BlogDetailPage";
import { BlogPage } from "./pages/BlogPage";
import { EnrollmentFormPage } from "./pages/EnrollmentFormPage";
import { FEPortalPage } from "./pages/FEPortalPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { PragatiPage } from "./pages/PragatiPage";
import { TeacherManagementPage } from "./pages/TeacherManagementPage";
import { AdminDashboard } from "./pages/dashboards/AdminDashboard";
import { FieldExecDashboard } from "./pages/dashboards/FieldExecDashboard";
import { ParentDashboard } from "./pages/dashboards/ParentDashboard";
import { StudentDashboard } from "./pages/dashboards/StudentDashboard";
import { TeacherDashboard } from "./pages/dashboards/TeacherDashboard";

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

// Define routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/admin",
  component: AdminDashboard,
});

const studentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/student",
  component: StudentDashboard,
});

const parentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/parent",
  component: ParentDashboard,
});

const teacherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/teacher",
  component: TeacherDashboard,
});

const fieldExecRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/field-exec",
  component: FieldExecDashboard,
});

const pragatiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pragati",
  component: PragatiPage,
});

const enrollRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/enroll",
  component: EnrollmentFormPage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogPage,
});

const blogDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$slug",
  component: BlogDetailPage,
});

const fePortalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fe-portal",
  component: FEPortalPage,
});

const teacherManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teacher-dashboard",
  component: TeacherManagementPage,
});

// Route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminRoute,
  studentRoute,
  parentRoute,
  teacherRoute,
  fieldExecRoute,
  pragatiRoute,
  enrollRoute,
  blogRoute,
  blogDetailRoute,
  teacherManagementRoute,
  fePortalRoute,
]);

// Router
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
