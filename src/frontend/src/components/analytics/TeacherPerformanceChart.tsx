import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Priya", score: 88 },
  { name: "Rajesh", score: 75 },
  { name: "Sunita", score: 92 },
  { name: "Mohan", score: 68 },
  { name: "Kavitha", score: 85 },
];

const COLORS = [
  "oklch(0.52 0.22 262)",
  "oklch(0.58 0.18 165)",
  "oklch(0.65 0.2 50)",
  "oklch(0.55 0.2 300)",
  "oklch(0.52 0.22 220)",
];

const chartConfig: ChartConfig = {
  score: { label: "Performance Score (%)", color: "oklch(0.52 0.22 262)" },
};

export function TeacherPerformanceChart() {
  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.02 255)" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <ChartTooltip
            content={
              <ChartTooltipContent formatter={(v) => [`${v}%`, "Score"]} />
            }
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} animationDuration={800}>
            {data.map((entry, i) => (
              <Cell
                key={entry.name ?? String(i)}
                fill={COLORS[i % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
