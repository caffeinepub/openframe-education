import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Download,
  Edit2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  PenLine,
  Pencil,
  Plus,
  Save,
  School,
  Search,
  Trash2,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  SAMPLE_EXAMS,
  SAMPLE_EXAM_RESULTS,
  SAMPLE_TIMETABLE,
} from "../data/sampleData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeacherProfile {
  name: string;
  email: string;
  phone: string;
  subjects: string;
  qualification: string;
  assignedClasses: string;
  photoUrl: string;
  principal: string;
}

interface Student {
  id: string;
  name: string;
  className: string;
  section: string;
  rollNo: string;
  parentName: string;
  parentPhone: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  status: "Present" | "Absent" | "Late";
  proofUrl?: string;
}

interface HomeworkItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  className: string;
  dueDate: string;
  fileUrl?: string;
  createdAt: string;
}

interface ClassTrackingEntry {
  id: string;
  teacherName: string;
  principal: string;
  className: string;
  section: string;
  subject: string;
  topic: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
  homeworkGiven: boolean;
  completed: boolean;
  createdAt: string;
}

interface SentNotification {
  id: string;
  teacherName: string;
  principal: string;
  to: string;
  title: string;
  message: string;
  createdAt: string;
}

interface ReceivedNotification {
  id: string;
  title: string;
  message: string;
  sentBy: string;
  sentTo: string;
  date: string;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

const CLASSES = [
  "Nursery",
  "LKG",
  "UKG",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
];
const SECTIONS = ["A", "B", "C"];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (principal: string) => void }) {
  const {
    login,
    isLoggingIn,
    isLoginSuccess,
    isLoginError,
    identity,
    isInitializing,
  } = useInternetIdentity();
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoginSuccess && identity) {
      const p = identity.getPrincipal().toString();
      onLogin(p);
    }
    if (isLoginError) {
      setError("Internet Identity login failed. Please try again.");
    }
  }, [isLoginSuccess, isLoginError, identity, onLogin]);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.04 265) 0%, oklch(0.18 0.06 262) 50%, oklch(0.22 0.08 258) 100%)",
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-5"
          style={{ background: "oklch(0.7 0.2 255)" }}
        />
        <div
          className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full opacity-5"
          style={{ background: "oklch(0.6 0.18 200)" }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full"
          style={{ background: "oklch(0.6 0.15 255 / 0.4)" }}
        />
        <div
          className="absolute top-3/4 right-1/3 w-3 h-3 rounded-full"
          style={{ background: "oklch(0.6 0.15 255 / 0.3)" }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, white 0, white 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, white 0, white 1px, transparent 1px, transparent 40px)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Branding pill */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-2"
            style={{
              background: "oklch(1 0 0 / 0.08)",
              color: "oklch(0.85 0.05 255)",
            }}
          >
            <School className="w-4 h-4" />
            OpenFrame Education
          </div>
        </div>

        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "oklch(0.98 0.005 255)" }}
        >
          {/* Top accent */}
          <div
            className="h-1"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.45 0.18 262), oklch(0.55 0.2 240))",
            }}
          />

          <div className="p-8">
            {/* Icon */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.22 0.08 265), oklch(0.35 0.15 262))",
                }}
              >
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "oklch(0.18 0.06 265)" }}
              >
                Teacher Portal
              </h1>
              <p
                className="text-sm text-center mt-1"
                style={{ color: "oklch(0.5 0.04 255)" }}
              >
                OpenFrame Education — Secure Login
              </p>
            </div>

            {/* II info box */}
            <div
              className="rounded-xl p-4 mb-5 border"
              style={{
                background: "oklch(0.96 0.02 262)",
                borderColor: "oklch(0.88 0.06 262)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold"
                  style={{ background: "oklch(0.35 0.15 262)" }}
                >
                  II
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.25 0.1 262)" }}
                  >
                    Internet Identity
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(0.5 0.04 255)" }}
                  >
                    Secure, password-free login. No account needed — any teacher
                    can log in freely.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div
                className="text-sm rounded-xl px-4 py-3 mb-4 border"
                style={{
                  background: "oklch(0.97 0.02 20)",
                  color: "oklch(0.4 0.2 20)",
                  borderColor: "oklch(0.88 0.08 20)",
                }}
                data-ocid="teacher.login.error_state"
              >
                {error}
              </div>
            )}

            <Button
              className="w-full h-12 text-base font-semibold rounded-xl text-white shadow-lg"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              data-ocid="teacher.login.primary_button"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.22 0.08 265), oklch(0.4 0.18 262))",
              }}
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Connecting...
                </span>
              ) : isInitializing ? (
                "Initializing..."
              ) : (
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Login with Internet Identity
                </span>
              )}
            </Button>

            <div
              className="flex justify-around mt-5 pt-4"
              style={{ borderTop: "1px solid oklch(0.92 0.02 255)" }}
            >
              {[
                { icon: "🔒", label: "Secure" },
                { icon: "⚡", label: "Instant" },
                { icon: "🌐", label: "Decentralized" },
              ].map((f) => (
                <div key={f.label} className="text-center">
                  <div className="text-lg">{f.icon}</div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(0.55 0.04 255)" }}
                  >
                    {f.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p
          className="text-center text-xs mt-4"
          style={{ color: "oklch(0.6 0.04 255 / 0.7)" }}
        >
          © {new Date().getFullYear()} OpenFrame Education · DPIIT Recognized
          Startup
        </p>
      </motion.div>
    </div>
  );
}

// ─── Sidebar nav items ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "my-classes", label: "My Classes", icon: School },
  { id: "students", label: "Students", icon: Users },
  { id: "attendance", label: "Attendance", icon: ClipboardList },
  { id: "homework", label: "Homework", icon: BookOpen },
  { id: "class-tracking", label: "Class Tracking", icon: Calendar },
  { id: "reports", label: "Reports", icon: Download },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
  { id: "exams", label: "Exams", icon: PenLine },
  { id: "timetable", label: "Timetable", icon: Calendar },
];

// ─── Main Teacher Dashboard ───────────────────────────────────────────────────

export function TeacherManagementPage() {
  const { clear, isInitializing } = useInternetIdentity();
  const [principal, setPrincipal] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Restore session from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("teacherPrincipal");
    if (saved) setPrincipal(saved);
  }, []);

  const handleLogin = (p: string) => {
    sessionStorage.setItem("teacherPrincipal", p);
    setPrincipal(p);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("teacherPrincipal");
    setPrincipal(null);
    clear();
  };

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.12 0.04 265)" }}
      >
        <div className="text-center text-white">
          <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm opacity-70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!principal) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const profile = lsGet<TeacherProfile | null>(
    `teacherProfile_${principal}`,
    null,
  );
  const displayName = profile?.name || "Teacher";

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "oklch(0.96 0.01 255)" }}
    >
      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:relative z-50 lg:z-auto h-full flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          width: 240,
          background: "oklch(0.12 0.04 265)",
          borderRight: "1px solid oklch(1 0 0 / 0.06)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 px-5 py-5"
          style={{ borderBottom: "1px solid oklch(1 0 0 / 0.07)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(0.45 0.18 262)" }}
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">
              OpenFrame
            </div>
            <div className="text-xs" style={{ color: "oklch(0.6 0.04 255)" }}>
              Teacher Portal
            </div>
          </div>
          <button
            type="button"
            className="ml-auto lg:hidden text-white/50 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                data-ocid={`teacher.nav.${item.id}.link`}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  background: active ? "oklch(0.45 0.18 262)" : "transparent",
                  color: active ? "white" : "oklch(0.65 0.04 255)",
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div
          className="px-3 pb-5 pt-3"
          style={{ borderTop: "1px solid oklch(1 0 0 / 0.07)" }}
        >
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
            style={{ background: "oklch(1 0 0 / 0.06)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
              style={{ background: "oklch(0.45 0.18 262)" }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {displayName}
              </div>
              <div
                className="text-xs truncate"
                style={{ color: "oklch(0.55 0.04 255)" }}
              >
                {principal.slice(0, 12)}...
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            data-ocid="teacher.logout.button"
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors"
            style={{ color: "oklch(0.6 0.04 255)" }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header
          className="flex items-center gap-4 px-5 py-3.5 flex-shrink-0"
          style={{
            background: "white",
            borderBottom: "1px solid oklch(0.92 0.01 255)",
            minHeight: 60,
          }}
        >
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
            data-ocid="teacher.menu.button"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1
              className="text-base font-semibold"
              style={{ color: "oklch(0.18 0.04 265)" }}
            >
              {NAV_ITEMS.find((n) => n.id === activeSection)?.label ||
                "Dashboard"}
            </h1>
            <p className="text-xs" style={{ color: "oklch(0.55 0.03 255)" }}>
              OpenFrame Education · Teacher Dashboard
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                background: "oklch(0.94 0.05 262)",
                color: "oklch(0.35 0.15 262)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Online
            </span>
          </div>
        </header>

        {/* Section content */}
        <main className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SectionRouter
                section={activeSection}
                principal={principal}
                onNavigate={setActiveSection}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─── Section Router ───────────────────────────────────────────────────────────

function SectionRouter({
  section,
  principal,
  onNavigate,
}: { section: string; principal: string; onNavigate: (s: string) => void }) {
  switch (section) {
    case "dashboard":
      return <SectionDashboard principal={principal} onNavigate={onNavigate} />;
    case "my-classes":
      return <SectionMyClasses principal={principal} />;
    case "students":
      return <SectionStudents principal={principal} />;
    case "attendance":
      return <SectionAttendance principal={principal} />;
    case "homework":
      return <SectionHomework principal={principal} />;
    case "class-tracking":
      return <SectionClassTracking principal={principal} />;
    case "reports":
      return <SectionReports principal={principal} />;
    case "notifications":
      return <SectionNotifications principal={principal} />;
    case "profile":
      return <SectionProfile principal={principal} />;
    case "exams":
      return <SectionTeacherExams principal={principal} />;
    case "timetable":
      return <SectionTeacherTimetable />;
    default:
      return null;
  }
}

// ─── Section: Exams (Teacher) ─────────────────────────────────────────────────

function SectionTeacherExams({ principal }: { principal: string }) {
  const myExams = SAMPLE_EXAMS.filter(
    (e) => e.createdBy.includes("Lakshmi") || true,
  ).slice(0, 2);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    className: "",
    subject: "",
    date: "",
    totalMarks: "50",
  });
  const [localExams, setLocalExams] = useState(myExams);

  const results = SAMPLE_EXAM_RESULTS.filter((r) => r.examId === selectedExam);
  const weakStudents = results.filter(
    (r) =>
      r.marksObtained <
      (SAMPLE_EXAMS.find((e) => e.id === selectedExam)?.totalMarks ?? 50) * 0.4,
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: "oklch(0.18 0.04 265)" }}
          >
            Exams
          </h2>
          <p className="text-sm" style={{ color: "oklch(0.55 0.03 255)" }}>
            Create and manage student exams
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "oklch(0.35 0.08 265)" }}
          data-ocid="exams.open_modal_button"
        >
          <PenLine className="w-4 h-4" /> Create Exam
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className="bg-white rounded-2xl p-5 border shadow-sm"
          style={{ borderColor: "oklch(0.93 0.01 255)" }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: "oklch(0.18 0.04 265)" }}
          >
            {localExams.length}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "oklch(0.55 0.03 255)" }}
          >
            My Exams
          </p>
        </div>
        <div
          className="bg-white rounded-2xl p-5 border shadow-sm"
          style={{ borderColor: "oklch(0.93 0.01 255)" }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: "oklch(0.18 0.04 265)" }}
          >
            {SAMPLE_EXAM_RESULTS.length}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "oklch(0.55 0.03 255)" }}
          >
            Students Graded
          </p>
        </div>
      </div>

      {showCreate && (
        <div
          className="bg-white rounded-2xl border p-5 shadow-sm space-y-3"
          style={{ borderColor: "oklch(0.93 0.01 255)" }}
        >
          <h4
            className="font-semibold"
            style={{ color: "oklch(0.18 0.04 265)" }}
          >
            Create Exam
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="exam-title"
                className="text-xs font-medium block mb-1"
              >
                Title
              </label>
              <Input
                id="exam-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Exam title"
                data-ocid="exams.input"
              />
            </div>
            <div>
              <label
                htmlFor="exam-class"
                className="text-xs font-medium block mb-1"
              >
                Class
              </label>
              <Input
                id="exam-class"
                value={form.className}
                onChange={(e) =>
                  setForm((f) => ({ ...f, className: e.target.value }))
                }
                placeholder="8th"
              />
            </div>
            <div>
              <label
                htmlFor="exam-subject"
                className="text-xs font-medium block mb-1"
              >
                Subject
              </label>
              <Input
                id="exam-subject"
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
                placeholder="Mathematics"
              />
            </div>
            <div>
              <label
                htmlFor="exam-date"
                className="text-xs font-medium block mb-1"
              >
                Date
              </label>
              <Input
                id="exam-date"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
            <div>
              <label
                htmlFor="exam-marks"
                className="text-xs font-medium block mb-1"
              >
                Total Marks
              </label>
              <Input
                id="exam-marks"
                value={form.totalMarks}
                onChange={(e) =>
                  setForm((f) => ({ ...f, totalMarks: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "oklch(0.35 0.08 265)" }}
              onClick={() => {
                setLocalExams((l) => [
                  ...l,
                  {
                    ...form,
                    id: `ex${Date.now()}`,
                    section: "A",
                    totalMarks: Number(form.totalMarks),
                    createdBy: principal,
                  },
                ]);
                setShowCreate(false);
                toast.success("Exam created");
              }}
              data-ocid="exams.submit_button"
            >
              Save Exam
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-sm font-semibold border"
              onClick={() => setShowCreate(false)}
              data-ocid="exams.cancel_button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {weakStudents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
          ⚠️ {weakStudents.length} student(s) scoring below 40%:{" "}
          {weakStudents.map((w) => w.studentName).join(", ")}
        </div>
      )}

      <div className="space-y-3">
        {localExams.map((ex) => (
          <div
            key={ex.id}
            className="bg-white rounded-2xl border p-5 shadow-sm"
            style={{ borderColor: "oklch(0.93 0.01 255)" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3
                  className="font-semibold"
                  style={{ color: "oklch(0.18 0.04 265)" }}
                >
                  {ex.title}
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "oklch(0.55 0.03 255)" }}
                >
                  {ex.className} · {ex.subject} · {ex.date} · {ex.totalMarks}{" "}
                  marks
                </p>
              </div>
              <button
                type="button"
                className="text-xs px-3 py-1.5 rounded-lg border font-medium"
                onClick={() =>
                  setSelectedExam(selectedExam === ex.id ? null : ex.id)
                }
                data-ocid="exams.secondary_button"
              >
                {selectedExam === ex.id ? "Hide Results" : "View Results"}
              </button>
            </div>
            {selectedExam === ex.id && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">
                        Roll
                      </th>
                      <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">
                        Student
                      </th>
                      <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">
                        Marks
                      </th>
                      <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground">
                        Grade
                      </th>
                      <th className="text-left py-2 text-xs font-semibold text-muted-foreground">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.id} className="border-b last:border-0">
                        <td className="py-2 pr-4">{r.rollNo}</td>
                        <td className="py-2 pr-4">
                          {r.studentName}{" "}
                          {r.marksObtained < ex.totalMarks * 0.4 && (
                            <span className="ml-1 text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">
                              Weak
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4">
                          {r.marksObtained}/{ex.totalMarks}
                        </td>
                        <td className="py-2 pr-4 font-semibold">{r.grade}</td>
                        <td className="py-2 text-muted-foreground">
                          {r.remarks}
                        </td>
                      </tr>
                    ))}
                    {results.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-4 text-center text-muted-foreground"
                        >
                          No results yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Timetable (Teacher – read-only) ─────────────────────────────────

function SectionTeacherTimetable() {
  const DAYS_TT = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-xl font-bold"
          style={{ color: "oklch(0.18 0.04 265)" }}
        >
          Your Weekly Schedule
        </h2>
        <p className="text-sm" style={{ color: "oklch(0.55 0.03 255)" }}>
          Mon–Sat class schedule assigned by admin
        </p>
      </div>
      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: "oklch(0.93 0.01 255)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: "oklch(0.18 0.04 265)" }}>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white">
                  Day
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white">
                  Subject
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white">
                  Class
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {DAYS_TT.map((day) => {
                const slots = SAMPLE_TIMETABLE.filter((t) => t.day === day);
                if (slots.length === 0)
                  return (
                    <tr key={day} className="border-b">
                      <td className="py-3 px-4 font-medium text-xs">{day}</td>
                      <td
                        colSpan={3}
                        className="py-3 px-4 text-muted-foreground text-xs"
                      >
                        No class scheduled
                      </td>
                    </tr>
                  );
                return slots.map((slot, idx) => (
                  <tr
                    key={slot.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-xs">
                      {idx === 0 ? day : ""}
                    </td>
                    <td className="py-3 px-4 text-xs">{slot.subject}</td>
                    <td className="py-3 px-4 text-xs">
                      {slot.className} – {slot.section}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {slot.startTime}–{slot.endTime}
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card component ──────────────────────────────────────────────────────

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
    <div
      className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border"
      style={{ borderColor: "oklch(0.93 0.01 255)" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color }}
      >
        {icon}
      </div>
      <div>
        <div
          className="text-2xl font-bold"
          style={{ color: "oklch(0.18 0.04 265)" }}
        >
          {value}
        </div>
        <div
          className="text-xs font-medium mt-0.5"
          style={{ color: "oklch(0.55 0.03 255)" }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Dashboard ───────────────────────────────────────────────────────

function SectionDashboard({
  principal,
  onNavigate,
}: { principal: string; onNavigate: (s: string) => void }) {
  const students = lsGet<Student[]>(`teacherStudents_${principal}`, []);
  const homework = lsGet<HomeworkItem[]>(`teacherHomework_${principal}`, []);
  const tracking = lsGet<ClassTrackingEntry[]>(
    "teacherClassTracking",
    [],
  ).filter((e) => e.principal === principal);
  const attendance = lsGet<AttendanceRecord[]>(
    `teacherAttendance_${principal}`,
    [],
  );
  const notifications = lsGet<ReceivedNotification[]>(
    "adminNotificationsForTeachers",
    [],
  );

  const today = todayStr();
  const todayTracking = tracking.filter((t) => t.date === today);
  const pendingHw = homework.filter((h) => h.dueDate >= today);
  const todayAttendance = attendance.filter((a) => a.date === today);
  const presentToday = todayAttendance.filter(
    (a) => a.status === "Present",
  ).length;
  const attendancePct =
    todayAttendance.length > 0
      ? Math.round((presentToday / todayAttendance.length) * 100)
      : 0;

  // Get unique class count from students
  const uniqueClasses = [
    ...new Set(students.map((s) => `${s.className}-${s.section}`)),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: "oklch(0.18 0.04 265)" }}
        >
          Welcome back! 👋
        </h2>
        <p className="text-sm" style={{ color: "oklch(0.55 0.03 255)" }}>
          Here's an overview of your teaching activity.
        </p>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        data-ocid="teacher.dashboard.section"
      >
        <StatCard
          label="Classes Assigned"
          value={uniqueClasses.length}
          color="oklch(0.92 0.06 262)"
          icon={
            <School
              className="w-6 h-6"
              style={{ color: "oklch(0.45 0.18 262)" }}
            />
          }
        />
        <StatCard
          label="Total Students"
          value={students.length}
          color="oklch(0.92 0.06 160)"
          icon={
            <Users
              className="w-6 h-6"
              style={{ color: "oklch(0.4 0.15 160)" }}
            />
          }
        />
        <StatCard
          label="Today's Classes"
          value={todayTracking.length}
          color="oklch(0.92 0.06 50)"
          icon={
            <Calendar
              className="w-6 h-6"
              style={{ color: "oklch(0.55 0.18 50)" }}
            />
          }
        />
        <StatCard
          label="Pending Homework"
          value={pendingHw.length}
          color="oklch(0.92 0.06 300)"
          icon={
            <BookOpen
              className="w-6 h-6"
              style={{ color: "oklch(0.5 0.15 300)" }}
            />
          }
        />
        <StatCard
          label="Attendance % Today"
          value={`${attendancePct}%`}
          color="oklch(0.92 0.06 140)"
          icon={
            <ClipboardList
              className="w-6 h-6"
              style={{ color: "oklch(0.45 0.15 140)" }}
            />
          }
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent notifications */}
        <div
          className="bg-white rounded-2xl shadow-sm border p-5"
          style={{ borderColor: "oklch(0.93 0.01 255)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-semibold text-sm"
              style={{ color: "oklch(0.18 0.04 265)" }}
            >
              Recent Notifications
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("notifications")}
              className="text-xs font-medium"
              style={{ color: "oklch(0.45 0.18 262)" }}
            >
              View all
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm" style={{ color: "oklch(0.6 0.03 255)" }}>
              No notifications yet.
            </p>
          ) : (
            <div className="space-y-3">
              {notifications
                .slice(-3)
                .reverse()
                .map((n) => (
                  <div key={n.id} className="flex gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.93 0.05 262)" }}
                    >
                      <Bell
                        className="w-4 h-4"
                        style={{ color: "oklch(0.45 0.18 262)" }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "oklch(0.25 0.05 265)" }}
                      >
                        {n.title}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: "oklch(0.6 0.03 255)" }}
                      >
                        {n.message}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "oklch(0.7 0.02 255)" }}
                      >
                        {n.date}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Upcoming classes */}
        <div
          className="bg-white rounded-2xl shadow-sm border p-5"
          style={{ borderColor: "oklch(0.93 0.01 255)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-semibold text-sm"
              style={{ color: "oklch(0.18 0.04 265)" }}
            >
              Recent Class Tracking
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("class-tracking")}
              className="text-xs font-medium"
              style={{ color: "oklch(0.45 0.18 262)" }}
            >
              View all
            </button>
          </div>
          {tracking.length === 0 ? (
            <p className="text-sm" style={{ color: "oklch(0.6 0.03 255)" }}>
              No classes tracked yet.
            </p>
          ) : (
            <div className="space-y-3">
              {tracking
                .slice(-3)
                .reverse()
                .map((t) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.93 0.05 262)" }}
                    >
                      <School
                        className="w-4 h-4"
                        style={{ color: "oklch(0.45 0.18 262)" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "oklch(0.25 0.05 265)" }}
                      >
                        {t.className}-{t.section} · {t.subject}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.6 0.03 255)" }}
                      >
                        {t.topic} · {t.date}
                      </p>
                    </div>
                    {t.completed && (
                      <CheckCircle
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: "oklch(0.5 0.15 140)" }}
                      />
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Section: My Classes ──────────────────────────────────────────────────────

function SectionMyClasses({ principal }: { principal: string }) {
  const students = lsGet<Student[]>(`teacherStudents_${principal}`, []);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Build class list from students
  const classMap = new Map<
    string,
    { className: string; section: string; count: number }
  >();
  for (const s of students) {
    const key = `${s.className}-${s.section}`;
    if (!classMap.has(key))
      classMap.set(key, {
        className: s.className,
        section: s.section,
        count: 0,
      });
    const entry = classMap.get(key);
    if (entry) entry.count++;
  }

  const classes = [...classMap.values()];

  // If no students, show all defined classes
  const displayClasses =
    classes.length > 0
      ? classes
      : CLASSES.flatMap((c) =>
          SECTIONS.map((s) => ({ className: c, section: s, count: 0 })),
        ).slice(0, 12);

  const selectedStudents = selectedClass
    ? students.filter((s) => `${s.className}-${s.section}` === selectedClass)
    : [];

  return (
    <div className="space-y-5">
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
        data-ocid="teacher.my_classes.section"
      >
        {displayClasses.map((c) => {
          const key = `${c.className}-${c.section}`;
          const active = selectedClass === key;
          return (
            <button
              type="button"
              key={key}
              onClick={() => setSelectedClass(active ? null : key)}
              data-ocid={`teacher.class.card.${c.className.toLowerCase()}_${c.section.toLowerCase()}`}
              className="bg-white rounded-2xl p-4 text-left shadow-sm border transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{
                borderColor: active
                  ? "oklch(0.45 0.18 262)"
                  : "oklch(0.93 0.01 255)",
                background: active ? "oklch(0.95 0.04 262)" : "white",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white text-sm font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.35 0.15 262), oklch(0.5 0.2 255))",
                }}
              >
                {c.className.slice(0, 2)}
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: "oklch(0.2 0.04 265)" }}
              >
                Class {c.className}
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.55 0.03 255)" }}
              >
                Section {c.section}
              </div>
              <div
                className="text-xs mt-1 font-medium"
                style={{ color: "oklch(0.45 0.18 262)" }}
              >
                {c.count} students
              </div>
            </button>
          );
        })}
      </div>

      {selectedClass && (
        <div
          className="bg-white rounded-2xl shadow-sm border p-5"
          style={{ borderColor: "oklch(0.93 0.01 255)" }}
        >
          <h3
            className="font-semibold mb-4"
            style={{ color: "oklch(0.18 0.04 265)" }}
          >
            Class {selectedClass} — Students
          </h3>
          {selectedStudents.length === 0 ? (
            <p className="text-sm" style={{ color: "oklch(0.6 0.03 255)" }}>
              No students in this class yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid oklch(0.93 0.01 255)" }}
                  >
                    {["Roll No", "Name", "Parent Name", "Parent Phone"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-2 pr-4 font-semibold text-xs"
                          style={{ color: "oklch(0.55 0.03 255)" }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {selectedStudents.map((s) => (
                    <tr
                      key={s.id}
                      style={{
                        borderBottom: "1px solid oklch(0.96 0.005 255)",
                      }}
                    >
                      <td
                        className="py-2.5 pr-4"
                        style={{ color: "oklch(0.55 0.03 255)" }}
                      >
                        {s.rollNo}
                      </td>
                      <td
                        className="py-2.5 pr-4 font-medium"
                        style={{ color: "oklch(0.25 0.05 265)" }}
                      >
                        {s.name}
                      </td>
                      <td
                        className="py-2.5 pr-4"
                        style={{ color: "oklch(0.45 0.03 255)" }}
                      >
                        {s.parentName}
                      </td>
                      <td
                        className="py-2.5"
                        style={{ color: "oklch(0.45 0.03 255)" }}
                      >
                        {s.parentPhone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Section: Students ────────────────────────────────────────────────────────

function SectionStudents({ principal }: { principal: string }) {
  const [students, setStudents] = useState<Student[]>(() =>
    lsGet<Student[]>(`teacherStudents_${principal}`, []),
  );
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    className: CLASSES[0],
    section: "A",
    rollNo: "",
    parentName: "",
    parentPhone: "",
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const save = (updated: Student[]) => {
    setStudents(updated);
    lsSet(`teacherStudents_${principal}`, updated);
  };

  const addStudent = () => {
    if (!form.name) {
      toast.error("Student name required");
      return;
    }
    const s: Student = { id: uid(), ...form };
    save([...students, s]);
    setForm({
      name: "",
      className: CLASSES[0],
      section: "A",
      rollNo: "",
      parentName: "",
      parentPhone: "",
    });
    setShowAdd(false);
    toast.success("Student added!");
  };

  const deleteStudent = (id: string) => {
    save(students.filter((s) => s.id !== id));
    toast.success("Student removed");
  };

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === "all" || s.className === filterClass;
    return matchSearch && matchClass;
  });

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "oklch(0.6 0.03 255)" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            data-ocid="teacher.students.search_input"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none focus:ring-2"
            style={{
              borderColor: "oklch(0.9 0.02 255)",
              background: "white",
            }}
          />
        </div>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          data-ocid="teacher.students.class.select"
          className="px-3 py-2 text-sm rounded-xl border bg-white outline-none"
          style={{ borderColor: "oklch(0.9 0.02 255)" }}
        >
          <option value="all">All Classes</option>
          {CLASSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          onClick={() => setShowAdd(true)}
          data-ocid="teacher.students.add.open_modal_button"
          className="text-white rounded-xl"
          style={{ background: "oklch(0.35 0.15 262)" }}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Student
        </Button>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-2xl shadow-sm border overflow-hidden"
        style={{ borderColor: "oklch(0.93 0.01 255)" }}
        data-ocid="teacher.students.table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: "oklch(0.97 0.01 255)" }}>
              <tr>
                {[
                  "Name",
                  "Class",
                  "Section",
                  "Roll No",
                  "Parent Name",
                  "Parent Phone",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-semibold text-xs"
                    style={{ color: "oklch(0.55 0.03 255)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm"
                    style={{ color: "oklch(0.6 0.03 255)" }}
                    data-ocid="teacher.students.empty_state"
                  >
                    No students found. Add students to get started.
                  </td>
                </tr>
              )}
              {filtered.map((s, idx) => (
                <tr
                  key={s.id}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setSelectedStudent(s)}
                  onKeyUp={(e) => e.key === "Enter" && setSelectedStudent(s)}
                  data-ocid={`teacher.students.row.item.${idx + 1}`}
                  style={{ borderTop: "1px solid oklch(0.96 0.005 255)" }}
                >
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "oklch(0.25 0.05 265)" }}
                  >
                    {s.name}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "oklch(0.45 0.03 255)" }}
                  >
                    {s.className}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "oklch(0.45 0.03 255)" }}
                  >
                    {s.section}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "oklch(0.45 0.03 255)" }}
                  >
                    {s.rollNo}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "oklch(0.45 0.03 255)" }}
                  >
                    {s.parentName}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "oklch(0.45 0.03 255)" }}
                  >
                    {s.parentPhone}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStudent(s.id);
                      }}
                      data-ocid={`teacher.students.delete_button.${idx + 1}`}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2
                        className="w-3.5 h-3.5"
                        style={{ color: "oklch(0.55 0.2 20)" }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <ModalOverlay onClose={() => setShowAdd(false)}>
            <ModalBox
              title="Add Student"
              onClose={() => setShowAdd(false)}
              ocid="teacher.students.modal"
            >
              <div className="space-y-3">
                <FormRow label="Student Name">
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                    data-ocid="teacher.students.name.input"
                    className="form-input"
                  />
                </FormRow>
                <div className="grid grid-cols-2 gap-3">
                  <FormRow label="Class">
                    <select
                      value={form.className}
                      onChange={(e) =>
                        setForm({ ...form, className: e.target.value })
                      }
                      data-ocid="teacher.students.class_select.select"
                      className="form-input"
                    >
                      {CLASSES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </FormRow>
                  <FormRow label="Section">
                    <select
                      value={form.section}
                      onChange={(e) =>
                        setForm({ ...form, section: e.target.value })
                      }
                      data-ocid="teacher.students.section_select.select"
                      className="form-input"
                    >
                      {SECTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </FormRow>
                </div>
                <FormRow label="Roll No">
                  <input
                    value={form.rollNo}
                    onChange={(e) =>
                      setForm({ ...form, rollNo: e.target.value })
                    }
                    placeholder="e.g. 12"
                    data-ocid="teacher.students.rollno.input"
                    className="form-input"
                  />
                </FormRow>
                <FormRow label="Parent Name">
                  <input
                    value={form.parentName}
                    onChange={(e) =>
                      setForm({ ...form, parentName: e.target.value })
                    }
                    placeholder="Parent / Guardian name"
                    data-ocid="teacher.students.parent_name.input"
                    className="form-input"
                  />
                </FormRow>
                <FormRow label="Parent Phone">
                  <input
                    value={form.parentPhone}
                    onChange={(e) =>
                      setForm({ ...form, parentPhone: e.target.value })
                    }
                    placeholder="Mobile number"
                    data-ocid="teacher.students.parent_phone.input"
                    className="form-input"
                  />
                </FormRow>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdd(false)}
                  data-ocid="teacher.students.modal.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={addStudent}
                  data-ocid="teacher.students.modal.submit_button"
                  className="text-white"
                  style={{ background: "oklch(0.35 0.15 262)" }}
                >
                  Add Student
                </Button>
              </div>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Profile modal */}
      <AnimatePresence>
        {selectedStudent && (
          <ModalOverlay onClose={() => setSelectedStudent(null)}>
            <ModalBox
              title="Student Profile"
              onClose={() => setSelectedStudent(null)}
              ocid="teacher.student_profile.modal"
            >
              <div className="space-y-3 text-sm">
                {(
                  [
                    ["Name", selectedStudent.name],
                    ["Class", selectedStudent.className],
                    ["Section", selectedStudent.section],
                    ["Roll No", selectedStudent.rollNo],
                    ["Parent Name", selectedStudent.parentName],
                    ["Parent Phone", selectedStudent.parentPhone],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="flex gap-3">
                    <span
                      className="w-28 font-medium flex-shrink-0"
                      style={{ color: "oklch(0.55 0.03 255)" }}
                    >
                      {label}
                    </span>
                    <span style={{ color: "oklch(0.25 0.05 265)" }}>
                      {value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section: Attendance ──────────────────────────────────────────────────────

function SectionAttendance({ principal }: { principal: string }) {
  const students = lsGet<Student[]>(`teacherStudents_${principal}`, []);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() =>
    lsGet<AttendanceRecord[]>(`teacherAttendance_${principal}`, []),
  );
  const [selClass, setSelClass] = useState(CLASSES[3]);
  const [selSection, setSelSection] = useState("A");
  const [date, setDate] = useState(todayStr());
  const [proofFiles, setProofFiles] = useState<Record<string, string>>({});
  const proofRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const classStudents = students.filter(
    (s) => s.className === selClass && s.section === selSection,
  );

  const getStatus = (studentId: string): "Present" | "Absent" | "Late" => {
    const rec = attendance.find(
      (a) =>
        a.studentId === studentId &&
        a.className === `${selClass}-${selSection}` &&
        a.date === date,
    );
    return rec?.status || "Present";
  };

  const setStatus = (
    studentId: string,
    status: "Present" | "Absent" | "Late",
  ) => {
    const key = `${studentId}-${selClass}-${selSection}-${date}`;
    setAttendance((prev) => {
      const existing = prev.findIndex(
        (a) =>
          a.studentId === studentId &&
          a.className === `${selClass}-${selSection}` &&
          a.date === date,
      );
      const student = classStudents.find((s) => s.id === studentId);
      const newRec: AttendanceRecord = {
        id: key,
        studentId,
        studentName: student?.name || "",
        className: `${selClass}-${selSection}`,
        date,
        status,
        proofUrl: proofFiles[studentId],
      };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newRec;
        return updated;
      }
      return [...prev, newRec];
    });
  };

  const handleProof = (studentId: string, file: File) => {
    const url = URL.createObjectURL(file);
    setProofFiles((prev) => ({ ...prev, [studentId]: url }));
    toast.success("Proof uploaded");
  };

  const submitAttendance = () => {
    lsSet(`teacherAttendance_${principal}`, attendance);
    toast.success("Attendance saved!");
  };

  // Monthly stats
  const monthStr = date.slice(0, 7);
  const getMonthlyPct = (studentId: string) => {
    const monthRecs = attendance.filter(
      (a) => a.studentId === studentId && a.date.startsWith(monthStr),
    );
    if (monthRecs.length === 0) return null;
    const present = monthRecs.filter((a) => a.status === "Present").length;
    return Math.round((present / monthRecs.length) * 100);
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div
        className="bg-white rounded-2xl shadow-sm border p-4 flex flex-wrap gap-3"
        style={{ borderColor: "oklch(0.93 0.01 255)" }}
      >
        <div>
          <label
            htmlFor="att-class"
            className="text-xs font-medium block mb-1"
            style={{ color: "oklch(0.55 0.03 255)" }}
          >
            Class
          </label>
          <select
            id="att-class"
            value={selClass}
            onChange={(e) => setSelClass(e.target.value)}
            data-ocid="teacher.attendance.class.select"
            className="form-input px-3 py-2 text-sm rounded-lg border bg-white"
            style={{ borderColor: "oklch(0.9 0.02 255)" }}
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="att-section"
            className="text-xs font-medium block mb-1"
            style={{ color: "oklch(0.55 0.03 255)" }}
          >
            Section
          </label>
          <select
            id="att-section"
            value={selSection}
            onChange={(e) => setSelSection(e.target.value)}
            data-ocid="teacher.attendance.section.select"
            className="form-input px-3 py-2 text-sm rounded-lg border bg-white"
            style={{ borderColor: "oklch(0.9 0.02 255)" }}
          >
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p
            className="text-xs font-medium block mb-1"
            style={{ color: "oklch(0.55 0.03 255)" }}
          >
            Date
          </p>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            data-ocid="teacher.attendance.date.input"
            className="px-3 py-2 text-sm rounded-lg border outline-none bg-white"
            style={{ borderColor: "oklch(0.9 0.02 255)" }}
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={submitAttendance}
            size="sm"
            data-ocid="teacher.attendance.submit_button"
            className="text-white"
            style={{ background: "oklch(0.35 0.15 262)" }}
          >
            <Save className="w-4 h-4 mr-1" /> Save Attendance
          </Button>
        </div>
      </div>

      {/* Attendance table */}
      <div
        className="bg-white rounded-2xl shadow-sm border overflow-hidden"
        style={{ borderColor: "oklch(0.93 0.01 255)" }}
      >
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid oklch(0.93 0.01 255)" }}
        >
          <h3
            className="text-sm font-semibold"
            style={{ color: "oklch(0.18 0.04 265)" }}
          >
            Class {selClass} — Section {selSection} · {date}
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ color: "oklch(0.6 0.03 255)" }}
          >
            {classStudents.length} students
          </p>
        </div>
        {classStudents.length === 0 ? (
          <div
            className="py-12 text-center"
            data-ocid="teacher.attendance.empty_state"
          >
            <p className="text-sm" style={{ color: "oklch(0.6 0.03 255)" }}>
              No students in this class. Add students in the Students section.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: "oklch(0.97 0.01 255)" }}>
                <tr>
                  {["Roll", "Student Name", "Status", "Monthly %", "Proof"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-semibold text-xs"
                        style={{ color: "oklch(0.55 0.03 255)" }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {classStudents.map((s, idx) => {
                  const status = getStatus(s.id);
                  const monthlyPct = getMonthlyPct(s.id);
                  return (
                    <tr
                      key={s.id}
                      style={{ borderTop: "1px solid oklch(0.96 0.005 255)" }}
                      data-ocid={`teacher.attendance.row.item.${idx + 1}`}
                    >
                      <td
                        className="px-4 py-3"
                        style={{ color: "oklch(0.6 0.03 255)" }}
                      >
                        {s.rollNo || idx + 1}
                      </td>
                      <td
                        className="px-4 py-3 font-medium"
                        style={{ color: "oklch(0.25 0.05 265)" }}
                      >
                        {s.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {(["Present", "Absent", "Late"] as const).map(
                            (st) => (
                              <button
                                type="button"
                                key={st}
                                onClick={() => setStatus(s.id, st)}
                                data-ocid={`teacher.attendance.${st.toLowerCase()}.toggle`}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                                style={{
                                  background:
                                    status === st
                                      ? st === "Present"
                                        ? "oklch(0.92 0.1 140)"
                                        : st === "Absent"
                                          ? "oklch(0.92 0.1 20)"
                                          : "oklch(0.92 0.1 80)"
                                      : "oklch(0.96 0.01 255)",
                                  color:
                                    status === st
                                      ? st === "Present"
                                        ? "oklch(0.3 0.15 140)"
                                        : st === "Absent"
                                          ? "oklch(0.35 0.2 20)"
                                          : "oklch(0.4 0.15 60)"
                                      : "oklch(0.55 0.03 255)",
                                }}
                              >
                                {st}
                              </button>
                            ),
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {monthlyPct !== null ? (
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background:
                                monthlyPct >= 75
                                  ? "oklch(0.92 0.1 140)"
                                  : "oklch(0.92 0.1 20)",
                              color:
                                monthlyPct >= 75
                                  ? "oklch(0.3 0.15 140)"
                                  : "oklch(0.35 0.2 20)",
                            }}
                          >
                            {monthlyPct}%
                          </span>
                        ) : (
                          <span
                            className="text-xs"
                            style={{ color: "oklch(0.7 0.02 255)" }}
                          >
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          ref={(el) => {
                            proofRefs.current[s.id] = el;
                          }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleProof(s.id, f);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => proofRefs.current[s.id]?.click()}
                          data-ocid={`teacher.attendance.upload_button.${idx + 1}`}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors"
                          style={{
                            background: proofFiles[s.id]
                              ? "oklch(0.92 0.08 262)"
                              : "oklch(0.96 0.01 255)",
                            color: proofFiles[s.id]
                              ? "oklch(0.35 0.15 262)"
                              : "oklch(0.55 0.03 255)",
                          }}
                        >
                          <Upload className="w-3 h-3" />
                          {proofFiles[s.id] ? "Uploaded" : "Upload"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section: Homework ────────────────────────────────────────────────────────

function SectionHomework({ principal }: { principal: string }) {
  const [homework, setHomework] = useState<HomeworkItem[]>(() =>
    lsGet<HomeworkItem[]>(`teacherHomework_${principal}`, []),
  );
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    className: CLASSES[3],
    dueDate: todayStr(),
    fileUrl: "",
  });
  const fileRef = useRef<HTMLInputElement | null>(null);

  const save = (updated: HomeworkItem[]) => {
    setHomework(updated);
    lsSet(`teacherHomework_${principal}`, updated);
  };

  const addOrEdit = () => {
    if (!form.title || !form.subject) {
      toast.error("Title and subject required");
      return;
    }
    if (editId) {
      save(homework.map((h) => (h.id === editId ? { ...h, ...form } : h)));
      toast.success("Homework updated!");
    } else {
      save([
        ...homework,
        { id: uid(), ...form, createdAt: new Date().toISOString() },
      ]);
      toast.success("Homework added!");
    }
    setForm({
      title: "",
      description: "",
      subject: "",
      className: CLASSES[3],
      dueDate: todayStr(),
      fileUrl: "",
    });
    setShowAdd(false);
    setEditId(null);
  };

  const deleteHw = (id: string) => {
    save(homework.filter((h) => h.id !== id));
    toast.success("Deleted");
  };

  const startEdit = (hw: HomeworkItem) => {
    setForm({
      title: hw.title,
      description: hw.description,
      subject: hw.subject,
      className: hw.className,
      dueDate: hw.dueDate,
      fileUrl: hw.fileUrl || "",
    });
    setEditId(hw.id);
    setShowAdd(true);
  };

  const today = todayStr();

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setShowAdd(true);
            setEditId(null);
            setForm({
              title: "",
              description: "",
              subject: "",
              className: CLASSES[3],
              dueDate: todayStr(),
              fileUrl: "",
            });
          }}
          data-ocid="teacher.homework.add.open_modal_button"
          className="text-white rounded-xl"
          style={{ background: "oklch(0.35 0.15 262)" }}
        >
          <Plus className="w-4 h-4 mr-1" /> Add Homework
        </Button>
      </div>

      {homework.length === 0 ? (
        <div
          className="bg-white rounded-2xl border p-12 text-center"
          style={{ borderColor: "oklch(0.93 0.01 255)" }}
          data-ocid="teacher.homework.empty_state"
        >
          <BookOpen
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: "oklch(0.75 0.04 255)" }}
          />
          <p className="text-sm" style={{ color: "oklch(0.6 0.03 255)" }}>
            No homework assigned yet.
          </p>
        </div>
      ) : (
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="teacher.homework.list"
        >
          {homework.map((hw, idx) => (
            <div
              key={hw.id}
              className="bg-white rounded-2xl border p-4 shadow-sm"
              style={{ borderColor: "oklch(0.93 0.01 255)" }}
              data-ocid={`teacher.homework.card.item.${idx + 1}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.2 0.04 265)" }}
                  >
                    {hw.title}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(0.55 0.03 255)" }}
                  >
                    {hw.subject} · Class {hw.className}
                  </p>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0"
                  style={{
                    background:
                      hw.dueDate >= today
                        ? "oklch(0.92 0.08 160)"
                        : "oklch(0.92 0.06 20)",
                    color:
                      hw.dueDate >= today
                        ? "oklch(0.3 0.15 140)"
                        : "oklch(0.35 0.2 20)",
                  }}
                >
                  {hw.dueDate >= today ? "Active" : "Overdue"}
                </span>
              </div>
              {hw.description && (
                <p
                  className="text-xs mb-2 line-clamp-2"
                  style={{ color: "oklch(0.55 0.03 255)" }}
                >
                  {hw.description}
                </p>
              )}
              <p
                className="text-xs font-medium mb-3"
                style={{ color: "oklch(0.45 0.03 255)" }}
              >
                Due: {hw.dueDate}
              </p>
              {hw.fileUrl && (
                <a
                  href={hw.fileUrl}
                  download
                  className="text-xs underline mb-2 block"
                  style={{ color: "oklch(0.45 0.18 262)" }}
                >
                  Download attachment
                </a>
              )}
              <div
                className="flex gap-2 pt-2"
                style={{ borderTop: "1px solid oklch(0.96 0.005 255)" }}
              >
                <button
                  type="button"
                  onClick={() => startEdit(hw)}
                  data-ocid={`teacher.homework.edit_button.${idx + 1}`}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors hover:bg-slate-50"
                  style={{ color: "oklch(0.45 0.18 262)" }}
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteHw(hw.id)}
                  data-ocid={`teacher.homework.delete_button.${idx + 1}`}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors hover:bg-red-50"
                  style={{ color: "oklch(0.5 0.2 20)" }}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <ModalOverlay
            onClose={() => {
              setShowAdd(false);
              setEditId(null);
            }}
          >
            <ModalBox
              title={editId ? "Edit Homework" : "Add Homework"}
              onClose={() => {
                setShowAdd(false);
                setEditId(null);
              }}
              ocid="teacher.homework.modal"
            >
              <div className="space-y-3">
                <FormRow label="Title">
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Homework title"
                    data-ocid="teacher.homework.title.input"
                    className="form-input"
                  />
                </FormRow>
                <FormRow label="Subject">
                  <input
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    placeholder="e.g. Mathematics"
                    data-ocid="teacher.homework.subject.input"
                    className="form-input"
                  />
                </FormRow>
                <FormRow label="Class">
                  <select
                    value={form.className}
                    onChange={(e) =>
                      setForm({ ...form, className: e.target.value })
                    }
                    data-ocid="teacher.homework.class.select"
                    className="form-input"
                  >
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </FormRow>
                <FormRow label="Due Date">
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({ ...form, dueDate: e.target.value })
                    }
                    data-ocid="teacher.homework.due_date.input"
                    className="form-input"
                  />
                </FormRow>
                <FormRow label="Description">
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Instructions or notes..."
                    rows={3}
                    data-ocid="teacher.homework.description.textarea"
                    className="form-input"
                  />
                </FormRow>
                <FormRow label="File Attachment">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    ref={fileRef}
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setForm({ ...form, fileUrl: URL.createObjectURL(f) });
                        toast.success("File attached");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    data-ocid="teacher.homework.upload_button"
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border transition-colors"
                    style={{
                      borderColor: "oklch(0.9 0.02 255)",
                      color: form.fileUrl
                        ? "oklch(0.35 0.15 262)"
                        : "oklch(0.55 0.03 255)",
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    {form.fileUrl
                      ? "File attached ✓"
                      : "Attach file (PDF/Image)"}
                  </button>
                </FormRow>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAdd(false);
                    setEditId(null);
                  }}
                  data-ocid="teacher.homework.modal.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={addOrEdit}
                  data-ocid="teacher.homework.modal.submit_button"
                  className="text-white"
                  style={{ background: "oklch(0.35 0.15 262)" }}
                >
                  {editId ? "Save Changes" : "Add Homework"}
                </Button>
              </div>
            </ModalBox>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section: Class Tracking ──────────────────────────────────────────────────

function SectionClassTracking({ principal }: { principal: string }) {
  const profile = lsGet<TeacherProfile | null>(
    `teacherProfile_${principal}`,
    null,
  );
  const [entries, setEntries] = useState<ClassTrackingEntry[]>(() =>
    lsGet<ClassTrackingEntry[]>("teacherClassTracking", []).filter(
      (e) => e.principal === principal,
    ),
  );
  const [form, setForm] = useState({
    className: CLASSES[3],
    section: "A",
    subject: "",
    topic: "",
    date: todayStr(),
    startTime: "09:00",
    endTime: "10:00",
    notes: "",
    homeworkGiven: false,
    completed: false,
  });

  const saveEntry = () => {
    if (!form.subject || !form.topic) {
      toast.error("Subject and topic required");
      return;
    }
    const newEntry: ClassTrackingEntry = {
      id: uid(),
      teacherName: profile?.name || "Teacher",
      principal,
      ...form,
      createdAt: new Date().toISOString(),
    };
    const allTracking = lsGet<ClassTrackingEntry[]>("teacherClassTracking", []);
    const updated = [...allTracking, newEntry];
    lsSet("teacherClassTracking", updated);
    setEntries((prev) => [...prev, newEntry]);
    setForm({
      className: CLASSES[3],
      section: "A",
      subject: "",
      topic: "",
      date: todayStr(),
      startTime: "09:00",
      endTime: "10:00",
      notes: "",
      homeworkGiven: false,
      completed: false,
    });
    toast.success("Class tracked!");
  };

  const toggleComplete = (id: string) => {
    const allTracking = lsGet<ClassTrackingEntry[]>("teacherClassTracking", []);
    const updated = allTracking.map((e) =>
      e.id === id ? { ...e, completed: !e.completed } : e,
    );
    lsSet("teacherClassTracking", updated);
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e)),
    );
  };

  const deleteEntry = (id: string) => {
    const allTracking = lsGet<ClassTrackingEntry[]>("teacherClassTracking", []);
    lsSet(
      "teacherClassTracking",
      allTracking.filter((e) => e.id !== id),
    );
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success("Deleted");
  };

  return (
    <div className="space-y-5">
      {/* Log form */}
      <div
        className="bg-white rounded-2xl shadow-sm border p-5"
        style={{ borderColor: "oklch(0.93 0.01 255)" }}
      >
        <h3
          className="font-semibold mb-4"
          style={{ color: "oklch(0.18 0.04 265)" }}
        >
          Log a Class Session
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormRow label="Class">
            <select
              value={form.className}
              onChange={(e) => setForm({ ...form, className: e.target.value })}
              data-ocid="teacher.tracking.class.select"
              className="form-input"
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Section">
            <select
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value })}
              data-ocid="teacher.tracking.section.select"
              className="form-input"
            >
              {SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Subject">
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Mathematics"
              data-ocid="teacher.tracking.subject.input"
              className="form-input"
            />
          </FormRow>
          <FormRow label="Topic Covered">
            <input
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              placeholder="e.g. Algebra — Chapter 4"
              data-ocid="teacher.tracking.topic.input"
              className="form-input"
            />
          </FormRow>
          <FormRow label="Date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              data-ocid="teacher.tracking.date.input"
              className="form-input"
            />
          </FormRow>
          <div className="grid grid-cols-2 gap-2">
            <FormRow label="Start Time">
              <input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
                data-ocid="teacher.tracking.start_time.input"
                className="form-input"
              />
            </FormRow>
            <FormRow label="End Time">
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                data-ocid="teacher.tracking.end_time.input"
                className="form-input"
              />
            </FormRow>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <FormRow label="Notes">
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
                data-ocid="teacher.tracking.notes.textarea"
                className="form-input"
              />
            </FormRow>
          </div>
          <div className="flex items-center gap-4">
            <label
              className="flex items-center gap-2 text-sm cursor-pointer"
              style={{ color: "oklch(0.4 0.04 265)" }}
            >
              <input
                type="checkbox"
                checked={form.homeworkGiven}
                onChange={(e) =>
                  setForm({ ...form, homeworkGiven: e.target.checked })
                }
                data-ocid="teacher.tracking.homework_given.checkbox"
                className="rounded"
              />
              Homework Given
            </label>
            <label
              className="flex items-center gap-2 text-sm cursor-pointer"
              style={{ color: "oklch(0.4 0.04 265)" }}
            >
              <input
                type="checkbox"
                checked={form.completed}
                onChange={(e) =>
                  setForm({ ...form, completed: e.target.checked })
                }
                data-ocid="teacher.tracking.completed.checkbox"
                className="rounded"
              />
              Mark Complete
            </label>
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={saveEntry}
            data-ocid="teacher.tracking.submit_button"
            className="text-white"
            style={{ background: "oklch(0.35 0.15 262)" }}
          >
            <Save className="w-4 h-4 mr-1.5" /> Save Class Log
          </Button>
        </div>
      </div>

      {/* Log list */}
      <div className="space-y-3">
        {entries.length === 0 && (
          <div
            className="bg-white rounded-2xl border p-10 text-center"
            style={{ borderColor: "oklch(0.93 0.01 255)" }}
            data-ocid="teacher.tracking.empty_state"
          >
            <p className="text-sm" style={{ color: "oklch(0.6 0.03 255)" }}>
              No classes tracked yet.
            </p>
          </div>
        )}
        {[...entries].reverse().map((e, idx) => (
          <div
            key={e.id}
            className="bg-white rounded-2xl border p-4 flex gap-4 items-start"
            style={{ borderColor: "oklch(0.93 0.01 255)" }}
            data-ocid={`teacher.tracking.item.${idx + 1}`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: e.completed
                  ? "oklch(0.92 0.1 140)"
                  : "oklch(0.93 0.04 262)",
              }}
            >
              {e.completed ? (
                <CheckCircle
                  className="w-5 h-5"
                  style={{ color: "oklch(0.4 0.15 140)" }}
                />
              ) : (
                <School
                  className="w-5 h-5"
                  style={{ color: "oklch(0.45 0.18 262)" }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "oklch(0.2 0.04 265)" }}
                >
                  Class {e.className}-{e.section} · {e.subject}
                </p>
                {e.completed && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: "oklch(0.92 0.1 140)",
                      color: "oklch(0.3 0.15 140)",
                    }}
                  >
                    Completed
                  </span>
                )}
                {e.homeworkGiven && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: "oklch(0.93 0.06 262)",
                      color: "oklch(0.35 0.15 262)",
                    }}
                  >
                    HW Given
                  </span>
                )}
              </div>
              <p
                className="text-xs mt-0.5"
                style={{ color: "oklch(0.55 0.03 255)" }}
              >
                {e.topic} · {e.date} · {e.startTime}–{e.endTime}
              </p>
              {e.notes && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.6 0.03 255)" }}
                >
                  {e.notes}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => toggleComplete(e.id)}
                data-ocid={`teacher.tracking.complete.toggle.${idx + 1}`}
                className="text-xs px-2.5 py-1 rounded-lg border transition-colors"
                style={{
                  borderColor: "oklch(0.9 0.02 255)",
                  color: "oklch(0.5 0.03 255)",
                }}
              >
                {e.completed ? "Undo" : "Complete"}
              </button>
              <button
                type="button"
                onClick={() => deleteEntry(e.id)}
                data-ocid={`teacher.tracking.delete_button.${idx + 1}`}
                className="p-1.5 rounded-lg hover:bg-red-50"
              >
                <Trash2
                  className="w-3.5 h-3.5"
                  style={{ color: "oklch(0.55 0.2 20)" }}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Reports ─────────────────────────────────────────────────────────

function SectionReports({ principal }: { principal: string }) {
  const students = lsGet<Student[]>(`teacherStudents_${principal}`, []);
  const attendance = lsGet<AttendanceRecord[]>(
    `teacherAttendance_${principal}`,
    [],
  );
  const tracking = lsGet<ClassTrackingEntry[]>(
    "teacherClassTracking",
    [],
  ).filter((e) => e.principal === principal);
  const [filterClass, setFilterClass] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const downloadCSV = (rows: string[][], filename: string) => {
    const csv = rows
      .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAttendancePct = (studentId: string) => {
    let recs = attendance.filter((a) => a.studentId === studentId);
    if (fromDate) recs = recs.filter((a) => a.date >= fromDate);
    if (toDate) recs = recs.filter((a) => a.date <= toDate);
    if (recs.length === 0) return null;
    return Math.round(
      (recs.filter((a) => a.status === "Present").length / recs.length) * 100,
    );
  };

  const filteredStudents =
    filterClass === "all"
      ? students
      : students.filter((s) => s.className === filterClass);

  const downloadAttendanceCSV = () => {
    const rows = [
      ["Student Name", "Class", "Section", "Roll No", "Attendance %"],
    ];
    for (const s of filteredStudents) {
      const pct = getAttendancePct(s.id);
      rows.push([
        s.name,
        s.className,
        s.section,
        s.rollNo,
        pct !== null ? `${pct}%` : "No data",
      ]);
    }
    downloadCSV(rows, "attendance_report.csv");
    toast.success("CSV downloaded!");
  };

  const downloadTrackingCSV = () => {
    const rows = [
      [
        "Date",
        "Class",
        "Section",
        "Subject",
        "Topic",
        "Start",
        "End",
        "Completed",
        "HW Given",
      ],
    ];
    for (const t of tracking) {
      rows.push([
        t.date,
        t.className,
        t.section,
        t.subject,
        t.topic,
        t.startTime,
        t.endTime,
        t.completed ? "Yes" : "No",
        t.homeworkGiven ? "Yes" : "No",
      ]);
    }
    downloadCSV(rows, "class_performance_report.csv");
    toast.success("CSV downloaded!");
  };

  return (
    <div className="space-y-5">
      <Tabs defaultValue="attendance">
        <TabsList
          className="bg-white border"
          style={{ borderColor: "oklch(0.93 0.01 255)" }}
        >
          <TabsTrigger
            value="attendance"
            data-ocid="teacher.reports.attendance.tab"
          >
            Attendance Report
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            data-ocid="teacher.reports.performance.tab"
          >
            Class Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <div
            className="bg-white rounded-2xl border p-4 flex flex-wrap gap-3 items-end"
            style={{ borderColor: "oklch(0.93 0.01 255)" }}
          >
            <div>
              <p
                className="text-xs font-medium block mb-1"
                style={{ color: "oklch(0.55 0.03 255)" }}
              >
                Class
              </p>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                data-ocid="teacher.reports.attendance.class.select"
                className="px-3 py-2 text-sm rounded-lg border bg-white outline-none"
                style={{ borderColor: "oklch(0.9 0.02 255)" }}
              >
                <option value="all">All Classes</option>
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p
                className="text-xs font-medium block mb-1"
                style={{ color: "oklch(0.55 0.03 255)" }}
              >
                From
              </p>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                data-ocid="teacher.reports.from_date.input"
                className="px-3 py-2 text-sm rounded-lg border bg-white outline-none"
                style={{ borderColor: "oklch(0.9 0.02 255)" }}
              />
            </div>
            <div>
              <p
                className="text-xs font-medium block mb-1"
                style={{ color: "oklch(0.55 0.03 255)" }}
              >
                To
              </p>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                data-ocid="teacher.reports.to_date.input"
                className="px-3 py-2 text-sm rounded-lg border bg-white outline-none"
                style={{ borderColor: "oklch(0.9 0.02 255)" }}
              />
            </div>
            <Button
              onClick={downloadAttendanceCSV}
              size="sm"
              data-ocid="teacher.reports.attendance.download.button"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-1" /> Download CSV
            </Button>
          </div>
          <div
            className="bg-white rounded-2xl border overflow-hidden"
            style={{ borderColor: "oklch(0.93 0.01 255)" }}
            data-ocid="teacher.reports.attendance.table"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ background: "oklch(0.97 0.01 255)" }}>
                  <tr>
                    {[
                      "Name",
                      "Class",
                      "Section",
                      "Roll No",
                      "Attendance %",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-semibold text-xs"
                        style={{ color: "oklch(0.55 0.03 255)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-sm"
                        style={{ color: "oklch(0.6 0.03 255)" }}
                        data-ocid="teacher.reports.attendance.empty_state"
                      >
                        No students to report on.
                      </td>
                    </tr>
                  )}
                  {filteredStudents.map((s, idx) => {
                    const pct = getAttendancePct(s.id);
                    return (
                      <tr
                        key={s.id}
                        style={{ borderTop: "1px solid oklch(0.96 0.005 255)" }}
                        data-ocid={`teacher.reports.attendance.row.item.${idx + 1}`}
                      >
                        <td
                          className="px-4 py-3 font-medium"
                          style={{ color: "oklch(0.25 0.05 265)" }}
                        >
                          {s.name}
                        </td>
                        <td
                          className="px-4 py-3"
                          style={{ color: "oklch(0.45 0.03 255)" }}
                        >
                          {s.className}
                        </td>
                        <td
                          className="px-4 py-3"
                          style={{ color: "oklch(0.45 0.03 255)" }}
                        >
                          {s.section}
                        </td>
                        <td
                          className="px-4 py-3"
                          style={{ color: "oklch(0.45 0.03 255)" }}
                        >
                          {s.rollNo}
                        </td>
                        <td className="px-4 py-3">
                          {pct !== null ? (
                            <div className="flex items-center gap-2">
                              <Progress value={pct} className="w-16 h-1.5" />
                              <span
                                className="text-xs font-semibold"
                                style={{
                                  color:
                                    pct >= 75
                                      ? "oklch(0.4 0.15 140)"
                                      : "oklch(0.45 0.2 20)",
                                }}
                              >
                                {pct}%
                              </span>
                            </div>
                          ) : (
                            <span
                              className="text-xs"
                              style={{ color: "oklch(0.7 0.02 255)" }}
                            >
                              No data
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={downloadTrackingCSV}
              size="sm"
              data-ocid="teacher.reports.performance.download.button"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-1" /> Download CSV
            </Button>
          </div>
          <div
            className="bg-white rounded-2xl border overflow-hidden"
            style={{ borderColor: "oklch(0.93 0.01 255)" }}
            data-ocid="teacher.reports.performance.table"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ background: "oklch(0.97 0.01 255)" }}>
                  <tr>
                    {[
                      "Date",
                      "Class",
                      "Subject",
                      "Topic",
                      "Duration",
                      "Status",
                      "HW",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-semibold text-xs"
                        style={{ color: "oklch(0.55 0.03 255)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tracking.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-sm"
                        style={{ color: "oklch(0.6 0.03 255)" }}
                        data-ocid="teacher.reports.performance.empty_state"
                      >
                        No class logs yet.
                      </td>
                    </tr>
                  )}
                  {[...tracking].reverse().map((t, idx) => (
                    <tr
                      key={t.id}
                      style={{ borderTop: "1px solid oklch(0.96 0.005 255)" }}
                      data-ocid={`teacher.reports.performance.row.item.${idx + 1}`}
                    >
                      <td
                        className="px-4 py-3"
                        style={{ color: "oklch(0.45 0.03 255)" }}
                      >
                        {t.date}
                      </td>
                      <td
                        className="px-4 py-3 font-medium"
                        style={{ color: "oklch(0.25 0.05 265)" }}
                      >
                        {t.className}-{t.section}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: "oklch(0.45 0.03 255)" }}
                      >
                        {t.subject}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: "oklch(0.45 0.03 255)" }}
                      >
                        {t.topic}
                      </td>
                      <td
                        className="px-4 py-3 text-xs"
                        style={{ color: "oklch(0.55 0.03 255)" }}
                      >
                        {t.startTime}–{t.endTime}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: t.completed
                              ? "oklch(0.92 0.1 140)"
                              : "oklch(0.94 0.04 262)",
                            color: t.completed
                              ? "oklch(0.3 0.15 140)"
                              : "oklch(0.35 0.15 262)",
                          }}
                        >
                          {t.completed ? "Done" : "Pending"}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-xs"
                        style={{ color: "oklch(0.55 0.03 255)" }}
                      >
                        {t.homeworkGiven ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Section: Notifications ───────────────────────────────────────────────────

function SectionNotifications({ principal }: { principal: string }) {
  const profile = lsGet<TeacherProfile | null>(
    `teacherProfile_${principal}`,
    null,
  );
  const teacherName = profile?.name || "Teacher";
  const [received] = useState<ReceivedNotification[]>(() =>
    lsGet<ReceivedNotification[]>("adminNotificationsForTeachers", []).filter(
      (n) => n.sentTo === "all" || n.sentTo === principal,
    ),
  );
  const [sent, setSent] = useState<SentNotification[]>(() =>
    lsGet<SentNotification[]>("teacherSentNotifications", []).filter(
      (n) => n.principal === principal,
    ),
  );
  const [form, setForm] = useState({ to: "Students", title: "", message: "" });

  const sendNotification = () => {
    if (!form.title || !form.message) {
      toast.error("Title and message required");
      return;
    }
    const newNotif: SentNotification = {
      id: uid(),
      teacherName,
      principal,
      to: form.to,
      title: form.title,
      message: form.message,
      createdAt: new Date().toLocaleString("en-IN"),
    };
    const allSent = lsGet<SentNotification[]>("teacherSentNotifications", []);
    lsSet("teacherSentNotifications", [...allSent, newNotif]);
    setSent((prev) => [...prev, newNotif]);
    setForm({ to: "Students", title: "", message: "" });
    toast.success("Notification sent!");
  };

  return (
    <div className="space-y-5">
      <Tabs defaultValue="received">
        <TabsList
          className="bg-white border"
          style={{ borderColor: "oklch(0.93 0.01 255)" }}
        >
          <TabsTrigger
            value="received"
            data-ocid="teacher.notifications.received.tab"
          >
            Received ({received.length})
          </TabsTrigger>
          <TabsTrigger value="sent" data-ocid="teacher.notifications.sent.tab">
            Sent ({sent.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          {received.length === 0 ? (
            <div
              className="bg-white rounded-2xl border p-10 text-center"
              style={{ borderColor: "oklch(0.93 0.01 255)" }}
              data-ocid="teacher.notifications.received.empty_state"
            >
              <Bell
                className="w-10 h-10 mx-auto mb-3"
                style={{ color: "oklch(0.75 0.04 255)" }}
              />
              <p className="text-sm" style={{ color: "oklch(0.6 0.03 255)" }}>
                No notifications from admin yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...received].reverse().map((n, idx) => (
                <div
                  key={n.id}
                  className="bg-white rounded-2xl border p-4"
                  style={{ borderColor: "oklch(0.93 0.01 255)" }}
                  data-ocid={`teacher.notifications.received.item.${idx + 1}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.93 0.05 262)" }}
                    >
                      <Bell
                        className="w-4 h-4"
                        style={{ color: "oklch(0.45 0.18 262)" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "oklch(0.2 0.04 265)" }}
                      >
                        {n.title}
                      </p>
                      <p
                        className="text-sm mt-0.5"
                        style={{ color: "oklch(0.45 0.03 255)" }}
                      >
                        {n.message}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "oklch(0.65 0.02 255)" }}
                      >
                        From: {n.sentBy} · {n.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-5">
          {/* Compose */}
          <div
            className="bg-white rounded-2xl border p-5"
            style={{ borderColor: "oklch(0.93 0.01 255)" }}
          >
            <h3
              className="font-semibold mb-4"
              style={{ color: "oklch(0.18 0.04 265)" }}
            >
              Send Notification
            </h3>
            <div className="space-y-3">
              <FormRow label="Send To">
                <select
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                  data-ocid="teacher.notifications.to.select"
                  className="form-input"
                >
                  {["Students", "Parents", "All"].map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </FormRow>
              <FormRow label="Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Notification title"
                  data-ocid="teacher.notifications.title.input"
                  className="form-input"
                />
              </FormRow>
              <FormRow label="Message">
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Write your message..."
                  rows={3}
                  data-ocid="teacher.notifications.message.textarea"
                  className="form-input"
                />
              </FormRow>
              <Button
                onClick={sendNotification}
                data-ocid="teacher.notifications.sent.submit_button"
                className="text-white"
                style={{ background: "oklch(0.35 0.15 262)" }}
              >
                <Bell className="w-4 h-4 mr-1.5" /> Send Notification
              </Button>
            </div>
          </div>

          {/* Sent list */}
          {sent.length === 0 ? (
            <div
              className="bg-white rounded-2xl border p-8 text-center"
              style={{ borderColor: "oklch(0.93 0.01 255)" }}
              data-ocid="teacher.notifications.sent.empty_state"
            >
              <p className="text-sm" style={{ color: "oklch(0.6 0.03 255)" }}>
                No sent notifications yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...sent].reverse().map((n, idx) => (
                <div
                  key={n.id}
                  className="bg-white rounded-2xl border p-4"
                  style={{ borderColor: "oklch(0.93 0.01 255)" }}
                  data-ocid={`teacher.notifications.sent.item.${idx + 1}`}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.2 0.04 265)" }}
                  >
                    {n.title}
                  </p>
                  <p
                    className="text-sm mt-0.5"
                    style={{ color: "oklch(0.45 0.03 255)" }}
                  >
                    {n.message}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.65 0.02 255)" }}
                  >
                    To: {n.to} · {n.createdAt}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Section: Profile ─────────────────────────────────────────────────────────

function SectionProfile({ principal }: { principal: string }) {
  const [profile, setProfile] = useState<TeacherProfile>(() =>
    lsGet<TeacherProfile>(`teacherProfile_${principal}`, {
      name: "",
      email: "",
      phone: "",
      subjects: "",
      qualification: "",
      assignedClasses: "",
      photoUrl: "",
      principal,
    }),
  );
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<TeacherProfile>(profile);
  const photoRef = useRef<HTMLInputElement | null>(null);

  const saveProfile = () => {
    lsSet(`teacherProfile_${principal}`, draft);
    setProfile(draft);
    setEditing(false);
    toast.success("Profile saved!");
  };

  const handlePhoto = (file: File) => {
    const url = URL.createObjectURL(file);
    setDraft((prev) => ({ ...prev, photoUrl: url }));
  };

  const displayProfile = editing ? draft : profile;

  return (
    <div className="max-w-2xl space-y-5">
      <div
        className="bg-white rounded-2xl border shadow-sm p-6"
        style={{ borderColor: "oklch(0.93 0.01 255)" }}
        data-ocid="teacher.profile.card"
      >
        <div className="flex items-start gap-5 mb-6">
          <div className="relative">
            {displayProfile.photoUrl ? (
              <img
                src={displayProfile.photoUrl}
                alt="Profile"
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.3 0.12 265), oklch(0.45 0.18 262))",
                }}
              >
                {profile.name?.charAt(0)?.toUpperCase() || "T"}
              </div>
            )}
            {editing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  ref={photoRef}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handlePhoto(f);
                  }}
                />
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  data-ocid="teacher.profile.photo.upload_button"
                  className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white shadow"
                  style={{ background: "oklch(0.35 0.15 262)" }}
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
          <div className="flex-1">
            <h2
              className="text-xl font-bold"
              style={{ color: "oklch(0.18 0.04 265)" }}
            >
              {profile.name || "Your Name"}
            </h2>
            <p className="text-sm" style={{ color: "oklch(0.55 0.03 255)" }}>
              {profile.subjects || "Subject(s)"}
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "oklch(0.65 0.02 255)" }}
            >
              ID: {principal.slice(0, 20)}...
            </p>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={() => {
                setDraft(profile);
                setEditing(true);
              }}
              data-ocid="teacher.profile.edit_button"
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border transition-colors hover:bg-slate-50"
              style={{
                borderColor: "oklch(0.9 0.02 255)",
                color: "oklch(0.45 0.18 262)",
              }}
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <FormRow label="Full Name">
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Your full name"
                  data-ocid="teacher.profile.name.input"
                  className="form-input"
                />
              </FormRow>
              <FormRow label="Email">
                <input
                  value={draft.email}
                  onChange={(e) =>
                    setDraft({ ...draft, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  data-ocid="teacher.profile.email.input"
                  className="form-input"
                />
              </FormRow>
              <FormRow label="Phone">
                <input
                  value={draft.phone}
                  onChange={(e) =>
                    setDraft({ ...draft, phone: e.target.value })
                  }
                  placeholder="+91 XXXXX XXXXX"
                  data-ocid="teacher.profile.phone.input"
                  className="form-input"
                />
              </FormRow>
              <FormRow label="Qualification">
                <input
                  value={draft.qualification}
                  onChange={(e) =>
                    setDraft({ ...draft, qualification: e.target.value })
                  }
                  placeholder="e.g. M.Sc, B.Ed"
                  data-ocid="teacher.profile.qualification.input"
                  className="form-input"
                />
              </FormRow>
              <FormRow label="Subjects">
                <input
                  value={draft.subjects}
                  onChange={(e) =>
                    setDraft({ ...draft, subjects: e.target.value })
                  }
                  placeholder="e.g. Mathematics, Science"
                  data-ocid="teacher.profile.subjects.input"
                  className="form-input"
                />
              </FormRow>
              <FormRow label="Assigned Classes">
                <input
                  value={draft.assignedClasses}
                  onChange={(e) =>
                    setDraft({ ...draft, assignedClasses: e.target.value })
                  }
                  placeholder="e.g. 6th A, 7th B"
                  data-ocid="teacher.profile.assigned_classes.input"
                  className="form-input"
                />
              </FormRow>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={saveProfile}
                data-ocid="teacher.profile.save_button"
                className="text-white"
                style={{ background: "oklch(0.35 0.15 262)" }}
              >
                <Save className="w-4 h-4 mr-1" /> Save Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                data-ocid="teacher.profile.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {(
              [
                ["Email", profile.email],
                ["Phone", profile.phone],
                ["Qualification", profile.qualification],
                ["Subjects", profile.subjects],
                ["Assigned Classes", profile.assignedClasses],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label}>
                <div
                  className="text-xs font-medium mb-0.5"
                  style={{ color: "oklch(0.55 0.03 255)" }}
                >
                  {label}
                </div>
                <div
                  style={{
                    color: value
                      ? "oklch(0.25 0.05 265)"
                      : "oklch(0.7 0.02 255)",
                  }}
                >
                  {value || "Not set"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared helper UI components ──────────────────────────────────────────────

function ModalOverlay({
  children,
  onClose,
}: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.5)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function ModalBox({
  title,
  children,
  onClose,
  ocid,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  ocid?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl" data-ocid={ocid}>
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid oklch(0.93 0.01 255)" }}
      >
        <h2 className="font-semibold" style={{ color: "oklch(0.18 0.04 265)" }}>
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          data-ocid={`${ocid}.close_button`}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" style={{ color: "oklch(0.55 0.03 255)" }} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function FormRow({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="text-xs font-medium block mb-1"
        style={{ color: "oklch(0.45 0.03 265)" }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
