import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const data = [
  { name: "converted", label: "Converted", value: 42 },
  { name: "pending", label: "Pending", value: 35 },
  { name: "lost", label: "Lost", value: 23 },
];

const COLORS = [
  "oklch(0.58 0.18 165)",
  "oklch(0.68 0.19 50)",
  "oklch(0.6 0.22 15)",
];

const chartConfig: ChartConfig = {
  converted: { label: "Converted", color: "oklch(0.58 0.18 165)" },
  pending: { label: "Pending", color: "oklch(0.68 0.19 50)" },
  lost: { label: "Lost", color: "oklch(0.6 0.22 15)" },
};

export function ConversionChart() {
  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="42%"
            outerRadius={70}
            animationDuration={800}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name ?? String(i)} fill={COLORS[i]} />
            ))}
          </Pie>
          <ChartTooltip
            content={<ChartTooltipContent formatter={(v) => [`${v}%`, ""]} />}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
