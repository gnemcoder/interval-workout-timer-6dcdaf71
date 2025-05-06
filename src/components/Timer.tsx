
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, Square, SkipForward } from 'lucide-react';
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
  onTimeAdjust?: (seconds: number) => void;
  onTimeUpdate?: (seconds: number) => void;
  runSeconds?: number;
  restSeconds?: number;
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
  onPauseToggle,
  onTimeAdjust,
  onTimeUpdate,
  runSeconds = 0,
  restSeconds = 0
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/beep.mp3');
  }, []);

  // Reset timer when initialSeconds changes (switching between run/rest)
  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds, isRest]);

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
  }, [isRunning, isPaused, onComplete, onTimeUpdate, isRest, initialSeconds]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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

  const skipToNextInterval = () => {
    if (!isRunning || isPaused) return;
    onComplete();
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Interval Timer</h1>
      </div>
      
      <div className="text-center mb-12">
        <div className="text-8xl font-bold text-white mb-8">
          {formatTime(timeLeft)}
        </div>
        
        <Button
          onClick={onPauseToggle}
          className="rounded-full w-20 h-20 bg-white hover:bg-white/90 text-red-500"
        >
          {isPaused ? (
            <Play size={32} fill="currentColor" />
          ) : (
            <Pause size={32} />
          )}
        </Button>
      </div>
      
      <div className="space-y-4 mt-8">
        {/* Work interval - Light green box */}
        <div className={`${isRest ? 'bg-[#e8f8e8]' : 'bg-green-500/10 border-2 border-green-500'} rounded-xl p-4 flex items-center`}>
          <div className="bg-[#c2ecc2] rounded-full p-2 mr-4">
            <Play size={24} className="text-green-600" />
          </div>
          <div className="flex-grow">
            <span className="font-medium text-gray-800">
              Work
            </span>
          </div>
          <div className="text-right">
            <span className="text-green-600 text-xl font-bold">
              {formatTime(runSeconds)}
            </span>
          </div>
        </div>
        
        {/* Rest Time - Light red box */}
        <div className={`${isRest ? 'bg-red-500/10 border-2 border-red-500' : 'bg-[#ffe8e8]'} rounded-xl p-4 flex items-center`}>
          <div className="bg-[#ffcaca] rounded-full p-2 mr-4">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            </div>
          </div>
          <div className="flex-grow">
            <span className="font-medium text-gray-800">
              Rest
            </span>
          </div>
          <div className="text-right">
            <span className="text-red-500 text-xl font-bold">
              {formatTime(restSeconds)}
            </span>
          </div>
        </div>
        
        {/* Exercises - Light gray box */}
        <div className="bg-[#f0f0f0] rounded-xl p-4 flex items-center">
          <div className="bg-[#e0e0e0] rounded-full p-2 mr-4">
            <div className="w-6 h-6 flex items-center justify-center text-gray-500">
              ⚡
            </div>
          </div>
          <div className="flex-grow">
            <span className="font-medium text-gray-800">
              Exercises
            </span>
          </div>
          <div className="text-right text-xl font-bold text-gray-500">
            <span>1</span>
          </div>
        </div>
        
        {/* Rounds - Light blue box */}
        <div className="bg-[#e8ecff] rounded-xl p-4 flex items-center">
          <div className="bg-[#d0d8ff] rounded-full p-2 mr-4">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.665 3 16"></path>
                <path d="M2 12C2 6 6.39 2 11.806 2 16.209 2 19.76 4.335 21 8"></path>
                <path d="M7 17l-4-1h4"></path>
                <path d="M17 7l4 1h-4"></path>
              </svg>
            </div>
          </div>
          <div className="flex-grow">
            <span className="font-medium text-gray-800">
              Rounds
            </span>
          </div>
          <div className="text-right">
            <span className="text-blue-600 text-xl font-bold">
              {currentInterval}/{totalIntervals}X
            </span>
          </div>
        </div>
        
        {/* Controls */}
        <div className="mt-6 flex justify-center space-x-4">
          <Button
            onClick={skipToNextInterval}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full w-12 h-12 flex items-center justify-center"
          >
            <SkipForward size={20} />
          </Button>
          
          <Button
            onClick={onStop}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full w-12 h-12 flex items-center justify-center"
          >
            <Square size={20} />
          </Button>
          
          <Button
            onClick={() => adjustTime(-15)}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full w-12 h-12 flex items-center justify-center"
          >
            <span>-15s</span>
          </Button>
          
          <Button
            onClick={() => adjustTime(15)}
            className="bg-white/20 hover:bg-white/30 text-white rounded-full w-12 h-12 flex items-center justify-center"
          >
            <span>+15s</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
