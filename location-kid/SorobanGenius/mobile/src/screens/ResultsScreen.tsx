import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Results'>;
type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

interface Props {
  navigation: ResultsScreenNavigationProp;
  route: ResultsScreenRouteProp;
}

export default function ResultsScreen({ navigation, route }: Props) {
  const { session } = route.params;
  
  const correctAnswers = session.answers.filter(a => a.isCorrect).length;
  const totalQuestions = session.problems.length;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const averageTime = session.answers.length > 0 ? 
    session.answers.reduce((sum, a) => sum + a.timeSpent, 0) / session.answers.length : 0;

  const handlePlayAgain = () => {
    navigation.navigate('Settings');
  };

  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  const getScoreColor = (accuracy: number): string => {
    if (accuracy >= 80) return '#10B981';
    if (accuracy >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreEmoji = (accuracy: number): string => {
    if (accuracy >= 90) return '🏆';
    if (accuracy >= 80) return '🌟';
    if (accuracy >= 70) return '👏';
    if (accuracy >= 60) return '👍';
    return '💪';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Kết quả trò chơi</Text>
            <Text style={styles.emoji}>{getScoreEmoji(accuracy)}</Text>
          </View>

          {/* Score Card */}
          <View style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreTitle}>Điểm số</Text>
              <Text style={[styles.scoreValue, { color: getScoreColor(accuracy) }]}>
                {correctAnswers}/{totalQuestions}
              </Text>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${accuracy}%`,
                    backgroundColor: getScoreColor(accuracy),
                  }
                ]} 
              />
            </View>
            
            <Text style={[styles.accuracyText, { color: getScoreColor(accuracy) }]}>
              {accuracy.toFixed(1)}% chính xác
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Thời gian trung bình</Text>
              <Text style={styles.statValue}>{averageTime.toFixed(1)}s</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Tổng thời gian</Text>
              <Text style={styles.statValue}>{Math.floor(session.totalTime / 60)}m {session.totalTime % 60}s</Text>
            </View>
          </View>

          {/* Question Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Chi tiết từng câu hỏi</Text>
            
            <View style={styles.questionsList}>
              {session.problems.map((problem, index) => {
                const answer = session.answers.find(a => a.problemId === problem.id) || session.answers[index];
                const isCorrect = answer?.isCorrect || false;
                const wasSkipped = answer?.skipped || false;

                return (
                  <View 
                    key={problem.id} 
                    style={[
                      styles.questionItem,
                      { 
                        backgroundColor: isCorrect ? '#F0FDF4' : 
                                        wasSkipped ? '#FFFBEB' : '#FEF2F2',
                        borderColor: isCorrect ? '#10B981' : 
                                   wasSkipped ? '#F59E0B' : '#EF4444'
                      }
                    ]}
                  >
                    <View style={styles.questionHeader}>
                      <View style={styles.questionNumber}>
                        <Text style={styles.questionNumberText}>{index + 1}</Text>
                      </View>
                      
                      <View 
                        style={[
                          styles.statusIndicator,
                          { 
                            backgroundColor: isCorrect ? '#10B981' : 
                                           wasSkipped ? '#F59E0B' : '#EF4444'
                          }
                        ]}
                      >
                        <Text style={styles.statusIcon}>
                          {isCorrect ? '✓' : wasSkipped ? '⏭' : '✗'}
                        </Text>
                      </View>
                      
                      <Text style={styles.timeSpent}>{answer?.timeSpent || 0}s</Text>
                    </View>
                    
                    <View style={styles.questionContent}>
                      <Text style={styles.questionText}>
                        {problem.number1}
                        <Text style={[
                          styles.operator,
                          { color: problem.operator === '+' ? '#3B82F6' : '#EF4444' }
                        ]}>
                          {' '}{problem.operator}{' '}
                        </Text>
                        {problem.number2} = ?
                      </Text>
                      
                      <View style={styles.answersContainer}>
                        <View style={styles.answerRow}>
                          <Text style={styles.answerLabel}>Bạn trả lời: </Text>
                          <Text style={[
                            styles.answerValue,
                            { 
                              color: wasSkipped ? '#F59E0B' : 
                                    isCorrect ? '#10B981' : '#EF4444'
                            }
                          ]}>
                            {wasSkipped ? 'Bỏ qua' : 
                             (answer?.userAnswer !== null && answer?.userAnswer !== undefined ? 
                              answer.userAnswer : '—')}
                          </Text>
                        </View>
                        
                        <View style={styles.answerRow}>
                          <Text style={styles.answerLabel}>Đáp án đúng: </Text>
                          <Text style={[styles.answerValue, { color: '#10B981' }]}>
                            {problem.correctAnswer}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handlePlayAgain}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>🔄 Chơi lại</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBackToHome}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>🏠 Về trang chủ</Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120, // Space for buttons
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 48,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  accuracyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  questionsList: {
    gap: 12,
  },
  questionItem: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  questionNumber: {
    width: 28,
    height: 28,
    backgroundColor: '#6B7280',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timeSpent: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  questionContent: {
    alignItems: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  operator: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  answersContainer: {
    width: '100%',
    gap: 4,
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  answerValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});