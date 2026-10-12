"use client";

import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import {
  Calculator,
  BookOpen,
  PenTool,
  MessageCircle,
  CheckCircle2,
  Play,
  ArrowLeft,
  Star,
  Headphones,
  Sparkles,
  BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gradeContent } from "@/lib/mock-data";
import type { Grade } from "@/types";
import { useState } from "react";

const subjectMeta: Record<string, { name: string; icon: any; color: string; bg: string }> = {
  math: { name: "Math", icon: Calculator, color: "from-blue-400 to-blue-600", bg: "bg-blue-50" },
  reading: { name: "Reading", icon: BookOpen, color: "from-pink-400 to-rose-500", bg: "bg-pink-50" },
  grammar: { name: "Grammar", icon: PenTool, color: "from-green-400 to-emerald-500", bg: "bg-green-50" },
  english: { name: "English", icon: MessageCircle, color: "from-purple-400 to-violet-500", bg: "bg-purple-50" },
};

const practiceQuestions: Record<string, { q: string; a: string; opts: string[] }[]> = {
  math: [
    { q: "What is 6 × 7?", a: "42", opts: ["36", "42", "48", "40"] },
    { q: "What is 15 + 28?", a: "43", opts: ["42", "43", "44", "41"] },
    { q: "What is 56 ÷ 8?", a: "7", opts: ["6", "7", "8", "9"] },
    { q: "What is 9 × 9?", a: "81", opts: ["72", "81", "90", "18"] },
  ],
  reading: [
    { q: "What is the main idea of a story usually found?", a: "In the beginning or repeated throughout", opts: ["Only at the end", "In the beginning or repeated throughout", "In the pictures", "In the title only"] },
    { q: "Context clues help you figure out:", a: "The meaning of unknown words", opts: ["The author's age", "The meaning of unknown words", "How long the book is", "The page numbers"] },
    { q: "A character is:", a: "A person or animal in the story", opts: ["The place the story happens", "A person or animal in the story", "The problem in the story", "The title"] },
  ],
  grammar: [
    { q: "Which word is a noun?", a: "teacher", opts: ["run", "teacher", "quickly", "happy"] },
    { q: "Which sentence is correct?", a: "The dogs are barking.", opts: ["The dogs is barking.", "The dogs are barking.", "The dogs be barking.", "The dogs barking."] },
    { q: "An adjective describes a:", a: "noun", opts: ["verb", "noun", "adverb", "punctuation"] },
    { q: "Which needs an apostrophe?", a: "The dog's bone", opts: ["The dogs bone", "The dog's bone", "The dogs' are running", "dogs run"] },
  ],
  english: [
    { q: "A synonym for 'happy' is:", a: "joyful", opts: ["sad", "joyful", "angry", "tired"] },
    { q: "An antonym for 'hot' is:", a: "cold", opts: ["warm", "cold", "spicy", "bright"] },
    { q: "Which is a complete sentence?", a: "The cat sat on the mat.", opts: ["Sitting on the mat", "The cat sat on the mat.", "The cat", "On the mat"] },
    { q: "Poetry often uses:", a: "rhyme and rhythm", opts: ["only facts", "rhyme and rhythm", "long paragraphs", "no punctuation"] },
  ],
};

// Reading library – books/passages by approximate grade band
type ReadingBook = {
  id: string;
  title: string;
  author: string;
  level: string;
  grades: number[];
  emoji: string;
  text: string;
  questions: { q: string; a: string; opts: string[] }[];
};

