"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import {
  Star, BookOpen, Calculator, PenTool, CheckCircle2, Trophy,
  Heart, Coins, Map, Sparkles, Shield, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Grade } from "@/types";

// ---------- Badges ----------
const BADGES = [
  { id: "first-quest", name: "First Steps", emoji: "👣", desc: "Start your first adventure" },
  { id: "math-master", name: "Math Wizard", emoji: "🔢", desc: "Clear the Math Cavern" },
  { id: "word-wizard", name: "Story Seeker", emoji: "📖", desc: "Complete the Reading Forest" },
  { id: "grammar-guardian", name: "Grammar Guardian", emoji: "✏️", desc: "Repair the Grammar Bridge" },
  { id: "story-star", name: "Word Champion", emoji: "⭐", desc: "Conquer the English Tower" },
  { id: "adventure-hero", name: "Adventure Hero", emoji: "🏆", desc: "Finish a full adventure" },
  { id: "perfect-run", name: "Perfect Run", emoji: "💎", desc: "Complete with no mistakes" },
  { id: "speed-star", name: "Speed Star", emoji: "⚡", desc: "Finish in under 3 minutes" },
];

// ---------- Grade-scaled questions ----------
function getMathQs(grade: number) {
  if (grade <= 3) return [
    { q: "What is 6 + 7?", a: "13", opts: ["12", "13", "14", "11"] },
    { q: "What is 9 × 3?", a: "27", opts: ["24", "27", "30", "21"] },
    { q: "What is 15 − 8?", a: "7", opts: ["6", "7", "8", "5"] },
  ];
  if (grade <= 5) return [
    { q: "What is 8 × 7?", a: "56", opts: ["54", "56", "64", "48"] },
    { q: "What is 144 ÷ 12?", a: "12", opts: ["10", "12", "14", "11"] },
    { q: "What is 3/4 of 20?", a: "15", opts: ["10", "15", "5", "16"] },
  ];
  return [
    { q: "Solve: 3x + 5 = 20. What is x?", a: "5", opts: ["3", "5", "7", "4"] },
    { q: "What is 15% of 80?", a: "12", opts: ["10", "12", "15", "8"] },
    { q: "What is the square root of 81?", a: "9", opts: ["8", "9", "7", "11"] },
  ];
}

function getReadingQs(grade: number) {
  if (grade <= 3) return [
    { q: "In the story, the hero found a glowing key under a rock. What did the key open?", a: "A secret door", opts: ["A treasure chest", "A secret door", "A cage", "A book"] },
    { q: "How did the hero feel when the door opened?", a: "Excited and a little scared", opts: ["Angry", "Excited and a little scared", "Bored", "Sleepy"] },
    { q: "What is the main idea of this part of the adventure?", a: "The hero discovers a new path", opts: ["The hero goes home", "The hero discovers a new path", "The hero loses the key", "Nothing happens"] },
  ];
  return [
    { q: "The ancient scroll said the path would only open for the 'brave of heart.' What does that phrase most likely mean?", a: "Someone who is courageous", opts: ["Someone who is fast", "Someone who is courageous", "Someone who is tall", "Someone who is quiet"] },
    { q: "Why did the guardian test the hero with a riddle?", a: "To make sure they were worthy", opts: ["For fun", "To make sure they were worthy", "To waste time", "Because they were bored"] },
    { q: "Which detail best shows the setting is magical?", a: "The floating lanterns and talking trees", opts: ["The dirt path", "The floating lanterns and talking trees", "The cloudy sky", "The wooden bridge"] },
  ];
}

