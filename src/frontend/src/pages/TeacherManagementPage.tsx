import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Save,
  School,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  type AttendanceStatus,
  type TeacherAccount,
  addAttendanceRecord,
  addClassTrackingRecord,
  addHomeworkRecord,
  getAttendance,
  getClassById,
  getClassTracking,
  getClasses,
  getHomework,
  getNotifications,
  getStudents,
  getStudentsByClass,
  getTeacherByEmail,
  getTeacherById,
  markNotificationRead,
  updateTeacher,
} from "../utils/teacherStore";

interface TeacherSession {
  teacherId: string;
  name: string;
  email: string;
}

function getSession(): TeacherSession | null {
  try {
    const raw = sessionStorage.getItem("teacherSession");
    return raw ? (JSON.parse(raw) as TeacherSession) : null;
  } catch {
    return null;
  }
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({
  onLogin,
}: { onLogin: (session: TeacherSession) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const teacher = getTeacherByEmail(email);
      if (!teacher) {
        setError("No teacher account found with this email.");
        setLoading(false);
        return;
      }
      if (teacher.password !== password) {
        setError("Incorrect password. Please try again.");
        setLoading(false);
        return;
      }
      const session: TeacherSession = {
        teacherId: teacher.id,
        name: teacher.name,
        email: teacher.email,
      };
      sessionStorage.setItem("teacherSession", JSON.stringify(session));
      onLogin(session);
      setLoading(false);
    }, 300);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "oklch(0.97 0.01 255)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-border p-8 w-full max-w-md mx-4"
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "oklch(0.45 0.18 262)" }}
          >
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Teacher Login</h1>
          <p className="text-muted-foreground text-sm mt-1">
            OpenFrame Education Teacher Portal
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="t-email">Email Address</Label>
            <Input
              id="t-email"
              type="email"
              placeholder="teacher@openframe.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-ocid="teacher.login.input"
              className="mt-1"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          <div>
            <Label htmlFor="t-pass">Password</Label>
            <Input
              id="t-pass"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-ocid="teacher.login.input"
              className="mt-1"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && (
            <div
              className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3"
              data-ocid="teacher.login.error_state"
            >
              {error}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
            data-ocid="teacher.login.primary_button"
            style={{ background: "oklch(0.45 0.18 262)" }}
          >
            {loading ? "Logging in..." : "Login as Teacher"}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Teacher Dashboard ─────────────────────────────────────────────────────────

function TeacherDashboardApp({
  session,
  onLogout,
}: { session: TeacherSession; onLogout: () => void }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const teacher = getTeacherById(session.teacherId);

  const doRefresh = () => setRefresh((r) => r + 1);

  const allClasses = getClasses();
  const myClasses = allClasses.filter((c) => c.teacherId === session.teacherId);
  const myStudents = myClasses.flatMap((c) => getStudentsByClass(c.id));

  const allNotifications = getNotifications().filter(
    (n) => n.sentTo === "all" || n.sentTo === session.teacherId,
  );
  const unreadCount = allNotifications.filter((n) => !n.read).length;

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "my-classes",
      label: "My Classes",
      icon: <School className="w-4 h-4" />,
    },
    { id: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
    {
      id: "attendance",
      label: "Attendance",
      icon: <ClipboardCheck className="w-4 h-4" />,
    },
    {
      id: "homework",
      label: "Homework",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: "class-tracking",
      label: "Class Tracking",
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: (
        <span className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
      ),
    },
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
  ];

  const roleColor = "oklch(0.45 0.18 262)";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/90 leading-none">
              OpenFrame
            </p>
            <p className="text-xs text-white/50 leading-none mt-0.5">
              EDUCATION
            </p>
          </div>
        </a>
      </div>
      <div className="px-4 py-3 border-b border-white/10">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: "oklch(0.45 0.18 262 / 0.3)", color: "white" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
          Teacher
        </div>
        <p className="text-xs text-white/60 mt-1 truncate">{session.name}</p>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                data-ocid={`teacher.nav.${item.id}.link`}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background:
                    activeSection === item.id
                      ? "oklch(0.45 0.18 262 / 0.25)"
                      : "transparent",
                  color:
                    activeSection === item.id
                      ? "white"
                      : "rgba(255,255,255,0.6)",
                  borderLeft:
                    activeSection === item.id
                      ? `3px solid ${roleColor}`
                      : "3px solid transparent",
                }}
              >
                <span className="w-4 h-4 shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {activeSection === item.id && (
                  <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-3 border-t border-white/10">
        <button
          type="button"
          data-ocid="teacher.logout.button"
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "oklch(0.97 0.01 255)" }}
    >
      <aside
        className="hidden lg:flex w-60 flex-col fixed left-0 top-0 bottom-0 z-40"
        style={{ background: "oklch(0.18 0.04 265)" }}
      >
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-60 z-50 lg:hidden flex flex-col"
              style={{ background: "oklch(0.18 0.04 265)" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header
          className="sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6 h-14 border-b bg-white"
          style={{ borderColor: "oklch(0.93 0.02 255)" }}
        >
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg hover:bg-secondary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-foreground">
              Teacher Dashboard
            </h1>
          </div>
          <button
            type="button"
            data-ocid="teacher.header.logout.button"
            onClick={onLogout}
            className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </header>

        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DashboardContent
                section={activeSection}
                session={session}
                teacher={teacher}
                myClasses={myClasses}
                myStudents={myStudents}
                allNotifications={allNotifications}
                refresh={refresh}
                doRefresh={doRefresh}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ─── Dashboard Content Sections ───────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: color }}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {desc && <p className="text-muted-foreground text-sm mt-1">{desc}</p>}
    </div>
  );
}

