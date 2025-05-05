
import { useState, useRef } from 'react';

interface IntervalState {
  isRunning: boolean;
  isPaused: boolean;
  isRest: boolean;
  currentInterval: number;
  runSeconds: number;
  restSeconds: number;
  iterations: number;
  initialSeconds: number;
  isComplete: boolean;
  actualRunSeconds: number;
  actualRestSeconds: number;
  currentIntervalElapsed: number; // Track elapsed time in current interval
}

export const useInterval = () => {
  const [state, setState] = useState<IntervalState>({
    isRunning: false,
    isPaused: false,
    isRest: false,
    currentInterval: 1,
    runSeconds: 0,
    restSeconds: 0,
    iterations: 0,
    initialSeconds: 0,
    isComplete: false,
    actualRunSeconds: 0,
    actualRestSeconds: 0,
    currentIntervalElapsed: 0,
  });

  // Use ref to track elapsed time since the last reset of the timer
  const elapsedTimeRef = useRef<number>(0);

  const startSession = (runMinutes: number, restMinutes: number, iterations: number) => {
    const runSeconds = Math.round(runMinutes * 60);
    const restSeconds = Math.round(restMinutes * 60);
    
    setState({
      isRunning: true,
      isPaused: false,
      isRest: false,
      currentInterval: 1,
      runSeconds,
      restSeconds,
      iterations,
      initialSeconds: runSeconds,
      isComplete: false,
      actualRunSeconds: 0,
      actualRestSeconds: 0,
      currentIntervalElapsed: 0,
    });
    
    elapsedTimeRef.current = 0;
  };

  const completeInterval = () => {
    setState(prevState => {
      // Calculate the actual time spent in current interval (in seconds)
      const elapsedSeconds = prevState.initialSeconds - prevState.currentIntervalElapsed;
      
      if (prevState.isRest) {
        // Just finished a rest interval
        const newActualRestSeconds = prevState.actualRestSeconds + elapsedSeconds;
        
        if (prevState.currentInterval < prevState.iterations) {
          // Start next run interval
          return {
            ...prevState,
            isRest: false,
            currentInterval: prevState.currentInterval + 1,
            initialSeconds: prevState.runSeconds,
            actualRestSeconds: newActualRestSeconds,
            currentIntervalElapsed: 0, // Reset elapsed time for new interval
          };
        } else {
          // Session complete
          return {
            ...prevState,
            isRunning: false,
            isComplete: true,
            actualRestSeconds: newActualRestSeconds,
          };
        }
      } else {
        // Just finished a run interval, start rest
        const newActualRunSeconds = prevState.actualRunSeconds + elapsedSeconds;
        
        return {
          ...prevState,
          isRest: true,
          initialSeconds: prevState.restSeconds,
          actualRunSeconds: newActualRunSeconds,
          currentIntervalElapsed: 0, // Reset elapsed time for new interval
        };
      }
    });
  };

  const stopSession = () => {
    setState(prevState => ({
      ...prevState,
      isRunning: false,
      isPaused: false,
      isComplete: false,
    }));
  };

  const togglePause = () => {
    setState(prevState => ({
      ...prevState,
      isPaused: !prevState.isPaused,
    }));
  };

  const resetSession = () => {
    setState({
      isRunning: false,
      isPaused: false,
      isRest: false,
      currentInterval: 1,
      runSeconds: 0,
      restSeconds: 0,
      iterations: 0,
      initialSeconds: 0,
      isComplete: false,
      actualRunSeconds: 0,
      actualRestSeconds: 0,
      currentIntervalElapsed: 0,
    });
    
    elapsedTimeRef.current = 0;
  };

  // Update the current interval elapsed time when time passes
  const updateCurrentIntervalElapsed = (seconds: number) => {
    setState(prevState => ({
      ...prevState,
      currentIntervalElapsed: prevState.currentIntervalElapsed + seconds,
    }));
  };

  const updateActualTime = (seconds: number) => {
    setState(prevState => ({
      ...prevState,
      // Add time to the appropriate category based on current state
      actualRunSeconds: prevState.isRest ? prevState.actualRunSeconds : prevState.actualRunSeconds + seconds,
      actualRestSeconds: prevState.isRest ? prevState.actualRestSeconds + seconds : prevState.actualRestSeconds,
      // Also update the current interval elapsed time
      currentIntervalElapsed: Math.max(0, prevState.currentIntervalElapsed - seconds),
    }));
  };

  const getTotalTime = (): number => {
    return (state.actualRunSeconds + state.actualRestSeconds) / 60;
  };

  const getRunTime = (): number => {
    return state.actualRunSeconds / 60;
  };

  const getRestTime = (): number => {
    return state.actualRestSeconds / 60;
  };

  return {
    state,
    startSession,
    completeInterval,
    stopSession,
    togglePause,
    resetSession,
    updateActualTime,
    updateCurrentIntervalElapsed,
    getTotalTime,
    getRunTime,
    getRestTime,
  };
};
