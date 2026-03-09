import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
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
  Calendar,
  ClipboardCheck,
  ClipboardList,
  Clock,
  CreditCard,
  IndianRupee,
  LayoutDashboard,
  Lock,
  Phone,
  PlusCircle,
  Share2,
  TrendingUp,
  Users,
  Users2,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import type {
  EnrollmentLead,
  FieldExecAccount,
  MagazineOrder,
  WithdrawalRequest,
} from "../../utils/referralStore";
import {
  approveLead,
  approveWithdrawal,
  fulfillMagazineOrder,
  getFEAccounts,
  getLeads,
  getMagazineOrders,
  getWithdrawals,
  rejectLead,
  rejectWithdrawal,
  resetAllReferralData,
  saveFEAccount,
  updateFEAccount,
  updateLead,
} from "../../utils/referralStore";

const navItems = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: "enrollment-leads",
    label: "Enrollment Leads",
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    id: "magazine-orders",
    label: "Magazine Orders",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: "fe-management",
    label: "FE Management",
    icon: <Users2 className="w-4 h-4" />,
  },
  {
    id: "withdrawals",
    label: "Withdrawals",
    icon: <Wallet className="w-4 h-4" />,
  },
  {
    id: "commission-reports",
    label: "Commission Reports",
    icon: <BarChart3 className="w-4 h-4" />,
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
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Received: "bg-blue-100 text-blue-800",
  Unpaid: "bg-gray-100 text-gray-600",
  Fulfilled: "bg-green-100 text-green-800",
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

interface NewFEForm {
  feAccountId: string;
  feCode: string;
  name: string;
  phone: string;
  upiDetails: string;
}

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const { data: demoBookings } = useGetAllDemoBookings();
  const { data: studyMaterials } = useGetAllStudyMaterials();

  // localStorage-backed state
  const [leads, setLeads] = useState<EnrollmentLead[]>([]);
  const [feAccounts, setFeAccounts] = useState<FieldExecAccount[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [magazineOrders, setMagazineOrders] = useState<MagazineOrder[]>([]);

  // FE Management
  const [showAddFE, setShowAddFE] = useState(false);
  const [newFEForm, setNewFEForm] = useState<NewFEForm>({
    feAccountId: "",
    feCode: "",
    name: "",
    phone: "",
    upiDetails: "",
  });
  const [editFEId, setEditFEId] = useState<string | null>(null);
  const [editUPI, setEditUPI] = useState("");
  const [editActive, setEditActive] = useState(true);

  const bookings =
    demoBookings && demoBookings.length > 0
      ? demoBookings
      : SAMPLE_DEMO_BOOKINGS;
  const materials =
    studyMaterials && studyMaterials.length > 0
      ? studyMaterials
      : SAMPLE_STUDY_MATERIALS;

  const [confirmReset, setConfirmReset] = useState(false);

  const refreshData = () => {
    setLeads(getLeads());
    setFeAccounts(getFEAccounts());
    setWithdrawals(getWithdrawals());
    setMagazineOrders(getMagazineOrders());
  };

  const handleResetReferrals = () => {
    resetAllReferralData();
    refreshData();
    setConfirmReset(false);
    toast.success("All referral data has been reset to zero.");
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial load only
  useEffect(() => {
    setLeads(getLeads());
    setFeAccounts(getFEAccounts());
    setWithdrawals(getWithdrawals());
    setMagazineOrders(getMagazineOrders());
  }, []);

  // ─── FE lookup helper ────────────────────────────────────────────────────────
  const getFEName = (feAccountId: string) => {
    const acc = feAccounts.find((a) => a.feAccountId === feAccountId);
    return acc ? `${acc.name} (${acc.feCode})` : "—";
  };

  // ─── Enrollment Leads Handlers ───────────────────────────────────────────────
  const handleApproveLead = (leadId: string) => {
    approveLead(leadId);
    refreshData();
    toast.success("Lead approved and commission credited!");
  };

  const handleRejectLead = (leadId: string) => {
    const note = window.prompt("Reason for rejection (optional):");
    if (note === null) return; // cancelled
    rejectLead(leadId);
    refreshData();
    toast.success("Lead rejected.");
  };

  const handleMarkPayment = (leadId: string) => {
    updateLead(leadId, { paymentStatus: "Received" });
    refreshData();
    toast.success("Payment marked as received.");
  };

  // ─── Magazine Order Handlers ─────────────────────────────────────────────────
  const handleFulfillOrder = (orderId: string) => {
    fulfillMagazineOrder(orderId);
    refreshData();
    toast.success("Magazine order fulfilled!");
  };

  // ─── Withdrawal Handlers ─────────────────────────────────────────────────────
  const handleApproveWithdrawal = (requestId: string) => {
    const note =
      window.prompt("Admin note (optional):", "Payment processed") ?? "";
    approveWithdrawal(requestId, note);
    refreshData();
    toast.success("Withdrawal approved!");
  };

  const handleRejectWithdrawal = (requestId: string) => {
    const note = window.prompt("Reason for rejection:") ?? "";
    rejectWithdrawal(requestId, note);
    refreshData();
    toast.error("Withdrawal rejected.");
  };

  // ─── FE Management Handlers ──────────────────────────────────────────────────
  const handleAddFE = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFEForm.feCode.trim() || !newFEForm.name.trim()) {
      toast.error("FE Code and Name are required.");
      return;
    }
    const existing = feAccounts.find(
      (a) => a.feAccountId === newFEForm.feAccountId.trim(),
    );
    if (existing) {
      toast.error("FE Account ID already exists.");
      return;
    }
    saveFEAccount({
      feAccountId: newFEForm.feAccountId.trim() || `FE${Date.now()}`,
      feCode: newFEForm.feCode.trim(),
      name: newFEForm.name.trim(),
      phone: newFEForm.phone.trim(),
      upiDetails: newFEForm.upiDetails.trim(),
      totalEarned: 0,
      totalWithdrawn: 0,
      enrollmentCount: 0,
      bonusEarned: 0,
      isActive: true,
      createdAt: Date.now(),
    });
    refreshData();
    setShowAddFE(false);
    setNewFEForm({
      feAccountId: "",
      feCode: "",
      name: "",
      phone: "",
      upiDetails: "",
    });
    toast.success("Field Executive added successfully!");
  };

  const startEditFE = (acc: FieldExecAccount) => {
    setEditFEId(acc.feAccountId);
    setEditUPI(acc.upiDetails);
    setEditActive(acc.isActive);
  };

  const saveEditFE = (feAccountId: string) => {
    updateFEAccount(feAccountId, { upiDetails: editUPI, isActive: editActive });
    refreshData();
    setEditFEId(null);
    toast.success("Field Executive updated.");
  };

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
                value="₹0"
                icon="💰"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Active Teachers"
                value="0"
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
                    { label: "Nursery – UKG" },
                    { label: "1st to 5th" },
                    { label: "6th to 8th" },
                    { label: "9th to 10th" },
                    { label: "11th to 12th" },
                  ].map(({ label }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground/70">{label}</span>
                        <span className="font-medium text-foreground">0/0</span>
                      </div>
                      <Progress value={0} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      // ─────────────────────────────────────────────────────────────────────────
      case "enrollment-leads": {
        const totalLeads = leads.length;
        const pendingLeads = leads.filter((l) => l.status === "Pending").length;
        const approvedLeads = leads.filter(
          (l) => l.status === "Approved",
        ).length;
        const rejectedLeads = leads.filter(
          (l) => l.status === "Rejected",
        ).length;

        return (
          <div className="space-y-6">
            <SectionHeader
              title="Student Enrollment Leads"
              description="Students enrolled via referral links or the Enroll Student form"
            />

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatsCard
                title="Total Leads"
                value={totalLeads}
                icon={<ClipboardList className="w-5 h-5" />}
                color="oklch(0.45 0.18 262)"
              />
              <StatsCard
                title="Pending"
                value={pendingLeads}
                icon="⏳"
                color="oklch(0.68 0.19 50)"
              />
              <StatsCard
                title="Approved"
                value={approvedLeads}
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Rejected"
                value={rejectedLeads}
                icon="❌"
                color="oklch(0.577 0.245 27)"
              />
            </div>

            {/* Table */}
            {leads.length === 0 ? (
              <div
                className="rounded-2xl border p-12 text-center bg-white"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="leads.empty_state"
              >
                <p className="text-foreground/60 text-sm">
                  No enrollment leads yet. Share referral links to get started.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="admin.leads.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Parent Name</TableHead>
                        <TableHead>Mobile Number</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Field Executive</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead, idx) => {
                        const isLocked =
                          lead.status === "Rejected" ||
                          (lead.status === "Approved" &&
                            lead.paymentStatus === "Received");

                        return (
                          <TableRow
                            key={lead.leadId}
                            data-ocid={`admin.leads.item.${idx + 1}`}
                          >
                            <TableCell className="font-mono text-xs text-foreground/50">
                              #{idx + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {lead.studentName}
                            </TableCell>
                            <TableCell className="text-sm text-foreground/70">
                              {lead.parentName || "—"}
                            </TableCell>
                            <TableCell className="text-sm font-mono">
                              {lead.mobile || "—"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {lead.classLevel}
                            </TableCell>
                            <TableCell>
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-semibold"
                                style={{
                                  background: "oklch(0.96 0.03 262)",
                                  color: "oklch(0.45 0.18 262)",
                                }}
                              >
                                {lead.courseSelected}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs">
                              {lead.cityVillage || "—"}
                            </TableCell>
                            <TableCell className="text-xs">
                              {getFEName(lead.feAccountId)}
                            </TableCell>
                            <TableCell className="text-xs text-foreground/60">
                              {new Date(lead.createdAt).toLocaleDateString(
                                "en-IN",
                                { day: "2-digit", month: "short" },
                              )}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={lead.status} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={lead.paymentStatus} />
                            </TableCell>
                            <TableCell className="font-semibold text-sm">
                              ₹{lead.commissionAmount}
                            </TableCell>
                            <TableCell>
                              {isLocked ? (
                                <span title="No actions available">
                                  <Lock className="w-4 h-4 text-foreground/30" />
                                </span>
                              ) : lead.status === "Pending" ? (
                                <div className="flex flex-wrap gap-1.5">
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white px-2.5"
                                    onClick={() =>
                                      handleApproveLead(lead.leadId)
                                    }
                                    data-ocid={`admin.leads.approve.primary_button.${idx + 1}`}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-7 text-xs px-2.5"
                                    onClick={() =>
                                      handleRejectLead(lead.leadId)
                                    }
                                    data-ocid={`admin.leads.reject.delete_button.${idx + 1}`}
                                  >
                                    Reject
                                  </Button>
                                  <a
                                    href={`https://wa.me/91${lead.mobile}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-ocid={`admin.leads.contact.primary_button.${idx + 1}`}
                                  >
                                    <Button
                                      size="sm"
                                      className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 gap-1"
                                    >
                                      <Phone className="w-3 h-3" />
                                      Contact
                                    </Button>
                                  </a>
                                </div>
                              ) : lead.status === "Approved" &&
                                lead.paymentStatus === "Unpaid" ? (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-orange-600 hover:bg-orange-700 text-white px-2.5"
                                  onClick={() => handleMarkPayment(lead.leadId)}
                                  data-ocid={`admin.leads.payment.primary_button.${idx + 1}`}
                                >
                                  Mark Payment Received
                                </Button>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      case "magazine-orders": {
        const totalOrders = magazineOrders.length;
        const pendingOrders = magazineOrders.filter(
          (o) => o.status === "Pending",
        ).length;
        const fulfilledOrders = magazineOrders.filter(
          (o) => o.status === "Fulfilled",
        ).length;

        return (
          <div className="space-y-6">
            <SectionHeader
              title="Magazine Orders"
              description="Pragati Study Magazine orders from field executives"
            />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <StatsCard
                title="Total Orders"
                value={totalOrders}
                icon={<BookOpen className="w-5 h-5" />}
                color="oklch(0.52 0.18 145)"
              />
              <StatsCard
                title="Pending"
                value={pendingOrders}
                icon="⏳"
                color="oklch(0.68 0.19 50)"
              />
              <StatsCard
                title="Fulfilled"
                value={fulfilledOrders}
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
            </div>

            {/* Table */}
            {magazineOrders.length === 0 ? (
              <div
                className="rounded-2xl border p-12 text-center bg-white"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="magazine.empty_state"
              >
                <p className="text-foreground/60 text-sm">
                  No magazine orders yet. Field executives can submit orders
                  from their dashboard.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="admin.magazine.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>FE Name/ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {magazineOrders.map((order, idx) => (
                        <TableRow
                          key={order.orderId}
                          data-ocid={`admin.magazine.item.${idx + 1}`}
                        >
                          <TableCell className="font-mono text-xs text-foreground/50">
                            #{idx + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.studentName}
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {order.mobile}
                          </TableCell>
                          <TableCell className="text-xs text-foreground/70 max-w-[160px] truncate">
                            {order.address}
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {order.quantity}
                          </TableCell>
                          <TableCell className="text-xs">
                            {getFEName(order.feAccountId)}
                          </TableCell>
                          <TableCell className="text-xs text-foreground/60">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              { day: "2-digit", month: "short" },
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={order.status} />
                          </TableCell>
                          <TableCell>
                            {order.status === "Pending" ? (
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white px-2.5"
                                onClick={() =>
                                  handleFulfillOrder(order.orderId)
                                }
                                data-ocid={`admin.magazine.fulfill.primary_button.${idx + 1}`}
                              >
                                Fulfill
                              </Button>
                            ) : (
                              <span title="Already fulfilled">
                                <Lock className="w-4 h-4 text-foreground/30" />
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      case "leaderboard": {
        const sortedFEs = [...feAccounts]
          .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
          .slice(0, 10);

        const rankMedal = (rank: number) => {
          if (rank === 1) return "🥇";
          if (rank === 2) return "🥈";
          if (rank === 3) return "🥉";
          return `#${rank}`;
        };

        return (
          <div className="space-y-6">
            <SectionHeader
              title="Top Field Executives This Month"
              description="Top sellers motivating the team to grow"
            />

            {sortedFEs.length === 0 ? (
              <div
                className="rounded-2xl border p-12 text-center bg-white"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="leaderboard.empty_state"
              >
                <p className="text-foreground/60 text-sm">
                  No field executives registered yet. Add FEs from FE Management
                  to see the leaderboard.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="admin.leaderboard.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>FE Code</TableHead>
                        <TableHead>Students Enrolled</TableHead>
                        <TableHead>Commission Earned</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedFEs.map((acc, idx) => {
                        const rank = idx + 1;
                        const isTopThree = rank <= 3;
                        return (
                          <TableRow
                            key={acc.feAccountId}
                            data-ocid={`admin.leaderboard.item.${idx + 1}`}
                            className={
                              isTopThree
                                ? "bg-gradient-to-r from-yellow-50/60 to-transparent"
                                : ""
                            }
                          >
                            <TableCell>
                              <span
                                className={`text-lg font-bold ${isTopThree ? "" : "font-mono text-sm text-foreground/60"}`}
                              >
                                {rankMedal(rank)}
                              </span>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {acc.name}
                            </TableCell>
                            <TableCell
                              className="font-mono font-bold text-xs"
                              style={{ color: "oklch(0.45 0.18 262)" }}
                            >
                              {acc.feCode}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">
                                  {acc.enrollmentCount}
                                </span>
                                <span className="text-xs text-foreground/50">
                                  students
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-green-700">
                              ₹{acc.totalEarned}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      case "fe-management":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <SectionHeader
                title="Field Executive Management"
                description="Add, view, and manage all field executives"
              />
              <Button
                onClick={() => setShowAddFE(!showAddFE)}
                className="gap-2 text-white font-semibold shrink-0"
                style={{ background: "oklch(0.45 0.18 262)" }}
                data-ocid="fe.add.open_modal_button"
              >
                {showAddFE ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Add Field Executive
                  </>
                )}
              </Button>
            </div>

            {/* Add FE Inline Form */}
            {showAddFE && (
              <form
                onSubmit={handleAddFE}
                className="bg-white rounded-2xl border p-6 shadow-sm space-y-4 max-w-lg"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="fe.add.panel"
              >
                <h3 className="font-bold text-foreground">
                  Add Field Executive
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="feId">FE Account ID *</Label>
                    <Input
                      id="feId"
                      value={newFEForm.feAccountId}
                      onChange={(e) =>
                        setNewFEForm((p) => ({
                          ...p,
                          feAccountId: e.target.value,
                        }))
                      }
                      placeholder="e.g. FE1002"
                      className="rounded-xl"
                      data-ocid="fe.id.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="feCode">Referral Code *</Label>
                    <Input
                      id="feCode"
                      value={newFEForm.feCode}
                      onChange={(e) =>
                        setNewFEForm((p) => ({ ...p, feCode: e.target.value }))
                      }
                      placeholder="e.g. RK2045"
                      className="rounded-xl"
                      data-ocid="fe.code.input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="feName">Name *</Label>
                    <Input
                      id="feName"
                      value={newFEForm.name}
                      onChange={(e) =>
                        setNewFEForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Full name"
                      className="rounded-xl"
                      data-ocid="fe.name.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fePhone">Phone</Label>
                    <Input
                      id="fePhone"
                      value={newFEForm.phone}
                      onChange={(e) =>
                        setNewFEForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="+91 XXXXX XXXXX"
                      type="tel"
                      className="rounded-xl"
                      data-ocid="fe.phone.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="feUpi">UPI Details</Label>
                  <Input
                    id="feUpi"
                    value={newFEForm.upiDetails}
                    onChange={(e) =>
                      setNewFEForm((p) => ({
                        ...p,
                        upiDetails: e.target.value,
                      }))
                    }
                    placeholder="UPI ID or bank account"
                    className="rounded-xl"
                    data-ocid="fe.upi.input"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full text-white font-semibold gap-2"
                  style={{ background: "oklch(0.45 0.18 262)" }}
                  data-ocid="fe.add.submit_button"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Field Executive
                </Button>
              </form>
            )}

            {/* FE Table */}
            {feAccounts.length === 0 ? (
              <div
                className="rounded-2xl border p-12 text-center bg-white"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="fe.empty_state"
              >
                <p className="text-foreground/60 text-sm">
                  No field executives yet. Add one above.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="fe.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>FE Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>UPI Details</TableHead>
                        <TableHead>Total Earned</TableHead>
                        <TableHead>Withdrawn</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Enrollments</TableHead>
                        <TableHead>Bonus</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feAccounts.map((acc, idx) => {
                        const isEditing = editFEId === acc.feAccountId;
                        const balance = acc.totalEarned - acc.totalWithdrawn;

                        return (
                          <TableRow
                            key={acc.feAccountId}
                            data-ocid={`fe.item.${idx + 1}`}
                          >
                            <TableCell
                              className="font-mono font-bold text-xs"
                              style={{ color: "oklch(0.45 0.18 262)" }}
                            >
                              {acc.feCode}
                            </TableCell>
                            <TableCell className="font-medium">
                              {acc.name}
                            </TableCell>
                            <TableCell className="text-sm">
                              {acc.phone}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={editUPI}
                                  onChange={(e) => setEditUPI(e.target.value)}
                                  className="h-7 text-xs rounded-lg w-36"
                                  data-ocid={`fe.upi.input.${idx + 1}`}
                                />
                              ) : (
                                <span className="text-xs text-foreground/70">
                                  {acc.upiDetails || "—"}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="font-semibold text-green-700">
                              ₹{acc.totalEarned}
                            </TableCell>
                            <TableCell className="text-sm">
                              ₹{acc.totalWithdrawn}
                            </TableCell>
                            <TableCell
                              className="font-semibold"
                              style={{ color: "oklch(0.45 0.18 262)" }}
                            >
                              ₹{balance}
                            </TableCell>
                            <TableCell className="text-center">
                              {acc.enrollmentCount}
                            </TableCell>
                            <TableCell className="text-center font-semibold text-orange-600">
                              ₹{acc.bonusEarned}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Switch
                                  checked={editActive}
                                  onCheckedChange={setEditActive}
                                  data-ocid={`fe.active.switch.${idx + 1}`}
                                />
                              ) : (
                                <StatusBadge
                                  status={acc.isActive ? "Active" : "Inactive"}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <div className="flex gap-1.5">
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs bg-green-600 text-white px-2.5"
                                    onClick={() => saveEditFE(acc.feAccountId)}
                                    data-ocid={`fe.save.save_button.${idx + 1}`}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs px-2.5"
                                    onClick={() => setEditFEId(null)}
                                    data-ocid={`fe.cancel.cancel_button.${idx + 1}`}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => startEditFE(acc)}
                                  data-ocid={`fe.edit.edit_button.${idx + 1}`}
                                >
                                  Edit
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        );

      // ─────────────────────────────────────────────────────────────────────────
      case "withdrawals": {
        const pendingW = withdrawals.filter((w) => w.status === "Pending");
        const approvedW = withdrawals.filter((w) => w.status === "Approved");
        const totalApprovedAmount = approvedW.reduce((s, w) => s + w.amount, 0);

        return (
          <div className="space-y-6">
            <SectionHeader
              title="Withdrawal Requests"
              description="Manage field executive payout requests"
            />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <StatsCard
                title="Pending"
                value={pendingW.length}
                icon={<Wallet className="w-5 h-5" />}
                color="oklch(0.68 0.19 50)"
              />
              <StatsCard
                title="Approved"
                value={approvedW.length}
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Total Approved"
                value={`₹${totalApprovedAmount}`}
                icon={<IndianRupee className="w-5 h-5" />}
                color="oklch(0.45 0.18 262)"
              />
            </div>

            {/* Table */}
            {withdrawals.length === 0 ? (
              <div
                className="rounded-2xl border p-12 text-center bg-white"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="withdrawals.empty_state"
              >
                <p className="text-foreground/60 text-sm">
                  No withdrawal requests yet.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="withdrawals.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>FE Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>UPI Details</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Admin Note</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawals.map((w, idx) => (
                        <TableRow
                          key={w.requestId}
                          data-ocid={`withdrawals.item.${idx + 1}`}
                        >
                          <TableCell className="font-mono text-xs text-foreground/50">
                            {w.requestId}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {getFEName(w.feAccountId)}
                          </TableCell>
                          <TableCell className="font-bold">
                            ₹{w.amount}
                          </TableCell>
                          <TableCell className="text-xs text-foreground/70 max-w-[160px] truncate">
                            {w.upiDetails}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={w.status} />
                          </TableCell>
                          <TableCell className="text-xs text-foreground/50">
                            {new Date(w.createdAt).toLocaleDateString("en-IN")}
                          </TableCell>
                          <TableCell className="text-xs text-foreground/60">
                            {w.adminNote || "—"}
                          </TableCell>
                          <TableCell>
                            {w.status === "Pending" ? (
                              <div className="flex gap-1.5">
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white px-2.5"
                                  onClick={() =>
                                    handleApproveWithdrawal(w.requestId)
                                  }
                                  data-ocid={`withdrawals.approve.primary_button.${idx + 1}`}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-7 text-xs px-2.5"
                                  onClick={() =>
                                    handleRejectWithdrawal(w.requestId)
                                  }
                                  data-ocid={`withdrawals.reject.delete_button.${idx + 1}`}
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span title="Already processed">
                                <Lock className="w-4 h-4 text-foreground/30" />
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      case "commission-reports": {
        // Per-FE summary
        const summaryMap: Record<
          string,
          {
            feCode: string;
            feName: string;
            totalReferrals: number;
            approvedEnrollments: number;
            commissionEarned: number;
            bonusEarned: number;
            totalPaidOut: number;
            balanceOwed: number;
          }
        > = {};

        for (const acc of feAccounts) {
          summaryMap[acc.feAccountId] = {
            feCode: acc.feCode,
            feName: acc.name,
            totalReferrals: 0,
            approvedEnrollments: acc.enrollmentCount,
            commissionEarned: acc.totalEarned,
            bonusEarned: acc.bonusEarned,
            totalPaidOut: acc.totalWithdrawn,
            balanceOwed: acc.totalEarned - acc.totalWithdrawn,
          };
        }

        // Count referrals per FE from leads
        for (const lead of leads) {
          if (summaryMap[lead.feAccountId]) {
            summaryMap[lead.feAccountId].totalReferrals += 1;
          }
        }

        const summaryRows = Object.values(summaryMap);

        const grandTotals = summaryRows.reduce(
          (acc, row) => ({
            totalReferrals: acc.totalReferrals + row.totalReferrals,
            approvedEnrollments:
              acc.approvedEnrollments + row.approvedEnrollments,
            commissionEarned: acc.commissionEarned + row.commissionEarned,
            bonusEarned: acc.bonusEarned + row.bonusEarned,
            totalPaidOut: acc.totalPaidOut + row.totalPaidOut,
            balanceOwed: acc.balanceOwed + row.balanceOwed,
          }),
          {
            totalReferrals: 0,
            approvedEnrollments: 0,
            commissionEarned: 0,
            bonusEarned: 0,
            totalPaidOut: 0,
            balanceOwed: 0,
          },
        );

        return (
          <div className="space-y-6">
            <SectionHeader
              title="Commission Reports"
              description="Per-FE earnings summary and balance overview"
            />

            {summaryRows.length === 0 ? (
              <div
                className="rounded-2xl border p-12 text-center bg-white"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="reports.empty_state"
              >
                <p className="text-foreground/60 text-sm">
                  No field executives found. Add FEs to see commission reports.
                </p>
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid="reports.table"
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>FE Code</TableHead>
                        <TableHead>FE Name</TableHead>
                        <TableHead>Total Referrals</TableHead>
                        <TableHead>Approved Enrollments</TableHead>
                        <TableHead>Commission Earned</TableHead>
                        <TableHead>Bonus Earned</TableHead>
                        <TableHead>Total Paid Out</TableHead>
                        <TableHead>Balance Owed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summaryRows.map((row, idx) => (
                        <TableRow
                          key={row.feCode}
                          data-ocid={`reports.item.${idx + 1}`}
                        >
                          <TableCell
                            className="font-mono font-bold text-xs"
                            style={{ color: "oklch(0.45 0.18 262)" }}
                          >
                            {row.feCode}
                          </TableCell>
                          <TableCell className="font-medium">
                            {row.feName}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.totalReferrals}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.approvedEnrollments}
                          </TableCell>
                          <TableCell className="font-semibold text-green-700">
                            ₹{row.commissionEarned}
                          </TableCell>
                          <TableCell className="font-semibold text-orange-600">
                            ₹{row.bonusEarned}
                          </TableCell>
                          <TableCell className="text-sm">
                            ₹{row.totalPaidOut}
                          </TableCell>
                          <TableCell
                            className="font-bold"
                            style={{ color: "oklch(0.45 0.18 262)" }}
                          >
                            ₹{row.balanceOwed}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Grand Totals Row */}
                      <TableRow
                        className="font-bold"
                        style={{ background: "oklch(0.97 0.03 262)" }}
                      >
                        <TableCell colSpan={2} className="font-extrabold">
                          Grand Total
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {grandTotals.totalReferrals}
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {grandTotals.approvedEnrollments}
                        </TableCell>
                        <TableCell className="font-extrabold text-green-700">
                          ₹{grandTotals.commissionEarned}
                        </TableCell>
                        <TableCell className="font-extrabold text-orange-600">
                          ₹{grandTotals.bonusEarned}
                        </TableCell>
                        <TableCell className="font-bold">
                          ₹{grandTotals.totalPaidOut}
                        </TableCell>
                        <TableCell
                          className="font-extrabold"
                          style={{ color: "oklch(0.45 0.18 262)" }}
                        >
                          ₹{grandTotals.balanceOwed}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
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
                value="0"
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Absent Today"
                value="0"
                icon="❌"
                color="oklch(0.577 0.245 27)"
              />
              <StatsCard
                title="Avg Attendance"
                value="0%"
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
                value="₹0"
                icon="💰"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Paid"
                value="₹0"
                icon="✅"
                color="oklch(0.45 0.18 262)"
              />
              <StatsCard
                title="Pending"
                value="0"
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
            <div className="flex items-center justify-between mb-4">
              <SectionHeader
                title="Referral Tracking"
                description="Field executive referrals and commissions"
              />
              <div className="flex gap-2 items-center">
                {confirmReset ? (
                  <>
                    <span className="text-sm text-red-600 font-medium">
                      Are you sure? This cannot be undone.
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      data-ocid="referrals.confirm_button"
                      onClick={handleResetReferrals}
                    >
                      Yes, Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-ocid="referrals.cancel_button"
                      onClick={() => setConfirmReset(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    data-ocid="referrals.delete_button"
                    onClick={() => setConfirmReset(true)}
                  >
                    Reset All Referral Data
                  </Button>
                )}
              </div>
            </div>
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
                value="0"
                icon="🏆"
                color="oklch(0.68 0.19 50)"
              />
              <StatsCard
                title="This Month"
                value="0"
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
                  {(
                    [] as {
                      certId: string;
                      certNumber: string;
                      studentId: string;
                      courseName: string;
                      issueDate: string;
                    }[]
                  ).map((c) => (
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
