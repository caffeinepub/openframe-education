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
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", visits: 7 },
  { day: "Tue", visits: 5 },
  { day: "Wed", visits: 9 },
  { day: "Thu", visits: 6 },
  { day: "Fri", visits: 11 },
  { day: "Sat", visits: 4 },
];

const chartConfig: ChartConfig = {
  visits: { label: "Visits", color: "oklch(0.52 0.22 262)" },
};

export function DailyVisitsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.02 255)" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="visits"
            fill="oklch(0.52 0.22 262)"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
