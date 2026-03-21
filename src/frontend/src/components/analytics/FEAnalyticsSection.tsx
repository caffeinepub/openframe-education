import { useEffect, useState } from "react";
import {
  AnalyticsCard,
  AnalyticsStatCard,
  InsightBadge,
} from "./AnalyticsCard";
import { ConversionChart } from "./ConversionChart";
import { DailyVisitsChart } from "./DailyVisitsChart";
import { LeadsChart } from "./LeadsChart";

type CheckIn = {
  id: string;
  time: string;
  lat: number;
  lng: number;
  date: string;
  purpose: string;
  leadName: string;
};

function loadCheckIns(): CheckIn[] {
  try {
    const saved = localStorage.getItem("FE_GPS_CHECKINS");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function FEAnalyticsSection() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>(loadCheckIns);

  useEffect(() => {
    const refresh = () => setCheckIns(loadCheckIns());
    // Poll every 3 seconds for same-tab updates
    const interval = setInterval(refresh, 3000);
    // Also listen for cross-tab localStorage changes
    window.addEventListener("storage", refresh);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayCheckIns = checkIns.filter((c) => c.date === today);

  return (
    <div className="space-y-6" data-ocid="fe.analytics.section">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Analytics</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Visits, leads &amp; conversion performance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <AnalyticsStatCard
          label="Today's Check-ins"
          value={String(todayCheckIns.length)}
          icon="📍"
          trend={
            todayCheckIns.length > 0
              ? `${todayCheckIns.length} check-in(s) today`
              : "No check-ins yet today"
          }
          trendUp={todayCheckIns.length > 0}
        />
        <AnalyticsStatCard
          label="Total Check-ins"
          value={String(checkIns.length)}
          icon="🚶"
          trend={checkIns.length > 0 ? "Logged in system" : "Start checking in"}
          trendUp={checkIns.length > 0}
        />
        <AnalyticsStatCard
          label="Conversion Rate"
          value="42%"
          icon="🎯"
          trend="5% vs last week"
          trendUp={true}
        />
      </div>

      {/* Insight Badges */}
      <div className="flex flex-wrap gap-2">
        <InsightBadge text="📈 Leads up 21% vs last month" type="success" />
        <InsightBadge
          text="🎯 42% conversion rate — above average"
          type="success"
        />
        {todayCheckIns.length === 0 && (
          <InsightBadge
            text="⚠️ No GPS check-in recorded today"
            type="warning"
          />
        )}
      </div>

      {/* Daily Visits - full width */}
      <AnalyticsCard title="Daily Visits This Week">
        <DailyVisitsChart />
      </AnalyticsCard>

      {/* 2-column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsCard title="Leads Collected (Last 8 Weeks)">
          <LeadsChart />
        </AnalyticsCard>
        <AnalyticsCard title="Conversion Rate">
          <ConversionChart />
        </AnalyticsCard>
      </div>

      {/* Live Check-in Locations from real GPS data */}
      <AnalyticsCard title="Recent Check-in Locations">
        {checkIns.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-3xl mb-2">📍</p>
            <p className="font-medium text-gray-600">
              No check-ins recorded yet
            </p>
            <p className="text-sm mt-1">
              Use the GPS Check-In button on your dashboard to log a visit.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b"
                  style={{ borderColor: "oklch(0.93 0.02 255)" }}
                >
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">
                    Lead / Purpose
                  </th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">
                    Location
                  </th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">
                    Time
                  </th>
                  <th className="text-left py-2 text-gray-500 font-medium">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {checkIns.slice(0, 10).map((row) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-0"
                    style={{ borderColor: "oklch(0.95 0.02 255)" }}
                  >
                    <td className="py-2.5 pr-4 font-medium text-gray-900">
                      {row.leadName || row.purpose || "—"}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600 font-mono text-xs">
                      {row.lat.toFixed(4)}°N, {row.lng.toFixed(4)}°E
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600">{row.time}</td>
                    <td className="py-2.5 text-gray-500 text-xs">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AnalyticsCard>
    </div>
  );
}
