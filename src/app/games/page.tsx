"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  Loader2,
  Shuffle,
  Type,
  Eye,
  Volume2,
  Puzzle,
  Target,
  Zap,
  BookOpen,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Grade, HighFrequencyWord } from "@/types";
import { defaultPracticeWords } from "@/lib/grade-content";

type GameDef = {
  id: string;
  name: string;
  description: string;
  icon: typeof Star;
  color: string;
  /** How the play mode works */
  mode: "pick" | "type" | "scramble" | "missing" | "listen";
};

const GAME_CATALOG: GameDef[] = [
  { id: "match-meaning", name: "Quick Pick", description: "See a word — pick it from the choices", icon: Target, color: "from-pink-500 to-rose-600", mode: "pick" },
  { id: "spell-it", name: "Spell It", description: "Picture or sound clue — you type the spelling", icon: Type, color: "from-blue-500 to-indigo-600", mode: "type" },
  { id: "unscramble", name: "Unscramble", description: "Letters are mixed up — fix the word", icon: Shuffle, color: "from-violet-500 to-purple-600", mode: "scramble" },
  { id: "missing-letter", name: "Missing Letter", description: "Fill in the blank letter(s)", icon: Puzzle, color: "from-amber-500 to-orange-600", mode: "missing" },
  { id: "flash-memory", name: "Flash Memory", description: "Word flashes — type what you saw", icon: Eye, color: "from-teal-500 to-cyan-600", mode: "type" },
  { id: "say-and-pick", name: "Say & Pick", description: "Listen (or read aloud) then choose the word", icon: Volume2, color: "from-green-500 to-emerald-600", mode: "listen" },
  { id: "speed-round", name: "Speed Round", description: "Beat the clock — pick the correct word", icon: Zap, color: "from-red-500 to-rose-600", mode: "pick" },
  { id: "rhyme-time", name: "Rhyme Time", description: "Pick the word that rhymes", icon: BookOpen, color: "from-sky-500 to-blue-600", mode: "pick" },
  { id: "odd-one-out", name: "Odd One Out", description: "Which word does not belong?", icon: Star, color: "from-fuchsia-500 to-pink-600", mode: "pick" },
  { id: "build-word", name: "Build the Word", description: "Arrange letters in the right order", icon: Shuffle, color: "from-lime-500 to-green-600", mode: "scramble" },
  { id: "fill-sentence", name: "Fill the Sentence", description: "Choose the word that fits the sentence", icon: Type, color: "from-indigo-500 to-violet-600", mode: "pick" },
  { id: "double-check", name: "Double Check", description: "Is this word spelled correctly?", icon: CheckCircle2, color: "from-emerald-500 to-teal-600", mode: "pick" },
  { id: "first-last", name: "First & Last", description: "Type the word from first and last letter clues", icon: Puzzle, color: "from-orange-500 to-amber-600", mode: "type" },
  { id: "memory-match", name: "Word Twin", description: "Pick the matching word from look-alikes", icon: Eye, color: "from-purple-500 to-fuchsia-600", mode: "pick" },
  { id: "streak-challenge", name: "Streak Challenge", description: "How many correct in a row?", icon: Zap, color: "from-rose-500 to-red-600", mode: "pick" },
];


/** Simple picture clues for common words (emoji). Unknown words use sound only. */
const WORD_EMOJIS: Record<string, string> = {
  cat: "🐱", dog: "🐶", sun: "☀️", moon: "🌙", star: "⭐", tree: "🌳", book: "📖",
  car: "🚗", bus: "🚌", fish: "🐟", bird: "🐦", frog: "🐸", ball: "⚽", cake: "🎂",
  apple: "🍎", home: "🏠", school: "🏫", water: "💧", fire: "🔥", heart: "❤️",
  happy: "😊", sad: "😢", run: "🏃", jump: "🦘", sleep: "😴", eat: "🍽️",
  said: "💬", the: "👉", and: "➕", you: "👆", was: "⏪", for: "🎁", are: "👥",
  they: "👫", have: "🤝", from: "📤", what: "❓", were: "👥", when: "⏰", your: "🫵",
  because: "💡", could: "🤔", would: "🤷", should: "✅", there: "📍", their: "👨‍👩‍👧",
  about: "ℹ️", which: "🔀", people: "👥", through: "🚪", before: "⏪", around: "🔄",
  red: "🔴", blue: "🔵", green: "🟢", yellow: "🟡", big: "🐘", small: "🐜",
};

