import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Pause, Forward, Check, ChevronsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SorobanDisplay from '@/components/soroban-display';
import Timer from '@/components/timer';
import { useGameState } from '@/hooks/use-game-state';
import { useAudio } from '@/hooks/use-audio';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { GameSession } from '@shared/schema';

export default function Game() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isPaused, setIsPaused] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const { data: session, isLoading } = useQuery<GameSession>({
    queryKey: ["/api/game", sessionId],
    enabled: !!sessionId
  });

  const updateSessionMutation = useMutation({
    mutationFn: async (updatedSession: GameSession) => {
      const response = await apiRequest("PUT", `/api/game/${sessionId}`, updatedSession);
      return response.json() as Promise<GameSession>;
    }
  });

  // Always call hooks, but handle null session in the hook itself
  const gameState = useGameState(session);
  const audio = useAudio(session?.settings);

  const {
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
    pauseTimer,
    resumeTimer
  } = gameState;

  useEffect(() => {
    if (session?.settings.transitionSound && currentQuestionIndex > 0) {
      audio.playTransition();
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (session && answers.length === session.problems.length && answers.length > 0 && !gameCompleted && !updateSessionMutation.isPending) {
      // Game completed - all questions answered
      setGameCompleted(true);
      
      const updatedSession = {
        ...session,
        answers: answers.map(answer => ({
          problemId: answer.problemId,
          userAnswer: answer.userAnswer,
          timeSpent: answer.timeSpent,
          isCorrect: answer.isCorrect,
          skipped: answer.skipped
        })),
        endTime: new Date(),
        score: answers.filter(a => a.isCorrect).length,
        totalTime: answers.reduce((total, a) => total + a.timeSpent, 0)
      };

      updateSessionMutation.mutate(updatedSession, {
        onSuccess: () => {
          // Invalidate the session cache to ensure fresh data on results page
          queryClient.invalidateQueries({ queryKey: ["/api/game", sessionId] });
          setTimeout(() => {
            setLocation(`/results/${sessionId}`);
          }, 100); // Small delay to ensure cache is cleared
        },
        onError: (error) => {
          console.error('Failed to save game results:', error);
          // Still go to results page even if save fails
          setLocation(`/results/${sessionId}`);
        }
      });
    }
  }, [answers, session, sessionId, updateSessionMutation, setLocation, gameCompleted]);

  const handleSubmitAnswer = () => {
    const numAnswer = parseInt(userAnswer);
    if (isNaN(numAnswer)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập một số hợp lệ",
        variant: "destructive"
      });
      return;
    }

    if (submitAnswer) {
      const result = submitAnswer(numAnswer);
      if (result) {
        if (result.isCorrect) {
          audio.playCorrect();
        } else {
          audio.playIncorrect();
        }
      }
    }
  };

  const handleSkipQuestion = () => {
    if (skipQuestion) {
      skipQuestion();
      audio.playTransition();
    }
  };

  const handleTimeUp = () => {
    if (submitAnswer) {
      submitAnswer(null, true);
      audio.playIncorrect();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    if (pauseTimer) pauseTimer();
  };

  const handleResume = () => {
    setIsPaused(false);
    if (resumeTimer) resumeTimer();
  };

  const handleQuit = () => {
    setLocation("/");
  };

  const handleReadNumbers = () => {
    if (currentProblem) {
      audio.speakNumber(currentProblem.number1);
      setTimeout(() => audio.speakNumber(currentProblem.number2), 1000);
    }
  };

  if (isLoading || !session || !currentProblem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full shadow-md"
          onClick={handlePause}
        >
          <Pause className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <div className="text-sm text-gray-600">Câu hỏi</div>
          <div className="text-lg font-semibold">{(currentQuestionIndex || 0) + 1}</div>
          <div className="text-sm text-gray-600">/ {session.problems.length}</div>
        </div>
        <Timer
          duration={session.settings.timeLimit}
          onTimeUp={handleTimeUp}
          isRunning={(isTimerRunning ?? true) && !isPaused}
        />
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Soroban Display */}
      <div className="max-w-md mx-auto mb-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-center text-lg font-semibold text-gray-800 mb-6">Phép tính</h3>
            
            <div className="space-y-4">
              {/* First Number */}
              <SorobanDisplay number={currentProblem.number1} columns={session.settings.rowCount} />
              
              {/* Operation */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-white text-3xl font-bold shadow-lg ${
                  currentProblem.operator === '+' 
                    ? 'bg-blue-500 border-4 border-blue-600' 
                    : 'bg-red-500 border-4 border-red-600'
                }`}>
                  {currentProblem.operator}
                </div>
              </div>

              {/* Second Number */}
              <SorobanDisplay number={currentProblem.number2} columns={session.settings.rowCount} />

              {/* Equals */}
              <div className="text-center">
                <span className="text-3xl font-bold text-gray-800">=</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Answer Input */}
      <div className="max-w-md mx-auto mb-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <label className="block text-center text-lg font-semibold text-gray-800 mb-4">
              Kết quả của bạn
            </label>
            <Input
              type="number"
              className="text-center text-3xl font-bold p-4 border-2"
              placeholder="?"
              value={userAnswer || ''}
              onChange={(e) => setUserAnswer && setUserAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmitAnswer();
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
        <Button
          variant="secondary"
          className="py-3 px-6 rounded-xl font-semibold shadow-lg"
          onClick={handleSkipQuestion}
        >
          <Forward className="mr-2 h-4 w-4" />
          Bỏ qua
        </Button>
        <Button
          className="bg-primary text-white py-3 px-6 rounded-xl font-semibold shadow-lg"
          onClick={handleSubmitAnswer}
          disabled={!userAnswer?.trim()}
        >
          <Check className="mr-2 h-4 w-4" />
          Trả lời
        </Button>
      </div>

      {/* Audio Controls */}
      {session.settings.numberReading && (
        <div className="max-w-md mx-auto mt-6 text-center">
          <Button
            variant="outline"
            className="bg-accent text-white px-4 py-2 rounded-lg shadow-md"
            onClick={handleReadNumbers}
          >
            <ChevronsUp className="mr-2 h-4 w-4" />
            Đọc số
          </Button>
        </div>
      )}

      {/* Pause Modal */}
      <Dialog open={isPaused} onOpenChange={setIsPaused}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              <Pause className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              Tạm dừng
            </DialogTitle>
            <p className="text-center text-gray-600">Bạn có muốn tiếp tục?</p>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Button className="w-full" onClick={handleResume}>
              Tiếp tục
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleQuit}>
              Kết thúc
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
