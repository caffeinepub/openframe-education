import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// Admin credentials (hashed for basic obfuscation)
const ADMIN_USERNAME = "akashrajnayak";
const ADMIN_PASSWORD = "Fucker@420";

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
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState("");
  const navigate = useNavigate();
  const { login, isLoggingIn, isLoginSuccess, isLoginError, identity } =
    useInternetIdentity();

  const selectedRoleData = roles.find((r) => r.value === selectedRole);
  const isAdminSelected = selectedRole === "admin";

  const handleLogin = async () => {
    if (!selectedRole) return;

    // Admin uses username/password
    if (isAdminSelected) {
      setAdminError("");
      if (
        adminUsername === ADMIN_USERNAME &&
        adminPassword === ADMIN_PASSWORD
      ) {
        sessionStorage.setItem("admin_auth", "true");
        navigate({ to: "/dashboard/admin" });
      } else {
        setAdminError("Invalid username or password.");
      }
      return;
    }

    // If already authenticated, go straight to dashboard
    if (identity) {
      navigate({ to: selectedRoleData!.route as "/" });
      return;
    }
    await login();
  };

  // Redirect after successful login
  useEffect(() => {
    if (isLoginSuccess && identity && selectedRoleData) {
      navigate({ to: selectedRoleData.route as "/" });
    }
  }, [isLoginSuccess, identity, selectedRoleData, navigate]);

  // Allow demo access without login
  const handleDemoAccess = () => {
    if (!selectedRoleData) return;
    if (isAdminSelected) {
      // Demo access bypasses admin auth for preview
      sessionStorage.setItem("admin_auth", "demo");
    }
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

            {/* Helper text when no role selected */}
            {!selectedRole && (
              <p className="text-center text-xs text-muted-foreground mb-4 -mt-2">
                Please select your role to continue
              </p>
            )}

            {/* Admin credentials form */}
            {isAdminSelected && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 space-y-3 p-4 rounded-xl border"
                style={{
                  borderColor: "oklch(0.88 0.04 262)",
                  background: "oklch(0.97 0.02 255)",
                }}
              >
                <p
                  className="text-xs font-semibold text-center mb-1"
                  style={{ color: "oklch(0.45 0.18 262)" }}
                >
                  Admin Login
                </p>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      data-ocid="admin.input"
                      type="text"
                      placeholder="Enter username"
                      value={adminUsername}
                      onChange={(e) => {
                        setAdminUsername(e.target.value);
                        setAdminError("");
                      }}
                      className="pl-8 h-9 text-sm rounded-lg"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      data-ocid="admin.input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        setAdminError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      className="pl-8 pr-9 h-9 text-sm rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                {adminError && (
                  <p
                    data-ocid="admin.error_state"
                    className="text-xs text-destructive text-center font-medium"
                  >
                    {adminError}
                  </p>
                )}
              </motion.div>
            )}

            {/* Login Button */}
            <Button
              data-ocid="login.primary_button"
              onClick={handleLogin}
              disabled={
                !selectedRole ||
                isLoggingIn ||
                (isAdminSelected && (!adminUsername || !adminPassword))
              }
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
              ) : isAdminSelected ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Login as Admin
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Login with Internet Identity
                </>
              )}
            </Button>

            {/* Demo Access - hide for admin */}
            {!isAdminSelected && (
              <Button
                data-ocid="login.secondary_button"
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
            )}

            {isLoginError && (
              <p className="text-center text-xs text-destructive mt-3">
                Login failed. Please try again.
              </p>
            )}

            <p className="text-center text-xs text-muted-foreground mt-4 leading-relaxed">
              {isAdminSelected
                ? "Admin access is protected. Contact support if you need help."
                : "OpenFrame uses Internet Identity for secure, password-free authentication."}
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
