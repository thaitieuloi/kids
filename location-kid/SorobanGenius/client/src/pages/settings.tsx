import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Minus, Plus, Play, Sprout, Star, Rocket } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { GameSettings, DifficultyLevel, GameSession } from "@shared/schema";

export default function Settings() {
  const { level } = useParams<{ level: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<GameSettings>({
    questionCount: 10,
    rowCount: 3,
    timeLimit: 30,
    numberRange: level === "beginner" ? 100 : level === "intermediate" ? 1000 : 10000,
    feedbackSound: true,
    numberReading: false,
    transitionSound: true,
    difficulty: (level as DifficultyLevel) || "beginner"
  });

  const startGameMutation = useMutation({
    mutationFn: async (gameSettings: GameSettings) => {
      const response = await apiRequest("POST", "/api/game/start", gameSettings);
      return response.json() as Promise<GameSession>;
    },
    onSuccess: (session) => {
      setLocation(`/game/${session.id}`);
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể bắt đầu trò chơi. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  });

  const levelInfo = {
    beginner: {
      name: "Anh bạn nhỏ",
      description: "Cấp độ dễ",
      icon: Sprout,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    intermediate: {
      name: "Anh bạn lớn", 
      description: "Cấp độ trung bình",
      icon: Star,
      color: "text-orange-600",
      bg: "bg-orange-100"
    },
    advanced: {
      name: "Ứng dụng mạnh mẽ",
      description: "Cấp độ khó",
      icon: Rocket,
      color: "text-blue-600",
      bg: "bg-blue-100"
    }
  };

  const currentLevel = levelInfo[level as keyof typeof levelInfo] || levelInfo.beginner;
  const IconComponent = currentLevel.icon;

  const updateSetting = (key: keyof GameSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const adjustNumber = (key: keyof GameSettings, delta: number, min: number, max: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: Math.max(min, Math.min(max, (prev[key] as number) + delta))
    }));
  };

  const handleStartGame = () => {
    startGameMutation.mutate(settings);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full shadow-md"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">Cài đặt</h2>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Level Info */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 ${currentLevel.bg} rounded-full flex items-center justify-center`}>
                <IconComponent className={`${currentLevel.color}`} size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{currentLevel.name}</h3>
                <p className="text-sm text-gray-600">{currentLevel.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Form */}
        <div className="space-y-4">
          {/* Number of Questions */}
          <Card className="shadow-md">
            <CardContent className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Số câu hỏi</label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={() => adjustNumber("questionCount", -1, 1, 50)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold text-gray-800 min-w-[3rem] text-center">
                  {settings.questionCount}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={() => adjustNumber("questionCount", 1, 1, 50)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Number of Rows */}
          <Card className="shadow-md">
            <CardContent className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Số dòng (Soroban)</label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={() => adjustNumber("rowCount", -1, 1, 10)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold text-gray-800 min-w-[3rem] text-center">
                  {settings.rowCount}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={() => adjustNumber("rowCount", 1, 1, 10)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Time Limit */}
          <Card className="shadow-md">
            <CardContent className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Thời gian mỗi câu (giây)</label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={() => adjustNumber("timeLimit", -5, 5, 300)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold text-gray-800 min-w-[3rem] text-center">
                  {settings.timeLimit}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={() => adjustNumber("timeLimit", 5, 5, 300)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Number Range */}
          <Card className="shadow-md">
            <CardContent className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Giới hạn số</label>
              <Select
                value={settings.numberRange.toString()}
                onValueChange={(value) => updateSetting("numberRange", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Dưới 10</SelectItem>
                  <SelectItem value="100">Dưới 100</SelectItem>
                  <SelectItem value="1000">Dưới 1,000</SelectItem>
                  <SelectItem value="10000">Dưới 10,000</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card className="shadow-md">
            <CardContent className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Cài đặt âm thanh</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Âm thanh phản hồi</span>
                  <Switch
                    checked={settings.feedbackSound}
                    onCheckedChange={(checked) => updateSetting("feedbackSound", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Đọc số</span>
                  <Switch
                    checked={settings.numberReading}
                    onCheckedChange={(checked) => updateSetting("numberReading", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Âm thanh chuyển đổi</span>
                  <Switch
                    checked={settings.transitionSound}
                    onCheckedChange={(checked) => updateSetting("transitionSound", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Start Button */}
        <Button
          className="w-full bg-primary text-white py-4 rounded-2xl text-lg font-semibold mt-8 shadow-lg transform transition-all hover:scale-105 active:scale-95"
          onClick={handleStartGame}
          disabled={startGameMutation.isPending}
        >
          <Play className="mr-2" size={20} />
          {startGameMutation.isPending ? "Đang tạo..." : "Bắt đầu chơi"}
        </Button>
      </div>
    </div>
  );
}
