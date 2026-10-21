import type { Grade } from "@/types";

export type Q = { q: string; a: string; opts: string[] };

/** Band helper */
function band(g: number): "early" | "mid" | "upper" | "advanced" {
  if (g <= 3) return "early";
  if (g <= 5) return "mid";
  if (g <= 7) return "upper";
  return "advanced";
}

export function readingPracticeQuestions(grade: Grade): Q[] {
  const b = band(grade);
  if (b === "early")
    return [
      { q: "Who is a character in a story?", a: "A person or animal in the story", opts: ["The title", "A person or animal in the story", "The page number", "The author only"] },
      { q: "Where does the story happen is called the:", a: "setting", opts: ["problem", "setting", "ending", "title"] },
      { q: "The main idea is:", a: "What the story is mostly about", opts: ["One small detail", "What the story is mostly about", "The last word", "The pictures only"] },
      { q: "If you don't know a word, you can:", a: "Use the other words around it", opts: ["Skip the book", "Use the other words around it", "Close your eyes", "Count the letters only"] },
    ];
  if (b === "mid")
    return [
      { q: "Context clues help you figure out:", a: "The meaning of unknown words", opts: ["The author's age", "The meaning of unknown words", "Page numbers", "Font size"] },
      { q: "The theme of a story is:", a: "The big lesson or message", opts: ["The character's name", "The big lesson or message", "The number of pages", "The cover color"] },
      { q: "A summary should include:", a: "The most important events", opts: ["Every single word", "The most important events", "Only the title", "Only pictures"] },
      { q: "First-person point of view uses words like:", a: "I and me", opts: ["He and she only", "I and me", "They only", "It only"] },
    ];
  if (b === "upper")
    return [
      { q: "Author's purpose is often to:", a: "Inform, persuade, or entertain", opts: ["Confuse the reader", "Inform, persuade, or entertain", "Hide the theme", "Only list facts"] },
      { q: "Text evidence is used to:", a: "Support your answer with the text", opts: ["Guess randomly", "Support your answer with the text", "Skip hard parts", "Change the ending"] },
      { q: "Compare and contrast means:", a: "How things are alike and different", opts: ["Only differences", "How things are alike and different", "Only the title", "Listing dates"] },
      { q: "A claim in an argument is:", a: "The main point the writer is making", opts: ["A random fact", "The main point the writer is making", "The glossary", "The page number"] },
    ];
  return [
    { q: "Irony often involves:", a: "A difference between expectation and reality", opts: ["A list of facts", "A difference between expectation and reality", "Only rhymes", "Chapter titles"] },
    { q: "A reliable source for research is usually:", a: "Credible and backed by evidence", opts: ["Anonymous social posts only", "Credible and backed by evidence", "Rumors", "Unrelated ads"] },
    { q: "Tone refers to:", a: "The author's attitude toward the subject", opts: ["Font size", "The author's attitude toward the subject", "Page count", "Cover art only"] },
    { q: "Synthesizing texts means:", a: "Combining ideas from multiple sources", opts: ["Copying one sentence", "Combining ideas from multiple sources", "Ignoring evidence", "Skipping conclusions"] },
  ];
}

