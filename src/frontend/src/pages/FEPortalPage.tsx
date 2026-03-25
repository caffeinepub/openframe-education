import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────
interface FESession {
  username: string;
  feId: string;
  name: string;
  phone: string;
  location: string;
}

interface FEEnrollment {
  id: string;
  studentName: string;
  studentPhone: string;
  classLevel: string;
  courseType: string;
  feId: string;
  feName: string;
  createdAt: string;
}

// ─── Sample Credentials ───────────────────────────────────────────────────────
const FE_CREDENTIALS: Record<
  string,
  { password: string; profile: Omit<FESession, "username"> }
> = {
  fe001: {
    password: "Field@123",
    profile: {
      feId: "fe001",
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      location: "Laxmeshwar",
    },
  },
  fe002: {
    password: "Field@123",
    profile: {
      feId: "fe002",
      name: "Priya Sharma",
      phone: "+91 87654 32109",
      location: "Gadag",
    },
  },
};

const CLASS_LEVELS = [
  "Nursery",
  "LKG",
  "UKG",
  "1st Standard",
  "2nd Standard",
  "3rd Standard",
  "4th Standard",
  "5th Standard",
  "6th Standard",
  "7th Standard",
  "8th Standard",
  "9th Standard",
  "10th Standard",
  "11th Standard",
  "12th Standard",
];

