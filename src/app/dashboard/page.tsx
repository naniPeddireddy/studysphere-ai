
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Reveal from "../components/reveal";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  FileText,
  CalendarDays,
  ChartNoAxesCombined,
  Settings,
  UserRound,
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
  ListTodo,
} from "lucide-react";

type Task = {
  id: number;
  title: string;
  subject: string;
  date: string;
  duration: string;
  completed: boolean;
};

type Subject = {
  id: number;
  name: string;
  category: string;
  topics: string[];
  completedTopics?: string[];
  completed?: number;
  progress?: number;
};

type Profile = {
  name: string;
  email: string;
  course: string;
  year: string;
  bio: string;
  photo: string;
};

const defaultProfile: Profile = {
  name: "",
  email: "",
  course: "B.Tech CSE AI & ML",
  year: "1st Year",
  bio: "",
  photo: "",
};

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "AI Tutor", icon: Bot, href: "/dashboard/ai-tutor" },
  { name: "My Subjects", icon: BookOpen, href: "/dashboard/subjects" },
  { name: "Smart Notes", icon: FileText, href: "/dashboard/smart-notes" },
  { name: "Study Planner", icon: CalendarDays, href: "/dashboard/study-planner" },
  { name: "My Progress", icon: ChartNoAxesCombined, href: "/dashboard/progress" },
];

const subjectColors = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-pink-500",
  "bg-green-500",
  "bg-orange-500",
];

