
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TimerDisplayProps {
  timeLeft: number;
  isPaused: boolean;
  onPauseToggle: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  isPaused,
  onPauseToggle
}) => {
  return (
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
  );
};

export default TimerDisplay;
export { formatTime };
