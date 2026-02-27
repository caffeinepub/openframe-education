import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { motion } from "motion/react";
import { SAMPLE_PRICING_PLANS } from "../../data/sampleData";
import { useGetAllPricingPlans } from "../../hooks/useQueries";

const planIcons = ["🥉", "🥈", "🥇"];

export function PricingSection() {
  const { data: backendPlans } = useGetAllPricingPlans();
  const plans =
    backendPlans && backendPlans.length > 0
      ? backendPlans
      : SAMPLE_PRICING_PLANS;

  const handleEnroll = () => {
    const el = document.getElementById("demo");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-white" id="pricing">
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
            Pricing Plans
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            No hidden fees. No long-term commitments. Pay monthly and cancel
            anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, index) => {
            const isPopular = plan.isPopular;
            const amount = Number(plan.monthlyPrice);

            return (
              <motion.div
                key={plan.planId.toString()}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-3xl border flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  isPopular
                    ? "shadow-xl scale-105"
                    : "shadow-card hover:shadow-card-hover"
                }`}
                style={{
                  borderColor: isPopular
                    ? "oklch(0.68 0.19 50)"
                    : "oklch(0.9 0.02 255)",
                }}
              >
                {isPopular && (
                  <div
                    className="absolute top-0 left-0 right-0 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-white flex items-center justify-center gap-1"
                    style={{ background: "oklch(0.68 0.19 50)" }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    Most Popular
                  </div>
                )}

                <div
                  className={`px-6 pt-8 pb-6 ${isPopular ? "pt-10" : ""}`}
                  style={{
                    background: isPopular
                      ? "linear-gradient(135deg, oklch(0.45 0.18 262), oklch(0.33 0.17 265))"
                      : "white",
                  }}
                >
                  <div className="text-2xl mb-2">{planIcons[index]}</div>
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{
                      color: isPopular ? "white" : "oklch(0.18 0.04 265)",
                    }}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span
                      className="text-4xl font-bold"
                      style={{
                        color: isPopular ? "white" : "oklch(0.68 0.19 50)",
                      }}
                    >
                      ₹{amount}
                    </span>
                    <span
                      className="text-sm"
                      style={{
                        color: isPopular
                          ? "oklch(0.85 0.05 255)"
                          : "oklch(0.52 0.04 255)",
                      }}
                    >
                      /month
                    </span>
                  </div>
                  <p
                    className="text-xs"
                    style={{
                      color: isPopular
                        ? "oklch(0.85 0.05 255)"
                        : "oklch(0.52 0.04 255)",
                    }}
                  >
                    per student, all subjects included
                  </p>
                </div>

                <div className="px-6 py-6 flex flex-col flex-1 bg-white">
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-foreground/80"
                      >
                        <Check
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{ color: "oklch(0.55 0.16 165)" }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={handleEnroll}
                    size="lg"
                    className="w-full rounded-xl font-semibold text-white border-0"
                    style={{
                      background: isPopular
                        ? "oklch(0.68 0.19 50)"
                        : "oklch(0.45 0.18 262)",
                    }}
                  >
                    Book Free Demo
                  </Button>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    No advance payment required
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
