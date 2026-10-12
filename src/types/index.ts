export type Grade = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Subject = "math" | "reading" | "grammar" | "english";

export interface User {
  id: string;
  name: string;
  role: "parent" | "child";
  grade?: Grade;
  avatar?: string;
  coins?: number;
  streak?: number;
  parentId?: string;
}

export interface Progress {
  userId: string;
  subject: Subject;
  completedLessons: number;
  totalLessons: number;
  mastery: number; // 0-100
  lastActivity: string;
  timeSpentMinutes: number;
}

export interface HighFrequencyWord {
  id: string;
  word: string;
  grade: Grade;
  mastered: boolean;
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
