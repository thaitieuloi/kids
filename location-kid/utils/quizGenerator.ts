export type QuizStep = {
  display: string;
  soundUris: string[];
};

export type QuizData = {
  steps: QuizStep[];
  correct: number;
  options: number[];
};

export const generateQuiz = (): QuizData => {
  let numbers: number[] = [];
  let correct = 0;

  // Tạo dãy hợp lệ: 2 hoặc 3 số > 0 và tổng < 10
  while (true) {
    const operandCount = Math.random() < 0.5 ? 2 : 3; // 2 hoặc 3 số
    numbers = Array.from({ length: operandCount }, () => 1 + Math.floor(Math.random() * 5)); // số từ 1–5
    correct = numbers.reduce((sum, num) => sum + num, 0);
    if (correct < 10) break; // ✅ Tổng phải < 10
  }

  const steps: QuizStep[] = numbers.map((num, i) => ({
    display: i === 0 ? `${num}` : `+ ${num}`,
    soundUris: [],
  }));

  steps.push({ display: '= ?', soundUris: [] });

  const optionsSet = new Set<number>([correct]);
  while (optionsSet.size < 4) {
    const option = 1 + Math.floor(Math.random() * 10); // từ 1 đến 9
    if (option !== correct) optionsSet.add(option);
  }

  return {
    steps,
    correct,
    options: Array.from(optionsSet).sort(() => Math.random() - 0.5),
  };
};
