
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
  } = useInterval();

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-spotify-darkblack flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mb-8">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Stride Sync</h1>
        <p className="text-spotify-lightgray text-center">Interval Running Tracker</p>
      </div>

      {!state.isRunning && !state.isComplete && (
        <IntervalForm onStart={(run, rest, iterations) => startSession(run, rest, iterations)} />
      )}

      {state.isRunning && (
        <div className="glass-card p-6 rounded-xl space-y-8 max-w-md w-full">
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
          />
        </div>
      )}

      {state.isComplete && (
        <SessionSummary
          runMinutes={state.runSeconds / 60}
          restMinutes={state.restSeconds / 60}
          iterations={state.iterations}
          totalTime={getTotalTime()}
          onReset={resetSession}
        />
      )}
      
      <footer className="mt-8 text-xs text-spotify-lightgray">
        <p>© {new Date().getFullYear()} Stride Sync. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
