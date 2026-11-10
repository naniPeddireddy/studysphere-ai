
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Plus,
  FileText,
  Trash2,
  Pencil,
  X,
  Save,
  BookOpen,
  Clock,
  Sparkles,
  Copy,
  Check,
  Brain,
  Loader2,
  ListChecks,
  WandSparkles,
} from "lucide-react";

type Note = {
  id: number;
  title: string;
  subject: string;
  content: string;
  updated: string;
};

const initialNotes: Note[] = [
  {
    id: 1,
    title: "Python Functions",
    subject: "Python Programming",
    content:
      "Functions are reusable blocks of code. We create a function using the def keyword. Example: def greet(): print('Hello')",
    updated: "Sample note",
  },
  {
    id: 2,
    title: "Introduction to AI",
    subject: "Artificial Intelligence",
    content:
      "Artificial Intelligence is the ability of machines to perform tasks that normally require human intelligence.",
    updated: "Sample note",
  },
  {
    id: 3,
    title: "Linear Algebra Basics",
    subject: "Mathematics",
    content:
      "Linear algebra is a branch of mathematics that studies vectors, matrices, and linear equations.",
    updated: "Sample note",
  },
];

export default function SmartNotes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("All Subjects");

  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Python Programming");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [aiResult, setAiResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [copied, setCopied] = useState(false);

  const [aiMode, setAiMode] = useState<
    "summary" | "points" | "explanation"
  >("summary");

  // LOAD SAVED NOTES
  useEffect(() => {
    try {
      const saved = localStorage.getItem("studysphere-notes");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setNotes(parsed);
        }
      }
    } catch (error) {
      console.error("Unable to load notes:", error);
    }

    setIsLoaded(true);
  }, []);

  // SAVE NOTES
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        "studysphere-notes",
        JSON.stringify(notes)
      );
    } catch (error) {
      console.error("Unable to save notes:", error);
    }
  }, [notes, isLoaded]);

  // SUBJECT FILTER
  const subjects = [
    "All Subjects",
    ...Array.from(new Set(notes.map((note) => note.subject))),
  ];

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      `${note.title} ${note.subject} ${note.content}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesSubject =
      filterSubject === "All Subjects" ||
      note.subject === filterSubject;

    return matchesSearch && matchesSubject;
  });

  const totalSubjects = new Set(
    notes.map((note) => note.subject)
  ).size;

  // CREATE NOTE
  function openNewNote() {
    setEditingId(null);
    setTitle("");
    setSubject("Python Programming");
    setContent("");
    setShowEditor(true);
  }

  // EDIT NOTE
  function editNote(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setSubject(note.subject);
    setContent(note.content);
    setShowEditor(true);
  }

  // SAVE NOTE
  function saveNote(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    if (editingId !== null) {
      setNotes((previous) =>
        previous.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: title.trim(),
                subject,
                content: content.trim(),
                updated: "Just now",
              }
            : note
        )
      );
    } else {
      setNotes((previous) => [
        {
          id: Date.now(),
          title: title.trim(),
          subject,
          content: content.trim(),
          updated: "Just now",
        },
        ...previous,
      ]);
    }

    setShowEditor(false);
  }

  // DELETE NOTE
  function deleteNote(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (confirmed) {
      setNotes((previous) =>
        previous.filter((note) => note.id !== id)
      );
    }
  }

  // AI SMART NOTES
  async function generateAIContent(
    note: Note,
    mode: "summary" | "points" | "explanation"
  ) {
    if (!note.content.trim()) {
      setAiError("This note has no content to process.");
      return;
    }

    setSelectedNote(note);
    setAiMode(mode);
    setAiResult("");
    setAiError("");
    setCopied(false);
    setIsGenerating(true);

    let instruction = "";

    if (mode === "summary") {
      instruction = `
Summarize the following study notes.

Requirements:
- Use very simple English.
- Explain the main idea clearly.
- Keep important technical terms.
- Use short paragraphs and headings.
- Do not add unrelated information.
- Make the summary useful for a student preparing for exams.
`;
    } else if (mode === "points") {
      instruction = `
Extract the most important points from these study notes.

Requirements:
- Give 5 to 10 important points if the content allows.
- Use a numbered list.
- Use simple English.
- Include important definitions and formulas if present.
- Focus on exam preparation.
- Do not invent facts.
`;
    } else {
      instruction = `
Explain these study notes to a beginner.

Requirements:
- Start from the basics.
- Use very simple English.
- Explain difficult terms.
- Include a simple example where useful.
- Organize the answer using headings.
- Do not invent facts.
`;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `${instruction}

Note title: ${note.title}

Subject: ${note.subject}

