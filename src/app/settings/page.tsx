"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { Key, Save, Eye, EyeOff, Sparkles, Mic, Info, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const APP_VERSION = "2.0.1";

const CHANGELOG = [
  {
    version: "1.3.0",
    date: "Oct 12, 2026",
    changes: [
      "Fully interactive Adventure Mode – story map, lives, coins, stars, multi-question quests",
      "Grade-scaled adventure questions (easier for grade 2–3, harder for 6+)",
      "Unlock path: clear each land to open the next",
      "New badges: Perfect Run, Speed Star, First Steps",
      "Reading Book Library with full stories + comprehension quizzes",
      "Blank login form for kids to enter their own names",
      "Manage Users mode from profile menu",
    ],
  },
  {
    version: "1.2.0",
    date: "Oct 12, 2026",
    changes: [
      "Added AI Story & Passage Creator (/create)",
      "Adventure Mode badge system",
      "Daily Learning Plan on Kid Dashboard",
      "Scanner print/download worksheets",
      "User switcher menu",
      "Fixed lesson 404s and build errors",
      "Version + changelog in Settings",
    ],
  },
  {
    version: "1.1.0",
    date: "Oct 11, 2026",
    changes: [
      "Multi-user login with unlimited children",
      "Grade-based content for grades 2–10",
      "AI Tutor chat",
      "AI Reading Coach with microphone support",
      "Document Scanner with OCR simulation + worksheet generation",
      "Playable games (Number Race, Fraction Pizza, Word Match, etc.)",
      "Adventure Mode quests",
      "High-Frequency Words manager",
      "Improved Parent analytics dashboard",
      "Dual theme system (Kid Mode / Professional)",
    ],
  },
  {
    version: "1.0.0",
    date: "Oct 11, 2026",
    changes: [
      "Initial release – dual-theme dashboards, basic navigation, settings with OpenAI key storage",
    ],
  },
];

export default function SettingsPage() {
  const { resolvedTheme } = useTheme();
  const isKid = resolvedTheme === "kid";
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [aiTutorEnabled, setAiTutorEnabled] = useState(true);
  const [readingCoachEnabled, setReadingCoachEnabled] = useState(true);
  const [helperMode, setHelperMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem("openai_key") || "";
    setApiKey(key);
    setAiTutorEnabled(localStorage.getItem("ai_tutor") !== "false");
    setReadingCoachEnabled(localStorage.getItem("reading_coach") !== "false");
    setHelperMode(localStorage.getItem("kidlearn_helper") === "true");
  }, []);

  const handleSave = () => {
    localStorage.setItem("openai_key", apiKey);
    localStorage.setItem("ai_tutor", String(aiTutorEnabled));
    localStorage.setItem("reading_coach", String(readingCoachEnabled));
    localStorage.setItem("kidlearn_helper", String(helperMode));
    if (helperMode) localStorage.setItem("kidlearn_badges", JSON.stringify(Array.from(new Set([...(JSON.parse(localStorage.getItem("kidlearn_badges") || "[]")), "helper"]))));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={isKid ? "kid-mode min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50" : "min-h-screen bg-slate-50"}>
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <h1 className={`text-3xl font-bold ${isKid ? "text-blue-900" : "text-slate-900"}`}>
              Settings
            </h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              v{APP_VERSION}
            </span>
          </div>
          <p className={isKid ? "text-blue-600" : "text-slate-500"}>
            Manage AI features and preferences
          </p>
        </div>

        <div className={`space-y-6 rounded-2xl border p-6 shadow-sm ${isKid ? "border-blue-100 bg-white" : "border-slate-200 bg-white"}`}>
          {/* OpenAI Key */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Key className="h-4 w-4" />
              OpenAI API Key
            </label>
            <p className="mb-3 text-xs text-slate-500">
              Required for AI Tutor, AI Reading Coach, Story Creator, and Scanner. Stored only in your browser.
            </p>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* AI Features Toggles */}
          <div className="space-y-4 border-t border-slate-100 pt-6">
            <h3 className="font-semibold text-slate-800">AI Features</h3>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">AI Tutor</p>
                  <p className="text-xs text-slate-500">Help with reading, sound out words, explain concepts</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={aiTutorEnabled}
                onChange={(e) => setAiTutorEnabled(e.target.checked)}
                className="h-5 w-5 rounded accent-blue-500"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Mic className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">AI Reading Coach</p>
                  <p className="text-xs text-slate-500">Microphone · accuracy, pace & mistake feedback</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={readingCoachEnabled}
                onChange={(e) => setReadingCoachEnabled(e.target.checked)}
                className="h-5 w-5 rounded accent-blue-500"
              />
            </label>
          </div>

          
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-pink-100 p-2">
                  <span className="text-lg">💜</span>
                </div>
                <div>
                  <p className="font-medium text-slate-800">Helper Mode</p>
                  <p className="text-xs text-slate-500">Bigger buttons & simpler layout for younger kids</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={helperMode}
                onChange={(e) => setHelperMode(e.target.checked)}
                className="h-5 w-5 rounded accent-blue-500"
              />
            </label>

          <button
            onClick={handleSave}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition ${
              isKid
                ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>

        {/* Version & Changelog */}
        <div className={`mt-6 rounded-2xl border p-6 shadow-sm ${isKid ? "border-blue-100 bg-white" : "border-slate-200 bg-white"}`}>
          <button
            onClick={() => setShowChangelog(!showChangelog)}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-slate-500" />
              <div className="text-left">
                <p className="font-semibold text-slate-800">Version & Changelog</p>
                <p className="text-sm text-slate-500">KidLearn v{APP_VERSION}</p>
              </div>
            </div>
            {showChangelog ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>

          {showChangelog && (
            <div className="mt-6 space-y-6 border-t border-slate-100 pt-6">
              {CHANGELOG.map((entry) => (
                <div key={entry.version}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      v{entry.version}
                    </span>
                    <span className="text-xs text-slate-400">{entry.date}</span>
                    {entry.version === APP_VERSION && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Current
                      </span>
                    )}
                  </div>
                  <ul className="ml-4 list-disc space-y-1 text-sm text-slate-600">
                    {entry.changes.map((change, i) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
