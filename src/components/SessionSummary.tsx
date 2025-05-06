
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

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
          className="rounded-full w-20 h-20 bg-white hover:bg-white/90 text-spotify-green"
        >
          <Play size={32} fill="currentColor" />
        </Button>
      </div>
      
      <div className="space-y-4 mt-8">
        {/* Work interval - Neutral gray box */}
        <div className="bg-[#F1F1F1] rounded-xl p-4 flex items-center">
          <div className="bg-[#DEDEDE] rounded-full p-2 mr-4">
            <Play size={24} className="text-[#555555]" />
          </div>
          <div className="flex-grow">
            <span className="font-medium text-[#333333]">
              Work
            </span>
          </div>
          <div className="text-right">
            <span className="text-[#333333] text-xl font-bold">
              {formatTime(actualRunTime)}
            </span>
          </div>
        </div>
        
        {/* Rest Time - Neutral gray box */}
        <div className="bg-[#F6F6F7] rounded-xl p-4 flex items-center">
          <div className="bg-[#E5E5E5] rounded-full p-2 mr-4">
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-3 h-3 bg-[#555555] rounded-sm"></div>
            </div>
          </div>
          <div className="flex-grow">
            <span className="font-medium text-[#333333]">
              Rest
            </span>
          </div>
          <div className="text-right">
            <span className="text-[#555555] text-xl font-bold">
              {formatTime(actualRestTime)}
            </span>
          </div>
        </div>
        
        {/* Rounds - Neutral gray box */}
        <div className="bg-[#EFEFEF] rounded-xl p-4 flex items-center">
          <div className="bg-[#DDDDDD] rounded-full p-2 mr-4">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#666666]">
                <path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.665 3 16"></path>
                <path d="M2 12C2 6 6.39 2 11.806 2 16.209 2 19.76 4.335 21 8"></path>
                <path d="M7 17l-4-1h4"></path>
                <path d="M17 7l4 1h-4"></path>
              </svg>
            </div>
          </div>
          <div className="flex-grow">
            <span className="font-medium text-[#333333]">
              Rounds
            </span>
          </div>
          <div className="text-right">
            <span className="text-[#555555] text-xl font-bold">
              {iterations}X
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionSummary;
