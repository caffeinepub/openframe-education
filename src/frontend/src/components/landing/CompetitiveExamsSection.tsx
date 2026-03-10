import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
  Monitor,
  Star,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";

const examCategories = [
  {
    icon: GraduationCap,
    title: "School Entrance Exams",
    color: "oklch(0.45 0.18 262)",
    bgColor: "oklch(0.95 0.05 262)",
    items: [
      "Navodaya Entrance Exam (JNVST)",
      "Sainik School Entrance Exam",
      "Morarji Desai Residential School Entrance",
      "Kittur Rani Chennamma School Entrance",
      "Eklavya Model Residential School Entrance",
    ],
  },
  {
    icon: BookOpen,
    title: "Scholarship Exams",
    color: "oklch(0.55 0.18 50)",
    bgColor: "oklch(0.97 0.06 50)",
    items: [
      "NMMS Scholarship Exam",
      "NTSE Talent Search Exam",
      "KVPY Science Scholarship",
      "State Level Talent Exams",
    ],
  },
  {
    icon: Trophy,
    title: "Olympiad Exams",
    color: "oklch(0.45 0.16 145)",
    bgColor: "oklch(0.95 0.05 145)",
    items: [
      "International Mathematics Olympiad",
      "National Science Olympiad",
      "International English Olympiad",
      "Cyber Olympiad",
    ],
  },
];

const features = [
  {
    icon: Star,
    title: "Expert Guidance",
    description:
      "Learn from experienced educators who specialize in competitive exam preparation.",
  },
  {
    icon: BookOpen,
    title: "Study Materials & Mock Tests",
    description:
      "Comprehensive study resources, previous year papers, and timed mock tests.",
  },
  {
    icon: Monitor,
    title: "Online Learning Support",
    description:
      "Live and recorded sessions accessible from anywhere, anytime on any device.",
  },
  {
    icon: Award,
    title: "Certification & Skill Development",
    description:
      "Earn certificates and build essential skills for academic excellence.",
  },
];

export function CompetitiveExamsSection() {
  const router = useRouter();

  return (
    <section
      id="competitive-exams"
      className="overflow-hidden"
      data-ocid="competitive_exams.section"
    >
      {/* Hero Subsection */}
      <div
        className="relative py-20 px-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.20 0.12 262) 0%, oklch(0.30 0.15 240) 50%, oklch(0.25 0.10 280) 100%)",
        }}
      >
        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        {/* Decorative blobs */}
        <div
          className="absolute top-10 right-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "oklch(0.68 0.19 50)" }}
        />
        <div
          className="absolute bottom-10 left-16 w-56 h-56 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: "oklch(0.62 0.14 200)" }}
        />

        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              className="mb-5 px-4 py-2 text-sm font-semibold uppercase tracking-wide rounded-full border-0"
              style={{
                background: "oklch(0.68 0.19 50)",
                color: "white",
              }}
            >
              Competitive Exams Preparation Program (1st to 12th Standard)
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              Prepare for India's Top{" "}
              <span style={{ color: "oklch(0.88 0.16 58)" }}>
                Competitive Exams
              </span>
            </h2>

            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Training and guidance for students from Class 1 to Class 12 for
              entrance exams, scholarships, and Olympiads.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => router.navigate({ to: "/enroll" })}
                className="text-base font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                style={{
                  background: "oklch(0.68 0.19 50)",
                  color: "white",
                  border: "none",
                }}
                data-ocid="competitive_exams.hero.primary_button"
              >
                🎯 Register Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  window.open("https://wa.me/917996401388", "_blank")
                }
                className="text-base font-semibold px-8 py-6 rounded-xl transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  color: "white",
                }}
                data-ocid="competitive_exams.hero.secondary_button"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact on WhatsApp
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Exams We Cover */}
      <div
        className="py-16 px-4"
        style={{ background: "oklch(0.98 0.01 262)" }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h3
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "oklch(0.25 0.12 262)" }}
            >
              Exams We Cover
            </h3>
            <p className="text-base" style={{ color: "oklch(0.45 0.05 262)" }}>
              Comprehensive preparation for every major competitive exam path
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examCategories.map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                data-ocid={`competitive_exams.exam.item.${idx + 1}`}
              >
                <Card
                  className="h-full border-0 shadow-md hover:shadow-xl transition-shadow"
                  style={{ background: "white" }}
                >
                  <CardHeader className="pb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: cat.bgColor }}
                    >
                      <cat.icon
                        className="w-6 h-6"
                        style={{ color: cat.color }}
                      />
                    </div>
                    <CardTitle
                      className="text-lg font-bold"
                      style={{ color: cat.color }}
                    >
                      {cat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {cat.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm"
                          style={{ color: "oklch(0.35 0.06 262)" }}
                        >
                          <CheckCircle2
                            className="w-4 h-4 mt-0.5 shrink-0"
                            style={{ color: cat.color }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16 px-4" style={{ background: "white" }}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h3
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ color: "oklch(0.25 0.12 262)" }}
            >
              Why Choose Us
            </h3>
            <p className="text-base" style={{ color: "oklch(0.45 0.05 262)" }}>
              Everything you need to ace your competitive exams
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                data-ocid={`competitive_exams.feature.item.${idx + 1}`}
              >
                <div
                  className="p-6 rounded-2xl text-center h-full transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: "oklch(0.97 0.02 262)",
                    border: "1px solid oklch(0.90 0.04 262)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "oklch(0.45 0.18 262)" }}
                  >
                    <feat.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4
                    className="font-bold text-base mb-2"
                    style={{ color: "oklch(0.25 0.12 262)" }}
                  >
                    {feat.title}
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.45 0.05 262)" }}
                  >
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div
        className="relative py-16 px-4 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.68 0.19 50) 0%, oklch(0.72 0.20 45) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Start Your Competitive Exam Preparation Today
            </h3>
            <p className="text-white/85 text-base mb-8 max-w-xl mx-auto">
              Join thousands of students preparing for competitive exams with
              Openframe Education.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                onClick={() => router.navigate({ to: "/enroll" })}
                className="text-base font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                style={{
                  background: "oklch(0.25 0.12 262)",
                  color: "white",
                  border: "none",
                }}
                data-ocid="competitive_exams.cta.primary_button"
              >
                🎯 Register Now
              </Button>
              <Button
                size="lg"
                onClick={() =>
                  window.open("https://wa.me/917996401388", "_blank")
                }
                className="text-base font-semibold px-8 py-6 rounded-xl transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "white",
                }}
                data-ocid="competitive_exams.cta.secondary_button"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp 7996401388
              </Button>
            </div>

            <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              Powered by Openframe IT Solutions Pvt Ltd | DPIIT Recognized
              Startup – Education &amp; Skill Development
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
