import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Classes", href: "#classes" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Teachers", href: "#teachers" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-border">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-brand-blue tracking-tight">
                OpenFrame
              </span>
              <span className="text-xs font-semibold text-brand-orange tracking-wide">
                EDUCATION
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-brand-blue transition-colors rounded-md hover:bg-secondary"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/login" })}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Login
            </Button>
            <Button
              size="sm"
              onClick={() => handleNavClick("#demo-form")}
              className="bg-brand-orange hover:bg-brand-orange-dark text-white border-0"
              style={{ background: "oklch(0.68 0.19 50)", color: "white" }}
            >
              Book Free Demo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-white"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-3 py-2 text-sm font-medium text-foreground/70 hover:text-brand-blue hover:bg-secondary rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate({ to: "/login" });
                    setMenuOpen(false);
                  }}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full"
                >
                  Login
                </Button>
                <Button
                  onClick={() => handleNavClick("#demo-form")}
                  className="w-full text-white border-0"
                  style={{ background: "oklch(0.68 0.19 50)" }}
                >
                  Book Free Demo
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