function getGrammarQs(grade: number) {
  if (grade <= 3) return [
    { q: "Which sentence is correct?", a: "The dragons are sleeping.", opts: ["The dragons is sleeping.", "The dragons are sleeping.", "The dragons be sleeping.", "The dragons sleeping."] },
    { q: "Choose the correct word: The cat ___ on the mat.", a: "sat", opts: ["sit", "sat", "sitsing", "sitted"] },
    { q: "Which needs a capital letter?", a: "On monday we go to school.", opts: ["the dog ran.", "On monday we go to school.", "she likes apples.", "we play outside."] },
  ];
  return [
    { q: "Which sentence uses the correct verb tense?", a: "Yesterday she walked to the market.", opts: ["Yesterday she walk to the market.", "Yesterday she walked to the market.", "Yesterday she walking to the market.", "Yesterday she walks to the market."] },
    { q: "Identify the adjective: The brave knight crossed the dark bridge.", a: "brave / dark", opts: ["knight / bridge", "brave / dark", "crossed / the", "The / knight"] },
    { q: "Which sentence is punctuated correctly?", a: "Wow, that was an amazing adventure!", opts: ["Wow that was an amazing adventure!", "Wow, that was an amazing adventure!", "Wow that was an amazing adventure", "Wow, that was an amazing adventure"] },
  ];
}

function getEnglishQs(grade: number) {
  if (grade <= 3) return [
    { q: "The brave knight felt _____ as he approached the dragon.", a: "courageous", opts: ["courageous", "courage", "courageously", "couraging"] },
    { q: "A synonym for 'happy' is:", a: "joyful", opts: ["sad", "joyful", "angry", "tired"] },
    { q: "Which word means the opposite of 'open'?", a: "closed", opts: ["big", "closed", "fast", "soft"] },
  ];
  return [
    { q: "Choose the best word: The prophecy was _____ and full of mystery.", a: "enigmatic", opts: ["enigmatic", "loud", "simple", "boring"] },
    { q: "A synonym for 'ancient' is:", a: "old", opts: ["new", "old", "small", "bright"] },
    { q: "Which sentence uses figurative language?", a: "The wind whispered secrets through the trees.", opts: ["The wind was strong.", "The wind whispered secrets through the trees.", "It was windy outside.", "The trees moved."] },
  ];
}

type Quest = {
  id: string;
  name: string;
  mapEmoji: string;
  story: string;
  successStory: string;
  color: string;
  badge: string;
  getQuestions: (grade: number) => { q: string; a: string; opts: string[] }[];
};

const QUESTS: Quest[] = [
  {
    id: "math",
    name: "Math Cavern",
    mapEmoji: "⛏️",
    story: "You enter a glowing cavern. Crystal numbers float in the air. A stone guardian blocks the path.\n\n\"Answer my number riddles,\" it booms, \"or turn back!\"",
    successStory: "The crystals flash bright green! The guardian steps aside.\n\n\"You are worthy. The path is open.\"",
    color: "from-purple-500 to-indigo-600",
    badge: "math-master",
    getQuestions: getMathQs,
  },
  {
    id: "reading",
    name: "Reading Forest",
    mapEmoji: "🌳",
    story: "Tall trees whisper as you walk. A magical scroll floats down and unrolls itself.\n\n\"Read carefully,\" the forest seems to say. \"Only those who understand may pass.\"",
    successStory: "The trees part and sunlight pours through.\n\nA path of golden leaves leads forward. You understand the forest's secret!",
    color: "from-pink-500 to-rose-600",
    badge: "word-wizard",
    getQuestions: getReadingQs,
  },
  {
    id: "grammar",
    name: "Grammar Bridge",
    mapEmoji: "🌉",
    story: "A broken bridge hangs over a misty canyon. Words and letters float in the gaps.\n\n\"Fix the sentences,\" a voice calls, \"and the bridge will mend!\"",
    successStory: "Planks snap into place one by one. The bridge is whole again!\n\nYou cross safely to the other side.",
    color: "from-green-500 to-emerald-600",
    badge: "grammar-guardian",
    getQuestions: getGrammarQs,
  },
  {
    id: "english",
    name: "English Tower",
    mapEmoji: "🏰",
    story: "You stand before a tall tower covered in glowing words. The final challenge awaits at the top.\n\nChoose your words wisely — the tower is listening.",
    successStory: "The tower bells ring! Confetti of letters rains down.\n\nYou have conquered the English Tower and completed the adventure!",
    color: "from-amber-500 to-orange-600",
    badge: "story-star",
    getQuestions: getEnglishQs,
  },
];