const DAILY_TARGET = 100;

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function FEPortalPage() {
  const [session, setSession] = useState<FESession | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "new-enrollment" | "my-enrollments"
  >("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Enrollment form state
  const [enrollForm, setEnrollForm] = useState({
    studentName: "",
    studentPhone: "",
    classLevel: "",
    courseType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enrollments data
  const [enrollments, setEnrollments] = useState<FEEnrollment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-login on mount
  useEffect(() => {
    const saved = lsGet<FESession | null>("feSession", null);
    if (saved) {
      setSession(saved);
      loadEnrollments(saved.feId);
    }
  }, []);

  function loadEnrollments(feId: string) {
    const all = lsGet<FEEnrollment[]>("feEnrollments", []);
    setEnrollments(all.filter((e) => e.feId === feId));
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    const usernameLower = username.trim().toLowerCase();

    // Check hardcoded FE credentials (username case-insensitive, password case-sensitive)
    const cred = FE_CREDENTIALS[usernameLower];

    // Check admin-created FEs: match by username (case-insensitive) OR name (case-insensitive), password case-sensitive
    const adminFEs = lsGet<
      Array<{
        username: string;
        password: string;
        feId: string;
        name: string;
        phone: string;
        location: string;
        status: string;
      }>
    >("fePortalFEs", []);
    const adminFE = adminFEs.find(
      (fe) =>
        (fe.username.toLowerCase() === usernameLower ||
          fe.name.toLowerCase() === usernameLower) &&
        fe.password === password &&
        fe.status !== "inactive",
    );

    setTimeout(() => {
      setIsLoggingIn(false);
      if (cred && cred.password === password) {
        const newSession: FESession = {
          username: usernameLower,
          ...cred.profile,
        };
        lsSet("feSession", newSession);
        setSession(newSession);
        loadEnrollments(newSession.feId);
        toast.success(`Welcome back, ${cred.profile.name}!`);
      } else if (adminFE) {
        const newSession: FESession = {
          username: adminFE.username,
          feId: adminFE.feId,
          name: adminFE.name,
          phone: adminFE.phone,
          location: adminFE.location,
        };
        lsSet("feSession", newSession);
        setSession(newSession);
        loadEnrollments(newSession.feId);
        toast.success(`Welcome back, ${adminFE.name}!`);
      } else {
        setLoginError(
          "Invalid username or password. Please check your credentials or contact admin.",
        );
      }
    }, 600);
  }

  function handleLogout() {
    try {
      localStorage.removeItem("feSession");
    } catch {}
    setSession(null);
    setActiveTab("dashboard");
    toast.success("Logged out successfully");
  }

  function handleEnrollSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    if (
      !enrollForm.studentName ||
      !enrollForm.studentPhone ||
      !enrollForm.classLevel ||
      !enrollForm.courseType
    ) {
      toast.error("Please fill all fields");
      return;
    }
    setIsSubmitting(true);

    const newEnrollment: FEEnrollment = {
      id: `enr_${Date.now()}`,
      studentName: enrollForm.studentName,
      studentPhone: enrollForm.studentPhone,
      classLevel: enrollForm.classLevel,
      courseType: enrollForm.courseType,
      feId: session.feId,
      feName: session.name,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const all = lsGet<FEEnrollment[]>("feEnrollments", []);
    all.push(newEnrollment);
    lsSet("feEnrollments", all);
    setEnrollments(all.filter((e) => e.feId === session.feId));

    setEnrollForm({
      studentName: "",
      studentPhone: "",
      classLevel: "",
      courseType: "",
    });
    setIsSubmitting(false);
    setActiveTab("my-enrollments");
    toast.success(`${enrollForm.studentName} enrolled successfully!`);
  }

  const todayStr = new Date().toDateString();
  const todayEnrollments = enrollments.filter(
    (e) => new Date(e.createdAt).toDateString() === todayStr,
  );
  const progressPct = Math.min(
    (todayEnrollments.length / DAILY_TARGET) * 100,
    100,
  );

  const filteredEnrollments = enrollments.filter(
    (e) =>
      e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.studentPhone.includes(searchQuery),
  );

  if (!session) {
    return (
      <FELoginPage
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        loginError={loginError}
        isLoggingIn={isLoggingIn}
        onSubmit={handleLogin}
      />
    );
  }

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "new-enrollment",
      label: "New Enrollment",
      icon: <PlusCircle className="w-4 h-4" />,
    },
    {
      id: "my-enrollments",
      label: "My Enrollments",
      icon: <ClipboardList className="w-4 h-4" />,
    },
  ] as const;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "oklch(0.97 0.01 255)" }}
    >
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || true) && (
          <aside
            className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:z-auto ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }`}
            style={{
              width: 240,
              background: "oklch(0.22 0.07 262)",
              minHeight: "100vh",
            }}
          >
            {/* Logo */}
            <div
              className="flex items-center gap-3 px-5 py-5 border-b"
              style={{ borderColor: "oklch(0.32 0.07 262)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.55 0.18 262)" }}
              >
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">OpenFrame</p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.75 0.08 262)" }}
                >
                  FE Portal
                </p>
              </div>
              <button
                type="button"
                className="ml-auto md:hidden text-white/60 hover:text-white"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FE info */}
            <div
              className="px-5 py-4 border-b"
              style={{ borderColor: "oklch(0.32 0.07 262)" }}
            >
              <p className="text-xs font-semibold text-white">{session.name}</p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.75 0.08 262)" }}
              >
                {session.feId.toUpperCase()} · {session.location}
              </p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background:
                      activeTab === item.id
                        ? "oklch(0.55 0.18 262)"
                        : "transparent",
                    color:
                      activeTab === item.id ? "white" : "oklch(0.78 0.05 262)",
                  }}
                  data-ocid={`fe_portal.${item.id}.tab`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div
              className="p-3 border-t"
              style={{ borderColor: "oklch(0.32 0.07 262)" }}
            >
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ color: "oklch(0.78 0.05 262)" }}
                data-ocid="fe_portal.logout.button"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 md:px-6 py-4 bg-white border-b border-border sticky top-0 z-30">
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            data-ocid="fe_portal.menu.button"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold text-foreground">
            {navItems.find((n) => n.id === activeTab)?.label}
          </h1>
          <div className="ml-auto">
            <Link
              to="/"
              className="text-xs text-foreground/60 hover:text-foreground transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* ── Dashboard ── */}
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: "oklch(0.93 0.05 262)" }}
                      >
                        <Users
                          className="w-4 h-4"
                          style={{ color: "oklch(0.45 0.18 262)" }}
                        />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {enrollments.length}
                    </p>
                    <p className="text-xs text-foreground/60">
                      Total Enrollments
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: "oklch(0.93 0.08 145)" }}
                      >
                        <TrendingUp
                          className="w-4 h-4"
                          style={{ color: "oklch(0.45 0.18 145)" }}
                        />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {todayEnrollments.length}
                    </p>
                    <p className="text-xs text-foreground/60">
                      Today's Enrollments
                    </p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: "oklch(0.93 0.07 55)" }}
                      >
                        <Target
                          className="w-4 h-4"
                          style={{ color: "oklch(0.50 0.18 55)" }}
                        />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {DAILY_TARGET}
                    </p>
                    <p className="text-xs text-foreground/60">Daily Target</p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: "oklch(0.94 0.06 330)" }}
                      >
                        <BookOpen
                          className="w-4 h-4"
                          style={{ color: "oklch(0.45 0.20 330)" }}
                        />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(progressPct)}%
                    </p>
                    <p className="text-xs text-foreground/60">
                      Target Progress
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Daily target progress */}
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Daily Target Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-foreground/60 mb-2">
                    <span>{todayEnrollments.length} enrolled today</span>
                    <span>Target: {DAILY_TARGET}</span>
                  </div>
                  <Progress
                    value={progressPct}
                    className="h-3 rounded-full"
                    data-ocid="fe_portal.daily_target.loading_state"
                  />
                  {progressPct >= 100 && (
                    <p
                      className="text-xs font-semibold mt-2"
                      style={{ color: "oklch(0.45 0.18 145)" }}
                    >
                      🎉 Daily target achieved!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Recent enrollments */}
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Recent Enrollments
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {enrollments.length === 0 ? (
                    <div
                      className="p-8 text-center"
                      data-ocid="fe_portal.recent.empty_state"
                    >
                      <p className="text-sm text-foreground/50">
                        No enrollments yet. Start by adding one!
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 text-white"
                        style={{ background: "oklch(0.45 0.18 262)" }}
                        onClick={() => setActiveTab("new-enrollment")}
                        data-ocid="fe_portal.go_enroll.button"
                      >
                        Add First Enrollment
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enrollments
                            .slice(-5)
                            .reverse()
                            .map((e, idx) => (
                              <TableRow
                                key={e.id}
                                data-ocid={`fe_portal.recent.item.${idx + 1}`}
                              >
                                <TableCell className="font-medium text-sm">
                                  {e.studentName}
                                </TableCell>
                                <TableCell className="text-sm text-foreground/70">
                                  {e.classLevel}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {e.courseType}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-foreground/60">
                                  {new Date(e.createdAt).toLocaleDateString(
                                    "en-IN",
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── New Enrollment ── */}
          {activeTab === "new-enrollment" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="rounded-2xl border-0 shadow-sm max-w-lg">
                <CardHeader>
                  <CardTitle className="text-base">
                    Enroll New Student
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEnrollSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="studentName">Student Name *</Label>
                      <Input
                        id="studentName"
                        placeholder="Enter student's full name"
                        value={enrollForm.studentName}
                        onChange={(e) =>
                          setEnrollForm((p) => ({
                            ...p,
                            studentName: e.target.value,
                          }))
                        }
                        className="rounded-xl"
                        data-ocid="fe_portal.student_name.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="studentPhone">Phone Number *</Label>
                      <Input
                        id="studentPhone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={enrollForm.studentPhone}
                        onChange={(e) =>
                          setEnrollForm((p) => ({
                            ...p,
                            studentPhone: e.target.value,
                          }))
                        }
                        className="rounded-xl"
                        data-ocid="fe_portal.student_phone.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Class *</Label>
                      <Select
                        value={enrollForm.classLevel}
                        onValueChange={(v) =>
                          setEnrollForm((p) => ({ ...p, classLevel: v }))
                        }
                      >
                        <SelectTrigger
                          className="rounded-xl"
                          data-ocid="fe_portal.class.select"
                        >
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {CLASS_LEVELS.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Course Type *</Label>
                      <Select
                        value={enrollForm.courseType}
                        onValueChange={(v) =>
                          setEnrollForm((p) => ({ ...p, courseType: v }))
                        }
                      >
                        <SelectTrigger
                          className="rounded-xl"
                          data-ocid="fe_portal.course.select"
                        >
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tuition">Tuition</SelectItem>
                          <SelectItem value="Olympiad">Olympiad</SelectItem>
                          <SelectItem value="MCQ">MCQ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full text-white font-semibold gap-2"
                      style={{ background: "oklch(0.45 0.18 262)" }}
                      disabled={isSubmitting}
                      data-ocid="fe_portal.enroll.submit_button"
                    >
                      <PlusCircle className="w-4 h-4" />
                      {isSubmitting ? "Submitting..." : "Enroll Student"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── My Enrollments ── */}
          {activeTab === "my-enrollments" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                  <Input
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 rounded-xl"
                    data-ocid="fe_portal.search.input"
                  />
                </div>
                <Badge variant="outline" className="text-xs">
                  {filteredEnrollments.length} records
                </Badge>
              </div>

              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-0">
                  {filteredEnrollments.length === 0 ? (
                    <div
                      className="p-10 text-center"
                      data-ocid="fe_portal.enrollments.empty_state"
                    >
                      <p className="text-sm text-foreground/50">
                        {searchQuery
                          ? "No results found."
                          : "No enrollments yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEnrollments.map((e, idx) => (
                            <TableRow
                              key={e.id}
                              data-ocid={`fe_portal.enrollment.item.${idx + 1}`}
                            >
                              <TableCell className="text-xs text-foreground/50">
                                {idx + 1}
                              </TableCell>
                              <TableCell className="font-medium text-sm">
                                {e.studentName}
                              </TableCell>
                              <TableCell className="text-sm">
                                {e.studentPhone}
                              </TableCell>
                              <TableCell className="text-sm text-foreground/70">
                                {e.classLevel}
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-xs">
                                  {e.courseType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-foreground/60">
                                {new Date(e.createdAt).toLocaleDateString(
                                  "en-IN",
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function FELoginPage({
  username,
  setUsername,
  password,
  setPassword,
  loginError,
  isLoggingIn,
  onSubmit,
}: {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loginError: string;
  isLoggingIn: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.22 0.07 262) 0%, oklch(0.30 0.10 262) 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "oklch(0.55 0.18 262)" }}
          >
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">FE Portal</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.75 0.06 262)" }}>
            OpenFrame Education · Field Executive Login
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl p-6 shadow-xl space-y-4"
          data-ocid="fe_portal.login.panel"
        >
          <div className="space-y-1.5">
            <Label htmlFor="feUsername">Username</Label>
            <Input
              id="feUsername"
              placeholder="e.g. fe001"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="rounded-xl"
              data-ocid="fe_portal.username.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fePassword">Password</Label>
            <Input
              id="fePassword"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="rounded-xl"
              data-ocid="fe_portal.password.input"
            />
          </div>
          {loginError && (
            <p
              className="text-xs text-destructive"
              data-ocid="fe_portal.login.error_state"
            >
              {loginError}
            </p>
          )}
          <Button
            type="submit"
            className="w-full text-white font-semibold"
            style={{ background: "oklch(0.45 0.18 262)" }}
            disabled={isLoggingIn}
            data-ocid="fe_portal.login.submit_button"
          >
            {isLoggingIn ? "Signing in..." : "Sign In"}
          </Button>
          <p className="text-xs text-center text-foreground/50">
            Demo: <span className="font-mono">fe001</span> /{" "}
            <span className="font-mono">Field@123</span>
          </p>
        </form>

        <p
          className="text-center mt-4 text-xs"
          style={{ color: "oklch(0.65 0.05 262)" }}
        >
          <Link to="/" className="underline hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
