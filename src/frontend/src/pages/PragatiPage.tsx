import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  Globe2,
  GraduationCap,
  IndianRupee,
  Lightbulb,
  MessageCircle,
  Phone,
  ShoppingCart,
  Star,
  Target,
  Users,
} from "lucide-react";
import { type Variants, motion } from "motion/react";

const BUY_WHATSAPP =
  "https://wa.me/917996401388?text=I%20want%20to%20buy%20Pragati%20Study%20Magazine";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const subjects = [
  "General Knowledge",
  "Science",
  "Mathematics",
  "English",
  "Social Science",
];

const trustBadges = [
  { icon: IndianRupee, label: "Affordable Price" },
  { icon: BookOpen, label: "Quality Content" },
  { icon: Star, label: "Competitive Exam Ready" },
];

export function PragatiPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Simple Page Header */}
      <header className="bg-white border-b border-border shadow-xs sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-brand-blue transition-colors"
            data-ocid="pragati.home.link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to OpenFrame Education
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-xl flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-bold text-brand-blue tracking-tight">
                OpenFrame
              </span>
              <span className="text-[10px] font-semibold text-brand-orange tracking-wide">
                EDUCATION
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.96 0.04 255) 0%, oklch(0.99 0.01 60) 60%, oklch(0.97 0.03 50) 100%)",
        }}
        data-ocid="pragati.hero.section"
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: "oklch(0.45 0.18 262)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10 pointer-events-none"
          style={{ background: "oklch(0.68 0.19 50)" }}
        />

        <div className="container mx-auto px-4 relative">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeUp} className="mb-4">
              <Badge
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: "oklch(0.45 0.18 262)",
                  color: "white",
                  border: "none",
                }}
              >
                by Openframe Education
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight"
              style={{ color: "oklch(0.28 0.12 265)" }}
            >
              Pragati Study{" "}
              <span style={{ color: "oklch(0.68 0.19 50)" }}>Magazine</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl font-semibold mb-4"
              style={{ color: "oklch(0.45 0.18 262)" }}
            >
              Affordable Learning for Every Student
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-base text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Pragati Study Magazine is designed to help students improve
              knowledge in subjects like General Knowledge, Science,
              Mathematics, English, and Social Science. Our goal is to provide
              quality study material at a very affordable price.
            </motion.p>

            {/* Subject Badges */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {subjects.map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{
                    background: "oklch(0.93 0.04 255)",
                    color: "oklch(0.33 0.17 265)",
                  }}
                >
                  {s}
                </Badge>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <a
                href={BUY_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="pragati.hero.primary_button"
              >
                <Button
                  size="lg"
                  className="text-white font-semibold gap-2 w-full sm:w-auto shadow-orange"
                  style={{
                    background: "oklch(0.68 0.19 50)",
                    border: "none",
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Pragati Study Magazine
                </Button>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-6 mt-10"
            >
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm font-medium text-foreground/60"
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: "oklch(0.45 0.18 262)" }}
                  />
                  {label}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ARTICLE ──────────────────────────── */}
      <section
        className="py-16 md:py-24 bg-white"
        data-ocid="pragati.about.section"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-14"
          >
            {/* Intro */}
            <motion.div
              variants={fadeUp}
              className="text-center max-w-2xl mx-auto"
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
                style={{ color: "oklch(0.28 0.12 265)" }}
              >
                What is Pragati Study Magazine?
              </h2>
              <p className="text-foreground/70 leading-relaxed text-base md:text-lg">
                Pragati Study Magazine is an educational magazine developed to
                help students strengthen their knowledge in important academic
                subjects and general awareness. The magazine includes useful
                content that supports school studies, competitive exam
                preparation, and overall intellectual growth.
              </p>
              <p
                className="mt-4 font-semibold text-base"
                style={{ color: "oklch(0.45 0.18 262)" }}
              >
                Our mission is simple: to make quality education accessible and
                affordable for every student.
              </p>
            </motion.div>

            {/* Subjects Covered */}
            <motion.div variants={fadeUp}>
              <div
                className="rounded-2xl p-8 md:p-10"
                style={{ background: "oklch(0.96 0.04 255)" }}
              >
                <h3
                  className="text-2xl font-bold mb-2 text-center"
                  style={{ color: "oklch(0.28 0.12 265)" }}
                >
                  Subjects Covered
                </h3>
                <p className="text-center text-foreground/60 mb-8 text-sm">
                  Covering key subjects important for academic success and
                  knowledge development.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      icon: Globe2,
                      subject: "General Knowledge",
                      desc: "Current affairs and important facts",
                    },
                    {
                      icon: BrainCircuit,
                      subject: "Science",
                      desc: "Basic concepts and interesting scientific information",
                    },
                    {
                      icon: Calculator,
                      subject: "Mathematics",
                      desc: "Practice questions and problem-solving techniques",
                    },
                    {
                      icon: BookOpen,
                      subject: "English",
                      desc: "Grammar, vocabulary, and comprehension",
                    },
                    {
                      icon: Globe2,
                      subject: "Social Science",
                      desc: "History, geography, and civic knowledge",
                    },
                  ].map(({ icon: Icon, subject, desc }) => (
                    <div
                      key={subject}
                      className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-xs"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "oklch(0.93 0.04 255)" }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: "oklch(0.45 0.18 262)" }}
                        />
                      </div>
                      <div>
                        <p
                          className="font-semibold text-sm"
                          style={{ color: "oklch(0.28 0.12 265)" }}
                        >
                          {subject}
                        </p>
                        <p className="text-xs text-foreground/60 mt-0.5 leading-snug">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-foreground/60 mt-6">
                  These topics help students build a strong academic foundation
                  and improve their confidence in exams.
                </p>
              </div>
            </motion.div>

            {/* Affordable Price */}
            <motion.div variants={fadeUp}>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ color: "oklch(0.28 0.12 265)" }}
                  >
                    Affordable Price for Students
                  </h3>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    One of the main goals of Pragati Study Magazine is to make
                    learning affordable. The magazine is available at a very
                    reasonable price of{" "}
                    <span
                      className="font-bold"
                      style={{ color: "oklch(0.45 0.18 262)" }}
                    >
                      ₹200
                    </span>
                    , making it accessible to students from all backgrounds.
                  </p>
                  <p className="text-foreground/70 leading-relaxed">
                    By keeping the price low, we ensure that every student can
                    benefit from quality study material without financial
                    burden.
                  </p>
                </div>
                <div
                  className="rounded-2xl p-8 flex flex-col items-center justify-center text-center"
                  style={{ background: "oklch(0.96 0.06 60)" }}
                >
                  <IndianRupee
                    className="w-10 h-10 mb-3"
                    style={{ color: "oklch(0.68 0.19 50)" }}
                  />
                  <p
                    className="text-5xl font-bold"
                    style={{ color: "oklch(0.45 0.18 262)" }}
                  >
                    ₹200
                  </p>
                  <p className="text-sm text-foreground/60 mt-1">per copy</p>
                  <p
                    className="text-sm font-semibold mt-3"
                    style={{ color: "oklch(0.68 0.19 50)" }}
                  >
                    Accessible to every student
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Field Executive Opportunity */}
            <motion.div variants={fadeUp}>
              <div
                className="rounded-2xl p-8 md:p-10"
                style={{ background: "oklch(0.96 0.04 255)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.45 0.18 262)" }}
                  >
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: "oklch(0.28 0.12 265)" }}
                  >
                    Opportunity for Field Executives
                  </h3>
                </div>
                <p className="text-foreground/70 leading-relaxed">
                  Pragati Study Magazine also creates earning opportunities for
                  individuals who want to work in the education sector. People
                  can join Openframe Education as Field Executives and promote
                  the magazine in schools, colleges, and local communities.
                </p>
              </div>
            </motion.div>

            {/* Why Choose */}
            <motion.div variants={fadeUp}>
              <h3
                className="text-2xl font-bold mb-6 text-center"
                style={{ color: "oklch(0.28 0.12 265)" }}
              >
                Why Choose Pragati Study Magazine?
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: IndianRupee,
                    text: "Affordable and student-friendly pricing",
                  },
                  {
                    icon: BookOpen,
                    text: "Covers important academic subjects",
                  },
                  {
                    icon: Target,
                    text: "Helps improve knowledge and exam preparation",
                  },
                  {
                    icon: GraduationCap,
                    text: "Designed for students from all educational backgrounds",
                  },
                  {
                    icon: Users,
                    text: "Provides earning opportunities through field executive programs",
                  },
                ].map(({ text }) => (
                  <div
                    key={text}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white"
                  >
                    <CheckCircle2
                      className="w-5 h-5 mt-0.5 shrink-0"
                      style={{ color: "oklch(0.55 0.15 165)" }}
                    />
                    <span className="text-sm text-foreground/80 font-medium">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Our Vision */}
            <motion.div variants={fadeUp}>
              <div
                className="rounded-2xl p-8 md:p-10 text-center"
                style={{ background: "oklch(0.45 0.18 262)" }}
              >
                <Lightbulb className="w-10 h-10 mx-auto mb-4 text-white opacity-80" />
                <h3 className="text-2xl font-bold text-white mb-3">
                  Our Vision
                </h3>
                <p className="text-white/80 leading-relaxed max-w-2xl mx-auto mb-3">
                  At Openframe Education, our vision is to empower students with
                  knowledge and provide affordable learning solutions across
                  India. Pragati Study Magazine is one step towards building a
                  stronger educational foundation for students.
                </p>
                <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
                  We believe that every student deserves access to quality
                  learning resources, and Pragati Study Magazine is designed to
                  make that possible.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────── */}
      <section
        className="py-16 md:py-20 bg-white"
        data-ocid="pragati.pricing.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-xl mx-auto text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: "oklch(0.28 0.12 265)" }}
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={fadeUp} className="text-foreground/60 mb-10">
              One affordable plan — everything a student needs.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Card
                className="rounded-2xl shadow-card-hover border-2 overflow-hidden"
                style={{ borderColor: "oklch(0.68 0.19 50)" }}
              >
                {/* Header strip */}
                <div
                  className="py-3 px-6 text-white text-sm font-semibold text-center"
                  style={{ background: "oklch(0.68 0.19 50)" }}
                >
                  ⭐ Most Popular
                </div>
                <CardContent className="p-8 flex flex-col items-center gap-5">
                  <div className="flex items-end gap-1 leading-none">
                    <span
                      className="text-6xl font-bold"
                      style={{ color: "oklch(0.45 0.18 262)" }}
                    >
                      ₹200
                    </span>
                    <span className="text-foreground/50 text-base mb-2">
                      / copy
                    </span>
                  </div>

                  <ul className="text-left space-y-3 w-full max-w-xs">
                    {[
                      "Pragati Study Magazine (Full Copy)",
                      "General Knowledge, Science, Maths",
                      "English & Social Science modules",
                      "Academic + Competitive exam content",
                      "Easy-to-understand language",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle2
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{ color: "oklch(0.55 0.15 165)" }}
                        />
                        <span className="text-foreground/80">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={BUY_WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                    data-ocid="pragati.pricing.primary_button"
                  >
                    <Button
                      size="lg"
                      className="w-full font-semibold text-white gap-2"
                      style={{
                        background: "oklch(0.68 0.19 50)",
                        border: "none",
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy Now — ₹200
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────── */}
      <section className="py-14 bg-white" data-ocid="pragati.contact.section">
        <div className="container mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-lg mx-auto text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: "oklch(0.28 0.12 265)" }}
            >
              Get in Touch
            </motion.h2>
            <motion.p variants={fadeUp} className="text-foreground/60 mb-8">
              Have questions? We're happy to help via call or WhatsApp.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="bg-secondary rounded-2xl p-8 space-y-5"
            >
              <div className="space-y-1 text-left">
                <p className="text-xs text-foreground/50 uppercase tracking-widest font-semibold">
                  Organization
                </p>
                <p className="font-semibold text-foreground">
                  Openframe IT Solutions Pvt. Ltd.
                </p>
              </div>
              <div className="space-y-1 text-left">
                <p className="text-xs text-foreground/50 uppercase tracking-widest font-semibold">
                  Program
                </p>
                <p className="font-semibold text-foreground">
                  Openframe Education Initiative
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="tel:+917996401388"
                  className="flex-1"
                  data-ocid="pragati.contact.button"
                >
                  <Button
                    variant="outline"
                    className="w-full gap-2 font-semibold"
                    style={{
                      borderColor: "oklch(0.45 0.18 262)",
                      color: "oklch(0.45 0.18 262)",
                    }}
                  >
                    <Phone className="w-4 h-4" />
                    +91 7996401388
                  </Button>
                </a>
                <a
                  href="https://wa.me/917996401388"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                  data-ocid="pragati.contact.secondary_button"
                >
                  <Button
                    className="w-full gap-2 font-semibold text-white"
                    style={{
                      background: "oklch(0.52 0.18 145)",
                      border: "none",
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp Us
                  </Button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER STRIP ───────────────────────────── */}
      <footer
        className="py-6 border-t border-border"
        style={{ background: "oklch(0.97 0.02 255)" }}
      >
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-foreground/50">
          <p>
            © {new Date().getFullYear()} Openframe IT Solutions Pvt. Ltd. |
            Openframe Education Initiative
          </p>
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-brand-blue transition-colors font-medium"
            data-ocid="pragati.footer.link"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to OpenFrame Education
          </Link>
        </div>
      </footer>
    </div>
  );
}
