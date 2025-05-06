
import React, { useState, useEffect } from 'react';
import { Play, Circle, RotateCcw } from "lucide-react";
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
  const [restTimeStr, setRestTimeStr] = useState('02:00');
  const [roundsStr, setRoundsStr] = useState('5');
  
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent page refresh but don't do anything else
    // This prevents the form from submitting and refreshing the page
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
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
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Work Interval Box */}
        <div className="bg-gray-100 rounded-3xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 rounded-full p-4 flex items-center justify-center w-14 h-14">
              <Play size={24} className="text-gray-600" />
            </div>
            <span className="text-xl font-medium text-gray-800">Work</span>
          </div>
          <input
            type="text"
            value={runTimeStr}
            onChange={handleRunTimeChange}
            onFocus={handleInputFocus}
            className="bg-transparent text-right text-2xl font-semibold text-gray-800 w-28 outline-none select-none focus:text-gray-800 focus:bg-gray-200 focus:rounded px-2"
            style={{ 
              WebkitUserSelect: 'text',
              WebkitTapHighlightColor: 'transparent', 
              caretColor: '#1DB954',
            }}
          />
        </div>
        
        {/* Rest Interval Box */}
        <div className="bg-gray-100 rounded-3xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 rounded-full p-4 flex items-center justify-center w-14 h-14">
              <Circle size={24} className="text-gray-600" />
            </div>
            <span className="text-xl font-medium text-gray-800">Rest</span>
          </div>
          <input
            type="text"
            value={restTimeStr}
            onChange={handleRestTimeChange}
            onFocus={handleInputFocus}
            className="bg-transparent text-right text-2xl font-semibold text-gray-800 w-28 outline-none select-none focus:text-gray-800 focus:bg-gray-200 focus:rounded px-2"
            style={{ 
              WebkitUserSelect: 'text',
              WebkitTapHighlightColor: 'transparent', 
              caretColor: '#1DB954',
            }}
          />
        </div>
        
        {/* Rounds Box */}
        <div className="bg-gray-100 rounded-3xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 rounded-full p-4 flex items-center justify-center w-14 h-14">
              <RotateCcw size={24} className="text-gray-600" />
            </div>
            <span className="text-xl font-medium text-gray-800">Rounds</span>
          </div>
          <input
            type="text"
            value={roundsStr}
            onChange={handleRoundsChange}
            onFocus={handleInputFocus}
            className="bg-transparent text-right text-2xl font-semibold text-gray-800 w-28 outline-none select-none focus:text-gray-800 focus:bg-gray-200 focus:rounded px-2"
            style={{ 
              WebkitUserSelect: 'text',
              WebkitTapHighlightColor: 'transparent', 
              caretColor: '#1DB954',
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default IntervalForm;
