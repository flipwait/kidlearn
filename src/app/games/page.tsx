"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import {
  Gamepad2,
  Calculator,
  BookOpen,
  PenTool,
  Star,
  ArrowRight,
  Timer,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Grade } from "@/types";

const allGames = [
  { id: "math-race", name: "Number Race", subject: "Math", description: "Solve problems as fast as you can!", icon: Calculator, color: "from-blue-400 to-blue-600", grades: [2,3,4,5,6,7,8,9,10] },
  { id: "fraction-fun", name: "Fraction Pizza", subject: "Math", description: "Choose the correct fraction.", icon: Calculator, color: "from-orange-400 to-amber-500", grades: [3,4,5,6] },
  { id: "word-match", name: "Word Match", subject: "Reading", description: "Match words to their meanings.", icon: BookOpen, color: "from-pink-400 to-rose-500", grades: [2,3,4,5,6] },
  { id: "grammar-fixer", name: "Grammar Fixer", subject: "Grammar", description: "Pick the correctly written sentence.", icon: PenTool, color: "from-green-400 to-emerald-500", grades: [3,4,5,6,7,8] },
  { id: "vocab-blast", name: "Vocab Blast", subject: "English", description: "Choose the best word for the sentence.", icon: Star, color: "from-purple-400 to-violet-500", grades: [3,4,5,6,7,8,9,10] },
  { id: "sentence-builder", name: "Sentence Builder", subject: "Grammar", description: "Put the words in the right order.", icon: PenTool, color: "from-teal-400 to-cyan-500", grades: [2,3,4,5] },
];

type Q = { q: string; a: string; opts: string[] };

const questionsMap: Record<string, Q[]> = {
  "math-race": [
    { q: "7 + 5 = ?", a: "12", opts: ["12", "13", "11", "14"] },
    { q: "9 × 3 = ?", a: "27", opts: ["24", "27", "30", "21"] },
    { q: "15 - 8 = ?", a: "7", opts: ["6", "7", "8", "5"] },
    { q: "6 × 4 = ?", a: "24", opts: ["20", "24", "28", "22"] },
    { q: "20 ÷ 4 = ?", a: "5", opts: ["4", "5", "6", "3"] },
    { q: "8 × 7 = ?", a: "56", opts: ["54", "56", "48", "64"] },
  ],
  "fraction-fun": [
    { q: "Which equals 1/2?", a: "2/4", opts: ["1/3", "2/4", "3/5", "1/5"] },
    { q: "3 out of 4 slices is?", a: "3/4", opts: ["1/4", "2/4", "3/4", "4/4"] },
    { q: "Which is larger?", a: "1/2", opts: ["1/3", "1/2", "Equal", "1/4"] },
    { q: "Half of the pizza is?", a: "2/4", opts: ["1/4", "2/4", "3/4", "1/3"] },
  ],
  "word-match": [
    { q: "What does 'happy' mean?", a: "Feeling joy", opts: ["Feeling sad", "Feeling joy", "Feeling angry", "Feeling tired"] },
    { q: "A synonym for 'big' is:", a: "Large", opts: ["Small", "Large", "Tiny", "Short"] },
    { q: "Opposite of 'hot'?", a: "Cold", opts: ["Warm", "Cold", "Cool", "Boiling"] },
    { q: "A place to live?", a: "Home", opts: ["Car", "Home", "Book", "Tree"] },
  ],
  "grammar-fixer": [
    { q: "Which is correct?", a: "The cats are sleeping.", opts: ["The cats is sleeping.", "The cats are sleeping.", "The cats be sleeping.", "The cats sleeping."] },
    { q: "Choose the correct one:", a: "She went to the store.", opts: ["She goed to the store.", "She went to the store.", "She goes yesterday.", "She going to the store."] },
    { q: "Right pronoun?", a: "They are my friends.", opts: ["Them are my friends.", "They are my friends.", "Their are my friends.", "They is my friends."] },
    { q: "Correct punctuation?", a: "Wow, that was amazing!", opts: ["Wow that was amazing!", "Wow, that was amazing!", "Wow that was amazing", "Wow that was amazing."] },
  ],
  "vocab-blast": [
    { q: "The knight was very ____.", a: "brave", opts: ["brave", "scared", "tiny", "sleepy"] },
    { q: "She felt _____ after winning.", a: "proud", opts: ["sad", "proud", "angry", "hungry"] },
    { q: "Synonym for 'quick'?", a: "fast", opts: ["slow", "fast", "heavy", "quiet"] },
    { q: "Opposite of 'empty'?", a: "full", opts: ["full", "open", "closed", "small"] },
  ],
  "sentence-builder": [
    { q: "Order: dog / The / barked / loudly", a: "The dog barked loudly", opts: ["The dog barked loudly", "dog The barked loudly", "barked The dog loudly", "loudly The dog barked"] },
    { q: "Order: is / sky / The / blue", a: "The sky is blue", opts: ["The sky is blue", "sky The is blue", "is The sky blue", "blue The sky is"] },
    { q: "Order: playing / are / children / The", a: "The children are playing", opts: ["The children are playing", "children The are playing", "are The children playing", "playing The children are"] },
  ],
};

