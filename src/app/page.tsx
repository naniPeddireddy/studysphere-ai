
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  FileText,
  CalendarDays,
  ChartNoAxesCombined,
  Settings,
  Bell,
  Search,
  Clock,
  CheckCircle2,
  Flame,
  Target,
  ArrowUpRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "AI Tutor", icon: Bot, href: "/dashboard/ai-tutor" },
  { name: "My Subjects", icon: BookOpen, href: "/dashboard/subjects" },
  { name: "Smart Notes", icon: FileText, href: "/dashboard/smart-notes" },
  { name: "Study Planner", icon: CalendarDays, href: "/dashboard/study-planner" },
  { name: "My Progress", icon: ChartNoAxesCombined, href: "/dashboard/progress" },
];

export default function Dashboard() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: "Study Hours",
      value: "24.5",
      subtitle: "Hours this week",
      icon: Clock,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Tasks Completed",
      value: "18",
      subtitle: "Great progress!",
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Current Streak",
      value: "7 Days",
      subtitle: "Keep it going!",
      icon: Flame,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Weekly Goal",
      value: "75%",
      subtitle: "15 of 20 hours",
      icon: Target,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  const subjects = [
    { name: "Mathematics", progress: 80, color: "bg-purple-500" },
    { name: "Python Programming", progress: 65, color: "bg-blue-500" },
    { name: "Artificial Intelligence", progress: 45, color: "bg-pink-500" },
    { name: "Physics", progress: 90, color: "bg-green-500" },
  ];

  return (
    <div className="min-h-screen bg-[#080b16] text-white">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-[#0d1222] p-6 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="mb-10 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600">
              <Sparkles size={23} />
            </div>
            <span className="text-xl font-bold">
              StudySphere<span className="text-purple-400"> AI</span>
            </span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
          Main Menu
        </p>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <Link
            href="/dashboard/settings"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
              pathname === "/dashboard/settings"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>

          <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4">
            <Sparkles className="mb-2 text-purple-400" size={22} />
            <h3 className="font-semibold">Upgrade your learning</h3>
            <p className="mt-1 text-xs text-gray-400">
              Keep improving your study experience.
            </p>
            <button className="mt-4 w-full rounded-lg bg-purple-600 py-2 text-sm font-semibold hover:bg-purple-500">
              Explore Premium
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-72">

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#080b16]/90 px-5 py-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-300 hover:bg-white/10 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={23} />
            </button>

            <div>
              <h1 className="text-lg font-bold md:text-xl">Dashboard</h1>
              <p className="hidden text-xs text-gray-500 sm:block">
                Your personal learning space
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 md:flex">
              <Search size={17} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-32 bg-transparent text-sm outline-none placeholder:text-gray-500"
              />
            </div>

            <button
              className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 hover:bg-white/10"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-purple-500" />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 font-bold">
              S
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="space-y-8 p-5 md:p-8">

          {/* Welcome Section */}
          <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/50 via-[#171638] to-blue-900/40 p-6 md:p-8">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 text-xs text-purple-300">
                <Sparkles size={14} />
                Welcome to StudySphere AI
              </span>

              <h2 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
                Learn smarter.
                <br />
                Achieve more.
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-300 md:text-base">
                Your learning journey starts here. Stay focused, track your
                progress, and reach your study goals.
              </p>

              <Link
                href="/dashboard/ai-tutor"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500"
              >
                Start Learning
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-20 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
          </section>

          {/* Stats */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold">Your Overview</h2>
              <p className="mt-1 text-sm text-gray-500">
                A quick look at your learning activity.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-white/10 bg-[#111729] p-5 transition hover:-translate-y-1 hover:border-purple-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">{stat.title}</p>
                      <div className={`rounded-xl p-2 ${stat.bg} ${stat.color}`}>
                        <Icon size={20} />
                      </div>
                    </div>

                    <h3 className="mt-4 text-2xl font-bold">{stat.value}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {stat.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Subjects and Study Plan */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Subject Progress */}
            <div className="rounded-2xl border border-white/10 bg-[#111729] p-6 xl:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Subject Progress</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Your learning progress by subject.
                  </p>
                </div>

                <Link
                  href="/dashboard/subjects"
                  className="text-sm font-medium text-purple-400 hover:text-purple-300"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-6">
                {subjects.map((subject) => (
                  <div key={subject.name}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {subject.name}
                      </span>
                      <span className="text-sm text-gray-400">
                        {subject.progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${subject.color}`}
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Plan */}
            <div className="rounded-2xl border border-white/10 bg-[#111729] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Quick Access</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Continue your learning.
                  </p>
                </div>
                <CalendarDays className="text-purple-400" size={22} />
              </div>

              <div className="space-y-3">
                <Link
                  href="/dashboard/study-planner"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-purple-500/40 hover:bg-purple-500/10"
                >
                  <CalendarDays className="text-purple-400" size={21} />
                  <div>
                    <p className="text-sm font-semibold">Study Planner</p>
                    <p className="text-xs text-gray-500">Manage your tasks</p>
                  </div>
                  <ArrowUpRight className="ml-auto text-gray-500" size={17} />
                </Link>

                <Link
                  href="/dashboard/smart-notes"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-purple-500/40 hover:bg-purple-500/10"
                >
                  <FileText className="text-blue-400" size={21} />
                  <div>
                    <p className="text-sm font-semibold">Smart Notes</p>
                    <p className="text-xs text-gray-500">Create your notes</p>
                  </div>
                  <ArrowUpRight className="ml-auto text-gray-500" size={17} />
                </Link>

                <Link
                  href="/dashboard/progress"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-purple-500/40 hover:bg-purple-500/10"
                >
                  <ChartNoAxesCombined className="text-green-400" size={21} />
                  <div>
                    <p className="text-sm font-semibold">My Progress</p>
                    <p className="text-xs text-gray-500">View your analytics</p>
                  </div>
                  <ArrowUpRight className="ml-auto text-gray-500" size={17} />
                </Link>
              </div>
            </div>
          </section>

          {/* AI Tutor Banner */}
          <section className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Bot size={25} />
              </div>

              <div>
                <h2 className="text-lg font-bold">Need help with a topic?</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Ask your AI Tutor and understand difficult concepts.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/ai-tutor"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              Open AI Tutor
              <ArrowUpRight size={17} />
            </Link>
          </section>

          <footer className="border-t border-white/10 pt-6 text-center text-xs text-gray-600">
            © 2026 StudySphere AI. Keep learning, keep growing.
          </footer>
        </div>
      </main>
    </div>
  );
}
