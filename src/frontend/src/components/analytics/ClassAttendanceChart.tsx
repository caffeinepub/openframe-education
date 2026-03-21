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
  { day: "Mon", present: 28, absent: 4 },
  { day: "Tue", present: 30, absent: 2 },
  { day: "Wed", present: 25, absent: 7 },
  { day: "Thu", present: 29, absent: 3 },
  { day: "Fri", present: 27, absent: 5 },
  { day: "Sat", present: 22, absent: 10 },
];

const chartConfig: ChartConfig = {
  present: { label: "Present", color: "oklch(0.58 0.18 165)" },
  absent: { label: "Absent", color: "oklch(0.6 0.22 15)" },
};

export function ClassAttendanceChart() {
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
            dataKey="present"
            stackId="a"
            fill="oklch(0.58 0.18 165)"
            radius={[0, 0, 0, 0]}
            animationDuration={800}
          />
          <Bar
            dataKey="absent"
            stackId="a"
            fill="oklch(0.6 0.22 15)"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
