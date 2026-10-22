export type Grade = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** Learning areas used across the app */
export type Subject =
  | "reading"
  | "reading-games"
  | "printables"
  | "stories"
  | "math"
  | "grammar"
  | "english";

export interface User {
  id: string;
  name: string;
  role: "parent" | "child";
  grade?: Grade;
  avatar?: string;
  coins?: number;
  streak?: number;
  parentId?: string;
  /** Simple PIN for student login (4 digits) */
  pin?: string;
}

export interface Progress {
  userId: string;
  subject: Subject;
  completedLessons: number;
  totalLessons: number;
  mastery: number;
  lastActivity: string;
  timeSpentMinutes: number;
}

export interface HighFrequencyWord {
  id: string;
  word: string;
  grade: Grade;
  mastered: boolean;
  /** spelling list vs high-frequency */
  kind?: "hf" | "spelling";
}

export interface Assignment {
  id: string;
  userId: string;
  title: string;
  type: "reading" | "game" | "printable" | "story" | "practice";
  requiredMinutes: number;
  elapsedSeconds: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
}
