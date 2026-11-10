
import Link from "next/link";
import {
  Brain,
  Home,
  ArrowLeft,
  Search,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/20 blur-[130px] rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/20 blur-[140px] rounded-full" />

      <div className="relative z-10 text-center max-w-xl">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Brain size={25} />
          </div>
          <span className="text-xl font-bold">
            StudySphere <span className="text-purple-400">AI</span>
          </span>
        </Link>

        {/* Error number */}
        <div className="relative mb-6">
          <h1 className="text-[120px] sm:text-[160px] font-black leading-none bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Search size={110} className="text-purple-300" />
          </div>
        </div>

        {/* Message */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs mb-6">
          <Sparkles size={14} />
          PAGE NOT FOUND
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Lost in the Learning Universe?
        </h2>

        <p className="text-gray-400 leading-7 mb-9">
          The page you are looking for doesn't exist or may have been moved.
          Let's get you back to your learning journey.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-purple-500/20"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 bg-white/[0.04] text-gray-300 font-semibold text-sm hover:bg-white/[0.08] hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        <p className="text-xs text-gray-600 mt-12">
          © 2026 StudySphere AI. All rights reserved.
        </p>
      </div>
    </main>
  );
}
