"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import {
  Sparkles, BookOpen, Feather, Wand2, Loader2, Copy, Check,
  Headphones, Download, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Grade } from "@/types";

type Mode = "passage" | "minibook" | "story";

export default function CreatePage() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const grade = (user?.grade || 3) as Grade;

  const [mode, setMode] = useState<Mode>("passage");
  const [topic, setTopic] = useState("");
  const [character, setCharacter] = useState("");
  const [setting, setSetting] = useState("");
  const [problem, setProblem] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "long">("short");
  const [includeWords, setIncludeWords] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setIsGenerating(true);
    setError("");
    setResult("");

    const apiKey = typeof window !== "undefined" ? localStorage.getItem("openai_key") : null;

    let prompt = "";
    if (mode === "passage") {
      prompt = `Write a unique, engaging reading passage for a Grade ${grade} student.
Topic: ${topic || "animals and nature"}
Length: ${length === "short" ? "80-120 words" : length === "medium" ? "150-220 words" : "250-350 words"}
${includeWords ? "Try to naturally include some common high-frequency words for this grade." : ""}
Make it interesting, age-appropriate, and end with 3 simple comprehension questions.`;
    } else if (mode === "minibook") {
      prompt = `Write a short mini-book chapter (with a title) for a Grade ${grade} student.
Topic/Theme: ${topic || "friendship and adventure"}
Length: ${length === "short" ? "120-180 words" : length === "medium" ? "200-300 words" : "350-500 words"}
Include a clear beginning, middle, and end. Use vivid but simple language.
End with 3 comprehension questions.`;
    } else {
      prompt = `Write a short original story for a Grade ${grade} student.
Main character: ${character || "a brave kid"}
Setting: ${setting || "a magical forest"}
Problem/Conflict: ${problem || "something important is lost"}
Length: ${length === "short" ? "150-200 words" : length === "medium" ? "250-350 words" : "400-600 words"}
Give it a fun title. Make the story complete with a satisfying ending.
End with 3 comprehension questions.`;
    }

    if (!apiKey) {
      // Fallback demo content
      setTimeout(() => {
        setResult(`🌟 The Little Star Who Couldn't Shine

Once upon a time, high above the clouds, there lived a little star named Luma. All the other stars sparkled brightly every night, but Luma's light was very dim. She felt sad and different.

One evening, a friendly owl named Oliver flew up to visit. "Why are you so quiet tonight?" he asked.

"I can't shine like the others," Luma whispered.

Oliver smiled. "Maybe you don't need to shine the same way. What do you love to do?"

Luma thought for a moment. "I love watching the children below and making wishes come true."

"Then do that!" said Oliver. "Your kindness is your special light."

From that night on, Luma focused on helping children. And the more she helped, the brighter she began to glow — not the brightest star in the sky, but the warmest.

Comprehension Questions:
1. Why did Luma feel sad at the beginning?
2. What did Oliver suggest Luma should do?
3. How did Luma's light change by the end of the story?`);
        setIsGenerating(false);
      }, 1800);
      return;
    }

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a talented children's author and educator. Write clear, engaging, age-appropriate content for Grade ${grade} students. Use simple vocabulary mixed with a few richer words. Always include 3 comprehension questions at the end.`,
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 900,
          temperature: 0.8,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${res.status}`);
      }

      const data = await res.json();
      setResult(data.choices?.[0]?.message?.content || "Could not generate content.");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Check your API key in Settings.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50" : "bg-slate-50")}>
      <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">← Dashboard</Link>

        <div className="mt-4 mb-8">
          <h1 className={cn("text-3xl font-bold", isKid ? "text-blue-900" : "text-slate-900")}>
            AI Story & Passage Creator
          </h1>
          <p className={cn(isKid ? "text-blue-600" : "text-slate-500")}>
            Create unique reading material for Grade {grade}
          </p>
        </div>

        {/* Mode selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { id: "passage" as Mode, label: "Reading Passage", icon: BookOpen },
            { id: "minibook" as Mode, label: "Mini-Book Chapter", icon: Feather },
            { id: "story" as Mode, label: "Story Builder", icon: Wand2 },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                mode === m.id
                  ? isKid ? "bg-purple-500 text-white" : "bg-teal-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <m.icon className="h-4 w-4" />
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Controls */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
            {mode === "story" ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Main Character</label>
                  <input value={character} onChange={(e) => setCharacter(e.target.value)}
                    placeholder="e.g. a curious fox, a brave girl named Mia"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Setting</label>
                  <input value={setting} onChange={(e) => setSetting(e.target.value)}
                    placeholder="e.g. underwater city, magical library"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Problem / Adventure</label>
                  <input value={problem} onChange={(e) => setProblem(e.target.value)}
                    placeholder="e.g. the moon disappeared, a lost treasure map"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
                </div>
              </>
            ) : (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Topic or Theme</label>
                <input value={topic} onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. dinosaurs, space, friendship, ocean"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Length</label>
              <div className="flex gap-2">
                {(["short", "medium", "long"] as const).map((l) => (
                  <button key={l} onClick={() => setLength(l)}
                    className={cn("flex-1 rounded-xl py-2 text-sm font-medium capitalize",
                      length === l ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600")}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={includeWords} onChange={(e) => setIncludeWords(e.target.checked)} className="rounded" />
              Include high-frequency words when possible
            </label>

            <button
              onClick={generate}
              disabled={isGenerating}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition disabled:opacity-60",
                isKid ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-teal-600 hover:bg-teal-700"
              )}
            >
              {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              {isGenerating ? "Creating..." : "Generate with AI"}
            </button>

            {typeof window !== "undefined" && !localStorage.getItem("openai_key") && (
              <p className="text-xs text-amber-600">
                No API key found — will use demo content. Add your key in Settings for unique AI stories.
              </p>
            )}
          </div>

          {/* Result */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Generated Content</h3>
              {result && (
                <div className="flex gap-2">
                  <button onClick={copyResult} className="flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <Link href="/reading-coach"
                    className="flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">
                    <Headphones className="h-3.5 w-3.5" /> Practice Reading
                  </Link>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Loader2 className="mb-3 h-8 w-8 animate-spin" />
                <p>Creating something unique for Grade {grade}...</p>
              </div>
            )}

            {!isGenerating && !result && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Wand2 className="mb-3 h-10 w-10 opacity-40" />
                <p>Choose options and click Generate</p>
              </div>
            )}

            {result && (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-xl bg-slate-50 p-5 text-slate-700 leading-relaxed">
                {result}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
