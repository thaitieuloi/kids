import { Link } from "wouter";
import { Sprout, Star, Rocket, ChevronRight } from "lucide-react";
import type { DifficultyLevel } from "@shared/schema";

interface DifficultyCardProps {
  level: DifficultyLevel;
  title: string;
  description: string;
  badge: string;
  icon: string;
  color: string;
}

const iconMap = {
  seedling: Sprout,
  star: Star,
  rocket: Rocket,
};

const colorMap = {
  green: {
    border: "border-l-green-400",
    bg: "bg-green-100",
    icon: "text-green-600",
    badge: "bg-green-100 text-green-800"
  },
  orange: {
    border: "border-l-orange-400", 
    bg: "bg-orange-100",
    icon: "text-orange-600",
    badge: "bg-orange-100 text-orange-800"
  },
  blue: {
    border: "border-l-blue-400",
    bg: "bg-blue-100", 
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-800"
  }
};

export default function DifficultyCard({ 
  level, 
  title, 
  description, 
  badge, 
  icon, 
  color 
}: DifficultyCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap];
  const colors = colorMap[color as keyof typeof colorMap];

  return (
    <Link to={`/settings/${level}`}>
      <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${colors.border} transform transition-all hover:scale-105 cursor-pointer`}>
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center`}>
            <IconComponent className={`text-2xl ${colors.icon}`} size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600">{description}</p>
            <div className="flex items-center mt-2">
              <span className={`text-sm px-2 py-1 rounded-full ${colors.badge}`}>
                {badge}
              </span>
            </div>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </div>
      </div>
    </Link>
  );
}
