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
    console.time('generateExpression');
    const numbers: number[] = new Array(count);
    const operators: string[] = new Array(count).fill('+');
    operators[0] = '';
    let currentSum = 0;
    let adjustments = { overshoot: 0, undershoot: 0 };

    // Generate the first number (positive, non-zero, within [min, max])
    const firstMax = Math.min(max, Math.floor(maxSum / 2));
    numbers[0] = generateNumber(min, firstMax); // Ensures positive, non-zero first number
    currentSum = numbers[0];
    console.log(`Step 1: num=${numbers[0]}, sum=${currentSum}`);

    for (let i = 1; i < count; i++) {
      // Randomly choose operator: '+' or '-'
      operators[i] = Math.random() > 0.5 ? '+' : '-';
      console.log(`Step ${i + 1}: operator=${operators[i]}`);

      // Bias toward smaller numbers
      const biasedMax = Math.min(max, Math.floor(maxSum / 4));
      if (operators[i] === '+') {
        const maxAdd = Math.max(min, maxSum - currentSum);
        numbers[i] = generateNumber(min, Math.min(biasedMax, maxAdd));
        currentSum += numbers[i];
        console.log(`  Add: num=${numbers[i]}, maxAdd=${maxAdd}, sum=${currentSum}`);
      } else {
        const maxSubtract = Math.min(biasedMax, currentSum);
        numbers[i] = generateNumber(min, Math.max(min, maxSubtract));
        currentSum -= numbers[i];
        console.log(`  Subtract: num=${numbers[i]}, maxSubtract=${maxSubtract}, sum=${currentSum}`);
      }

      // Minimize adjustments, ensure number stays >= min
      if (currentSum >= maxSum) {
        const excess = currentSum - (maxSum - 1);
        const newNumber = Math.max(min, numbers[i] - excess); // Prevent number < min
        const actualExcess = numbers[i] - newNumber;
        numbers[i] = newNumber;
        currentSum -= actualExcess;
        adjustments.overshoot++;
        console.log(`  Overshoot adjustment: reduced num[${i}] to ${newNumber}, actual excess=${actualExcess}, new sum=${currentSum}`);
      } else if (currentSum < 0) {
        const deficit = -currentSum;
        const newNumber = Math.max(min, numbers[i] - deficit); // Prevent number < min
        const actualDeficit = numbers[i] - newNumber;
        numbers[i] = newNumber;
        currentSum += actualDeficit;
        adjustments.undershoot++;
        console.log(`  Undershoot adjustment: reduced num[${i}] to ${newNumber}, actual deficit=${actualDeficit}, new sum=${currentSum}`);
      }
    }

    console.log(`Adjustments: overshoot=${adjustments.overshoot}, undershoot=${adjustments.undershoot}`);
    console.timeEnd('generateExpression');
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