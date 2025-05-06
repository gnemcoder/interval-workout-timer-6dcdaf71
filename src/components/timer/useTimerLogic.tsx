
import { useState, useRef, useEffect } from 'react';

interface UseTimerLogicProps {
  initialSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  onComplete: () => void;
  onTimeUpdate?: (seconds: number) => void;
  onTimeAdjust?: (seconds: number) => void;
}

export const useTimerLogic = ({
  initialSeconds,
  isRunning,
  isPaused,
  onComplete,
  onTimeUpdate,
  onTimeAdjust
}: UseTimerLogicProps) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/beep.mp3');
  }, []);

  // Reset timer when initialSeconds changes (switching between run/rest)
  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            if (audioRef.current) {
              audioRef.current.play();
            }
            setTimeout(() => onComplete(), 1000);
            return 0;
          }
          
          // Update the elapsed time in the parent component
          if (onTimeUpdate) {
            onTimeUpdate(1); // 1 second has passed
          }
          
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, onComplete, onTimeUpdate]);

  const adjustTime = (seconds: number) => {
    if (!isRunning || isPaused) return;
    
    setTimeLeft((prevTime) => {
      const newTime = Math.max(1, prevTime + seconds);
      return newTime;
    });
    
    // Notify parent component about time adjustment
    if (onTimeAdjust) {
      onTimeAdjust(seconds);
    }
  };

  return {
    timeLeft,
    adjustTime
  };
};
