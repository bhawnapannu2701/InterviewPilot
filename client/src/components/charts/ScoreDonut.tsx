import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function ScoreDonut({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const data = [
    { name: "Score", value: pct },
    { name: "Rest", value: 100 - pct },
  ];
  const colors = ["#22C55E", "#1E293B"];

  return (
    <div className="relative h-44">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={"70%"} outerRadius={"95%"} dataKey="value" startAngle={90} endAngle={-270}>
            {data.map((_, i) => <Cell key={i} fill={colors[i]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center text-2xl font-semibold">
        {pct}%
      </div>
    </div>
  );
}
