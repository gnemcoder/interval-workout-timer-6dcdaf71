
import React from 'react';
import { Play, Pause, Square, SkipForward } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TimerDisplayProps {
  timeLeft: number;
  isPaused: boolean;
  onPauseToggle: () => void;
  skipToNextInterval: () => void;
  onStop: () => void;
  adjustTime: (seconds: number) => void;
  initialSeconds: number;
  isRest: boolean;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  isPaused,
  initialSeconds,
  onPauseToggle,
  skipToNextInterval,
  onStop,
  adjustTime,
  isRest
}) => {
  // Calculate progress percentage for the circular timer
  const progress = (timeLeft / initialSeconds) * 100;
  const circumference = 2 * Math.PI * 120; // Circle radius is 120px
  const dashOffset = circumference * (1 - progress / 100);
  const activeColor = isRest ? "#9333EA" : "#22c55e"; // Purple for rest, green for run
  
  return (
    <div className="flex flex-col items-center">
      {/* Circular timer */}
      <div className="relative w-64 h-64 mb-10">
        <svg className="w-full h-full" viewBox="0 0 256 256">
          <circle 
            cx="128" 
            cy="128" 
            r="120" 
            fill="transparent" 
            stroke="#333" 
            strokeWidth="8"
          />
          <circle 
            cx="128" 
            cy="128" 
            r="120" 
            fill="transparent" 
            stroke={activeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 128 128)"
            className="transition-all duration-300"
          />
          <text 
            x="50%" 
            y="50%" 
            textAnchor="middle" 
            dy=".3em" 
            fontSize="60"
            fill="white"
            fontWeight="bold"
          >
            {formatTime(timeLeft)}
          </text>
        </svg>
      </div>
      
      {/* Control buttons */}
      <div className="flex space-x-4 mb-6">
        {/* Pause/Stop button - dark gray circle */}
        <Button
          onClick={onStop}
          className="rounded-full w-16 h-16 bg-gray-800 hover:bg-gray-700 text-white"
        >
          <Square size={24} />
        </Button>
        
        {/* Pause/Play button - red circle */}
        <Button
          onClick={onPauseToggle}
          className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 text-white"
        >
          {isPaused ? (
            <Play size={24} fill="currentColor" />
          ) : (
            <Pause size={24} />
          )}
        </Button>
        
        {/* -15s button - purple circle */}
        <Button
          onClick={() => adjustTime(-15)}
          className="rounded-full w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          -15
        </Button>
        
        {/* +15s button - purple circle */}
        <Button
          onClick={() => adjustTime(15)}
          className="rounded-full w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          +15
        </Button>
      </div>
      
      {/* Skip to next button */}
      <Button
        onClick={skipToNextInterval}
        variant="ghost"
        className="text-white hover:bg-gray-800"
      >
        <SkipForward size={16} className="mr-2" />
        Skip to Next
      </Button>
    </div>
  );
};

export default TimerDisplay;
export { formatTime };