export function wordMatchQuestions(grade: Grade): Q[] {
  const b = band(grade);
  if (b === "early")
    return [
      { q: "What does 'happy' mean?", a: "Feeling joy", opts: ["Feeling sad", "Feeling joy", "Feeling angry", "Feeling tired"] },
      { q: "A synonym for 'big' is:", a: "Large", opts: ["Small", "Large", "Tiny", "Short"] },
      { q: "Opposite of 'hot'?", a: "Cold", opts: ["Warm", "Cold", "Fast", "Loud"] },
      { q: "A place to live?", a: "Home", opts: ["Car", "Home", "Book", "Cloud"] },
    ];
  if (b === "mid")
    return [
      { q: "What does 'curious' mean?", a: "Wanting to learn or know more", opts: ["Feeling sleepy", "Wanting to learn or know more", "Being angry", "Being quiet"] },
      { q: "A synonym for 'brave' is:", a: "Courageous", opts: ["Afraid", "Courageous", "Tiny", "Slow"] },
      { q: "Opposite of 'ancient'?", a: "Modern", opts: ["Old", "Modern", "Heavy", "Quiet"] },
      { q: "'Glimpse' most nearly means:", a: "A quick look", opts: ["A long speech", "A quick look", "A loud noise", "A heavy box"] },
    ];
  if (b === "upper")
    return [
      { q: "'Reluctant' means:", a: "Unwilling or hesitant", opts: ["Eager", "Unwilling or hesitant", "Confused", "Excited"] },
      { q: "A synonym for 'scarce' is:", a: "Rare", opts: ["Common", "Rare", "Loud", "Bright"] },
      { q: "'Consequence' is closest to:", a: "Result", opts: ["Beginning", "Result", "Color", "Sound"] },
      { q: "'Elaborate' as a verb means:", a: "Explain in more detail", opts: ["Make shorter", "Explain in more detail", "Hide information", "Stop talking"] },
    ];
  return [
    { q: "'Ambiguous' means:", a: "Open to more than one meaning", opts: ["Very clear", "Open to more than one meaning", "Always true", "Numerical"] },
    { q: "A synonym for 'meticulous' is:", a: "Careful", opts: ["Careless", "Careful", "Quick", "Loud"] },
    { q: "'Inevitable' means:", a: "Certain to happen", opts: ["Unlikely", "Certain to happen", "Optional", "Hidden"] },
    { q: "'Pragmatic' is closest to:", a: "Practical", opts: ["Dreamy", "Practical", "Angry", "Musical"] },
  ];
}

export function vocabQuestions(grade: Grade): Q[] {
  const b = band(grade);
  if (b === "early")
    return [
      { q: "The knight was very ____.", a: "brave", opts: ["brave", "tiny", "sleepy", "broken"] },
      { q: "She felt _____ after winning.", a: "proud", opts: ["sad", "proud", "angry", "lost"] },
      { q: "Synonym for 'quick'?", a: "fast", opts: ["slow", "fast", "heavy", "quiet"] },
      { q: "Opposite of 'empty'?", a: "full", opts: ["full", "open", "closed", "soft"] },
    ];
  if (b === "mid")
    return [
      { q: "The explorers were _____ to find the map.", a: "determined", opts: ["sleepy", "determined", "invisible", "broken"] },
      { q: "A _____ is a group of words with a subject and verb.", a: "sentence", opts: ["letter", "sentence", "drawing", "number"] },
      { q: "'Generous' means someone who:", a: "Shares and gives freely", opts: ["Keeps everything", "Shares and gives freely", "Runs fast", "Whispers"] },
      { q: "Choose the best word: The storm was _____.", a: "fierce", opts: ["fierce", "polite", "tiny", "silent only"] },
    ];
  if (b === "upper")
    return [
      { q: "The evidence was _____ to the case.", a: "crucial", opts: ["irrelevant", "crucial", "decorative", "silent"] },
      { q: "'Perspective' means:", a: "A point of view", opts: ["A type of plant", "A point of view", "A measurement only", "A sound"] },
      { q: "The speech was meant to _____ the audience.", a: "persuade", opts: ["confuse only", "persuade", "ignore", "erase"] },
      { q: "A _____ summarizes the main points briefly.", a: "synopsis", opts: ["dictionary", "synopsis", "calendar", "ruler"] },
    ];
  return [
    { q: "The argument lacked _____ support.", a: "empirical", opts: ["empirical", "decorative", "musical", "accidental"] },
    { q: "'Nuance' refers to:", a: "A subtle difference in meaning", opts: ["A loud noise", "A subtle difference in meaning", "A large number", "A color only"] },
    { q: "A _____ tone is formal and serious.", a: "solemn", opts: ["solemn", "silly", "random", "empty"] },
    { q: "'Ubiquitous' means:", a: "Found everywhere", opts: ["Rare", "Found everywhere", "Invisible", "Ancient only"] },
  ];
}

