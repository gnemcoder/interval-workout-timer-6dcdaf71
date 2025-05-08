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
import { initSounds } from "@/utils/soundEffects";

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
  const [lastSession, setLastSession] = useState({
    runMinutes: 5, // Default values
    restMinutes: 2,
    iterations: 5
  });
  const [isLoadingLastSession, setIsLoadingLastSession] = useState(false);

  // Initialize sounds when component mounts
  useEffect(() => {
    // Initialize sound system with mobile optimizations
    const setupSounds = async () => {
      try {
        await initSounds();
        console.log('Sound system initialized successfully');
        
        // Attempt to play a silent sound on first user interaction
        const handleFirstInteraction = () => {
          // Create and play a silent sound to unlock audio on iOS
          const silentSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAFgAD///////////////////////////////////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQCkAAAAAAAAABYw5duImfIAAAAAAAAAAAAAAAAAAAA");
          silentSound.volume = 0.01;
          
          // These properties are critical for iOS audio mixing
          silentSound.setAttribute('playsinline', '');
          silentSound.setAttribute('webkit-playsinline', '');
          
          silentSound.play().then(() => {
            console.log('Silent sound played successfully - audio unlocked');
          }).catch(e => {
            console.warn('Could not play silent sound:', e);
          });
          
          // Remove the listeners after first interaction
          ['touchstart', 'touchend', 'click', 'keydown'].forEach(event => {
            document.removeEventListener(event, handleFirstInteraction);
          });
        };
        
        // Add listeners for first user interaction
        ['touchstart', 'touchend', 'click', 'keydown'].forEach(event => {
          document.addEventListener(event, handleFirstInteraction, { once: true });
        });
      } catch (error) {
        console.error('Failed to initialize sound system:', error);
      }
    };
    
    setupSounds();
    
    // Setup visibility change handler for iOS background mode
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('App became visible, reinitializing sounds...');
        setupSounds();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      ['touchstart', 'touchend', 'click', 'keydown'].forEach(event => {
        document.removeEventListener(event, () => {});
      });
    };
  }, []);

  // Fetch user's last session settings
  useEffect(() => {
    const fetchLastSession = async () => {
      if (!user) return;
      
      try {
        setIsLoadingLastSession(true);
        
        const { data, error } = await supabase
          .from("sessions")
          .select("run_seconds, rest_seconds, iterations")
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching last session:", error);
        } else if (data && data.length > 0) {
          setLastSession({
            runMinutes: data[0].run_seconds / 60,
            restMinutes: data[0].rest_seconds / 60,
            iterations: data[0].iterations
          });
        }
      } catch (error) {
        console.error("Error in fetching last session:", error);
      } finally {
        setIsLoadingLastSession(false);
      }
    };

    fetchLastSession();
  }, [user]);

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

  // Simplify start session function (removed sound playing)
  const handleStartSession = (run: number, rest: number, iterations: number) => {
    startSession(run, rest, iterations);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {!state.isRunning && !state.isComplete && (
            <IntervalForm 
              onStart={(run, rest, iterations) => handleStartSession(run, rest, iterations)} 
              defaultRunMinutes={lastSession.runMinutes}
              defaultRestMinutes={lastSession.restMinutes}
              defaultRounds={lastSession.iterations}
            />
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
