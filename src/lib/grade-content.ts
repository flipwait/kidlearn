import type { Grade } from "@/types";

export type Q = { q: string; a: string; opts: string[] };

export type ReadingBook = {
  id: string;
  title: string;
  author: string;
  level: string;
  grades: number[];
  emoji: string;
  text: string;
  questions: Q[];
};

/** 10 short stories covering grades 2–10 */
export const readingLibrary: ReadingBook[] = [
  {
    id: "s1",
    title: "The Friendly Frog",
    author: "TutorMe",
    level: "Grade 2–3",
    grades: [2, 3],
    emoji: "🐸",
    text: `Fred the frog lived by a small pond. He liked to hop and splash. One day he saw a turtle who looked lost.\n\n"I can help you," said Fred. He showed the turtle the path home. The turtle smiled. Fred felt happy because he was kind.`,
    questions: [
      { q: "Who is Fred?", a: "A frog", opts: ["A turtle", "A frog", "A fish", "A bird"] },
      { q: "What did Fred do?", a: "Helped the turtle", opts: ["Hid", "Helped the turtle", "Slept", "Ran away"] },
      { q: "How did Fred feel?", a: "Happy", opts: ["Mad", "Happy", "Lost", "Hungry"] },
    ],
  },
  {
    id: "s2",
    title: "My New Puppy",
    author: "TutorMe",
    level: "Grade 2–3",
    grades: [2, 3],
    emoji: "🐶",
    text: `Sam got a puppy named Dot. Dot liked to run in the yard and chase a red ball. Sam fed Dot and gave her water every day.\n\nAt night Dot slept in a soft bed. Sam learned that pets need care, play, and love.`,
    questions: [
      { q: "What is the puppy's name?", a: "Dot", opts: ["Sam", "Dot", "Ball", "Yard"] },
      { q: "What did Sam learn?", a: "Pets need care, play, and love", opts: ["Pets need no care", "Pets need care, play, and love", "Puppies never sleep", "Balls are food"] },
      { q: "Where did Dot sleep?", a: "In a soft bed", opts: ["In a car", "In a soft bed", "In a tree", "In a box"] },
    ],
  },
  {
    id: "s3",
    title: "The Little Star",
    author: "TutorMe",
    level: "Grade 3–4",
    grades: [3, 4],
    emoji: "⭐",
    text: `Luma was a small star. Other stars shone brightly, but Luma's light was dim. She felt different.\n\nAn owl named Oliver asked what she loved. "I love making children's wishes feel special," she said.\n\nOliver told her that kindness was her light. When Luma helped others, she began to glow warmer than before.`,
    questions: [
      { q: "Why was Luma sad?", a: "Her light was dim", opts: ["She was too bright", "Her light was dim", "She disliked night", "She had no name"] },
      { q: "What did Oliver suggest?", a: "Use kindness as her light", opts: ["Shine louder", "Use kindness as her light", "Hide", "Move away"] },
      { q: "What changed for Luma?", a: "She glowed warmer by helping", opts: ["She left the sky", "She glowed warmer by helping", "She became an owl", "She stopped shining"] },
    ],
  },
  {
    id: "s4",
    title: "Looking at the Moon",
    author: "TutorMe",
    level: "Grade 4–5",
    grades: [4, 5],
    emoji: "🌙",
    text: `The Moon does not make its own light. We see it because sunlight reflects off its surface. As the Moon orbits Earth, the shape we see changes—these are the phases.\n\nAstronauts walked on the Moon and brought back rocks. Studying the Moon helps us understand Earth and space.`,
    questions: [
      { q: "Where does the Moon's light come from?", a: "Reflected sunlight", opts: ["The Moon's fire", "Reflected sunlight", "Ocean waves", "City lights"] },
      { q: "What are Moon phases?", a: "Changing shapes we see as it orbits", opts: ["Random drawings", "Changing shapes we see as it orbits", "Types of rockets", "Star names"] },
      { q: "Why study the Moon?", a: "To understand Earth and space", opts: ["To ignore science", "To understand Earth and space", "To stop night", "To remove stars"] },
    ],
  },
  {
    id: "s5",
    title: "Ocean Helpers",
    author: "TutorMe",
    level: "Grade 4–5",
    grades: [4, 5],
    emoji: "🌊",
    text: `The ocean covers most of our planet. Coral reefs are like underwater cities built by tiny animals called polyps. Colorful fish live there.\n\nReefs protect shorelines and support life. When people keep oceans clean, reefs stay healthy. Scientists still discover new sea creatures every year.`,
    questions: [
      { q: "What builds coral reefs?", a: "Tiny animals called polyps", opts: ["Whales", "Tiny animals called polyps", "Ships", "Rain"] },
      { q: "Why are reefs important?", a: "They protect shores and support life", opts: ["They make water colder only", "They protect shores and support life", "They stop the moon", "They feed only birds"] },
      { q: "How can people help?", a: "Keep oceans clean", opts: ["Ignore trash", "Keep oceans clean", "Drain the ocean", "Remove all fish"] },
    ],
  },
  {
    id: "s6",
    title: "Rainforest Canopy",
    author: "TutorMe",
    level: "Grade 5–6",
    grades: [5, 6],
    emoji: "🌳",
    text: `High above the forest floor, the canopy forms a green roof. Sunlight filters through leaves while monkeys and birds move between branches.\n\nRainforests hold a huge share of Earth's plant and animal species. They help produce oxygen and influence climate. Protecting these forests helps the whole planet.`,
    questions: [
      { q: "What is the canopy?", a: "A dense layer of leaves high above the ground", opts: ["A river", "A dense layer of leaves high above the ground", "A type of insect", "A mountain"] },
      { q: "Why are rainforests important?", a: "They support species, oxygen, and climate", opts: ["They are empty", "They support species, oxygen, and climate", "They only help one town", "They stop wind forever"] },
      { q: "Main idea?", a: "Rainforests are valuable and worth protecting", opts: ["Monkeys are loud", "Rainforests are valuable and worth protecting", "Leaves are green only", "Scientists never visit"] },
    ],
  },
  {
    id: "s7",
    title: "The Power of Questions",
    author: "TutorMe",
    level: "Grade 6–7",
    grades: [6, 7],
    emoji: "🔬",
    text: `Curiosity drives discovery. Scientists ask questions, test ideas, and share what they learn. Marie Curie studied mysterious rays; the Wright brothers explored flight.\n\nAsking why and how is a skill anyone can practice. Students who stay curious build habits that lead to problem-solving and invention.`,
    questions: [
      { q: "What drives discovery?", a: "Curiosity", opts: ["Luck only", "Curiosity", "Silence", "Guessing without thinking"] },
      { q: "One example in the passage?", a: "The Wright brothers and flight", opts: ["Ignoring questions", "The Wright brothers and flight", "Avoiding science", "Closing books"] },
      { q: "What should students keep doing?", a: "Asking questions / staying curious", opts: ["Stopping curiosity", "Asking questions / staying curious", "Never reading", "Avoiding problems"] },
    ],
  },
  {
    id: "s8",
    title: "Building a Bridge",
    author: "TutorMe",
    level: "Grade 7–8",
    grades: [7, 8],
    emoji: "🌉",
    text: `When two sides of a town could only wave across a river, a student named Aya suggested building a bridge together. At first adults doubted the idea.\n\nChildren measured, carried materials, and planned. The finished bridge was not perfect, but it connected communities. Aya learned that teamwork and clear goals can change what seems impossible.`,
    questions: [
      { q: "What problem did the town face?", a: "No bridge across the river", opts: ["Too many bridges", "No bridge across the river", "No children", "No river"] },
      { q: "What was Aya's idea?", a: "Build a bridge together", opts: ["Move the town", "Build a bridge together", "Ignore the river", "Build a wall"] },
      { q: "What lesson does the story suggest?", a: "Teamwork can achieve hard goals", opts: ["Working alone is best", "Teamwork can achieve hard goals", "Ideas never work", "Adults should never listen"] },
    ],
  },
  {
    id: "s9",
    title: "Smart Media Habits",
    author: "TutorMe",
    level: "Grade 8–9",
    grades: [8, 9],
    emoji: "💡",
    text: `Online information spreads quickly. Before sharing, readers can check who wrote it, when it was published, and whether other reliable sources agree.\n\nBeing a careful consumer of media does not mean distrusting everything—it means asking good questions and looking for evidence.`,
    questions: [
      { q: "What should you check before sharing?", a: "Author, date, and other reliable sources", opts: ["Only the likes", "Author, date, and other reliable sources", "Nothing", "Only the font"] },
      { q: "Careful media habits mean:", a: "Asking questions and seeking evidence", opts: ["Believing everything", "Asking questions and seeking evidence", "Sharing instantly", "Ignoring sources"] },
      { q: "Main idea?", a: "Evaluate online information thoughtfully", opts: ["Never read news", "Evaluate online information thoughtfully", "All posts are equal", "Dates do not matter"] },
    ],
  },
  {
    id: "s10",
    title: "Reading Complex Texts",
    author: "TutorMe",
    level: "Grade 9–10",
    grades: [9, 10],
    emoji: "📚",
    text: `Complex texts often use dense vocabulary, long sentences, and layered ideas. Effective readers slow down, annotate, and reread key sections.\n\nConnecting new ideas to prior knowledge and discussing interpretations with others deepens understanding. Challenge is part of growth as a reader.`,
    questions: [
      { q: "What helps with complex texts?", a: "Slow down, annotate, and reread", opts: ["Skim once only", "Slow down, annotate, and reread", "Skip hard paragraphs forever", "Avoid discussion"] },
      { q: "Connecting to prior knowledge helps:", a: "Deepen understanding", opts: ["Erase memory", "Deepen understanding", "Shorten the book", "Remove vocabulary"] },
      { q: "The author's view of challenge is that it is:", a: "Part of growth as a reader", opts: ["Always harmful", "Part of growth as a reader", "Unnecessary", "Only for tests"] },
    ],
  },
];

export function booksForGrade(grade: Grade): ReadingBook[] {
  const exact = readingLibrary.filter((b) => b.grades.includes(grade));
  if (exact.length >= 2) return exact;
  return readingLibrary.filter((b) => b.grades.some((g) => Math.abs(g - grade) <= 1));
}

/** Default word lists when Word Bank is empty */
export function defaultPracticeWords(grade: Grade): string[] {
  if (grade <= 3) return ["the", "said", "and", "you", "was", "for", "are", "they", "have", "from", "what", "were", "when", "your", "said"];
  if (grade <= 5) return ["because", "could", "would", "should", "there", "their", "about", "which", "people", "through", "before", "around", "another", "important", "different"];
  if (grade <= 7) return ["although", "however", "therefore", "necessary", "knowledge", "available", "experience", "community", "environment", "especially", "immediately", "responsible", "significant", "development", "opportunity"];
  return ["analyze", "conclude", "evidence", "perspective", "structure", "evaluate", "interpret", "significant", "consequence", "hypothesis", "rhetoric", "synthesize", "credible", "implication", "criterion"];
}
