
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  ShieldCheck,
  Database,
  Lock,
  UserCheck,
  Sparkles,
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#080812] text-white px-5 py-10">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-10"
        >
          <ArrowLeft size={17} />
          Back to Signup
        </Link>

        <div className="rounded-3xl border border-white/10 bg-[#111120] p-7 sm:p-12 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Brain size={25} />
            </div>
            <h1 className="text-2xl font-bold">
              StudySphere <span className="text-purple-400">AI</span>
            </h1>
          </div>

          <div className="mb-10">
            <span className="text-xs text-purple-400 font-semibold tracking-widest">
              YOUR PRIVACY MATTERS
            </span>

            <h2 className="text-4xl font-bold mt-3">
              Privacy Policy
            </h2>

            <p className="text-gray-500 text-sm mt-3">
              Last updated: November 8, 2026
            </p>
          </div>

          <div className="space-y-9 text-gray-400 leading-7">
            <section>
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="text-purple-400" size={21} />
                <h3 className="text-white text-xl font-semibold">
                  1. Introduction
                </h3>
              </div>
              <p>
                This Privacy Policy explains how StudySphere AI handles
                information when you use our learning platform. We aim to
                be clear about the information our features use and how
                it is handled.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <UserCheck className="text-purple-400" size={21} />
                <h3 className="text-white text-xl font-semibold">
                  2. Information You Provide
                </h3>
              </div>
              <p>
                You may enter information such as your name, email address,
                study notes, subjects, tasks, and questions when using
                StudySphere AI features.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <Database className="text-purple-400" size={21} />
                <h3 className="text-white text-xl font-semibold">
                  3. Browser Storage
                </h3>
              </div>
              <p>
                Some features currently use your browser's local storage
                to save notes, tasks, subjects, conversations, and
                preferences on your device. Clearing browser data may
                remove this information.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="text-purple-400" size={21} />
                <h3 className="text-white text-xl font-semibold">
                  4. AI Features
                </h3>
              </div>
              <p>
                When you use the AI Tutor or other AI-powered features,
                your questions and relevant conversation context may be
                sent to an AI service provider to generate responses.
                Avoid sharing passwords or sensitive personal information
                in AI conversations.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <Lock className="text-purple-400" size={21} />
                <h3 className="text-white text-xl font-semibold">
                  5. Data Security
                </h3>
              </div>
              <p>
                We aim to protect information used by the platform.
                However, browser storage is not a secure account system.
                Do not treat the current frontend-only login and signup
                forms as real account protection.
              </p>
            </section>

            <section>
              <h3 className="text-white text-xl font-semibold mb-3">
                6. Third-Party Services
              </h3>
              <p>
                Some features may rely on third-party services, such as
                AI providers. Their handling of information is also
                governed by their own privacy policies and terms.
              </p>
            </section>

            <section>
              <h3 className="text-white text-xl font-semibold mb-3">
                7. Your Choices
              </h3>
              <p>
                You can manage or clear information saved in your browser
                through your browser settings. Removing browser data may
                affect saved StudySphere AI information.
              </p>
            </section>

            <section>
              <h3 className="text-white text-xl font-semibold mb-3">
                8. Policy Updates
              </h3>
              <p>
                This policy may be updated when the platform's features
                or data practices change. Please review this page
                periodically.
              </p>
            </section>
          </div>

          <div className="border-t border-white/10 mt-10 pt-7">
            <p className="text-xs text-gray-500">
              StudySphere AI — Learn Smarter. Grow Faster.
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                href="/terms"
                className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-300 hover:bg-white/5 transition"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/signup"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
              >
                Back to Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