function getMinutes(duration: string) {
  const match = duration.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function formatStudyTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} hr`;

  return `${hours} hr ${remainingMinutes} min`;
}

export default function Dashboard() {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [loaded, setLoaded] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);

  useEffect(() => {
    try {
      // Load saved tasks
      const savedTasks = localStorage.getItem("studysphere-tasks");

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      }

      // Load saved subjects
      const savedSubjects = localStorage.getItem("studysphere-subjects");

      if (savedSubjects) {
        const parsedSubjects = JSON.parse(savedSubjects);

        if (Array.isArray(parsedSubjects)) {
          const normalizedSubjects = parsedSubjects.map((subject) => {
            const topics = Array.isArray(subject.topics)
              ? subject.topics
              : [];

            const completedTopics = Array.isArray(subject.completedTopics)
              ? subject.completedTopics.filter((topic: string) =>
                  topics.includes(topic)
                )
              : topics.slice(
                  0,
                  Math.min(Number(subject.completed) || 0, topics.length)
                );

            return {
              ...subject,
              topics,
              completedTopics,
            };
          });

          setSubjects(normalizedSubjects);
        }
      }

      // Load saved profile
      const savedProfile = localStorage.getItem("studysphere-profile");

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);

        setProfile({
          ...defaultProfile,
          ...parsedProfile,
        });
      }
    } catch (error) {
      console.error("Could not load dashboard data:", error);
    }

    setLoaded(true);
  }, []);

  // Profile initials
  const initials = profile.name.trim()
    ? profile.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "S";

  const displayName = profile.name.trim() || "Student";

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const completedMinutes = tasks
    .filter((task) => task.completed)
    .reduce(
      (total, task) => total + getMinutes(task.duration),
      0
    );

  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const subjectStats = subjects.map((subject) => {
    const total = subject.topics.length;
    const completed = subject.completedTopics?.length || 0;

    const percentage = total
      ? Math.round((completed / total) * 100)
      : 0;

    return {
      name: subject.name,
      total,
      completed,
      percentage,
    };
  });

  const totalSubjects = subjects.length;

  const totalTopics = subjects.reduce(
    (total, subject) => total + subject.topics.length,
    0
  );

  const completedTopics = subjects.reduce(
    (total, subject) =>
      total + (subject.completedTopics?.length || 0),
    0
  );

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingNotifications = tasks.filter(
    (task) => !task.completed
  );

  const stats = [
    {
      title: "Total Tasks",
      value: String(totalTasks),
      subtitle: "All your study tasks",
      icon: ListTodo,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Completed Tasks",
      value: String(completedTasks),
      subtitle: "Successfully completed",
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      title: "Pending Tasks",
      value: String(pendingTasks),
      subtitle: "Still waiting to be done",
      icon: Clock,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      title: "Study Time",
      value: formatStudyTime(completedMinutes),
      subtitle: "Time from completed tasks",
      icon: Target,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080b16] text-white">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
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
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3"
          >
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

          {/* Profile link */}
          <Link
            href="/dashboard/profile"
            onClick={() => setSidebarOpen(false)}
            className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
              pathname === "/dashboard/profile"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <UserRound size={20} />
            <span className="font-medium">My Profile</span>
          </Link>

          {/* Settings link */}
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

            <h3 className="font-semibold">
              Upgrade your learning
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Keep improving your study experience.
            </p>

            <button
              onClick={() => setPremiumOpen(true)}
              className="mt-4 w-full rounded-lg bg-purple-600 py-2 text-sm font-semibold transition hover:bg-purple-500"
            >
              Explore Premium
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen lg:ml-72">

        {/* Navbar */}
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
              <h1 className="text-lg font-bold md:text-xl">
                Dashboard
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block">
                Your personal learning space
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* Functional search */}
            <div className="relative hidden md:block">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <Search size={17} className="text-gray-500" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search subjects or tasks..."
                  className="w-44 bg-transparent text-sm outline-none placeholder:text-gray-500"
                />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {searchQuery.trim() && (
                <div className="absolute right-0 top-14 z-50 w-80 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#151a2b] p-3 shadow-2xl">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Subjects
                  </p>

                  {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject, index) => (
                      <Link
                        key={`${subject.name}-${index}`}
                        href="/dashboard/subjects"
                        onClick={() => setSearchQuery("")}
                        className="block rounded-lg p-3 text-sm hover:bg-white/10"
                      >
                        <BookOpen className="mr-2 inline text-purple-400" size={16} />
                        {subject.name}
                      </Link>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-xs text-gray-500">
                      No matching subjects.
                    </p>
                  )}

                  <p className="mb-2 mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Study Tasks
                  </p>

                  {filteredTasks.length > 0 ? (
                    filteredTasks.slice(0, 6).map((task) => (
                      <Link
                        key={task.id}
                        href="/dashboard/study-planner"
                        onClick={() => setSearchQuery("")}
                        className="block rounded-lg p-3 text-sm hover:bg-white/10"
                      >
                        <ListTodo className="mr-2 inline text-blue-400" size={16} />
                        {task.title}
                      </Link>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-xs text-gray-500">
                      No matching tasks.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 transition hover:bg-white/10"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={19} />

                {pendingNotifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-500 px-1 text-[10px] font-bold text-white">
                    {pendingNotifications.length > 9
                      ? "9+"
                      : pendingNotifications.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-14 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-white/10 bg-[#151a2b] p-4 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>

                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-gray-400 hover:text-white"
                      aria-label="Close notifications"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  {pendingNotifications.length === 0 ? (
                    <div className="py-6 text-center">
                      <CheckCircle2 className="mx-auto mb-2 text-green-400" size={28} />
                      <p className="text-sm font-medium">
                        All caught up!
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        You have no pending study tasks.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-64 space-y-2 overflow-y-auto">
                      {pendingNotifications.slice(0, 5).map((task) => (
                        <Link
                          key={task.id}
                          href="/dashboard/study-planner"
                          onClick={() => setNotificationsOpen(false)}
                          className="block rounded-lg border border-white/5 bg-white/5 p-3 transition hover:bg-white/10"
                        >
                          <p className="text-sm font-medium">
                            {task.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {task.subject || "General study"} · {task.date}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link
                    href="/dashboard/study-planner"
                    onClick={() => setNotificationsOpen(false)}
                    className="mt-4 block rounded-lg bg-purple-600 py-2 text-center text-sm font-semibold hover:bg-purple-500"
                  >
                    Open Study Planner
                  </Link>
                </div>
              )}
            </div>

            {/* Profile shortcut with saved photo or initials */}
            <Link
              href="/dashboard/profile"
              aria-label="Open my profile"
              title={displayName}
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-purple-400/40 bg-gradient-to-br from-purple-500 to-blue-500 font-bold transition hover:ring-2 hover:ring-purple-400"
            >
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </Link>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="space-y-8 p-5 md:p-8">

          {/* Welcome */}
          <Reveal>
            <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/50 via-[#171638] to-blue-900/40 p-6 md:p-8">
              <div className="relative z-10 max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 text-xs text-purple-300">
                  <Sparkles size={14} />
                  Welcome to StudySphere AI
                </span>

                <h2 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
                  Welcome back, {loaded ? displayName : "Student"}!
                  <br />
                  Learn smarter. Achieve more.
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-300 md:text-base">
                  Your learning journey starts here. Stay focused,
                  track your progress, and reach your study goals.
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
          </Reveal>

          {/* Statistics */}
          <section>
            <Reveal>
              <div className="mb-5">
                <h2 className="text-xl font-bold">Your Overview</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your actual study planner statistics.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <Reveal key={stat.title} delay={index * 0.12}>
                    <div className="rounded-2xl border border-white/10 bg-[#111729] p-5 transition duration-300 hover:-translate-y-1 hover:border-purple-500/30">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                          {stat.title}
                        </p>

                        <div className={`rounded-xl p-2 ${stat.bg} ${stat.color}`}>
                          <Icon size={20} />
                        </div>
                      </div>

                      <h3 className="mt-4 text-2xl font-bold">
                        {loaded ? stat.value : "..."}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {stat.subtitle}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* Subject summary */}
          <Reveal delay={0.1}>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#111729] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">My Subjects</p>
                  <BookOpen className="text-purple-400" size={21} />
                </div>

                <h3 className="mt-3 text-2xl font-bold">
                  {loaded ? totalSubjects : "..."}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Subjects you are learning
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111729] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Total Topics</p>
                  <ListTodo className="text-blue-400" size={21} />
                </div>

                <h3 className="mt-3 text-2xl font-bold">
                  {loaded ? totalTopics : "..."}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Topics across all subjects
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111729] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Topics Completed</p>
                  <CheckCircle2 className="text-green-400" size={21} />
                </div>

                <h3 className="mt-3 text-2xl font-bold">
                  {loaded ? completedTopics : "..."}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Topics you have finished
                </p>
              </div>
            </section>
          </Reveal>

          {/* Subject progress and quick access */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-[#111729] p-6 xl:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      Subject Progress
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Calculated from your completed topics.
                    </p>
                  </div>

                  <Link
                    href="/dashboard/subjects"
                    className="text-sm font-medium text-purple-400 hover:text-purple-300"
                  >
                    View All
                  </Link>
                </div>

                {!loaded ? (
                  <p className="text-sm text-gray-500">
                    Loading subject progress...
                  </p>
                ) : subjectStats.length === 0 ? (
                  <div className="py-8 text-center">
                    <BookOpen
                      size={35}
                      className="mx-auto mb-3 text-purple-400"
                    />

                    <p className="font-semibold">
                      No subjects added yet
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Add subjects and topics to track your learning progress.
                    </p>

                    <Link
                      href="/dashboard/subjects"
                      className="mt-4 inline-flex rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-500"
                    >
                      Add Subject
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {subjectStats.map((subject, index) => (
                      <div key={subject.name}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {subject.name}
                          </span>

                          <span className="text-sm text-gray-400">
                            {subject.percentage}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${subjectColors[index % subjectColors.length]}`}
                            style={{
                              width: `${subject.percentage}%`,
                            }}
                          />
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          {subject.completed} of {subject.total} topics completed
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>

            {/* Quick access */}
            <Reveal delay={0.15}>
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
            </Reveal>
          </section>

          {/* Task completion */}
          <Reveal delay={0.1}>
            <section className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className="text-orange-400" size={22} />

                    <h2 className="text-lg font-bold">
                      Your Task Completion
                    </h2>
                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    {completedTasks} out of {totalTasks} tasks completed.
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-3xl font-bold text-purple-300">
                    {loaded ? `${completionRate}%` : "..."}
                  </p>

                  <p className="text-xs text-gray-500">
                    Overall task completion
                  </p>
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                  style={{
                    width: `${completionRate}%`,
                  }}
                />
              </div>
            </section>
          </Reveal>

          {/* AI Tutor */}
          <Reveal delay={0.15}>
            <section className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                  <Bot size={25} />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Need help with a topic?
                  </h2>

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
          </Reveal>

          <footer className="border-t border-white/10 pt-6 text-center text-xs text-gray-600">
            © 2026 StudySphere AI. Keep learning, keep growing.
          </footer>
        </div>
      </main>

      {/* Premium information modal */}
      {premiumOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setPremiumOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-purple-500/30 bg-[#111729] p-7 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setPremiumOpen(false)}
              className="absolute right-5 top-5 text-gray-400 hover:text-white"
              aria-label="Close premium information"
            >
              <X size={21} />
            </button>

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20">
              <Sparkles className="text-purple-300" size={28} />
            </div>

            <h2 className="text-2xl font-bold">
              StudySphere Premium
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Premium features are planned for a future version of StudySphere AI.
              For now, you can use the available study tools for free.
            </p>

            <div className="mt-6 space-y-3 text-sm text-gray-300">
              <p className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-purple-400" />
                AI-powered learning features
              </p>

              <p className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-purple-400" />
                Advanced study analytics
              </p>

              <p className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-purple-400" />
                Personalized study assistance
              </p>
            </div>

            <button
              onClick={() => setPremiumOpen(false)}
              className="mt-7 w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold transition hover:bg-purple-500"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