function pictureFor(word: string): string {
  return WORD_EMOJIS[word.toLowerCase()] || "🔤";
}

function scramble(word: string): string {
  const chars = word.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const out = chars.join("");
  return out === word && word.length > 1 ? scramble(word) : out;
}

function maskWord(word: string): string {
  if (word.length <= 2) return word[0] + "_";
  const idx = Math.floor(word.length / 2);
  return word
    .split("")
    .map((c, i) => (i === idx || i === idx - 1 ? "_" : c))
    .join("");
}

function distractors(word: string, pool: string[], n = 3): string[] {
  const others = pool.filter((w) => w !== word);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const picks = shuffled.slice(0, n);
  while (picks.length < n) {
    // synthetic look-alikes
    picks.push(word + (picks.length === 0 ? "e" : "s"));
  }
  return picks;
}

type Round = {
  prompt: string;
  answer: string;
  options?: string[];
  mode: GameDef["mode"];
  speakWord?: string;
};

function buildRound(game: GameDef, word: string, pool: string[]): Round {
  const opts = [word, ...distractors(word, pool)].sort(() => Math.random() - 0.5);
  switch (game.mode) {
    case "scramble":
      return { prompt: `Unscramble: ${scramble(word)}`, answer: word, mode: "scramble" };
    case "missing":
      return { prompt: `Fill in the missing letters: ${maskWord(word)}`, answer: word, mode: "type" };
    case "type":
      if (game.id === "spell-it") {
        const pic = pictureFor(word);
        return {
          prompt: pic === "🔤"
            ? `Listen, then spell the word (${word.length} letters)`
            : `What word is this? ${pic}`,
          answer: word,
          mode: "type",
          // flag for UI to auto-speak
          speakWord: word,
        } as Round;
      }
      if (game.id === "flash-memory") {
        return { prompt: `Remember this word (then type it): ${word}`, answer: word, mode: "type" };
      }
      if (game.id === "first-last") {
        return {
          prompt: `Starts with "${word[0]}" and ends with "${word[word.length - 1]}" · ${word.length} letters`,
          answer: word,
          mode: "type",
        };
      }
      return { prompt: `Type the spelling (${word.length} letters)`, answer: word, mode: "type", speakWord: word } as Round;
    case "listen":
      return { prompt: `Find the word: ${word}`, answer: word, options: opts, mode: "pick" };
    case "pick":
    default:
      if (game.id === "fill-sentence") {
        return {
          prompt: `Pick the word that fits: “I _____ go to school.” → choose the list word`,
          answer: word,
          options: opts,
          mode: "pick",
        };
      }
      if (game.id === "double-check") {
        const wrong = word.length > 2 ? word.slice(0, -1) + (word.endsWith("e") ? "a" : "e") : word + "x";
        const choices = [word, wrong].sort(() => Math.random() - 0.5);
        return {
          prompt: `Which spelling is correct?`,
          answer: word,
          options: choices,
          mode: "pick",
        };
      }
      if (game.id === "odd-one-out") {
        const odd = distractors(word, pool, 1)[0];
        const set = [word, word, odd].sort(() => Math.random() - 0.5);
        return {
          prompt: `Which word is the odd one out?`,
          answer: odd,
          options: Array.from(new Set(set)),
          mode: "pick",
        };
      }
      if (game.id === "rhyme-time") {
        return {
          prompt: `Which word is in your list? (practice recognizing it)`,
          answer: word,
          options: opts,
          mode: "pick",
        };
      }
      return { prompt: `Pick the word: ${word}`, answer: word, options: opts, mode: "pick" };
  }
}

