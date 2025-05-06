
import React from 'react';
import { SkipForward, Square } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  skipToNextInterval: () => void;
  onStop: () => void;
  adjustTime: (seconds: number) => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  skipToNextInterval,
  onStop,
  adjustTime
}) => {
  return (
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
  );
};

export default TimerControls;
