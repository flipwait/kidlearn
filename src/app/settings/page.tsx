"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { Key, Save, Eye, EyeOff, Sparkles, BookOpen, Mic } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { resolvedTheme } = useTheme();
  const isKid = resolvedTheme === "kid";
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [aiTutorEnabled, setAiTutorEnabled] = useState(true);
  const [readingCoachEnabled, setReadingCoachEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In real app: encrypt and store in DB / localStorage securely
    localStorage.setItem("openai_key", apiKey);
    localStorage.setItem("ai_tutor", String(aiTutorEnabled));
    localStorage.setItem("reading_coach", String(readingCoachEnabled));
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
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
          <h1 className={`mt-4 text-3xl font-bold ${isKid ? "text-blue-900" : "text-slate-900"}`}>
            Settings
          </h1>
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
              Required for AI Tutor and AI Reading Coach. Your key is stored locally and never shared.
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
                  <p className="text-xs text-slate-500">
                    Help with reading, sound out words, explain concepts
                  </p>
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
                  <p className="text-xs text-slate-500">
                    Listen with headphones · accuracy, pace & mistake feedback
                  </p>
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
      </div>
    </div>
  );
}
