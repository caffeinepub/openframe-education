import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Calendar,
  ClipboardCheck,
  CreditCard,
  Users,
} from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { SectionHeader } from "../../components/dashboard/SectionHeader";
import { StatsCard } from "../../components/dashboard/StatsCard";
import {
  SAMPLE_ATTENDANCE,
  SAMPLE_PAYMENTS,
  SAMPLE_SCHEDULED_CLASSES,
  SAMPLE_STUDENTS,
  SAMPLE_TEST_RESULTS,
} from "../../data/sampleData";

const navItems = [
  { id: "children", label: "My Children", icon: <Users className="w-4 h-4" /> },
  {
    id: "attendance",
    label: "Attendance",
    icon: <ClipboardCheck className="w-4 h-4" />,
  },
  {
    id: "progress",
    label: "Progress Report",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: "payments",
    label: "Payments",
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    id: "schedule",
    label: "Upcoming Classes",
    icon: <Calendar className="w-4 h-4" />,
  },
];

const PARENT_STUDENTS = SAMPLE_STUDENTS.slice(0, 2);

export function ParentDashboard() {
  const [activeSection, setActiveSection] = useState("children");

  const attendancePct = Math.round(
    (SAMPLE_ATTENDANCE.filter((a) => a.status === "Present").length /
      SAMPLE_ATTENDANCE.length) *
      100,
  );

  const renderContent = () => {
    switch (activeSection) {
      case "children":
        return (
          <div>
            <SectionHeader
              title="My Children"
              description="Children enrolled in OpenFrame Education"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PARENT_STUDENTS.map((student) => (
                <div
                  key={student.studentId.toString()}
                  className="bg-white rounded-2xl border p-6 shadow-sm"
                  style={{ borderColor: "oklch(0.93 0.02 255)" }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                      style={{ background: "oklch(0.68 0.19 50)" }}
                    >
                      {student.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">
                        {student.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {student.classLevel}
                      </p>
                    </div>
                    <span
                      className="ml-auto px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: student.isActive
                          ? "oklch(0.93 0.08 165 / 0.3)"
                          : "oklch(0.95 0 0)",
                        color: student.isActive
                          ? "oklch(0.45 0.15 165)"
                          : "oklch(0.5 0 0)",
                      }}
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Syllabus", value: student.syllabus },
                      { label: "Medium", value: student.medium },
                      {
                        label: "Plan",
                        value: `Plan #${student.enrolledPlanId.toString()}`,
                      },
                      {
                        label: "Student ID",
                        value: `#${student.studentId.toString()}`,
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="text-center p-2 rounded-xl"
                        style={{ background: "oklch(0.97 0.01 255)" }}
                      >
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-sm font-semibold text-foreground">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "attendance":
        return (
          <div>
            <SectionHeader
              title="Attendance Summary"
              description="Your child's attendance record"
            />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Present Days"
                value={
                  SAMPLE_ATTENDANCE.filter((a) => a.status === "Present").length
                }
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Absent Days"
                value={
                  SAMPLE_ATTENDANCE.filter((a) => a.status === "Absent").length
                }
                icon="❌"
                color="oklch(0.577 0.245 27)"
              />
              <StatsCard
                title="Attendance"
                value={`${attendancePct}%`}
                icon="📊"
                color="oklch(0.45 0.18 262)"
              />
            </div>
            <div
              className="bg-white rounded-2xl border p-5 shadow-sm"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Aditya Kumar – Attendance</span>
                <span
                  className="font-bold"
                  style={{
                    color:
                      attendancePct >= 75
                        ? "oklch(0.55 0.16 165)"
                        : "oklch(0.577 0.245 27)",
                  }}
                >
                  {attendancePct}%
                </span>
              </div>
              <Progress value={attendancePct} className="h-3 mb-4" />
              <div className="space-y-2">
                {SAMPLE_ATTENDANCE.map((a) => (
                  <div
                    key={a.recordId.toString()}
                    className="flex justify-between py-2 border-b last:border-0 text-sm"
                    style={{ borderColor: "oklch(0.95 0.01 255)" }}
                  >
                    <span className="text-foreground/70">{a.date}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.status === "Present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "progress":
        return (
          <div>
            <SectionHeader
              title="Progress Report"
              description="Academic performance overview"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Avg Score"
                value="84%"
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
                title="Best Subject"
                value="English"
                icon="⭐"
                color="oklch(0.68 0.19 50)"
              />
            </div>
            <div
              className="bg-white rounded-2xl border p-5 shadow-sm"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <h3 className="font-semibold text-foreground mb-4">
                Subject-wise Performance
              </h3>
              <div className="space-y-4">
                {SAMPLE_TEST_RESULTS.map((r) => {
                  const pct = Math.round(
                    (Number(r.score) / Number(r.maxScore)) * 100,
                  );
                  return (
                    <div key={r.resultId.toString()}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground/70">{r.subject}</span>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "payments":
        return (
          <div>
            <SectionHeader
              title="Payments"
              description="Fee payment history and dues"
            />
            <div
              className="bg-white rounded-2xl border p-5 shadow-sm mb-6 flex items-center justify-between"
              style={{ borderColor: "oklch(0.68 0.19 50)" }}
            >
              <div>
                <h3 className="font-semibold text-foreground">
                  March 2026 Fee Due
                </h3>
                <p className="text-sm text-muted-foreground">
                  Aditya Kumar · Basic Plan
                </p>
                <p className="text-xs" style={{ color: "oklch(0.68 0.19 50)" }}>
                  Due: March 5, 2026
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
            <div className="space-y-3">
              {SAMPLE_PAYMENTS.map((p) => (
                <div
                  key={p.paymentId.toString()}
                  className="bg-white rounded-xl border p-4 shadow-sm flex items-center justify-between"
                  style={{ borderColor: "oklch(0.93 0.02 255)" }}
                >
                  <div>
                    <p className="font-medium text-sm">
                      Payment #{p.paymentId.toString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Order #{p.paymentId.toString().padStart(4, "0")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-bold"
                      style={{ color: "oklch(0.45 0.18 262)" }}
                    >
                      ₹{(Number(p.amount) / 100).toFixed(0)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Contact our team for fee payment assistance.
            </p>
          </div>
        );

      case "schedule":
        return (
          <div>
            <SectionHeader
              title="Upcoming Classes"
              description="Scheduled live classes for your child"
            />
            <div className="space-y-3">
              {SAMPLE_SCHEDULED_CLASSES.map((cls) => (
                <div
                  key={cls.classId.toString()}
                  className="bg-white rounded-xl border p-4 shadow-sm flex items-center gap-4"
                  style={{ borderColor: "oklch(0.93 0.02 255)" }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: "oklch(0.45 0.18 262)" }}
                  >
                    {cls.subject[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm">
                      {cls.subject}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {cls.classLevel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cls.scheduledDate} · {cls.scheduledTime}
                    </p>
                  </div>
                  <a
                    href={cls.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="text-white border-0 shrink-0"
                      style={{ background: "oklch(0.45 0.18 262)" }}
                    >
                      Join
                    </Button>
                  </a>
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
      title="Parent"
      subtitle="Parent Dashboard"
      dashboardRole="parent"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
