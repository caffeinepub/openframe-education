import { Star } from "lucide-react";
import { motion } from "motion/react";

const testimonials = [
  {
    name: "Kavitha",
    role: "Parent, Dharwad",
    text: "My daughter's marks improved dramatically after joining OpenFrame. The teachers are patient and the live classes are very effective. Best decision we made!",
    stars: 5,
    initials: "KD",
  },
  {
    name: "Ravi Kumar",
    role: "Parent, Gulbarga",
    text: "Affordable fees and excellent teachers. My son now studies with full concentration. I'm very happy with the progress reports we receive every month.",
    stars: 5,
    initials: "RK",
  },
  {
    name: "Preethi S",
    role: "Student, 10th Standard",
    text: "The doubt clearing sessions are very helpful. I was scoring 55% earlier and now I got 85% in my exams! OpenFrame Education changed my life.",
    stars: 5,
    initials: "PS",
  },
  {
    name: "Suresh M",
    role: "Parent, Hassan",
    text: "My son now studies with full concentration. The live classes are great and teachers give personal attention. Worth every rupee!",
    stars: 4,
    initials: "SM",
  },
  {
    name: "Ananya R",
    role: "Student, 8th Standard",
    text: "I love the recorded videos! I can revise the class anytime I want. The teachers explain very clearly in both Kannada and English.",
    stars: 5,
    initials: "AR",
  },
];

const avatarColors = [
  "oklch(0.45 0.18 262)",
  "oklch(0.68 0.19 50)",
  "oklch(0.55 0.16 165)",
  "oklch(0.62 0.2 320)",
  "oklch(0.6 0.22 15)",
];

export function TestimonialsSection() {
  return (
    <section
      className="py-20"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.14 0.04 265), oklch(0.18 0.04 265))",
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
              background: "oklch(0.25 0.06 265)",
              color: "oklch(0.82 0.15 60)",
            }}
          >
            Student Stories
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What Parents & Students Say
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Real stories from real students across Karnataka
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, text, stars, initials }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 cursor-default ${
                index === 2 ? "lg:col-span-1 sm:col-span-2 lg:col-auto" : ""
              }`}
              style={{
                background: "oklch(0.22 0.05 265)",
                borderColor: "oklch(0.28 0.06 265)",
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }, (_, i) => i).map((i) => (
                  <Star
                    key={`star-${i}`}
                    className="w-4 h-4"
                    style={{
                      color:
                        i < stars ? "oklch(0.82 0.18 80)" : "oklch(0.35 0 0)",
                      fill: i < stars ? "oklch(0.82 0.18 80)" : "none",
                    }}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/75 text-sm leading-relaxed mb-5">
                "{text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{
                    background: avatarColors[index % avatarColors.length],
                  }}
                >
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{name}</p>
                  <p className="text-xs text-white/50">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
