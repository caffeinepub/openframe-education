import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
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

// Route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminRoute,
  studentRoute,
  parentRoute,
  teacherRoute,
  fieldExecRoute,
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
