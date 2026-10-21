"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Sparkles, Loader2, Copy, Check, Headphones } from "lucide-react";
import type { Grade, HighFrequencyWord } from "@/types";

type Mode = "passage" | "story";
type Length = "short" | "medium" | "long";

export default function CreatePage() {
  const { user } = useAuth();
  const grade = (user?.grade || 3) as Grade;
  const [mode, setMode] = useState<Mode>("story");
  const [topic, setTopic] = useState("");
  const [character, setCharacter] = useState("");
  const [setting, setSetting] = useState("");
  const [problem, setProblem] = useState("");
  const [length, setLength] = useState<Length>("short");
  const [includeHf, setIncludeHf] = useState(true);
  const [includeSpelling, setIncludeSpelling] = useState(true);
  const [words, setWords] = useState<HighFrequencyWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem("kidlearn_words");
      if (s) setWords(JSON.parse(s));
    } catch {}
  }, []);

  const selectedWords = words
    .filter((w) => {
      if (w.kind === "spelling" && includeSpelling) return true;
      if ((w.kind === "hf" || !w.kind) && includeHf) return true;
      return false;
    })
    .map((w) => w.word)
    .slice(0, 15);

  const lengthGuide = {
    short: "80–150 words",
    medium: "180–280 words",
    long: "350–500 words",
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    setResult("");
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("openai_key") : null;
    const wordLine =
      selectedWords.length > 0
        ? `Naturally weave in these practice words: ${selectedWords.join(", ")}.`
        : "Use age-appropriate high-frequency vocabulary.";

    const prompt =
      mode === "passage"
        ? `Write an engaging reading passage for Grade ${grade}. Topic: ${topic || "friendship and adventure"}. Length: ${lengthGuide[length]}. ${wordLine} Fun tone. End with 3 comprehension questions.`
        : `Write a fun short story for Grade ${grade}.
Character: ${character || "a curious kid"}
Setting: ${setting || "a magical library"}
Problem: ${problem || "something important is missing"}
Length: ${lengthGuide[length]}. ${wordLine}
Title + complete story with a happy ending. End with 3 comprehension questions.`;

    if (!apiKey) {
      setTimeout(() => {
        setResult(`The Library Adventure

${character || "Mia"} stepped into ${setting || "the quiet library"} and noticed something strange. A book glowed on the shelf. Inside was a map — and a missing piece.

"${selectedWords[0] || "Could"} this be real?" she whispered.

She ${selectedWords[1] || "said"} the magic words carefully. The map shimmered. Friends helped her follow the clues until the missing piece was found.

Together they put the story back together — and the library felt whole again.

Questions:
1. What did the hero find?
2. Who helped?
3. How did the story end?`);
        setLoading(false);
        try { localStorage.setItem("kidlearn_created_story", "1"); } catch {}
      }, 1000);
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
              content: `You write fun, grade-appropriate stories for children in Grade ${grade}. Keep language clear. Include practice words naturally when asked.`,
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 900,
          temperature: 0.85,
        }),
      });
      if (!res.ok) throw new Error("API error — check key in Settings");
      const data = await res.json();
      setResult(data.choices?.[0]?.message?.content || "");
      try { localStorage.setItem("kidlearn_created_story", "1"); } catch {}
    } catch (e: any) {
      setError(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/dashboard" className="text-sm font-medium text-teal-600 hover:underline">← Dashboard</Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Story Creator</h1>
        <p className="mb-6 text-slate-500">
          Fun AI stories & passages — short, medium, or long — using your high-frequency and spelling words.
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <div className="flex gap-2">
              {(["story", "passage"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize ${mode === m ? "bg-teal-600 text-white" : "bg-slate-100"}`}
                >
                  {m}
                </button>
              ))}
            </div>

            {mode === "story" ? (
              <>
                <input value={character} onChange={(e) => setCharacter(e.target.value)} placeholder="Character" className="w-full rounded-lg border px-3 py-2 text-sm" />
                <input value={setting} onChange={(e) => setSetting(e.target.value)} placeholder="Setting" className="w-full rounded-lg border px-3 py-2 text-sm" />
                <input value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Problem / adventure" className="w-full rounded-lg border px-3 py-2 text-sm" />
              </>
            ) : (
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" className="w-full rounded-lg border px-3 py-2 text-sm" />
            )}

            <div>
              <p className="mb-1 text-sm font-medium text-slate-600">Length</p>
              <div className="flex gap-2">
                {(["short", "medium", "long"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={`flex-1 rounded-lg py-2 text-sm capitalize ${length === l ? "bg-teal-600 text-white" : "bg-slate-100"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-400">{lengthGuide[length]}</p>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={includeHf} onChange={(e) => setIncludeHf(e.target.checked)} />
              High-frequency words
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={includeSpelling} onChange={(e) => setIncludeSpelling(e.target.checked)} />
              Spelling words
            </label>
            {selectedWords.length > 0 && (
              <p className="text-xs text-slate-500">Using: {selectedWords.slice(0, 8).join(", ")}{selectedWords.length > 8 ? "…" : ""}</p>
            )}

            <button
              onClick={generate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              Create with AI
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-3">
            <div className="mb-3 flex justify-between">
              <h3 className="font-semibold text-slate-800">Your story</h3>
              {result && (
                <div className="flex gap-2">
                  <button
                    onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                    className="flex items-center gap-1 text-xs text-slate-600"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy
                  </button>
                  <Link href="/reading-coach" className="flex items-center gap-1 text-xs text-teal-600">
                    <Headphones className="h-3.5 w-3.5" /> Practice reading
                  </Link>
                </div>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {loading && <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>}
            {!loading && !result && <p className="py-16 text-center text-slate-400">Generate a fun story to read</p>}
            {result && <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{result}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
