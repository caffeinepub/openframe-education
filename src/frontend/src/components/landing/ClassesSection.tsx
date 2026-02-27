import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { SAMPLE_CLASS_LEVELS } from "../../data/sampleData";
import { useGetAllClassLevels } from "../../hooks/useQueries";

const classEmojis = ["🌱", "📚", "🔬", "🧪", "🎓"];

export function ClassesSection() {
  const { data: backendClasses } = useGetAllClassLevels();
  const classes =
    backendClasses && backendClasses.length > 0
      ? backendClasses
      : SAMPLE_CLASS_LEVELS;

  const scrollToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-white" id="classes">
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
            Classes We Offer
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            From Nursery to 12th Standard
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive curriculum covering State Board and CBSE syllabus.
            Choose the right class for your child.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {classes.map((cls, index) => (
            <motion.div
              key={cls.id.toString()}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div
                className="p-5 pb-4"
                style={{
                  background:
                    index === 4
                      ? "linear-gradient(135deg, oklch(0.45 0.18 262), oklch(0.33 0.17 265))"
                      : "linear-gradient(135deg, oklch(0.93 0.06 255), oklch(0.97 0.03 255))",
                }}
              >
                <span className="text-2xl mb-2 block">
                  {classEmojis[index]}
                </span>
                <h3
                  className="font-bold text-sm leading-tight"
                  style={{
                    color: index === 4 ? "white" : "oklch(0.33 0.17 265)",
                  }}
                >
                  {cls.name}
                </h3>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-4 flex-1">
                  <div className="flex items-center gap-1.5 mb-3">
                    <BookOpen
                      className="w-3.5 h-3.5"
                      style={{ color: "oklch(0.45 0.18 262)" }}
                    />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Subjects
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cls.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-2 py-0.5 text-xs rounded-full font-medium"
                        style={{
                          background: "oklch(0.95 0.04 255)",
                          color: "oklch(0.45 0.18 262)",
                        }}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fee */}
                <div
                  className="flex items-center justify-between mb-4 p-3 rounded-xl"
                  style={{ background: "oklch(0.97 0.02 255)" }}
                >
                  <span className="text-xs text-muted-foreground">
                    Monthly Fee
                  </span>
                  <span
                    className="font-bold text-lg"
                    style={{ color: "oklch(0.68 0.19 50)" }}
                  >
                    ₹{cls.monthlyFee.toString()}
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={scrollToPricing}
                  className="w-full rounded-xl group/btn text-white border-0 flex items-center justify-center gap-1"
                  style={{ background: "oklch(0.45 0.18 262)" }}
                >
                  Enroll Now
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