export default function GamesPage() {
  const { user } = useAuth();
  const grade = (user?.grade || 3) as Grade;
  const [bank, setBank] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);
  const [flashHidden, setFlashHidden] = useState(false);

  // AI custom game
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem("kidlearn_words");
      if (s) {
        const list = (JSON.parse(s) as HighFrequencyWord[]).map((w) => w.word.toLowerCase());
        if (list.length) {
          setBank(list);
          return;
        }
      }
    } catch {}
    setBank(defaultPracticeWords(grade));
  }, [grade]);

  const pool = useMemo(() => (bank.length ? bank : defaultPracticeWords(grade)), [bank, grade]);

  const game = GAME_CATALOG.find((g) => g.id === activeId);

  const startGame = (id: string) => {
    const g = GAME_CATALOG.find((x) => x.id === id);
    if (!g) return;
    const words = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(8, pool.length));
    const built = words.map((w) => buildRound(g, w, pool));
    setActiveId(id);
    setRounds(built);
    setIdx(0);
    setScore(0);
    setTyped("");
    setFeedback(null);
    setFinished(false);
    setFlashHidden(false);
    if (id === "flash-memory") {
      setTimeout(() => setFlashHidden(true), 1500);
    }
  };

  const current = rounds[idx];

  useEffect(() => {
    if (current?.speakWord && activeId === "spell-it") {
      const t = setTimeout(() => {
        try {
          const u = new SpeechSynthesisUtterance(current.speakWord);
          u.rate = 0.85;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(u);
        } catch {}
      }, 300);
      return () => clearTimeout(t);
    }
  }, [current?.speakWord, idx, activeId]);

  const submit = (value: string) => {
    if (!current || feedback) return;
    const ok = value.trim().toLowerCase() === current.answer.toLowerCase();
    setFeedback(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      setTyped("");
      setFlashHidden(false);
      if (idx < rounds.length - 1) {
        setIdx((i) => i + 1);
        if (activeId === "flash-memory") {
          setTimeout(() => setFlashHidden(true), 1500);
        }
      } else {
        setFinished(true);
      }
    }, 700);
  };

  const speak = (text: string) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  };

  const generateAiGame = async () => {
    setAiLoading(true);
    setAiResult("");
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("openai_key") : null;
    const words = pool.slice(0, 12).join(", ");
    const prompt = `Create a fun reading word game for Grade ${grade} using these words: ${words}.
Idea from parent/student: ${aiPrompt || "memory or matching game"}
Return plain text: game title, rules (short), and 5 sample rounds kids can play on paper or aloud.`;

    if (!apiKey) {
      setTimeout(() => {
        setAiResult(`Word Hop (demo — add API key in Settings for custom AI games)

Words: ${words}

Rules: Say a word from the list. Kid finds it, spells it out loud, then uses it in a silly sentence.

Sample rounds:
1. Spell the word, then clap once for each letter.
2. Parent says a sentence with a blank — kid fills with a list word.
3. Race: who can find the longest word in the list?
4. Draw a tiny picture that reminds you of the word.
5. Spell it backward for a bonus point!`);
        setAiLoading(false);
      }, 800);
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
            { role: "system", content: "You design playful, age-appropriate reading/spelling games for children. Keep instructions clear and short." },
            { role: "user", content: prompt },
          ],
          max_tokens: 700,
          temperature: 0.8,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setAiResult(data.choices?.[0]?.message?.content || "");
    } catch {
      setAiResult("Could not generate. Check your OpenAI key in Settings.");
    } finally {
      setAiLoading(false);
    }
  };

  // Finished
  if (finished && game) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 text-5xl">🎉</div>
          <h2 className="text-2xl font-bold">{game.name}</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {score}/{rounds.length} correct · Grade {grade}
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => startGame(game.id)} className="flex-1 rounded-xl bg-teal-600 py-3 font-semibold text-white">
              Play again
            </button>
            <button onClick={() => setActiveId(null)} className="flex-1 rounded-xl border border-slate-200 py-3 font-semibold dark:border-slate-700">
              All games
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active round
  if (activeId && current && game) {
    const showPrompt =
      game.id === "flash-memory" && flashHidden
        ? "Type the word you saw"
        : current.prompt;

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex justify-between text-sm text-slate-500">
            <span>
              {game.name} · Grade {grade}
            </span>
            <span>
              {idx + 1}/{rounds.length}
            </span>
          </div>
          {activeId === "spell-it" ? (
            <div className="mb-6 text-center">
              <div className="mb-3 text-6xl">
                {current.speakWord ? pictureFor(current.speakWord) : "🔊"}
              </div>
              <p className="text-lg font-bold">Spell the word</p>
              <p className="mt-1 text-sm text-slate-500">
                {current.speakWord && pictureFor(current.speakWord) !== "🔤"
                  ? "Look at the picture or tap Hear"
                  : "Tap Hear, then type what you hear"}
              </p>
              <button
                type="button"
                onClick={() => current.speakWord && speak(current.speakWord)}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 dark:bg-violet-900 dark:text-violet-200"
              >
                <Volume2 className="h-4 w-4" /> Hear again
              </button>
            </div>
          ) : (
            <h2 className="mb-6 text-center text-lg font-bold">{showPrompt}</h2>
          )}

          {(current.mode === "pick" || current.options) && (
            <div className="space-y-3">
              {(current.options || []).map((opt) => (
                <button
                  key={opt}
                  onClick={() => submit(opt)}
                  disabled={!!feedback}
                  className={cn(
                    "w-full rounded-xl border-2 px-4 py-3 text-left font-medium transition",
                    feedback && opt.toLowerCase() === current.answer.toLowerCase() && "border-green-500 bg-green-50 dark:bg-green-950",
                    feedback === "wrong" && opt.toLowerCase() !== current.answer.toLowerCase() && "opacity-40",
                    !feedback && "border-slate-200 hover:border-teal-400 dark:border-slate-700"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {(current.mode === "type" || current.mode === "scramble" || game.mode === "missing") && !current.options && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(typed);
              }}
              className="space-y-3"
            >
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoFocus
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-lg dark:border-slate-700 dark:bg-slate-800"
                placeholder="Type your answer"
              />
              <button type="submit" className="w-full rounded-xl bg-teal-600 py-3 font-semibold text-white">
                Check
              </button>
            </form>
          )}

          {game.mode === "listen" && (
            <button
              type="button"
              onClick={() => speak(current.answer)}
              className="mt-3 flex w-full items-center justify-center gap-2 text-sm text-teal-600"
            >
              <Volume2 className="h-4 w-4" /> Hear the word
            </button>
          )}

          {feedback === "correct" && <p className="mt-4 text-center text-sm font-medium text-green-600">Correct!</p>}
          {feedback === "wrong" && (
            <p className="mt-4 text-center text-sm font-medium text-red-500">Answer: {current.answer}</p>
          )}

          <button onClick={() => setActiveId(null)} className="mt-6 w-full text-sm text-slate-400 hover:underline">
            Exit
          </button>
        </div>
      </div>
    );
  }

  // Catalog
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/dashboard" className="text-sm font-medium text-teal-600 hover:underline dark:text-teal-400">
          ← Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold">Reading Games</h1>
        <p className="mb-2 text-slate-500 dark:text-slate-400">
          Practice <strong>high-frequency</strong> and <strong>spelling</strong> words through play · Grade {grade}
        </p>
        <p className="mb-6 text-sm text-slate-500">
          Using {pool.length} words from your{" "}
          <Link href="/words" className="text-teal-600 underline dark:text-teal-400">
            Word Bank
          </Link>
          {bank.length === 0 ? " (defaults until you add your own)" : ""}.
        </p>

        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GAME_CATALOG.map((g) => (
            <button
              key={g.id}
              onClick={() => startGame(g.id)}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-teal-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white", g.color)}>
                <g.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{g.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{g.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* AI game ideas */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="flex w-full items-center gap-2 font-semibold"
          >
            <Sparkles className="h-5 w-5 text-teal-600" />
            AI: invent a new word game
            <span className="ml-auto text-sm font-normal text-slate-400">{aiOpen ? "Hide" : "Open"}</span>
          </button>
          {aiOpen && (
            <div className="mt-4 space-y-3">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. a memory matching game with our spelling list, or a scavenger hunt"
                className="w-full rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
                rows={2}
              />
              <button
                onClick={generateAiGame}
                disabled={aiLoading}
                className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate game idea
              </button>
              {aiResult && (
                <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-800">{aiResult}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
