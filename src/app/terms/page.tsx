
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  ShieldCheck,
  BookOpen,
  UserCheck,
  Lock,
} from "lucide-react";

export default function TermsPage() {
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
              LEGAL INFORMATION
            </span>
            <h2 className="text-4xl font-bold mt-3">
              Terms & Conditions
            </h2>
            <p className="text-gray-500 text-sm mt-3">
              Last updated: November 8, 2026
            </p>
          </div>

          <div className="space-y-9 text-gray-400 leading-7">
            <section>
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="text-purple-400" size={21} />
                <h3 className="text-white text-xl font-semibold">
                  1. About StudySphere AI
                </h3>
              </div>
              <p>
                StudySphere AI is a learning platform designed to help
                students organize their studies, understand topics, create
                notes, and manage study activities using AI-powered tools.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <UserCheck className="text-purple-400" size={21} />
                <h3 className="text-white text-xl font-semibold">
                  2. User Responsibilities
                </h3>
              </div>
              <p>
                You agree to provide accurate information when using the
                platform. You are responsible for keeping your account
                information secure and using the platform for lawful
                educational purposes.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="text-purple-400" size={21} />
                <h3 className="text-white text-xl font-semibold">
                  3. AI-Generated Content
                </h3>
              </div>
              <p>
                AI-generated answers, summaries, and explanations are
                provided for educational support. AI responses may
                sometimes contain mistakes. Always verify important
                information using reliable learning materials.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-3">
                <Lock className="text-purple-400" size={21} />
                <h3 className="text-white text-xl font-semibold">
                  4. Privacy and Data
                </h3>
              </div>
              <p>
                StudySphere AI may use browser storage to remember your
                study preferences, notes, tasks, and other settings.
                Do not enter passwords or sensitive personal information
                into features that are not designed to protect it.
              </p>
            </section>

            <section>
              <h3 className="text-white text-xl font-semibold mb-3">
                5. Acceptable Use
              </h3>
              <p>
                You must not misuse the platform, attempt unauthorized
                access, disrupt its services, or use it for illegal
                activities.
              </p>
            </section>

            <section>
              <h3 className="text-white text-xl font-semibold mb-3">
                6. Service Availability
              </h3>
              <p>
                Features may change, be updated, or become temporarily
                unavailable. We do not guarantee that every AI response
                or feature will always be available or error-free.
              </p>
            </section>

            <section>
              <h3 className="text-white text-xl font-semibold mb-3">
                7. Contact
              </h3>
              <p>
                For questions about these terms, please use the contact
                information provided by the StudySphere AI project owner
                when it becomes available.
              </p>
            </section>
          </div>

          <div className="border-t border-white/10 mt-10 pt-7">
            <p className="text-xs text-gray-500">
              StudySphere AI — Learn Smarter. Grow Faster.
            </p>

            <Link
              href="/signup"
              className="inline-flex mt-5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Back to Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
