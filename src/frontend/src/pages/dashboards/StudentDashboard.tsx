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
  BarChart3,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  Download,
  Video,
} from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { SectionHeader } from "../../components/dashboard/SectionHeader";
import { StatsCard } from "../../components/dashboard/StatsCard";
import {
  SAMPLE_ATTENDANCE,
  SAMPLE_CERTIFICATES,
  SAMPLE_HOMEWORK,
  SAMPLE_PAYMENTS,
  SAMPLE_SCHEDULED_CLASSES,
  SAMPLE_STUDY_MATERIALS,
  SAMPLE_TEST_RESULTS,
} from "../../data/sampleData";

const navItems = [
  { id: "classes", label: "My Classes", icon: <Video className="w-4 h-4" /> },
  {
    id: "attendance",
    label: "Attendance",
    icon: <ClipboardCheck className="w-4 h-4" />,
  },
  { id: "homework", label: "Homework", icon: <BookOpen className="w-4 h-4" /> },
  {
    id: "results",
    label: "Test Results",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: "materials",
    label: "Study Materials",
    icon: <Download className="w-4 h-4" />,
  },
  {
    id: "certificates",
    label: "My Certificates",
    icon: <Award className="w-4 h-4" />,
  },
  {
    id: "payments",
    label: "Payments",
    icon: <CreditCard className="w-4 h-4" />,
  },
];

const STUDENT_ID = BigInt(1);

