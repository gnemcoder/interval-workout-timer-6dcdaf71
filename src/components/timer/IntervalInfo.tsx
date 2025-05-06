
import React from 'react';
import { Play } from 'lucide-react';
import { formatTime } from './TimerDisplay';

interface IntervalInfoProps {
  isRest: boolean;
  runSeconds: number;
  restSeconds: number;
  currentInterval: number;
  totalIntervals: number;
}

const IntervalInfo: React.FC<IntervalInfoProps> = ({
  isRest,
  runSeconds,
  restSeconds,
  currentInterval,
  totalIntervals
}) => {
  return (
    <div className="space-y-4">
      {/* Work interval - Light green box */}
      <div className={`${isRest ? 'bg-[#e8f8e8]' : 'bg-green-500/10 border-2 border-green-500'} rounded-xl p-4 flex items-center`}>
        <div className="bg-[#c2ecc2] rounded-full p-2 mr-4">
          <Play size={24} className="text-green-600" />
        </div>
        <div className="flex-grow">
          <span className="font-medium text-gray-800">
            Work
          </span>
        </div>
        <div className="text-right">
          <span className="text-green-600 text-xl font-bold">
            {formatTime(runSeconds)}
          </span>
        </div>
      </div>
      
      {/* Rest Time - Light red box */}
      <div className={`${isRest ? 'bg-red-500/10 border-2 border-red-500' : 'bg-[#ffe8e8]'} rounded-xl p-4 flex items-center`}>
        <div className="bg-[#ffcaca] rounded-full p-2 mr-4">
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          </div>
        </div>
        <div className="flex-grow">
          <span className="font-medium text-gray-800">
            Rest
          </span>
        </div>
        <div className="text-right">
          <span className="text-red-500 text-xl font-bold">
            {formatTime(restSeconds)}
          </span>
        </div>
      </div>
      
      {/* Exercises - Light gray box */}
      <div className="bg-[#f0f0f0] rounded-xl p-4 flex items-center">
        <div className="bg-[#e0e0e0] rounded-full p-2 mr-4">
          <div className="w-6 h-6 flex items-center justify-center text-gray-500">
            ⚡
          </div>
        </div>
        <div className="flex-grow">
          <span className="font-medium text-gray-800">
            Exercises
          </span>
        </div>
        <div className="text-right text-xl font-bold text-gray-500">
          <span>1</span>
        </div>
      </div>
      
      {/* Rounds - Light blue box */}
      <div className="bg-[#e8ecff] rounded-xl p-4 flex items-center">
        <div className="bg-[#d0d8ff] rounded-full p-2 mr-4">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <path d="M22 12c0 6-4.39 10-9.806 10C7.792 22 4.24 19.665 3 16"></path>
              <path d="M2 12C2 6 6.39 2 11.806 2 16.209 2 19.76 4.335 21 8"></path>
              <path d="M7 17l-4-1h4"></path>
              <path d="M17 7l4 1h-4"></path>
            </svg>
          </div>
        </div>
        <div className="flex-grow">
          <span className="font-medium text-gray-800">
            Rounds
          </span>
        </div>
        <div className="text-right">
          <span className="text-blue-600 text-xl font-bold">
            {currentInterval}/{totalIntervals}X
          </span>
        </div>
      </div>
    </div>
  );
};

export default IntervalInfo;
