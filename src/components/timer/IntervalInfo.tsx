
import React from 'react';

interface IntervalInfoProps {
  isRest: boolean;
  currentInterval: number;
  totalIntervals: number;
}

const IntervalInfo: React.FC<IntervalInfoProps> = ({
  isRest,
  currentInterval,
  totalIntervals
}) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-xl text-white mb-2">
        Interval {currentInterval} of {totalIntervals}
      </h2>
      <p className={`text-2xl font-bold ${isRest ? "text-spotify-lightgray" : "text-spotify-green"}`}>
        {isRest ? "Rest" : "Run"}
      </p>
    </div>
  );
};

export default IntervalInfo;
