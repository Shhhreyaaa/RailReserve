"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Train, ShieldAlert, Loader } from "lucide-react";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) throw new Error("Full Name is required.");
        if (loginId.length < 3) throw new Error("Login ID must be at least 3 characters.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        await register(loginId, password, fullName, email || undefined, phone || undefined);
      } else {
        if (!loginId.trim()) throw new Error("Login ID is required.");
        if (!password) throw new Error("Password is required.");
        await login(loginId, password);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4 relative overflow-hidden select-none">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-2xl z-10 transition-all">
        {/* Logo/Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 border border-yellow-500/20 mb-2">
            <Train className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-slate-100">
            Rail<span className="text-yellow-500">Reserve</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Online Train Reservation System</p>
        </div>

        {/* Section title */}
        <h2 className="text-xl font-semibold mb-4 text-center text-slate-200">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-sm">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-lg px-4 py-2.5 text-sm outline-none transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Login ID / Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. johndoe123"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-lg px-4 py-2.5 text-sm outline-none transition"
            />
          </div>

          {isSignUp && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-lg px-3 py-2 text-sm outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-lg px-3 py-2 text-sm outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-lg px-4 py-2.5 text-sm outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98] text-slate-950 font-bold py-2.5 px-4 rounded-lg transition duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setError(null);
                }}
                className="text-yellow-500 hover:underline font-semibold"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to RailReserve?{" "}
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setError(null);
                }}
                className="text-yellow-500 hover:underline font-semibold"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
