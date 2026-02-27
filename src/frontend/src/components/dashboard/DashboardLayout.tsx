import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, GraduationCap, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  dashboardRole: string;
  navItems: NavItem[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  children: React.ReactNode;
}

export function DashboardLayout({
  title,
  subtitle,
  dashboardRole,
  navItems,
  activeSection,
  onSectionChange,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clear, identity } = useInternetIdentity();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await clear();
    navigate({ to: "/" });
  };

  const roleBgColors: Record<string, string> = {
    admin: "oklch(0.45 0.18 262)",
    student: "oklch(0.55 0.16 165)",
    parent: "oklch(0.68 0.19 50)",
    teacher: "oklch(0.6 0.22 15)",
    "field-exec": "oklch(0.62 0.2 320)",
  };

  const roleColor = roleBgColors[dashboardRole] || "oklch(0.45 0.18 262)";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-4 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/90 leading-none">
              OpenFrame
            </p>
            <p className="text-xs text-white/50 leading-none mt-0.5">
              EDUCATION
            </p>
          </div>
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-white/10">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: `${roleColor.replace(")", " / 0.3)")}`,
            color: "white",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: roleColor }}
          />
          {title}
        </div>
        {identity && (
          <p className="text-xs text-white/40 mt-1 truncate">
            {identity.getPrincipal().toString().slice(0, 16)}...
          </p>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  onSectionChange(item.id);
                  setSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  background:
                    activeSection === item.id
                      ? `${roleColor.replace(")", " / 0.25)")}`
                      : "transparent",
                  color:
                    activeSection === item.id
                      ? "white"
                      : "rgba(255,255,255,0.6)",
                  borderLeft:
                    activeSection === item.id
                      ? `3px solid ${roleColor}`
                      : "3px solid transparent",
                }}
              >
                <span className="w-4 h-4 shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {activeSection === item.id && (
                  <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-white/60 hover:text-white hover:bg-white/10"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "oklch(0.97 0.01 255)" }}
    >
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex w-60 flex-col fixed left-0 top-0 bottom-0 z-40"
        style={{ background: "oklch(0.18 0.04 265)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-60 z-50 lg:hidden flex flex-col"
              style={{ background: "oklch(0.18 0.04 265)" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top Header */}
        <header
          className="sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6 h-14 border-b"
          style={{ background: "white", borderColor: "oklch(0.93 0.02 255)" }}
        >
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1">
            <h1 className="text-sm font-bold text-foreground">{subtitle}</h1>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-xs">Logout</span>
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
