"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Printer, Sparkles, Loader2 } from "lucide-react";
import type { HighFrequencyWord, Grade } from "@/types";

type Kind = "worksheet" | "crossword" | "puzzle" | "custom";

export default function PrintablesPage() {
  const { user } = useAuth();
  const grade = (user?.grade || 3) as Grade;
  const [words, setWords] = useState<HighFrequencyWord[]>([]);
  const [kind, setKind] = useState<Kind>("worksheet");
  const [customPrompt, setCustomPrompt] = useState("");
  const [useHf, setUseHf] = useState(true);
  const [useSpelling, setUseSpelling] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem("kidlearn_words");
      if (s) setWords(JSON.parse(s));
    } catch {}
  }, []);

  const wordList = words
    .filter((w) => {
      if (w.kind === "spelling" && useSpelling) return true;
      if ((w.kind === "hf" || !w.kind) && useHf) return true;
      return false;
    })
    .map((w) => w.word)
    .slice(0, 20);

  const generate = async () => {
    setLoading(true);
    setError("");
    setResult("");
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("openai_key") : null;

    const wordHint =
      wordList.length > 0
        ? `Use these words (high-frequency and/or spelling list): ${wordList.join(", ")}.`
        : "Use common grade-level high-frequency and spelling words.";

    let prompt = "";
    if (kind === "worksheet") {
      prompt = `Create a printable Grade ${grade} reading worksheet. ${wordHint}
Include: fill-in-the-blank sentences, a short word list to practice writing, and 3 comprehension-style items.
Plain text, ready to print. Title at top.`;
    } else if (kind === "crossword") {
      prompt = `Create a simple crossword-style puzzle for Grade ${grade} (text form is fine). ${wordHint}
List clues across/down and a blank grid description or answer key separately.
Plain text, printable.`;
    } else if (kind === "puzzle") {
      prompt = `Create a fun word puzzle pack for Grade ${grade}: word scramble, word search list (words to find), and matching. ${wordHint}
Plain text, printable.`;
    } else {
      prompt = `Create a printable learning sheet for Grade ${grade}. ${wordHint}
Request: ${customPrompt || "reading and spelling practice"}
Plain text, clear sections, ready to print.`;
    }

    if (!apiKey) {
      setTimeout(() => {
        setResult(`KidLearn Printable — Grade ${grade}
================================
Words to practice: ${wordList.length ? wordList.join(", ") : "the, said, could, would, there, their"}

1) Write each word twice:
${(wordList.length ? wordList : ["said", "could", "would"]).map((w) => `   ${w}: __________  __________`).join("\n")}

2) Fill in the blank:
   I _____ go to the park. (could / cold)
   They put _____ books away. (there / their)

3) Unscramble: dasi → ______

(Add your OpenAI key in Settings for unique AI printables.)`);
        setLoading(false);
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
            {
              role: "system",
              content: "You create clear, printable K-12 reading/spelling materials. Use plain text only. No markdown tables that break when printed.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 1200,
          temperature: 0.7,
        }),
      });
      if (!res.ok) throw new Error("API error — check your key in Settings");
      const data = await res.json();
      setResult(data.choices?.[0]?.message?.content || "No content");
    } catch (e: any) {
      setError(e.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/dashboard" className="text-sm font-medium text-teal-600 hover:underline print:hidden">
          ← Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 print:hidden">Printable Materials</h1>
        <p className="mb-6 text-slate-500 print:hidden">
          Worksheets, puzzles & crosswords from your high-frequency and spelling words — or ask AI to make a custom sheet.
        </p>

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-5 print:hidden">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <p className="text-sm font-medium text-slate-700">Type</p>
            <div className="flex flex-wrap gap-2">
              {([
                ["worksheet", "Worksheet"],
                ["crossword", "Crossword"],
                ["puzzle", "Puzzles"],
                ["custom", "Custom AI"],
              ] as const).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${kind === k ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useHf} onChange={(e) => setUseHf(e.target.checked)} />
              Use high-frequency words ({words.filter((w) => w.kind !== "spelling").length})
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useSpelling} onChange={(e) => setUseSpelling(e.target.checked)} />
              Use spelling words ({words.filter((w) => w.kind === "spelling").length})
            </label>
            {kind === "custom" && (
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe the printable you want..."
                className="w-full rounded-lg border border-slate-200 p-3 text-sm"
                rows={3}
              />
            )}
            <button
              onClick={generate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              Generate
            </button>
            <p className="text-xs text-slate-400">
              Add words in <Link href="/words" className="text-teal-600 underline">Word Bank</Link>. AI key optional (demo without it).
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-3">
            {error && <p className="text-sm text-red-500">{error}</p>}
            {!result && !loading && (
              <p className="py-12 text-center text-slate-400">Generate a printable to preview here</p>
            )}
            {loading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              </div>
            )}
            {result && (
              <>
                <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap text-sm text-slate-700">{result}</pre>
                <button
                  onClick={() => window.print()}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium hover:bg-slate-50"
                >
                  <Printer className="h-4 w-4" /> Print / Save as PDF
                </button>
              </>
            )}
          </div>
        </div>

        {result && (
          <div className="hidden print:block">
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
