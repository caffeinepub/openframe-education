import {
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

const currentYear = new Date().getFullYear();
const hostname =
  typeof window !== "undefined"
    ? window.location.hostname
    : "openframeeducation.in";

export function Footer() {
  return (
    <footer
      className="relative bg-brand-blue-dark text-white"
      id="contact"
      style={{ background: "oklch(0.22 0.06 265)" }}
    >
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold text-white tracking-tight">
                  OpenFrame
                </span>
                <span
                  className="text-xs font-semibold tracking-wide"
                  style={{ color: "oklch(0.82 0.15 60)" }}
                >
                  EDUCATION
                </span>
              </div>
            </div>
            <p className="text-sm text-white/70 mb-5 leading-relaxed">
              Quality education for every child — from village to city.
              Affordable live classes, dedicated teachers, and proven results.
            </p>
            <div className="flex gap-3">
              {[
                {
                  Icon: SiFacebook,
                  href: "https://facebook.com",
                  label: "Facebook",
                },
                {
                  Icon: SiInstagram,
                  href: "https://instagram.com",
                  label: "Instagram",
                },
                {
                  Icon: SiYoutube,
                  href: "https://youtube.com",
                  label: "YouTube",
                },
                { Icon: SiX, href: "https://x.com", label: "Twitter" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                "About Us",
                "Courses",
                "Pricing",
                "Teachers",
                "Careers",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="/"
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Classes */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Our Classes
            </h3>
            <ul className="space-y-2.5">
              {[
                "Nursery – UKG",
                "Class 1st to 5th",
                "Class 6th to 8th",
                "Class 9th to 10th",
                "Class 11th – 12th",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#classes"
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: "oklch(0.82 0.15 60)" }}
                />
                <a
                  href="tel:+917996401388"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  +91 79964 01388
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: "oklch(0.82 0.15 60)" }}
                />
                <a
                  href="mailto:info@openframeeducation.in"
                  className="text-sm text-white/70 hover:text-white transition-colors break-all"
                >
                  info@openframeeducation.in
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: "oklch(0.82 0.15 60)" }}
                />
                <span className="text-sm text-white/70">
                  Ishwar Nagar, Laxmeshwar,
                  <br />
                  TQ-Laxmeshwar, Dist Gadag,
                  <br />
                  Karnataka 582116
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {currentYear} OpenFrame Education. All rights reserved.
          </p>
          <p className="text-xs text-white/50">
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/80 underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/917996401388"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        style={{ background: "#25D366" }}
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </footer>
  );
}
