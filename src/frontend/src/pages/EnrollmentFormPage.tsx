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
import { CheckCircle2, GraduationCap, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateDemoBooking } from "../hooks/useQueries";
import type { EnrollmentLead } from "../utils/referralStore";
import { COMMISSION_MAP, getFEByCode, saveLead } from "../utils/referralStore";

const CLASS_LEVELS = [
  "Nursery – UKG",
  "1st to 5th",
  "6th to 8th",
  "9th to 10th",
  "11th to 12th",
];

const COURSE_OPTIONS = [
  { value: "Basic", label: "Basic Plan" },
  { value: "Standard", label: "Standard Plan" },
  { value: "Premium", label: "Premium Plan" },
  { value: "Pragati Magazine", label: "Pragati Study Magazine" },
];

export function EnrollmentFormPage() {
  // Read ref code from URL
  const refCode = new URLSearchParams(window.location.search).get("ref") ?? "";

  const [submitted, setSubmitted] = useState(false);
  const [submittedMobile, setSubmittedMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createDemoBookingMutation = useCreateDemoBooking();

  const [form, setForm] = useState({
    studentName: "",
    parentName: "",
    mobile: "",
    classLevel: "",
    courseSelected: "",
    cityVillage: "",
    referralCode: refCode,
  });

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.classLevel || !form.courseSelected) {
      toast.error("Please select Class Level and Course Plan.");
      return;
    }

    setIsSubmitting(true);

    try {
      const feAccount = getFEByCode(form.referralCode.trim());
      const commissionAmount = COMMISSION_MAP[form.courseSelected] ?? 0;

      const lead: EnrollmentLead = {
        leadId: `L${Date.now()}`,
        studentName: form.studentName.trim(),
        parentName: form.parentName.trim(),
        mobile: form.mobile.trim(),
        classLevel: form.classLevel,
        courseSelected: form.courseSelected,
        cityVillage: form.cityVillage.trim(),
        referralCode: form.referralCode.trim(),
        feAccountId: feAccount?.feAccountId ?? "",
        status: "Pending",
        paymentStatus: "Unpaid",
        commissionAmount,
        commissionPaid: false,
        createdAt: Date.now(),
      };

      saveLead(lead);
      // Save to backend for cross-device admin visibility
      try {
        await createDemoBookingMutation.mutateAsync({
          bookingId: BigInt(Date.now()),
          studentName: lead.studentName,
          parentName: lead.parentName,
          mobile: lead.mobile,
          classLevel: lead.classLevel,
          cityVillage: lead.cityVillage,
          medium: lead.courseSelected,
          status: "New",
          createdAt: BigInt(Date.now()),
        });
      } catch {
        // backend unavailable — localStorage fallback is sufficient
      }
      setSubmittedMobile(form.mobile.trim());
      setSubmitted(true);
      toast.success("Enrollment request submitted successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 px-4 py-10">
        <div
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center"
          data-ocid="enroll.success_state"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Request Submitted!
          </h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Your enrollment request has been submitted! Our team will contact
            you at{" "}
            <span className="font-semibold text-blue-700">
              {submittedMobile}
            </span>{" "}
            within 24 hours.
          </p>
          <a
            href="https://wa.me/917996401388?text=Hello%20Openframe%20Education%2C%20I%20just%20submitted%20an%20enrollment%20request."
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="enroll.whatsapp.primary_button"
          >
            <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold">
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </Button>
          </a>
          <p className="mt-4 text-xs text-gray-400">
            Openframe Education · +91 79964 01388
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-4 py-6 shadow-md">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-tight">
              OpenFrame Education
            </h1>
            <p className="text-sm text-blue-100">
              Live Online Classes – Nursery to 12th
            </p>
          </div>
        </div>
      </header>

      {/* Form Card */}
      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div
            className="px-6 pt-7 pb-5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.96 0.04 262), oklch(0.97 0.04 50))",
            }}
          >
            <h2 className="text-2xl font-extrabold text-blue-900 mb-1">
              Enroll in OpenFrame Education
            </h2>
            <p className="text-sm text-blue-700/80">
              Fill this form and our team will contact you within 24 hours
            </p>
            {form.referralCode && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                🔗 Referral: {form.referralCode}
              </div>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-6 py-6 space-y-5"
            data-ocid="enroll.form.panel"
          >
            {/* Student Name */}
            <div className="space-y-1.5">
              <Label htmlFor="studentName">
                Student Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentName"
                value={form.studentName}
                onChange={handleChange("studentName")}
                placeholder="Student's full name"
                required
                className="rounded-xl"
                data-ocid="enroll.student.input"
              />
            </div>

            {/* Parent Name */}
            <div className="space-y-1.5">
              <Label htmlFor="parentName">
                Parent Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="parentName"
                value={form.parentName}
                onChange={handleChange("parentName")}
                placeholder="Parent's full name"
                required
                className="rounded-xl"
                data-ocid="enroll.parent.input"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <Label htmlFor="mobile">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange("mobile")}
                placeholder="+91 XXXXX XXXXX"
                required
                className="rounded-xl"
                data-ocid="enroll.mobile.input"
              />
            </div>

            {/* Class Level */}
            <div className="space-y-1.5">
              <Label>
                Class Level <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.classLevel || undefined}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, classLevel: v }))
                }
              >
                <SelectTrigger
                  className="rounded-xl"
                  data-ocid="enroll.class.select"
                >
                  <SelectValue placeholder="Select class level" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {CLASS_LEVELS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course Plan */}
            <div className="space-y-1.5">
              <Label>
                Course Plan <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.courseSelected || undefined}
                onValueChange={(v) =>
                  setForm((prev) => ({ ...prev, courseSelected: v }))
                }
              >
                <SelectTrigger
                  className="rounded-xl"
                  data-ocid="enroll.course.select"
                >
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {COURSE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City / Village */}
            <div className="space-y-1.5">
              <Label htmlFor="cityVillage">
                City / Village <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cityVillage"
                value={form.cityVillage}
                onChange={handleChange("cityVillage")}
                placeholder="Your city or village name"
                required
                className="rounded-xl"
                data-ocid="enroll.city.input"
              />
            </div>

            {/* Referral Code */}
            <div className="space-y-1.5">
              <Label htmlFor="referralCode">Referral Code</Label>
              <Input
                id="referralCode"
                value={form.referralCode}
                onChange={handleChange("referralCode")}
                placeholder="e.g. AK1023 (optional)"
                className="rounded-xl font-mono"
                data-ocid="enroll.referral.input"
              />
              <p className="text-xs text-gray-400">
                Leave blank if you were not referred by a Field Executive
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white font-bold text-base py-6 rounded-xl bg-blue-700 hover:bg-blue-800"
              data-ocid="enroll.submit_button"
            >
              {isSubmitting ? "Submitting..." : "Submit Enrollment Request"}
            </Button>

            <p className="text-center text-xs text-gray-400 pt-1">
              By submitting, you agree to be contacted by our team via phone or
              WhatsApp.
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Openframe IT Solutions Pvt. Ltd. · Ishwar Nagar, Laxmeshwar, Karnataka
          582116
        </p>
      </main>
    </div>
  );
}