export function StudentDashboard() {
  const [activeSection, setActiveSection] = useState("classes");

  const attendancePresent = SAMPLE_ATTENDANCE.filter(
    (a) => a.status === "Present",
  ).length;
  const attendancePct = Math.round(
    (attendancePresent / SAMPLE_ATTENDANCE.length) * 100,
  );
  const avgScore = Math.round(
    SAMPLE_TEST_RESULTS.reduce((a, r) => a + Number(r.score), 0) /
      SAMPLE_TEST_RESULTS.length,
  );

  const renderContent = () => {
    switch (activeSection) {
      case "classes":
        return (
          <div>
            <SectionHeader
              title="My Classes"
              description="Upcoming live sessions"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Today's Classes"
                value="2"
                icon="📺"
                color="oklch(0.45 0.18 262)"
              />
              <StatsCard
                title="This Week"
                value="8"
                icon="📅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Total Classes"
                value="45"
                icon="🏆"
                color="oklch(0.68 0.19 50)"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_SCHEDULED_CLASSES.map((cls) => (
                <div
                  key={cls.classId.toString()}
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
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: "oklch(0.93 0.08 165 / 0.3)",
                        color: "oklch(0.45 0.15 165)",
                      }}
                    >
                      Live
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {cls.subject}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-1">
                    {cls.classLevel}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {cls.scheduledDate} · {cls.scheduledTime}
                  </p>
                  <a
                    href={cls.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="w-full text-white border-0"
                      style={{ background: "oklch(0.45 0.18 262)" }}
                    >
                      Join Class
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        );

      case "attendance":
        return (
          <div>
            <SectionHeader
              title="My Attendance"
              description="Your attendance record"
            />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Present Days"
                value={attendancePresent}
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Absent Days"
                value={SAMPLE_ATTENDANCE.length - attendancePresent}
                icon="❌"
                color="oklch(0.577 0.245 27)"
              />
              <StatsCard
                title="Attendance %"
                value={`${attendancePct}%`}
                icon="📊"
                color="oklch(0.45 0.18 262)"
              />
            </div>
            <div
              className="bg-white rounded-2xl border p-5 shadow-sm mb-6"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Overall Attendance</span>
                <span
                  className="font-bold"
                  style={{ color: "oklch(0.55 0.16 165)" }}
                >
                  {attendancePct}%
                </span>
              </div>
              <Progress value={attendancePct} className="h-3" />
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
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_ATTENDANCE.map((a) => (
                    <TableRow key={a.recordId.toString()}>
                      <TableCell>{a.date}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${a.status === "Present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {a.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "homework":
        return (
          <div>
            <SectionHeader
              title="Homework"
              description="Pending and completed assignments"
            />
            <div className="space-y-4">
              {SAMPLE_HOMEWORK.map((hw) => (
                <div
                  key={hw.homeworkId.toString()}
                  className="bg-white rounded-2xl border p-5 shadow-sm"
                  style={{ borderColor: "oklch(0.93 0.02 255)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {hw.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {hw.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: "oklch(0.95 0.04 255)",
                            color: "oklch(0.45 0.18 262)",
                          }}
                        >
                          {hw.classLevel}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          📅 Due: {hw.dueDate}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold ml-3 shrink-0">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "results":
        return (
          <div>
            <SectionHeader
              title="Test Results"
              description="Your exam scores and performance"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Average Score"
                value={`${avgScore}%`}
                icon="🎯"
                color="oklch(0.45 0.18 262)"
              />
              <StatsCard
                title="Tests Taken"
                value={SAMPLE_TEST_RESULTS.length}
                icon="📝"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Best Score"
                value={`${Math.max(...SAMPLE_TEST_RESULTS.map((r) => Number(r.score)))}%`}
                icon="⭐"
                color="oklch(0.68 0.19 50)"
              />
            </div>
            <div className="space-y-3">
              {SAMPLE_TEST_RESULTS.map((r) => {
                const pct = Math.round(
                  (Number(r.score) / Number(r.maxScore)) * 100,
                );
                const color =
                  pct >= 80
                    ? "oklch(0.55 0.16 165)"
                    : pct >= 60
                      ? "oklch(0.68 0.19 50)"
                      : "oklch(0.577 0.245 27)";
                return (
                  <div
                    key={r.resultId.toString()}
                    className="bg-white rounded-2xl border p-5 shadow-sm"
                    style={{ borderColor: "oklch(0.93 0.02 255)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">
                          {r.subject}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {r.testDate}
                        </p>
                      </div>
                      <span className="text-2xl font-bold" style={{ color }}>
                        {pct}%
                      </span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {r.score.toString()} / {r.maxScore.toString()} marks
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "materials":
        return (
          <div>
            <SectionHeader
              title="Study Materials"
              description="Download your learning resources"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_STUDY_MATERIALS.map((m) => (
                <div
                  key={m.materialId.toString()}
                  className="bg-white rounded-2xl border p-5 shadow-sm"
                  style={{ borderColor: "oklch(0.93 0.02 255)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center text-lg"
                    style={{ background: "oklch(0.95 0.04 255)" }}
                  >
                    📄
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    {m.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {m.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: "oklch(0.95 0.04 255)",
                        color: "oklch(0.45 0.18 262)",
                      }}
                    >
                      {m.classLevel}
                    </span>
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                      >
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "certificates":
        return (
          <div>
            <SectionHeader
              title="My Certificates"
              description="Your earned certificates"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SAMPLE_CERTIFICATES.map((cert) => (
                <div
                  key={cert.certId.toString()}
                  className="bg-white rounded-2xl border p-6 shadow-sm text-center overflow-hidden relative"
                  style={{ borderColor: "oklch(0.68 0.19 50)" }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{
                      background:
                        "linear-gradient(90deg, oklch(0.45 0.18 262), oklch(0.68 0.19 50))",
                    }}
                  />
                  <div className="text-5xl mb-3">🏆</div>
                  <h3 className="font-bold text-foreground mb-1">
                    {cert.courseName}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    Certificate Number: {cert.certNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Issued on: {cert.issueDate}
                  </p>
                  <Button
                    size="sm"
                    className="text-white border-0"
                    style={{ background: "oklch(0.45 0.18 262)" }}
                  >
                    <Download className="w-3 h-3 mr-1.5" /> Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case "payments":
        return (
          <div>
            <SectionHeader
              title="Payments"
              description="Your payment history and dues"
            />
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatsCard
                title="Total Paid"
                value="₹798"
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Current Plan"
                value="Standard"
                icon="⭐"
                color="oklch(0.45 0.18 262)"
              />
            </div>

            {/* Pay Now for upcoming month */}
            <div
              className="bg-white rounded-2xl border p-5 shadow-sm mb-6 flex items-center justify-between"
              style={{ borderColor: "oklch(0.68 0.19 50)" }}
            >
              <div>
                <h3 className="font-semibold text-foreground">
                  March 2026 Fee Due
                </h3>
                <p className="text-sm text-muted-foreground">
                  Standard Plan · ₹399/month
                </p>
                <p className="text-xs" style={{ color: "oklch(0.68 0.19 50)" }}>
                  Due by: March 5, 2026
                </p>
              </div>
              <Button
                className="text-white border-0 shrink-0"
                style={{ background: "oklch(0.68 0.19 50)" }}
                onClick={() =>
                  window.open("https://wa.me/917996401388", "_blank")
                }
              >
                Contact to Pay
              </Button>
            </div>

            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_PAYMENTS.filter(
                    (p) => p.studentId === STUDENT_ID,
                  ).map((p) => (
                    <TableRow key={p.paymentId.toString()}>
                      <TableCell className="font-mono text-xs">
                        #{p.paymentId.toString()}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{(Number(p.amount) / 100).toFixed(0)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        Order-{p.paymentId.toString().padStart(4, "0")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {p.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Contact our team for fee payment assistance.
            </p>
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
