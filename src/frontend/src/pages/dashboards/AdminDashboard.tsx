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
  BookOpen,
  Calendar,
  ClipboardCheck,
  Clock,
  CreditCard,
  LayoutDashboard,
  Share2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { SectionHeader } from "../../components/dashboard/SectionHeader";
import { StatsCard } from "../../components/dashboard/StatsCard";
import {
  SAMPLE_ATTENDANCE,
  SAMPLE_DEMO_BOOKINGS,
  SAMPLE_PAYMENTS,
  SAMPLE_REFERRALS,
  SAMPLE_SCHEDULED_CLASSES,
  SAMPLE_STUDENTS,
  SAMPLE_STUDY_MATERIALS,
} from "../../data/sampleData";
import {
  useGetAllDemoBookings,
  useGetAllStudyMaterials,
} from "../../hooks/useQueries";

const navItems = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: "demo-bookings",
    label: "Demo Bookings",
    icon: <Calendar className="w-4 h-4" />,
  },
  { id: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
  {
    id: "attendance",
    label: "Attendance",
    icon: <ClipboardCheck className="w-4 h-4" />,
  },
  {
    id: "payments",
    label: "Payments",
    icon: <CreditCard className="w-4 h-4" />,
  },
  { id: "referrals", label: "Referrals", icon: <Share2 className="w-4 h-4" /> },
  {
    id: "certificates",
    label: "Certificates",
    icon: <Award className="w-4 h-4" />,
  },
  {
    id: "materials",
    label: "Study Materials",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: "schedule",
    label: "Class Schedule",
    icon: <Clock className="w-4 h-4" />,
  },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Paid: "bg-green-100 text-green-800",
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-red-100 text-red-800",
  Present: "bg-green-100 text-green-800",
  Absent: "bg-red-100 text-red-800",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const { data: demoBookings } = useGetAllDemoBookings();
  const { data: studyMaterials } = useGetAllStudyMaterials();

  const bookings =
    demoBookings && demoBookings.length > 0
      ? demoBookings
      : SAMPLE_DEMO_BOOKINGS;
  const materials =
    studyMaterials && studyMaterials.length > 0
      ? studyMaterials
      : SAMPLE_STUDY_MATERIALS;

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div>
            <SectionHeader
              title="Admin Overview"
              description="Platform performance at a glance"
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard
                title="Total Students"
                value={SAMPLE_STUDENTS.length}
                icon="👥"
                color="oklch(0.45 0.18 262)"
                trend="+12%"
              />
              <StatsCard
                title="Demo Bookings"
                value={bookings.length}
                icon="📅"
                color="oklch(0.68 0.19 50)"
                trend="+5%"
              />
              <StatsCard
                title="Total Revenue"
                value="₹48,500"
                icon="💰"
                color="oklch(0.55 0.16 165)"
                trend="+18%"
              />
              <StatsCard
                title="Active Teachers"
                value="3"
                icon="👨‍🏫"
                color="oklch(0.6 0.22 15)"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className="bg-white rounded-2xl p-5 border shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <h3 className="font-semibold text-foreground mb-4">
                  Recent Demo Bookings
                </h3>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div
                      key={b.bookingId.toString()}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                      style={{ borderColor: "oklch(0.95 0.01 255)" }}
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {b.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {b.classLevel} · {b.cityVillage}
                        </p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="bg-white rounded-2xl p-5 border shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <h3 className="font-semibold text-foreground mb-4">
                  Enrollment by Class
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Nursery – UKG", count: 8, total: 15 },
                    { label: "1st to 5th", count: 22, total: 30 },
                    { label: "6th to 8th", count: 31, total: 40 },
                    { label: "9th to 10th", count: 28, total: 35 },
                    { label: "11th to 12th", count: 11, total: 20 },
                  ].map(({ label, count, total }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground/70">{label}</span>
                        <span className="font-medium text-foreground">
                          {count}/{total}
                        </span>
                      </div>
                      <Progress
                        value={(count / total) * 100}
                        className="h-1.5"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "demo-bookings":
        return (
          <div>
            <SectionHeader
              title="Demo Bookings"
              description={`${bookings.length} bookings received`}
            />
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Medium</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.bookingId.toString()}>
                      <TableCell className="font-medium">
                        {b.studentName}
                      </TableCell>
                      <TableCell>{b.parentName}</TableCell>
                      <TableCell>{b.classLevel}</TableCell>
                      <TableCell>{b.mobile}</TableCell>
                      <TableCell>{b.cityVillage}</TableCell>
                      <TableCell>{b.medium}</TableCell>
                      <TableCell>
                        <StatusBadge status={b.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "students":
        return (
          <div>
            <SectionHeader
              title="All Students"
              description={`${SAMPLE_STUDENTS.length} students registered`}
            />
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Syllabus</TableHead>
                    <TableHead>Medium</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_STUDENTS.map((s) => (
                    <TableRow key={s.studentId.toString()}>
                      <TableCell className="font-mono text-xs">
                        #{s.studentId.toString()}
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.classLevel}</TableCell>
                      <TableCell>{s.syllabus}</TableCell>
                      <TableCell>{s.medium}</TableCell>
                      <TableCell>Plan {s.enrolledPlanId.toString()}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={s.isActive ? "Active" : "Inactive"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "attendance":
        return (
          <div>
            <SectionHeader
              title="Attendance Overview"
              description="Student attendance records"
            />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Present Today"
                value="28"
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Absent Today"
                value="4"
                icon="❌"
                color="oklch(0.577 0.245 27)"
              />
              <StatsCard
                title="Avg Attendance"
                value="87%"
                icon="📊"
                color="oklch(0.45 0.18 262)"
              />
            </div>
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record ID</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Teacher ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_ATTENDANCE.map((a) => (
                    <TableRow key={a.recordId.toString()}>
                      <TableCell className="font-mono text-xs">
                        #{a.recordId.toString()}
                      </TableCell>
                      <TableCell>Student #{a.studentId.toString()}</TableCell>
                      <TableCell>{a.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={a.status} />
                      </TableCell>
                      <TableCell>Teacher #{a.teacherId.toString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "payments":
        return (
          <div>
            <SectionHeader
              title="Payment Records"
              description="All payment transactions"
            />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Total Revenue"
                value="₹48,500"
                icon="💰"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Paid"
                value={`₹${SAMPLE_PAYMENTS.filter((p) => p.status === "Paid")
                  .reduce((a, p) => a + Number(p.amount) / 100, 0)
                  .toFixed(0)}`}
                icon="✅"
                color="oklch(0.45 0.18 262)"
              />
              <StatsCard
                title="Pending"
                value={`${SAMPLE_PAYMENTS.filter((p) => p.status === "Pending").length}`}
                icon="⏳"
                color="oklch(0.68 0.19 50)"
              />
            </div>
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_PAYMENTS.map((p) => (
                    <TableRow key={p.paymentId.toString()}>
                      <TableCell className="font-mono text-xs">
                        #{p.paymentId.toString()}
                      </TableCell>
                      <TableCell>Student #{p.studentId.toString()}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{(Number(p.amount) / 100).toFixed(0)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        Order-{p.paymentId.toString().padStart(4, "0")}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "referrals":
        return (
          <div>
            <SectionHeader
              title="Referral Tracking"
              description="Field executive referrals and commissions"
            />
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatsCard
                title="Total Referrals"
                value={SAMPLE_REFERRALS.length}
                icon="🔗"
                color="oklch(0.62 0.2 320)"
              />
              <StatsCard
                title="Paid Commission"
                value={`₹${SAMPLE_REFERRALS.filter((r) => r.isPaid).reduce((a, r) => a + Number(r.commissionAmount), 0)}`}
                icon="💸"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Pending Commission"
                value={`₹${SAMPLE_REFERRALS.filter((r) => !r.isPaid).reduce((a, r) => a + Number(r.commissionAmount), 0)}`}
                icon="⏳"
                color="oklch(0.68 0.19 50)"
              />
            </div>
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referral ID</TableHead>
                    <TableHead>Field Exec</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_REFERRALS.map((r) => (
                    <TableRow key={r.referralId.toString()}>
                      <TableCell className="font-mono text-xs">
                        #{r.referralId.toString()}
                      </TableCell>
                      <TableCell>Exec #{r.fieldExecId.toString()}</TableCell>
                      <TableCell>Student #{r.studentId.toString()}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{r.commissionAmount.toString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.isPaid ? "Paid" : "Pending"} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "certificates":
        return (
          <div>
            <SectionHeader
              title="Certificates"
              description="Issue and manage student certificates"
            />
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatsCard
                title="Total Issued"
                value="24"
                icon="🏆"
                color="oklch(0.68 0.19 50)"
              />
              <StatsCard
                title="This Month"
                value="8"
                icon="📜"
                color="oklch(0.45 0.18 262)"
              />
            </div>
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cert Number</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      certId: "1",
                      certNumber: "OFE-2025-M-001",
                      studentId: "1",
                      courseName: "Mathematics Excellence",
                      issueDate: "2025-12-15",
                    },
                    {
                      certId: "2",
                      certNumber: "OFE-2025-S-002",
                      studentId: "1",
                      courseName: "Science Achiever",
                      issueDate: "2025-12-20",
                    },
                    {
                      certId: "3",
                      certNumber: "OFE-2026-E-003",
                      studentId: "2",
                      courseName: "English Proficiency",
                      issueDate: "2026-01-10",
                    },
                    {
                      certId: "4",
                      certNumber: "OFE-2026-M-004",
                      studentId: "3",
                      courseName: "Maths Topper",
                      issueDate: "2026-01-20",
                    },
                    {
                      certId: "5",
                      certNumber: "OFE-2026-A-005",
                      studentId: "4",
                      courseName: "All-Round Excellence",
                      issueDate: "2026-02-05",
                    },
                  ].map((c) => (
                    <TableRow key={c.certId}>
                      <TableCell className="font-mono text-xs">
                        {c.certNumber}
                      </TableCell>
                      <TableCell>Student #{c.studentId}</TableCell>
                      <TableCell>{c.courseName}</TableCell>
                      <TableCell>{c.issueDate}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                        >
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "materials":
        return (
          <div>
            <SectionHeader
              title="Study Materials"
              description="All uploaded study materials"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map((m) => (
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
                  <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
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
                    <Button variant="outline" size="sm" className="text-xs h-7">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "schedule":
        return (
          <div>
            <SectionHeader
              title="Class Schedule"
              description="All scheduled live classes"
            />
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class Level</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Meeting Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_SCHEDULED_CLASSES.map((sc) => (
                    <TableRow key={sc.classId.toString()}>
                      <TableCell className="font-medium">
                        {sc.subject}
                      </TableCell>
                      <TableCell>{sc.classLevel}</TableCell>
                      <TableCell>Teacher #{sc.teacherId.toString()}</TableCell>
                      <TableCell>{sc.scheduledDate}</TableCell>
                      <TableCell>{sc.scheduledTime}</TableCell>
                      <TableCell>
                        <a
                          href={sc.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Join
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      title="Admin"
      subtitle="Admin Dashboard"
      dashboardRole="admin"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
