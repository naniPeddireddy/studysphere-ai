
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Code,
  Brain,
  Calculator,
  Search,
  Plus,
  Clock,
  ChevronRight,
  X,
  Check,
  Trash2,
  Circle,
  CheckCircle2,
} from "lucide-react";

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

const STORAGE_KEY = "studysphere-subjects";

const initialSubjects: Subject[] = [
  {
    name: "Python Programming",
    category: "Programming",
    iconType: "code",
    progress: 75,
    completed: 9,
    total: 12,
    topics: [
      "Introduction to Python",
      "Variables and Data Types",
      "Conditional Statements",
      "Loops",
      "Functions",
      "Lists and Tuples",
      "Dictionaries",
      "Object-Oriented Programming",
      "File Handling",
      "Exception Handling",
      "Modules",
      "Practice Problems",
    ],
    completedTopics: [
      "Introduction to Python",
      "Variables and Data Types",
      "Conditional Statements",
      "Loops",
      "Functions",
      "Lists and Tuples",
      "Dictionaries",
      "Object-Oriented Programming",
      "File Handling",
    ],
  },
  {
    name: "Mathematics",
    category: "Mathematics",
    iconType: "calculator",
    progress: 45,
    completed: 5,
    total: 11,
    topics: [
      "Linear Algebra",
      "Matrices",
      "Determinants",
      "Calculus",
      "Differentiation",
      "Integration",
      "Probability",
      "Statistics",
      "Vectors",
      "Complex Numbers",
      "Practice Problems",
    ],
    completedTopics: [
      "Linear Algebra",
      "Matrices",
      "Determinants",
      "Calculus",
      "Differentiation",
    ],
  },
  {
    name: "Artificial Intelligence",
    category: "AI & Technology",
    iconType: "brain",
    progress: 60,
    completed: 6,
    total: 10,
    topics: [
      "Introduction to AI",
      "History of AI",
      "Machine Learning Basics",
      "Neural Networks",
      "Deep Learning",
      "Natural Language Processing",
      "Computer Vision",
      "AI Applications",
      "AI Ethics",
      "Mini Projects",
    ],
    completedTopics: [
      "Introduction to AI",
      "History of AI",
      "Machine Learning Basics",
      "Neural Networks",
      "Deep Learning",
      "Natural Language Processing",
    ],
  },
];

