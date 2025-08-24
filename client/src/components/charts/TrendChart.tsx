import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export interface TrendPoint { label: string; value: number; }

export default function TrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="label" stroke="#9CA3AF" />
          <YAxis domain={[0, 100]} stroke="#9CA3AF" />
          <Tooltip />
          <Line type="monotone" dataKey="value" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
