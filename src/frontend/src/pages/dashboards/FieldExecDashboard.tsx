import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  BookOpen,
  CalendarCheck,
  Check,
  CheckSquare,
  ClipboardList,
  Copy,
  GraduationCap,
  IndianRupee,
  LayoutDashboard,
  Loader2,
  MapPin,
  MessageCircle,
  Send,
  Share2,
  Star,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FEAnalyticsSection } from "../../components/analytics/FEAnalyticsSection";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { SectionHeader } from "../../components/dashboard/SectionHeader";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { useActor } from "../../hooks/useActor";
import {
  useCreateDemoBooking,
  useCreateReferral,
} from "../../hooks/useQueries";
import type {
  EnrollmentLead,
  FieldExecAccount,
  MagazineOrder,
  WithdrawalRequest,
} from "../../utils/referralStore";
import {
  BONUS_PER_10,
  COMMISSION_MAP,
  ensureDefaultFEAccount,
  getFEAccounts,
  getFEByCode,
  getLeads,
  getWithdrawals,
  saveLead,
  saveMagazineOrder,
  saveWithdrawal,
} from "../../utils/referralStore";

// ─── Constants ────────────────────────────────────────────────────────────────
const FIELD_EXEC_ID = BigInt(1);
const REFERRAL_CODE = "AK1023";
const REFERRAL_LINK = `openframeeducation.com/enroll?ref=${REFERRAL_CODE}`;
const WHATSAPP_NUMBER = "917996401388";

const PLAN_COMMISSION: Record<number, number> = {
  1: 50,
  2: 100,
  3: 150,
};

// ─── Nav Items ────────────────────────────────────────────────────────────────
const navItems = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: "commission-plan",
    label: "Commission Plan",
    icon: <IndianRupee className="w-4 h-4" />,
  },
  {
    id: "pragati-magazine",
    label: "Pragati Magazine",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: "course-programs",
    label: "Course Programs",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  {
    id: "enroll-student",
    label: "Enroll Student",
    icon: <UserPlus className="w-4 h-4" />,
  },
  {
    id: "my-leads",
    label: "My Leads",
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    id: "share-link",
    label: "Share Link",
    icon: <Share2 className="w-4 h-4" />,
  },
  {
    id: "my-referrals",
    label: "My Referrals",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: "withdraw",
    label: "Withdraw",
    icon: <Wallet className="w-4 h-4" />,
  },
  {
    id: "visit-log",
    label: "Visit Log",
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    id: "tasks",
    label: "Daily Tasks",
    icon: <CheckSquare className="w-4 h-4" />,
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: <CalendarCheck className="w-4 h-4" />,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="w-4 h-4" />,
  },
];

// ─── Course Data ──────────────────────────────────────────────────────────────
const COURSES = [
  {
    label: "Nursery – UKG",
    subjects: ["EVS", "English", "Maths", "Drawing"],
    color: "oklch(0.55 0.16 165)",
    badge: "Early Learning",
  },
  {
    label: "1st to 5th",
    subjects: ["English", "Maths", "Science", "Social", "Kannada"],
    color: "oklch(0.45 0.18 262)",
    badge: "Primary",
  },
  {
    label: "6th to 8th",
    subjects: ["English", "Maths", "Science", "Social", "Kannada", "Hindi"],
    color: "oklch(0.68 0.19 50)",
    badge: "Middle School",
  },
  {
    label: "9th to 10th",
    subjects: ["English", "Maths", "Science", "Social", "Kannada", "Hindi"],
    color: "oklch(0.6 0.22 15)",
    badge: "Secondary",
  },
  {
    label: "11th to 12th",
    subjects: ["Physics", "Chemistry", "Maths/Biology", "Commerce", "Arts"],
    color: "oklch(0.62 0.2 320)",
    badge: "Senior Secondary",
  },
];

