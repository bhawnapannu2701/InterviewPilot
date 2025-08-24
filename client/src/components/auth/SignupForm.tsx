import { useState } from "react";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const j = await res.json();
      if (j?.success === false) {
        alert(j?.message || "Signup failed");
      } else {
        onSuccess();
      }
    } catch (err: any) {
      alert(err?.message || "Signup error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm text-white/70">Name</label>
        <input
          className="w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-cyan-400/50"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm text-white/70">Email</label>
        <input
          className="w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-cyan-400/50"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm text-white/70">Password</label>
        <input
          className="w-full mt-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-cyan-400/50"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg px-5 py-2 font-medium text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:opacity-95 transition disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
