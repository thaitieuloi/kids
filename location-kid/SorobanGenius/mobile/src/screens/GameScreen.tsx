import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, GameSettings, MathProblem, GameAnswer, GameSession } from '../../App';
import SorobanDisplay from '../components/SorobanDisplay';
import Timer from '../components/Timer';

const { width, height } = Dimensions.get('window');

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

interface Props {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
}

export default function GameScreen({ navigation, route }: Props) {
  const { settings } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [startTime] = useState(new Date());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    generateProblems();
  }, []);

  const generateProblems = () => {
    const newProblems: MathProblem[] = [];
    
    for (let i = 0; i < settings.questionCount; i++) {
      const maxNum = settings.numberRange === 5 ? 4 : 
                   settings.numberRange === 10 ? 9 : 
                   settings.numberRange === 20 ? 19 : 49;
      
      const number1 = Math.floor(Math.random() * maxNum) + 1;
      const number2 = Math.floor(Math.random() * maxNum) + 1;
      const operator = Math.random() > 0.5 ? '+' : '-';
      
      // Ensure positive results for subtraction
      const [larger, smaller] = operator === '-' ? 
        [Math.max(number1, number2), Math.min(number1, number2)] : 
        [number1, number2];
      
      const correctAnswer = operator === '+' ? 
        larger + smaller : 
        larger - smaller;

      newProblems.push({
        id: `problem_${i}`,
        number1: operator === '-' ? larger : number1,
        number2: operator === '-' ? smaller : number2,
        operator,
        correctAnswer,
        difficulty: settings.difficulty,
      });
    }
    
    setProblems(newProblems);
  };

  const currentProblem = problems[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= problems.length - 1;
  const progress = ((currentQuestionIndex + 1) / problems.length) * 100;

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đáp án');
      return;
    }

    const numAnswer = parseInt(userAnswer);
    if (isNaN(numAnswer)) {
      Alert.alert('Lỗi', 'Vui lòng nhập một số hợp lệ');
      return;
    }

    submitAnswer(numAnswer, false);
  };

  const handleSkipQuestion = () => {
    submitAnswer(null, true);
  };

  const handleTimeUp = () => {
    submitAnswer(null, true);
  };

  const submitAnswer = (answer: number | null, skipped: boolean) => {
    if (!currentProblem) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = !skipped && answer === currentProblem.correctAnswer;

    const gameAnswer: GameAnswer = {
      problemId: currentProblem.id,
      userAnswer: answer,
      timeSpent,
      isCorrect,
      skipped,
    };

    const newAnswers = [...answers, gameAnswer];
    setAnswers(newAnswers);
    setUserAnswer('');

    if (isLastQuestion) {
      // Game completed
      const session: GameSession = {
        id: `session_${Date.now()}`,
        settings,
        problems,
        answers: newAnswers,
        startTime,
        endTime: new Date(),
        score: newAnswers.filter(a => a.isCorrect).length,
        totalTime: newAnswers.reduce((total, a) => total + a.timeSpent, 0),
      };
      
      navigation.navigate('Results', { session });
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    }
  };

  if (!currentProblem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tạo câu hỏi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1}/{problems.length}
          </Text>
        </View>

        {/* Timer */}
        <Timer
          duration={settings.timeLimit}
          onTimeUp={handleTimeUp}
          isPaused={isPaused}
          key={currentQuestionIndex} // Reset timer for each question
        />

        {/* Question */}
        <View style={styles.questionContainer}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Câu {currentQuestionIndex + 1}</Text>
          </View>
          
          <View style={styles.questionContent}>
            <Text style={styles.questionText}>
              {currentProblem.number1}
              <Text style={[
                styles.operator,
                { color: currentProblem.operator === '+' ? '#3B82F6' : '#EF4444' }
              ]}>
                {' '}{currentProblem.operator}{' '}
              </Text>
              {currentProblem.number2} = ?
            </Text>
          </View>

          {/* Soroban Display */}
          {/* <SorobanDisplay 
            number={currentProblem.operator === '+' ? 
              currentProblem.number1 + currentProblem.number2 : 
              currentProblem.number1
            } 
          /> */}
        </View>

        {/* Answer Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nhập đáp án:</Text>
          <TextInput
            style={styles.input}
            value={userAnswer}
            onChangeText={setUserAnswer}
            keyboardType="numeric"
            placeholder="Nhập số..."
            placeholderTextColor="#9CA3AF"
            maxLength={3}
            autoFocus
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitAnswer}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {isLastQuestion ? '✓ Hoàn thành' : '→ Tiếp theo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipQuestion}
            activeOpacity={0.8}
          >
            <Text style={styles.skipButtonText}>⏭ Bỏ qua</Text>
          </TouchableOpacity>
        </View>

        {/* Pause Button */}
        <TouchableOpacity
          style={styles.pauseButton}
          onPress={() => setIsPaused(!isPaused)}
          activeOpacity={0.8}
        >
          <Text style={styles.pauseButtonText}>
            {isPaused ? '▶️ Tiếp tục' : '⏸ Tạm dừng'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    minWidth: 40,
  },
  questionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  questionContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  operator: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    textAlign: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  skipButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  pauseButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  pauseButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});