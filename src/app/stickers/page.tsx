"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ALL_STICKERS = [
  { id: "first-quest", emoji: "👣", name: "First Steps", how: "Start an adventure" },
  { id: "math-master", emoji: "🔢", name: "Math Wizard", how: "Clear Math Cavern" },
  { id: "word-wizard", emoji: "📖", name: "Story Seeker", how: "Clear Reading Forest" },
  { id: "grammar-guardian", emoji: "✏️", name: "Grammar Guardian", how: "Clear Grammar Bridge" },
  { id: "story-star", emoji: "⭐", name: "Word Champion", how: "Clear English Tower" },
  { id: "adventure-hero", emoji: "🏆", name: "Adventure Hero", how: "Finish full adventure" },
  { id: "perfect-run", emoji: "💎", name: "Perfect Run", how: "Adventure with 0 mistakes" },
  { id: "speed-star", emoji: "⚡", name: "Speed Star", how: "Finish adventure under 3 min" },
  { id: "reader", emoji: "📚", name: "Bookworm", how: "Read 3 library books" },
  { id: "gamer", emoji: "🎮", name: "Game Star", how: "Win 5 games" },
  { id: "creator", emoji: "✨", name: "Story Maker", how: "Create an AI story" },
  { id: "streak-7", emoji: "🔥", name: "Week Streak", how: "7-day login streak" },
  { id: "helper", emoji: "💜", name: "Kind Helper", how: "Use Helper Mode" },
  { id: "coach", emoji: "🎤", name: "Reading Star", how: "Use Reading Coach" },
  { id: "scanner", emoji: "📷", name: "Scan Master", how: "Scan a document" },
  { id: "words", emoji: "🔤", name: "Word Collector", how: "Master 10 HF words" },
];

export default function StickersPage() {
  const { resolvedTheme } = useTheme();
  const isKid = resolvedTheme === "kid";
  const [earned, setEarned] = useState<string[]>([]);

  useEffect(() => {
    try {
      const b = localStorage.getItem("kidlearn_badges");
      if (b) setEarned(JSON.parse(b));
      // Also check other activity flags
      const extra: string[] = [];
      if (localStorage.getItem("kidlearn_read_books")) extra.push("reader");
      if (localStorage.getItem("kidlearn_games_won")) extra.push("gamer");
      if (localStorage.getItem("kidlearn_created_story")) extra.push("creator");
      if (localStorage.getItem("kidlearn_helper")) extra.push("helper");
      if (localStorage.getItem("kidlearn_coach_used")) extra.push("coach");
      if (localStorage.getItem("kidlearn_scanned")) extra.push("scanner");
      setEarned((prev) => Array.from(new Set([...prev, ...extra])));
    } catch {}
  }, []);

  const unlocked = earned.length;
  const total = ALL_STICKERS.length;

  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-amber-50 via-pink-50 to-purple-50" : "bg-slate-50")}>
      <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">← Dashboard</Link>
        <div className="mt-4 mb-2 flex items-center gap-3">
          <h1 className={cn("text-3xl font-bold", isKid ? "text-purple-900" : "text-slate-900")}>Sticker Book</h1>
          <span className="rounded-full bg-amber-100 px-3 py-0.5 text-sm font-semibold text-amber-700">
            {unlocked}/{total}
          </span>
        </div>
        <p className={cn("mb-8", isKid ? "text-purple-600" : "text-slate-500")}>
          Collect stickers by playing and learning!
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {ALL_STICKERS.map((s) => {
            const has = earned.includes(s.id);
            return (
              <div
                key={s.id}
                className={cn(
                  "flex flex-col items-center rounded-2xl border-2 p-5 text-center transition",
                  has
                    ? "border-amber-300 bg-white shadow-md"
                    : "border-dashed border-slate-200 bg-slate-50 opacity-60"
                )}
              >
                <div className={cn("text-5xl", !has && "grayscale")}>{has ? s.emoji : "❓"}</div>
                <p className="mt-2 font-semibold text-slate-800">{has ? s.name : "???"}</p>
                <p className="mt-1 text-xs text-slate-500">{has ? "Collected!" : s.how}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
