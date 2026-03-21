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
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 58000 },
  { month: "Jun", revenue: 72000 },
  { month: "Jul", revenue: 68000 },
  { month: "Aug", revenue: 79000 },
  { month: "Sep", revenue: 85000 },
  { month: "Oct", revenue: 91000 },
  { month: "Nov", revenue: 88000 },
  { month: "Dec", revenue: 96000 },
];

const chartConfig: ChartConfig = {
  revenue: { label: "Revenue (₹)", color: "oklch(0.52 0.22 262)" },
};

export function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.02 255)" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(v) => [
                  `₹${Number(v).toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="oklch(0.52 0.22 262)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "oklch(0.52 0.22 262)" }}
            activeDot={{ r: 6 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
