
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  Sparkles,
  Brain,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    setSuccess(true);
    setMessage(
      "Your login form is valid! Real account authentication will be connected in a later step."
    );
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-6xl relative z-10">
        {/* BACK BUTTON */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* LEFT SIDE - LOGIN FORM */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            {/* LOGO */}
            <Link href="/" className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Brain size={25} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-wide">
                  StudySphere <span className="text-purple-400">AI</span>
                </h1>
                <p className="text-xs text-gray-500">
                  Your intelligent learning partner
                </p>
              </div>
            </Link>

            {/* FORM CARD */}
            <div className="rounded-3xl border border-white/10 bg-[#111120]/90 backdrop-blur-xl p-7 sm:p-9 shadow-2xl shadow-black/30">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
                  <Sparkles className="text-purple-400" size={23} />
                </div>

                <h2 className="text-3xl font-bold">Welcome Back</h2>

                <p className="text-sm text-gray-400 mt-2">
                  Sign in to continue your learning journey.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setMessage("");
                        setSuccess(false);
                      }}
                      placeholder="you@example.com"
                      className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-purple-500 focus:bg-purple-500/[0.04]"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-300">
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs text-purple-400 hover:text-purple-300 transition font-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      required
                      minLength={6}
                      autoComplete="current-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setMessage("");
                        setSuccess(false);
                      }}
                      placeholder="Enter your password"
                      className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-purple-500 focus:bg-purple-500/[0.04]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Password must contain at least 6 characters.
                  </p>
                </div>

                {/* REMEMBER ME */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 accent-purple-500"
                    />
                    Remember Me
                  </label>

                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <ShieldCheck size={13} />
                    Secure learning
                  </span>
                </div>

                {/* MESSAGE */}
                {message && (
                  <div
                    className={`rounded-xl border p-3 ${
                      success
                        ? "border-green-500/20 bg-green-500/10"
                        : "border-red-500/20 bg-red-500/10"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    <p
                      className={`text-xs ${
                        success ? "text-green-300" : "text-red-300"
                      }`}
                    >
                      {message}
                    </p>
                  </div>
                )}

                {/* SIGN IN */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 font-semibold text-sm shadow-lg shadow-purple-500/20 hover:opacity-90 hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Sign In
                </button>
              </form>

              {/* SIGN UP LINK */}
              <div className="text-center mt-7">
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-purple-400 font-semibold hover:text-purple-300 transition"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-600 mt-6">
              © 2026 StudySphere AI. All rights reserved.
            </p>
          </div>

          {/* RIGHT SIDE - INFORMATION */}
          <div className="hidden lg:flex flex-col justify-center pl-10">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs text-purple-300 mb-6">
                <Sparkles size={14} />
                THE FUTURE OF LEARNING
              </div>

              <h2 className="text-5xl font-bold leading-tight">
                Learn Smarter.
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Grow Faster.
                </span>
              </h2>

              <p className="text-gray-400 leading-7 mt-6">
                Your personal AI-powered study space. Organize your learning,
                understand difficult topics, and achieve your academic goals.
              </p>

              {/* FEATURES */}
              <div className="space-y-5 mt-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Brain className="text-purple-400" size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm">AI Personal Tutor</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Learn difficult concepts with AI.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <BookOpen className="text-blue-400" size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm">Smart Study Notes</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Create summaries and understand topics.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <GraduationCap className="text-cyan-400" size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm">
                      Personal Study Planner
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Organize your tasks and track progress.
                    </p>
                  </div>
                </div>
              </div>

              {/* PRIVACY NOTE */}
              <div className="mt-10 flex items-center gap-3 text-xs text-gray-500">
                <ShieldCheck size={18} className="text-green-400" />
                Built for a smarter learning experience.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
