import { type GameSession, type GameStats, type GameSettings, type MathProblem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createGameSession(settings: GameSettings): Promise<GameSession>;
  getGameSession(id: string): Promise<GameSession | undefined>;
  updateGameSession(session: GameSession): Promise<GameSession>;
  getGameStats(): Promise<GameStats>;
  updateGameStats(stats: GameStats): Promise<GameStats>;
  generateMathProblems(settings: GameSettings): Promise<MathProblem[]>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, GameSession> = new Map();
  private stats: GameStats = {
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    averageTime: 0,
    gamesPlayed: 0
  };

  async createGameSession(settings: GameSettings): Promise<GameSession> {
    const id = randomUUID();
    const problems = await this.generateMathProblems(settings);
    
    const session: GameSession = {
      id,
      settings,
      problems,
      answers: [],
      startTime: new Date(),
      endTime: null,
      score: 0,
      totalTime: 0
    };

    this.sessions.set(id, session);
    return session;
  }

  async getGameSession(id: string): Promise<GameSession | undefined> {
    return this.sessions.get(id);
  }

  async updateGameSession(session: GameSession): Promise<GameSession> {
    this.sessions.set(session.id, session);
    return session;
  }

  async getGameStats(): Promise<GameStats> {
    return { ...this.stats };
  }

  async updateGameStats(stats: GameStats): Promise<GameStats> {
    this.stats = { ...stats };
    return this.stats;
  }

  async generateMathProblems(settings: GameSettings): Promise<MathProblem[]> {
    const problems: MathProblem[] = [];
    
    for (let i = 0; i < settings.questionCount; i++) {
      const problem = this.generateSingleProblem(settings);
      problems.push(problem);
    }
    
    return problems;
  }

  private generateSingleProblem(settings: GameSettings): MathProblem {
    const id = randomUUID();
    const maxNumber = Math.min(settings.numberRange, this.getMaxNumberForDifficulty(settings.difficulty));
    
    let number1: number;
    let number2: number;
    let operator: "+" | "-";
    let correctAnswer: number;
    
    // Ensure positive results only
    do {
      number1 = Math.floor(Math.random() * maxNumber) + 1;
      number2 = Math.floor(Math.random() * maxNumber) + 1;
      operator = Math.random() > 0.5 ? "+" : "-";
      
      if (operator === "+") {
        correctAnswer = number1 + number2;
      } else {
        // For subtraction, ensure result is positive
        if (number1 < number2) {
          [number1, number2] = [number2, number1];
        }
        correctAnswer = number1 - number2;
      }
    } while (correctAnswer <= 0);

    return {
      id,
      number1,
      number2,
      operator,
      correctAnswer,
      difficulty: settings.difficulty
    };
  }

  private getMaxNumberForDifficulty(difficulty: string): number {
    switch (difficulty) {
      case "beginner":
        return 100;
      case "intermediate":
        return 1000;
      case "advanced":
        return 10000;
      default:
        return 100;
    }
  }
}

export const storage = new MemStorage();
