"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Send, Loader2, BookOpen, HelpCircle, Volume2 } from "lucide-react";
import type { Grade } from "@/types";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK = [
  { label: "Sound out a word", prompt: "Help me sound out a hard word. I'll type the word next." },
  { label: "Explain this passage", prompt: "I'll paste a short passage. Explain it simply and ask me one question to check understanding." },
  { label: "I'm stuck on a word", prompt: "I'm stuck on a word while reading. Give tips: break into syllables, similar words, and a simple sentence using it." },
  { label: "Practice questions", prompt: "Give me 3 short reading comprehension questions for my grade about a simple animal story." },
];

export default function AiTutorPage() {
  const { user } = useAuth();
  const grade = (user?.grade || 3) as Grade;
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: `Hi${user?.name ? `, ${user.name}` : ""}! I'm your reading tutor for Grade ${grade}.\n\nI can help you:\n• Sound out tricky words\n• Understand passages\n• Practice vocabulary\n• Answer reading questions\n\nWhat do you need help with?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text: string) => {
    try {
      const u = new SpeechSynthesisUtterance(text.slice(0, 400));
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  };

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: t }]);
    setLoading(true);

    const apiKey = typeof window !== "undefined" ? localStorage.getItem("openai_key") : null;

    if (!apiKey) {
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "Demo mode (add your OpenAI key in Settings for full help).\n\nFor hard words: clap the syllables (hap-py), say each part slowly, then blend. Try the word in a short sentence.\n\nPaste a passage or a stuck word and I'll guide you step by step when AI is on.",
          },
        ]);
        setLoading(false);
      }, 600);
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
              content: `You are a warm, patient reading tutor for a Grade ${grade} student. 
Help with: sounding out words (syllables, phonics), understanding passages, vocabulary when stuck, and short practice questions.
Keep answers short, encouraging, and clear. Use simple language. Ask follow-up questions. Never do the entire assignment for them — guide them.`,
            },
            ...messages.filter((x) => x.role !== "assistant" || messages.indexOf(x) > 0).slice(-8).map((x) => ({ role: x.role, content: x.content })),
            { role: "user", content: t },
          ],
          max_tokens: 500,
          temperature: 0.6,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Try again?";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. Check your API key in Settings, then try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-sm text-teal-600 hover:underline">← Dashboard</Link>
            <h1 className="text-xl font-bold text-slate-900">AI Reading Tutor</h1>
          </div>
          <BookOpen className="h-6 w-6 text-teal-600" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q.label}
              onClick={() => send(q.prompt)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-teal-300"
            >
              <HelpCircle className="mr-1 inline h-3 w-3" />
              {q.label}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-800"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                {m.role === "assistant" && (
                  <button
                    onClick={() => speak(m.content)}
                    className="mt-2 flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600"
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Listen
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-slate-100 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a word you're stuck on, or paste a passage..."
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-teal-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-teal-600 px-4 py-3 text-white hover:bg-teal-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
