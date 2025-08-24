import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Setup from "./routes/Setup";
import Interview from "./routes/Interview";
import Result from "./routes/Result";
import Transcripts from "./routes/Transcripts";
import Auth from "./routes/Auth";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-surface text-slate-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/interview/:id" element={<Interview />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/transcripts" element={<Transcripts />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </div>
  );
}
