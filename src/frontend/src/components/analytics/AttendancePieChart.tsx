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
  { name: "present", label: "Present", value: 72 },
  { name: "absent", label: "Absent", value: 18 },
  { name: "late", label: "Late", value: 10 },
];

const chartConfig: ChartConfig = {
  present: { label: "Present", color: "oklch(0.58 0.18 165)" },
  absent: { label: "Absent", color: "oklch(0.6 0.22 15)" },
  late: { label: "Late", color: "oklch(0.68 0.19 50)" },
};

const COLORS = [
  "oklch(0.58 0.18 165)",
  "oklch(0.6 0.22 15)",
  "oklch(0.68 0.19 50)",
];

export function AttendancePieChart() {
  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={75}
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
