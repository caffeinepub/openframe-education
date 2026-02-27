interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  color,
  subtitle,
  trend,
}: StatsCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all duration-200"
      style={{ borderColor: "oklch(0.93 0.02 255)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg"
          style={{ background: color }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              background: "oklch(0.93 0.08 165 / 0.3)",
              color: "oklch(0.45 0.15 165)",
            }}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground mb-0.5">{value}</p>
      <p className="text-sm font-medium text-foreground/70">{title}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
