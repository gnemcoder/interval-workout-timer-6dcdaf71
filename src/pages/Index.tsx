
import { useState } from "react";
import IntervalForm from "@/components/IntervalForm";
import Timer from "@/components/Timer";
import ProgressBar from "@/components/ProgressBar";
import SessionSummary from "@/components/SessionSummary";
import { useInterval } from "@/hooks/useInterval";

const Index = () => {
  const {
    state,
    startSession,
    completeInterval,
    stopSession,
    togglePause,
    resetSession,
    getTotalTime,
    getRunTime,
    getRestTime,
    updateActualTime,
    updateCurrentIntervalElapsed,
  } = useInterval();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ff5f6d] to-[#ffc371] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {!state.isRunning && !state.isComplete && (
          <IntervalForm onStart={(run, rest, iterations) => startSession(run, rest, iterations)} />
        )}

        {state.isRunning && (
          <div className="w-full">
            <ProgressBar
              currentInterval={state.currentInterval}
              totalIntervals={state.iterations}
              isRest={state.isRest}
            />

            <Timer
              initialSeconds={state.initialSeconds}
              isRunning={state.isRunning}
              isPaused={state.isPaused}
              isRest={state.isRest}
              currentInterval={state.currentInterval}
              totalIntervals={state.iterations}
              onComplete={completeInterval}
              onStop={stopSession}
              onPauseToggle={togglePause}
              onTimeAdjust={updateActualTime}
              onTimeUpdate={updateCurrentIntervalElapsed}
            />
          </div>
        )}

        {state.isComplete && (
          <SessionSummary
            runMinutes={state.runSeconds / 60}
            restMinutes={state.restSeconds / 60}
            iterations={state.iterations}
            totalTime={getTotalTime()}
            actualRunTime={getRunTime()}
            actualRestTime={getRestTime()}
            onReset={resetSession}
          />
        )}
      </div>
      
      <footer className="mt-8 text-xs text-white/70">
        <p>© {new Date().getFullYear()} Stride Sync. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
