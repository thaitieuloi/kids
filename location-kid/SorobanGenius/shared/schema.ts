import { z } from "zod";

export const difficultyLevels = {
  beginner: "beginner",
  intermediate: "intermediate", 
  advanced: "advanced"
} as const;

export type DifficultyLevel = keyof typeof difficultyLevels;

export const gameSettingsSchema = z.object({
  questionCount: z.number().min(1).max(50).default(10),
  rowCount: z.number().min(1).max(10).default(3),
  timeLimit: z.number().min(5).max(300).default(30),
  numberRange: z.number().min(10).max(100000).default(100),
  feedbackSound: z.boolean().default(true),
  numberReading: z.boolean().default(false),
  transitionSound: z.boolean().default(true),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner")
});

export type GameSettings = z.infer<typeof gameSettingsSchema>;

export const mathProblemSchema = z.object({
  id: z.string(),
  number1: z.number(),
  number2: z.number(),
  operator: z.enum(["+", "-"]),
  correctAnswer: z.number(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"])
});

export type MathProblem = z.infer<typeof mathProblemSchema>;

export const gameSessionSchema = z.object({
  id: z.string(),
  settings: gameSettingsSchema,
  problems: z.array(mathProblemSchema),
  answers: z.array(z.object({
    problemId: z.string(),
    userAnswer: z.number().nullable(),
    timeSpent: z.number(),
    isCorrect: z.boolean(),
    skipped: z.boolean().default(false)
  })),
  startTime: z.date(),
  endTime: z.date().nullable(),
  score: z.number().default(0),
  totalTime: z.number().default(0)
});

export type GameSession = z.infer<typeof gameSessionSchema>;

export const gameStatsSchema = z.object({
  totalQuestions: z.number().default(0),
  correctAnswers: z.number().default(0),
  accuracy: z.number().default(0),
  averageTime: z.number().default(0),
  gamesPlayed: z.number().default(0)
});

export type GameStats = z.infer<typeof gameStatsSchema>;
