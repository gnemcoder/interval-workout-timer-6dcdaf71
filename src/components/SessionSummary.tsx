
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
  // Format time in minutes and seconds
  const formatTime = (minutes: number): string => {
    const totalSeconds = Math.round(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs} seconds`;
    }
  };

  return (
    <div className="glass-card p-6 rounded-xl space-y-6 max-w-md w-full">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Session Complete!</h2>
        <div className="text-3xl font-bold text-spotify-green mb-4">
          {formatTime(totalTime)}
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Run time - Light green box */}
        <div className="bg-[#F2FCE2] rounded-lg p-4 text-spotify-black">
          <div className="flex justify-between items-center">
            <span className="font-medium text-spotify-black/80">Run Time</span>
            <span className="font-semibold text-spotify-green text-lg">{formatTime(actualRunTime)}</span>
          </div>
          <div className="text-xs text-spotify-black/60 mt-1">
            Target: {runMinutes} minutes per interval
          </div>
        </div>
        
        {/* Rest time - Red box */}
        <div className="bg-[#ea384c] rounded-lg p-4 text-white">
          <div className="flex justify-between items-center">
            <span className="font-medium text-white/90">Rest Time</span>
            <span className="font-semibold text-white text-lg">{formatTime(actualRestTime)}</span>
          </div>
          <div className="text-xs text-white/70 mt-1">
            Target: {restMinutes} minutes per interval
          </div>
        </div>
        
        {/* Intervals - Light blue box */}
        <div className="bg-[#D3E4FD] rounded-lg p-4 text-spotify-black">
          <div className="flex justify-between items-center">
            <span className="font-medium text-spotify-black/80">Intervals</span>
            <span className="font-semibold text-blue-600 text-lg">{iterations}</span>
          </div>
          <div className="text-xs text-spotify-black/60 mt-1">
            Total cycles completed
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
