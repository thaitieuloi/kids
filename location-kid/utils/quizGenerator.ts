export type QuizStep = {
  display: string;
  soundUris: string[];
};

export type QuizData = {
  steps: QuizStep[];
  correct: number;
  options: number[];
};

export type QuizSettings = {
  simpleRule: string;
  digits: string;
  typeTest: string;
  randoms: number;
  speed: number;
  questions: number;
  score: number;
  timeAnswers: number;
};

export const generateQuiz = (settings: QuizSettings): QuizData => {
  let numbers: number[] = [];
  let correct = 0;

  // Xử lý phạm vi số ngẫu nhiên từ digits
  const parseDigits = (digits: string): { min: number; max: number } => {
    switch (digits) {
      case "1d<10":
        return { min: 1, max: 9 };
      case "1d>10":
        return { min: 10, max: 99 };
      case "2d<100":
        return { min: 10, max: 99 };
      case "2d>100":
        return { min: 100, max: 999 };
      case "3d<1000":
        return { min: 100, max: 999 };
      case "3d>1000":
        return { min: 1000, max: 9999 };
      case "4d<10000":
        return { min: 1000, max: 9999 };
      case "4d>10000":
        return { min: 10000, max: 99999 };
      case "5d<100000":
        return { min: 10000, max: 99999 };
      case "5d>100000":
        return { min: 100000, max: 999999 };
      default:
        return { min: 1, max: 9 };
    }
  };

  const { min, max } = parseDigits(settings.digits);

  // Tạo dãy số ngẫu nhiên dựa trên randoms (tổng số dòng, trừ "= ?")
  const operandCount = Math.max(1, (settings.randoms || 2) - 1); // randoms - 1 số
  let attempts = 0;
  const maxAttempts = 100;
  const maxAllowedTotal = 1000000; // Giới hạn tổng tối đa
  while (attempts < maxAttempts) {
    numbers = Array.from({ length: operandCount }, () =>
      Math.floor(Math.random() * (max - min + 1)) + min
    );
    correct = numbers.reduce((sum, num) => sum + num, 0);
    const maxTotal = max * operandCount;
    if (correct <= Math.min(maxTotal, maxAllowedTotal)) break;
    attempts++;
  }
  if (attempts >= maxAttempts) {
    numbers = Array.from({ length: operandCount }, () => min);
    correct = numbers.reduce((sum, num) => sum + num, 0);
  }

  // Tạo các bước hiển thị
  const steps: QuizStep[] = numbers.map((num, i) => ({
    display: i === 0 ? `${num}` : `+ ${num}`,
    soundUris: [],
  }));

  steps.push({ display: "= ?", soundUris: [] });

  // Tạo options cho câu trả lời
  const optionsSet = new Set<number>([correct]);
  const maxTotal = max * operandCount;
  while (optionsSet.size < 4) {
    const range = Math.min(max - min, Math.max(correct * 0.2, max - min));
    const option = Math.floor(correct + (Math.random() * range - range / 2));
    if (option !== correct && option > 0 && option <= maxTotal) {
      optionsSet.add(option);
    }
  }

  return {
    steps,
    correct,
    options: Array.from(optionsSet).sort(() => Math.random() - 0.5),
  };
};