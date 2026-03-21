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
  { name: "Arjun", leads: 45 },
  { name: "Divya", leads: 38 },
  { name: "Suresh", leads: 52 },
  { name: "Meena", leads: 29 },
  { name: "Vikram", leads: 61 },
];

const COLORS = [
  "oklch(0.52 0.22 262)",
  "oklch(0.52 0.22 220)",
  "oklch(0.55 0.2 300)",
  "oklch(0.58 0.18 165)",
  "oklch(0.65 0.2 50)",
];

const chartConfig: ChartConfig = {
  leads: { label: "Leads Collected", color: "oklch(0.52 0.22 262)" },
};

export function FEPerformanceChart() {
  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.02 255)" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="leads" radius={[4, 4, 0, 0]} animationDuration={800}>
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
