
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Play } from "lucide-react";

interface IntervalFormProps {
  onStart: (runMinutes: number, restMinutes: number, iterations: number) => void;
}

const IntervalForm: React.FC<IntervalFormProps> = ({ onStart }) => {
  const [runMinutes, setRunMinutes] = useState<number>(5);
  const [restMinutes, setRestMinutes] = useState<number>(2);
  const [iterations, setIterations] = useState<number>(5);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(runMinutes, restMinutes, iterations);
  };

  // Format time to mm:ss
  const formatTime = (minutes: number): string => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes % 1) * 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Interval Timer</h1>
      </div>
      
      <div className="text-center mb-12">
        <div className="text-8xl font-bold text-white mb-8">
          {formatTime(runMinutes)}
        </div>
        
        <Button 
          type="submit" 
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
            <Label htmlFor="run-time" className="font-medium text-[#333333]">
              Work
            </Label>
          </div>
          <div className="text-right">
            <Input
              id="run-time"
              type="number"
              min="0.5"
              step="0.5"
              value={runMinutes}
              onChange={(e) => setRunMinutes(parseFloat(e.target.value))}
              className="w-20 bg-transparent text-right border-none text-[#333333] text-xl font-bold focus:ring-0"
            />
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
            <Label htmlFor="rest-time" className="font-medium text-[#333333]">
              Rest
            </Label>
          </div>
          <div className="text-right">
            <Input
              id="rest-time"
              type="number"
              min="0.5"
              step="0.5"
              value={restMinutes}
              onChange={(e) => setRestMinutes(parseFloat(e.target.value))}
              className="w-20 bg-transparent text-right border-none text-[#555555] text-xl font-bold focus:ring-0"
            />
          </div>
        </div>
        
        {/* Exercises - Neutral gray box */}
        <div className="bg-[#EFEFEF] rounded-xl p-4 flex items-center">
          <div className="bg-[#DDDDDD] rounded-full p-2 mr-4">
            <div className="w-6 h-6 flex items-center justify-center text-[#666666]">
              ⚡
            </div>
          </div>
          <div className="flex-grow">
            <Label htmlFor="iterations" className="font-medium text-[#333333]">
              Exercises
            </Label>
          </div>
          <div className="text-right text-xl font-bold text-[#555555]">
            <span>1</span>
          </div>
        </div>
        
        {/* Rounds - Neutral gray box */}
        <div className="bg-[#F1F1F1] rounded-xl p-4 flex items-center">
          <div className="bg-[#DEDEDE] rounded-full p-2 mr-4">
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
            <Label htmlFor="iterations" className="font-medium text-[#333333]">
              Rounds
            </Label>
          </div>
          <div className="text-right">
            <Input
              id="iterations"
              type="number"
              min="1"
              max="20"
              value={iterations}
              onChange={(e) => setIterations(parseInt(e.target.value))}
              className="w-20 bg-transparent text-right border-none text-[#555555] text-xl font-bold focus:ring-0"
            />
            <span className="text-[#555555] text-xl font-bold">X</span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default IntervalForm;
