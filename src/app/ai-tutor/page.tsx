"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Send, Bot, User, Loader2, Sparkles, Volume2 } from "lucide-react";
import { gradeContent } from "@/lib/mock-data";
import type { Grade } from "@/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AITutorPage() {
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const grade = (user?.grade || 3) as Grade;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi${user?.name ? ` ${user.name}` : ""}! I'm your AI Tutor. I can help with Math, Reading, Grammar, and English for Grade ${grade}. What would you like to work on today? You can also ask me to sound out words or explain something!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setError("");

    const apiKey = typeof window !== "undefined" ? localStorage.getItem("openai_key") : null;

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Please add your OpenAI API key in Settings first so I can help you! Go to Settings → paste your key → Save.",
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const systemPrompt = `You are a friendly, encouraging AI Tutor for a Grade ${grade} student named ${user?.name || "Student"}. 
Subjects available: Math, Reading, Grammar, English.
Current grade topics include: ${JSON.stringify(gradeContent[grade] || {})}.
Help with explaining concepts, sounding out words (break them into syllables phonetically), practice problems, reading comprehension, grammar rules, and vocabulary.
Keep responses age-appropriate, positive, and concise (under 150 words when possible). Use simple language for younger grades.
If the student asks to sound out a word, respond with clear phonetic breakdown like: "The word 'beautiful' is /BYOO-ti-ful/."`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: userMessage },
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Oops! ${err.message || "Something went wrong"}. Check your API key in Settings or try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Help me with multiplication",
    "Sound out the word 'beautiful'",
    "Explain what a noun is",
    "Give me a short reading passage",
  ];

  return (
    <div className={isKid ? "kid-mode flex min-h-screen flex-col bg-gradient-to-br from-sky-50 to-indigo-50" : "flex min-h-screen flex-col bg-slate-50"}>
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      {/* Header */}
      <header className={`border-b px-4 py-3 ${isKid ? "border-blue-100 bg-white/80" : "border-slate-200 bg-white"}`}>
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
              ← Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <div className={`rounded-xl p-2 ${isKid ? "bg-purple-100" : "bg-teal-100"}`}>
                <Sparkles className={`h-5 w-5 ${isKid ? "text-purple-600" : "text-teal-600"}`} />
              </div>
              <div>
                <h1 className="font-semibold text-slate-800">AI Tutor</h1>
                <p className="text-xs text-slate-500">Grade {grade} · Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isKid ? "bg-purple-100" : "bg-teal-100"}`}>
                  <Bot className={`h-4 w-4 ${isKid ? "text-purple-600" : "text-teal-600"}`} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? isKid
                      ? "bg-blue-500 text-white"
                      : "bg-teal-600 text-white"
                    : "bg-white shadow-sm border border-slate-100 text-slate-800"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isKid ? "bg-purple-100" : "bg-teal-100"}`}>
                <Bot className={`h-4 w-4 ${isKid ? "text-purple-600" : "text-teal-600"}`} />
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-slate-100">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick prompts */}
      {messages.length < 3 && (
        <div className="px-4 pb-2">
          <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => setInput(p)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-blue-300 hover:bg-blue-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className={`border-t px-4 py-4 ${isKid ? "border-blue-100 bg-white/80" : "border-slate-200 bg-white"}`}>
        <div className="mx-auto flex max-w-3xl gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask me anything... or type a word to sound out"
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white transition disabled:opacity-50 ${
              isKid
                ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        {error && <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