Study notes:
${note.content}`,
          history: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to generate AI content."
        );
      }

      if (!data.reply || typeof data.reply !== "string") {
        throw new Error("The AI returned an empty response.");
      }

      setAiResult(data.reply);
    } catch (error) {
      setAiError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  // COPY AI RESULT
  async function copyAIResult() {
    if (!aiResult) return;

    try {
      await navigator.clipboard.writeText(aiResult);
      setCopied(true);

      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("Unable to copy. Please try again.");
    }
  }

  // SAVE AI RESULT AS A NEW NOTE
  function saveAIResultAsNote() {
    if (!aiResult || !selectedNote) return;

    const newNote: Note = {
      id: Date.now(),
      title: `${selectedNote.title} - AI ${
        aiMode === "summary"
          ? "Summary"
          : aiMode === "points"
            ? "Key Points"
            : "Explanation"
      }`,
      subject: selectedNote.subject,
      content: aiResult,
      updated: "AI Generated",
    };

    setNotes((previous) => [newNote, ...previous]);
    setAiResult("");
    setSelectedNote(null);
  }

  const totalWords = notes.reduce(
    (total, note) =>
      total + note.content.trim().split(/\s+/).filter(Boolean).length,
    0
  );

  return (
    <main className="min-h-screen bg-[#080812] p-5 text-white md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Smart Notes
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Organize your knowledge in one place.
              </p>
            </div>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20">
            <BookOpen className="text-purple-400" />
          </div>
        </header>

        {/* STATISTICS */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-5 transition hover:border-purple-500/40">
            <p className="text-sm text-gray-400">Total Notes</p>
            <h2 className="mt-2 text-3xl font-bold">
              {notes.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-5 transition hover:border-purple-500/40">
            <p className="text-sm text-gray-400">Subjects Covered</p>
            <h2 className="mt-2 text-3xl font-bold">
              {totalSubjects}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-5 transition hover:border-purple-500/40">
            <p className="text-sm text-gray-400">Words in Your Notes</p>
            <h2 className="mt-2 text-3xl font-bold text-purple-400">
              {totalWords.toLocaleString()}
            </h2>
          </div>

        </section>

        {/* AI SMART NOTES BANNER */}
        <section className="relative mb-9 overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 via-[#15132b] to-blue-900/20 p-6 md:p-8">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-purple-300">
                <Sparkles size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Powered by Gemini AI
                </span>
              </div>

              <h2 className="text-2xl font-bold md:text-3xl">
                Make your notes smarter.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                Generate summaries, extract important points, and
                understand difficult topics with your AI assistant.
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/15">
              <Brain size={34} className="text-purple-300" />
            </div>
          </div>
        </section>

        {/* SEARCH AND FILTER */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row">

          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative max-w-md flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your notes..."
                className="w-full rounded-xl border border-white/10 bg-[#111120] py-3 pl-12 pr-11 text-sm outline-none focus:border-purple-500"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  title="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#111120] px-4 py-3 text-sm outline-none focus:border-purple-500"
            >
              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={openNewNote}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:opacity-90"
          >
            <Plus size={18} />
            Create New Note
          </button>
        </div>

        {/* NOTES HEADING */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Your Notes</h2>
          <span className="text-xs text-gray-500">
            {filteredNotes.length} of {notes.length} notes
          </span>
        </div>

        {/* NOTES LIST */}
        {filteredNotes.length === 0 ? (

          <div className="rounded-2xl border border-white/10 bg-[#111120] p-12 text-center">
            <FileText
              size={38}
              className="mx-auto mb-4 text-purple-400"
            />

            <h3 className="font-semibold">
              {notes.length === 0 ? "No notes yet" : "No notes found"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {notes.length === 0
                ? "Create your first study note."
                : "Try another search or subject filter."}
            </p>

            {notes.length === 0 && (
              <button
                onClick={openNewNote}
                className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500"
              >
                Create Your First Note
              </button>
            )}
          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-2xl border border-white/10 bg-[#111120] p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40"
              >

                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15">
                    <FileText
                      className="text-purple-400"
                      size={22}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editNote(note)}
                      title="Edit note"
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-purple-500/20 hover:text-purple-300"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => deleteNote(note.id)}
                      title="Delete note"
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="mt-5 break-words text-lg font-bold">
                  {note.title}
                </h3>

                <span className="mt-3 inline-block rounded-full bg-purple-500/10 px-3 py-1.5 text-xs text-purple-300">
                  {note.subject}
                </span>

                <p className="mt-4 line-clamp-3 break-words text-sm leading-6 text-gray-400">
                  {note.content}
                </p>

                {/* AI ACTIONS */}
                <div className="mt-5 space-y-2 border-t border-white/10 pt-4">

                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-purple-300">
                    <Sparkles size={14} />
                    AI Study Tools
                  </p>

                  <button
                    onClick={() => generateAIContent(note, "summary")}
                    disabled={isGenerating}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-2.5 text-xs font-medium text-purple-300 transition hover:bg-purple-500/20 disabled:opacity-40"
                  >
                    <WandSparkles size={15} />
                    Generate Summary
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => generateAIContent(note, "points")}
                      disabled={isGenerating}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-xs text-gray-300 transition hover:bg-white/10 disabled:opacity-40"
                    >
                      <ListChecks size={14} />
                      Key Points
                    </button>

                    <button
                      onClick={() => generateAIContent(note, "explanation")}
                      disabled={isGenerating}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-2.5 text-xs text-gray-300 transition hover:bg-white/10 disabled:opacity-40"
                    >
                      <Brain size={14} />
                      Explain
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={14} />
                  {note.updated}
                </div>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* CREATE / EDIT MODAL */}
      {showEditor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setShowEditor(false)}
        >
          <form
            onSubmit={saveNote}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-purple-500/30 bg-[#141424] p-6"
          >

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {editingId !== null ? "Edit Note" : "Create New Note"}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Write and organize your study notes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="rounded-lg bg-white/5 p-2 transition hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <label className="mb-2 block text-sm text-gray-300">
              Note Title
            </label>

            <input
              required
              maxLength={80}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              className="mb-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-purple-500"
            />

            <p className="mb-5 text-right text-xs text-gray-500">
              {title.length}/80 characters
            </p>

            <label className="mb-2 block text-sm text-gray-300">
              Subject
            </label>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mb-5 w-full rounded-xl border border-white/10 bg-[#202033] p-3 outline-none focus:border-purple-500"
            >
              <option>Python Programming</option>
              <option>Mathematics</option>
              <option>Artificial Intelligence</option>
              <option>Other</option>
            </select>

            <label className="mb-2 block text-sm text-gray-300">
              Note Content
            </label>

            <textarea
              required
              maxLength={5000}
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notes here..."
              className="w-full resize-y rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-purple-500"
            />

            <p className="mb-6 mt-2 text-right text-xs text-gray-500">
              {content.length}/5000 characters
            </p>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold transition hover:opacity-90"
            >
              <Save size={18} />
              {editingId !== null ? "Update Note" : "Save Note"}
            </button>
          </form>
        </div>
      )}

      {/* AI RESULT MODAL */}
      {selectedNote && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!isGenerating) {
              setSelectedNote(null);
              setAiResult("");
              setAiError("");
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-purple-500/30 bg-[#121222] shadow-2xl shadow-purple-950/30"
          >

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15">
                  <Sparkles className="text-purple-300" size={22} />
                </div>

                <div>
                  <h2 className="font-bold">
                    {aiMode === "summary"
                      ? "AI Note Summary"
                      : aiMode === "points"
                        ? "Important Key Points"
                        : "AI Topic Explanation"}
                  </h2>

                  <p className="mt-1 max-w-[230px] truncate text-xs text-gray-500 sm:max-w-sm">
                    {selectedNote.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!isGenerating) {
                    setSelectedNote(null);
                    setAiResult("");
                    setAiError("");
                  }
                }}
                disabled={isGenerating}
                className="rounded-xl bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="min-h-[250px] flex-1 overflow-y-auto p-5 sm:p-7">

              {isGenerating ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10">
                    <Loader2
                      size={30}
                      className="animate-spin text-purple-400"
                    />
                  </div>

                  <h3 className="mt-5 font-semibold">
                    Gemini is working on your notes...
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Preparing your study-friendly content.
                  </p>
                </div>
              ) : aiError ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5">
                  <p className="text-sm text-red-300">
                    {aiError}
                  </p>

                  <button
                    onClick={() =>
                      generateAIContent(selectedNote, aiMode)
                    }
                    className="mt-4 rounded-lg bg-red-500/15 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/25"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-200">
                  {aiResult}
                </div>
              )}

            </div>

            {/* MODAL FOOTER */}
            {!isGenerating && aiResult && (
              <div className="flex flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:justify-between sm:p-6">

                <button
                  onClick={copyAIResult}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 transition hover:bg-white/10"
                >
                  {copied ? <Check size={17} /> : <Copy size={17} />}
                  {copied ? "Copied" : "Copy Result"}
                </button>

                <button
                  onClick={saveAIResultAsNote}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold transition hover:opacity-90"
                >
                  <Save size={17} />
                  Save as New Note
                </button>

              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}
