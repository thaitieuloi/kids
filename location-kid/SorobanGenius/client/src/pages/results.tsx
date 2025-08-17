import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Home, RotateCcw, Star, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { GameSession, GameStats } from '@shared/schema';

export default function Results() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [, setLocation] = useLocation();
  const [statsUpdated, setStatsUpdated] = useState(false);

  const { data: session, isLoading } = useQuery<GameSession>({
    queryKey: ["/api/game", sessionId],
    enabled: !!sessionId,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true
  });

  const updateStatsMutation = useMutation({
    mutationFn: async (stats: GameStats) => {
      const response = await apiRequest("PUT", "/api/stats", stats);
      return response.json() as Promise<GameStats>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setStatsUpdated(true);
    }
  });

  const { data: currentStats } = useQuery<GameStats>({
    queryKey: ["/api/stats"]
  });

  // Temporarily disabled stats update to fix infinite loop
  // TODO: Implement proper stats update logic
  useEffect(() => {
    // This effect is currently disabled to prevent infinite loop
    // Will be re-implemented with proper state management
  }, []);

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải kết quả...</div>
      </div>
    );
  }

  const correctAnswers = session.answers.filter(a => a.isCorrect).length;
  const totalQuestions = session.answers.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const avgTime = totalQuestions > 0 ? Math.round(session.answers.reduce((sum, a) => sum + a.timeSpent, 0) / totalQuestions) : 0;
  const totalTimeFormatted = `${Math.floor(session.totalTime / 60)}:${(session.totalTime % 60).toString().padStart(2, '0')}`;

  const getBadgeInfo = () => {
    if (accuracy >= 90) {
      return {
        title: "Xuất sắc!",
        message: "Bạn là một thiên tài toán học!",
        color: "from-yellow-400 to-orange-500"
      };
    } else if (accuracy >= 80) {
      return {
        title: "Học sinh giỏi!",
        message: "Bạn đã làm rất tốt. Tiếp tục luyện tập nhé!",
        color: "from-green-400 to-blue-500"
      };
    } else if (accuracy >= 60) {
      return {
        title: "Khá tốt!",
        message: "Bạn đang tiến bộ. Hãy thử lại để cải thiện!",
        color: "from-blue-400 to-purple-500"
      };
    } else {
      return {
        title: "Cố gắng lên!",
        message: "Đừng bỏ cuộc! Luyện tập thêm sẽ giúp bạn tiến bộ.",
        color: "from-purple-400 to-pink-500"
      };
    }
  };

  const badgeInfo = getBadgeInfo();

  const handlePlayAgain = () => {
    setLocation(`/settings/${session.settings.difficulty}`);
  };

  const handleBackToHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
      {/* Celebration Header */}
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Tuyệt vời!</h2>
        <p className="text-lg text-gray-600">Bạn đã hoàn thành bài tập</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Score Overview */}
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-lg text-gray-600">Số câu đúng</div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-success h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Tỷ lệ chính xác: <span className="font-semibold">{accuracy}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết kết quả</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-success">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Câu đúng</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-error">{totalQuestions - correctAnswers}</div>
                <div className="text-sm text-gray-600">Câu sai</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-accent">{avgTime}s</div>
                <div className="text-sm text-gray-600">TB thời gian</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-secondary">{totalTimeFormatted}</div>
                <div className="text-sm text-gray-600">Tổng thời gian</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Badge */}
        <Card className="shadow-lg">
          <CardContent className="p-6 text-center">
            <div className={`w-20 h-20 bg-gradient-to-br ${badgeInfo.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Star className="text-3xl text-white" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{badgeInfo.title}</h3>
            <p className="text-gray-600">{badgeInfo.message}</p>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết từng câu hỏi</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {session.problems.map((problem, index) => {
                const answer = session.answers.find(a => a.problemId === problem.id) || session.answers[index];
                const isCorrect = answer?.isCorrect || false;
                const wasSkipped = answer?.skipped || false;

                return (
                  <div key={problem.id} className={`p-4 rounded-lg border-2 ${
                    isCorrect ? 'border-green-300 bg-green-50' : 
                    wasSkipped ? 'border-yellow-300 bg-yellow-50' : 
                    'border-red-300 bg-red-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">Câu {index + 1}:</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCorrect ? 'bg-green-500' : 
                          wasSkipped ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}>
                          {isCorrect ? (
                            <Check className="text-white" size={14} />
                          ) : wasSkipped ? (
                            <span className="text-white text-xs">?</span>
                          ) : (
                            <X className="text-white" size={14} />
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{answer?.timeSpent || 0}s</div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="text-center">
                        <span className="text-lg font-bold text-gray-800">
                          {problem.number1} 
                          <span className={`mx-2 px-2 py-1 rounded text-white font-bold ${
                            problem.operator === '+' ? 'bg-blue-500' : 'bg-red-500'
                          }`}>
                            {problem.operator}
                          </span>
                          {problem.number2} = ?
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-gray-600">Bạn trả lời: </span>
                          <span className={`font-semibold ${
                            wasSkipped ? 'text-yellow-600' : 
                            isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {wasSkipped ? 'Bỏ qua' : (answer?.userAnswer !== null && answer?.userAnswer !== undefined ? answer.userAnswer : '—')}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-gray-600">Đáp án đúng: </span>
                          <span className="font-semibold text-green-600">{problem.correctAnswer}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto mt-8 space-y-4">
        <Button
          className="w-full bg-primary text-white py-4 rounded-2xl text-lg font-semibold shadow-lg transform transition-all hover:scale-105"
          onClick={handlePlayAgain}
        >
          <RotateCcw className="mr-2" size={20} />
          Chơi lại
        </Button>
        <Button
          variant="outline"
          className="w-full py-4 rounded-2xl text-lg font-semibold shadow-lg border border-gray-200 transform transition-all hover:scale-105"
          onClick={handleBackToHome}
        >
          <Home className="mr-2" size={20} />
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}
