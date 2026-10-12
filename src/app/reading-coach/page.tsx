"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import {
  Mic,
  MicOff,
  BookOpen,
  Target,
  Clock,
  AlertCircle,
  Sparkles,
  Headphones,
  Star,
  Trophy,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Grade } from "@/types";

const passagesByGrade: Record<number, { title: string; text: string; wordCount: number }> = {
  2: {
    title: "The Friendly Frog",
    text: "Once there was a little green frog named Fred. Fred lived near a big blue pond. Every day he hopped and played with his friends. He loved to jump high and splash in the water. One day Fred helped a lost turtle find its way home. The turtle was very happy. Fred felt proud. Being kind is the best feeling of all!",
    wordCount: 78,
  },
  3: {
    title: "The Ocean's Mystery",
    text: "The ocean is a vast and mysterious world. It covers more than seventy percent of our planet and is home to countless creatures. From tiny plankton to enormous whales, life under the sea is full of wonder. Coral reefs are like underwater cities. They are built by tiny animals called polyps over many years. Reefs teem with colorful fish, plants, and other sea life. They also protect coastlines and help keep our oceans healthy. Exploring the ocean teaches us about balance, teamwork, and respect for nature. Every drop of water is important!",
    wordCount: 186,
  },
  4: {
    title: "The Rainforest Canopy",
    text: "High above the forest floor, the rainforest canopy forms a dense green roof. Sunlight filters through the leaves, creating dancing patterns on the ground below. Monkeys swing from branch to branch while colorful birds call to one another. Scientists believe that more than half of the world's plant and animal species live in rainforests. These amazing ecosystems help produce the oxygen we breathe and regulate the Earth's climate. Protecting rainforests is one of the most important jobs we have.",
    wordCount: 142,
  },
  5: {
    title: "The Power of Curiosity",
    text: "Curiosity has driven some of the greatest discoveries in human history. When scientists ask questions and seek answers, they expand our understanding of the world. Marie Curie wondered about mysterious rays and discovered radioactivity. The Wright brothers were curious about flight and built the first successful airplane. Curiosity is not just for scientists, however. Every time you ask why or how, you are practicing the same skill that leads to invention and progress. Never stop wondering.",
    wordCount: 128,
  },
};

// Fallback for other grades
for (let g = 6; g <= 10; g++) {
  passagesByGrade[g] = passagesByGrade[5];
}

