
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Target,
  ListTodo,
  X,
  Search,
  AlertCircle,
  Pencil,
  Flag,
  CalendarCheck,
  Timer,
  SlidersHorizontal,
} from "lucide-react";

type Priority = "High" | "Medium" | "Low";

type Task = {
  id: number;
  title: string;
  subject: string;
  date: string;
  duration: string;
  completed: boolean;
  priority: Priority;
  description?: string;
};

const STORAGE_KEY = "studysphere-tasks";

const sampleTasks: Task[] = [
  {
    id: 1,
    title: "Practice Python Functions",
    subject: "Python Programming",
    date: "2026-11-07",
    duration: "45 minutes",
    completed: false,
    priority: "High",
    description: "Practice function creation and function arguments.",
  },
  {
    id: 2,
    title: "Revise Linear Algebra",
    subject: "Mathematics",
    date: "2026-11-07",
    duration: "60 minutes",
    completed: false,
    priority: "Medium",
    description: "Revise matrices, vectors, and basic operations.",
  },
  {
    id: 3,
    title: "Study Introduction to AI",
    subject: "Artificial Intelligence",
    date: "2026-11-08",
    duration: "30 minutes",
    completed: true,
    priority: "Low",
    description: "Understand the basics of artificial intelligence.",
  },
];

const filters = [
  "All",
  "Today",
  "Upcoming",
  "Pending",
  "Completed",
  "Overdue",
];

function getLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateOffset(date: string, offset: number) {
  const result = new Date(`${date}T00:00:00`);
  result.setDate(result.getDate() + offset);
  return getLocalDate(result);
}