function DashboardContent({
  section,
  session,
  teacher,
  myClasses,
  myStudents,
  allNotifications,
  refresh,
  doRefresh,
}: {
  section: string;
  session: TeacherSession;
  teacher: TeacherAccount | undefined;
  myClasses: ReturnType<typeof getClasses>;
  myStudents: ReturnType<typeof getStudents>;
  allNotifications: ReturnType<typeof getNotifications>;
  refresh: number;
  doRefresh: () => void;
}) {
  if (section === "dashboard") {
    const today = new Date().toISOString().slice(0, 10);
    const allAtt = getAttendance();
    const todayAtt = allAtt.filter(
      (a) => a.date === today && myClasses.some((c) => c.id === a.classId),
    );
    const presentToday = todayAtt.filter((a) => a.status === "Present").length;
    const attPct =
      todayAtt.length > 0
        ? Math.round((presentToday / todayAtt.length) * 100)
        : 0;
    const hw = getHomework().filter((h) =>
      myClasses.some((c) => c.id === h.classId),
    );

    return (
      <div>
        <SectionTitle
          title={`Welcome, ${session.name}`}
          desc="Your teaching overview for today"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="My Classes"
            value={myClasses.length}
            icon={<School className="w-4 h-4 text-white" />}
            color="oklch(0.5 0.18 262)"
          />
          <StatCard
            label="Total Students"
            value={myStudents.length}
            icon={<Users className="w-4 h-4 text-white" />}
            color="oklch(0.6 0.18 150)"
          />
          <StatCard
            label="Attendance Today"
            value={`${attPct}%`}
            icon={<ClipboardCheck className="w-4 h-4 text-white" />}
            color="oklch(0.65 0.18 60)"
          />
          <StatCard
            label="Homework Assigned"
            value={hw.length}
            icon={<BookOpen className="w-4 h-4 text-white" />}
            color="oklch(0.6 0.18 320)"
          />
        </div>
      </div>
    );
  }

  if (section === "my-classes") {
    return (
      <div>
        <SectionTitle title="My Classes" desc="Classes assigned to you" />
        {myClasses.length === 0 ? (
          <div
            className="bg-white rounded-2xl border border-border p-12 text-center"
            data-ocid="teacher.classes.empty_state"
          >
            <School className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No classes assigned yet. Contact your admin.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myClasses.map((cls, i) => {
              const studentCount = getStudentsByClass(cls.id).length;
              return (
                <div
                  key={cls.id}
                  className="bg-white rounded-2xl border border-border p-5 shadow-sm"
                  data-ocid={`teacher.classes.card.${i + 1}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">
                      Class {cls.className} - {cls.section}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      Section {cls.section}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {studentCount} Students
                  </p>
                  {teacher && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Subject: {teacher.subject}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (section === "students") {
    return <StudentsSection myClasses={myClasses} refresh={refresh} />;
  }

  if (section === "attendance") {
    return (
      <AttendanceSection
        session={session}
        myClasses={myClasses}
        doRefresh={doRefresh}
      />
    );
  }

  if (section === "homework") {
    return (
      <HomeworkSection
        session={session}
        myClasses={myClasses}
        doRefresh={doRefresh}
        refresh={refresh}
      />
    );
  }

  if (section === "class-tracking") {
    return (
      <ClassTrackingSection
        session={session}
        myClasses={myClasses}
        doRefresh={doRefresh}
        refresh={refresh}
      />
    );
  }

  if (section === "reports") {
    return (
      <ReportsSection
        session={session}
        myClasses={myClasses}
        refresh={refresh}
      />
    );
  }

  if (section === "notifications") {
    return (
      <NotificationsSection
        allNotifications={allNotifications}
        doRefresh={doRefresh}
      />
    );
  }

  if (section === "profile") {
    return (
      <ProfileSection
        session={session}
        teacher={teacher}
        doRefresh={doRefresh}
      />
    );
  }

  return null;
}

// ─── Students Section ────────────────────────────────────────────────────────────

function StudentsSection({
  myClasses,
  refresh: _,
}: { myClasses: ReturnType<typeof getClasses>; refresh: number }) {
  const [selectedClass, setSelectedClass] = useState(myClasses[0]?.id || "");
  const students = selectedClass ? getStudentsByClass(selectedClass) : [];

  return (
    <div>
      <SectionTitle title="Students" desc="View students in your classes" />
      <div className="mb-4">
        <Label>Select Class</Label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          data-ocid="teacher.students.select"
          className="mt-1 block w-full max-w-xs border border-border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="">-- Select Class --</option>
          {myClasses.map((c) => (
            <option key={c.id} value={c.id}>
              Class {c.className} - {c.section}
            </option>
          ))}
        </select>
      </div>
      {selectedClass && students.length === 0 ? (
        <div
          className="bg-white rounded-2xl border border-border p-10 text-center"
          data-ocid="teacher.students.empty_state"
        >
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">
            No students in this class yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm" data-ocid="teacher.students.table">
            <thead style={{ background: "oklch(0.96 0.01 255)" }}>
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Roll No
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Parent Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Parent Phone
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr
                  key={s.id}
                  className="border-t border-border"
                  data-ocid={`teacher.students.row.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {s.rollNumber}
                  </td>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.parentName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.parentPhone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Attendance Section ──────────────────────────────────────────────────────────

function AttendanceSection({
  session,
  myClasses,
  doRefresh,
}: {
  session: TeacherSession;
  myClasses: ReturnType<typeof getClasses>;
  doRefresh: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedClass, setSelectedClass] = useState(myClasses[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState(today);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    {},
  );
  const [docFile, setDocFile] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const students = selectedClass ? getStudentsByClass(selectedClass) : [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: students is derived from selectedClass
  useEffect(() => {
    const init: Record<string, AttendanceStatus> = {};
    for (const s of students) {
      init[s.id] = "Present";
    }
    setStatuses(init);
  }, [students.length, selectedClass]);

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDocFile(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!selectedClass || students.length === 0) {
      toast.error("Select a class with students");
      return;
    }
    const records = students.map((s) => ({
      studentId: s.id,
      classId: selectedClass,
      teacherId: session.teacherId,
      date: selectedDate,
      status: statuses[s.id] || "Present",
      documentUrl: docFile,
    }));
    for (const r of records) {
      addAttendanceRecord(r);
    }
    toast.success("Attendance saved successfully!");
    doRefresh();
  };

  const existingAttendance = getAttendance().filter(
    (a) => a.classId === selectedClass && a.date === selectedDate,
  );

  return (
    <div>
      <SectionTitle
        title="Attendance"
        desc="Mark and track student attendance"
      />
      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <Label>Select Class</Label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              data-ocid="teacher.attendance.select"
              className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">-- Select Class --</option>
              {myClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  Class {c.className} - {c.section}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              data-ocid="teacher.attendance.input"
              className="mt-1"
            />
          </div>
        </div>

        {existingAttendance.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            Attendance already submitted for this class and date (
            {existingAttendance.length} records).
          </div>
        )}

        {students.length > 0 && (
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm"
              data-ocid="teacher.attendance.table"
            >
              <thead style={{ background: "oklch(0.96 0.01 255)" }}>
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Roll
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Student Name
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-t border-border"
                    data-ocid={`teacher.attendance.row.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      {s.rollNumber}
                    </td>
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        {(
                          ["Present", "Absent", "Late"] as AttendanceStatus[]
                        ).map((st) => (
                          <label
                            key={st}
                            className="flex items-center gap-1.5 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`att-${s.id}`}
                              value={st}
                              checked={statuses[s.id] === st}
                              onChange={() =>
                                setStatuses((prev) => ({ ...prev, [s.id]: st }))
                              }
                              className="w-3.5 h-3.5"
                              data-ocid={`teacher.attendance.radio.${i + 1}`}
                            />
                            <span
                              className={`text-xs font-medium ${
                                st === "Present"
                                  ? "text-green-600"
                                  : st === "Absent"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                              }`}
                            >
                              {st}
                            </span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleDocUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
              data-ocid="teacher.attendance.upload_button"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload Attendance Document
            </Button>
            {docFile && (
              <span className="text-xs text-green-600 ml-2">
                Document uploaded ✓
              </span>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            data-ocid="teacher.attendance.submit_button"
            style={{ background: "oklch(0.45 0.18 262)" }}
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Submit Attendance
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Homework Section ─────────────────────────────────────────────────────────────

function HomeworkSection({
  session,
  myClasses,
  doRefresh,
  refresh: _,
}: {
  session: TeacherSession;
  myClasses: ReturnType<typeof getClasses>;
  doRefresh: () => void;
  refresh: number;
}) {
  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const myHomework = getHomework().filter(
    (h) => h.teacherId === session.teacherId,
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFileUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!classId || !title || !dueDate) {
      toast.error("Fill all required fields");
      return;
    }
    addHomeworkRecord({
      teacherId: session.teacherId,
      classId,
      title,
      description: desc,
      fileUrl,
      dueDate,
    });
    toast.success("Homework assigned!");
    setClassId("");
    setTitle("");
    setDesc("");
    setDueDate("");
    setFileUrl("");
    doRefresh();
  };

  return (
    <div>
      <SectionTitle title="Homework" desc="Assign homework to your classes" />
      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <h3 className="font-semibold mb-4">Assign New Homework</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <Label>Class *</Label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              data-ocid="teacher.homework.select"
              className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">-- Select Class --</option>
              {myClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  Class {c.className} - {c.section}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Due Date *</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              data-ocid="teacher.homework.input"
              className="mt-1"
            />
          </div>
        </div>
        <div className="mb-4">
          <Label>Title *</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Exercise 4.2"
            data-ocid="teacher.homework.input"
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <Label>Description</Label>
          <Textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Homework details..."
            data-ocid="teacher.homework.textarea"
            className="mt-1"
            rows={3}
          />
        </div>
        <div className="mb-4 flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            onChange={handleFile}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            data-ocid="teacher.homework.upload_button"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Attach File
          </Button>
          {fileUrl && (
            <span className="text-xs text-green-600">File attached ✓</span>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          data-ocid="teacher.homework.submit_button"
          style={{ background: "oklch(0.45 0.18 262)" }}
        >
          Assign Homework
        </Button>
      </div>

      <h3 className="font-semibold mb-3">Previously Assigned</h3>
      {myHomework.length === 0 ? (
        <div
          className="bg-white rounded-2xl border border-border p-10 text-center"
          data-ocid="teacher.homework.empty_state"
        >
          <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">
            No homework assigned yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {myHomework.map((hw, i) => {
            const cls = getClassById(hw.classId);
            return (
              <div
                key={hw.id}
                className="bg-white rounded-xl border border-border p-4 flex items-start justify-between"
                data-ocid={`teacher.homework.item.${i + 1}`}
              >
                <div>
                  <p className="font-semibold">{hw.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Class {cls?.className} {cls?.section} · Due {hw.dueDate}
                  </p>
                  {hw.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {hw.description}
                    </p>
                  )}
                </div>
                {hw.fileUrl && (
                  <a
                    href={hw.fileUrl}
                    download
                    className="text-xs text-blue-600 underline ml-4"
                  >
                    Download
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Class Tracking Section ─────────────────────────────────────────────────────────

function ClassTrackingSection({
  session,
  myClasses,
  doRefresh,
  refresh: _,
}: {
  session: TeacherSession;
  myClasses: ReturnType<typeof getClasses>;
  doRefresh: () => void;
  refresh: number;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    classId: "",
    subject: "",
    date: today,
    startTime: "",
    endTime: "",
    topicCovered: "",
    homeworkGiven: "",
  });

  const myTracking = getClassTracking()
    .filter((t) => t.teacherId === session.teacherId)
    .slice()
    .reverse();

  const handleSubmit = () => {
    if (!form.classId || !form.subject || !form.topicCovered) {
      toast.error("Fill all required fields");
      return;
    }
    addClassTrackingRecord({ ...form, teacherId: session.teacherId });
    toast.success("Class tracking recorded!");
    setForm({
      classId: "",
      subject: "",
      date: today,
      startTime: "",
      endTime: "",
      topicCovered: "",
      homeworkGiven: "",
    });
    doRefresh();
  };

  return (
    <div>
      <SectionTitle
        title="Class Tracking"
        desc="Log your daily class activity"
      />
      <div className="bg-white rounded-2xl border border-border p-6 mb-6">
        <h3 className="font-semibold mb-4">Log Class</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Class *</Label>
            <select
              value={form.classId}
              onChange={(e) =>
                setForm((f) => ({ ...f, classId: e.target.value }))
              }
              data-ocid="teacher.tracking.select"
              className="mt-1 w-full border border-border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">-- Select Class --</option>
              {myClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  Class {c.className} - {c.section}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Subject *</Label>
            <Input
              value={form.subject}
              onChange={(e) =>
                setForm((f) => ({ ...f, subject: e.target.value }))
              }
              placeholder="e.g. Mathematics"
              data-ocid="teacher.tracking.input"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              data-ocid="teacher.tracking.input"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startTime: e.target.value }))
                }
                data-ocid="teacher.tracking.input"
                className="mt-1"
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endTime: e.target.value }))
                }
                data-ocid="teacher.tracking.input"
                className="mt-1"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label>Topic Covered *</Label>
            <Input
              value={form.topicCovered}
              onChange={(e) =>
                setForm((f) => ({ ...f, topicCovered: e.target.value }))
              }
              placeholder="e.g. Algebra - Chapter 4"
              data-ocid="teacher.tracking.input"
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Homework Given</Label>
            <Input
              value={form.homeworkGiven}
              onChange={(e) =>
                setForm((f) => ({ ...f, homeworkGiven: e.target.value }))
              }
              placeholder="e.g. Exercise 4.2"
              data-ocid="teacher.tracking.input"
              className="mt-1"
            />
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          data-ocid="teacher.tracking.submit_button"
          className="mt-4"
          style={{ background: "oklch(0.45 0.18 262)" }}
        >
          Submit
        </Button>
      </div>

      <h3 className="font-semibold mb-3">Recent Entries</h3>
      {myTracking.length === 0 ? (
        <div
          className="bg-white rounded-2xl border border-border p-10 text-center"
          data-ocid="teacher.tracking.empty_state"
        >
          <CalendarDays className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No class logs yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myTracking.slice(0, 10).map((t, i) => {
            const cls = getClassById(t.classId);
            return (
              <div
                key={t.id}
                className="bg-white rounded-xl border border-border p-4"
                data-ocid={`teacher.tracking.item.${i + 1}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">
                      {t.subject} — Class {cls?.className} {cls?.section}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.date} · {t.startTime}–{t.endTime}
                    </p>
                  </div>
                </div>
                <p className="text-sm mt-1">
                  <span className="font-medium">Topic:</span> {t.topicCovered}
                </p>
                {t.homeworkGiven && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    <span className="font-medium">HW:</span> {t.homeworkGiven}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Reports Section ──────────────────────────────────────────────────────────────

function ReportsSection({
  session,
  myClasses,
  refresh: _,
}: {
  session: TeacherSession;
  myClasses: ReturnType<typeof getClasses>;
  refresh: number;
}) {
  const myClassIds = new Set(myClasses.map((c) => c.id));
  const attendance = getAttendance().filter((a) => myClassIds.has(a.classId));
  const tracking = getClassTracking().filter(
    (t) => t.teacherId === session.teacherId,
  );
  const homework = getHomework().filter(
    (h) => h.teacherId === session.teacherId,
  );

  const statusColor: Record<string, string> = {
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    Late: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div>
      <SectionTitle title="Reports" desc="Overview of your class activity" />
      <Tabs defaultValue="attendance" data-ocid="teacher.reports.tab">
        <TabsList className="mb-4">
          <TabsTrigger
            value="attendance"
            data-ocid="teacher.reports.attendance.tab"
          >
            Attendance
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            data-ocid="teacher.reports.activity.tab"
          >
            Class Activity
          </TabsTrigger>
          <TabsTrigger
            value="homework"
            data-ocid="teacher.reports.homework.tab"
          >
            Homework
          </TabsTrigger>
        </TabsList>
        <TabsContent value="attendance">
          {attendance.length === 0 ? (
            <div
              className="bg-white rounded-2xl border border-border p-10 text-center"
              data-ocid="teacher.reports.attendance.empty_state"
            >
              <p className="text-muted-foreground text-sm">
                No attendance records yet.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead style={{ background: "oklch(0.96 0.01 255)" }}>
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                      Student
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                      Class
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.slice(0, 30).map((a, i) => {
                    const cls = getClassById(a.classId);
                    const stu = getStudents().find((s) => s.id === a.studentId);
                    return (
                      <tr
                        key={a.id}
                        className="border-t border-border"
                        data-ocid={`teacher.reports.row.item.${i + 1}`}
                      >
                        <td className="px-4 py-2.5">{stu?.name || "—"}</td>
                        <td className="px-4 py-2.5">
                          {cls ? `${cls.className}-${cls.section}` : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs">
                          {a.date}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[a.status]}`}
                          >
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        <TabsContent value="activity">
          {tracking.length === 0 ? (
            <div
              className="bg-white rounded-2xl border border-border p-10 text-center"
              data-ocid="teacher.reports.activity.empty_state"
            >
              <p className="text-muted-foreground text-sm">
                No class activity recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tracking.map((t, i) => {
                const cls = getClassById(t.classId);
                return (
                  <div
                    key={t.id}
                    className="bg-white rounded-xl border border-border p-4"
                    data-ocid={`teacher.reports.activity.item.${i + 1}`}
                  >
                    <p className="font-medium">
                      {t.subject} — Class {cls?.className} {cls?.section}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.date} | {t.startTime}–{t.endTime}
                    </p>
                    <p className="text-sm mt-1">{t.topicCovered}</p>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
        <TabsContent value="homework">
          {homework.length === 0 ? (
            <div
              className="bg-white rounded-2xl border border-border p-10 text-center"
              data-ocid="teacher.reports.homework.empty_state"
            >
              <p className="text-muted-foreground text-sm">
                No homework assigned yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {homework.map((hw, i) => {
                const cls = getClassById(hw.classId);
                return (
                  <div
                    key={hw.id}
                    className="bg-white rounded-xl border border-border p-4"
                    data-ocid={`teacher.reports.homework.item.${i + 1}`}
                  >
                    <p className="font-medium">{hw.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Class {cls?.className} {cls?.section} · Due {hw.dueDate}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Notifications Section ─────────────────────────────────────────────────────────

function NotificationsSection({
  allNotifications,
  doRefresh,
}: {
  allNotifications: ReturnType<typeof getNotifications>;
  doRefresh: () => void;
}) {
  const handleRead = (id: string) => {
    markNotificationRead(id);
    doRefresh();
  };

  return (
    <div>
      <SectionTitle title="Notifications" desc="Messages from your admin" />
      {allNotifications.length === 0 ? (
        <div
          className="bg-white rounded-2xl border border-border p-12 text-center"
          data-ocid="teacher.notifications.empty_state"
        >
          <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allNotifications.map((n, i) => (
            <button
              key={n.id}
              type="button"
              data-ocid={`teacher.notifications.item.${i + 1}`}
              className={`w-full text-left bg-white rounded-xl border p-4 cursor-pointer transition-all ${n.read ? "border-border opacity-70" : "border-blue-300 shadow-sm"}`}
              onClick={() => !n.read && handleRead(n.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{n.title}</p>
                    {!n.read && (
                      <Badge className="text-xs py-0 px-1.5 bg-blue-100 text-blue-700 border-0">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {n.date} · From {n.sentBy}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Profile Section ───────────────────────────────────────────────────────────────

function ProfileSection({
  session,
  teacher,
  doRefresh,
}: {
  session: TeacherSession;
  teacher: TeacherAccount | undefined;
  doRefresh: () => void;
}) {
  const [photo, setPhoto] = useState(teacher?.profilePhoto || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!teacher) return;
    updateTeacher(teacher.id, { profilePhoto: photo });
    toast.success("Profile updated!");
    doRefresh();
  };

  if (!teacher) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Teacher profile not found.
      </div>
    );
  }

  const myClasses = getClasses().filter(
    (c) => c.teacherId === session.teacherId,
  );

  return (
    <div>
      <SectionTitle title="My Profile" />
      <div className="bg-white rounded-2xl border border-border p-6 max-w-xl">
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-10 h-10 text-blue-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg">{teacher.name}</h3>
            <p className="text-sm text-muted-foreground">{teacher.subject}</p>
            <div className="mt-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
                data-ocid="teacher.profile.upload_button"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Upload Photo
              </Button>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-muted-foreground font-medium">Email</p>
            <p className="font-semibold mt-0.5">{teacher.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Phone</p>
            <p className="font-semibold mt-0.5">{teacher.phone || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Qualification</p>
            <p className="font-semibold mt-0.5">
              {teacher.qualification || "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Subject</p>
            <p className="font-semibold mt-0.5">{teacher.subject || "—"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-muted-foreground font-medium">
              Assigned Classes
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {myClasses.length === 0 ? (
                <span className="text-muted-foreground text-xs">
                  None assigned
                </span>
              ) : (
                myClasses.map((c) => (
                  <span
                    key={c.id}
                    className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
                  >
                    {c.className}-{c.section}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
        <Button
          onClick={handleSave}
          data-ocid="teacher.profile.save_button"
          style={{ background: "oklch(0.45 0.18 262)" }}
        >
          <Save className="w-3.5 h-3.5 mr-1.5" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────────

export function TeacherManagementPage() {
  const [session, setSession] = useState<TeacherSession | null>(getSession);

  const handleLogin = (s: TeacherSession) => setSession(s);
  const handleLogout = () => {
    sessionStorage.removeItem("teacherSession");
    setSession(null);
  };

  if (!session) return <LoginScreen onLogin={handleLogin} />;
  return <TeacherDashboardApp session={session} onLogout={handleLogout} />;
}
