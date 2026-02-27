import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export function CTASection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 overflow-hidden relative">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.45 0.18 262), oklch(0.33 0.17 265))",
        }}
      />
      {/* Decorative circles */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: "white" }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "oklch(0.68 0.19 50)" }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-4">
            Join the Community
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight max-w-3xl mx-auto">
            Join 10,000+ Students Learning with{" "}
            <span style={{ color: "oklch(0.88 0.16 58)" }}>
              OpenFrame Education
            </span>
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Start your child's journey toward academic excellence today.
            Affordable, trusted, and effective.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => scrollTo("pricing")}
              className="px-10 py-6 text-base font-bold rounded-xl shadow-orange hover:shadow-xl transition-all"
              style={{
                background: "oklch(0.68 0.19 50)",
                color: "white",
                border: "none",
              }}
            >
              🚀 Enroll Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("demo-form")}
              className="px-10 py-6 text-base font-semibold rounded-xl"
              style={{
                background: "transparent",
                border: "2px solid rgba(255,255,255,0.5)",
                color: "white",
              }}
            >
              📅 Book Free Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14">
            {[
              { value: "10,000+", label: "Students Enrolled" },
              { value: "50+", label: "Expert Teachers" },
              { value: "₹250", label: "Starting Monthly Fee" },
              { value: "100%", label: "Satisfaction Rate" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-white/60 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
