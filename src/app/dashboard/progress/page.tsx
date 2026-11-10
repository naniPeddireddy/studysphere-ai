
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  Flame,
  Trophy,
  CheckCircle2,
  CalendarDays,
  Brain,
  Code,
  Calculator,
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
  name: string;
  category: string;
  iconType: "code" | "calculator" | "brain" | "book";
  progress: number;
  completed: number;
  total: number;
  topics: string[];
  completedTopics?: string[];
};

function getMinutes(duration: string) {
  return parseInt(duration, 10) || 0;
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getSubjectIcon(subject: string) {
  const name = subject.toLowerCase();

  if (
    name.includes("python") ||
    name.includes("programming") ||
    name.includes("coding")
  ) {
    return Code;
  }

  if (name.includes("math")) {
    return Calculator;
  }

  if (name.includes("ai") || name.includes("intelligence")) {
    return Brain;
  }

  return BookOpen;
}

export default function ProgressPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("studysphere-tasks");
      const savedSubjects = localStorage.getItem("studysphere-subjects");

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      }

      if (savedSubjects) {
        const parsedSubjects = JSON.parse(savedSubjects);

        if (Array.isArray(parsedSubjects)) {
          const normalizedSubjects = parsedSubjects.map(
            (subject: Subject) => {
              const topics = Array.isArray(subject.topics)
                ? subject.topics
                : [];

              const completedTopics = Array.isArray(
                subject.completedTopics
              )
                ? subject.completedTopics
                : [];

              const validCompletedTopics = completedTopics.filter(
                (topic) => topics.includes(topic)
              );

              return {
                ...subject,
                topics,
                completedTopics: validCompletedTopics,
                completed: validCompletedTopics.length,
                total: topics.length,
                progress: topics.length
                  ? Math.round(
                      (validCompletedTopics.length / topics.length) * 100
                    )
                  : 0,
              };
            }
          );

          setSubjects(normalizedSubjects);
        }
      }
    } catch {
      console.error("Could not load progress data.");
    }

    setLoaded(true);
  }, []);

  // Task statistics
  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.length - completedTasks;

  const totalMinutes = tasks
    .filter((task) => task.completed)
    .reduce(
      (total, task) => total + getMinutes(task.duration),
      0
    );

  const studyHours = (totalMinutes / 60).toFixed(1);

  const completionRate = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  // Subject statistics
  const totalTopics = subjects.reduce(
    (total, subject) => total + subject.topics.length,
    0
  );

  const completedTopics = subjects.reduce(
    (total, subject) =>
      total + (subject.completedTopics?.length || 0),
    0
  );

  const overallSubjectProgress = totalTopics
    ? Math.round((completedTopics / totalTopics) * 100)
    : 0;

  // Weekly study activity
  const today = new Date();

  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (6 - index)
    );

    const dateKey = getDateKey(date);

    const minutes = tasks
      .filter(
        (task) => task.completed && task.date === dateKey
      )
      .reduce(
        (total, task) => total + getMinutes(task.duration),
        0
      );

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      minutes,
      hours: minutes / 60,
    };
  });

  const maxHours = Math.max(
    ...weeklyData.map((item) => item.hours),
    1
  );

  return (
    <main className="min-h-screen bg-[#080812] text-white p-5 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                My Progress
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                Understand your learning journey.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex w-12 h-12 rounded-xl bg-purple-500/20 items-center justify-center">
            <TrendingUp className="text-purple-400" size={24} />
          </div>
        </header>

        {/* Introduction */}
        <section className="mb-8">
          <p className="text-purple-400 text-sm font-semibold">
            YOUR LEARNING JOURNEY
          </p>

          <h2 className="text-3xl font-bold mt-2">
            Keep moving forward!
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Every completed task and topic brings you closer to your goals.
          </p>
        </section>

        {/* Task statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-5">
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Completed Tasks</p>
              <CheckCircle2 className="text-green-400" size={21} />
            </div>

            <h3 className="text-3xl font-bold mt-4">
              {loaded ? completedTasks : "..."}
            </h3>

            <p className="text-xs text-gray-500 mt-2">
              From your study planner
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-5">
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Pending Tasks</p>
              <Target className="text-purple-400" size={21} />
            </div>

            <h3 className="text-3xl font-bold mt-4">
              {loaded ? pendingTasks : "..."}
            </h3>

            <p className="text-xs text-gray-500 mt-2">
              Tasks still to complete
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-5">
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Study Time</p>
              <Clock className="text-blue-400" size={21} />
            </div>

            <h3 className="text-3xl font-bold mt-4">
              {loaded ? `${studyHours}h` : "..."}
            </h3>

            <p className="text-xs text-gray-500 mt-2">
              Completed task duration
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-5">
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Completion Rate</p>
              <TrendingUp className="text-pink-400" size={21} />
            </div>

            <h3 className="text-3xl font-bold mt-4">
              {loaded ? `${completionRate}%` : "..."}
            </h3>

            <p className="text-xs text-gray-500 mt-2">
              Overall task completion
            </p>
          </div>

        </section>

        {/* Subject learning overview */}
        <section className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 to-[#111120] p-6 mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-purple-300 text-sm font-semibold">
                SUBJECT LEARNING OVERVIEW
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {loaded ? `${overallSubjectProgress}%` : "..."} completed
              </h3>

              <p className="text-sm text-gray-400 mt-2">
                {completedTopics} of {totalTopics} topics completed across{" "}
                {subjects.length} subjects.
              </p>
            </div>

            <div className="w-24 h-24 rounded-full border-8 border-purple-500/30 flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-purple-300">
                {loaded ? `${overallSubjectProgress}%` : "..."}
              </span>
            </div>
          </div>

          <div className="h-3 bg-white/10 rounded-full overflow-hidden mt-6">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700"
              style={{
                width: `${overallSubjectProgress}%`,
              }}
            />
          </div>

          <Link
            href="/dashboard/subjects"
            className="inline-block text-sm text-purple-300 hover:text-white mt-5 transition"
          >
            Continue learning →
          </Link>
        </section>

        {/* Weekly activity and task completion */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold">
                  Weekly Study Activity
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Based on your completed tasks · Last 7 days
                </p>
              </div>

              <CalendarDays className="text-purple-400" />
            </div>

            <div className="flex items-end justify-between gap-3 h-52">
              {weeklyData.map((item, index) => (
                <div
                  key={`${item.day}-${index}`}
                  className="flex-1 flex flex-col items-center justify-end h-full gap-3"
                >
                  <span className="text-xs text-gray-400">
                    {item.hours.toFixed(1)}h
                  </span>

                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-purple-700 to-blue-400 hover:opacity-80 transition"
                      style={{
                        height: `${(item.hours / maxHours) * 100}%`,
                        minHeight: item.minutes > 0 ? "8px" : "0px",
                      }}
                    />
                  </div>

                  <span className="text-xs text-gray-500">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-6">
            <h3 className="text-lg font-bold">
              Task Completion
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Your progress from planned tasks
            </p>

            <div className="flex flex-col items-center justify-center py-8">
              <div
                className="w-40 h-40 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(#a855f7 ${completionRate}%, #29293b ${completionRate}% 100%)`,
                }}
              >
                <div className="w-32 h-32 rounded-full bg-[#111120] flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    {loaded ? completionRate : 0}%
                  </span>

                  <span className="text-xs text-gray-500">
                    Completed
                  </span>
                </div>
              </div>

              <div className="flex gap-6 mt-7 text-sm">
                <span className="flex items-center gap-2 text-gray-400">
                  <span className="w-3 h-3 rounded-full bg-purple-500" />
                  Completed
                </span>

                <span className="flex items-center gap-2 text-gray-400">
                  <span className="w-3 h-3 rounded-full bg-[#29293b]" />
                  Remaining
                </span>
              </div>
            </div>
          </div>

        </section>

        {/* Actual subject progress */}
        <section className="rounded-2xl border border-white/10 bg-[#111120] p-6 mb-8">

          <div className="mb-7">
            <h3 className="text-lg font-bold">
              Subject Progress
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Based on completed topics from your Subjects page
            </p>
          </div>

          {!loaded ? (
            <p className="text-gray-500 text-sm">
              Loading subject progress...
            </p>
          ) : subjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen
                size={35}
                className="text-gray-500 mx-auto mb-3"
              />

              <p className="text-gray-400 text-sm">
                No subjects found.
              </p>

              <Link
                href="/dashboard/subjects"
                className="inline-block mt-4 text-purple-300 text-sm hover:text-white"
              >
                Add your first subject →
              </Link>
            </div>
          ) : (
            <div className="space-y-7">
              {subjects.map((subject, index) => {
                const Icon = getSubjectIcon(subject.name);
                const progress = subject.topics.length
                  ? Math.round(
                      ((subject.completedTopics?.length || 0) /
                        subject.topics.length) *
                        100
                    )
                  : 0;

                return (
                  <div key={`${subject.name}-${index}`}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <Icon className="text-purple-400" size={20} />

                        <span className="text-sm font-semibold">
                          {subject.name}
                        </span>
                      </div>

                      <span className="text-sm text-purple-300">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      {subject.completedTopics?.length || 0} of{" "}
                      {subject.topics.length} topics completed
                    </p>
                  </div>
                );
              })}
            </div>
          )}

        </section>

        {/* Achievement and learning goals */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 to-[#111120] p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-5">
              <Trophy className="text-purple-300" size={25} />
            </div>

            <h3 className="text-lg font-bold">
              Your Achievement
            </h3>

            <p className="text-sm text-gray-400 mt-3">
              {completedTopics >= 20
                ? "Amazing! You have completed 20 or more learning topics."
                : completedTopics >= 1
                ? `Great work! You have completed ${completedTopics} learning topic${completedTopics === 1 ? "" : "s"}. Keep going!`
                : "Complete your first learning topic to start your achievement journey."}
            </p>

            <div className="mt-5 text-purple-300 text-sm font-semibold">
              <Flame size={17} className="inline mr-2" />
              Keep your learning momentum!
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-5">
              <BookOpen className="text-blue-300" size={25} />
            </div>

            <h3 className="text-lg font-bold">
              Learning Goals
            </h3>

            <p className="text-sm text-gray-400 mt-3">
              Build a consistent study habit by completing your planned tasks and learning topics.
            </p>

            <div className="flex flex-wrap gap-4 mt-5">
              <Link
                href="/dashboard/study-planner"
                className="text-sm text-blue-300 hover:text-white"
              >
                Study Planner →
              </Link>

              <Link
                href="/dashboard/subjects"
                className="text-sm text-purple-300 hover:text-white"
              >
                My Subjects →
              </Link>
            </div>
          </div>

        </section>

        <footer className="text-center text-xs text-gray-600 py-5">
          StudySphere AI · Your progress, your achievement.
        </footer>

      </div>
    </main>
  );
}