const readingLibrary: ReadingBook[] = [
  {
    id: "frog",
    title: "The Friendly Frog",
    author: "KidLearn Stories",
    level: "Beginner",
    grades: [2, 3],
    emoji: "🐸",
    text: `Once there was a little green frog named Fred. Fred lived near a big blue pond. Every day he hopped and played with his friends. He loved to jump high and splash in the water.

One day Fred saw a lost turtle. The turtle looked sad. "I cannot find my way home," said the turtle.

Fred smiled. "I can help you!" He hopped along the path and showed the turtle the way. The turtle was very happy.

"Thank you, Fred!" said the turtle. Fred felt proud. Being kind is the best feeling of all!`,
    questions: [
      { q: "What was the frog's name?", a: "Fred", opts: ["Fred", "Frank", "Toby", "Sam"] },
      { q: "Who did Fred help?", a: "A lost turtle", opts: ["A lost bird", "A lost turtle", "A fish", "A rabbit"] },
      { q: "How did Fred feel at the end?", a: "Proud", opts: ["Sad", "Angry", "Proud", "Tired"] },
    ],
  },
  {
    id: "star",
    title: "The Little Star Who Couldn't Shine",
    author: "KidLearn Stories",
    level: "Beginner+",
    grades: [2, 3, 4],
    emoji: "⭐",
    text: `High above the clouds lived a little star named Luma. All the other stars sparkled brightly every night, but Luma's light was very dim. She felt sad and different.

One evening a friendly owl named Oliver flew up to visit. "Why are you so quiet tonight?" he asked.

"I can't shine like the others," Luma whispered.

Oliver smiled. "Maybe you don't need to shine the same way. What do you love to do?"

Luma thought. "I love watching the children below and making wishes come true."

"Then do that!" said Oliver. "Your kindness is your special light."

From that night on, Luma focused on helping children. And the more she helped, the brighter she began to glow — not the brightest star in the sky, but the warmest.`,
    questions: [
      { q: "What was the star's name?", a: "Luma", opts: ["Luna", "Luma", "Stella", "Nova"] },
      { q: "Who helped Luma feel better?", a: "Oliver the owl", opts: ["A child", "Oliver the owl", "Another star", "The moon"] },
      { q: "What made Luma's light grow brighter?", a: "Helping children", opts: ["Sleeping more", "Helping children", "Moving closer to Earth", "Copying other stars"] },
    ],
  },
  {
    id: "ocean",
    title: "The Ocean's Mystery",
    author: "KidLearn Stories",
    level: "Intermediate",
    grades: [3, 4, 5],
    emoji: "🌊",
    text: `The ocean is a vast and mysterious world. It covers more than seventy percent of our planet and is home to countless creatures. From tiny plankton to enormous whales, life under the sea is full of wonder.

Coral reefs are like underwater cities. They are built by tiny animals called polyps over many years. Reefs teem with colorful fish, plants, and other sea life. They also protect coastlines and help keep our oceans healthy.

Exploring the ocean teaches us about balance, teamwork, and respect for nature. Every drop of water is important! Scientists still discover new species in the deep sea every year. There is so much left to learn about this blue world.`,
    questions: [
      { q: "How much of the planet does the ocean cover?", a: "More than seventy percent", opts: ["About half", "More than seventy percent", "Less than twenty percent", "Exactly ninety percent"] },
      { q: "What builds coral reefs?", a: "Tiny animals called polyps", opts: ["Large fish", "Tiny animals called polyps", "Ocean waves", "Seaweed"] },
      { q: "Why are coral reefs important?", a: "They protect coastlines and keep oceans healthy", opts: ["They make the water colder", "They protect coastlines and keep oceans healthy", "They stop the rain", "They feed only whales"] },
    ],
  },
  {
    id: "rainforest",
    title: "Journey Through the Rainforest",
    author: "KidLearn Stories",
    level: "Intermediate",
    grades: [4, 5, 6],
    emoji: "🌳",
    text: `High above the forest floor, the rainforest canopy forms a dense green roof. Sunlight filters through the leaves, creating dancing patterns on the ground below. Monkeys swing from branch to branch while colorful birds call to one another.

Scientists believe that more than half of the world's plant and animal species live in rainforests. These amazing ecosystems help produce the oxygen we breathe and regulate the Earth's climate.

Deep in the understory, insects buzz and frogs croak. Rivers wind through the trees, carrying water and nutrients. Indigenous communities have lived in balance with these forests for thousands of years.

Protecting rainforests is one of the most important jobs we have. Every tree that remains standing helps the whole planet.`,
    questions: [
      { q: "What is the canopy?", a: "A dense green roof of leaves high above the forest floor", opts: ["A type of bird", "A dense green roof of leaves high above the forest floor", "A river", "A kind of monkey"] },
      { q: "About how many of the world's species live in rainforests?", a: "More than half", opts: ["About one tenth", "More than half", "Almost all", "Very few"] },
      { q: "Why should we protect rainforests?", a: "They produce oxygen and help the climate", opts: ["They produce oxygen and help the climate", "They are empty", "They only help local animals", "They stop the wind"] },
    ],
  },
  {
    id: "curiosity",
    title: "The Power of Curiosity",
    author: "KidLearn Stories",
    level: "Advanced",
    grades: [5, 6, 7, 8],
    emoji: "🔬",
    text: `Curiosity has driven some of the greatest discoveries in human history. When scientists ask questions and seek answers, they expand our understanding of the world.

Marie Curie wondered about mysterious rays and discovered radioactivity. The Wright brothers were curious about flight and built the first successful airplane. Their questions changed the future.

Curiosity is not just for scientists, however. Every time you ask why or how, you are practicing the same skill that leads to invention and progress. Children who stay curious become adults who solve problems.

Never stop wondering. The next great idea might begin with a simple question you ask today.`,
    questions: [
      { q: "What did Marie Curie discover?", a: "Radioactivity", opts: ["Electricity", "Radioactivity", "Gravity", "The airplane"] },
      { q: "What were the Wright brothers curious about?", a: "Flight", opts: ["The ocean", "Flight", "Stars", "Cars"] },
      { q: "According to the passage, what should you never stop doing?", a: "Wondering / asking questions", opts: ["Running", "Wondering / asking questions", "Sleeping", "Watching TV"] },
    ],
  },
  {
    id: "bridge",
    title: "The Bridge of Kindness",
    author: "KidLearn Stories",
    level: "Intermediate+",
    grades: [3, 4, 5, 6],
    emoji: "🌉",
    text: `In a small town divided by a wide river, the children on each side could only wave to one another. There was no bridge, only a long walk around the water.

One summer, a girl named Aya had an idea. "What if we build a bridge together?" she asked. At first the adults laughed. But Aya and her friends began gathering wood, rope, and stones.

Day by day, more children joined. They learned to work as a team. Some measured, some carried, some planned. When the bridge was finally finished, the whole town celebrated.

The bridge was not the strongest or the prettiest, but it connected two sides that had been apart for years. Aya learned that kindness and teamwork can build more than wood and rope — they can build friendship.`,
    questions: [
      { q: "What divided the town?", a: "A wide river", opts: ["A mountain", "A wide river", "A wall", "A forest"] },
      { q: "Who had the idea to build the bridge?", a: "Aya", opts: ["A teacher", "Aya", "The mayor", "A boy named Sam"] },
      { q: "What did Aya learn?", a: "Kindness and teamwork can build friendship", opts: ["Bridges are easy", "Kindness and teamwork can build friendship", "Adults always know best", "Working alone is better"] },
    ],
  },
];

