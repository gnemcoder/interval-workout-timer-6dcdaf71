
import React, { useState, useEffect } from 'react';
import { Play, Circle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface IntervalFormProps {
  onStart: (runMinutes: number, restMinutes: number, iterations: number) => void;
  defaultRunMinutes?: number;
  defaultRestMinutes?: number;
  defaultRounds?: number;
}

// Helper function to format time in mm:ss format
const formatTime = (minutes: number): string => {
  const mins = Math.floor(minutes);
  const secs = Math.round((minutes - mins) * 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Helper function to parse mm:ss format to minutes
const parseTime = (timeStr: string): number => {
  const [minutesStr, secondsStr] = timeStr.split(':');
  const minutes = parseInt(minutesStr, 10) || 0;
  const seconds = parseInt(secondsStr, 10) || 0;
  return minutes + seconds / 60;
};

const IntervalForm: React.FC<IntervalFormProps> = ({ 
  onStart, 
  defaultRunMinutes = 5, 
  defaultRestMinutes = 2, 
  defaultRounds = 5 
}) => {
  const [runTimeStr, setRunTimeStr] = useState(formatTime(defaultRunMinutes));
  const [restTimeStr, setRestTimeStr] = useState(formatTime(defaultRestMinutes));
  const [roundsStr, setRoundsStr] = useState(String(defaultRounds));
  
  const [runTime, setRunTime] = useState(parseTime(runTimeStr));
  const [restTime, setRestTime] = useState(parseTime(restTimeStr));
  const [rounds, setRounds] = useState(parseInt(roundsStr, 10) || 1);
  
  // Update state when default props change
  useEffect(() => {
    setRunTimeStr(formatTime(defaultRunMinutes));
    setRestTimeStr(formatTime(defaultRestMinutes));
    setRoundsStr(String(defaultRounds));
  }, [defaultRunMinutes, defaultRestMinutes, defaultRounds]);
  
  useEffect(() => {
    setRunTime(parseTime(runTimeStr));
    setRestTime(parseTime(restTimeStr));
    setRounds(parseInt(roundsStr, 10) || 1);
  }, [runTimeStr, restTimeStr, roundsStr]);
  
  // Calculate total session time (workout + rest) * rounds
  const totalSessionTime = (runTime + restTime) * rounds;
  
  // Format total time for display
  const formattedTotalTime = formatTime(totalSessionTime);
  
  const handleStart = () => {
    onStart(runTime, restTime, rounds);
  };

  const handleRunTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRunTimeStr(e.target.value);
  };

  const handleRestTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestTimeStr(e.target.value);
  };

  const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoundsStr(e.target.value);
  };
  
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Stride Sync</h1>
        <p className="text-spotify-lightgray text-lg">Interval Running Tracker</p>
      </div>
      
      <div className="text-center mb-12">
        <div className="text-6xl font-bold text-white mb-8" title="Total session duration">
          {formattedTotalTime}
        </div>
        
        <Button 
          onClick={handleStart}
          className="rounded-full w-20 h-20 bg-spotify-green hover:bg-spotify-green/90 text-black"
        >
          <Play size={32} fill="currentColor" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Work Interval Box */}
        <div className="flex items-center justify-between bg-white/10 rounded-full p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-full p-3">
              <Play className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-white text-xl font-medium">Work</span>
          </div>
          <input
            type="text"
            value={runTimeStr}
            onChange={handleRunTimeChange}
            className="bg-transparent border-none text-right text-white text-2xl font-bold focus:outline-none w-24"
          />
        </div>
        
        {/* Rest Interval Box */}
        <div className="flex items-center justify-between bg-white/10 rounded-full p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-full p-3">
              <Circle className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-white text-xl font-medium">Rest</span>
          </div>
          <input
            type="text"
            value={restTimeStr}
            onChange={handleRestTimeChange}
            className="bg-transparent border-none text-right text-white text-2xl font-bold focus:outline-none w-24"
          />
        </div>
        
        {/* Rounds Box */}
        <div className="flex items-center justify-between bg-white/10 rounded-full p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-full p-3">
              <RefreshCcw className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-white text-xl font-medium">Rounds</span>
          </div>
          <input
            type="text"
            value={roundsStr}
            onChange={handleRoundsChange}
            className="bg-transparent border-none text-right text-white text-2xl font-bold focus:outline-none w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default IntervalForm;
