
import { useState } from 'react';

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
  });

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
    });
  };

  const completeInterval = () => {
    if (state.isRest) {
      // Just finished a rest interval
      if (state.currentInterval < state.iterations) {
        // Start next run interval
        setState(prevState => ({
          ...prevState,
          isRest: false,
          currentInterval: prevState.currentInterval + 1,
          initialSeconds: prevState.runSeconds,
        }));
      } else {
        // Session complete
        setState(prevState => ({
          ...prevState,
          isRunning: false,
          isComplete: true,
        }));
      }
    } else {
      // Just finished a run interval, start rest
      setState(prevState => ({
        ...prevState,
        isRest: true,
        initialSeconds: prevState.restSeconds,
      }));
    }
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
    });
  };

  const getTotalTime = (): number => {
    const runTime = (state.runSeconds / 60) * state.iterations;
    const restTime = (state.restSeconds / 60) * (state.iterations - 1);
    return runTime + restTime;
  };

  return {
    state,
    startSession,
    completeInterval,
    stopSession,
    togglePause,
    resetSession,
    getTotalTime,
  };
};