const iconMap = {
  code: Code,
  calculator: Calculator,
  brain: Brain,
  book: BookOpen,
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load saved subjects
  useEffect(() => {
    try {
      const savedSubjects = localStorage.getItem(STORAGE_KEY);

      if (savedSubjects) {
        const parsedSubjects = JSON.parse(savedSubjects);

        if (Array.isArray(parsedSubjects)) {
          const normalizedSubjects: Subject[] = parsedSubjects.map(
            (subject: Subject) => {
              const topics = Array.isArray(subject.topics)
                ? subject.topics
                : [];

              const completedTopics = Array.isArray(
                subject.completedTopics
              )
                ? subject.completedTopics.filter((topic) =>
                    topics.includes(topic)
                  )
                : topics.slice(0, subject.completed || 0);

              const total = topics.length;
              const completed = completedTopics.length;

              return {
                ...subject,
                iconType: subject.iconType || "book",
                topics,
                completedTopics,
                total,
                completed,
                progress:
                  total === 0
                    ? 0
                    : Math.round((completed / total) * 100),
              };
            }
          );

          setSubjects(normalizedSubjects);
        }
      }
    } catch (error) {
      console.error("Could not load subjects:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save subjects automatically
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    } catch (error) {
      console.error("Could not save subjects:", error);
    }
  }, [subjects, loaded]);

  const filtered = subjects.filter((subject) =>
    `${subject.name} ${subject.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectedSubject = subjects.find(
    (subject) => subject.name === selected
  );

  const totalCompleted = subjects.reduce(
    (sum, subject) =>
      sum + (subject.completedTopics?.length ?? 0),
    0
  );

  function addSubject() {
    const name = newName.trim();
    const category = newCategory.trim();

    if (!name || !category) {
      alert("Please enter both subject name and category.");
      return;
    }

    if (
      subjects.some(
        (subject) =>
          subject.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      alert("This subject already exists.");
      return;
    }

    const newSubject: Subject = {
      name,
      category,
      iconType: "book",
      progress: 0,
      completed: 0,
      total: 0,
      topics: [],
      completedTopics: [],
    };

    setSubjects((previous) => [...previous, newSubject]);
    setNewName("");
    setNewCategory("");
    setShowAddModal(false);
  }

  function addTopic() {
    const topic = newTopic.trim();

    if (!topic || !selectedSubject) return;

    if (
      selectedSubject.topics.some(
        (item) => item.toLowerCase() === topic.toLowerCase()
      )
    ) {
      alert("This topic already exists.");
      return;
    }

    setSubjects((previous) =>
      previous.map((subject) => {
        if (subject.name !== selectedSubject.name) return subject;

        const topics = [...subject.topics, topic];
        const completedTopics = subject.completedTopics || [];

        return {
          ...subject,
          topics,
          total: topics.length,
          completed: completedTopics.length,
          progress: Math.round(
            (completedTopics.length / topics.length) * 100
          ),
        };
      })
    );

    setNewTopic("");
  }

  function toggleTopic(topic: string) {
    if (!selectedSubject) return;

    setSubjects((previous) =>
      previous.map((subject) => {
        if (subject.name !== selectedSubject.name) return subject;

        const currentCompleted = subject.completedTopics || [];

        const completedTopics = currentCompleted.includes(topic)
          ? currentCompleted.filter((item) => item !== topic)
          : [...currentCompleted, topic];

        const total = subject.topics.length;
        const completed = completedTopics.length;

        return {
          ...subject,
          completedTopics,
          total,
          completed,
          progress:
            total === 0
              ? 0
              : Math.round((completed / total) * 100),
        };
      })
    );
  }

  function deleteTopic(topic: string) {
    if (!selectedSubject) return;

    setSubjects((previous) =>
      previous.map((subject) => {
        if (subject.name !== selectedSubject.name) return subject;

        const topics = subject.topics.filter(
          (item) => item !== topic
        );

        const completedTopics = (
          subject.completedTopics || []
        ).filter((item) => item !== topic);

        const total = topics.length;
        const completed = completedTopics.length;

        return {
          ...subject,
          topics,
          completedTopics,
          total,
          completed,
          progress:
            total === 0
              ? 0
              : Math.round((completed / total) * 100),
        };
      })
    );
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
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                My Subjects
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Explore your subjects and track your learning.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex w-11 h-11 rounded-xl bg-purple-500/20 items-center justify-center">
            <BookOpen className="text-purple-400" />
          </div>
        </header>

        {/* STATISTICS */}

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111120] border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Total Subjects</p>
            <h2 className="text-3xl font-bold mt-2">
              {String(subjects.length).padStart(2, "0")}
            </h2>
          </div>

          <div className="bg-[#111120] border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Topics Completed</p>
            <h2 className="text-3xl font-bold mt-2">
              {totalCompleted}
            </h2>
          </div>

          <div className="bg-[#111120] border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Learning Status</p>
            <h2 className="text-3xl font-bold mt-2 text-purple-400">
              Active
            </h2>
          </div>
        </section>

        {/* SEARCH AND ADD */}

        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-7">
          <div className="relative flex-1 max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subjects or categories..."
              className="w-full bg-[#111120] border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-purple-500 text-sm"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
          >
            <Plus size={18} />
            Add Subject
          </button>
        </div>

        {/* SUBJECT CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((subject) => {
            const Icon = iconMap[subject.iconType] || BookOpen;
            const completed = subject.completedTopics?.length || 0;
            const total = subject.topics.length;
            const progress =
              total === 0
                ? 0
                : Math.round((completed / total) * 100);

            return (
              <div
                key={subject.name}
                className="bg-[#111120] border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 hover:-translate-y-1 transition duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
                    <Icon className="text-purple-400" size={24} />
                  </div>

                  <span className="text-xs text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-full">
                    {subject.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold mt-6">
                  {subject.name}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  {completed} of {total} topics completed
                </p>

                <div className="flex justify-between mt-6 mb-2 text-sm">
                  <span className="text-gray-400">Your progress</span>
                  <span className="text-purple-300">
                    {progress}%
                  </span>
                </div>

                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
                  <span className="text-xs text-gray-500 flex items-center gap-2">
                    <Clock size={14} />
                    Continue learning
                  </span>

                  <button
                    onClick={() => setSelected(subject.name)}
                    className="text-sm text-purple-300 flex items-center gap-1 hover:text-white transition"
                  >
                    Manage Topics
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            No subjects found. Try another search.
          </div>
        )}
      </div>

      {/* ADD SUBJECT MODAL */}

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#141424] border border-purple-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Add New Subject</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Create your own learning subject.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300">
                  Subject Name
                </label>

                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Example: Java Programming"
                  maxLength={60}
                  className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">
                  Category
                </label>

                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Example: Programming"
                  maxLength={40}
                  className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={addSubject}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold hover:opacity-90 transition"
              >
                Create Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC MANAGEMENT MODAL */}

      {selectedSubject && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[85vh] overflow-y-auto bg-[#141424] border border-purple-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedSubject.name}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Manage your learning topics.
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* TOPIC PROGRESS */}

            <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-4 mb-6">
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-300">Your progress</span>
                <span className="text-purple-300 font-semibold">
                  {selectedSubject.topics.length === 0
                    ? 0
                    : Math.round(
                        ((selectedSubject.completedTopics?.length || 0) /
                          selectedSubject.topics.length) *
                          100
                      )}
                  %
                </span>
              </div>

              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                  style={{
                    width: `${
                      selectedSubject.topics.length === 0
                        ? 0
                        : ((selectedSubject.completedTopics?.length || 0) /
                            selectedSubject.topics.length) *
                          100
                    }%`,
                  }}
                />
              </div>

              <p className="text-xs text-gray-400 mt-3">
                {selectedSubject.completedTopics?.length || 0} of{" "}
                {selectedSubject.topics.length} topics completed
              </p>
            </div>

            {/* ADD TOPIC */}

            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTopic();
                }}
                placeholder="Enter a new topic..."
                maxLength={100}
                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-purple-500"
              />

              <button
                onClick={addTopic}
                disabled={!newTopic.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-sm font-semibold disabled:opacity-40"
              >
                <Plus size={17} />
                Add Topic
              </button>
            </div>

            {/* TOPIC LIST */}

            {selectedSubject.topics.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <BookOpen
                  size={32}
                  className="mx-auto mb-3 text-purple-400"
                />
                <p>No topics added yet.</p>
                <p className="text-xs mt-2">
                  Add your first topic above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedSubject.topics.map((topic, index) => {
                  const completed =
                    selectedSubject.completedTopics?.includes(topic) ||
                    false;

                  return (
                    <div
                      key={topic}
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-3 sm:p-4"
                    >
                      <button
                        onClick={() => toggleTopic(topic)}
                        className={`shrink-0 transition ${
                          completed
                            ? "text-green-400"
                            : "text-gray-500 hover:text-purple-300"
                        }`}
                        title={
                          completed
                            ? "Mark as pending"
                            : "Mark as completed"
                        }
                      >
                        {completed ? (
                          <CheckCircle2 size={23} />
                        ) : (
                          <Circle size={23} />
                        )}
                      </button>

                      <span
                        className={`text-sm flex-1 min-w-0 ${
                          completed
                            ? "text-gray-500 line-through"
                            : "text-gray-200"
                        }`}
                      >
                        {index + 1}. {topic}
                      </span>

                      <span
                        className={`hidden sm:block text-xs ${
                          completed
                            ? "text-green-400"
                            : "text-gray-500"
                        }`}
                      >
                        {completed ? "Completed" : "Pending"}
                      </span>

                      <button
                        onClick={() => deleteTopic(topic)}
                        className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Delete topic"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setSelected(null)}
              className="w-full mt-6 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold hover:bg-white/10 transition"
            >
              Done
              <Check size={16} className="inline ml-2" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
