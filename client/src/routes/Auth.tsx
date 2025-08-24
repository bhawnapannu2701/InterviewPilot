import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const nav = useNavigate();

  return (
    <div className="min-h-[calc(100vh-0px)] flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold tracking-tight">InterviewPilot</h1>

        <div className="flex gap-3 mb-2">
          <button
            className={`px-4 py-2 rounded-lg border ${mode === "signup" ? "bg-white/10" : "border-white/20"}`}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${mode === "login" ? "bg-white/10" : "border-white/20"}`}
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
        </div>

        {mode === "login" ? (
          <AuthCard title="Welcome back" subtitle="Sign in to continue">
            <LoginForm onSuccess={() => nav("/setup")} />
          </AuthCard>
        ) : (
          <AuthCard title="Create your account" subtitle="Takes less than a minute">
            <SignupForm onSuccess={() => nav("/setup")} />
          </AuthCard>
        )}
      </div>
    </div>
  );
}