export function grammarQuestions(grade: Grade): Q[] {
  const b = band(grade);
  if (b === "early")
    return [
      { q: "Which is correct?", a: "The cats are sleeping.", opts: ["The cats is sleeping.", "The cats are sleeping.", "The cats be sleeping.", "The cats sleeping."] },
      { q: "Choose the correct sentence:", a: "She went to the store.", opts: ["She goed to the store.", "She went to the store.", "She goes yesterday.", "She going to the store."] },
      { q: "A noun is a:", a: "person, place, or thing", opts: ["action word", "person, place, or thing", "describing word", "punctuation mark"] },
      { q: "Correct punctuation?", a: "Wow, that was amazing!", opts: ["Wow that was amazing!", "Wow, that was amazing!", "Wow that was amazing", "wow that was amazing."] },
    ];
  if (b === "mid")
    return [
      { q: "Which sentence is correct?", a: "Yesterday she walked to the market.", opts: ["Yesterday she walk to the market.", "Yesterday she walked to the market.", "Yesterday she walking.", "Yesterday she walks yesterday."] },
      { q: "An adjective describes a:", a: "noun", opts: ["verb only", "noun", "period", "number only"] },
      { q: "Which needs an apostrophe?", a: "The dog's bone", opts: ["The dogs bone", "The dog's bone", "dogs run fast", "The dogs are"] },
      { q: "Subject-verb agreement: The team _____ ready.", a: "is", opts: ["are", "is", "be", "were is"] },
    ];
  if (b === "upper")
    return [
      { q: "Identify the independent clause:", a: "She finished the essay", opts: ["because it was late", "She finished the essay", "after the bell", "while studying"] },
      { q: "Which uses parallel structure?", a: "She likes hiking, swimming, and biking.", opts: ["She likes hiking, to swim, and biked.", "She likes hiking, swimming, and biking.", "She likes hike, swimming, and to bike.", "She like hiking and swim."] },
      { q: "A dangling modifier is a problem with:", a: "unclear what a phrase describes", opts: ["spelling only", "unclear what a phrase describes", "font size", "page numbers"] },
      { q: "Which is a complex sentence?", a: "When the rain stopped, we went outside.", opts: ["We went outside.", "When the rain stopped, we went outside.", "Rain. Outside.", "We went outside and played."] },
    ];
  return [
    { q: "Choose correct pronoun case:", a: "The coach spoke to her and me.", opts: ["The coach spoke to she and I.", "The coach spoke to her and me.", "The coach spoke to her and I.", "The coach spoke to she and me."] },
    { q: "Which sentence is active voice?", a: "The committee approved the plan.", opts: ["The plan was approved by the committee.", "The committee approved the plan.", "The plan is being approved.", "Approval of the plan happened."] },
    { q: "A semicolon is best used to:", a: "Join related independent clauses", opts: ["End every sentence", "Join related independent clauses", "Replace all commas", "Start a paragraph"] },
    { q: "Which is correct?", a: "Neither of the answers is correct.", opts: ["Neither of the answers are correct.", "Neither of the answers is correct.", "Neither of the answers be correct.", "Neither of the answers were is correct."] },
  ];
}

/** Reading passages/books matched tightly to grade */
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

