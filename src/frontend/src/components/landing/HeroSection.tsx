import { Button } from "@/components/ui/button";
import { Award, BadgeCheck, PlayCircle, Video } from "lucide-react";
import { motion } from "motion/react";

const trustBadges = [
  { icon: BadgeCheck, label: "Affordable Fees" },
  { icon: Video, label: "Live Classes" },
  { icon: Award, label: "Certified Teachers" },
  { icon: PlayCircle, label: "Recorded Sessions" },
];

export function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/hero-students.dim_1200x600.jpg"
          alt="Students learning online"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Decorative blobs */}
      <div
        className="absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "oklch(0.68 0.19 50)" }}
      />
      <div
        className="absolute bottom-20 left-10 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "oklch(0.62 0.14 255)" }}
      />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{
              background: "oklch(0.68 0.19 50 / 0.2)",
              borderColor: "oklch(0.68 0.19 50 / 0.4)",
              color: "oklch(0.92 0.1 55)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            🇮🇳 Trusted by 10,000+ Students Across Karnataka
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            <span
              className="block"
              style={{
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              OpenFrame Education
            </span>
            <span
              className="block text-3xl sm:text-4xl lg:text-5xl mt-1"
              style={{ color: "oklch(0.88 0.16 58)" }}
            >
              Learn Smart, Grow Smart
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/85 mb-8 max-w-2xl leading-relaxed"
          >
            Live Online Classes from Nursery to 12th – Affordable, Interactive &
            Trusted. Quality education for every child, from every village and
            city in Karnataka.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <Button
              size="lg"
              onClick={() => scrollTo("demo-form")}
              className="text-base font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{
                background: "oklch(0.45 0.18 262)",
                color: "white",
                border: "none",
              }}
            >
              📅 Book Free Demo
            </Button>
            <Button
              size="lg"
              onClick={() => scrollTo("pricing")}
              className="text-base font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{
                background: "oklch(0.68 0.19 50)",
                color: "white",
                border: "none",
              }}
            >
              🚀 Enroll Now
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "white",
                }}
              >
                <Icon className="w-4 h-4 text-yellow-300" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
