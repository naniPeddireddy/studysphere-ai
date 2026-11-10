
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Mail,
  LockKeyhole,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitted(true);
    setMessage(
      "Your reset request form is ready. Actual password reset emails will work after authentication is connected."
    );
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center p-4 relative overflow-hidden">

      {/* BACKGROUND EFFECTS */}

      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10">

        {/* BACK TO LOGIN */}

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={17} />
          Back to Login
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT INFORMATION */}

          <div className="hidden lg:flex flex-col justify-center">

            <div className="max-w-md">

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20 mb-7">
                <Brain size={32} />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-xs text-purple-300 mb-6">
                <ShieldCheck size={14} />
                ACCOUNT SECURITY
              </div>

              <h1 className="text-5xl font-bold leading-tight">
                Secure Your
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Learning Journey.
                </span>
              </h1>

              <p className="text-gray-400 leading-7 mt-6">
                Your StudySphere AI account helps you organize your
                learning journey. Keep your account secure and get
                back to learning whenever you need.
              </p>

              <div className="space-y-5 mt-10">

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <LockKeyhole className="text-purple-400" size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm">
                      Account Protection
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Keep your account information secure.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Mail className="text-blue-400" size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm">
                      Email-Based Recovery
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Request account recovery using your email.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE - RESET FORM */}

          <div className="w-full max-w-md mx-auto">

            {/* LOGO */}

            <Link href="/" className="inline-flex items-center gap-3 mb-8">
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

            {/* RESET CARD */}

            <div className="rounded-3xl border border-white/10 bg-[#111120]/90 backdrop-blur-xl p-7 sm:p-9 shadow-2xl shadow-black/30">

              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
                <LockKeyhole className="text-purple-400" size={25} />
              </div>

              <h2 className="text-3xl font-bold">
                Forgot Password?
              </h2>

              <p className="text-sm text-gray-400 mt-3 leading-6">
                Don't worry! Enter the email address associated with
                your account to request password recovery.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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
                        setSubmitted(false);
                      }}
                      placeholder="you@example.com"
                      className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-purple-500 focus:bg-purple-500/[0.04]"
                    />
                  </div>
                </div>

                {message && (
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2
                        size={18}
                        className="text-purple-300 shrink-0 mt-0.5"
                      />

                      <p className="text-xs text-purple-200 leading-5">
                        {message}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 font-semibold text-sm shadow-lg shadow-purple-500/20 hover:opacity-90 hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
                >
                  <Sparkles size={17} />
                  Request Password Reset
                </button>

              </form>

              <div className="text-center mt-7">
                <p className="text-sm text-gray-400">
                  Remember your password?{" "}
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