export const readingLibrary: ReadingBook[] = [
  {
    id: "g2-frog",
    title: "The Friendly Frog",
    author: "KidLearn",
    level: "Grade 2",
    grades: [2],
    emoji: "🐸",
    text: `Fred the frog lived by a small pond. He liked to hop and splash. One day he saw a turtle who looked lost.\n\n"I can help you," said Fred. He showed the turtle the path home. The turtle smiled. Fred felt happy because he was kind.`,
    questions: [
      { q: "Who is Fred?", a: "A frog", opts: ["A turtle", "A frog", "A fish", "A bird"] },
      { q: "What did Fred do?", a: "Helped the turtle", opts: ["Hid", "Helped the turtle", "Slept", "Ran away"] },
      { q: "How did Fred feel at the end?", a: "Happy", opts: ["Mad", "Happy", "Lost", "Hungry"] },
    ],
  },
  {
    id: "g3-star",
    title: "The Little Star",
    author: "KidLearn",
    level: "Grade 3",
    grades: [3],
    emoji: "⭐",
    text: `Luma was a small star. Other stars shone brightly, but Luma's light was dim. She felt different.\n\nAn owl named Oliver asked what she loved. "I love making children's wishes feel special," she said.\n\nOliver told her that kindness was her light. When Luma helped others, she began to glow warmer than before.`,
    questions: [
      { q: "Why was Luma sad?", a: "Her light was dim", opts: ["She was too bright", "Her light was dim", "She had no friends on Earth", "She disliked night"] },
      { q: "What did Oliver suggest?", a: "Use kindness as her light", opts: ["Shine louder", "Use kindness as her light", "Hide", "Move to the moon"] },
      { q: "What changed for Luma?", a: "She glowed warmer by helping", opts: ["She left the sky", "She glowed warmer by helping", "She became an owl", "She stopped shining"] },
    ],
  },
  {
    id: "g4-ocean",
    title: "Ocean Helpers",
    author: "KidLearn",
    level: "Grade 4",
    grades: [4],
    emoji: "🌊",
    text: `The ocean covers most of our planet. Coral reefs are like underwater cities built by tiny animals called polyps. Fish of many colors live there.\n\nReefs protect shorelines and support life. When people keep oceans clean, reefs stay healthy. Scientists still discover new sea creatures every year.`,
    questions: [
      { q: "What builds coral reefs?", a: "Tiny animals called polyps", opts: ["Whales", "Tiny animals called polyps", "Ships", "Rain only"] },
      { q: "Why are reefs important?", a: "They protect shores and support life", opts: ["They make water colder only", "They protect shores and support life", "They stop the moon", "They feed only birds"] },
      { q: "What is one way people can help?", a: "Keep oceans clean", opts: ["Ignore trash", "Keep oceans clean", "Drain the ocean", "Remove all fish"] },
    ],
  },
  {
    id: "g5-forest",
    title: "Rainforest Canopy",
    author: "KidLearn",
    level: "Grade 5",
    grades: [5],
    emoji: "🌳",
    text: `High above the forest floor, the canopy forms a green roof. Sunlight filters through leaves while monkeys and birds move between branches.\n\nRainforests hold a huge share of Earth's plant and animal species. They help produce oxygen and influence climate. Protecting these forests helps the whole planet.`,
    questions: [
      { q: "What is the canopy?", a: "A dense layer of leaves high above the ground", opts: ["A river", "A dense layer of leaves high above the ground", "A type of insect", "A mountain peak"] },
      { q: "Why are rainforests important?", a: "They support species, oxygen, and climate", opts: ["They are empty", "They support species, oxygen, and climate", "They only help one town", "They stop the wind forever"] },
      { q: "What is a main idea of this passage?", a: "Rainforests are valuable and worth protecting", opts: ["Monkeys are loud", "Rainforests are valuable and worth protecting", "Leaves are green only", "Scientists never visit"] },
    ],
  },
  {
    id: "g6-curiosity",
    title: "The Power of Questions",
    author: "KidLearn",
    level: "Grade 6",
    grades: [6],
    emoji: "🔬",
    text: `Curiosity drives discovery. Scientists ask questions, test ideas, and share what they learn. Marie Curie studied mysterious rays; the Wright brothers explored flight.\n\nAsking why and how is a skill anyone can practice. Students who stay curious build habits that lead to problem-solving and invention.`,
    questions: [
      { q: "What does the passage say drives discovery?", a: "Curiosity", opts: ["Luck only", "Curiosity", "Silence", "Guessing without thinking"] },
      { q: "What is one example given?", a: "The Wright brothers and flight", opts: ["Ignoring questions", "The Wright brothers and flight", "Avoiding science", "Closing books"] },
      { q: "What should students keep doing?", a: "Asking questions / staying curious", opts: ["Stopping curiosity", "Asking questions / staying curious", "Never reading", "Avoiding problems"] },
    ],
  },
  {
    id: "g7-bridge",
    title: "Building Understanding",
    author: "KidLearn",
    level: "Grade 7",
    grades: [7],
    emoji: "🌉",
    text: `When two sides of a town could only wave across a river, a student named Aya suggested building a bridge together. At first adults doubted the idea.\n\nChildren measured, carried materials, and planned. The finished bridge was not perfect, but it connected communities. Aya learned that teamwork and clear goals can change what seems impossible.`,
    questions: [
      { q: "What problem did the town face?", a: "No bridge across the river", opts: ["Too many bridges", "No bridge across the river", "No children", "No river"] },
      { q: "What was Aya's idea?", a: "Build a bridge together", opts: ["Move the town", "Build a bridge together", "Ignore the river", "Build a wall"] },
      { q: "What lesson does the story suggest?", a: "Teamwork can achieve hard goals", opts: ["Working alone is best", "Teamwork can achieve hard goals", "Ideas never work", "Adults should never listen"] },
    ],
  },
  {
    id: "g8-argument",
    title: "Reading Arguments",
    author: "KidLearn",
    level: "Grade 8",
    grades: [8],
    emoji: "📰",
    text: `Strong arguments present a clear claim, support it with evidence, and address other viewpoints. Readers should ask: What is the writer trying to prove? What facts or examples are used?\n\nNot all sources are equal. Reliable evidence is specific, relevant, and comes from trustworthy places. Evaluating arguments is a key reading skill in school and daily life.`,
    questions: [
      { q: "What does a strong argument include?", a: "A claim, evidence, and other viewpoints", opts: ["Only opinions", "A claim, evidence, and other viewpoints", "Only jokes", "No evidence"] },
      { q: "What should readers ask?", a: "What the writer is trying to prove", opts: ["Only the font size", "What the writer is trying to prove", "Nothing", "Who printed the paper only"] },
      { q: "Reliable evidence is:", a: "Specific, relevant, and trustworthy", opts: ["Random and vague", "Specific, relevant, and trustworthy", "Always anonymous", "Unrelated"] },
    ],
  },
  {
    id: "g9-theme",
    title: "Theme in Literature",
    author: "KidLearn",
    level: "Grade 9",
    grades: [9],
    emoji: "📖",
    text: `Theme is the underlying message a work explores—not just the plot summary. Authors develop theme through character choices, conflict, and resolution.\n\nReaders support interpretations with text evidence: quotations, actions, and turning points. Two readers may emphasize different themes if both are grounded in the text.`,
    questions: [
      { q: "Theme is best described as:", a: "An underlying message of the work", opts: ["A list of characters only", "An underlying message of the work", "The page count", "The publication date"] },
      { q: "How do authors develop theme?", a: "Through choices, conflict, and resolution", opts: ["By hiding the text", "Through choices, conflict, and resolution", "By removing conflict", "By using only pictures"] },
      { q: "Interpretations should be supported by:", a: "Text evidence", opts: ["Guesses only", "Text evidence", "Unrelated videos", "The cover alone"] },
    ],
  },
  {
    id: "g10-rhetoric",
    title: "Rhetoric and Purpose",
    author: "KidLearn",
    level: "Grade 10",
    grades: [10],
    emoji: "🎯",
    text: `Rhetorical analysis examines how writers use ethos, pathos, and logos to achieve a purpose with an audience. Word choice, structure, and appeals work together.\n\nIdentifying purpose—to inform, persuade, critique, or inspire—helps readers evaluate effectiveness. Strong analysis explains not only what a text says, but how and why it works.`,
    questions: [
      { q: "Ethos, pathos, and logos are:", a: "Rhetorical appeals", opts: ["Types of punctuation", "Rhetorical appeals", "Genres of fiction only", "Math formulas"] },
      { q: "Purpose might include:", a: "Inform, persuade, critique, or inspire", opts: ["Only confuse", "Inform, persuade, critique, or inspire", "Only list dates", "Hide the audience"] },
      { q: "Strong analysis explains:", a: "What the text says and how/why it works", opts: ["Only the title", "What the text says and how/why it works", "Only word count", "Nothing about audience"] },
    ],
  },
  // Cross-grade extras so filters always have options near a grade
  {
    id: "g2-3-pets",
    title: "My New Puppy",
    author: "KidLearn",
    level: "Grades 2–3",
    grades: [2, 3],
    emoji: "🐶",
    text: `Sam got a puppy named Dot. Dot liked to run in the yard and chase a red ball. Sam fed Dot and gave her water every day.\n\nAt night Dot slept in a soft bed. Sam learned that pets need care, play, and love.`,
    questions: [
      { q: "What is the puppy's name?", a: "Dot", opts: ["Sam", "Dot", "Ball", "Yard"] },
      { q: "What did Sam learn?", a: "Pets need care, play, and love", opts: ["Pets need no care", "Pets need care, play, and love", "Puppies never sleep", "Balls are food"] },
      { q: "Where did Dot sleep?", a: "In a soft bed", opts: ["In a car", "In a soft bed", "In a tree", "In a box of books"] },
    ],
  },
  {
    id: "g4-5-space",
    title: "Looking at the Moon",
    author: "KidLearn",
    level: "Grades 4–5",
    grades: [4, 5],
    emoji: "🌙",
    text: `The Moon does not make its own light. We see it because sunlight reflects off its surface. As the Moon orbits Earth, the shape we see changes—these are the phases.\n\nAstronauts walked on the Moon and brought back rocks. Studying the Moon helps us understand Earth and space.`,
    questions: [
      { q: "Where does the Moon's light come from?", a: "Reflected sunlight", opts: ["The Moon's fire", "Reflected sunlight", "Ocean waves", "City lights only"] },
      { q: "What are Moon phases?", a: "Changing shapes we see as it orbits", opts: ["Random drawings", "Changing shapes we see as it orbits", "Types of rockets", "Star names"] },
      { q: "Why study the Moon?", a: "To understand Earth and space", opts: ["To ignore science", "To understand Earth and space", "To stop night", "To remove stars"] },
    ],
  },
  {
    id: "g6-8-media",
    title: "Smart Media Habits",
    author: "KidLearn",
    level: "Grades 6–8",
    grades: [6, 7, 8],
    emoji: "💡",
    text: `Online information spreads quickly. Before sharing, readers can check who wrote it, when it was published, and whether other reliable sources agree.\n\nBeing a careful consumer of media does not mean distrusting everything—it means asking good questions and looking for evidence.`,
    questions: [
      { q: "What should you check before sharing?", a: "Author, date, and other reliable sources", opts: ["Only the likes", "Author, date, and other reliable sources", "Nothing", "Only the font"] },
      { q: "Careful media habits mean:", a: "Asking questions and seeking evidence", opts: ["Believing everything", "Asking questions and seeking evidence", "Sharing instantly", "Ignoring sources"] },
      { q: "Main idea?", a: "Evaluate online information thoughtfully", opts: ["Never read news", "Evaluate online information thoughtfully", "All posts are equal", "Dates do not matter"] },
    ],
  },
  {
    id: "g9-10-college",
    title: "Reading Complex Texts",
    author: "KidLearn",
    level: "Grades 9–10",
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
  // fallback: nearest grades
  return readingLibrary.filter((b) => b.grades.some((g) => Math.abs(g - grade) <= 1));
}
