
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TimerHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center mb-10">
      <h1 
        className="text-4xl font-bold text-spotify-green mb-2 cursor-pointer hover:text-spotify-green/90 transition-colors"
        onClick={() => navigate('/')}
      >
        Stride Sync
      </h1>
      <p className="text-spotify-lightgray text-lg">Interval Running Tracker</p>
    </div>
  );
};

export default TimerHeader;
