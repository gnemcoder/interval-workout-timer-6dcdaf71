import React, { useState, useEffect } from 'react';
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntervalFormProps {
  onStart: (runMinutes: number, restMinutes: number, iterations: number) => void;
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

const IntervalForm: React.FC<IntervalFormProps> = ({ onStart }) => {
  const [runTimeStr, setRunTimeStr] = useState('05:00');
  const [restTimeStr, setRestTimeStr] = useState('02:30');
  const [roundsStr, setRoundsStr] = useState('3');
  
  const [runTime, setRunTime] = useState(parseTime(runTimeStr));
  const [restTime, setRestTime] = useState(parseTime(restTimeStr));
  const [rounds, setRounds] = useState(parseInt(roundsStr, 10) || 1);
  
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
        <div>
          <label className="block text-spotify-lightgray text-sm font-bold mb-2">
            Work Interval (mm:ss):
          </label>
          <input
            type="text"
            value={runTimeStr}
            onChange={handleRunTimeChange}
            placeholder="05:00"
            pattern="[0-9]{2}:[0-9]{2}"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-spotify-darkgray text-white"
          />
        </div>
        
        <div>
          <label className="block text-spotify-lightgray text-sm font-bold mb-2">
            Rest Interval (mm:ss):
          </label>
          <input
            type="text"
            value={restTimeStr}
            onChange={handleRestTimeChange}
            placeholder="02:30"
            pattern="[0-9]{2}:[0-9]{2}"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-spotify-darkgray text-white"
          />
        </div>
        
        <div>
          <label className="block text-spotify-lightgray text-sm font-bold mb-2">
            Rounds:
          </label>
          <input
            type="number"
            value={roundsStr}
            onChange={handleRoundsChange}
            placeholder="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-spotify-darkgray text-white"
          />
        </div>
      </div>
    </div>
  );
};

export default IntervalForm;