// ─── Referral Row type ────────────────────────────────────────────────────────
interface LocalReferral {
  id: string;
  studentName: string;
  classLevel: string;
  plan: string;
  commission: number;
  mobile: string;
  cityVillage: string;
  isPaid: boolean;
  createdAt: number;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function FieldExecDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [linkCopied, setLinkCopied] = useState(false);
  const [localReferrals, setLocalReferrals] = useState<LocalReferral[]>([]);
  const [gpsCheckIns, setGpsCheckIns] = useState<
    Array<{
      id: string;
      time: string;
      lat: number;
      lng: number;
      date: string;
      purpose: string;
      leadName: string;
    }>
  >(() => {
    try {
      const saved = localStorage.getItem("FE_GPS_CHECKINS");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [visitForm, setVisitForm] = useState({
    leadName: "",
    purpose: "Student follow-up",
  });
  const [tasks, setTasks] = useState<
    Array<{
      id: string;
      title: string;
      status: "pending" | "done";
      date: string;
    }>
  >(() => {
    try {
      const s = localStorage.getItem("FE_TASKS");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [taskInput, setTaskInput] = useState("");
  const [feAttendance, setFeAttendance] = useState<
    Array<{ date: string; status: "Present" | "Absent" | "Half Day" }>
  >(() => {
    try {
      const s = localStorage.getItem("FE_ATTENDANCE");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  // localStorage-based state
  const [feAccount, setFeAccount] = useState<FieldExecAccount | null>(null);
  const [myLeads, setMyLeads] = useState<EnrollmentLead[]>([]);
  const [myWithdrawals, setMyWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [allFEAccounts, setAllFEAccounts] = useState<FieldExecAccount[]>([]);

  const [referralForm, setReferralForm] = useState({
    studentName: "",
    parentName: "",
    classLevel: "",
    planId: "2",
    mobile: "",
    cityVillage: "",
  });

  // Magazine order form
  const [magazineForm, setMagazineForm] = useState({
    studentName: "",
    mobile: "",
    address: "",
    quantity: "1",
  });

  // Withdraw form
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    upiDetails: "",
  });

  const createReferral = useCreateReferral();
  const createDemoBooking = useCreateDemoBooking();
  const { actor } = useActor();
  const pendingBackendSync = useRef<EnrollmentLead[]>([]);
  const pendingGpsSync = useRef<
    Array<{
      checkInId: bigint;
      feId: string;
      feName: string;
      time: string;
      date: string;
      lat: number;
      lng: number;
      purpose: string;
      leadName: string;
      createdAt: bigint;
    }>
  >([]);

  // ─── Init FE account & load data ──────────────────────────────────────────
  useEffect(() => {
    const acc = ensureDefaultFEAccount();
    setFeAccount(acc);
    refreshData(acc);
    setAllFEAccounts(getFEAccounts());
  }, []);

  // ─── Flush pending enrollments to backend when actor becomes available ─────
  useEffect(() => {
    if (!actor || pendingBackendSync.current.length === 0) return;
    const flush = async () => {
      const pending = [...pendingBackendSync.current];
      pendingBackendSync.current = [];
      for (const pendingLead of pending) {
        try {
          await actor.createDemoBooking({
            bookingId: BigInt(Date.now() + Math.floor(Math.random() * 1000)),
            studentName: pendingLead.studentName,
            parentName: pendingLead.parentName,
            mobile: pendingLead.mobile,
            classLevel: pendingLead.classLevel,
            cityVillage: pendingLead.cityVillage,
            medium: pendingLead.courseSelected || "State",
            status: "New",
            createdAt: BigInt(pendingLead.createdAt),
          });
        } catch {
          pendingBackendSync.current.push(pendingLead);
        }
      }
    };
    flush();
  }, [actor]);

  // ─── Flush pending GPS check-ins to backend when actor becomes available ───
  useEffect(() => {
    if (!actor || pendingGpsSync.current.length === 0) return;
    const flush = async () => {
      const pending = [...pendingGpsSync.current];
      pendingGpsSync.current = [];
      for (const item of pending) {
        try {
          await (actor as any).createGpsCheckIn(item);
        } catch {
          pendingGpsSync.current.push(item);
        }
      }
    };
    flush();
  }, [actor]);

  const refreshData = (acc?: FieldExecAccount) => {
    const currentAcc = acc ?? getFEByCode(REFERRAL_CODE);
    if (currentAcc) setFeAccount({ ...currentAcc });

    const allLeads = getLeads();
    const filtered = allLeads.filter((l) => l.referralCode === REFERRAL_CODE);
    setMyLeads(filtered);

    const allWithdrawals = getWithdrawals();
    const myW = allWithdrawals.filter(
      (w) => w.feAccountId === (currentAcc?.feAccountId ?? "FE1001"),
    );
    setMyWithdrawals(myW);

    setAllFEAccounts(getFEAccounts());
  };

  // ─── Derived stats from localStorage account ──────────────────────────────
  const availableBalance =
    (feAccount?.totalEarned ?? 0) - (feAccount?.totalWithdrawn ?? 0);
  const enrolledCount = feAccount?.enrollmentCount ?? 0;
  const bonusEarned = feAccount?.bonusEarned ?? 0;
  const totalEarned = feAccount?.totalEarned ?? 0;

  // Legacy local referrals (kept for existing UX)
  const magazineSales = localReferrals.filter(
    (r) => r.plan === "Pragati Magazine",
  ).length;
  const bonusProgress = enrolledCount % 10;
  const bonusProgressPct = (bonusProgress / 10) * 100;

  const planLabel = (planId: string) => {
    if (planId === "1") return "Basic";
    if (planId === "3") return "Premium";
    return "Standard";
  };

  // ─── Handle Enroll Student ──────────────────────────────────────────────────
  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const commission = PLAN_COMMISSION[Number(referralForm.planId)] ?? 100;
    const plan = planLabel(referralForm.planId);

    try {
      await createReferral.mutateAsync({
        referralId: BigInt(Date.now()),
        fieldExecId: FIELD_EXEC_ID,
        studentId: BigInt(Date.now()),
        commissionAmount: BigInt(commission),
        isPaid: false,
        createdAt: BigInt(Date.now()),
      });
    } catch {
      // silently proceed — backend may not be live
    }

    // Also save to localStorage as EnrollmentLead
    const acc = getFEByCode(REFERRAL_CODE);
    const lead: EnrollmentLead = {
      leadId: `L${Date.now()}`,
      studentName: referralForm.studentName.trim(),
      parentName: referralForm.parentName.trim(),
      mobile: referralForm.mobile.trim(),
      classLevel: referralForm.classLevel,
      courseSelected: plan,
      cityVillage: referralForm.cityVillage.trim(),
      referralCode: REFERRAL_CODE,
      feAccountId: acc?.feAccountId ?? "FE1001",
      status: "Pending",
      paymentStatus: "Unpaid",
      commissionAmount: commission,
      commissionPaid: false,
      createdAt: Date.now(),
    };
    saveLead(lead);
    // Save to backend for cross-device sync using proper mutation hook
    try {
      await createDemoBooking.mutateAsync({
        bookingId: BigInt(Date.now()),
        studentName: lead.studentName,
        parentName: lead.parentName,
        mobile: lead.mobile,
        classLevel: lead.classLevel,
        cityVillage: lead.cityVillage,
        medium: lead.courseSelected || "State",
        status: "New",
        createdAt: BigInt(lead.createdAt),
      });
    } catch {
      // Queue for retry when actor becomes available
      pendingBackendSync.current.push(lead);
    }
    refreshData();

    const newReferral: LocalReferral = {
      id: Date.now().toString(),
      studentName: referralForm.studentName,
      classLevel: referralForm.classLevel,
      plan,
      commission,
      mobile: referralForm.mobile,
      cityVillage: referralForm.cityVillage,
      isPaid: false,
      createdAt: Date.now(),
    };

    setLocalReferrals((prev) => [...prev, newReferral]);

    toast.success(
      `Student enrolled! You'll earn ₹${commission} commission (${plan} Plan).`,
    );

    setReferralForm({
      studentName: "",
      parentName: "",
      classLevel: "",
      planId: "2",
      mobile: "",
      cityVillage: "",
    });
  };

  // ─── Handle Magazine Order ──────────────────────────────────────────────────
  const handleMagazineOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const { studentName, mobile, address, quantity } = magazineForm;
    if (!studentName.trim() || !mobile.trim() || !address.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const acc = getFEByCode(REFERRAL_CODE);
    const order: MagazineOrder = {
      orderId: `MO${Date.now()}`,
      studentName: studentName.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      quantity: Number(quantity) || 1,
      feAccountId: acc?.feAccountId ?? "FE1001",
      referralCode: REFERRAL_CODE,
      status: "Pending",
      createdAt: Date.now(),
    };

    saveMagazineOrder(order);
    toast.success("Magazine order submitted successfully!");
    setMagazineForm({
      studentName: "",
      mobile: "",
      address: "",
      quantity: "1",
    });
  };

  // ─── Handle Withdraw ────────────────────────────────────────────────────────
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawForm.amount);

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (amount > availableBalance) {
      toast.error(`Maximum withdrawable amount is ₹${availableBalance}.`);
      return;
    }
    if (!withdrawForm.upiDetails.trim()) {
      toast.error("Please enter your UPI ID / Bank Details.");
      return;
    }

    const acc = getFEByCode(REFERRAL_CODE);
    const request: WithdrawalRequest = {
      requestId: `W${Date.now()}`,
      feAccountId: acc?.feAccountId ?? "FE1001",
      amount,
      upiDetails: withdrawForm.upiDetails.trim(),
      status: "Pending",
      adminNote: "",
      createdAt: Date.now(),
    };

    saveWithdrawal(request);
    refreshData();
    setWithdrawForm({ amount: "", upiDetails: "" });
    toast.success("Withdrawal request submitted! Admin will process it soon.");
  };

  // ─── Copy Link ──────────────────────────────────────────────────────────────
  const handleCopyLink = () => {
    navigator.clipboard.writeText(REFERRAL_LINK).catch(() => {});
    setLinkCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const classLevels = [
    "Nursery",
    "UKG",
    "LKG",
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

  // ─── Section Renders ────────────────────────────────────────────────────────
  const renderOverview = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Referral Earnings Program"
        description="Your dashboard for tracking commissions, promoting courses and Pragati Study Magazine"
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatsCard
          title="Total Referrals"
          value={myLeads.length + localReferrals.length}
          icon={<Share2 className="w-5 h-5" />}
          color="oklch(0.45 0.18 262)"
          data-ocid="overview.referrals.card"
        />
        <StatsCard
          title="Students Enrolled"
          value={myLeads.filter((l) => l.status === "Approved").length}
          icon={<Check className="w-5 h-5" />}
          color="oklch(0.55 0.16 165)"
          data-ocid="overview.enrolled.card"
        />
        <StatsCard
          title="Magazine Sales"
          value={magazineSales}
          icon={<BookOpen className="w-5 h-5" />}
          color="oklch(0.52 0.18 145)"
          data-ocid="overview.magazine.card"
        />
        <StatsCard
          title="Commission Earned"
          value={`₹${totalEarned}`}
          icon={<IndianRupee className="w-5 h-5" />}
          color="oklch(0.68 0.19 50)"
          data-ocid="overview.earnings.card"
        />
        <StatsCard
          title="Bonus Earned"
          value={`₹${bonusEarned}`}
          icon={<Star className="w-5 h-5" />}
          color="oklch(0.62 0.2 320)"
          data-ocid="overview.bonus.card"
        />
      </div>

      {/* GPS Quick Check-In */}
      <div
        className="rounded-2xl border p-4 flex items-center justify-between gap-4"
        style={{
          background: "oklch(0.15 0.06 265)",
          borderColor: "oklch(0.3 0.06 265)",
        }}
      >
        <div className="flex items-center gap-3">
          <MapPin
            className="w-6 h-6"
            style={{ color: "oklch(0.65 0.18 165)" }}
          />
          <div>
            <p className="font-semibold text-white text-sm">GPS Check-In</p>
            <p className="text-xs" style={{ color: "oklch(0.65 0.03 265)" }}>
              {
                gpsCheckIns.filter(
                  (c) => c.date === new Date().toISOString().slice(0, 10),
                ).length
              }{" "}
              check-ins today
            </p>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{
            background: gpsLoading
              ? "oklch(0.4 0.08 265)"
              : "oklch(0.55 0.16 165)",
          }}
          onClick={() => handleGpsCheckIn("", "Area survey")}
          disabled={gpsLoading}
          data-ocid="overview.button"
        >
          {gpsLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Locating...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" /> Check In
            </>
          )}
        </button>
      </div>

      {/* Commission Plan Cards */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
          <IndianRupee
            className="w-4 h-4"
            style={{ color: "oklch(0.45 0.18 262)" }}
          />
          Commission Plan
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Basic Plan",
              amount: 50,
              color: "oklch(0.45 0.18 262)",
              bg: "oklch(0.96 0.03 262)",
            },
            {
              label: "Standard Plan",
              amount: 100,
              color: "oklch(0.68 0.19 50)",
              bg: "oklch(0.97 0.04 50)",
            },
            {
              label: "Premium Plan",
              amount: 150,
              color: "oklch(0.55 0.16 165)",
              bg: "oklch(0.96 0.04 165)",
            },
          ].map(({ label, amount, color, bg }) => (
            <div
              key={label}
              className="rounded-2xl p-5 border text-center shadow-sm"
              style={{ background: bg, borderColor: `${color}40` }}
            >
              <p className="text-sm font-semibold text-foreground/70 mb-1">
                {label} Referral
              </p>
              <p className="text-3xl font-extrabold mb-0.5" style={{ color }}>
                ₹{amount}
              </p>
              <p className="text-xs text-foreground/50">per student enrolled</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus System Card */}
      <div
        className="rounded-2xl border p-5 shadow-sm"
        style={{
          background: "oklch(0.97 0.03 50)",
          borderColor: "oklch(0.68 0.19 50 / 0.4)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5" style={{ color: "oklch(0.68 0.19 50)" }} />
          <h3 className="font-bold text-foreground">Bonus System</h3>
        </div>
        <p className="text-sm text-foreground/70 mb-4">
          For every <strong>10 enrollments</strong> you complete, earn a{" "}
          <strong style={{ color: "oklch(0.68 0.19 50)" }}>₹100 bonus</strong>!
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-foreground/60">
            <span>Bonus Progress</span>
            <span>
              {bonusProgress}/10 enrollments — ₹{bonusEarned} / ₹
              {bonusEarned + BONUS_PER_10}
            </span>
          </div>
          <Progress
            value={bonusProgressPct}
            className="h-3"
            data-ocid="overview.bonus.loading_state"
          />
          <p className="text-xs text-foreground/50">
            {10 - bonusProgress} more enrollment
            {10 - bonusProgress !== 1 ? "s" : ""} to unlock next ₹100 bonus
          </p>
        </div>
      </div>

      {/* CTA Banner */}
      <div
        className="rounded-2xl p-6 text-white shadow-md"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.45 0.18 262), oklch(0.55 0.22 280))",
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">
              Start Earning with Openframe Education
            </h3>
            <p className="text-sm text-white/80">
              Promote courses and study materials and earn commissions while
              helping students learn.
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=I%20want%20to%20join%20as%20a%20Field%20Executive%20for%20Openframe%20Education`}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="overview.cta.primary_button"
          >
            <Button className="bg-white text-foreground hover:bg-white/90 font-semibold shrink-0 gap-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              WhatsApp 7996401388
            </Button>
          </a>
        </div>
      </div>
    </div>
  );

  const renderCommissionPlan = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Commission Plan"
        description="Detailed earnings for every plan you promote"
      />

      {/* Tier Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            label: "Basic Plan Referral",
            amount: "₹50",
            per: "per student",
            icon: "🥉",
            color: "oklch(0.45 0.18 262)",
            bg: "oklch(0.96 0.03 262)",
          },
          {
            label: "Standard Plan Referral",
            amount: "₹100",
            per: "per student",
            icon: "🥈",
            color: "oklch(0.68 0.19 50)",
            bg: "oklch(0.97 0.04 50)",
          },
          {
            label: "Premium Plan Referral",
            amount: "₹150",
            per: "per student",
            icon: "🥇",
            color: "oklch(0.55 0.16 165)",
            bg: "oklch(0.96 0.04 165)",
          },
          {
            label: "Pragati Study Magazine",
            amount: "₹50",
            per: "per sale",
            icon: "📖",
            color: "oklch(0.52 0.18 145)",
            bg: "oklch(0.96 0.04 145)",
          },
        ].map(({ label, amount, per, icon, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl border p-6 flex items-center gap-5 shadow-sm"
            style={{ background: bg, borderColor: `${color}50` }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm"
              style={{ background: `${color}20` }}
            >
              {icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground/70">
                {label}
              </p>
              <p
                className="text-3xl font-extrabold leading-none mt-1"
                style={{ color }}
              >
                {amount}
              </p>
              <p className="text-xs text-foreground/50 mt-0.5">{per}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bonus System */}
      <div
        className="rounded-2xl border p-6 shadow-sm"
        style={{
          background: "oklch(0.97 0.03 50)",
          borderColor: "oklch(0.68 0.19 50 / 0.4)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp
            className="w-5 h-5"
            style={{ color: "oklch(0.68 0.19 50)" }}
          />
          <h3 className="font-bold text-foreground text-lg">Bonus System</h3>
        </div>
        <div
          className="flex items-center gap-3 p-4 rounded-xl mb-5 text-sm font-medium"
          style={{
            background: "oklch(0.68 0.19 50 / 0.15)",
            color: "oklch(0.45 0.18 50)",
          }}
        >
          <Star className="w-4 h-4 shrink-0" />
          For every <strong>10 enrollments</strong> → ₹100 Bonus
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground/70">Bonus Earned</span>
            <span
              className="font-bold"
              style={{ color: "oklch(0.68 0.19 50)" }}
            >
              ₹{bonusEarned} / ₹{bonusEarned + BONUS_PER_10}
            </span>
          </div>
          <Progress
            value={bonusProgressPct}
            className="h-4"
            data-ocid="commission.bonus.loading_state"
          />
          <div className="flex justify-between text-xs text-foreground/50">
            <span>{bonusProgress} / 10 enrollments this cycle</span>
            <span>{10 - bonusProgress} to go</span>
          </div>
        </div>
      </div>

      {/* Magazine Breakdown */}
      <div
        className="rounded-2xl border overflow-hidden shadow-sm"
        style={{ borderColor: "oklch(0.52 0.18 145 / 0.5)" }}
      >
        <div
          className="px-6 py-3 text-white text-sm font-semibold flex items-center gap-2"
          style={{ background: "oklch(0.52 0.18 145)" }}
        >
          <BookOpen className="w-4 h-4" />
          Pragati Study Magazine – Commission Breakdown
        </div>
        <div className="bg-white p-5 space-y-3">
          {[
            {
              label: "Magazine Price",
              value: "₹200",
              color: "oklch(0.45 0.18 262)",
              bg: "oklch(0.96 0.03 262)",
            },
            {
              label: "Your Commission",
              value: "₹50 per sale",
              color: "oklch(0.52 0.18 145)",
              bg: "oklch(0.96 0.04 145)",
            },
            {
              label: "Company Revenue",
              value: "₹150 per sale",
              color: "oklch(0.68 0.19 50)",
              bg: "oklch(0.97 0.04 50)",
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl"
              style={{ background: bg }}
            >
              <span className="text-sm font-medium text-foreground/70">
                {label}
              </span>
              <span className="text-base font-bold" style={{ color }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPragatiMagazine = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Pragati Study Magazine Promotion"
        description="Promote the magazine and earn ₹50 commission per sale"
      />

      {/* Hero Card */}
      <div
        className="rounded-2xl border p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start"
        style={{
          background: "oklch(0.96 0.04 145)",
          borderColor: "oklch(0.52 0.18 145 / 0.4)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
          style={{ background: "oklch(0.52 0.18 145 / 0.2)" }}
        >
          📚
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-extrabold text-foreground mb-1">
            Pragati Study Magazine
          </h3>
          <p className="text-sm text-foreground/60 mb-3">
            Affordable Learning for Every Student
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <div
              className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{
                background: "oklch(0.45 0.18 262 / 0.15)",
                color: "oklch(0.45 0.18 262)",
              }}
            >
              Price: ₹200
            </div>
            <div
              className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{
                background: "oklch(0.52 0.18 145 / 0.15)",
                color: "oklch(0.52 0.18 145)",
              }}
            >
              Your Commission: ₹50
            </div>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Check%20out%20Pragati%20Study%20Magazine%20by%20Openframe%20Education%20-%20only%20₹200!`}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="pragati.promote.primary_button"
          >
            <Button
              className="gap-2 text-white font-semibold"
              style={{ background: "oklch(0.52 0.18 145)" }}
            >
              <MessageCircle className="w-4 h-4" />
              Promote / Share Link
            </Button>
          </a>
        </div>
      </div>

      {/* Subjects */}
      <div
        className="bg-white rounded-2xl border p-6 shadow-sm"
        style={{ borderColor: "oklch(0.93 0.02 255)" }}
      >
        <h3 className="font-bold text-foreground mb-4">Subjects Covered</h3>
        <div className="space-y-2.5">
          {[
            { subject: "General Knowledge", icon: "🌍" },
            { subject: "Mathematics", icon: "🔢" },
            { subject: "Science", icon: "🔬" },
            { subject: "English", icon: "📝" },
            { subject: "Social Studies", icon: "🗺️" },
          ].map(({ subject, icon }) => (
            <div
              key={subject}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "oklch(0.97 0.02 145)" }}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-sm font-medium text-foreground/80">
                {subject}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Why sell */}
      <div
        className="bg-white rounded-2xl border p-6 shadow-sm"
        style={{ borderColor: "oklch(0.93 0.02 255)" }}
      >
        <h3 className="font-bold text-foreground mb-4">
          Why Promote Pragati Magazine?
        </h3>
        <ul className="space-y-2">
          {[
            "Easy to sell – affordable for every student",
            "High demand in schools and tuition centers",
            "Earn ₹50 commission on every sale",
            "Opportunity to earn daily income",
            "Helps students improve academic knowledge",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-foreground/70"
            >
              <Check
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: "oklch(0.52 0.18 145)" }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Magazine Order Form */}
      <div
        className="bg-white rounded-2xl border p-6 shadow-sm"
        style={{ borderColor: "oklch(0.93 0.02 255)" }}
      >
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Send className="w-4 h-4" style={{ color: "oklch(0.52 0.18 145)" }} />
          Submit a Magazine Order
        </h3>
        <form onSubmit={handleMagazineOrder} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="magStudentName">Student Name *</Label>
            <Input
              id="magStudentName"
              value={magazineForm.studentName}
              onChange={(e) =>
                setMagazineForm((p) => ({ ...p, studentName: e.target.value }))
              }
              placeholder="Student's full name"
              className="rounded-xl"
              required
              data-ocid="fe.magazine.order.student.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="magMobile">Mobile Number *</Label>
            <Input
              id="magMobile"
              type="tel"
              value={magazineForm.mobile}
              onChange={(e) =>
                setMagazineForm((p) => ({ ...p, mobile: e.target.value }))
              }
              placeholder="+91 XXXXX XXXXX"
              className="rounded-xl"
              required
              data-ocid="fe.magazine.order.mobile.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="magAddress">Address *</Label>
            <Textarea
              id="magAddress"
              value={magazineForm.address}
              onChange={(e) =>
                setMagazineForm((p) => ({ ...p, address: e.target.value }))
              }
              placeholder="Delivery address"
              className="rounded-xl resize-none"
              rows={3}
              required
              data-ocid="fe.magazine.order.address.textarea"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="magQty">Quantity *</Label>
            <Input
              id="magQty"
              type="number"
              min={1}
              value={magazineForm.quantity}
              onChange={(e) =>
                setMagazineForm((p) => ({ ...p, quantity: e.target.value }))
              }
              placeholder="1"
              className="rounded-xl"
              required
              data-ocid="fe.magazine.order.quantity.input"
            />
          </div>
          <Button
            type="submit"
            className="w-full text-white font-semibold gap-2"
            style={{ background: "oklch(0.52 0.18 145)" }}
            data-ocid="fe.magazine.order.submit_button"
          >
            <Send className="w-4 h-4" />
            Submit Order
          </Button>
        </form>
      </div>
    </div>
  );

  const renderCoursePrograms = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Course Programs – Promote & Earn"
        description="Share these courses with students and earn referral commissions"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COURSES.map((course, idx) => (
          <div
            key={course.label}
            className="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col"
            style={{ borderColor: "oklch(0.93 0.02 255)" }}
            data-ocid={`course.item.${idx + 1}`}
          >
            {/* Header */}
            <div
              className="px-5 pt-5 pb-3"
              style={{ background: `${course.color}12` }}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge
                  className="text-xs font-semibold text-white border-0"
                  style={{ background: course.color }}
                >
                  {course.badge}
                </Badge>
              </div>
              <h3 className="text-base font-extrabold text-foreground">
                {course.label}
              </h3>
            </div>

            {/* Subjects */}
            <div className="px-5 py-4 flex-1">
              <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-2.5">
                Subjects
              </p>
              <div className="flex flex-wrap gap-1.5">
                {course.subjects.map((sub) => (
                  <span
                    key={sub}
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${course.color}15`,
                      color: course.color,
                    }}
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div
              className="px-5 py-4 border-t flex items-center justify-center"
              style={{ borderColor: "oklch(0.95 0.01 255)" }}
            >
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=I%20want%20to%20enroll%20in%20${encodeURIComponent(course.label)}%20at%20Openframe%20Education`}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid={`course.enroll.primary_button.${idx + 1}`}
              >
                <Button
                  size="sm"
                  className="text-white font-semibold text-xs"
                  style={{ background: course.color }}
                >
                  Enroll Now
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEnrollStudent = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Enroll a Student"
        description="Fill in student details to enroll them in a course"
      />

      <div className="max-w-lg">
        {/* Commission Info Banner */}
        <div
          className="rounded-xl px-4 py-3.5 mb-5 text-sm flex items-start gap-2.5"
          style={{
            background: "oklch(0.96 0.04 262)",
            color: "oklch(0.30 0.12 262)",
          }}
          data-ocid="referral.commission.panel"
        >
          <IndianRupee className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            You'll earn{" "}
            <strong>
              ₹{PLAN_COMMISSION[Number(referralForm.planId)] ?? 100} commission
            </strong>{" "}
            when this student enrolls!{" "}
            <span className="opacity-75">
              (Basic ₹50 / Standard ₹100 / Premium ₹150 + ₹100 bonus every 10
              enrollments)
            </span>
          </span>
        </div>

        <form
          onSubmit={handleEnrollStudent}
          className="bg-white rounded-2xl border p-6 shadow-sm space-y-4"
          style={{ borderColor: "oklch(0.93 0.02 255)" }}
        >
          {/* Student Name */}
          <div className="space-y-1.5">
            <Label htmlFor="studentName">Student Name *</Label>
            <Input
              id="studentName"
              value={referralForm.studentName}
              onChange={(e) =>
                setReferralForm((p) => ({ ...p, studentName: e.target.value }))
              }
              placeholder="Student's full name"
              className="rounded-xl"
              required
              data-ocid="fe.enroll.student.input"
            />
          </div>

          {/* Parent Name */}
          <div className="space-y-1.5">
            <Label htmlFor="parentName">Parent Name</Label>
            <Input
              id="parentName"
              value={referralForm.parentName}
              onChange={(e) =>
                setReferralForm((p) => ({ ...p, parentName: e.target.value }))
              }
              placeholder="Parent's name"
              className="rounded-xl"
              data-ocid="fe.enroll.parent.input"
            />
          </div>

          {/* Class Level */}
          <div className="space-y-1.5">
            <Label>Class Level *</Label>
            <Select
              onValueChange={(v) =>
                setReferralForm((p) => ({ ...p, classLevel: v }))
              }
              value={referralForm.classLevel || undefined}
            >
              <SelectTrigger
                className="rounded-xl"
                data-ocid="fe.enroll.class.select"
              >
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classLevels.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Plan */}
          <div className="space-y-1.5">
            <Label>Course Plan *</Label>
            <Select
              value={referralForm.planId}
              onValueChange={(v) =>
                setReferralForm((p) => ({ ...p, planId: v }))
              }
            >
              <SelectTrigger
                className="rounded-xl"
                data-ocid="fe.enroll.plan.select"
              >
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Basic – ₹50 commission</SelectItem>
                <SelectItem value="2">Standard – ₹100 commission</SelectItem>
                <SelectItem value="3">Premium – ₹150 commission</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile */}
          <div className="space-y-1.5">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              value={referralForm.mobile}
              onChange={(e) =>
                setReferralForm((p) => ({ ...p, mobile: e.target.value }))
              }
              placeholder="+91 XXXXX XXXXX"
              type="tel"
              className="rounded-xl"
              required
              data-ocid="fe.enroll.mobile.input"
            />
          </div>

          {/* City / Village */}
          <div className="space-y-1.5">
            <Label htmlFor="cityVillage">City / Village</Label>
            <Input
              id="cityVillage"
              value={referralForm.cityVillage}
              onChange={(e) =>
                setReferralForm((p) => ({ ...p, cityVillage: e.target.value }))
              }
              placeholder="City or village name"
              className="rounded-xl"
              data-ocid="fe.enroll.city.input"
            />
          </div>

          <Button
            type="submit"
            disabled={createReferral.isPending}
            className="w-full text-white border-0 font-semibold"
            style={{ background: "oklch(0.62 0.2 320)" }}
            data-ocid="fe.enroll.submit_button"
          >
            {createReferral.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            {createReferral.isPending ? "Submitting..." : "Enroll Student"}
          </Button>
        </form>
      </div>
    </div>
  );

  // ─── My Leads (localStorage-backed) ────────────────────────────────────────
  const renderMyLeads = () => {
    const totalLeads = myLeads.length;
    const approved = myLeads.filter((l) => l.status === "Approved").length;
    const pending = myLeads.filter((l) => l.status === "Pending").length;
    const totalCommission = myLeads
      .filter((l) => l.commissionPaid)
      .reduce((s, l) => s + l.commissionAmount, 0);

    return (
      <div className="space-y-6">
        <SectionHeader
          title="My Leads"
          description="Students you've enrolled through your referral link or Enroll Student form"
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
            title="Approved"
            value={approved}
            icon={<Check className="w-5 h-5" />}
            color="oklch(0.55 0.16 165)"
          />
          <StatsCard
            title="Pending"
            value={pending}
            icon={<Loader2 className="w-5 h-5" />}
            color="oklch(0.68 0.19 50)"
          />
          <StatsCard
            title="Commission Earned"
            value={`₹${totalCommission}`}
            icon={<IndianRupee className="w-5 h-5" />}
            color="oklch(0.62 0.2 320)"
          />
        </div>

        {/* Table or Empty State */}
        {myLeads.length === 0 ? (
          <div
            className="rounded-2xl border p-12 flex flex-col items-center justify-center text-center bg-white"
            style={{ borderColor: "oklch(0.93 0.02 255)" }}
            data-ocid="leads.empty_state"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "oklch(0.96 0.03 262)" }}
            >
              <ClipboardList
                className="w-8 h-8"
                style={{ color: "oklch(0.45 0.18 262)" }}
              />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">
              No leads yet
            </h3>
            <p className="text-sm text-foreground/60 mb-5 max-w-xs">
              Share your referral link or enroll a student via the Enroll
              Student form.
            </p>
            <Button
              onClick={() => setActiveSection("enroll-student")}
              className="gap-2 text-white font-semibold"
              style={{ background: "oklch(0.45 0.18 262)" }}
              data-ocid="leads.add.primary_button"
            >
              <UserPlus className="w-4 h-4" />
              Enroll Student
            </Button>
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            style={{ borderColor: "oklch(0.93 0.02 255)" }}
            data-ocid="leads.table"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myLeads.map((lead, idx) => (
                    <TableRow
                      key={lead.leadId}
                      data-ocid={`leads.item.${idx + 1}`}
                    >
                      <TableCell className="font-mono text-xs text-foreground/50">
                        #{idx + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {lead.studentName}
                      </TableCell>
                      <TableCell className="text-sm text-foreground/70">
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
                      <TableCell className="text-sm">
                        {lead.cityVillage || "—"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            lead.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : lead.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            lead.paymentStatus === "Received"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {lead.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell
                        className="font-semibold"
                        style={{
                          color: lead.commissionPaid
                            ? "oklch(0.45 0.18 165)"
                            : "oklch(0.6 0.1 255)",
                        }}
                      >
                        ₹{lead.commissionAmount}
                        {lead.commissionPaid && (
                          <span className="ml-1 text-xs font-normal text-green-600">
                            ✓ Paid
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/50">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN")}
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
  };

  const renderShareLink = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Share Your Referral Link"
        description="Every student who enrolls through your link earns you commission"
      />

      <div className="max-w-lg space-y-5">
        {/* Referral Code */}
        <div
          className="bg-white rounded-2xl border p-6 shadow-sm"
          style={{ borderColor: "oklch(0.93 0.02 255)" }}
        >
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-2">
            Your Referral Code
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-mono font-bold"
            style={{
              background: "oklch(0.96 0.04 262)",
              color: "oklch(0.45 0.18 262)",
            }}
          >
            {REFERRAL_CODE}
          </div>
        </div>

        {/* Link Box */}
        <div
          className="bg-white rounded-2xl border p-6 shadow-sm"
          style={{ borderColor: "oklch(0.93 0.02 255)" }}
        >
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-2">
            Your Referral Link
          </p>
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-sm break-all mb-4"
            style={{
              background: "oklch(0.97 0.02 262)",
              color: "oklch(0.30 0.12 262)",
            }}
            data-ocid="share.link.panel"
          >
            {REFERRAL_LINK}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex-1 gap-2 font-semibold"
              data-ocid="share.copy.button"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Link
                </>
              )}
            </Button>

            <a
              href={`https://wa.me/?text=Join%20Openframe%20Education%20using%20my%20referral%20link:%20${REFERRAL_LINK}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
              data-ocid="share.whatsapp.primary_button"
            >
              <Button
                className="w-full gap-2 text-white font-semibold"
                style={{ background: "oklch(0.55 0.17 145)" }}
              >
                <MessageCircle className="w-4 h-4" />
                Share on WhatsApp
              </Button>
            </a>

            <a
              href={`https://t.me/share/url?url=${REFERRAL_LINK}&text=Join%20Openframe%20Education!`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
              data-ocid="share.telegram.primary_button"
            >
              <Button
                className="w-full gap-2 text-white font-semibold"
                style={{ background: "oklch(0.55 0.19 230)" }}
              >
                <Send className="w-4 h-4" />
                Share on Telegram
              </Button>
            </a>
          </div>
        </div>

        {/* Tips */}
        <div
          className="rounded-2xl border p-5"
          style={{
            background: "oklch(0.97 0.03 262)",
            borderColor: "oklch(0.45 0.18 262 / 0.3)",
          }}
        >
          <p className="text-sm font-semibold text-foreground/70 mb-2.5">
            💡 Tips to get more referrals
          </p>
          <ul className="space-y-1.5">
            {[
              "Share in WhatsApp groups of parents and students",
              "Post in local community Facebook/Telegram groups",
              "Distribute the link at tuition centers & schools",
              "Tell friends about our affordable monthly plans",
            ].map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-xs text-foreground/60"
              >
                <span className="mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderMyReferrals = () => {
    const pending = localReferrals.filter((r) => !r.isPaid).length;
    const totalRef = localReferrals.length;
    const enrolled = localReferrals.filter((r) => r.isPaid).length;
    const refTotal = localReferrals.reduce((s, r) => s + r.commission, 0);

    return (
      <div className="space-y-6">
        <SectionHeader
          title="My Referrals"
          description="Students you've referred to OpenFrame Education"
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatsCard
            title="Total Referrals"
            value={totalRef}
            icon={<Share2 className="w-5 h-5" />}
            color="oklch(0.62 0.2 320)"
          />
          <StatsCard
            title="Enrolled"
            value={enrolled}
            icon={<Check className="w-5 h-5" />}
            color="oklch(0.55 0.16 165)"
          />
          <StatsCard
            title="Pending"
            value={pending}
            icon={<Loader2 className="w-5 h-5" />}
            color="oklch(0.68 0.19 50)"
          />
          <StatsCard
            title="Total Earned"
            value={`₹${refTotal}`}
            icon={<IndianRupee className="w-5 h-5" />}
            color="oklch(0.45 0.18 262)"
          />
        </div>

        {/* Table or Empty State */}
        {localReferrals.length === 0 ? (
          <div
            className="rounded-2xl border p-12 flex flex-col items-center justify-center text-center"
            style={{ borderColor: "oklch(0.93 0.02 255)", background: "white" }}
            data-ocid="referrals.empty_state"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "oklch(0.96 0.03 262)" }}
            >
              <Users
                className="w-8 h-8"
                style={{ color: "oklch(0.45 0.18 262)" }}
              />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">
              No referrals yet
            </h3>
            <p className="text-sm text-foreground/60 mb-5 max-w-xs">
              Add your first referral to start earning commissions from course
              and magazine promotions.
            </p>
            <Button
              onClick={() => setActiveSection("enroll-student")}
              className="gap-2 text-white font-semibold"
              style={{ background: "oklch(0.62 0.2 320)" }}
              data-ocid="referrals.add.primary_button"
            >
              <UserPlus className="w-4 h-4" />
              Enroll First Student
            </Button>
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            style={{ borderColor: "oklch(0.93 0.02 255)" }}
            data-ocid="referrals.table"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localReferrals.map((r, idx) => (
                  <TableRow key={r.id} data-ocid={`referrals.item.${idx + 1}`}>
                    <TableCell className="font-mono text-xs text-foreground/50">
                      #{idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {r.studentName}
                    </TableCell>
                    <TableCell className="text-sm text-foreground/70">
                      {r.classLevel}
                    </TableCell>
                    <TableCell>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: "oklch(0.96 0.03 262)",
                          color: "oklch(0.45 0.18 262)",
                        }}
                      >
                        {r.plan}
                      </span>
                    </TableCell>
                    <TableCell
                      className="font-semibold"
                      style={{ color: "oklch(0.45 0.18 165)" }}
                    >
                      ₹{r.commission}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          r.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {r.isPaid ? "Paid" : "Pending"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  };

  // ─── Leaderboard ────────────────────────────────────────────────────────────
  const renderLeaderboard = () => {
    const sortedFEs = [...allFEAccounts]
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
            className="rounded-2xl border p-12 flex flex-col items-center justify-center text-center bg-white"
            style={{ borderColor: "oklch(0.93 0.02 255)" }}
            data-ocid="leaderboard.empty_state"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-3xl"
              style={{ background: "oklch(0.97 0.04 50)" }}
            >
              🏆
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">
              Leaderboard is empty
            </h3>
            <p className="text-sm text-foreground/60 mb-5 max-w-xs">
              Be the first on the leaderboard! Start enrolling students.
            </p>
            <Button
              onClick={() => setActiveSection("enroll-student")}
              className="gap-2 text-white font-semibold"
              style={{ background: "oklch(0.68 0.19 50)" }}
              data-ocid="leaderboard.enroll.primary_button"
            >
              <UserPlus className="w-4 h-4" />
              Enroll a Student
            </Button>
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            style={{ borderColor: "oklch(0.93 0.02 255)" }}
            data-ocid="fe.leaderboard.table"
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
                    const isMe = acc.feCode === REFERRAL_CODE;
                    return (
                      <TableRow
                        key={acc.feAccountId}
                        data-ocid={`fe.leaderboard.item.${idx + 1}`}
                        className={
                          isMe
                            ? "bg-blue-50/60"
                            : isTopThree
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
                          {isMe && (
                            <span className="ml-2 text-xs font-normal text-blue-600">
                              (You)
                            </span>
                          )}
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
  };

  // ─── Withdraw Earnings ──────────────────────────────────────────────────────

  const handleGpsCheckIn = (
    leadName = visitForm.leadName,
    purpose = visitForm.purpose,
  ) => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const checkIn = {
          id: `ci${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          date: new Date().toISOString().slice(0, 10),
          purpose,
          leadName,
        };
        const updated = [checkIn, ...gpsCheckIns];
        setGpsCheckIns(updated);
        localStorage.setItem("FE_GPS_CHECKINS", JSON.stringify(updated));
        const payload = {
          checkInId: BigInt(Date.now()),
          feId: "FE1001",
          feName: "Field Executive",
          time: checkIn.time,
          date: checkIn.date,
          lat: checkIn.lat,
          lng: checkIn.lng,
          purpose: checkIn.purpose,
          leadName: checkIn.leadName,
          createdAt: BigInt(Date.now()),
        };
        if (actor) {
          try {
            await (actor as any).createGpsCheckIn(payload);
          } catch {
            pendingGpsSync.current.push(payload);
          }
        } else {
          pendingGpsSync.current.push(payload);
        }
        setGpsLoading(false);
        toast.success(`Checked in at ${checkIn.time} – Location captured`);
      },
      () => {
        setGpsLoading(false);
        toast.error("Location access denied. Please enable GPS.");
      },
      { timeout: 10000 },
    );
  };

  const renderVisitLog = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Visit Log"
        description="Your daily field visit history"
      />

      {/* Check-In Card */}
      <div
        className="rounded-2xl border p-6 shadow-sm"
        style={{
          background: "oklch(0.15 0.06 265)",
          borderColor: "oklch(0.3 0.06 265)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <MapPin
            className="w-6 h-6"
            style={{ color: "oklch(0.65 0.18 165)" }}
          />
          <div>
            <h3 className="font-semibold text-white">GPS Check-In</h3>
            <p className="text-xs" style={{ color: "oklch(0.65 0.03 265)" }}>
              Record your current location for today's visit
            </p>
          </div>
          {gpsCheckIns.length > 0 && (
            <span
              className="ml-auto text-xs px-2.5 py-0.5 rounded-full font-semibold"
              style={{
                background: "oklch(0.55 0.16 165 / 0.2)",
                color: "oklch(0.65 0.18 165)",
              }}
            >
              {
                gpsCheckIns.filter(
                  (c) => c.date === new Date().toISOString().slice(0, 10),
                ).length
              }{" "}
              check-ins today
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label
              htmlFor="fe-lead-name"
              className="text-xs font-medium block mb-1"
              style={{ color: "oklch(0.65 0.03 265)" }}
            >
              Lead Name
            </label>
            <input
              className="w-full rounded-lg px-3 py-2 text-sm text-white border"
              style={{
                background: "oklch(0.2 0.06 265)",
                borderColor: "oklch(0.35 0.06 265)",
              }}
              placeholder="Customer name"
              value={visitForm.leadName}
              id="fe-lead-name"
              onChange={(e) =>
                setVisitForm((f) => ({ ...f, leadName: e.target.value }))
              }
              data-ocid="visit-log.input"
            />
          </div>
          <div>
            <label
              htmlFor="fe-purpose"
              className="text-xs font-medium block mb-1"
              style={{ color: "oklch(0.65 0.03 265)" }}
            >
              Purpose
            </label>
            <select
              className="w-full rounded-lg px-3 py-2 text-sm text-white border"
              style={{
                background: "oklch(0.2 0.06 265)",
                borderColor: "oklch(0.35 0.06 265)",
              }}
              id="fe-purpose"
              value={visitForm.purpose}
              onChange={(e) =>
                setVisitForm((f) => ({ ...f, purpose: e.target.value }))
              }
              data-ocid="visit-log.select"
            >
              <option>Student follow-up</option>
              <option>New lead visit</option>
              <option>Enrollment conversion</option>
              <option>Area survey</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
          style={{
            background: gpsLoading
              ? "oklch(0.4 0.08 265)"
              : "oklch(0.55 0.16 165)",
          }}
          onClick={() => handleGpsCheckIn()}
          disabled={gpsLoading}
          data-ocid="visit-log.button"
        >
          {gpsLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Getting Location...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" /> Check In Now
            </>
          )}
        </button>
      </div>

      {/* Recent Check-ins */}
      {gpsCheckIns.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">
            Today's Check-ins
          </h3>
          <div className="space-y-2">
            {gpsCheckIns.map((c, i) => (
              <div
                key={c.id}
                className="bg-white rounded-xl border p-4 flex items-center gap-3"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
                data-ocid={`visit-log.item.${i + 1}`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.95 0.04 165)" }}
                >
                  <MapPin
                    className="w-4 h-4"
                    style={{ color: "oklch(0.55 0.16 165)" }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {c.purpose} {c.leadName && `– ${c.leadName}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.time} · {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
                  ✓ Logged
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visit History from real check-ins */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Visit History</h3>
        {gpsCheckIns.length === 0 ? (
          <div
            className="bg-white rounded-2xl border p-6 text-center text-muted-foreground"
            data-ocid="visit-log.empty_state"
          >
            <p className="text-sm">
              No check-ins yet. Tap Check In to record your first visit.
            </p>
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            style={{ borderColor: "oklch(0.93 0.02 255)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-semibold">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold">
                    Time
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold">
                    Purpose
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold">
                    Lead
                  </th>
                </tr>
              </thead>
              <tbody>
                {gpsCheckIns.map((c, i) => (
                  <tr
                    key={c.id}
                    className="border-b last:border-0 hover:bg-muted/20"
                    data-ocid={`visit-log.row.${i + 1}`}
                  >
                    <td className="py-3 px-4 text-xs">{c.date}</td>
                    <td className="py-3 px-4 text-xs">{c.time}</td>
                    <td className="py-3 px-4 text-xs font-mono">
                      {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 text-xs">{c.purpose}</td>
                    <td className="py-3 px-4 text-xs">{c.leadName || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderWithdraw = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Withdraw Earnings"
        description="Request a payout for your commission earnings"
      />

      {/* Balance Card */}
      <div
        className="rounded-2xl border p-6 shadow-sm"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.45 0.18 262), oklch(0.55 0.22 280))",
        }}
      >
        <p className="text-sm font-semibold text-white/70 mb-1">
          Available Balance
        </p>
        <p className="text-4xl font-extrabold text-white mb-3">
          ₹{availableBalance}
        </p>
        <div className="flex gap-4 text-xs text-white/70">
          <span>Total Earned: ₹{totalEarned}</span>
          <span>·</span>
          <span>Total Withdrawn: ₹{feAccount?.totalWithdrawn ?? 0}</span>
        </div>
      </div>

      {/* Withdrawal Form */}
      {availableBalance > 0 ? (
        <form
          onSubmit={handleWithdraw}
          className="bg-white rounded-2xl border p-6 shadow-sm space-y-4 max-w-lg"
          style={{ borderColor: "oklch(0.93 0.02 255)" }}
          data-ocid="withdraw.form.panel"
        >
          <h3 className="font-bold text-foreground">Request Withdrawal</h3>

          <div className="space-y-1.5">
            <Label htmlFor="withdrawAmount">
              Amount (₹) *{" "}
              <span className="text-xs text-foreground/50 font-normal">
                (max ₹{availableBalance})
              </span>
            </Label>
            <Input
              id="withdrawAmount"
              type="number"
              min={1}
              max={availableBalance}
              value={withdrawForm.amount}
              onChange={(e) =>
                setWithdrawForm((p) => ({ ...p, amount: e.target.value }))
              }
              placeholder="Enter amount"
              className="rounded-xl"
              required
              data-ocid="withdraw.amount.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="upiDetails">UPI ID / Bank Details *</Label>
            <Textarea
              id="upiDetails"
              value={withdrawForm.upiDetails}
              onChange={(e) =>
                setWithdrawForm((p) => ({ ...p, upiDetails: e.target.value }))
              }
              placeholder="e.g. yourname@upi or Bank: HDFC, A/c 1234567890, IFSC: HDFC0001234"
              className="rounded-xl resize-none"
              rows={3}
              required
              data-ocid="withdraw.upi.textarea"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white font-semibold gap-2"
            style={{ background: "oklch(0.45 0.18 262)" }}
            data-ocid="withdraw.submit_button"
          >
            <Wallet className="w-4 h-4" />
            Request Withdrawal
          </Button>
        </form>
      ) : (
        <div
          className="rounded-2xl border p-8 text-center bg-white"
          style={{ borderColor: "oklch(0.93 0.02 255)" }}
          data-ocid="withdraw.empty_state"
        >
          <p className="text-foreground/60 text-sm">
            No balance available for withdrawal. Earn commissions by referring
            students.
          </p>
        </div>
      )}

      {/* Withdrawal History */}
      {myWithdrawals.length > 0 && (
        <div>
          <h3 className="font-bold text-foreground mb-3">Withdrawal History</h3>
          <div
            className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            style={{ borderColor: "oklch(0.93 0.02 255)" }}
            data-ocid="withdraw.table"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>UPI / Bank</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Admin Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myWithdrawals.map((w, idx) => (
                    <TableRow
                      key={w.requestId}
                      data-ocid={`withdraw.item.${idx + 1}`}
                    >
                      <TableCell className="font-mono text-xs text-foreground/50">
                        #{idx + 1}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{w.amount}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/70 max-w-[160px] truncate">
                        {w.upiDetails}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            w.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : w.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {w.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-foreground/50">
                        {new Date(w.createdAt).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/60">
                        {w.adminNote || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const addTask = () => {
    if (!taskInput.trim()) return;
    const t = {
      id: `t${Date.now()}`,
      title: taskInput.trim(),
      status: "pending" as const,
      date: new Date().toISOString().slice(0, 10),
    };
    const updated = [t, ...tasks];
    setTasks(updated);
    localStorage.setItem("FE_TASKS", JSON.stringify(updated));
    setTaskInput("");
  };
  const toggleTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            status:
              t.status === "done" ? ("pending" as const) : ("done" as const),
          }
        : t,
    );
    setTasks(updated);
    localStorage.setItem("FE_TASKS", JSON.stringify(updated));
  };
  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem("FE_TASKS", JSON.stringify(updated));
  };
  const markAttendance = (status: "Present" | "Absent" | "Half Day") => {
    const today = new Date().toISOString().slice(0, 10);
    const exists = feAttendance.find((a) => a.date === today);
    let updated: Array<{
      date: string;
      status: "Present" | "Absent" | "Half Day";
    }>;
    if (exists) {
      updated = feAttendance.map((a) =>
        a.date === today ? { ...a, status } : a,
      );
    } else {
      updated = [{ date: today, status }, ...feAttendance];
    }
    setFeAttendance(updated);
    localStorage.setItem("FE_ATTENDANCE", JSON.stringify(updated));
    toast.success(`Marked as ${status} for today`);
  };

  const renderDailyTasks = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Daily Tasks"
        description="Track your daily field activities and tasks"
      />
      <div className="bg-white rounded-2xl border p-5 shadow-sm space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="flex-1"
            data-ocid="tasks.input"
          />
          <Button
            onClick={addTask}
            data-ocid="tasks.primary_button"
            style={{ background: "oklch(0.45 0.18 262)", color: "white" }}
          >
            Add
          </Button>
        </div>
        {tasks.length === 0 ? (
          <p
            className="text-center text-muted-foreground py-6"
            data-ocid="tasks.empty_state"
          >
            No tasks yet. Add your first task above.
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map((t, idx) => (
              <div
                key={t.id}
                data-ocid={`tasks.item.${idx + 1}`}
                className={`flex items-center gap-3 p-3 rounded-xl border ${t.status === "done" ? "bg-green-50 border-green-200" : "bg-gray-50"}`}
              >
                <input
                  type="checkbox"
                  checked={t.status === "done"}
                  onChange={() => toggleTask(t.id)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span
                  className={`flex-1 text-sm ${t.status === "done" ? "line-through text-muted-foreground" : ""}`}
                >
                  {t.title}
                </span>
                <span className="text-xs text-muted-foreground">{t.date}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(t.id)}
                  data-ocid={`tasks.delete_button.${idx + 1}`}
                  className="h-7 w-7 p-0 text-red-400 hover:text-red-600"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderFeAttendance = () => {
    const today = new Date().toISOString().slice(0, 10);
    const todayRecord = feAttendance.find((a) => a.date === today);
    return (
      <div className="space-y-6">
        <SectionHeader
          title="My Attendance"
          description="Mark and track your daily field attendance"
        />
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <p className="font-semibold text-foreground mb-1">Today: {today}</p>
          {todayRecord ? (
            <p className="text-sm text-green-600 font-medium mb-4">
              Status: {todayRecord.status}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">Not marked yet</p>
          )}
          <div className="flex gap-3 flex-wrap">
            {(["Present", "Absent", "Half Day"] as const).map((s) => (
              <Button
                key={s}
                data-ocid={`attendance.${s.toLowerCase().replace(" ", "-")}.button`}
                variant={todayRecord?.status === s ? "default" : "outline"}
                onClick={() => markAttendance(s)}
                style={
                  todayRecord?.status === s
                    ? { background: "oklch(0.45 0.18 262)", color: "white" }
                    : {}
                }
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
        {feAttendance.length > 0 && (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feAttendance.map((a) => (
                  <TableRow key={a.date} data-ocid="attendance.row">
                    <TableCell>{a.date}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === "Present" ? "bg-green-100 text-green-700" : a.status === "Absent" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {a.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "commission-plan":
        return renderCommissionPlan();
      case "pragati-magazine":
        return renderPragatiMagazine();
      case "course-programs":
        return renderCoursePrograms();
      case "enroll-student":
        return renderEnrollStudent();
      case "my-leads":
        return renderMyLeads();
      case "share-link":
        return renderShareLink();
      case "my-referrals":
        return renderMyReferrals();
      case "leaderboard":
        return renderLeaderboard();
      case "withdraw":
        return renderWithdraw();
      case "visit-log":
        return renderVisitLog();
      case "tasks":
        return renderDailyTasks();
      case "attendance":
        return renderFeAttendance();
      case "analytics":
        return <FEAnalyticsSection />;
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout
      title="Field Executive"
      subtitle="Field Executive Dashboard"
      dashboardRole="field-exec"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
