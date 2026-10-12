"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { BookOpen, Plus, Trash2, Check, Upload, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HighFrequencyWord, Grade } from "@/types";

const STORAGE_KEY = "kidlearn_words";

export default function WordsPage() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const grade = (user?.grade || 3) as Grade;

  const [words, setWords] = useState<HighFrequencyWord[]>([]);
  const [newWord, setNewWord] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [mode, setMode] = useState<"list" | "add" | "bulk">("list");
  const [filter, setFilter] = useState<"all" | "mastered" | "learning">("all");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setWords(JSON.parse(saved));
    } catch {}
  }, []);

  const persist = (list: HighFrequencyWord[]) => {
    setWords(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const addWord = () => {
    if (!newWord.trim()) return;
    const w: HighFrequencyWord = {
      id: `w-${Date.now()}`,
      word: newWord.trim().toLowerCase(),
      grade,
      mastered: false,
    };
    persist([w, ...words]);
    setNewWord("");
    setMode("list");
  };

  const addBulk = () => {
    const list = bulkText
      .split(/[\n,]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (!list.length) return;
    const newOnes: HighFrequencyWord[] = list.map((word, i) => ({
      id: `w-${Date.now()}-${i}`,
      word,
      grade,
      mastered: false,
    }));
    persist([...newOnes, ...words]);
    setBulkText("");
    setMode("list");
  };

  const toggleMastered = (id: string) => {
    persist(words.map((w) => (w.id === id ? { ...w, mastered: !w.mastered } : w)));
  };

  const removeWord = (id: string) => {
    persist(words.filter((w) => w.id !== id));
  };

  const filtered = words.filter((w) => {
    if (filter === "mastered") return w.mastered;
    if (filter === "learning") return !w.mastered;
    return true;
  });

  const masteredCount = words.filter((w) => w.mastered).length;

  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
      <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">← Dashboard</Link>

        <div className="mt-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className={cn("text-3xl font-bold", isKid ? "text-blue-900" : "text-slate-900")}>
              High-Frequency Words
            </h1>
            <p className={cn(isKid ? "text-blue-600" : "text-slate-500")}>
              Grade {grade} · {masteredCount} of {words.length} mastered
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMode("add")} className={cn("flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium text-white", isKid ? "bg-blue-500" : "bg-teal-600")}>
              <Plus className="h-4 w-4" /> Add Word
            </button>
            <button onClick={() => setMode("bulk")} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              <Type className="h-4 w-4" /> Paste List
            </button>
          </div>
        </div>

        {/* Add single */}
        {mode === "add" && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-3 font-semibold">Add a word</h3>
            <div className="flex gap-2">
              <input value={newWord} onChange={(e) => setNewWord(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addWord()}
                placeholder="Type a word..." className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none" />
              <button onClick={addWord} className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white">Add</button>
              <button onClick={() => setMode("list")} className="rounded-xl border px-4 py-2.5 text-sm">Cancel</button>
            </div>
          </div>
        )}

        {/* Bulk paste */}
        {mode === "bulk" && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-2 font-semibold">Paste a list of words</h3>
            <p className="mb-3 text-xs text-slate-500">Separate with commas or new lines</p>
            <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={4}
              placeholder="said, the, of, to, and, a, in..."
              className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-400 focus:outline-none" />
            <div className="flex gap-2">
              <button onClick={addBulk} className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white">Add All</button>
              <button onClick={() => setMode("list")} className="rounded-xl border px-4 py-2.5 text-sm">Cancel</button>
            </div>
          </div>
        )}

        
        {/* Spaced repetition hint */}
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">📅 Spaced practice tip</p>
          <p className="mt-1 text-sm text-amber-700">
            Words you have not marked as mastered yet are due for review today.
            Practice saying them out loud, then mark them when you know them well!
          </p>
          <p className="mt-2 text-xs text-amber-600">
            {(words.filter((w) => !w.mastered).length)} word(s) still learning
          </p>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-2">
          {(["all", "learning", "mastered"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("rounded-full px-4 py-1.5 text-sm font-medium capitalize transition",
                filter === f ? "bg-blue-500 text-white" : "bg-white text-slate-600 border border-slate-200")}>
              {f}
            </button>
          ))}
        </div>

        {/* Word list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="py-12 text-center text-slate-400">No words yet. Add some above!</p>
          )}
          {filtered.map((w) => (
            <div key={w.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
              <button onClick={() => toggleMastered(w.id)}
                className={cn("flex h-8 w-8 items-center justify-center rounded-full border-2 transition",
                  w.mastered ? "border-green-500 bg-green-500 text-white" : "border-slate-300 hover:border-green-400")}>
                {w.mastered && <Check className="h-4 w-4" />}
              </button>
              <span className={cn("flex-1 font-medium", w.mastered ? "text-slate-400 line-through" : "text-slate-800")}>
                {w.word}
              </span>
              <span className="text-xs text-slate-400">Grade {w.grade}</span>
              <button onClick={() => removeWord(w.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Words are saved in your browser and can be used in daily practice and reading passages.
        </p>
      </div>
    </div>
  );
}
