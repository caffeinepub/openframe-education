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
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Shield,
  TrendingUp,
  User,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FEAccount {
  feId: string;
  username: string;
  password: string;
  name: string;
  phone: string;
  location: string;
  primaryDeviceId?: string;
  status: "active" | "inactive";
  createdAt: number;
}

interface FESession {
  sessionId: string;
  feId: string;
  feUsername: string;
  feName: string;
  deviceId: string;
  browser: string;
  os: string;
  timestamp: number;
  isNewDevice: boolean;
}

interface FEEnrollment {
  enrollmentId: string;
  feId: string;
  feUsername: string;
  feName: string;
  studentName: string;
  phone: string;
  course: string;
  plan: "basic" | "standard" | "premium";
  deviceId: string;
  lat?: number;
  lng?: number;
  timestamp: number;
  isSuspicious: boolean;
}

interface CheckIn {
  checkInId: string;
  feId: string;
  feUsername: string;
  lat: number;
  lng: number;
  deviceId: string;
  timestamp: number;
  isFake: boolean;
}

interface FraudLog {
  logId: string;
  feId: string;
  feUsername: string;
  reason: string;
  severity: "low" | "medium" | "high";
  timestamp: number;
}

interface WithdrawalRequest {
  requestId: string;
  feId: string;
  feUsername: string;
  feName: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  requestedAt: number;
  note?: string;
}

interface CommissionConfig {
  basicRate: number;
  standardRate: number;
  premiumRate: number;
  bonusThreshold: number;
  bonusAmount: number;
}

