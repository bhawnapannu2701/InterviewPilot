import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { error as toastError } from "@/lib/toast";

interface ListResp {
  success: boolean;
  data: {
    total: number;
    page: number;
    pageSize: number;
    items: {
      id: string;
      startedAt: string;
      endedAt?: string;
      topics: string[];
      difficulty: string;
      duration: number;
      attempts: number;
      avgScore: number;
    }[];
  };
}

export default function Transcripts() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [resp, setResp] = useState<ListResp["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const r = await api<ListResp>(`/api/v1/transcripts?page=${page}&pageSize=${pageSize}`);
      if (!r.success) throw new Error("Failed to load transcripts");
      setResp(r.data);
    } catch (e: any) {
      toastError(e.message || "Could not load transcripts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Transcripts</h1>

      {loading && <div className="text-slate-300">Loading…</div>}

      {!loading && resp && (
        <>
          <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
            <table className="w-full bg-slate-900/40">
              <thead className="bg-slate-900/70 text-left text-sm">
                <tr>
                  <th className="px-3 py-2">Started</th>
                  <th className="px-3 py-2">Topics</th>
                  <th className="px-3 py-2">Difficulty</th>
                  <th className="px-3 py-2">Attempts</th>
                  <th className="px-3 py-2">Avg Score</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {resp.items.map((it) => (
                  <tr key={it.id} className="border-t border-white/5">
                    <td className="px-3 py-2">{new Date(it.startedAt).toLocaleString()}</td>
                    <td className="px-3 py-2">{it.topics.join(", ")}</td>
                    <td className="px-3 py-2">{it.difficulty}</td>
                    <td className="px-3 py-2">{it.attempts}</td>
                    <td className="px-3 py-2">{Math.round(it.avgScore * 100)}%</td>
                    <td className="px-3 py-2">
                      <Link
                        to={`/result/${it.id}`}
                        className="rounded-lg px-3 py-1 bg-slate-800 hover:bg-slate-700 transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {resp.items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-slate-300">
                      No transcripts yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-300">
              Page {resp.page} of {Math.max(1, Math.ceil(resp.total / resp.pageSize))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={resp.page <= 1}
                className="rounded-lg px-3 py-1 bg-slate-800 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={resp.page * resp.pageSize >= resp.total}
                className="rounded-lg px-3 py-1 bg-slate-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
