import type { Grade } from "@/types";

export type MathQ = { q: string; a: string; opts: string[] };

/** Grade-appropriate math — does NOT embed the answer in the prompt */
export function mathQuestionsForGrade(grade: Grade): MathQ[] {
  if (grade <= 2) {
    // Grade 2: addition/subtraction within 100, skip-counting intro — NO multi-digit mult
    return [
      { q: "What is 7 + 5?", a: "12", opts: ["11", "12", "13", "10"] },
      { q: "What is 9 + 6?", a: "15", opts: ["14", "15", "16", "13"] },
      { q: "What is 14 − 6?", a: "8", opts: ["7", "8", "9", "6"] },
      { q: "What is 20 − 9?", a: "11", opts: ["10", "11", "12", "9"] },
      { q: "What is 8 + 7?", a: "15", opts: ["14", "15", "16", "13"] },
      { q: "What is 12 + 5?", a: "17", opts: ["16", "17", "18", "15"] },
      { q: "What is 18 − 9?", a: "9", opts: ["8", "9", "10", "7"] },
      { q: "Count by 2s: 2, 4, 6, __?", a: "8", opts: ["7", "8", "9", "10"] },
    ];
  }
  if (grade === 3) {
    return [
      { q: "What is 6 × 4?", a: "24", opts: ["20", "24", "28", "22"] },
      { q: "What is 8 × 3?", a: "24", opts: ["21", "24", "27", "18"] },
      { q: "What is 15 + 28?", a: "43", opts: ["42", "43", "44", "41"] },
      { q: "What is 56 − 19?", a: "37", opts: ["36", "37", "38", "35"] },
      { q: "What is 9 × 5?", a: "45", opts: ["40", "45", "50", "36"] },
      { q: "What is 36 ÷ 6?", a: "6", opts: ["5", "6", "7", "4"] },
      { q: "What is 7 × 7?", a: "49", opts: ["42", "49", "56", "48"] },
      { q: "What is 100 − 37?", a: "63", opts: ["62", "63", "64", "73"] },
    ];
  }
  if (grade === 4) {
    return [
      { q: "What is 12 × 8?", a: "96", opts: ["88", "96", "104", "84"] },
      { q: "What is 144 ÷ 12?", a: "12", opts: ["10", "12", "14", "11"] },
      { q: "What is 3/4 of 20?", a: "15", opts: ["10", "15", "16", "12"] },
      { q: "What is 250 + 375?", a: "625", opts: ["615", "625", "635", "600"] },
      { q: "What is 9 × 9?", a: "81", opts: ["72", "81", "90", "18"] },
      { q: "Which is larger: 2/3 or 1/2?", a: "2/3", opts: ["1/2", "2/3", "Equal", "Cannot tell"] },
      { q: "What is 48 ÷ 6?", a: "8", opts: ["6", "8", "7", "9"] },
      { q: "What is 15 × 4?", a: "60", opts: ["50", "60", "55", "65"] },
    ];
  }
  if (grade === 5) {
    return [
      { q: "What is 0.5 + 0.25?", a: "0.75", opts: ["0.5", "0.75", "1.0", "0.25"] },
      { q: "What is 3/5 as a decimal?", a: "0.6", opts: ["0.3", "0.6", "0.35", "1.5"] },
      { q: "What is 12 × 11?", a: "132", opts: ["121", "132", "144", "120"] },
      { q: "What is 25% of 80?", a: "20", opts: ["15", "20", "25", "40"] },
      { q: "What is 2.5 × 4?", a: "10", opts: ["8", "10", "12", "6.5"] },
      { q: "What is 7²?", a: "49", opts: ["14", "49", "56", "21"] },
      { q: "What is 1/2 + 1/4?", a: "3/4", opts: ["1/4", "3/4", "1/2", "2/4"] },
      { q: "What is 360 ÷ 9?", a: "40", opts: ["30", "40", "45", "36"] },
    ];
  }
  if (grade <= 7) {
    return [
      { q: "What is 15% of 200?", a: "30", opts: ["20", "30", "40", "15"] },
      { q: "Solve: 3x = 18. What is x?", a: "6", opts: ["5", "6", "9", "3"] },
      { q: "What is −4 + 9?", a: "5", opts: ["−5", "5", "13", "−13"] },
      { q: "What is 2/3 × 9?", a: "6", opts: ["3", "6", "12", "18"] },
      { q: "What is the mean of 4, 6, 8?", a: "6", opts: ["4", "6", "8", "18"] },
      { q: "What is 5² − 3²?", a: "16", opts: ["4", "16", "25", "9"] },
      { q: "Ratio 2:3 is the same as?", a: "4:6", opts: ["3:2", "4:6", "2:5", "6:9 only"] },
      { q: "What is 0.2 × 0.3?", a: "0.06", opts: ["0.6", "0.06", "0.5", "0.05"] },
    ];
  }
  // Grades 8–10
  return [
    { q: "Solve: 2x + 4 = 12. What is x?", a: "4", opts: ["2", "4", "6", "8"] },
    { q: "What is √81?", a: "9", opts: ["8", "9", "7", "18"] },
    { q: "What is slope of line through (0,0) and (2,6)?", a: "3", opts: ["2", "3", "6", "1/3"] },
    { q: "What is 20% of 150?", a: "30", opts: ["20", "30", "40", "15"] },
    { q: "Factor: x² − 9 = ?", a: "(x−3)(x+3)", opts: ["(x−3)(x−3)", "(x−3)(x+3)", "(x+9)(x−1)", "x(x−9)"] },
    { q: "What is 3⁴?", a: "81", opts: ["12", "27", "81", "64"] },
    { q: "If y = 2x + 1 and x = 5, y = ?", a: "11", opts: ["10", "11", "12", "9"] },
    { q: "What is the median of 3, 7, 9?", a: "7", opts: ["3", "7", "9", "6"] },
  ];
}

export function mathTopicsForGrade(grade: Grade): string[] {
  if (grade <= 2) return ["Addition within 100", "Subtraction within 100", "Skip counting", "Place value (tens & ones)"];
  if (grade === 3) return ["Multiplication facts", "Division basics", "Two-digit addition", "Word problems"];
  if (grade === 4) return ["Multi-digit multiply", "Long division", "Fractions", "Measurement"];
  if (grade === 5) return ["Decimals", "Percent basics", "Fraction operations", "Volume & area"];
  if (grade <= 7) return ["Ratios & proportions", "Integers", "Simple equations", "Statistics"];
  return ["Linear equations", "Exponents & roots", "Slope & lines", "Data analysis"];
}
