import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GradientButton from "../components/ui/GradientButton";
import GlassCard from "../components/layout/GlassCard";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ResultPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const tryUrls = [
        `${API}/api/v1/session/${id}/summary`,
        `${API}/api/v1/transcripts/${id}`,
        `${API}/api/transcripts/${id}`,
      ];
      for (const url of tryUrls) {
        try {
          const r = await fetch(url, { credentials: "include" });
          const j = await r.json();
          const data = j?.data?.summary || j?.data;
          if (data) {
            setSummary(data);
            break;
          }
        } catch {}
      }
      setLoading(false);
    })();
  }, [id]);

  const exportPdf = () => {
    const urls = [
      `${API}/api/v1/export/${id}/pdf`,
      `${API}/api/export/${id}/pdf`,
      `${API}/api/session/${id}/export/pdf`,
      `${API}/api/v1/export/pdf?id=${id}`,
    ];
    window.open(urls[0], "_blank") ||
      window.open(urls[1], "_blank") ||
      window.open(urls[2], "_blank") ||
      window.open(urls[3], "_blank");
  };

  if (loading) return <div className="p-10 text-center">Preparing your report…</div>;

  const breakdown = summary?.rubricAverages?.breakdown || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Interview Report</h1>
        <GradientButton onClick={exportPdf}>Export PDF</GradientButton>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-semibold mb-2">Readiness</h3>
          <div className="text-5xl font-bold">
            {Math.round((summary?.readinessIndex || 0) * 100)}%
          </div>
          <p className="text-white/70 mt-2">
            Average Score: {Math.round((summary?.avgScore || 0) * 100)}%
          </p>
          <p className="text-white/70">Attempts: {summary?.attempts || 0}</p>
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold mb-3">Rubric breakdown</h3>
          <ul className="space-y-2">
            {breakdown.map((b: any, i: number) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-32 text-white/80">{b.criterion}</div>
                <div className="flex-1 h-2 bg-white/10 rounded">
                  <div
                    className="h-2 bg-cyan-500 rounded"
                    style={{ width: `${Math.round((b.score || 0) * 100)}%` }}
                  />
                </div>
                <div className="w-12 text-right">
                  {Math.round((b.score || 0) * 100)}%
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