const STORAGE_BADGES = "kidlearn_badges";
const STORAGE_BEST = "kidlearn_adventure_best";

export default function AdventurePage() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const grade = (user?.grade || 3) as Grade;
  const playerName = user?.name || "Hero";

  const [screen, setScreen] = useState<"map" | "story" | "quiz" | "success" | "complete">("map");
  const [currentQuest, setCurrentQuest] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(0);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [showBadge, setShowBadge] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const quest = QUESTS[currentQuest];
  const questions = quest ? quest.getQuestions(grade) : [];
  const currentQ = questions[qIndex];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BADGES);
      if (saved) setEarnedBadges(JSON.parse(saved));
    } catch {}
  }, []);

  const saveBadge = (id: string) => {
    setEarnedBadges((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(STORAGE_BADGES, JSON.stringify(next));
      setShowBadge(id);
      setTimeout(() => setShowBadge(null), 2200);
      return next;
    });
  };

  const startQuest = (index: number) => {
    if (index > 0 && !completed.includes(QUESTS[index - 1].id)) return; // must clear previous
    setCurrentQuest(index);
    setQIndex(0);
    setFeedback(null);
    setScreen("story");
    if (completed.length === 0) {
      saveBadge("first-quest");
      setStartTime(Date.now());
    }
  };

  const beginQuiz = () => {
    setScreen("quiz");
  };

  const answer = (selected: string) => {
    if (feedback || !currentQ) return;
    const ok = selected === currentQ.a;
    setFeedback(ok ? "correct" : "wrong");

    if (ok) {
      setScore((s) => s + 1);
      setCoins((c) => c + 5);
      setStars((s) => s + 1);
    } else {
      setMistakes((m) => m + 1);
      setLives((l) => Math.max(0, l - 1));
    }

    setTimeout(() => {
      setFeedback(null);
      if (lives <= 1 && !ok) {
        // out of lives - still continue but note it
      }
      if (qIndex < questions.length - 1) {
        setQIndex((i) => i + 1);
      } else {
        // quest complete
        setCompleted((c) => [...c, quest.id]);
        saveBadge(quest.badge);
        setCoins((c) => c + 20);
        setScreen("success");
      }
    }, 900);
  };

  const nextAfterSuccess = () => {
    if (currentQuest < QUESTS.length - 1) {
      setScreen("map");
    } else {
      // full adventure done
      saveBadge("adventure-hero");
      if (mistakes === 0) saveBadge("perfect-run");
      if (startTime && Date.now() - startTime < 180000) saveBadge("speed-star");
      setScreen("complete");
    }
  };

  const resetAdventure = () => {
    setScreen("map");
    setCurrentQuest(0);
    setCompleted([]);
    setQIndex(0);
    setScore(0);
    setMistakes(0);
    setLives(3);
    setCoins(0);
    setStars(0);
    setFeedback(null);
    setStartTime(null);
  };

  // Badge popup
  const badgePopup = showBadge && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="rounded-3xl bg-white p-8 text-center shadow-2xl animate-bounce">
        <div className="mb-3 text-6xl">{BADGES.find((b) => b.id === showBadge)?.emoji}</div>
        <h3 className="text-xl font-bold text-slate-800">Badge Unlocked!</h3>
        <p className="mt-1 font-medium text-purple-600">{BADGES.find((b) => b.id === showBadge)?.name}</p>
        <p className="mt-1 text-sm text-slate-500">{BADGES.find((b) => b.id === showBadge)?.desc}</p>
      </div>
    </div>
  );

  // ---------- MAP SCREEN ----------
  if (screen === "map") {
    return (
      <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" : "bg-slate-50")}>
        {badgePopup}
        <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">← Dashboard</Link>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                <Heart className="h-4 w-4 fill-red-500" /> {lives}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                <Coins className="h-4 w-4" /> {coins}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                <Star className="h-4 w-4 fill-yellow-500" /> {stars}
              </span>
            </div>
          </div>

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-4xl shadow-xl">🗺️</div>
            <h1 className={cn("text-3xl font-bold", isKid ? "text-purple-900" : "text-slate-900")}>
              {playerName}&apos;s Adventure
            </h1>
            <p className={cn("mt-1", isKid ? "text-purple-600" : "text-slate-500")}>
              Grade {grade} · Clear each land to unlock the next!
            </p>
          </div>

          {/* Quest map */}
          <div className="space-y-4">
            {QUESTS.map((q, i) => {
              const isDone = completed.includes(q.id);
              const isLocked = i > 0 && !completed.includes(QUESTS[i - 1].id);
              const isCurrent = !isDone && !isLocked;
              return (
                <button
                  key={q.id}
                  onClick={() => !isLocked && startQuest(i)}
                  disabled={isLocked}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border-2 p-5 text-left transition",
                    isDone && "border-green-300 bg-green-50",
                    isCurrent && "border-purple-300 bg-white shadow-lg hover:-translate-y-0.5",
                    isLocked && "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl text-2xl",
                    isDone ? "bg-green-200" : isCurrent ? `bg-gradient-to-br ${q.color} text-white` : "bg-slate-200"
                  )}>
                    {isDone ? "✅" : isLocked ? "🔒" : q.mapEmoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{q.name}</p>
                    <p className="text-sm text-slate-500">
                      {isDone ? "Completed!" : isLocked ? "Complete the previous land first" : "Tap to enter"}
                    </p>
                  </div>
                  {isCurrent && <Zap className="h-5 w-5 text-purple-500" />}
                </button>
              );
            })}
          </div>

          {/* Badges */}
          <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
              <Trophy className="h-5 w-5 text-amber-500" /> Badge Collection
            </h3>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
              {BADGES.map((b) => {
                const unlocked = earnedBadges.includes(b.id);
                return (
                  <div key={b.id} title={b.desc} className={cn(
                    "rounded-xl border p-2 text-center",
                    unlocked ? "border-amber-200 bg-amber-50" : "border-slate-100 bg-slate-50 opacity-40"
                  )}>
                    <div className="text-2xl">{b.emoji}</div>
                    <p className="mt-0.5 text-[10px] font-medium leading-tight text-slate-700">{b.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- STORY SCREEN ----------
  if (screen === "story") {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" : "bg-slate-50")}>
        {badgePopup}
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-4 text-center text-5xl">{quest.mapEmoji}</div>
          <h2 className="mb-4 text-center text-2xl font-bold text-slate-800">{quest.name}</h2>
          <div className="mb-8 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-slate-700 leading-relaxed">
            {quest.story}
          </div>
          <button
            onClick={beginQuiz}
            className={cn(
              "w-full rounded-2xl py-4 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02]",
              `bg-gradient-to-r ${quest.color}`
            )}
          >
            Face the Challenge!
          </button>
          <button onClick={() => setScreen("map")} className="mt-3 w-full text-sm text-slate-400 hover:underline">
            Back to map
          </button>
        </div>
      </div>
    );
  }

  // ---------- QUIZ SCREEN ----------
  if (screen === "quiz" && currentQ) {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" : "bg-slate-50")}>
        {badgePopup}
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-600">{quest.name}</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-red-500"><Heart className="h-3.5 w-3.5 fill-red-500" />{lives}</span>
              <span className="text-slate-400">Q{qIndex + 1}/{questions.length}</span>
            </div>
          </div>
          <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-purple-500 transition-all" style={{ width: `${((qIndex) / questions.length) * 100}%` }} />
          </div>
          <h2 className="mb-8 mt-6 text-center text-xl font-bold text-slate-800">{currentQ.q}</h2>
          <div className="space-y-3">
            {currentQ.opts.map((opt) => (
              <button
                key={opt}
                onClick={() => answer(opt)}
                disabled={!!feedback}
                className={cn(
                  "w-full rounded-2xl border-2 px-5 py-4 text-left font-medium transition",
                  feedback && opt === currentQ.a && "border-green-500 bg-green-50 text-green-800",
                  feedback === "wrong" && opt !== currentQ.a && "border-red-100 bg-red-50 text-red-300",
                  !feedback && "border-slate-200 hover:border-purple-300 hover:bg-purple-50"
                )}
              >
                {opt}
                {feedback && opt === currentQ.a && <CheckCircle2 className="ml-2 inline h-5 w-5 text-green-600" />}
              </button>
            ))}
          </div>
          {feedback === "wrong" && (
            <p className="mt-4 text-center text-sm font-medium text-red-500">Not quite — you lost a heart!</p>
          )}
          {feedback === "correct" && (
            <p className="mt-4 text-center text-sm font-medium text-green-600">+5 coins · +1 star!</p>
          )}
        </div>
      </div>
    );
  }

  // ---------- SUCCESS SCREEN ----------
  if (screen === "success") {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" : "bg-slate-50")}>
        {badgePopup}
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-5xl">{quest.mapEmoji}</div>
          <h2 className="text-2xl font-bold text-slate-800">{quest.name} Cleared!</h2>
          <div className="my-6 whitespace-pre-wrap rounded-2xl bg-green-50 p-5 text-left text-slate-700 leading-relaxed">
            {quest.successStory}
          </div>
          <div className="mb-6 flex justify-center gap-4 text-sm font-semibold">
            <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">+20 coins</span>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700">+{questions.length} stars</span>
          </div>
          <button
            onClick={nextAfterSuccess}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-4 text-lg font-bold text-white shadow-lg hover:scale-[1.02] transition"
          >
            {currentQuest < QUESTS.length - 1 ? "Continue Adventure →" : "See Results!"}
          </button>
        </div>
      </div>
    );
  }

  // ---------- COMPLETE SCREEN ----------
  return (
    <div className={cn("flex min-h-screen items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-purple-50 to-pink-100" : "bg-slate-50")}>
      {badgePopup}
      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
        <div className="mb-4 text-6xl">🏆</div>
        <h2 className="text-3xl font-bold text-slate-800">Adventure Complete!</h2>
        <p className="mt-2 text-slate-600">Amazing work, {playerName}!</p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-yellow-50 p-3">
            <Star className="mx-auto h-6 w-6 fill-yellow-500 text-yellow-500" />
            <p className="mt-1 text-xl font-bold text-slate-800">{stars}</p>
            <p className="text-xs text-slate-500">Stars</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3">
            <Coins className="mx-auto h-6 w-6 text-amber-600" />
            <p className="mt-1 text-xl font-bold text-slate-800">{coins}</p>
            <p className="text-xs text-slate-500">Coins</p>
          </div>
          <div className="rounded-xl bg-red-50 p-3">
            <Heart className="mx-auto h-6 w-6 fill-red-500 text-red-500" />
            <p className="mt-1 text-xl font-bold text-slate-800">{lives}</p>
            <p className="text-xs text-slate-500">Lives left</p>
          </div>
        </div>
        {mistakes === 0 && (
          <p className="mt-4 text-sm font-medium text-purple-600">💎 Perfect run — no mistakes!</p>
        )}
        <div className="mt-8 flex gap-3">
          <button onClick={resetAdventure} className="flex-1 rounded-xl bg-purple-500 py-3 font-semibold text-white hover:bg-purple-600">
            Play Again
          </button>
          <Link href="/dashboard" className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-50">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
