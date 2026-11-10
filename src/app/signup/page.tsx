
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  User,
  Sparkles,
  Brain,
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    if (name.trim().length < 2) {
      setMessage("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setMessage("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setMessage("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setMessage("Password must contain at least one number.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    if (!agreeTerms) {
      setMessage("Please accept the Terms and Conditions.");
      return;
    }

    setSuccess(true);
    setMessage(
      "Your signup form is valid! Real account creation will be connected when authentication is added."
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

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* LEFT SIDE - SIGNUP INFORMATION */}
          <div className="hidden lg:flex flex-col justify-center">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs text-purple-300 mb-6">
                <Sparkles size={14} />
                START YOUR LEARNING JOURNEY
              </div>

              <h1 className="text-5xl font-bold leading-tight">
                Your Future
                <br />
                Starts{" "}
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Here.
                </span>
              </h1>

              <p className="text-gray-400 leading-7 mt-6">
                Create your StudySphere AI account and explore a smarter way
                to learn, organize your studies, and improve your skills.
              </p>

              {/* FEATURES */}
              <div className="space-y-5 mt-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Brain className="text-purple-400" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Learn with AI</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Get help understanding difficult concepts.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <BookOpen className="text-blue-400" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">
                      Create Smart Notes
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Summarize lessons and save important points.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <GraduationCap className="text-cyan-400" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">
                      Track Your Growth
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Manage tasks and monitor study progress.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-3 text-xs text-gray-500">
                <ShieldCheck size={18} className="text-green-400" />
                Designed for your learning journey.
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - SIGNUP FORM */}
          <div className="w-full max-w-md mx-auto lg:mr-auto lg:ml-0">
            {/* LOGO */}
            <Link href="/" className="inline-flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Brain size={25} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-wide">
                  StudySphere <span className="text-purple-400">AI</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Your intelligent learning partner
                </p>
              </div>
            </Link>

            {/* SIGNUP CARD */}
            <div className="rounded-3xl border border-white/10 bg-[#111120]/90 backdrop-blur-xl p-7 sm:p-8 shadow-2xl shadow-black/30">
              <div className="mb-7">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
                  <Sparkles className="text-purple-400" size={23} />
                </div>

                <h2 className="text-3xl font-bold">Create Account</h2>
                <p className="text-sm text-gray-400 mt-2">
                  Join StudySphere AI and start learning smarter.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* FULL NAME */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      required
                      type="text"
                      maxLength={80}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setMessage("");
                        setSuccess(false);
                      }}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-purple-500"
                    />
                  </div>
                </div>

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
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setMessage("");
                        setSuccess(false);
                      }}
                      placeholder="you@example.com"
                      className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      required
                      minLength={8}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setMessage("");
                        setSuccess(false);
                      }}
                      placeholder="Create a password"
                      className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    At least 8 characters, including uppercase, lowercase and a number.
                  </p>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      required
                      minLength={8}
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setMessage("");
                        setSuccess(false);
                      }}
                      placeholder="Enter your password again"
                      className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* TERMS AND PRIVACY */}
                <label className="flex items-start gap-3 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      setMessage("");
                      setSuccess(false);
                    }}
                    className="mt-1 h-4 w-4 accent-purple-500"
                  />

                  <span className="text-xs text-gray-400 leading-5">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and have read the{" "}
                    <Link
                      href="/privacy"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {/* MESSAGE */}
                {message && (
                  <div
                    className={`rounded-xl border p-3 ${
                      success
                        ? "border-green-500/20 bg-green-500/10"
                        : "border-red-500/20 bg-red-500/10"
                    }`}
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

                {/* CREATE ACCOUNT */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 font-semibold text-sm shadow-lg shadow-purple-500/20 hover:opacity-90 hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Create Account
                </button>
              </form>

              {/* LOGIN LINK */}
              <div className="text-center mt-7">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-purple-400 font-semibold hover:text-purple-300 transition"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-600 mt-6">
              © 2026 StudySphere AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
