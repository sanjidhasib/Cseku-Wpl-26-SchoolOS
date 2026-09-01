type StatCardProps = {
  title: string;
  value: string;
  accent?: "purple" | "blue" | "green" | "orange" | "cyan" | "pink";
  icon?: string;
  trend?: string;
  trendDown?: boolean;
};

export default function StatCard({
  title,
  value,
  accent = "cyan",
  icon,
  trend,
  trendDown,
}: StatCardProps) {
  return (
    <div className={`stat-card ${accent}`}>
      {icon && <span className="stat-icon">{icon}</span>}
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div className={`stat-trend${trendDown ? " down" : ""}`}>
          {trendDown ? "↓" : "↑"} {trend}
        </div>
      )}
    </div>
  );
}
