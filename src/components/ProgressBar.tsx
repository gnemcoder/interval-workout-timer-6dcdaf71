
import React from 'react';

interface ProgressBarProps {
  currentInterval: number;
  totalIntervals: number;
  isRest: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentInterval, totalIntervals, isRest }) => {
  // Calculate completion percentage
  const completionPercentage = ((currentInterval - 1) / totalIntervals) * 100;
  
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between text-xs text-spotify-lightgray mb-2">
        <span>Progress</span>
        <span>{Math.round(completionPercentage)}%</span>
      </div>
      <div className="h-1.5 w-full bg-spotify-gray rounded-full overflow-hidden">
        <div 
          className={`h-full ${isRest ? 'bg-blue-400' : 'bg-spotify-green'} transition-all duration-500 ease-out`}
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      <div className="mt-1 text-center text-xs text-spotify-lightgray">
        <span>{currentInterval} of {totalIntervals} intervals</span>
      </div>
    </div>
  );
};

export default ProgressBar;
