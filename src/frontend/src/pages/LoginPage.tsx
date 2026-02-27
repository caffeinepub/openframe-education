import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const roles = [
  {
    value: "student",
    label: "Student",
    icon: "🎓",
    desc: "Access classes, homework, results",
    route: "/dashboard/student",
  },
  {
    value: "parent",
    label: "Parent",
    icon: "👨‍👩‍👦",
    desc: "Track your child's progress",
    route: "/dashboard/parent",
  },
  {
    value: "teacher",
    label: "Teacher",
    icon: "👩‍🏫",
    desc: "Manage classes and students",
    route: "/dashboard/teacher",
  },
  {
    value: "field-exec",
    label: "Field Executive",
    icon: "🤝",
    desc: "Track referrals and commissions",
    route: "/dashboard/field-exec",
  },
  {
    value: "admin",
    label: "Admin",
    icon: "⚙️",
    desc: "Full platform management",
    route: "/dashboard/admin",
  },
];

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  const { login, isLoggingIn, isLoginSuccess, isLoginError, identity } =
    useInternetIdentity();

  const selectedRoleData = roles.find((r) => r.value === selectedRole);

  const handleLogin = async () => {
    if (!selectedRole) return;
    await login();
  };

  // Redirect after successful login
  if (isLoginSuccess && identity && selectedRoleData) {
    setTimeout(() => navigate({ to: selectedRoleData.route as "/" }), 100);
  }

  // Allow demo access without login
  const handleDemoAccess = () => {
    if (!selectedRoleData) return;
    navigate({ to: selectedRoleData.route as "/" });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.93 0.06 255), oklch(0.99 0 0) 60%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Back to home */}
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl border overflow-hidden"
          style={{ borderColor: "oklch(0.93 0.02 255)" }}
        >
          {/* Header */}
          <div
            className="p-8 text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.45 0.18 262), oklch(0.33 0.17 265))",
            }}
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome Back!
            </h1>
            <p className="text-white/70 text-sm">
              Login to OpenFrame Education
            </p>
          </div>

          <div className="p-8">
            {/* Role Selector */}
            <div className="space-y-3 mb-6">
              <Label className="text-sm font-semibold">I am a...</Label>
              <div className="grid grid-cols-1 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-150"
                    style={{
                      borderColor:
                        selectedRole === role.value
                          ? "oklch(0.45 0.18 262)"
                          : "oklch(0.93 0.02 255)",
                      background:
                        selectedRole === role.value
                          ? "oklch(0.95 0.04 255)"
                          : "transparent",
                    }}
                  >
                    <span className="text-xl shrink-0">{role.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold"
                        style={{
                          color:
                            selectedRole === role.value
                              ? "oklch(0.33 0.17 265)"
                              : "oklch(0.3 0.02 255)",
                        }}
                      >
                        {role.label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {role.desc}
                      </p>
                    </div>
                    {selectedRole === role.value && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: "oklch(0.45 0.18 262)" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={!selectedRole || isLoggingIn}
              className="w-full h-12 rounded-xl font-semibold text-white border-0 mb-3"
              style={{
                background: selectedRole
                  ? "oklch(0.45 0.18 262)"
                  : "oklch(0.8 0.01 255)",
                cursor: selectedRole ? "pointer" : "not-allowed",
              }}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Login with Internet Identity
                </>
              )}
            </Button>

            {/* Demo Access */}
            <Button
              variant="outline"
              onClick={handleDemoAccess}
              disabled={!selectedRole}
              className="w-full h-11 rounded-xl font-medium"
              style={{
                borderColor: "oklch(0.9 0.02 255)",
                opacity: selectedRole ? 1 : 0.5,
              }}
            >
              🚀 Demo Access (No Login Required)
            </Button>

            {isLoginError && (
              <p className="text-center text-xs text-destructive mt-3">
                Login failed. Please try again.
              </p>
            )}

            <p className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
              OpenFrame uses Internet Identity for secure, password-free
              authentication.
            </p>
          </div>
        </motion.div>

        {/* Trust note */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          🔒 Your data is secure and encrypted on the Internet Computer
        </p>
      </div>
    </div>
  );
}
