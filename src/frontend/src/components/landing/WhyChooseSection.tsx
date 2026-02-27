import {
  BarChart3,
  GraduationCap,
  Heart,
  IndianRupee,
  MapPin,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const reasons = [
  {
    icon: IndianRupee,
    title: "Affordable Pricing",
    description:
      "Plans from ₹250–₹500/month — less than 1 hour of tuition cost",
    highlight: "₹250 – ₹500/month",
  },
  {
    icon: MapPin,
    title: "Rural Village Focus",
    description:
      "Specially designed for students in villages and tier-2/3 cities of Karnataka",
    highlight: "Village to City",
  },
  {
    icon: GraduationCap,
    title: "Expert Trained Teachers",
    description:
      "All teachers are trained, verified, and passionate about student success",
    highlight: "100% Verified",
  },
  {
    icon: Users,
    title: "Small Batch Size",
    description:
      "Limited students per batch ensures personal attention for every child",
    highlight: "Max 15 per batch",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description:
      "Real-time dashboard for parents to track their child's progress",
    highlight: "Live Dashboard",
  },
  {
    icon: Heart,
    title: "Scholarship Support",
    description: "NGO support and scholarship programs for deserving students",
    highlight: "NGO Partnered",
  },
];

export function WhyChooseSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider"
            style={{
              background: "oklch(0.95 0.04 255)",
              color: "oklch(0.45 0.18 262)",
            }}
          >
            Why Choose Us
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why OpenFrame Education?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We're not just another online class platform. We're a movement to
            make quality education reach every corner of Karnataka.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(
            ({ icon: Icon, title, description, highlight }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group p-6 rounded-2xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-default relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                  style={{ background: "oklch(0.45 0.18 262)" }}
                />
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "oklch(0.93 0.06 255)" }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: "oklch(0.45 0.18 262)" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {description}
                    </p>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: "oklch(0.95 0.05 50)",
                        color: "oklch(0.58 0.2 45)",
                      }}
                    >
                      {highlight}
                    </span>
                  </div>
                </div>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
