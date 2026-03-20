import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Award,
  Bell,
  BookOpen,
  CheckCircle,
  ClipboardCheck,
  Download,
  GraduationCap,
  Loader2,
  Video,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { SectionHeader } from "../../components/dashboard/SectionHeader";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  { id: "classes", label: "My Classes", icon: <Video className="w-4 h-4" /> },
  { id: "homework", label: "Homework", icon: <BookOpen className="w-4 h-4" /> },
  {
    id: "attendance",
    label: "Attendance",
    icon: <ClipboardCheck className="w-4 h-4" />,
  },
  { id: "results", label: "Results", icon: <Award className="w-4 h-4" /> },
  {
    id: "materials",
    label: "Study Materials",
    icon: <Download className="w-4 h-4" />,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="w-4 h-4" />,
  },
];

const SAMPLE_CLASSES = [
  {
    id: "c1",
    subject: "Mathematics",
    class: "8th Standard – Section A",
    teacher: "Mrs. Lakshmi",
    time: "09:00–10:00 AM",
    status: "Online",
    meet: "https://meet.google.com",
  },
  {
    id: "c2",
    subject: "Science",
    class: "8th Standard – Section A",
    teacher: "Mr. Rajan",
    time: "10:00–11:00 AM",
    status: "Upcoming",
    meet: "https://meet.google.com",
  },
  {
    id: "c3",
    subject: "English",
    class: "8th Standard – Section A",
    teacher: "Mrs. Priya",
    time: "11:00–12:00 PM",
    status: "Upcoming",
    meet: "https://meet.google.com",
  },
];

const SAMPLE_HW = [
  {
    id: "h1",
    title: "Exercise 4.2 – Algebra",
    subject: "Mathematics",
    dueDate: "2026-03-22",
    status: "Pending",
  },
  {
    id: "h2",
    title: "Chapter 7 Questions",
    subject: "Science",
    dueDate: "2026-03-24",
    status: "Submitted",
  },
  {
    id: "h3",
    title: "Write a paragraph on Nature",
    subject: "English",
    dueDate: "2026-03-23",
    status: "Pending",
  },
];

const SAMPLE_NOTIFICATIONS = [
  {
    id: "n1",
    text: "New homework assigned: Mathematics Exercise 4.2 – Due March 22",
    time: "Today, 10:05 AM",
    from: "Teacher",
  },
  {
    id: "n2",
    text: "Attendance marked for March 20 – Present",
    time: "Today, 09:30 AM",
    from: "System",
  },
  {
    id: "n3",
    text: "Exam result uploaded: Mathematics Unit Test – 45/50",
    time: "Yesterday, 04:00 PM",
    from: "Teacher",
  },
];

const ATTENDANCE_WEEKS = [
  {
    week: "March 2 – 7",
    mon: "P",
    tue: "P",
    wed: "P",
    thu: "A",
    fri: "P",
    sat: "P",
  },
  {
    week: "March 9 – 14",
    mon: "P",
    tue: "P",
    wed: "A",
    thu: "P",
    fri: "P",
    sat: "P",
  },
  {
    week: "March 16 – 21",
    mon: "P",
    tue: "P",
    wed: "P",
    thu: "P",
    fri: "A",
    sat: "P",
  },
  {
    week: "Feb 23 – 28",
    mon: "P",
    tue: "A",
    wed: "P",
    thu: "P",
    fri: "P",
    sat: "P",
  },
  {
    week: "Feb 16 – 21",
    mon: "P",
    tue: "P",
    wed: "P",
    thu: "P",
    fri: "P",
    sat: "A",
  },
];

const SAMPLE_RESULTS = [
  {
    id: "r1",
    title: "Mathematics Unit Test 1",
    marks: 45,
    total: 50,
    grade: "A+",
  },
  { id: "r2", title: "Science Mid-Term", marks: 82, total: 100, grade: "A" },
];

const SAMPLE_MATERIALS = [
  {
    id: "m1",
    title: "Mathematics Chapter 4 Notes",
    type: "PDF",
    subject: "Mathematics",
  },
  { id: "m2", title: "Science Diagrams", type: "Image", subject: "Science" },
  { id: "m3", title: "English Grammar Rules", type: "PDF", subject: "English" },
];

