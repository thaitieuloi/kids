import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  duration: number; // in seconds
  onTimeUp: () => void;
  isPaused: boolean;
}

export default function Timer({ duration, onTimeUp, isPaused }: Props) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout>();
  const hasCalledTimeUp = useRef(false);

  useEffect(() => {
    setTimeLeft(duration);
    hasCalledTimeUp.current = false;
  }, [duration]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (!hasCalledTimeUp.current) {
              hasCalledTimeUp.current = true;
              onTimeUp();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, timeLeft, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (timeLeft <= 5) return '#EF4444'; // Red
    if (timeLeft <= 10) return '#F59E0B'; // Yellow
    return '#10B981'; // Green
  };

  const getProgressPercentage = (): number => {
    return (timeLeft / duration) * 100;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <View style={styles.progressRing}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${getProgressPercentage()}%`,
                backgroundColor: getTimerColor(),
              }
            ]} 
          />
        </View>
        <Text style={[styles.timeText, { color: getTimerColor() }]}>
          {formatTime(timeLeft)}
        </Text>
      </View>
      
      {isPaused && (
        <Text style={styles.pausedText}>⏸ Đã tạm dừng</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressRing: {
    width: 120,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 1s ease-in-out',
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  pausedText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
    marginTop: 4,
  },
});