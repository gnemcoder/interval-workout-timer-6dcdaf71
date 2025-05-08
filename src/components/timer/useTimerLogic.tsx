
import { useState, useRef, useEffect } from 'react';
import { playBeepSound } from '../../utils/sounds';

interface UseTimerLogicProps {
  initialSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isRest: boolean;
  onComplete: () => void;
  onTimeUpdate?: (seconds: number) => void;
  onTimeAdjust?: (seconds: number) => void;
}

export const useTimerLogic = ({
  initialSeconds,
  isRunning,
  isPaused,
  isRest,
  onComplete,
  onTimeUpdate,
  onTimeAdjust
}: UseTimerLogicProps) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const intervalRef = useRef<number | null>(null);
  const initialRenderRef = useRef(true);

  // Reset timer when initialSeconds changes (switching between run/rest)
  useEffect(() => {
    setTimeLeft(initialSeconds);
    initialRenderRef.current = false;
  }, [initialSeconds, isRest]);

  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (isRunning && !isPaused) {
      console.log(`Timer started: ${timeLeft} seconds, isRest: ${isRest}`);
      
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          // Play countdown sounds in the last 3 seconds
          if (prevTime <= 4 && prevTime > 1) {
            // Only play sounds for the last 3 seconds (3, 2, 1)
            console.log(`Countdown: ${prevTime-1}s remaining`);
            playBeepSound();
          }
          
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            // Final beep for interval completion
            console.log("Interval complete, playing final beep");
            playBeepSound();
            setTimeout(() => {
              console.log("Calling onComplete callback");
              onComplete();
            }, 1000);
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
      console.log(`Time adjusted by ${seconds} seconds: ${prevTime} → ${newTime}`);
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