function formatDate(date: string) {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getPriorityColor(priority: Priority) {
  if (priority === "High") {
    return "text-red-400 bg-red-500/10 border-red-500/20";
  }

  if (priority === "Medium") {
    return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  }

  return "text-green-400 bg-green-500/10 border-green-500/20";
}

function getPriorityWeight(priority: Priority) {
  if (priority === "High") return 3;
  if (priority === "Medium") return 2;
  return 1;
}

function getTaskDuration(duration: string) {
  const minutes = parseInt(duration, 10);
  return Number.isNaN(minutes) ? 0 : minutes;
}

export default function StudyPlanner() {
  const [today, setToday] = useState("");

  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [loaded, setLoaded] = useState(false);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Due date");
  const [selectedDate, setSelectedDate] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Python Programming");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("45 minutes");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [description, setDescription] = useState("");

  // LOAD SAVED TASKS AND GET TODAY'S DATE

  useEffect(() => {
    const currentDate = getLocalDate(new Date());

    setToday(currentDate);

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const normalized: Task[] = parsed.map((task, index) => ({
            id: Number(task.id) || Date.now() + index,
            title: String(task.title || "Untitled task"),
            subject: String(task.subject || "Other"),
            date: String(task.date || currentDate),
            duration: String(task.duration || "30 minutes"),
            completed: Boolean(task.completed),
            priority:
              task.priority === "High" ||
              task.priority === "Medium" ||
              task.priority === "Low"
                ? task.priority
                : "Medium",
            description: String(task.description || ""),
          }));

          setTasks(normalized);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setLoaded(true);
  }, []);

  // SAVE TASKS

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  // STATISTICS

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingCount = tasks.filter(
    (task) => !task.completed && task.date >= today
  ).length;

  const overdueCount = tasks.filter(
    (task) => !task.completed && task.date < today
  ).length;

  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const todayTasks = tasks
    .filter((task) => today && task.date === today)
    .sort(
      (a, b) =>
        getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
    );

  const totalStudyMinutes = tasks.reduce(
    (total, task) => total + getTaskDuration(task.duration),
    0
  );

  // WEEKLY OVERVIEW

  const weekDays = today
    ? Array.from({ length: 7 }, (_, index) => {
        const dateValue = getDateOffset(today, index);

        const dayTasks = tasks.filter(
          (task) => task.date === dateValue
        );

        return {
          date: dateValue,
          day: new Date(`${dateValue}T00:00:00`).toLocaleDateString(
            "en-IN",
            { weekday: "short" }
          ),
          number: new Date(`${dateValue}T00:00:00`).getDate(),
          count: dayTasks.length,
          completed: dayTasks.filter((task) => task.completed).length,
        };
      })
    : [];

  // FILTER AND SORT TASKS

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const matchesSearch =
        `${task.title} ${task.subject} ${task.description || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "Today"
          ? today !== "" && task.date === today
          : filter === "Upcoming"
          ? !task.completed && today !== "" && task.date > today
          : filter === "Pending"
          ? !task.completed && today !== "" && task.date >= today
          : filter === "Completed"
          ? task.completed
          : filter === "Overdue"
          ? !task.completed && today !== "" && task.date < today
          : true;

      const matchesDate = selectedDate
        ? task.date === selectedDate
        : true;

      return matchesSearch && matchesFilter && matchesDate;
    });

    return result.sort((a, b) => {
      if (sortBy === "Priority") {
        return (
          getPriorityWeight(b.priority) -
          getPriorityWeight(a.priority)
        );
      }

      if (sortBy === "Latest date") {
        return b.date.localeCompare(a.date);
      }

      return a.date.localeCompare(b.date);
    });
  }, [tasks, filter, search, selectedDate, sortBy, today]);

  // FORM HELPERS

  function resetForm() {
    setTitle("");
    setSubject("Python Programming");
    setDate("");
    setDuration("45 minutes");
    setPriority("Medium");
    setDescription("");
    setEditingId(null);
  }

  function openAddForm() {
    if (!today) return;

    resetForm();
    setDate(today);
    setShowForm(true);
  }

  function openEditForm(task: Task) {
    setEditingId(task.id);
    setTitle(task.title);
    setSubject(task.subject);
    setDate(task.date);
    setDuration(task.duration);
    setPriority(task.priority);
    setDescription(task.description || "");
    setShowForm(true);
  }

  function saveTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim() || !date) {
      return;
    }

    if (editingId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? {
                ...task,
                title: title.trim(),
                subject,
                date,
                duration,
                priority,
                description: description.trim(),
              }
            : task
        )
      );
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: title.trim(),
        subject,
        date,
        duration,
        completed: false,
        priority,
        description: description.trim(),
      };

      setTasks((previous) => [...previous, newTask]);
    }

    resetForm();
    setShowForm(false);
  }

  // COMPLETE / UNDO TASK

  function toggleTask(id: number) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  // DELETE TASK

  function deleteTask(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  }

  // TASK STATUS

  function getTaskStatus(task: Task) {
    if (task.completed) return "Completed";
    if (!today) return "Upcoming";
    if (task.date < today) return "Overdue";
    if (task.date === today) return "Today";
    return "Upcoming";
  }

  function getStatusColor(status: string) {
    if (status === "Completed") return "text-green-400";
    if (status === "Overdue") return "text-red-400";
    if (status === "Today") return "text-purple-300";
    return "text-blue-300";
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white p-5 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Study Planner
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Organize your learning and stay ahead of your goals.
              </p>
            </div>
          </div>

          <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <CalendarDays className="text-purple-400" />
          </div>
        </header>

        {/* STATISTICS */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-5 hover:border-purple-500/40 transition">
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Total Tasks</p>
              <ListTodo className="text-purple-400" size={20} />
            </div>
            <h2 className="text-3xl font-bold mt-3">{tasks.length}</h2>
            <p className="text-xs text-gray-500 mt-2">
              All your study activities
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-5 hover:border-orange-500/40 transition">
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Pending Tasks</p>
              <Clock className="text-orange-400" size={20} />
            </div>
            <h2 className="text-3xl font-bold mt-3">{pendingCount}</h2>
            <p className="text-xs text-gray-500 mt-2">
              Tasks waiting to be completed
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-5 hover:border-green-500/40 transition">
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Completed Tasks</p>
              <CheckCircle2 className="text-green-400" size={20} />
            </div>
            <h2 className="text-3xl font-bold mt-3">{completedCount}</h2>
            <p className="text-xs text-gray-500 mt-2">
              Successfully completed
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-5 hover:border-red-500/40 transition">
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">Overdue Tasks</p>
              <AlertCircle className="text-red-400" size={20} />
            </div>
            <h2 className="text-3xl font-bold mt-3">{overdueCount}</h2>
            <p className="text-xs text-gray-500 mt-2">
              Past their due date
            </p>
          </div>

        </section>

        {/* STUDY PROGRESS */}

        <section className="rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-blue-900/20 p-6 mb-8">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target className="text-purple-400" size={21} />
                Your Study Progress
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Every completed task brings you closer to your goals.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-3xl font-bold text-purple-300">
                {progress}%
              </p>
              <p className="text-xs text-gray-500">
                Overall completion
              </p>
            </div>
          </div>

          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex flex-wrap justify-between gap-3 mt-4 text-xs text-gray-400">
            <span>{completedCount} completed</span>
            <span>{pendingCount} pending</span>
            <span>{overdueCount} overdue</span>
          </div>

        </section>

        {/* WEEKLY OVERVIEW */}

        <section className="rounded-2xl border border-white/10 bg-[#111120] p-5 md:p-6 mb-8">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CalendarCheck className="text-purple-400" size={21} />
                Your Next 7 Days
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Select a date to see its scheduled tasks.
              </p>
            </div>

            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="text-xs text-purple-300 hover:text-white transition"
              >
                Clear date filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {weekDays.map((day) => {
              const active = selectedDate === day.date;
              const isToday = day.date === today;

              return (
                <button
                  key={day.date}
                  onClick={() =>
                    setSelectedDate(active ? "" : day.date)
                  }
                  className={`rounded-xl border p-3 text-center transition ${
                    active
                      ? "bg-purple-600/30 border-purple-400"
                      : "bg-white/[0.03] border-white/10 hover:border-purple-500/50"
                  }`}
                >
                  <p className="text-xs text-gray-400">
                    {isToday ? "Today" : day.day}
                  </p>

                  <p
                    className={`text-xl font-bold my-2 ${
                      active ? "text-purple-300" : "text-white"
                    }`}
                  >
                    {day.number}
                  </p>

                  <p className="text-xs text-gray-500">
                    {day.count} {day.count === 1 ? "task" : "tasks"}
                  </p>

                  {day.count > 0 && (
                    <div className="flex justify-center gap-1 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      {day.completed > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <p className="text-xs text-purple-300 mt-4">
              Showing tasks for {formatDate(selectedDate)}
            </p>
          )}

        </section>

        {/* TODAY'S TASKS */}

        <section className="rounded-2xl border border-purple-500/20 bg-[#111120] p-5 mb-8">

          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CalendarDays className="text-purple-400" size={21} />
                Today's Tasks
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {todayTasks.length} tasks scheduled for today
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="p-3 rounded-xl bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition"
              title="Add a task"
            >
              <Plus size={20} />
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <p className="text-sm text-gray-500 mt-5">
              No tasks scheduled for today. Enjoy your free time or add a task!
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    aria-label="Toggle task completion"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="text-green-400" size={21} />
                    ) : (
                      <Circle
                        className="text-gray-400 hover:text-purple-400"
                        size={21}
                      />
                    )}
                  </button>

                  <span
                    className={`text-sm flex-1 ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </span>

                  <span className="text-xs text-gray-400">
                    {task.duration}
                  </span>
                </div>
              ))}
            </div>
          )}

        </section>

        {/* TASK MANAGEMENT */}

        <section className="rounded-2xl border border-white/10 bg-[#111120] p-5 md:p-6">

          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-7">

            <div>
              <h2 className="text-xl font-bold">
                My Study Tasks
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Create, organize, and track your learning activities.
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition"
            >
              <Plus size={18} />
              Add New Task
            </button>

          </div>

          {/* SEARCH */}

          <div className="relative mb-5">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks, subjects, or descriptions..."
              className="w-full rounded-xl bg-white/5 border border-white/10 py-3 pl-12 pr-4 text-sm outline-none focus:border-purple-500"
            />
          </div>

          {/* FILTERS */}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm transition ${
                    filter === item
                      ? "bg-purple-600 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal
                size={17}
                className="text-gray-400"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg bg-[#202033] border border-white/10 px-3 py-2 text-xs sm:text-sm outline-none"
              >
                <option value="Due date">Sort: Earliest date</option>
                <option value="Latest date">Sort: Latest date</option>
                <option value="Priority">Sort: Priority</option>
              </select>
            </div>

          </div>

          {/* TASK LIST */}

          <div className="space-y-3">

            {filteredTasks.map((task) => {
              const status = getTaskStatus(task);

              return (
                <div
                  key={task.id}
                  className="rounded-xl bg-white/[0.04] border border-white/5 p-4 hover:border-purple-500/30 transition"
                >

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div className="flex items-start gap-4 min-w-0">

                      <button
                        onClick={() => toggleTask(task.id)}
                        title="Change task status"
                        className="shrink-0 mt-1"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="text-green-400" size={23} />
                        ) : (
                          <Circle
                            className="text-gray-500 hover:text-purple-400"
                            size={23}
                          />
                        )}
                      </button>

                      <div className="min-w-0">
                        <h3
                          className={`font-semibold text-sm break-words ${
                            task.completed
                              ? "text-gray-500 line-through"
                              : "text-white"
                          }`}
                        >
                          {task.title}
                        </h3>

                        <p className="text-xs text-purple-300 mt-1">
                          {task.subject}
                        </p>

                        {task.description && (
                          <p className="text-xs text-gray-500 mt-2 break-words">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarDays size={13} />
                            {formatDate(task.date)}
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock size={13} />
                            {task.duration}
                          </span>
                        </div>
                      </div>

                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4 sm:ml-4">

                      <span
                        className={`text-xs px-3 py-1.5 rounded-lg border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        <span className="inline-flex items-center gap-1">
                          <Flag size={12} />
                          {task.priority}
                        </span>
                      </span>

                      <span className={`text-xs ${getStatusColor(status)}`}>
                        {status}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditForm(task)}
                          title="Edit task"
                          className="p-2 rounded-lg text-gray-400 hover:bg-purple-500/10 hover:text-purple-300 transition"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => deleteTask(task.id)}
                          title="Delete task"
                          className="p-2 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <ListTodo
                  size={35}
                  className="mx-auto text-purple-400 mb-3"
                />

                <p className="font-semibold">
                  No tasks found
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Try another filter or add a new task.
                </p>

                <button
                  onClick={() => {
                    setFilter("All");
                    setSearch("");
                    setSelectedDate("");
                  }}
                  className="text-sm text-purple-300 hover:text-white mt-4"
                >
                  Clear filters
                </button>
              </div>
            )}

          </div>

          {/* TASK SUMMARY */}

          {tasks.length > 0 && (
            <div className="border-t border-white/10 mt-6 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </p>

              <p className="text-xs text-gray-500 flex items-center gap-2">
                <Timer size={14} className="text-purple-400" />
                Total planned study time:{" "}
                {Math.floor(totalStudyMinutes / 60)}h{" "}
                {totalStudyMinutes % 60}m
              </p>
            </div>
          )}

        </section>

        <footer className="text-center text-xs text-gray-600 mt-10">
          StudySphere AI · Plan better. Learn smarter.
        </footer>

      </div>

      {/* ADD / EDIT TASK MODAL */}

      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setShowForm(false);
            resetForm();
          }}
        >

          <form
            onSubmit={saveTask}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-purple-500/30 bg-[#141424] p-6 shadow-2xl"
          >

            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-xl font-bold">
                  {editingId !== null ? "Edit Study Task" : "Add Study Task"}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {editingId !== null
                    ? "Update your learning activity."
                    : "Create a new learning activity."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                aria-label="Close form"
              >
                <X size={20} />
              </button>

            </div>

            {/* TASK NAME */}

            <label className="block text-sm text-gray-300 mb-2">
              Task Name
            </label>

            <input
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Practice Python loops"
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 mb-5 text-sm outline-none focus:border-purple-500"
            />

            {/* SUBJECT */}

            <label className="block text-sm text-gray-300 mb-2">
              Subject
            </label>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl bg-[#202033] border border-white/10 p-3 mb-5 text-sm outline-none"
            >
              <option>Python Programming</option>
              <option>Mathematics</option>
              <option>Artificial Intelligence</option>
              <option>Other</option>
            </select>

            {/* DATE */}

            <label className="block text-sm text-gray-300 mb-2">
              Due Date
            </label>

            <input
              required
              type="date"
              min={today || undefined}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl bg-[#202033] border border-white/10 p-3 mb-5 text-sm outline-none"
            />

            {/* DURATION */}

            <label className="block text-sm text-gray-300 mb-2">
              Study Duration
            </label>

            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl bg-[#202033] border border-white/10 p-3 mb-5 text-sm outline-none"
            >
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>45 minutes</option>
              <option>60 minutes</option>
              <option>90 minutes</option>
              <option>120 minutes</option>
            </select>

            {/* PRIORITY */}

            <label className="block text-sm text-gray-300 mb-2">
              Task Priority
            </label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full rounded-xl bg-[#202033] border border-white/10 p-3 mb-5 text-sm outline-none"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            {/* DESCRIPTION */}

            <label className="block text-sm text-gray-300 mb-2">
              Description
              <span className="text-gray-500 ml-2">(Optional)</span>
            </label>

            <textarea
              rows={3}
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some details about this task..."
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 mb-6 text-sm outline-none focus:border-purple-500 resize-none"
            />

            {/* SAVE BUTTON */}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold hover:opacity-90 transition"
            >
              {editingId !== null ? (
                <>
                  <CheckCircle2 size={18} />
                  Update Study Task
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Save Study Task
                </>
              )}
            </button>

          </form>
        </div>
      )}

    </main>
  );
}
