interface AnalyticsCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function AnalyticsCard({
  title,
  children,
  className = "",
}: AnalyticsCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm p-5 ${className}`}
      style={{ borderColor: "oklch(0.93 0.02 255)" }}
    >
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}

export function AnalyticsStatCard({
  label,
  value,
  icon,
  trend,
  trendUp,
}: StatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl border shadow-sm p-5 flex items-start gap-4"
      style={{ borderColor: "oklch(0.93 0.02 255)" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: "oklch(0.95 0.04 255)" }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p
            className={`text-xs mt-1 font-medium ${trendUp ? "text-green-600" : "text-red-500"}`}
          >
            {trendUp ? "▲" : "▼"} {trend}
          </p>
        )}
      </div>
    </div>
  );
}

interface InsightBadgeProps {
  text: string;
  type?: "info" | "warning" | "success";
}

export function InsightBadge({ text, type = "info" }: InsightBadgeProps) {
  const styles = {
    info: "bg-blue-50 text-blue-700 border-blue-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    success: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${styles[type]}`}
    >
      {text}
    </span>
  );
}
