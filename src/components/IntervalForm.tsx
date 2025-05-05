
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
      <h2 className="text-xl font-semibold text-white text-center">Set Your Intervals</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="run-time" className="text-spotify-lightgray">
            Run Time (minutes)
          </Label>
          <Input
            id="run-time"
            type="number"
            min="0.5"
            step="0.5"
            value={runMinutes}
            onChange={(e) => setRunMinutes(parseFloat(e.target.value))}
            className="bg-spotify-gray text-white border-spotify-gray focus:border-spotify-green focus:ring-spotify-green"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rest-time" className="text-spotify-lightgray">
            Rest Time (minutes)
          </Label>
          <Input
            id="rest-time"
            type="number"
            min="0.5"
            step="0.5"
            value={restMinutes}
            onChange={(e) => setRestMinutes(parseFloat(e.target.value))}
            className="bg-spotify-gray text-white border-spotify-gray focus:border-spotify-green focus:ring-spotify-green"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="iterations" className="text-spotify-lightgray">
            Number of Intervals
          </Label>
          <Input
            id="iterations"
            type="number"
            min="1"
            max="20"
            value={iterations}
            onChange={(e) => setIterations(parseInt(e.target.value))}
            className="bg-spotify-gray text-white border-spotify-gray focus:border-spotify-green focus:ring-spotify-green"
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