export default function SubjectLessonPage() {
  const params = useParams();
  const subject = (params.subject as string)?.toLowerCase() || "math";
  const { resolvedTheme } = useTheme();
  const { user } = useAuth();
  const isKid = resolvedTheme === "kid";
  const grade = (user?.grade || 3) as Grade;

  const meta = subjectMeta[subject] || subjectMeta.math;
  const topics = gradeContent[grade]?.[subject as keyof typeof gradeContent[Grade]] || [];
  const questions = practiceQuestions[subject] || practiceQuestions.math;

  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeBook, setActiveBook] = useState<ReadingBook | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);
  const [bookMode, setBookMode] = useState<"read" | "quiz">("read");

  const Icon = meta.icon;
  const currentQ = activeBook && bookMode === "quiz"
    ? activeBook.questions[qIndex]
    : questions[qIndex];

  const gradeBooks = readingLibrary.filter((b) => b.grades.includes(grade));

  const startPractice = (topic: string) => {
    setActiveTopic(topic);
    setActiveBook(null);
    setQIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  const openBook = (book: ReadingBook) => {
    setActiveBook(book);
    setActiveTopic(null);
    setBookMode("read");
    setQIndex(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  const answer = (selected: string) => {
    if (feedback || !currentQ) return;
    const ok = selected === currentQ.a;
    setFeedback(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    const total = activeBook ? activeBook.questions.length : questions.length;
    setTimeout(() => {
      setFeedback(null);
      if (qIndex < total - 1) {
        setQIndex((i) => i + 1);
      } else {
        setFinished(true);
      }
    }, 800);
  };

  // Finished quiz
  if (finished) {
    const total = activeBook ? activeBook.questions.length : questions.length;
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="text-2xl font-bold text-slate-800">
            {activeBook ? "Book Complete!" : "Lesson Complete!"}
          </h2>
          <p className="mt-2 text-slate-600">{activeBook?.title || activeTopic}</p>
          <p className="mt-4 text-4xl font-bold text-blue-600">{score} / {total}</p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => {
                if (activeBook) {
                  setBookMode("read");
                  setQIndex(0);
                  setScore(0);
                  setFinished(false);
                } else {
                  startPractice(activeTopic!);
                }
              }}
              className="flex-1 rounded-xl bg-blue-500 py-3 font-semibold text-white"
            >
              {activeBook ? "Read Again" : "Try Again"}
            </button>
            <button
              onClick={() => { setActiveTopic(null); setActiveBook(null); setFinished(false); }}
              className="flex-1 rounded-xl border py-3 font-semibold"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reading a book
  if (activeBook && bookMode === "read") {
    return (
      <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
        <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>
        <div className="mx-auto max-w-2xl px-4 py-8">
          <button onClick={() => setActiveBook(null)} className="mb-4 text-sm font-medium text-blue-600 hover:underline">
            ← Back to library
          </button>
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="mb-6 text-center">
              <div className="mb-3 text-5xl">{activeBook.emoji}</div>
              <h1 className="text-2xl font-bold text-slate-800">{activeBook.title}</h1>
              <p className="text-sm text-slate-500">{activeBook.author} · {activeBook.level}</p>
            </div>
            <div className="prose prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-slate-700">
              {activeBook.text}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => { setBookMode("quiz"); setQIndex(0); setScore(0); }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-500 py-3 font-semibold text-white hover:bg-pink-600"
              >
                <CheckCircle2 className="h-5 w-5" /> Answer Questions
              </button>
              <Link
                href="/reading-coach"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Headphones className="h-5 w-5" /> Practice with AI Coach
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz mode (book or topic)
  if ((activeTopic || (activeBook && bookMode === "quiz")) && currentQ) {
    return (
      <div className={cn("flex min-h-screen items-center justify-center p-6", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-4 flex justify-between text-sm text-slate-500">
            <span>{activeBook?.title || activeTopic}</span>
            <span>
              Question {qIndex + 1} / {activeBook ? activeBook.questions.length : questions.length}
            </span>
          </div>
          <h2 className="mb-8 text-center text-xl font-bold text-slate-800">{currentQ.q}</h2>
          <div className="space-y-3">
            {currentQ.opts.map((opt) => (
              <button
                key={opt}
                onClick={() => answer(opt)}
                disabled={!!feedback}
                className={cn(
                  "w-full rounded-2xl border-2 py-4 text-left px-5 font-medium transition",
                  feedback && opt === currentQ.a
                    ? "border-green-500 bg-green-50 text-green-800"
                    : feedback === "wrong"
                    ? "border-red-100 bg-red-50 text-red-300"
                    : "border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                )}
              >
                {opt}
                {feedback && opt === currentQ.a && <CheckCircle2 className="ml-2 inline h-5 w-5 text-green-600" />}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setActiveTopic(null); setActiveBook(null); }}
            className="mt-6 w-full text-center text-sm text-slate-400 hover:underline"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  // Main subject view
  return (
    <div className={cn("min-h-screen", isKid ? "kid-mode bg-gradient-to-br from-sky-50 to-indigo-50" : "bg-slate-50")}>
      <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/learn" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> All Subjects
        </Link>

        <div className="mt-6 mb-8 flex items-center gap-4">
          <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", meta.color)}>
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h1 className={cn("text-3xl font-bold", isKid ? "text-blue-900" : "text-slate-900")}>
              {meta.name}
            </h1>
            <p className={cn(isKid ? "text-blue-600" : "text-slate-500")}>
              Grade {grade}
            </p>
          </div>
        </div>

        {/* READING LIBRARY – only for reading subject */}
        {subject === "reading" && (
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
              <BookMarked className="h-5 w-5 text-pink-500" />
              Book Library
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              Choose a book to read, then answer questions or practice with the AI Reading Coach.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {gradeBooks.map((book) => (
                <button
                  key={book.id}
                  onClick={() => openBook(book)}
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                    isKid ? "border-pink-100 bg-white" : "border-slate-200 bg-white"
                  )}
                >
                  <div className="text-4xl">{book.emoji}</div>
                  <div>
                    <p className="font-semibold text-slate-800">{book.title}</p>
                    <p className="text-xs text-slate-500">{book.level} · {book.author}</p>
                    <p className="mt-2 text-sm text-pink-600 font-medium">Read now →</p>
                  </div>
                </button>
              ))}
            </div>
            {gradeBooks.length === 0 && (
              <p className="text-sm text-slate-400">No books matched this grade yet.</p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/create"
                className="flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-600"
              >
                <Sparkles className="h-4 w-4" /> Create a new story with AI
              </Link>
              <Link
                href="/reading-coach"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Headphones className="h-4 w-4" /> AI Reading Coach
              </Link>
            </div>
          </section>
        )}

        {/* Topics / Skills */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            {subject === "reading" ? "Reading Skills Practice" : "Topics"}
          </h2>
          <div className="space-y-3">
            {topics.map((topic, i) => (
              <button
                key={topic}
                onClick={() => startPractice(topic)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                  isKid ? "border-blue-100 bg-white" : "border-slate-200 bg-white"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white",
                  subject === "math" ? "bg-blue-500" :
                  subject === "reading" ? "bg-pink-500" :
                  subject === "grammar" ? "bg-green-500" : "bg-purple-500"
                )}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{topic}</p>
                  <p className="text-sm text-slate-500">Practice questions</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600">
                  <Play className="h-3.5 w-3.5" /> Start
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
