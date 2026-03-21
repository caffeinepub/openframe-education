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
  { month: "Jan", students: 120 },
  { month: "Feb", students: 145 },
  { month: "Mar", students: 138 },
  { month: "Apr", students: 162 },
  { month: "May", students: 175 },
  { month: "Jun", students: 190 },
  { month: "Jul", students: 185 },
  { month: "Aug", students: 210 },
  { month: "Sep", students: 228 },
  { month: "Oct", students: 245 },
  { month: "Nov", students: 238 },
  { month: "Dec", students: 265 },
];

const chartConfig: ChartConfig = {
  students: { label: "Students", color: "oklch(0.58 0.18 165)" },
};

export function EnrollmentChart() {
  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.02 255)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="students"
            stroke="oklch(0.58 0.18 165)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "oklch(0.58 0.18 165)" }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
