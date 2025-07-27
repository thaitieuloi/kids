import { useReducer, useRef } from "react";
import { QuizData, generateQuiz } from "../utils/quizGenerator";

type QuizSettings = {
  simpleRule: string;
  digits: string;
  typeTest: string;
  randoms: number;
  speed: number;
  questions: number;
  score: number;
  timeAnswers: number;
};

type QuizState = {
  quiz: QuizData;
  stepIndex: number;
  selected: number | null;
  result: "correct" | "incorrect" | null;
  error: string | null;
  hasStarted: boolean;
  isFinished: boolean;
  settings: QuizSettings | null;
  currentQuestion: number;
  totalScore: number;
};

type QuizAction =
  | { type: "NEXT_STEP" }
  | { type: "SELECT_OPTION"; payload: number }
  | { type: "CHECK_ANSWER" }
  | { type: "RETRY" }
  | { type: "START"; payload: QuizSettings }
  | { type: "SET_ERROR"; payload: string }
  | { type: "RESET" };

const initialQuizData: QuizData = {
  steps: [],
  options: [],
  correct: 0,
};

const initialState: QuizState = {
  quiz: initialQuizData,
  stepIndex: 0,
  selected: null,
  result: null,
  error: null,
  hasStarted: false,
  isFinished: false,
  settings: null,
  currentQuestion: 1,
  totalScore: 0,
};

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case "START":
      return {
        ...initialState,
        hasStarted: true,
        settings: action.payload,
        quiz: generateQuiz(action.payload),
      };

    case "NEXT_STEP":
      if (state.stepIndex < state.quiz.steps.length - 1) {
        return { ...state, stepIndex: state.stepIndex + 1 };
      }
      return state;

    case "SELECT_OPTION":
      return { ...state, selected: action.payload };

    case "CHECK_ANSWER":
      if (state.selected === null) return state;
      const isCorrect = state.selected === state.quiz.correct;
      return {
        ...state,
        result: isCorrect ? "correct" : "incorrect",
        totalScore: isCorrect
          ? state.totalScore + (state.settings?.score || 1)
          : state.totalScore,
      };

    case "RETRY":
      if (!state.settings) return state;
      if (state.currentQuestion >= state.settings.questions) {
        return { ...state, isFinished: true };
      }
      return {
        ...state,
        quiz: generateQuiz(state.settings),
        stepIndex: 0,
        selected: null,
        result: null,
        error: null,
        currentQuestion: state.currentQuestion + 1,
      };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

export const useQuizState = () => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startStepTimer = () => {
    if (!state.settings || state.stepIndex >= state.quiz.steps.length - 1) return;

    // Tổng số dòng (bao gồm "= ?")
    const stepCount = state.quiz.steps.length;
    // Tính thời gian mỗi dòng (tổng speed chia cho số dòng, đơn vị mili giây)
    const stepDuration = (state.settings.speed * 1000) / stepCount;
    // Đảm bảo thời gian mỗi dòng không nhỏ hơn 0.1 giây (100ms)
    const minStepDuration = 100; // Sửa từ 1 thành 100 (0.1 giây)
    const finalStepDuration = Math.max(stepDuration, minStepDuration);

    timeoutRef.current = setTimeout(() => {
      dispatch({ type: "NEXT_STEP" });
    }, finalStepDuration);
  };

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return {
    state,
    dispatch,
    startStepTimer,
    clearTimer,
  };
};