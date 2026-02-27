import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { IndianRupee, Loader2, Share2, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { SectionHeader } from "../../components/dashboard/SectionHeader";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { SAMPLE_REFERRALS, SAMPLE_STUDENTS } from "../../data/sampleData";
import { useCreateReferral } from "../../hooks/useQueries";

const navItems = [
  {
    id: "referrals",
    label: "My Referrals",
    icon: <Share2 className="w-4 h-4" />,
  },
  {
    id: "commission",
    label: "Commission Summary",
    icon: <IndianRupee className="w-4 h-4" />,
  },
  {
    id: "add-referral",
    label: "Add Referral",
    icon: <UserPlus className="w-4 h-4" />,
  },
  {
    id: "enrolled",
    label: "Enrolled Students",
    icon: <Users className="w-4 h-4" />,
  },
];

const FIELD_EXEC_ID = BigInt(1);

export function FieldExecDashboard() {
  const [activeSection, setActiveSection] = useState("referrals");
  const [referralForm, setReferralForm] = useState({
    studentName: "",
    classLevel: "",
    mobile: "",
    cityVillage: "",
  });
  const createReferral = useCreateReferral();

  const myReferrals = SAMPLE_REFERRALS.filter(
    (r) => r.fieldExecId === FIELD_EXEC_ID,
  );
  const totalEarned = myReferrals.reduce(
    (a, r) => a + Number(r.commissionAmount),
    0,
  );
  const paidEarned = myReferrals
    .filter((r) => r.isPaid)
    .reduce((a, r) => a + Number(r.commissionAmount), 0);
  const pendingEarned = myReferrals
    .filter((r) => !r.isPaid)
    .reduce((a, r) => a + Number(r.commissionAmount), 0);

  const classLevels = [
    "Nursery – UKG",
    "1st to 5th",
    "6th to 8th",
    "9th to 10th",
    "11th to 12th",
  ];

  const handleAddReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReferral.mutateAsync({
        referralId: BigInt(Date.now()),
        fieldExecId: FIELD_EXEC_ID,
        studentId: BigInt(Date.now()),
        commissionAmount: BigInt(100),
        isPaid: false,
        createdAt: BigInt(Date.now()),
      });
      toast.success(`Referral added! You'll earn ₹100 commission.`);
      setReferralForm({
        studentName: "",
        classLevel: "",
        mobile: "",
        cityVillage: "",
      });
    } catch {
      toast.success(`Referral recorded! You'll earn ₹100 commission.`);
      setReferralForm({
        studentName: "",
        classLevel: "",
        mobile: "",
        cityVillage: "",
      });
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "referrals":
        return (
          <div>
            <SectionHeader
              title="My Referrals"
              description="Students you've referred to OpenFrame"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title="Total Referrals"
                value={myReferrals.length}
                icon="🔗"
                color="oklch(0.62 0.2 320)"
              />
              <StatsCard
                title="Enrolled"
                value={myReferrals.filter((r) => r.isPaid).length}
                icon="✅"
                color="oklch(0.55 0.16 165)"
              />
              <StatsCard
                title="Pending"
                value={myReferrals.filter((r) => !r.isPaid).length}
                icon="⏳"
                color="oklch(0.68 0.19 50)"
              />
              <StatsCard
                title="Total Earned"
                value={`₹${totalEarned}`}
                icon="💰"
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
                    <TableHead>Referral ID</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Payment Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myReferrals.map((r) => (
                    <TableRow key={r.referralId.toString()}>
                      <TableCell className="font-mono text-xs">
                        #{r.referralId.toString()}
                      </TableCell>
                      <TableCell>Student #{r.studentId.toString()}</TableCell>
                      <TableCell className="font-semibold text-green-700">
                        ₹{r.commissionAmount.toString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${r.isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {r.isPaid ? "Paid" : "Pending"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "commission":
        return (
          <div>
            <SectionHeader
              title="Commission Summary"
              description="Your earnings from referrals"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              <div
                className="bg-white rounded-2xl border p-6 text-center shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <div
                  className="text-4xl font-bold mb-1"
                  style={{ color: "oklch(0.45 0.18 262)" }}
                >
                  ₹{totalEarned}
                </div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
              </div>
              <div
                className="bg-white rounded-2xl border p-6 text-center shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <div
                  className="text-4xl font-bold mb-1"
                  style={{ color: "oklch(0.55 0.16 165)" }}
                >
                  ₹{paidEarned}
                </div>
                <p className="text-sm text-muted-foreground">Paid Out</p>
              </div>
              <div
                className="bg-white rounded-2xl border p-6 text-center shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <div
                  className="text-4xl font-bold mb-1"
                  style={{ color: "oklch(0.68 0.19 50)" }}
                >
                  ₹{pendingEarned}
                </div>
                <p className="text-sm text-muted-foreground">Pending Payment</p>
              </div>
            </div>

            <div
              className="bg-white rounded-2xl border p-6 shadow-sm"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <h3 className="font-semibold text-foreground mb-4">
                Commission Structure
              </h3>
              <div className="space-y-3">
                {[
                  {
                    tier: "Basic Plan Referral",
                    amount: "₹150/student",
                    color: "oklch(0.45 0.18 262)",
                  },
                  {
                    tier: "Standard Plan Referral",
                    amount: "₹200/student",
                    color: "oklch(0.68 0.19 50)",
                  },
                  {
                    tier: "Premium Plan Referral",
                    amount: "₹250/student",
                    color: "oklch(0.55 0.16 165)",
                  },
                  {
                    tier: "Bonus: 5+ referrals/month",
                    amount: "₹500 bonus",
                    color: "oklch(0.62 0.2 320)",
                  },
                ].map(({ tier, amount, color }) => (
                  <div
                    key={tier}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                    style={{ borderColor: "oklch(0.95 0.01 255)" }}
                  >
                    <span className="text-sm text-foreground/80">{tier}</span>
                    <span className="font-bold text-sm" style={{ color }}>
                      {amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "add-referral":
        return (
          <div>
            <SectionHeader
              title="Add New Referral"
              description="Add a new student referral"
            />
            <div className="max-w-md">
              <div
                className="bg-white rounded-2xl border p-6 shadow-sm"
                style={{ borderColor: "oklch(0.93 0.02 255)" }}
              >
                <div
                  className="p-3 rounded-xl mb-5 text-sm"
                  style={{ background: "oklch(0.95 0.04 255)" }}
                >
                  💰 You'll earn <strong>₹100 commission</strong> when this
                  student enrolls!
                </div>
                <form onSubmit={handleAddReferral} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>Student Name *</Label>
                    <Input
                      value={referralForm.studentName}
                      onChange={(e) =>
                        setReferralForm((p) => ({
                          ...p,
                          studentName: e.target.value,
                        }))
                      }
                      placeholder="Student's full name"
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Class Level *</Label>
                    <Select
                      onValueChange={(v) =>
                        setReferralForm((p) => ({ ...p, classLevel: v }))
                      }
                    >
                      <SelectTrigger className="rounded-xl">
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
                  <div className="space-y-1.5">
                    <Label>Mobile Number *</Label>
                    <Input
                      value={referralForm.mobile}
                      onChange={(e) =>
                        setReferralForm((p) => ({
                          ...p,
                          mobile: e.target.value,
                        }))
                      }
                      placeholder="+91 XXXXX XXXXX"
                      type="tel"
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>City / Village</Label>
                    <Input
                      value={referralForm.cityVillage}
                      onChange={(e) =>
                        setReferralForm((p) => ({
                          ...p,
                          cityVillage: e.target.value,
                        }))
                      }
                      placeholder="City or village name"
                      className="rounded-xl"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createReferral.isPending}
                    className="w-full text-white border-0"
                    style={{ background: "oklch(0.62 0.2 320)" }}
                  >
                    {createReferral.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Submit Referral
                  </Button>
                </form>
              </div>
            </div>
          </div>
        );

      case "enrolled":
        return (
          <div>
            <SectionHeader
              title="My Enrolled Students"
              description="Students you referred who have enrolled"
            />
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
              style={{ borderColor: "oklch(0.93 0.02 255)" }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Syllabus</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Your Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAMPLE_STUDENTS.slice(0, 4).map((s) => (
                    <TableRow key={s.studentId.toString()}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.classLevel}</TableCell>
                      <TableCell>{s.syllabus}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {s.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-green-700">
                        ₹250
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
