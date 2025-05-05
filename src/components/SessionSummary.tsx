
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SessionSummaryProps {
  runMinutes: number;
  restMinutes: number;
  iterations: number;
  totalTime: number;
  actualRunTime: number;
  actualRestTime: number;
  onReset: () => void;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({
  runMinutes,
  restMinutes,
  iterations,
  totalTime,
  actualRunTime,
  actualRestTime,
  onReset
}) => {
  // Format total time
  const formatTime = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    } else {
      return `${mins} minutes`;
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl space-y-6 max-w-md w-full">
      <h2 className="text-xl font-semibold text-white text-center">Session Complete!</h2>
      
      <div className="space-y-4">
        <div className="bg-spotify-darkblack rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-spotify-lightgray">Run Interval:</span>
            <span className="text-white font-medium">{runMinutes} minutes</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-spotify-lightgray">Rest Interval:</span>
            <span className="text-white font-medium">{restMinutes} minutes</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-spotify-lightgray">Iterations:</span>
            <span className="text-white font-medium">{iterations}</span>
          </div>
          
          <div className="pt-2 mt-2 border-t border-spotify-gray flex justify-between">
            <span className="text-spotify-lightgray">Actual Run Time:</span>
            <span className="text-spotify-green font-semibold">{formatTime(actualRunTime)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-spotify-lightgray">Actual Rest Time:</span>
            <span className="text-blue-400 font-semibold">{formatTime(actualRestTime)}</span>
          </div>
          
          <div className="pt-2 mt-2 border-t border-spotify-gray flex justify-between">
            <span className="text-spotify-lightgray">Total Time:</span>
            <span className="text-white font-semibold">{formatTime(totalTime)}</span>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={onReset}
        className="w-full bg-spotify-green hover:bg-spotify-green/90 text-white font-medium flex items-center justify-center gap-2"
      >
        Start New Session <ArrowRight size={18} />
      </Button>
    </div>
  );
};

export default SessionSummary;