export default function GamesPage() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const grade = (user?.grade || 3) as Grade;

  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const filtered = allGames.filter((g) => g.grades.includes(grade));
  const questions = activeGame ? questionsMap[activeGame] || [] : [];
  const current = questions[qIndex];

  useEffect(() => {
    if (activeGame === "math-race" && !finished && !feedback) {
      if (timeLeft <= 0) { setFinished(true); return; }
      const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [activeGame, timeLeft, finished, feedback]);

  const start = (id: string) => {
    setActiveGame(id);
    setScore(0);
    setQIndex(0);
    setFeedback(null);
    setFinished(false);
    setTimeLeft(id === "math-race" ? 30 : 999);
  };

  const answer = (selected: string) => {
    if (feedback || !current) return;
    const ok = selected === current.a;
    setFeedback(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 10);
    setTimeout(() => {
      setFeedback(null);
      if (qIndex < questions.length - 1) setQIndex((i) => i + 1);
      else setFinished(true);
    }, 700);
  };

  if (finished && activeGame) {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-blue-50 to-indigo-100" : "bg-slate-50")}>
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-5xl">🏆</div>
          <h2 className="text-2xl font-bold">Game Over!</h2>
          <p className="mt-2 text-4xl font-bold text-blue-600">{score} pts</p>
          <p className="text-sm text-slate-500">You got {score / 10} / {questions.length} correct</p>
          <div className="mt-8 flex gap-3">
            <button onClick={() => start(activeGame)} className="flex-1 rounded-xl bg-blue-500 py-3 font-semibold text-white">Play Again</button>
            <button onClick={() => setActiveGame(null)} className="flex-1 rounded-xl border py-3 font-semibold">All Games</button>
          </div>
        </div>
      </div>
    );
  }

  if (activeGame && current) {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-blue-50 to-indigo-100" : "bg-slate-50")}>
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-4 flex justify-between text-sm text-slate-500">
            <span>Q {qIndex + 1}/{questions.length}</span>
            <span className="font-semibold text-slate-700">Score: {score}</span>
            {activeGame === "math-race" && <span className={cn("flex items-center gap-1 font-bold", timeLeft <= 10 ? "text-red-500" : "")}><Timer className="h-4 w-4" />{timeLeft}s</span>}
          </div>
          <h2 className="mb-8 text-center text-2xl font-bold">{current.q}</h2>
          <div className="space-y-3">
            {current.opts.map((opt) => (
              <button key={opt} onClick={() => answer(opt)} disabled={!!feedback}
                className={cn("w-full rounded-2xl border-2 py-4 text-lg font-semibold transition",
                  feedback && opt === current.a ? "border-green-500 bg-green-50 text-green-800" :
                  feedback === "wrong" ? "border-red-100 bg-red-50 text-red-300" :
                  "border-slate-200 hover:border-blue-400 hover:bg-blue-50")}>
                {opt}
                {feedback && opt === current.a && <CheckCircle2 className="ml-2 inline h-5 w-5 text-green-600" />}
              </button>
            ))}
          </div>
          <button onClick={() => setActiveGame(null)} className="mt-6 w-full text-sm text-slate-400 hover:underline">Exit Game</button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
      <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">← Dashboard</Link>
        <div className="mt-4 mb-8 flex items-center gap-3">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", isKid ? "bg-amber-100" : "bg-slate-200")}>
            <Gamepad2 className={cn("h-6 w-6", isKid ? "text-amber-600" : "text-slate-600")} />
          </div>
          <div>
            <h1 className={cn("text-3xl font-bold", isKid ? "text-blue-900" : "text-slate-900")}>Games</h1>
            <p className={cn(isKid ? "text-blue-600" : "text-slate-500")}>Grade {grade} · All games are playable!</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((game) => (
            <button key={game.id} onClick={() => start(game.id)}
              className={cn("group rounded-3xl border p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md", isKid ? "border-blue-100 bg-white" : "border-slate-200 bg-white")}>
              <div className={cn("mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", game.color)}>
                <game.icon className="h-7 w-7" />
              </div>
              <span className="text-xs font-medium uppercase text-slate-400">{game.subject}</span>
              <h3 className="mt-1 text-lg font-bold text-slate-800">{game.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{game.description}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 opacity-0 transition group-hover:opacity-100">
                Play now <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
