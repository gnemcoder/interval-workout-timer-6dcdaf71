
import React from 'react';
import TimerHeader from './timer/TimerHeader';
import TimerDisplay from './timer/TimerDisplay';
import IntervalInfo from './timer/IntervalInfo';
import ProgressBar from './ProgressBar';
import { useTimerLogic } from './timer/useTimerLogic';

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
  const { timeLeft, adjustTime } = useTimerLogic({
    initialSeconds,
    isRunning,
    isPaused,
    isRest, // Pass isRest to useTimerLogic
    onComplete,
    onTimeUpdate,
    onTimeAdjust
  });

  const skipToNextInterval = () => {
    if (!isRunning || isPaused) return;
    onComplete();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <TimerHeader />
      
      <div className="w-full max-w-lg bg-spotify-black rounded-2xl p-8 shadow-xl border border-spotify-gray/30">
        <ProgressBar 
          currentInterval={currentInterval} 
          totalIntervals={totalIntervals}
          isRest={isRest}
        />
        
        <IntervalInfo
          isRest={isRest}
          currentInterval={currentInterval}
          totalIntervals={totalIntervals}
        />
        
        <TimerDisplay
          timeLeft={timeLeft}
          isPaused={isPaused}
          onPauseToggle={onPauseToggle}
          skipToNextInterval={skipToNextInterval}
          onStop={onStop}
          adjustTime={adjustTime}
          initialSeconds={initialSeconds}
          isRest={isRest}
        />
      </div>
    </div>
  );
};

export default Timer;
