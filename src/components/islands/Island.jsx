import { useState } from 'react';
import { formatMonth } from '../../utils/dateUtils';

export default function Island({ month, isActive, setCurrentIsland }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isActive) {
      setCurrentIsland(month);
    }
  };

  return (
    <div
      className={`relative cursor-pointer transition-all duration-300 
        ${isActive ? 'opacity-100' : 'opacity-50 pointer-events-none'}
        ${isHovered ? 'scale-110' : 'scale-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold">
          {formatMonth(month)}
        </span>
      </div>
    </div>
  );
} 