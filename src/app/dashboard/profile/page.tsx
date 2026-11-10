
"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Camera,
  Save,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from "lucide-react";

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
  bio: "I am learning new technologies and building my skills every day.",
  photo: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("studysphere-profile");

      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile({ ...defaultProfile, ...parsed });
      }
    } catch {
      console.error("Could not load the saved profile.");
    }

    setLoaded(true);
  }, []);

  function handleChange(
    field: keyof Profile,
    value: string
  ) {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
    setSaved(false);
  }

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        handleChange("photo", reader.result);
      }
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!profile.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!profile.email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    try {
      localStorage.setItem(
        "studysphere-profile",
        JSON.stringify(profile)
      );
      setSaved(true);
    } catch {
      alert("Unable to save your profile. Your photo may be too large.");
    }
  }

  function resetProfile() {
    const confirmed = window.confirm(
      "Are you sure you want to reset your profile?"
    );

    if (!confirmed) return;

    setProfile(defaultProfile);
    localStorage.removeItem("studysphere-profile");
    setSaved(false);
  }

  const initials = profile.name.trim()
    ? profile.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "U";

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#080812] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080812] text-white p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-4"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <User className="text-purple-400" size={22} />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  My Profile
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Manage your personal learning information.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2">
            <Sparkles size={14} />
            Personal Profile
          </div>
        </div>

        {/* PROFILE PREVIEW */}
        <section className="rounded-3xl border border-white/10 bg-[#111120]/90 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-2 border-purple-500/40 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center overflow-hidden text-3xl font-bold shadow-xl shadow-purple-500/20">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 border-4 border-[#111120] flex items-center justify-center transition"
                aria-label="Upload profile photo"
              >
                <Camera size={15} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold">
                {profile.name || "Your Name"}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                {profile.email || "Your email address"}
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                <span className="px-3 py-1.5 rounded-full text-xs bg-purple-500/10 border border-purple-500/20 text-purple-300">
                  {profile.course || "Your Course"}
                </span>

                <span className="px-3 py-1.5 rounded-full text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300">
                  {profile.year}
                </span>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Profile photo must be smaller than 2 MB.
              </p>
            </div>
          </div>
        </section>

        {/* PROFILE FORM */}
        <section className="rounded-3xl border border-white/10 bg-[#111120]/90 p-6 sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-bold">Personal Information</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update your details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              {/* NAME */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    required
                    maxLength={80}
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    required
                    type="email"
                    maxLength={254}
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              {/* COURSE */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Course
                </label>

                <div className="relative">
                  <BookOpen
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    maxLength={100}
                    value={profile.course}
                    onChange={(e) => handleChange("course", e.target.value)}
                    placeholder="Example: B.Tech CSE AI & ML"
                    className="w-full rounded-xl bg-white/[0.04] border border-white/10 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-purple-500 transition"
                  />
                </div>
              </div>

              {/* YEAR */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Academic Year
                </label>

                <div className="relative">
                  <GraduationCap
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <select
                    value={profile.year}
                    onChange={(e) => handleChange("year", e.target.value)}
                    className="w-full appearance-none rounded-xl bg-[#171729] border border-white/10 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-purple-500 transition"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                    <option>Graduate</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* BIO */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                About Me
              </label>

              <textarea
                rows={4}
                maxLength={300}
                value={profile.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Write something about yourself..."
                className="w-full resize-none rounded-xl bg-white/[0.04] border border-white/10 p-4 text-sm outline-none focus:border-purple-500 transition"
              />

              <p className="text-right text-xs text-gray-500 mt-1">
                {profile.bio.length}/300 characters
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                <Save size={18} />
                Save Profile
              </button>

              <button
                type="button"
                onClick={resetProfile}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm text-gray-300 hover:bg-white/[0.08] transition flex items-center justify-center gap-2"
              >
                <RotateCcw size={17} />
                Reset
              </button>
            </div>

            {saved && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-400" />
                <p className="text-sm text-green-300">
                  Your profile has been saved successfully!
                </p>
              </div>
            )}
          </form>
        </section>

        <p className="text-center text-xs text-gray-600 mt-6">
          © 2026 StudySphere AI. All rights reserved.
        </p>
      </div>
    </main>
  );
}
