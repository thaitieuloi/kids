import { useEffect, useState } from 'react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
  onTick?: (timeRemaining: number) => void;
}

export default function Timer({ duration, onTimeUp, isRunning, onTick }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    setTimeRemaining(duration);
  }, [duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          if (newTime <= 0) {
            onTimeUp();
            return 0;
          }
          
          onTick?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, onTimeUp, onTick]);

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  return (
    <div className="text-center">
      <div className="text-sm text-gray-600">Thời gian</div>
      <div className={`text-lg font-semibold ${timeRemaining <= 5 ? 'text-error' : 'text-accent'}`}>
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
}
