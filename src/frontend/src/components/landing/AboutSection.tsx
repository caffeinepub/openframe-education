import { BarChart3, ClipboardCheck, HelpCircle, Monitor } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Monitor,
    title: "Live Learning",
    description: "Interactive live sessions with real-time Q&A and whiteboard",
  },
  {
    icon: HelpCircle,
    title: "Doubt Solving",
    description: "Dedicated doubt clearing sessions after every class",
  },
  {
    icon: ClipboardCheck,
    title: "Weekly Tests",
    description: "Regular assessments to track learning progress",
  },
  {
    icon: BarChart3,
    title: "Performance Reports",
    description: "Detailed monthly reports shared with parents",
  },
];

export function AboutSection() {
  return (
    <section className="py-20 section-blue-bg" id="about">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 uppercase tracking-wider"
              style={{
                background: "oklch(0.95 0.04 255)",
                color: "oklch(0.45 0.18 262)",
              }}
            >
              About OpenFrame Education
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-5 leading-tight">
              Education for Every Child,{" "}
              <span className="text-brand-blue">Everywhere</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              OpenFrame Education was founded with a single mission: to make
              quality education accessible to every child — whether in a
              bustling city or a remote Karnataka village. We bridge the gap
              between urban and rural education through technology.
            </p>
            <ul className="space-y-3">
              {[
                "Affordable monthly fees from ₹250 to ₹500 only",
                "Live interactive classes in English & Kannada medium",
                "Small batch sizes for personal attention",
                "Expert trained, certified teachers",
                "Both State Board and CBSE syllabus covered",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shrink-0 mt-0.5"
                    style={{ background: "oklch(0.45 0.18 262)" }}
                  >
                    ✓
                  </span>
                  <span className="text-foreground/80 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "oklch(0.93 0.06 255)" }}
                >
                  <Icon
                    className="w-6 h-6 text-brand-blue"
                    style={{ color: "oklch(0.45 0.18 262)" }}
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-1 text-sm">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
