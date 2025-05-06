
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  currentInterval: number;
  totalIntervals: number;
  isRest: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentInterval, totalIntervals, isRest }) => {
  // Calculate completion percentage
  const completionPercentage = ((currentInterval - 1) / totalIntervals) * 100;
  
  return (
    <div className="w-full max-w-md mb-4">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Progress</span>
        <span>{Math.round(completionPercentage)}%</span>
      </div>
      <Progress 
        value={completionPercentage} 
        className="h-1.5 bg-gray-700" 
        indicatorClassName={`${isRest ? "bg-purple-500" : "bg-green-500"}`}
      />
      <div className="mt-1 text-center text-sm text-gray-400">
        <span>{currentInterval} of {totalIntervals} intervals</span>
      </div>
    </div>
  );
};

export default ProgressBar;
