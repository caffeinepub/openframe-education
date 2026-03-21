import { AnalyticsCard, InsightBadge } from "./AnalyticsCard";
import { AttendanceDonutChart } from "./AttendanceDonutChart";
import { StudentPerformanceChart } from "./StudentPerformanceChart";
import { SubjectMarksChart } from "./SubjectMarksChart";

export function StudentAnalyticsSection() {
  return (
    <div className="space-y-6" data-ocid="student.analytics.section">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Analytics</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Your personal performance & attendance insights
        </p>
      </div>

      {/* Insight Badge */}
      <div className="flex flex-wrap gap-2">
        <InsightBadge text="📈 Improved 8% vs last month" type="success" />
        <InsightBadge text="✅ Attendance: 87% — Keep it up!" type="success" />
        <InsightBadge text="📝 2 homework assignments pending" type="warning" />
      </div>

      {/* Performance growth - full width */}
      <AnalyticsCard title="Performance Growth (Last 6 Exams)">
        <StudentPerformanceChart />
      </AnalyticsCard>

      {/* 2-column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsCard title="Subject-wise Marks">
          <SubjectMarksChart />
        </AnalyticsCard>
        <AnalyticsCard title="Attendance This Term">
          <AttendanceDonutChart />
        </AnalyticsCard>
      </div>
    </div>
  );
}