function LoginScreen({
  onLogin,
  isLoggingIn,
}: { onLogin: () => void; isLoggingIn: boolean }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.22 0.07 280) 0%, oklch(0.32 0.1 265) 50%, oklch(0.28 0.12 295) 100%)",
      }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-8 text-center shadow-2xl"
        style={{
          background: "oklch(0.18 0.05 275 / 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid oklch(0.4 0.1 270 / 0.3)",
        }}
      >
        <div
          className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.2 280), oklch(0.65 0.18 310))",
          }}
        >
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Student Portal</h1>
        <p className="text-sm mb-8" style={{ color: "oklch(0.75 0.05 270)" }}>
          Access your classes, homework, and results
        </p>
        <div
          className="space-y-4 text-left mb-6"
          style={{ color: "oklch(0.7 0.04 270)" }}
        >
          {[
            { icon: "📚", text: "View assigned classes & join live sessions" },
            { icon: "📝", text: "Check homework and submit assignments" },
            { icon: "📊", text: "Track your attendance and exam results" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 text-sm">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        <Button
          onClick={onLogin}
          disabled={isLoggingIn}
          className="w-full h-12 text-base font-semibold text-white border-0 rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.2 280), oklch(0.62 0.18 310))",
          }}
          data-ocid="student.login.button"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Connecting...
            </>
          ) : (
            "🔐 Login with Internet Identity"
          )}
        </Button>
        <p className="text-xs mt-4" style={{ color: "oklch(0.55 0.04 270)" }}>
          Powered by Internet Computer · Secure &amp; Private
        </p>
      </div>
    </div>
  );
}

