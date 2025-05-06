
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

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
  iterations,
  totalTime,
  actualRunTime,
  actualRestTime,
  onReset
}) => {
  // Format time in mm:ss format
  const formatTime = (minutes: number): string => {
    const totalSeconds = Math.round(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Session Complete</h1>
      </div>
      
      <div className="text-center mb-12">
        <div className="text-8xl font-bold text-white mb-8">
          {formatTime(totalTime)}
        </div>
        
        <Button 
          onClick={onReset}
          className="rounded-full w-20 h-20 bg-spotify-green hover:bg-spotify-green/90 text-black"
        >
          <Play size={32} fill="currentColor" />
        </Button>
      </div>
      
      <div className="mt-8 space-y-5">
        <div className="flex justify-between items-center">
          <span className="text-spotify-lightgray text-lg font-medium">Time Worked</span>
          <span className="text-white text-2xl font-bold">{formatTime(actualRunTime)}</span>
        </div>
        
        <div className="h-px bg-white/10 w-full"></div>
        
        <div className="flex justify-between items-center">
          <span className="text-spotify-lightgray text-lg font-medium">Time Rested</span>
          <span className="text-white text-2xl font-bold">{formatTime(actualRestTime)}</span>
        </div>
        
        <div className="h-px bg-white/10 w-full"></div>
        
        <div className="flex justify-between items-center">
          <span className="text-spotify-lightgray text-lg font-medium">Total Session</span>
          <span className="text-white text-2xl font-bold">{formatTime(totalTime)}</span>
        </div>
        
        <div className="h-px bg-white/10 w-full"></div>
        
        <div className="flex justify-between items-center">
          <span className="text-spotify-lightgray text-lg font-medium">Rounds</span>
          <span className="text-white text-2xl font-bold">{iterations}×</span>
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;
