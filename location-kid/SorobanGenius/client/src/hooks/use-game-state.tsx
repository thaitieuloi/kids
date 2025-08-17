import { useState, useCallback } from 'react';
import type { GameSession, MathProblem } from '@shared/schema';

interface GameAnswer {
  problemId: string;
  userAnswer: number | null;
  timeSpent: number;
  isCorrect: boolean;
  skipped: boolean;
}

export function useGameState(initialSession: GameSession | undefined | null) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentProblem = initialSession?.problems?.[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= (initialSession?.problems?.length || 0) - 1;
  const progress = initialSession?.problems?.length ? ((currentQuestionIndex + 1) / initialSession.problems.length) * 100 : 0;

  const submitAnswer = useCallback((answer: number | null, skipped = false) => {
    if (!currentProblem || !initialSession) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = !skipped && answer === currentProblem.correctAnswer;

    const gameAnswer: GameAnswer = {
      problemId: currentProblem.id,
      userAnswer: answer,
      timeSpent,
      isCorrect,
      skipped
    };

    setAnswers(prev => [...prev, gameAnswer]);
    setUserAnswer('');
    
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      setIsTimerRunning(false);
    }

    return gameAnswer;
  }, [currentProblem, questionStartTime, isLastQuestion, initialSession]);

  const skipQuestion = useCallback(() => {
    if (!initialSession) return;
    return submitAnswer(null, true);
  }, [submitAnswer, initialSession]);

  const resetTimer = useCallback(() => {
    setQuestionStartTime(Date.now());
  }, []);

  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsTimerRunning(true);
    setQuestionStartTime(Date.now());
  }, []);

  return {
    currentProblem,
    currentQuestionIndex,
    answers,
    userAnswer,
    setUserAnswer,
    isTimerRunning,
    progress,
    isLastQuestion,
    submitAnswer,
    skipQuestion,
    resetTimer,
    pauseTimer,
    resumeTimer
  };
}
