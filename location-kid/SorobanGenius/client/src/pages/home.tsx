import { useQuery } from "@tanstack/react-query";
import { Calculator } from "lucide-react";
import DifficultyCard from "@/components/difficulty-card";
import { Card, CardContent } from "@/components/ui/card";
import type { GameStats } from "@shared/schema";

export default function Home() {
  const { data: stats } = useQuery<GameStats>({
    queryKey: ["/api/stats"],
  });

  const difficultyLevels = [
    {
      level: "beginner" as const,
      title: "Anh bạn nhỏ",
      description: "Bắt đầu với những phép tính đơn giản",
      badge: "Cộng trừ cơ bản",
      icon: "seedling",
      color: "green"
    },
    {
      level: "intermediate" as const,
      title: "Anh bạn lớn", 
      description: "Thử thách với số lớn hơn",
      badge: "Số 3-4 chữ số",
      icon: "star",
      color: "orange"
    },
    {
      level: "advanced" as const,
      title: "Ứng dụng mạnh mẽ",
      description: "Thách thức cho chuyên gia nhí",
      badge: "Phép tính phức tạp",
      icon: "rocket",
      color: "blue"
    }
  ];

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="text-center py-8">
        <div className="mb-4">
          <Calculator className="w-24 h-24 text-primary mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Soroban Math</h1>
        <p className="text-lg text-gray-600">Toán học thông minh cho trẻ em</p>
      </div>

      {/* Difficulty Levels */}
      <div className="max-w-md mx-auto space-y-4">
        {difficultyLevels.map((difficulty) => (
          <DifficultyCard
            key={difficulty.level}
            level={difficulty.level}
            title={difficulty.title}
            description={difficulty.description}
            badge={difficulty.badge}
            icon={difficulty.icon}
            color={difficulty.color}
          />
        ))}
      </div>

      {/* Statistics Card */}
      <div className="max-w-md mx-auto mt-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Thống kê của bạn</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats?.totalQuestions || 0}
                </div>
                <div className="text-sm text-gray-600">Câu hỏi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {stats?.correctAnswers || 0}
                </div>
                <div className="text-sm text-gray-600">Đúng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {stats?.accuracy ? `${Math.round(stats.accuracy)}%` : "0%"}
                </div>
                <div className="text-sm text-gray-600">Chính xác</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
