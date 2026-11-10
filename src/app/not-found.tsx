
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white flex items-center justify-center px-6">
      {/* Background effects */}
      <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -top-32 -left-20" />
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] -bottom-32 -right-20" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-xl w-full text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 mb-8">
          <Sparkles size={16} />
          StudySphere AI
        </div>

        <h1 className="text-[110px] sm:text-[150px] font-black leading-none tracking-tighter bg-gradient-to-r from-purple-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-2xl sm:text-4xl font-bold mt-6">
          Lost in the universe?
        </h2>

        <p className="text-gray-400 mt-4 leading-7 max-w-md mx-auto">
          Looks like this page doesn't exist. Don't worry!
          Your learning journey is still on track.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold hover:scale-105 transition-transform"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-gray-200 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} />
            Dashboard
          </Link>
        </div>

        <p className="mt-12 text-xs text-gray-600">
          Keep learning. Keep growing. Keep exploring.
        </p>
      </motion.div>
    </main>
  );
}
