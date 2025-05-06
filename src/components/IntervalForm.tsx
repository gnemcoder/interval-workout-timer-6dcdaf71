
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

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

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl space-y-6 max-w-md w-full">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Set Your Intervals</h2>
        <div className="text-3xl font-bold text-spotify-green mb-4">
          Stride Sync
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Run Time - Light green box */}
        <div className="bg-[#F2FCE2] rounded-lg p-4 text-spotify-black">
          <Label htmlFor="run-time" className="block font-medium text-spotify-black/80 mb-2">
            Run Time (minutes)
          </Label>
          <Input
            id="run-time"
            type="number"
            min="0.5"
            step="0.5"
            value={runMinutes}
            onChange={(e) => setRunMinutes(parseFloat(e.target.value))}
            className="bg-white/90 text-spotify-black border-transparent focus:border-spotify-green focus:ring-spotify-green"
          />
        </div>
        
        {/* Rest Time - Red box */}
        <div className="bg-[#ea384c] rounded-lg p-4 text-white">
          <Label htmlFor="rest-time" className="block font-medium text-white/90 mb-2">
            Rest Time (minutes)
          </Label>
          <Input
            id="rest-time"
            type="number"
            min="0.5"
            step="0.5"
            value={restMinutes}
            onChange={(e) => setRestMinutes(parseFloat(e.target.value))}
            className="bg-white/90 text-spotify-black border-transparent focus:border-red-500 focus:ring-red-500"
          />
        </div>
        
        {/* Intervals - Light blue box */}
        <div className="bg-[#D3E4FD] rounded-lg p-4 text-spotify-black">
          <Label htmlFor="iterations" className="block font-medium text-spotify-black/80 mb-2">
            Number of Intervals
          </Label>
          <Input
            id="iterations"
            type="number"
            min="1"
            max="20"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value))}
            className="bg-white/90 text-spotify-black border-transparent focus:border-blue-600 focus:ring-blue-600"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-spotify-green hover:bg-spotify-green/90 text-white font-medium flex items-center justify-center gap-2"
      >
        Start Session <ArrowRight size={18} />
      </Button>
    </form>
  );
};

export default IntervalForm;
