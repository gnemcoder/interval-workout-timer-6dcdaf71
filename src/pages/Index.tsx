
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import IntervalForm from "@/components/IntervalForm";
import Timer from "@/components/Timer";
import SessionSummary from "@/components/SessionSummary";
import { useInterval } from "@/hooks/useInterval";
import Header from "@/components/Header";
import { toast } from "sonner";

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
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessionSaved, setSessionSaved] = useState(false);

  // Save completed session to Supabase
  useEffect(() => {
    const saveSession = async () => {
      if (state.isComplete && user && !sessionSaved) {
        try {
          const totalTime = getTotalTime();
          const actualRunTime = getRunTime();
          const actualRestTime = getRestTime();

          const { error } = await supabase.from("sessions").insert({
            user_id: user.id,
            iterations: state.iterations,
            run_seconds: state.runSeconds,
            rest_seconds: state.restSeconds,
            total_time: Math.round(totalTime * 60),
            actual_run_time: Math.round(actualRunTime * 60),
            actual_rest_time: Math.round(actualRestTime * 60)
          });

          if (error) {
            console.error("Error saving session:", error);
            toast.error("Failed to save your workout session");
          } else {
            setSessionSaved(true);
            toast.success("Workout session saved successfully!");
          }
        } catch (error) {
          console.error("Error in session save:", error);
        }
      }
    };

    saveSession();
  }, [state.isComplete, user, sessionSaved, state.iterations, state.runSeconds, state.restSeconds, getTotalTime, getRunTime, getRestTime]);

  // Reset session saved flag when starting a new session
  useEffect(() => {
    if (!state.isComplete) {
      setSessionSaved(false);
    }
  }, [state.isComplete]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {!state.isRunning && !state.isComplete && (
            <IntervalForm onStart={(run, rest, iterations) => startSession(run, rest, iterations)} />
          )}

          {state.isRunning && (
            <div className="w-full">
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
                runSeconds={state.runSeconds}
                restSeconds={state.restSeconds}
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
      </div>
      
      <footer className="mt-8 text-xs text-center text-gray-600 pb-4">
        <p>© {new Date().getFullYear()} Stride Sync. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
