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
  // Parse digit range
  const parseDigits = (digits: string): { min: number; max: number } => {
    switch (digits) {
      case "1d<10": return { min: 1, max: 9 };
      case "1d>10": return { min: 10, max: 99 };
      case "2d<100": return { min: 10, max: 99 };
      case "2d>100": return { min: 100, max: 999 };
      case "3d<1000": return { min: 100, max: 999 };
      case "3d>1000": return { min: 1000, max: 9999 };
      case "4d<10000": return { min: 1000, max: 9999 };
      case "4d>10000": return { min: 10000, max: 99999 };
      case "5d<100000": return { min: 10000, max: 99999 };
      case "5d>100000": return { min: 100000, max: 999999 };
      default: return { min: 1, max: 9 };
    }
  };

  const { min, max } = parseDigits(settings.digits);
  const operandCount = Math.max(1, settings.randoms || 2);

  // Fast random integer generator
  const generateNumber = (minVal: number, maxVal: number): number => {
    return Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
  };

  // Generate expression with balanced sum
  const generateExpression = (count: number, min: number, max: number, maxSum: number): { numbers: number[]; operators: string[] } => {
    const numbers: number[] = new Array(count);
    const operators: string[] = new Array(count).fill('+');
    operators[0] = ''; // First number has no operator
    let currentSum = 0;

    // Target a small sum to avoid large adjustments
    const targetSum = Math.max(0, Math.min(maxSum, Math.floor(max * 0.3)));

    // First number: bias toward smaller values
    numbers[0] = generateNumber(min, Math.min(max, targetSum + min * (count - 1)));
    currentSum = numbers[0];

    // Generate numbers in + - pairs
    for (let i = 1; i < count; i += 2) {
      operators[i] = '+';
      const maxAdd = Math.min(max, maxSum - currentSum - min * (count - i - 1));
      numbers[i] = generateNumber(min, Math.max(min, maxAdd));
      currentSum += numbers[i];

      if (i + 1 < count) {
        operators[i + 1] = '-';
        const maxSubtract = Math.min(max, currentSum);
        numbers[i + 1] = generateNumber(min, Math.max(min, maxSubtract));
        currentSum -= numbers[i + 1];
      }
    }

    // Minimal sum adjustment
    if (currentSum > maxSum) {
      let adjust = currentSum - maxSum;
      for (let i = count - 1; i > 0 && adjust > 0; i -= 2) {
        if (operators[i] === '+' && numbers[i] > min) {
          const maxReduce = numbers[i] - min;
          const reduce = Math.min(maxReduce, adjust);
          numbers[i] -= reduce;
          currentSum -= reduce;
          adjust -= reduce;
        }
      }
    } else if (currentSum < 0) {
      for (let i = count - 1; i > 0 && currentSum < 0; i -= 2) {
        if (operators[i] === '-') {
          operators[i] = '+';
          currentSum += 2 * numbers[i];
        }
      }
    }

    return { numbers, operators };
  };

  const { numbers, operators } = generateExpression(operandCount, min, max, max);
  const correct = numbers.reduce((sum, num, i) => {
    if (i === 0) return num;
    return operators[i] === '+' ? sum + num : sum - num;
  }, 0);

  // Create display steps
  const steps: QuizStep[] = numbers.map((num, i) => ({
    display: i === 0 ? `${num}` : `${operators[i]} ${num}`,
    soundUris: [],
  }));
  steps.push({ display: "= ?", soundUris: [] });

  // Generate integer answer options
  const generateOption = (base: number, minVal: number, maxVal: number): number => {
    const offsets = settings.digits === '4d<10000' ? [100, 200, 1000] : [1, 2, 10];
    const offset = offsets[Math.floor(Math.random() * offsets.length)];
    const sign = Math.random() > 0.5 ? 1 : -1;
    const option = Math.floor(Math.max(minVal, Math.min(maxVal, base + offset * sign)));
    const minDistance = Math.floor(minVal / 2);
    return Math.abs(option - base) < minDistance
      ? Math.floor(base + (Math.random() > 0.5 ? minDistance : -minDistance))
      : option;
  };

  const optionsSet = new Set<number>([Math.floor(correct)]);
  const minOption = Math.max(0, Math.floor(min / 2));
  while (optionsSet.size < 4) {
    const option = generateOption(correct, minOption, max);
    if (option !== correct && option >= 0) {
      optionsSet.add(Math.floor(option));
    }
  }

  return {
    steps,
    correct: Math.floor(correct),
    options: Array.from(optionsSet).sort(() => Math.random() - 0.5),
  };
};