export default function ReadingCoachPage() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const grade = (user?.grade || 3) as Grade;
  const passage = passagesByGrade[grade] || passagesByGrade[3];

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const analyzeReading = (spoken: string) => {
    const originalWords = passage.text
      .toLowerCase()
      .replace(/[.,!?"]/g, "")
      .split(/\s+/)
      .filter(Boolean);
    const spokenWords = spoken
      .toLowerCase()
      .replace(/[.,!?"]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    let correct = 0;
    const foundMistakes: string[] = [];
    const maxLen = Math.max(originalWords.length, spokenWords.length);

    for (let i = 0; i < maxLen; i++) {
      if (originalWords[i] && spokenWords[i] && originalWords[i] === spokenWords[i]) {
        correct++;
      } else if (originalWords[i]) {
        foundMistakes.push(originalWords[i]);
      }
    }

    const acc = Math.round((correct / originalWords.length) * 100);
    const elapsedMin = startTime ? (Date.now() - startTime) / 60000 : 1;
    const calculatedWpm = Math.round(spokenWords.length / Math.max(elapsedMin, 0.3));

    setAccuracy(Math.min(acc, 100));
    setWpm(calculatedWpm);
    setMistakes(foundMistakes.slice(0, 6));
    setSessionProgress(Math.min(100, Math.round((spokenWords.length / originalWords.length) * 100)));
    setHasStarted(true);
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback simulation
      setIsListening(true);
      setStartTime(Date.now());
      setTimeout(() => {
        setIsListening(false);
        setTranscript(passage.text.slice(0, 120) + "...");
        analyzeReading(passage.text.slice(0, 120));
      }, 3500);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setStartTime(Date.now());
      setTranscript("");
      setAccuracy(null);
      setWpm(null);
      setMistakes([]);
    };

    recognition.onresult = (event: any) => {
      let final = "";
      for (let i = 0; i < event.results.length; i++) {
        final += event.results[i][0].transcript + " ";
      }
      setTranscript(final.trim());
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript || recognitionRef.current) {
        // analyze will be called on stop
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    if (transcript) {
      analyzeReading(transcript);
    } else {
      // fallback
      analyzeReading(passage.text.slice(0, 80));
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen",
        isKid
          ? "kid-mode bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50"
          : "bg-slate-50"
      )}
    >
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 md:px-8">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
              ← Dashboard
            </Link>
            <div className="hidden h-6 w-px bg-slate-200 sm:block" />
            <div className="flex items-center gap-2">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", isKid ? "bg-purple-100" : "bg-indigo-100")}>
                <Headphones className={cn("h-5 w-5", isKid ? "text-purple-600" : "text-indigo-600")} />
              </div>
              <div>
                <h1 className={cn("text-xl font-bold", isKid ? "text-blue-900" : "text-slate-900")}>
                  AI Reading Coach
                </h1>
                <p className="text-xs text-slate-500">
                  Grade {grade} · {speechSupported ? "Microphone ready" : "Demo mode"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-sm">
              Level {grade} · Reading Detective
            </div>
            <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-700">
              <Star className="h-4 w-4" />
              120
            </div>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Passage */}
          <div className="lg:col-span-2">
            <div className={cn("rounded-2xl border bg-white p-6 shadow-sm", isKid ? "border-blue-100" : "border-slate-200")}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <BookOpen className="h-4 w-4" />
                  {passage.title}
                </div>
                <span className="text-sm text-slate-500">Word Count: {passage.wordCount}</span>
              </div>

              <p className="mb-8 text-lg leading-relaxed text-slate-700">
                {passage.text.split(" ").map((word, i) => {
                  const clean = word.replace(/[.,!?"]/g, "").toLowerCase();
                  const isMistake = mistakes.includes(clean);
                  return (
                    <span
                      key={i}
                      className={cn(
                        isMistake && "rounded bg-red-100 px-0.5 text-red-700 underline decoration-red-400"
                      )}
                    >
                      {word}{" "}
                    </span>
                  );
                })}
              </p>

              {/* Mic Control */}
              <div className="flex flex-col items-center gap-3 border-t border-slate-100 pt-6">
                <button
                  onClick={handleMicClick}
                  className={cn(
                    "flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-all",
                    isListening
                      ? "animate-pulse bg-red-500 hover:bg-red-600"
                      : isKid
                      ? "bg-gradient-to-br from-purple-500 to-indigo-500 hover:scale-105"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  )}
                >
                  {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </button>
                <p className="text-sm font-medium text-slate-600">
                  {isListening
                    ? "Listening... Speak clearly into your microphone"
                    : hasStarted
                    ? "Tap to try again"
                    : "Tap the microphone and read the passage aloud"}
                </p>
                {transcript && (
                  <p className="max-w-md text-center text-xs text-slate-400">
                    Heard: “{transcript.slice(0, 100)}{transcript.length > 100 ? "…" : ""}”
                  </p>
                )}
                {!speechSupported && (
                  <p className="text-xs text-amber-600">
                    Speech recognition not available in this browser — using demo mode
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Feedback Panel */}
          <div className="space-y-4">
            <div className={cn("rounded-2xl border bg-white p-5 shadow-sm", isKid ? "border-blue-100" : "border-slate-200")}>
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
                <Target className="h-4 w-4 text-indigo-500" />
                Real-time Feedback
              </h3>

              {accuracy !== null ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600">{accuracy}%</p>
                    <p className="text-sm text-slate-500">Accuracy</p>
                    <p className="mt-1 text-xs text-green-600">
                      {accuracy >= 90 ? "Excellent pronunciation!" : accuracy >= 75 ? "Good job!" : "Keep practicing!"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-blue-50 p-3 text-center">
                      <p className="text-xl font-bold text-blue-600">{wpm}</p>
                      <p className="text-xs text-slate-500">Words / Min</p>
                    </div>
                    <div className="rounded-xl bg-red-50 p-3 text-center">
                      <p className="text-xl font-bold text-red-600">{mistakes.length}</p>
                      <p className="text-xs text-slate-500">To Review</p>
                    </div>
                  </div>

                  {mistakes.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-slate-500">Words to practice:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mistakes.map((w) => (
                          <span
                            key={w}
                            className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-slate-400">
                  {isListening ? "Listening to you read..." : "Start reading to see feedback"}
                </div>
              )}
            </div>

            {/* AI Coach Says */}
            <div className={cn("rounded-2xl border bg-white p-5 shadow-sm", isKid ? "border-blue-100" : "border-slate-200")}>
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                <Sparkles className="h-4 w-4 text-purple-500" />
                AI Coach Says
              </h3>
              {hasStarted ? (
                <div className="space-y-3 text-sm">
                  <p className="text-slate-600">
                    {accuracy && accuracy >= 90
                      ? "You're reading with great expression! I can hear your confidence growing."
                      : "Nice effort! Focus on the highlighted words and try reading a little slower."}
                  </p>
                  <div className="rounded-xl bg-amber-50 p-3">
                    <p className="font-medium text-amber-800">Great job!</p>
                    <p className="text-xs text-amber-700">You completed this passage. Keep it up!</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Put on headphones if you can, then read the passage out loud. I’ll check your accuracy, pace, and help with any tricky words.
                </p>
              )}
            </div>

            {/* Session Progress */}
            <div className={cn("rounded-2xl border bg-white p-5 shadow-sm", isKid ? "border-blue-100" : "border-slate-200")}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium text-slate-700">Session Progress</span>
                <span className="text-slate-500">{sessionProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${sessionProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
