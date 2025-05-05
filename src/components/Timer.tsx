
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TimerProps {
  initialSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isRest: boolean;
  currentInterval: number;
  totalIntervals: number;
  onComplete: () => void;
  onStop: () => void;
  onPauseToggle: () => void;
}

const Timer: React.FC<TimerProps> = ({
  initialSeconds,
  isRunning,
  isPaused,
  isRest,
  currentInterval,
  totalIntervals,
  onComplete,
  onStop,
  onPauseToggle
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [dashOffset, setDashOffset] = useState(0);
  const circumference = 2 * Math.PI * 120; // Circle radius is 120
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/beep.mp3');
  }, []);

  // Reset timer when initialSeconds changes (switching between run/rest)
  useEffect(() => {
    setTimeLeft(initialSeconds);
    setDashOffset(0); // Reset circle progress
  }, [initialSeconds, isRest]);

  useEffect(() => {
    setDashOffset(circumference);
  }, [circumference]);

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
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, onComplete, isRest, initialSeconds]);

  useEffect(() => {
    if (isRunning) {
      const newOffset = circumference - (timeLeft / initialSeconds) * circumference;
      setDashOffset(newOffset);
    }
  }, [timeLeft, initialSeconds, circumference, isRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const activityType = isRest ? 'Rest' : 'Run';
  const colorClass = isRest ? 'text-blue-400' : 'text-spotify-green';
  const ringColorClass = isRest ? 'stroke-blue-400' : 'stroke-spotify-green';

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="text-center mb-4">
        <h2 className="text-xl font-medium text-white">
          Interval {currentInterval} of {totalIntervals}
        </h2>
        <p className={`text-lg font-medium ${colorClass}`}>{activityType}</p>
      </div>

      <div className="relative w-64 h-64">
        {/* Background Circle */}
        <svg className="w-full h-full" viewBox="0 0 256 256">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="transparent"
            strokeWidth="8"
            stroke="#282828"
          />
          {/* Progress Circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="transparent"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={`progress-ring-circle ${ringColorClass}`}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-white text-5xl font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={onPauseToggle}
          className="bg-spotify-gray hover:bg-spotify-gray/80 text-white rounded-full w-12 h-12 flex items-center justify-center"
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </Button>
        <Button
          onClick={onStop}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center"
        >
          <Square size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Timer;
