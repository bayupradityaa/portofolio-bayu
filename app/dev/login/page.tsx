"use client";

import { useState } from "react";
import { signIn } from "@/lib/actions/auth";
import { LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn(email, password);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#22c55e]">
            <span className="text-lg font-bold text-[#04120a]">B</span>
          </div>
          <h1 className="text-xl font-semibold text-[#fafafa]">Portfolio CMS</h1>
          <p className="mt-1 text-sm text-[#71717a]">Sign in to admin dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-[#a1a1aa]">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#27272a] bg-[#111113] px-4 py-3 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-[#a1a1aa]">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#27272a] bg-[#111113] px-4 py-3 text-sm text-[#fafafa] placeholder:text-[#71717a] focus:border-[#22c55e] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] px-4 py-3 text-sm font-semibold text-[#04120a] transition-colors hover:bg-[#4ade80] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
            <LogIn size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
