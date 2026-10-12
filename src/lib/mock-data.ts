import type { Grade, User, Progress, HighFrequencyWord, DailyQuest } from "@/types";

export const currentChild: User = {
  id: "child-1",
  name: "Emma",
  role: "child",
  grade: 3,
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  coins: 1250,
  streak: 7,
  parentId: "parent-1",
};

export const parentUser: User = {
  id: "parent-1",
  name: "Alex Johnson",
  role: "parent",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
};

export const children: User[] = [
  currentChild,
  {
    id: "child-2",
    name: "Liam",
    role: "child",
    grade: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    coins: 980,
    streak: 4,
    parentId: "parent-1",
  },
];

export const progressData: Progress[] = [
  { userId: "child-1", subject: "math", completedLessons: 12, totalLessons: 20, mastery: 78, lastActivity: "2026-10-10", timeSpentMinutes: 145 },
  { userId: "child-1", subject: "reading", completedLessons: 15, totalLessons: 18, mastery: 88, lastActivity: "2026-10-11", timeSpentMinutes: 120 },
  { userId: "child-1", subject: "grammar", completedLessons: 8, totalLessons: 15, mastery: 61, lastActivity: "2026-10-09", timeSpentMinutes: 90 },
  { userId: "child-1", subject: "english", completedLessons: 10, totalLessons: 16, mastery: 70, lastActivity: "2026-10-10", timeSpentMinutes: 105 },
];

export const highFrequencyWords: HighFrequencyWord[] = [
  { id: "1", word: "said", grade: 3, mastered: true },
  { id: "2", word: "what", grade: 3, mastered: true },
  { id: "3", word: "where", grade: 3, mastered: false },
  { id: "4", word: "could", grade: 3, mastered: false },
  { id: "5", word: "would", grade: 3, mastered: true },
  { id: "6", word: "should", grade: 3, mastered: false },
  { id: "7", word: "there", grade: 3, mastered: true },
  { id: "8", word: "their", grade: 3, mastered: false },
  { id: "9", word: "here", grade: 3, mastered: true },
  { id: "10", word: "about", grade: 3, mastered: false },
];

export const dailyQuest: DailyQuest = {
  id: "dq-1",
  title: "Complete 2 lessons to earn 20 coins!",
  description: "Finish any two lessons today",
  progress: 1,
  target: 2,
  reward: 20,
  completed: false,
};

// Grade-level sample content
export const gradeContent: Record<Grade, { math: string[]; reading: string[]; grammar: string[]; english: string[] }> = {
  2: {
    math: ["Addition & Subtraction to 100", "Place Value", "Simple Word Problems", "Shapes & Measurement"],
    reading: ["Short Stories", "Sight Words", "Comprehension Questions", "Reading Aloud"],
    grammar: ["Nouns & Verbs", "Capitalization", "Simple Sentences", "Punctuation"],
    english: ["Describing Words", "Story Sequencing", "Letter Writing", "Vocabulary"],
  },
  3: {
    math: ["Multiplication Basics", "Division Intro", "Fractions Intro", "Time & Money"],
    reading: ["Chapter Books", "Main Idea", "Context Clues", "Fluency Practice"],
    grammar: ["Adjectives & Adverbs", "Subject-Verb Agreement", "Compound Sentences", "Apostrophes"],
    english: ["Paragraph Writing", "Opinion Writing", "Synonyms & Antonyms", "Poetry"],
  },
  4: {
    math: ["Multi-digit Multiplication", "Long Division", "Fractions & Decimals", "Geometry Basics"],
    reading: ["Nonfiction Texts", "Inferencing", "Summarizing", "Character Analysis"],
    grammar: ["Prepositions", "Conjunctions", "Complex Sentences", "Dialogue"],
    english: ["Essay Structure", "Research Skills", "Figurative Language", "Persuasive Writing"],
  },
  5: {
    math: ["Fractions Operations", "Decimals", "Volume", "Coordinate Planes"],
    reading: ["Theme & Message", "Text Structure", "Compare & Contrast", "Critical Thinking"],
    grammar: ["Perfect Tenses", "Active/Passive Voice", "Clauses", "Punctuation Mastery"],
    english: ["Narrative Essays", "Argumentative Writing", "Vocabulary in Context", "Literary Devices"],
  },
  6: {
    math: ["Ratios & Proportions", "Expressions & Equations", "Statistics", "Negative Numbers"],
    reading: ["Literary Analysis", "Author's Purpose", "Evidence-Based Answers", "Complex Texts"],
    grammar: ["Pronoun Cases", "Verbals", "Sentence Variety", "Style & Tone"],
    english: ["Research Papers", "Creative Writing", "Debate Skills", "Media Literacy"],
  },
  7: {
    math: ["Proportional Relationships", "Linear Equations", "Probability", "Geometry"],
    reading: ["Theme Development", "Point of View", "Argument Analysis", "Poetry Analysis"],
    grammar: ["Phrases & Clauses", "Misplaced Modifiers", "Parallel Structure", "Advanced Punctuation"],
    english: ["Argumentative Essays", "Literary Response", "Speech Writing", "Critical Essays"],
  },
  8: {
    math: ["Functions", "Systems of Equations", "Transformations", "Data Analysis"],
    reading: ["Complex Characters", "Irony & Satire", "Rhetoric", "Primary Sources"],
    grammar: ["Advanced Sentence Structures", "Style Analysis", "Editing Mastery", "Voice"],
    english: ["Research Synthesis", "Creative Nonfiction", "Persuasive Speeches", "Literary Criticism"],
  },
  9: {
    math: ["Algebra I Foundations", "Quadratic Functions", "Exponential Growth", "Modeling"],
    reading: ["Classic Literature", "Rhetorical Analysis", "Critical Lenses", "Annotation Skills"],
    grammar: ["Advanced Grammar Review", "Style Manuals", "Academic Writing Conventions", "Editing"],
    english: ["Literary Analysis Essays", "Research Papers", "Creative Writing Workshops", "Presentations"],
  },
  10: {
    math: ["Geometry Proofs", "Trigonometry Intro", "Advanced Functions", "Statistics"],
    reading: ["World Literature", "Critical Theory Intro", "Synthesis of Sources", "Close Reading"],
    grammar: ["Mastery of Conventions", "Stylistic Choices", "Editing for Clarity", "Professional Writing"],
    english: ["Extended Essays", "College Prep Writing", "Debate & Rhetoric", "Portfolio Development"],
  },
};