interface CurrentSession {
  feId: string;
  feUsername: string;
  feName: string;
  deviceId: string;
  loginTime: number;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

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

// ─── Device fingerprint ───────────────────────────────────────────────────────

function generateDeviceId(): string {
  const nav = navigator;
  const raw = `${nav.userAgent}|${screen.width}x${screen.height}|${nav.language}|${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `DEV-${Math.abs(hash).toString(16).toUpperCase()}`;
}

function getBrowserInfo(): { browser: string; os: string } {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  let os = "Unknown";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iOS")) os = "iOS";
  return { browser, os };
}

// ─── Fraud helpers ────────────────────────────────────────────────────────────

function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function logFraud(
  feId: string,
  feUsername: string,
  reason: string,
  severity: FraudLog["severity"],
) {
  const logs = lsGet<FraudLog[]>("fe_portal_fraud_logs", []);
  const log: FraudLog = {
    logId: `FL-${Date.now()}`,
    feId,
    feUsername,
    reason,
    severity,
    timestamp: Date.now(),
  };
  lsSet("fe_portal_fraud_logs", [log, ...logs]);

  // Also update FE status to suspicious
  const statuses = lsGet<Record<string, string>>("fe_portal_fe_statuses", {});
  if (statuses[feId] !== "blocked") {
    statuses[feId] = "suspicious";
    lsSet("fe_portal_fe_statuses", statuses);
  }
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: "enroll",
    label: "Enroll Student",
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    id: "checkin",
    label: "GPS Check-In",
    icon: <MapPin className="w-4 h-4" />,
  },
  { id: "wallet", label: "Wallet", icon: <Wallet className="w-4 h-4" /> },
  {
    id: "activity",
    label: "Activity Log",
    icon: <Shield className="w-4 h-4" />,
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function FEPortalPage() {
  const [session, setSession] = useState<CurrentSession | null>(() =>
    lsGet<CurrentSession | null>("fe_portal_current_session", null),
  );
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!session) {
    return <FELoginPage onLogin={setSession} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">OpenFrame</p>
              <p className="text-xs text-slate-400">FE Portal</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold">
              {session.feName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {session.feName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {session.feUsername}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection === item.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
              data-ocid={`fe_portal.${item.id}.tab`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              lsSet("fe_portal_current_session", null);
              localStorage.removeItem("fe_portal_current_session");
              setSession(null);
              toast.success("Logged out successfully");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/30 transition-all"
            data-ocid="fe_portal.logout.button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-slate-400 hover:text-white"
            data-ocid="fe_portal.menu.button"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-semibold text-white">
            {navItems.find((n) => n.id === activeSection)?.label}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              {session.deviceId}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeSection === "dashboard" && (
                <FEDashboard session={session} />
              )}
              {activeSection === "enroll" && (
                <FEEnrollSection session={session} />
              )}
              {activeSection === "checkin" && (
                <FECheckInSection session={session} />
              )}
              {activeSection === "wallet" && (
                <FEWalletSection session={session} />
              )}
              {activeSection === "activity" && (
                <FEActivitySection session={session} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function FELoginPage({ onLogin }: { onLogin: (s: CurrentSession) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const fes = lsGet<FEAccount[]>("fe_portal_executives", []);
      // Also check legacy fePortalFEs key
      const legacyFEs = lsGet<
        Array<{
          feId: string;
          username: string;
          password: string;
          name: string;
          phone: string;
          location: string;
          status: string;
        }>
      >("fePortalFEs", []);

      const allFEs = [
        ...fes,
        ...legacyFEs.map((fe) => ({
          feId: fe.feId,
          username: fe.username,
          password: fe.password,
          name: fe.name,
          phone: fe.phone,
          location: fe.location,
          status: fe.status as "active" | "inactive",
          createdAt: 0,
        })),
      ];

      const match = allFEs.find(
        (fe) =>
          (fe.username.toLowerCase() === username.toLowerCase() ||
            fe.name.toLowerCase() === username.toLowerCase()) &&
          fe.password === password,
      );

      if (!match) {
        setError("Invalid username or password.");
        setLoading(false);
        return;
      }

      const statuses = lsGet<Record<string, string>>(
        "fe_portal_fe_statuses",
        {},
      );
      if (match.status === "inactive" || statuses[match.feId] === "blocked") {
        setError("Your account has been blocked. Contact admin.");
        setLoading(false);
        return;
      }

      const deviceId = generateDeviceId();
      const { browser, os } = getBrowserInfo();
      const matchWithDevice = match as FEAccount & { primaryDeviceId?: string };
      const isNewDevice =
        !!matchWithDevice.primaryDeviceId &&
        matchWithDevice.primaryDeviceId !== deviceId;

      if (isNewDevice) {
        toast.warning(
          "New device detected. Your login has been flagged for admin review.",
        );
        logFraud(
          match.feId,
          match.username,
          `Login from new device: ${deviceId}`,
          "medium",
        );
      }

      // Set primaryDeviceId if not set
      if (!matchWithDevice.primaryDeviceId) {
        const updatedFEs = fes.map((fe) =>
          fe.feId === match.feId ? { ...fe, primaryDeviceId: deviceId } : fe,
        );
        lsSet("fe_portal_executives", updatedFEs);
        // Also update legacy key
        const updatedLegacy = legacyFEs.map((fe) =>
          fe.feId === match.feId ? { ...fe, primaryDeviceId: deviceId } : fe,
        );
        lsSet("fePortalFEs", updatedLegacy);
      }

      // Save session to history
      const sessions = lsGet<FESession[]>("fe_portal_sessions", []);
      const newSession: FESession = {
        sessionId: `SES-${Date.now()}`,
        feId: match.feId,
        feUsername: match.username,
        feName: match.name,
        deviceId,
        browser,
        os,
        timestamp: Date.now(),
        isNewDevice,
      };
      lsSet("fe_portal_sessions", [newSession, ...sessions.slice(0, 199)]);

      const currentSession: CurrentSession = {
        feId: match.feId,
        feUsername: match.username,
        feName: match.name,
        deviceId,
        loginTime: Date.now(),
      };
      lsSet("fe_portal_current_session", currentSession);
      onLogin(currentSession);
      toast.success(`Welcome back, ${match.name}!`);
      setLoading(false);
    }, 600);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">OpenFrame Education</h1>
          <p className="text-slate-400 text-sm mt-1">Field Executive Portal</p>
        </div>

        <div
          className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl"
          data-ocid="fe_portal.login.panel"
        >
          <h2 className="text-lg font-semibold text-white mb-5">Sign In</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
                autoComplete="username"
                data-ocid="fe_portal.username.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-sm">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
                autoComplete="current-password"
                data-ocid="fe_portal.password.input"
              />
            </div>
            {error && (
              <div
                className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 rounded-xl p-3"
                data-ocid="fe_portal.login.error_state"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl h-11"
              data-ocid="fe_portal.login.submit_button"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          <Link to="/" className="text-slate-500 hover:text-slate-400">
            ← Back to OpenFrame
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function FEDashboard({ session }: { session: CurrentSession }) {
  const enrollments = lsGet<FEEnrollment[]>("fe_portal_enrollments", []).filter(
    (e) => e.feId === session.feId,
  );
  const config = lsGet<CommissionConfig>("fe_portal_commission_config", {
    basicRate: 50,
    standardRate: 100,
    premiumRate: 150,
    bonusThreshold: 10,
    bonusAmount: 100,
  });

  const checkins = lsGet<CheckIn[]>("fe_portal_checkins", []).filter(
    (c) => c.feId === session.feId,
  );
  const todayStr = new Date().toISOString().split("T")[0];
  const todayCheckin = checkins.find((c) =>
    new Date(c.timestamp).toISOString().startsWith(todayStr),
  );

  const earnings =
    enrollments.filter((e) => e.plan === "basic").length * config.basicRate +
    enrollments.filter((e) => e.plan === "standard").length *
      config.standardRate +
    enrollments.filter((e) => e.plan === "premium").length *
      config.premiumRate +
    Math.floor(enrollments.length / config.bonusThreshold) * config.bonusAmount;

  const progressToBonus = enrollments.length % config.bonusThreshold;
  const recentEnrollments = enrollments.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <p className="text-slate-400 text-sm">Welcome back, {session.feName}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Enrollments"
          value={enrollments.length}
          icon={<ClipboardList className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          label="Earnings"
          value={`₹${earnings.toLocaleString("en-IN")}`}
          icon={<IndianRupee className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          label="Today Check-In"
          value={todayCheckin ? "Done" : "Pending"}
          icon={<MapPin className="w-5 h-5" />}
          color={todayCheckin ? "green" : "orange"}
        />
        <StatCard
          label="Bonuses Earned"
          value={Math.floor(enrollments.length / config.bonusThreshold)}
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Bonus progress */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Bonus Progress</p>
          <Badge className="bg-blue-600 text-white text-xs">
            {progressToBonus}/{config.bonusThreshold} for ₹{config.bonusAmount}{" "}
            bonus
          </Badge>
        </div>
        <Progress
          value={(progressToBonus / config.bonusThreshold) * 100}
          className="h-2 bg-slate-800"
        />
        <p className="text-xs text-slate-400 mt-2">
          {config.bonusThreshold - progressToBonus} more enrollments to next
          bonus
        </p>
      </div>

      {/* Commission rates */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <p className="text-sm font-semibold text-white mb-3">
          Commission Rates
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-800 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-green-400">
              ₹{config.basicRate}
            </p>
            <p className="text-xs text-slate-400">Basic</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-blue-400">
              ₹{config.standardRate}
            </p>
            <p className="text-xs text-slate-400">Standard</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-purple-400">
              ₹{config.premiumRate}
            </p>
            <p className="text-xs text-slate-400">Premium</p>
          </div>
        </div>
      </div>

      {/* Recent enrollments */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <p className="text-sm font-semibold text-white mb-3">
          Recent Enrollments
        </p>
        {recentEnrollments.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">
            No enrollments yet
          </p>
        ) : (
          <div className="space-y-2">
            {recentEnrollments.map((e, idx) => (
              <div
                key={e.enrollmentId}
                className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
                data-ocid={`fe_portal.recent.item.${idx + 1}`}
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {e.studentName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {e.phone} · {e.course}
                  </p>
                </div>
                <Badge className={planBadgeClass(e.plan)}>{e.plan}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function planBadgeClass(plan: string) {
  if (plan === "basic") return "bg-slate-700 text-slate-200";
  if (plan === "standard") return "bg-blue-700 text-blue-100";
  return "bg-purple-700 text-purple-100";
}

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
  const colorMap: Record<string, string> = {
    blue: "bg-blue-600/20 text-blue-400",
    green: "bg-green-600/20 text-green-400",
    orange: "bg-orange-600/20 text-orange-400",
    purple: "bg-purple-600/20 text-purple-400",
  };
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
      <div
        className={`w-9 h-9 rounded-xl ${colorMap[color]} flex items-center justify-center mb-3`}
      >
        {icon}
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

// ─── Enroll Section ───────────────────────────────────────────────────────────

function FEEnrollSection({ session }: { session: CurrentSession }) {
  const [form, setForm] = useState({
    studentName: "",
    phone: "",
    course: "",
    plan: "basic" as FEEnrollment["plan"],
  });
  const [submitting, setSubmitting] = useState(false);
  const [enrollments, setEnrollments] = useState<FEEnrollment[]>(() =>
    lsGet<FEEnrollment[]>("fe_portal_enrollments", []).filter(
      (e) => e.feId === session.feId,
    ),
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.studentName || !form.phone || !form.course) {
      toast.error("All fields are required.");
      return;
    }
    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error("Phone number must be 10 digits.");
      return;
    }

    const allEnrollments = lsGet<FEEnrollment[]>("fe_portal_enrollments", []);

    // Duplicate phone check
    if (allEnrollments.some((e) => e.phone === form.phone)) {
      toast.error("This phone number is already enrolled.");
      logFraud(
        session.feId,
        session.feUsername,
        `Duplicate phone enrollment attempt: ${form.phone}`,
        "high",
      );
      return;
    }

    // Rate limit: max 5 per hour
    const oneHourAgo = Date.now() - 3600000;
    const recentCount = allEnrollments.filter(
      (e) => e.feId === session.feId && e.timestamp > oneHourAgo,
    ).length;
    if (recentCount >= 5) {
      toast.error("Enrollment rate limit reached. Max 5 per hour.");
      logFraud(
        session.feId,
        session.feUsername,
        `Rate limit exceeded: ${recentCount + 1} enrollments in 1 hour`,
        "medium",
      );
      return;
    }

    setSubmitting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => doEnroll(pos.coords.latitude, pos.coords.longitude),
      () => doEnroll(undefined, undefined),
      { timeout: 5000 },
    );
  }

  function doEnroll(lat: number | undefined, lng: number | undefined) {
    const allEnrollments = lsGet<FEEnrollment[]>("fe_portal_enrollments", []);
    const config = lsGet<CommissionConfig>("fe_portal_commission_config", {
      basicRate: 50,
      standardRate: 100,
      premiumRate: 150,
      bonusThreshold: 10,
      bonusAmount: 100,
    });

    const newEnrollment: FEEnrollment = {
      enrollmentId: `ENR-${Date.now()}`,
      feId: session.feId,
      feUsername: session.feUsername,
      feName: session.feName,
      studentName: form.studentName,
      phone: form.phone,
      course: form.course,
      plan: form.plan,
      deviceId: session.deviceId,
      lat,
      lng,
      timestamp: Date.now(),
      isSuspicious: false,
    };

    const updated = [newEnrollment, ...allEnrollments];
    lsSet("fe_portal_enrollments", updated);

    // Also save to legacy keys for Admin panel compatibility
    const legacyLeads = lsGet<Array<Record<string, unknown>>>(
      "openframe_enrollment_leads",
      [],
    );
    const commission =
      form.plan === "basic"
        ? config.basicRate
        : form.plan === "standard"
          ? config.standardRate
          : config.premiumRate;
    legacyLeads.unshift({
      id: newEnrollment.enrollmentId,
      studentName: form.studentName,
      studentPhone: form.phone,
      classLevel: form.course,
      courseType: form.plan,
      feId: session.feId,
      feName: session.feName,
      commission,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    lsSet("openframe_enrollment_leads", legacyLeads);

    // Also to feEnrollments for old admin panel
    const feEnrollments = lsGet<Array<Record<string, unknown>>>(
      "feEnrollments",
      [],
    );
    feEnrollments.unshift({
      id: newEnrollment.enrollmentId,
      studentName: form.studentName,
      studentPhone: form.phone,
      classLevel: form.course,
      courseType: form.plan,
      feId: session.feId,
      feName: session.feName,
      createdAt: new Date().toISOString(),
    });
    lsSet("feEnrollments", feEnrollments);

    setEnrollments(updated.filter((e) => e.feId === session.feId));
    setForm({ studentName: "", phone: "", course: "", plan: "basic" });
    toast.success("Student enrolled successfully!");
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Enroll Student</h2>
        <p className="text-slate-400 text-sm">Register a new student</p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-slate-300">Student Name *</Label>
            <Input
              value={form.studentName}
              onChange={(e) =>
                setForm((p) => ({ ...p, studentName: e.target.value }))
              }
              placeholder="Full name"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
              data-ocid="fe_portal.student_name.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300">Phone Number *</Label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="10-digit mobile number"
              type="tel"
              maxLength={10}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
              data-ocid="fe_portal.student_phone.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300">Course *</Label>
            <Input
              value={form.course}
              onChange={(e) =>
                setForm((p) => ({ ...p, course: e.target.value }))
              }
              placeholder="e.g. Mathematics, Science, Olympiad"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
              data-ocid="fe_portal.course.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-300">Plan *</Label>
            <Select
              value={form.plan}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, plan: v as FEEnrollment["plan"] }))
              }
            >
              <SelectTrigger
                className="bg-slate-800 border-slate-700 text-white rounded-xl"
                data-ocid="fe_portal.plan.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="basic" className="text-white">
                  Basic — ₹50 commission
                </SelectItem>
                <SelectItem value="standard" className="text-white">
                  Standard — ₹100 commission
                </SelectItem>
                <SelectItem value="premium" className="text-white">
                  Premium — ₹150 commission
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl h-11"
            data-ocid="fe_portal.enroll.submit_button"
          >
            {submitting ? "Submitting..." : "Enroll Student"}
          </Button>
        </form>
      </div>

      {/* Enrollments list */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <p className="text-sm font-semibold text-white mb-3">
          My Enrollments ({enrollments.length})
        </p>
        {enrollments.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">
            No enrollments yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">Student</TableHead>
                  <TableHead className="text-slate-400">Phone</TableHead>
                  <TableHead className="text-slate-400">Course</TableHead>
                  <TableHead className="text-slate-400">Plan</TableHead>
                  <TableHead className="text-slate-400">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.slice(0, 20).map((e, idx) => (
                  <TableRow
                    key={e.enrollmentId}
                    className="border-slate-800"
                    data-ocid={`fe_portal.enrollment.item.${idx + 1}`}
                  >
                    <TableCell className="text-white font-medium">
                      {e.studentName}
                    </TableCell>
                    <TableCell className="text-slate-400">{e.phone}</TableCell>
                    <TableCell className="text-slate-400">{e.course}</TableCell>
                    <TableCell>
                      <Badge className={planBadgeClass(e.plan)}>{e.plan}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs">
                      {new Date(e.timestamp).toLocaleDateString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GPS Check-In Section ─────────────────────────────────────────────────────

function FECheckInSection({ session }: { session: CurrentSession }) {
  const [checkins, setCheckins] = useState<CheckIn[]>(() =>
    lsGet<CheckIn[]>("fe_portal_checkins", []).filter(
      (c) => c.feId === session.feId,
    ),
  );
  const [loading, setLoading] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayCheckin = checkins.find((c) =>
    new Date(c.timestamp).toISOString().startsWith(todayStr),
  );

  function handleCheckIn() {
    if (todayCheckin) {
      toast.error("You have already checked in today.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const allCheckins = lsGet<CheckIn[]>("fe_portal_checkins", []);
        const myCheckins = allCheckins.filter((c) => c.feId === session.feId);
        const lastCheckin = myCheckins[0];

        let isFake = false;
        if (lastCheckin) {
          const hoursSince = (Date.now() - lastCheckin.timestamp) / 3600000;
          const dist = getDistanceKm(
            lastCheckin.lat,
            lastCheckin.lng,
            pos.coords.latitude,
            pos.coords.longitude,
          );
          if (hoursSince < 6 && dist > 500) {
            isFake = true;
            logFraud(
              session.feId,
              session.feUsername,
              `Suspicious GPS: ${dist.toFixed(0)}km in ${hoursSince.toFixed(1)}h`,
              "high",
            );
            toast.warning(
              "Suspicious location detected. Your check-in has been flagged.",
            );
          }
        }

        const newCheckin: CheckIn = {
          checkInId: `CI-${Date.now()}`,
          feId: session.feId,
          feUsername: session.feUsername,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          deviceId: session.deviceId,
          timestamp: Date.now(),
          isFake,
        };

        const updated = [newCheckin, ...allCheckins];
        lsSet("fe_portal_checkins", updated);

        // Legacy key
        const logs = lsGet<Array<Record<string, unknown>>>(
          "openframe_location_logs",
          [],
        );
        logs.unshift({
          id: newCheckin.checkInId,
          feId: session.feId,
          feName: session.feName,
          feUsername: session.feUsername,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: new Date().toISOString(),
          deviceId: session.deviceId,
          isFake,
        });
        lsSet("openframe_location_logs", logs);
        lsSet("fe_location_logs", logs);

        setCheckins(updated.filter((c) => c.feId === session.feId));
        if (!isFake) toast.success("GPS Check-In successful!");
        setLoading(false);
      },
      () => {
        toast.error("Could not get your location. Please enable GPS.");
        setLoading(false);
      },
      { timeout: 10000 },
    );
  }

  const last7Days = checkins.filter(
    (c) => c.timestamp > Date.now() - 7 * 24 * 3600000,
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">GPS Check-In</h2>
        <p className="text-slate-400 text-sm">
          Mark your daily attendance with GPS
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-center">
        {todayCheckin ? (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-green-400" />
            </div>
            <p className="text-white font-semibold">Checked In Today</p>
            <p className="text-slate-400 text-sm">
              {new Date(todayCheckin.timestamp).toLocaleTimeString("en-IN")}
            </p>
            <p className="text-xs text-slate-500 font-mono">
              {todayCheckin.lat?.toFixed(4)}, {todayCheckin.lng?.toFixed(4)}
            </p>
            {todayCheckin.isFake && (
              <Badge className="bg-red-600 text-white">
                ⚠ Flagged as suspicious
              </Badge>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto">
              <MapPin className="w-9 h-9 text-blue-400" />
            </div>
            <p className="text-white font-semibold">Not checked in yet</p>
            <Button
              onClick={handleCheckIn}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 rounded-xl"
              data-ocid="fe_portal.checkin.button"
            >
              {loading ? "Getting Location..." : "Check In Now"}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <p className="text-sm font-semibold text-white mb-3">
          Check-In History (Last 7 Days)
        </p>
        {last7Days.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">
            No check-ins in last 7 days
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">Date</TableHead>
                  <TableHead className="text-slate-400">Time</TableHead>
                  <TableHead className="text-slate-400">Location</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {last7Days.map((c, idx) => (
                  <TableRow
                    key={c.checkInId}
                    className="border-slate-800"
                    data-ocid={`fe_portal.checkin.item.${idx + 1}`}
                  >
                    <TableCell className="text-white">
                      {new Date(c.timestamp).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(c.timestamp).toLocaleTimeString("en-IN")}
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs font-mono">
                      {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                    </TableCell>
                    <TableCell>
                      {c.isFake ? (
                        <Badge className="bg-red-600 text-white text-xs">
                          ⚠ Flagged
                        </Badge>
                      ) : (
                        <Badge className="bg-green-600/30 text-green-400 text-xs">
                          ✓ Valid
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Wallet Section ───────────────────────────────────────────────────────────

function FEWalletSection({ session }: { session: CurrentSession }) {
  const enrollments = lsGet<FEEnrollment[]>("fe_portal_enrollments", []).filter(
    (e) => e.feId === session.feId,
  );
  const config = lsGet<CommissionConfig>("fe_portal_commission_config", {
    basicRate: 50,
    standardRate: 100,
    premiumRate: 150,
    bonusThreshold: 10,
    bonusAmount: 100,
  });
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() =>
    lsGet<WithdrawalRequest[]>("fe_portal_withdrawals", []).filter(
      (w) => w.feId === session.feId,
    ),
  );
  const [amount, setAmount] = useState("");

  const basicCount = enrollments.filter((e) => e.plan === "basic").length;
  const standardCount = enrollments.filter((e) => e.plan === "standard").length;
  const premiumCount = enrollments.filter((e) => e.plan === "premium").length;
  const bonusCount = Math.floor(enrollments.length / config.bonusThreshold);
  const totalEarnings =
    basicCount * config.basicRate +
    standardCount * config.standardRate +
    premiumCount * config.premiumRate +
    bonusCount * config.bonusAmount;
  const approvedWithdrawals = withdrawals
    .filter((w) => w.status === "approved")
    .reduce((s, w) => s + w.amount, 0);
  const balance = totalEarnings - approvedWithdrawals;

  function requestWithdrawal(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    if (amt > balance) {
      toast.error("Amount exceeds available balance.");
      return;
    }
    const all = lsGet<WithdrawalRequest[]>("fe_portal_withdrawals", []);
    const newReq: WithdrawalRequest = {
      requestId: `WD-${Date.now()}`,
      feId: session.feId,
      feUsername: session.feUsername,
      feName: session.feName,
      amount: amt,
      status: "pending",
      requestedAt: Date.now(),
    };
    const updated = [newReq, ...all];
    lsSet("fe_portal_withdrawals", updated);
    setWithdrawals(updated.filter((w) => w.feId === session.feId));
    setAmount("");
    toast.success("Withdrawal request submitted!");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Wallet</h2>
        <p className="text-slate-400 text-sm">
          Track your earnings and withdrawals
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <p className="text-slate-400 text-sm mb-1">Available Balance</p>
        <p className="text-4xl font-bold text-green-400">
          ₹{balance.toLocaleString("en-IN")}
        </p>
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-lg font-bold text-white">{basicCount}</p>
            <p className="text-xs text-slate-400">
              Basic × ₹{config.basicRate}
            </p>
            <p className="text-sm font-semibold text-green-400">
              ₹{basicCount * config.basicRate}
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-lg font-bold text-white">{standardCount}</p>
            <p className="text-xs text-slate-400">
              Standard × ₹{config.standardRate}
            </p>
            <p className="text-sm font-semibold text-green-400">
              ₹{standardCount * config.standardRate}
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-lg font-bold text-white">{premiumCount}</p>
            <p className="text-xs text-slate-400">
              Premium × ₹{config.premiumRate}
            </p>
            <p className="text-sm font-semibold text-green-400">
              ₹{premiumCount * config.premiumRate}
            </p>
          </div>
        </div>
        {bonusCount > 0 && (
          <div className="mt-3 bg-yellow-900/20 rounded-xl p-3 border border-yellow-800/40">
            <p className="text-sm text-yellow-400">
              🏆 {bonusCount} × Bonus ₹{config.bonusAmount} = ₹
              {bonusCount * config.bonusAmount}
            </p>
          </div>
        )}
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <p className="text-sm font-semibold text-white mb-4">
          Request Withdrawal
        </p>
        <form onSubmit={requestWithdrawal} className="flex gap-3">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Max ₹${balance}`}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl flex-1"
            data-ocid="fe_portal.withdrawal.input"
          />
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white rounded-xl shrink-0"
            data-ocid="fe_portal.withdrawal.submit_button"
          >
            Request
          </Button>
        </form>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <p className="text-sm font-semibold text-white mb-3">
          Withdrawal History
        </p>
        {withdrawals.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">
            No withdrawal requests yet
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-400">Amount</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map((w, idx) => (
                <TableRow
                  key={w.requestId}
                  className="border-slate-800"
                  data-ocid={`fe_portal.withdrawal.item.${idx + 1}`}
                >
                  <TableCell className="text-white font-semibold">
                    ₹{w.amount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        w.status === "approved"
                          ? "bg-green-600 text-white"
                          : w.status === "rejected"
                            ? "bg-red-600 text-white"
                            : "bg-yellow-600 text-white"
                      }
                    >
                      {w.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-xs">
                    {new Date(w.requestedAt).toLocaleDateString("en-IN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

function FEActivitySection({ session }: { session: CurrentSession }) {
  const sessions = lsGet<FESession[]>("fe_portal_sessions", []).filter(
    (s) => s.feId === session.feId,
  );
  const enrollments = lsGet<FEEnrollment[]>("fe_portal_enrollments", []).filter(
    (e) => e.feId === session.feId,
  );
  const checkins = lsGet<CheckIn[]>("fe_portal_checkins", []).filter(
    (c) => c.feId === session.feId,
  );
  const fraudLogs = lsGet<FraudLog[]>("fe_portal_fraud_logs", []).filter(
    (f) => f.feId === session.feId,
  );

  type ActivityItem = {
    time: number;
    action: string;
    deviceId: string;
    details: string;
    flagged: boolean;
  };

  const activities: ActivityItem[] = [
    ...sessions.map((s) => ({
      time: s.timestamp,
      action: "Login",
      deviceId: s.deviceId,
      details: `${s.browser} / ${s.os}${s.isNewDevice ? " — NEW DEVICE" : ""}`,
      flagged: s.isNewDevice,
    })),
    ...enrollments.map((e) => ({
      time: e.timestamp,
      action: "Enrollment",
      deviceId: e.deviceId,
      details: `${e.studentName} (${e.phone}) — ${e.plan}`,
      flagged: e.isSuspicious,
    })),
    ...checkins.map((c) => ({
      time: c.timestamp,
      action: "Check-In",
      deviceId: c.deviceId,
      details: `${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}`,
      flagged: c.isFake,
    })),
  ].sort((a, b) => b.time - a.time);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Activity Log</h2>
        <p className="text-slate-400 text-sm">
          All actions and security events
        </p>
      </div>

      {fraudLogs.length > 0 && (
        <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-semibold text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Fraud Alerts (
            {fraudLogs.length})
          </p>
          {fraudLogs.slice(0, 3).map((f) => (
            <div
              key={f.logId}
              className="text-xs text-red-300 bg-red-900/20 rounded-xl p-2"
            >
              <span className="font-semibold uppercase">[{f.severity}]</span>{" "}
              {f.reason}
              <span className="ml-2 text-red-500">
                {new Date(f.timestamp).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
        <p className="text-sm font-semibold text-white mb-3">Recent Activity</p>
        {activities.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">
            No activity yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-400">Action</TableHead>
                  <TableHead className="text-slate-400">Device ID</TableHead>
                  <TableHead className="text-slate-400">Details</TableHead>
                  <TableHead className="text-slate-400">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.slice(0, 50).map((a, idx) => (
                  <TableRow
                    key={`${a.action}-${a.time}-${idx}`}
                    className={`border-slate-800 ${a.flagged ? "bg-red-950/20" : ""}`}
                    data-ocid={`fe_portal.activity.item.${idx + 1}`}
                  >
                    <TableCell>
                      <Badge
                        className={
                          a.action === "Login"
                            ? "bg-blue-700 text-blue-100"
                            : a.action === "Enrollment"
                              ? "bg-green-700 text-green-100"
                              : "bg-purple-700 text-purple-100"
                        }
                      >
                        {a.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-xs font-mono">
                      {a.deviceId}
                    </TableCell>
                    <TableCell
                      className={`text-sm ${a.flagged ? "text-red-400" : "text-slate-300"}`}
                    >
                      {a.flagged && (
                        <AlertTriangle className="w-3.5 h-3.5 inline mr-1 text-red-400" />
                      )}
                      {a.details}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {new Date(a.time).toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
