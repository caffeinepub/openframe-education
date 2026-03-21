import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { useState } from "react";
import {
  AnalyticsCard,
  AnalyticsStatCard,
  InsightBadge,
} from "./AnalyticsCard";
import { AttendancePieChart } from "./AttendancePieChart";
import { EnrollmentChart } from "./EnrollmentChart";
import { FEPerformanceChart } from "./FEPerformanceChart";
import { RevenueChart } from "./RevenueChart";
import { TeacherPerformanceChart } from "./TeacherPerformanceChart";

function downloadCSV() {
  const rows = [
    ["Month", "Revenue (INR)", "Students Enrolled"],
    ["Jan", 45000, 120],
    ["Feb", 52000, 145],
    ["Mar", 48000, 138],
    ["Apr", 61000, 162],
    ["May", 58000, 175],
    ["Jun", 72000, 190],
    ["Jul", 68000, 185],
    ["Aug", 79000, 210],
    ["Sep", 85000, 228],
    ["Oct", 91000, 245],
    ["Nov", 88000, 238],
    ["Dec", 96000, 265],
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "openframe-analytics.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminAnalyticsSection() {
  const [period, setPeriod] = useState("monthly");

  return (
    <div className="space-y-6" data-ocid="admin.analytics.section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Analytics Dashboard
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            OpenFrame Education — Key metrics & insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList className="h-9">
              <TabsTrigger value="daily" className="text-xs px-3">
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs px-3">
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs px-3">
                Monthly
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            size="sm"
            variant="outline"
            onClick={downloadCSV}
            className="gap-2 text-xs"
            data-ocid="admin.analytics.button"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsStatCard
          label="Total Students"
          value="265"
          icon="🎓"
          trend="18% this month"
          trendUp={true}
        />
        <AnalyticsStatCard
          label="Total Teachers"
          value="12"
          icon="👩‍🏫"
          trend="2 new this term"
          trendUp={true}
        />
        <AnalyticsStatCard
          label="Daily Revenue"
          value="₹3,200"
          icon="💰"
          trend="5% vs yesterday"
          trendUp={true}
        />
        <AnalyticsStatCard
          label="Active Classes"
          value="45"
          icon="📚"
          trend="3 low attendance"
          trendUp={false}
        />
      </div>

      {/* Insight Badges */}
      <div className="flex flex-wrap gap-2">
        <InsightBadge text="📈 Enrollments up 18% this month" type="success" />
        <InsightBadge text="💰 Revenue grew ₹8K vs last month" type="success" />
        <InsightBadge text="⚠️ 3 classes with low attendance" type="warning" />
        <InsightBadge
          text="📋 12 homework submissions pending review"
          type="info"
        />
      </div>

      {/* Revenue Chart - full width */}
      <AnalyticsCard title="Revenue Growth (Jan – Dec)">
        <RevenueChart />
      </AnalyticsCard>

      {/* 2-column row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsCard title="Student Enrollments">
          <EnrollmentChart />
        </AnalyticsCard>
        <AnalyticsCard title="Teacher Performance">
          <TeacherPerformanceChart />
        </AnalyticsCard>
      </div>

      {/* 2-column row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsCard title="Attendance Overview">
          <AttendancePieChart />
        </AnalyticsCard>
        <AnalyticsCard title="Field Executive Performance">
          <FEPerformanceChart />
        </AnalyticsCard>
      </div>
    </div>
  );
}
