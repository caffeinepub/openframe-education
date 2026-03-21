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
  { name: "present", label: "Present", value: 87 },
  { name: "absent", label: "Absent", value: 13 },
];

const COLORS = ["oklch(0.52 0.22 262)", "oklch(0.88 0.04 255)"];

const chartConfig: ChartConfig = {
  present: { label: "Present", color: "oklch(0.52 0.22 262)" },
  absent: { label: "Absent", color: "oklch(0.88 0.04 255)" },
};

export function AttendanceDonutChart() {
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
            innerRadius={45}
            outerRadius={72}
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