export function StudentDashboard() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [submittedHW, setSubmittedHW] = useState<string[]>(["h2"]);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const isLoggingIn = loginStatus === "logging-in";
  const isLoggedIn = loginStatus === "success" && !!identity;

  const handleLogin = () => {
    if (loginStatus === "success" && identity) return;
    login();
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} isLoggingIn={isLoggingIn} />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="My Dashboard"
              description="Welcome back! Here's your learning summary."
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatsCard
                title="Enrolled Classes"
                value="3"
                icon="📚"
                color="oklch(0.45 0.18 262)"
              />
              <StatsCard
                title="Today's Classes"
                value="2"
                icon="📺"
                color="oklch(0.52 0.18 280)"
              />
              <StatsCard
                title="Attendance"
                value="87%"
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Pending Homework"
                value="2"
                icon="📝"
                color="oklch(0.68 0.19 50)"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="bg-white rounded-2xl border p-5 shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <h3 className="font-semibold text-foreground mb-3">
                  Today's Classes
                </h3>
                <div className="space-y-2">
                  {SAMPLE_CLASSES.slice(0, 2).map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">{cls.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {cls.time}
                        </p>
                      </div>
                      <Badge
                        className={
                          cls.status === "Online"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {cls.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="bg-white rounded-2xl border p-5 shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <h3 className="font-semibold text-foreground mb-3">
                  Recent Notifications
                </h3>
                <div className="space-y-2">
                  {SAMPLE_NOTIFICATIONS.slice(0, 2).map((n) => (
                    <div
                      key={n.id}
                      className="text-sm py-2 border-b last:border-0"
                    >
                      <p className="text-foreground line-clamp-2">{n.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {n.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "classes":
        return (
          <div className="space-y-4">
            <SectionHeader
              title="My Classes"
              description="Your enrolled classes and live sessions"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_CLASSES.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-2xl border p-5 shadow-sm"
                  style={{ borderColor: "oklch(0.93 0.02 255)" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: "oklch(0.45 0.18 262)" }}
                    >
                      {cls.subject[0]}
                    </div>
                    <Badge
                      className={
                        cls.status === "Online"
                          ? "bg-green-100 text-green-800 border-0"
                          : "bg-blue-100 text-blue-800 border-0"
                      }
                    >
                      {cls.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {cls.subject}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    {cls.class}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">
                    👩‍🏫 {cls.teacher}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    🕐 {cls.time}
                  </p>
                  <a href={cls.meet} target="_blank" rel="noopener noreferrer">
                    <Button
                      size="sm"
                      className="w-full text-white border-0"
                      style={{ background: "oklch(0.45 0.18 262)" }}
                      data-ocid={`classes.join_button.${SAMPLE_CLASSES.indexOf(cls) + 1}`}
                    >
                      Join Live Class
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        );

      case "homework":
        return (
          <div className="space-y-4">
            <SectionHeader
              title="Homework"
              description="Pending and completed assignments"
            />
            <div className="space-y-3">
              {SAMPLE_HW.map((hw, idx) => {
                const submitted = submittedHW.includes(hw.id);
                return (
                  <div
                    key={hw.id}
                    className="bg-white rounded-2xl border p-5 shadow-sm"
                    style={{ borderColor: "oklch(0.93 0.02 255)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {hw.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          📚 {hw.subject} · 📅 Due: {hw.dueDate}
                        </p>
                      </div>
                      <Badge
                        className={
                          submitted
                            ? "bg-green-100 text-green-800 border-0"
                            : "bg-yellow-100 text-yellow-800 border-0"
                        }
                      >
                        {submitted ? "Submitted" : "Pending"}
                      </Badge>
                    </div>
                    {!submitted && (
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="file"
                          className="hidden"
                          ref={(el) => {
                            fileRefs.current[hw.id] = el;
                          }}
                          onChange={() => {
                            setSubmittedHW((prev) => [...prev, hw.id]);
                            toast.success(`Homework submitted: ${hw.title}`);
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => fileRefs.current[hw.id]?.click()}
                          data-ocid={`homework.submit_button.${idx + 1}`}
                        >
                          📎 Submit Homework
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "attendance":
        return (
          <div className="space-y-4">
            <SectionHeader
              title="Attendance"
              description="Your daily attendance record"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <StatsCard
                title="Present Days"
                value="34"
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Absent Days"
                value="5"
                icon="❌"
                color="oklch(0.577 0.245 27)"
              />
              <StatsCard
                title="Total Days"
                value="39"
                icon="📅"
                color="oklch(0.45 0.18 262)"
              />
              <StatsCard
                title="Percentage"
                value="87%"
                icon="📊"
                color="oklch(0.68 0.19 50)"
              />
            </div>
            <div
              className="bg-white rounded-2xl border p-5 shadow-sm"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Overall Attendance</span>
                <span
                  className="font-bold"
                  style={{ color: "oklch(0.55 0.16 165)" }}
                >
                  87%
                </span>
              </div>
              <Progress value={87} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                Minimum 75% attendance required
              </p>
            </div>
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Week</TableHead>
                    <TableHead>Mon</TableHead>
                    <TableHead>Tue</TableHead>
                    <TableHead>Wed</TableHead>
                    <TableHead>Thu</TableHead>
                    <TableHead>Fri</TableHead>
                    <TableHead>Sat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ATTENDANCE_WEEKS.map((w) => (
                    <TableRow key={w.week}>
                      <TableCell className="text-xs font-medium">
                        {w.week}
                      </TableCell>
                      {[w.mon, w.tue, w.wed, w.thu, w.fri, w.sat].map(
                        (d, j) => (
                          <TableCell
                            key={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][j]}
                          >
                            {d === "P" ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "results":
        return (
          <div className="space-y-4">
            <SectionHeader
              title="Exam Results"
              description="Your test scores and performance"
            />
            <div
              className="bg-white rounded-2xl border p-5 shadow-sm mb-2"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Overall Average
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: "oklch(0.45 0.18 262)" }}
                  >
                    86%
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-0 text-sm px-3 py-1">
                  Strong in Mathematics 🏆
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              {SAMPLE_RESULTS.map((r) => {
                const pct = Math.round((r.marks / r.total) * 100);
                return (
                  <div
                    key={r.id}
                    className="bg-white rounded-2xl border p-5 shadow-sm"
                    style={{ borderColor: "oklch(0.93 0.02 255)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">
                          {r.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {r.marks}/{r.total} marks
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-indigo-100 text-indigo-800 border-0">
                          {r.grade}
                        </Badge>
                        <span
                          className="text-2xl font-bold"
                          style={{ color: "oklch(0.45 0.18 262)" }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
              ⭐ Strong in Mathematics – Keep it up!
            </div>
          </div>
        );

      case "materials":
        return (
          <div className="space-y-4">
            <SectionHeader
              title="Study Materials"
              description="Download your learning resources"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_MATERIALS.map((m, idx) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border p-5 shadow-sm"
                  style={{ borderColor: "oklch(0.93 0.02 255)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center text-lg"
                    style={{ background: "oklch(0.95 0.04 255)" }}
                  >
                    {m.type === "PDF" ? "📄" : "🖼️"}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    {m.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {m.type} · {m.subject}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() =>
                      toast.info("File download available in full version")
                    }
                    data-ocid={`materials.download_button.${idx + 1}`}
                  >
                    <Download className="w-3 h-3 mr-1" /> Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4">
            <SectionHeader
              title="Notifications"
              description="Messages from teachers and admin"
            />
            <div className="space-y-3">
              {SAMPLE_NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className="bg-white rounded-2xl border p-5 shadow-sm"
                  style={{ borderColor: "oklch(0.93 0.02 255)" }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.95 0.04 262)" }}
                    >
                      <Bell
                        className="w-4 h-4"
                        style={{ color: "oklch(0.45 0.18 262)" }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{n.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {n.time}
                        </span>
                        <Badge className="text-xs bg-blue-50 text-blue-700 border-0">
                          {n.from}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title="Student"
      subtitle="Student Dashboard"
      dashboardRole="student"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
