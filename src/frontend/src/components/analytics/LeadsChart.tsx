import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { week: "W1", leads: 8 },
  { week: "W2", leads: 12 },
  { week: "W3", leads: 9 },
  { week: "W4", leads: 15 },
  { week: "W5", leads: 11 },
  { week: "W6", leads: 18 },
  { week: "W7", leads: 14 },
  { week: "W8", leads: 21 },
];

const chartConfig: ChartConfig = {
  leads: { label: "Leads", color: "oklch(0.58 0.18 165)" },
};

export function LeadsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.02 255)" />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="leads"
            stroke="oklch(0.58 0.18 165)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "oklch(0.58 0.18 165)" }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
