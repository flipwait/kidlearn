"use client";

import { useState, useRef } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import {
  Camera,
  Upload,
  FileText,
  Sparkles,
  BookOpen,
  Star,
  CheckCircle2,
  Loader2,
  ClipboardList,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScannerPage() {
  const { resolvedTheme } = useTheme();
  const isKid = resolvedTheme === "kid";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "processing" | "results">("upload");
  const [generatedWorksheet, setGeneratedWorksheet] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStep("processing");
    setIsProcessing(true);
    setGeneratedWorksheet(null);

    // Simulate OCR (in production use Tesseract.js or OpenAI Vision)
    setTimeout(() => {
      setExtractedText(
        `Reading Comprehension
Name: _____________ Date: _____________

Directions: Read the passage and answer the questions.

The Rainforest
Rainforests are dense, warm, and wet forests found near the equator. They are home to millions of plants and animals. The tall trees form a canopy that blocks much of the sunlight. Rainforests help make the air we breathe and provide food and medicine. We must protect them!

Questions:
1. Where are rainforests found?
2. Why are rainforests important?
3. What is a canopy?`
      );
      setIsProcessing(false);
      setStep("results");
    }, 2200);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const generateWorksheet = async (type: "practice" | "words" | "passage") => {
    setIsGenerating(true);
    const apiKey = localStorage.getItem("openai_key");

    if (!apiKey || !extractedText) {
      // Fallback local generation
      setTimeout(() => {
        if (type === "practice") {
          setGeneratedWorksheet(
            `📝 Practice Worksheet (Auto-generated)

Based on the scanned content:

1. Multiple Choice
What blocks sunlight in the rainforest?
a) Clouds  b) Canopy  c) Rivers  d) Animals

2. Short Answer
Why should we protect rainforests?

3. Vocabulary
Write a sentence using the word "canopy".

4. True or False
Rainforests are found near the poles. _____`
          );
        } else if (type === "words") {
          setGeneratedWorksheet(
            `⭐ High-Frequency / Key Words from the page:

• rainforest
• canopy
• equator
• protect
• dense
• sunlight
• medicine
• animals

Practice writing each word 3 times and use two of them in a sentence.`
          );
        } else {
          setGeneratedWorksheet(
            `📖 Leveled Reading Passage

The Amazing Rainforest

Deep in the warm, wet forests near the equator live millions of plants and animals. Tall trees stretch high into the sky and create a green roof called a canopy. Very little sunlight reaches the ground. These special places give us clean air, food, and even medicine. Scientists work hard to protect rainforests so future generations can enjoy them too.

Comprehension Questions:
1. Where do rainforests grow?
2. What is a canopy?
3. Name two things rainforests provide.`
          );
        }
        setIsGenerating(false);
      }, 1500);
      return;
    }

    // Real AI generation if key present
    try {
      const prompts = {
        practice: `Create a short practice worksheet (multiple choice + short answer) based on this school page content:\n\n${extractedText}`,
        words: `Extract 8-10 important or high-frequency words from this text and format them as a practice list for a student:\n\n${extractedText}`,
        passage: `Rewrite this content as a clean, leveled reading passage with 3 comprehension questions suitable for elementary students:\n\n${extractedText}`,
      };

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful elementary education assistant. Keep responses clear and age-appropriate." },
            { role: "user", content: prompts[type] },
          ],
          max_tokens: 500,
        }),
      });
      const data = await res.json();
      setGeneratedWorksheet(data.choices?.[0]?.message?.content || "Could not generate.");
    } catch {
      setGeneratedWorksheet("Error generating. Check your API key in Settings.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
          ← Dashboard
        </Link>

        <h1 className={cn("mt-4 text-3xl font-bold", isKid ? "text-blue-900" : "text-slate-900")}>
          Document Scanner
        </h1>
        <p className={cn("mb-8", isKid ? "text-blue-600" : "text-slate-500")}>
          Upload or photograph a school page → turn it into practice worksheets, word lists, or reading passages
        </p>

        {step === "upload" && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className={cn(
              "flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center transition",
              isKid ? "border-blue-200 bg-white hover:border-blue-400" : "border-slate-300 bg-white hover:border-teal-400"
            )}
          >
            <div className={cn("mb-4 flex h-16 w-16 items-center justify-center rounded-2xl", isKid ? "bg-blue-100" : "bg-teal-100")}>
              <Camera className={cn("h-8 w-8", isKid ? "text-blue-600" : "text-teal-600")} />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-800">Take Photo or Upload School Page</h2>
            <p className="mb-6 max-w-md text-sm text-slate-500">
              Scan worksheets, notes, reading passages, or vocabulary lists. Your documents stay private.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white",
                  isKid ? "bg-blue-500 hover:bg-blue-600" : "bg-teal-600 hover:bg-teal-700"
                )}
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-16 shadow-sm">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-500" />
            <p className="text-lg font-medium text-slate-700">Scanning & extracting text...</p>
            <p className="text-sm text-slate-500">This usually takes a few seconds</p>
          </div>
        )}

        {step === "results" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Preview + Extracted */}
            <div className="space-y-4">
              {preview && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img src={preview} alt="Scanned page" className="max-h-64 w-full object-contain" />
                </div>
              )}
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-slate-800">Extracted Text</h3>
                </div>
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  {extractedText}
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="mb-4 font-semibold text-slate-800">What would you like to create?</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => generateWorksheet("practice")}
                    disabled={isGenerating}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <ClipboardList className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-slate-800">Create Practice Worksheet</p>
                      <p className="text-xs text-slate-500">Multiple choice, short answer, and more</p>
                    </div>
                  </button>
                  <button
                    onClick={() => generateWorksheet("words")}
                    disabled={isGenerating}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-purple-300 hover:bg-purple-50"
                  >
                    <Star className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-slate-800">Add High-Frequency Words</p>
                      <p className="text-xs text-slate-500">Extract key vocabulary for practice</p>
                    </div>
                  </button>
                  <button
                    onClick={() => generateWorksheet("passage")}
                    disabled={isGenerating}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-green-300 hover:bg-green-50"
                  >
                    <BookOpen className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-slate-800">Generate Reading Passage</p>
                      <p className="text-xs text-slate-500">Create a leveled reading activity</p>
                    </div>
                  </button>
                </div>
              </div>

              {(isGenerating || generatedWorksheet) && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Generated Content
                  </h3>
                  {isGenerating ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <>
                      <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                        {generatedWorksheet}
                      </pre>
                      <button
                        onClick={() => {
                          const w = window.open("", "_blank");
                          if (w) {
                            w.document.write("<pre style=\"font-family:system-ui;padding:2rem;white-space:pre-wrap;\">" + generatedWorksheet + "</pre>");
                            w.document.close();
                            w.print();
                          }
                        }}
                        className="mt-3 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Print / Download Worksheet
                      </button>
                    </>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  setStep("upload");
                  setPreview(null);
                  setExtractedText(null);
                  setGeneratedWorksheet(null);
                }}
                className="w-full rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Scan another page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
