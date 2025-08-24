import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, TimerReset, MessageSquareText, FileChartColumn } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {/* subtle gradient background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(37,99,235,0.25),rgba(34,211,238,0.08)_40%,transparent_70%)]" />

        <div className="mx-auto max-w-6xl px-6 pt-24 pb-16">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-semibold tracking-tight"
          >
            Your AI co‑pilot for <span className="text-brand">cracking interviews</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 max-w-2xl text-slate-300"
          >
            Practice realistic mock interviews with instant, rubric‑based feedback. Voice
            answers now, live audio later. Export recruiter‑ready reports.
          </motion.p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/auth">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative inline-flex items-center gap-2 rounded-2xl px-6 py-3 bg-brand text-white shadow-lg"
              >
                <span className="absolute inset-0 rounded-2xl btn-shimmer opacity-50" />
                <Sparkles className="h-5 w-5" />
                Get Started
              </motion.button>
            </Link>

            <Link to="/setup" className="text-slate-300 hover:text-white transition">
              Try a quick mock →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<TimerReset className="h-6 w-6 text-brand" />}
            title="Magic Timer"
            desc="A calm, animated timer with sparkles and focus states—keeps you in flow without stress."
          />
          <FeatureCard
            icon={<MessageSquareText className="h-6 w-6 text-brand" />}
            title="Amazing Chat"
            desc="Streaming Q&A, hints on tap, and evidence‑based scoring for every answer."
          />
          <FeatureCard
            icon={<FileChartColumn className="h-6 w-6 text-brand" />}
            title="Recruiter‑ready Reports"
            desc="Export a clean PDF with strengths, weaknesses, and a readiness index."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl bg-surface/60 ring-1 ring-white/5 p-5 hover:-translate-y-0.5 hover:shadow-lg transition"
    >
      <div className="flex items-center gap-3">
        <div className="grid place-items-center h-10 w-10 rounded-xl bg-brand/10">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-300">{desc}</p>
    </motion.div>
  );
}
