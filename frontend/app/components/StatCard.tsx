type StatCardProps = {
  title: string;
  value: string;
  accent?: "purple" | "blue" | "green" | "orange" | "cyan";
};

export default function StatCard({ title, value, accent = "cyan" }: StatCardProps) {
  return (
    <div className={`stat-card ${accent}`}>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
