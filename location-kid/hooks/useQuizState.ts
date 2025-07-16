import { useReducer, useRef } from 'react';
import { QuizData, generateQuiz } from '../utils/quizGenerator';

type QuizState = {
  quiz: QuizData;
  stepIndex: number;
  selected: number | null;
  result: 'correct' | 'incorrect' | null;
  error: string | null;
  hasStarted: boolean; 
};

type QuizAction =
  | { type: 'NEXT_STEP' }
  | { type: 'SELECT_OPTION'; payload: number }
  | { type: 'CHECK_ANSWER' }
  | { type: 'RETRY' }
  | { type: 'START' }
  | { type: 'SET_ERROR'; payload: string };
  

const initialState: QuizState = {
  quiz: generateQuiz(),
  stepIndex: 0,
  selected: null,
  result: null,
  error: null,
  hasStarted: false,
};

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'START':
      return { ...state, hasStarted: true };
    case 'NEXT_STEP':
      if (state.stepIndex < state.quiz.steps.length - 1) {
        return { ...state, stepIndex: state.stepIndex + 1 };
      }
      return state;
    case 'SELECT_OPTION':
      return { ...state, selected: action.payload };
    case 'CHECK_ANSWER':
      if (state.selected === null) return state;
      return {
        ...state,
        result: state.selected === state.quiz.correct ? 'correct' : 'incorrect',
      };
    case 'RETRY':
      return { ...initialState, quiz: generateQuiz() };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const useQuizState = () => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startStepTimer = () => {
    if (state.stepIndex < state.quiz.steps.length - 1) {
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: 'NEXT_STEP' });
      }, 1000); // 1 giấy
    }
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