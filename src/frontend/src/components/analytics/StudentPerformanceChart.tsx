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
  { exam: "Exam 1", score: 62 },
  { exam: "Exam 2", score: 68 },
  { exam: "Exam 3", score: 71 },
  { exam: "Exam 4", score: 75 },
  { exam: "Exam 5", score: 79 },
  { exam: "Exam 6", score: 84 },
];

const chartConfig: ChartConfig = {
  score: { label: "Score (%)", color: "oklch(0.52 0.22 262)" },
};

export function StudentPerformanceChart() {
  return (
    <ChartContainer config={chartConfig} className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.02 255)" />
          <XAxis dataKey="exam" tick={{ fontSize: 11 }} />
          <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
          <ChartTooltip
            content={
              <ChartTooltipContent formatter={(v) => [`${v}%`, "Score"]} />
            }
          />
          <Line
            type="monotone"
            dataKey="score"
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
