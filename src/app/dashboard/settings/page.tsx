
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Bell,
  Palette,
  BookOpen,
  Save,
  Sparkles,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("Student");
  const [email, setEmail] = useState("student@example.com");
  const [studyGoal, setStudyGoal] = useState("3");
  const [theme, setTheme] = useState("Dark");
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [saved, setSaved] = useState(false);

  // Load saved settings when the page opens
  useEffect(() => {
    const savedSettings = localStorage.getItem("studysphere-settings");

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);

        setName(settings.name ?? "Student");
        setEmail(settings.email ?? "student@example.com");
        setStudyGoal(settings.studyGoal ?? "3");
        setTheme(settings.theme ?? "Dark");
        setNotifications(settings.notifications ?? true);
        setReminders(settings.reminders ?? true);
      } catch (error) {
        console.error("Could not load settings:", error);
      }
    }
  }, []);

  // Save settings to browser storage
  function handleSave() {
    const settings = {
      name,
      email,
      studyGoal,
      theme,
      notifications,
      reminders,
    };

    localStorage.setItem(
      "studysphere-settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <main className="min-h-screen bg-[#080b16] px-5 py-8 text-white">
      <div className="mx-auto max-w-4xl">

        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-purple-400">
            <Sparkles size={20} />
            <span className="text-sm font-medium">
              Personalize your experience
            </span>
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">
            Settings
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your account and study preferences.
          </p>
        </div>

        {/* Profile Information */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-[#111729] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
              <User size={22} />
            </div>

            <div>
              <h2 className="font-semibold">Profile Information</h2>
              <p className="text-sm text-gray-500">
                Your personal details
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Full Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#080b16] px-4 py-3 outline-none focus:border-purple-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#080b16] px-4 py-3 outline-none focus:border-purple-500"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </section>

        {/* Study Preferences */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-[#111729] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <BookOpen size={22} />
            </div>

            <div>
              <h2 className="font-semibold">Study Preferences</h2>
              <p className="text-sm text-gray-500">
                Set your daily learning goal
              </p>
            </div>
          </div>

          <label className="mb-2 block text-sm text-gray-300">
            Daily Study Goal
          </label>

          <select
            value={studyGoal}
            onChange={(e) => setStudyGoal(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#080b16] px-4 py-3 text-white outline-none focus:border-purple-500 md:w-1/2"
          >
            <option value="1">1 hour per day</option>
            <option value="2">2 hours per day</option>
            <option value="3">3 hours per day</option>
            <option value="4">4 hours per day</option>
            <option value="5">5 hours per day</option>
            <option value="6">6 hours per day</option>
          </select>
        </section>

        {/* Appearance */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-[#111729] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
              <Palette size={22} />
            </div>

            <div>
              <h2 className="font-semibold">Appearance</h2>
              <p className="text-sm text-gray-500">
                Choose your preferred theme
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {["Dark", "Light", "System"].map((option) => (
              <button
                key={option}
                onClick={() => setTheme(option)}
                className={`rounded-xl border px-5 py-3 text-sm transition ${
                  theme === option
                    ? "border-purple-500 bg-purple-500/20 text-purple-300"
                    : "border-white/10 bg-[#080b16] text-gray-400 hover:border-white/30"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-gray-500">
            This saves your theme preference. It does not yet change
            the website's appearance.
          </p>
        </section>

        {/* Notifications */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-[#111729] p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400">
              <Bell size={22} />
            </div>

            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-sm text-gray-500">
                Manage your reminders
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Notifications</p>
                <p className="mt-1 text-xs text-gray-500">
                  Enable study notifications
                </p>
              </div>

              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-5 w-5 accent-purple-500"
              />
            </label>

            <div className="border-t border-white/10" />

            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Study Reminders</p>
                <p className="mt-1 text-xs text-gray-500">
                  Get reminders for your study plan
                </p>
              </div>

              <input
                type="checkbox"
                checked={reminders}
                onChange={(e) => setReminders(e.target.checked)}
                className="h-5 w-5 accent-purple-500"
              />
            </label>
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-4 font-semibold transition hover:bg-purple-500"
        >
          {saved ? <Check size={20} /> : <Save size={20} />}
          {saved ? "Settings Saved!" : "Save Changes"}
        </button>

        <p className="mt-4 text-center text-xs text-gray-600">
          Your preferences are stored in this browser.
        </p>
      </div>
    </main>
  );
}
