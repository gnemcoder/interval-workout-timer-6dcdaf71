
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, SkipForward, Clock } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(formatTime(timeLeft));
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate progress percentage for the circular timer
  const progress = (timeLeft / initialSeconds) * 100;
  const circumference = 2 * Math.PI * 120; // Circle radius is 120px
  const dashOffset = circumference * (1 - progress / 100);
  const activeColor = isRest ? "#B3B3B3" : "#1DB954"; // Spotify gray for rest, Spotify green for run
  
  useEffect(() => {
    if (!isEditing) {
      setEditValue(formatTime(timeLeft));
    }
  }, [timeLeft, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTimeClick = () => {
    if (isPaused) {
      setIsEditing(true);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse the time value
    const [minutesStr, secondsStr] = editValue.split(':');
    const minutes = parseInt(minutesStr, 10) || 0;
    const seconds = parseInt(secondsStr, 10) || 0;
    const totalSeconds = minutes * 60 + seconds;
    
    // Calculate difference with current time
    const difference = totalSeconds - timeLeft;
    
    // Apply adjustment
    if (difference !== 0) {
      adjustTime(difference);
    }
    
    setIsEditing(false);
  };

  const handleBlur = () => {
    handleTimeSubmit({ preventDefault: () => {} } as React.FormEvent);
  };
  
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
          {!isEditing ? (
            <text 
              x="50%" 
              y="50%" 
              textAnchor="middle" 
              dy=".3em" 
              fontSize="60"
              fill="white"
              fontWeight="bold"
              cursor={isPaused ? "pointer" : "default"}
              onClick={handleTimeClick}
            >
              {formatTime(timeLeft)}
            </text>
          ) : (
            <foreignObject x="50" y="90" width="156" height="80">
              <form onSubmit={handleTimeSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={handleTimeChange}
                  onBlur={handleBlur}
                  pattern="[0-9]{2}:[0-9]{2}"
                  className="w-full h-full bg-transparent text-center text-white text-5xl font-bold border-none outline-none focus:ring-2 focus:ring-spotify-green"
                  style={{ background: 'rgba(0,0,0,0.3)' }}
                />
              </form>
            </foreignObject>
          )}
        </svg>
      </div>
      
      {/* Control buttons */}
      <div className="flex space-x-4 mb-6">
        {/* Stop button - dark gray circle */}
        <Button
          onClick={onStop}
          className="rounded-full w-16 h-16 bg-spotify-darkgray hover:bg-spotify-gray text-white"
        >
          <Square size={24} />
        </Button>
        
        {/* Pause/Play button - Spotify green circle */}
        <Button
          onClick={onPauseToggle}
          className="rounded-full w-16 h-16 bg-spotify-green hover:bg-spotify-green/90 text-black"
        >
          {isPaused ? (
            <Play size={24} fill="currentColor" />
          ) : (
            <Pause size={24} />
          )}
        </Button>
        
        {/* -15s button - dark gray circle */}
        <Button
          onClick={() => adjustTime(-15)}
          className="rounded-full w-16 h-16 bg-spotify-darkgray hover:bg-spotify-gray text-white font-bold"
        >
          -15
        </Button>
        
        {/* +15s button - dark gray circle */}
        <Button
          onClick={() => adjustTime(15)}
          className="rounded-full w-16 h-16 bg-spotify-darkgray hover:bg-spotify-gray text-white font-bold"
        >
          +15
        </Button>
      </div>
      
      {/* Skip to next button */}
      <Button
        onClick={skipToNextInterval}
        variant="ghost"
        className="text-spotify-lightgray hover:bg-spotify-darkgray"
      >
        <SkipForward size={16} className="mr-2" />
        Skip to Next
      </Button>
    </div>
  );
};

export default TimerDisplay;
export { formatTime };
