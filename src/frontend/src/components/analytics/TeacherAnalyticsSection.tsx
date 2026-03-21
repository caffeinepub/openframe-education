import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { AnalyticsCard, InsightBadge } from "./AnalyticsCard";
import { ClassAttendanceChart } from "./ClassAttendanceChart";
import { HomeworkCompletionChart } from "./HomeworkCompletionChart";
import { StudentPerformanceChart } from "./StudentPerformanceChart";

const CLASS_LEVELS = [
  "Nursery",
  "LKG",
  "UKG",
  "1st Standard",
  "2nd Standard",
  "3rd Standard",
  "4th Standard",
  "5th Standard",
  "6th Standard",
  "7th Standard",
  "8th Standard",
  "9th Standard",
  "10th Standard",
  "11th Standard",
  "12th Standard",
];

export function TeacherAnalyticsSection() {
  const [selectedClass, setSelectedClass] = useState("5th Standard");
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-6" data-ocid="teacher.analytics.section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Teacher Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Class performance & student insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger
              className="w-44 h-9 text-xs"
              data-ocid="teacher.analytics.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLASS_LEVELS.map((c) => (
                <SelectItem key={c} value={c} className="text-xs">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList className="h-9">
              <TabsTrigger value="week" className="text-xs px-3">
                This Week
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-3">
                This Month
              </TabsTrigger>
              <TabsTrigger value="term" className="text-xs px-3">
                This Term
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Insight Badge */}
      <div className="flex flex-wrap gap-2">
        <InsightBadge
          text={`⚠️ ${selectedClass} A attendance dropped 12% this week`}
          type="warning"
        />
        <InsightBadge
          text="📋 4 homework assignments pending grading"
          type="info"
        />
        <InsightBadge
          text="📈 Class average improved 6% vs last month"
          type="success"
        />
      </div>

      {/* Student Performance - full width */}
      <AnalyticsCard title="Student Performance Growth (Last 6 Exams)">
        <StudentPerformanceChart />
      </AnalyticsCard>

      {/* 2-column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsCard title="Weekly Class Attendance">
          <ClassAttendanceChart />
        </AnalyticsCard>
        <AnalyticsCard title="Homework Completion Rate">
          <HomeworkCompletionChart />
        </AnalyticsCard>
      </div>
    </div>
  );
}
