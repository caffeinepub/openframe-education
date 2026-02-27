import {
  BookMarked,
  ClipboardCheck,
  HelpCircle,
  IndianRupee,
  Languages,
  PlayCircle,
  TrendingUp,
  Video,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Video,
    title: "Live Interactive Classes",
    description:
      "Real-time classes with experienced teachers, questions welcome anytime",
    color: "oklch(0.55 0.2 262)",
  },
  {
    icon: BookMarked,
    title: "Daily Homework",
    description:
      "Structured daily assignments to reinforce learning and build discipline",
    color: "oklch(0.68 0.19 50)",
  },
  {
    icon: ClipboardCheck,
    title: "Weekly Tests",
    description:
      "Regular chapter-wise tests to track progress and identify weak areas",
    color: "oklch(0.55 0.16 165)",
  },
  {
    icon: TrendingUp,
    title: "Parent Progress Report",
    description:
      "Monthly detailed performance reports shared directly with parents",
    color: "oklch(0.62 0.2 320)",
  },
  {
    icon: PlayCircle,
    title: "Recorded Videos",
    description: "Access class recordings anytime — revise at your own pace",
    color: "oklch(0.6 0.22 15)",
  },
  {
    icon: HelpCircle,
    title: "Doubt Clearing Sessions",
    description: "Dedicated doubt-solving hours so no question goes unanswered",
    color: "oklch(0.55 0.2 262)",
  },
  {
    icon: Languages,
    title: "English + Kannada Medium",
    description:
      "Classes available in both English and Kannada for better understanding",
    color: "oklch(0.68 0.19 50)",
  },
  {
    icon: IndianRupee,
    title: "Low Cost Monthly Plans",
    description:
      "Affordable fees starting at just ₹250/month — no hidden charges",
    color: "oklch(0.55 0.16 165)",
  },
];

export function FeaturesSection() {
  return (
    <section
      className="py-20"
      id="features"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.16 0.04 265), oklch(0.22 0.06 265))",
      }}
    >
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
              background: "oklch(0.28 0.06 265)",
              color: "oklch(0.82 0.15 60)",
            }}
          >
            Platform Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to{" "}
            <span style={{ color: "oklch(0.82 0.15 60)" }}>Succeed</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            A complete learning ecosystem designed for Indian students —
            interactive, affordable, and effective.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, description, color }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="group p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 cursor-default"
              style={{
                background: "oklch(0.22 0.06 265)",
                borderColor: "oklch(0.28 0.06 265)",
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color.replace(")", " / 0.15)")}` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm leading-snug">
                {title}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
