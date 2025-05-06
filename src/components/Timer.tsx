
import React from 'react';
import TimerHeader from './timer/TimerHeader';
import TimerDisplay from './timer/TimerDisplay';
import IntervalInfo from './timer/IntervalInfo';
import TimerControls from './timer/TimerControls';
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
    onComplete,
    onTimeUpdate,
    onTimeAdjust
  });

  const skipToNextInterval = () => {
    if (!isRunning || isPaused) return;
    onComplete();
  };

  return (
    <div className="w-full">
      <TimerHeader />
      
      <TimerDisplay 
        timeLeft={timeLeft}
        isPaused={isPaused}
        onPauseToggle={onPauseToggle}
      />
      
      <IntervalInfo
        isRest={isRest}
        runSeconds={runSeconds}
        restSeconds={restSeconds}
        currentInterval={currentInterval}
        totalIntervals={totalIntervals}
      />
      
      <TimerControls
        isRunning={isRunning}
        isPaused={isPaused}
        skipToNextInterval={skipToNextInterval}
        onStop={onStop}
        adjustTime={adjustTime}
      />
    </div>
  );
};

export default Timer;
