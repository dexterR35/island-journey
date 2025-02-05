import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import WaypointModal from './WaypointModal';

export default function Waypoint({ month, day, status, onClick }) {
  const [showModal, setShowModal] = useState(false);
  const { rewards, validateDayClick, completedDays } = useGame();

  const handleClick = async () => {
    onClick();
  };

  const getStatusText = () => {
    const currentDate = new Date();
    const wayPointDate = new Date(month.split('-')[0], parseInt(month.split('-')[1]) - 1, day);
    
    if (status === 'completed') return 'Claimed';
    if (status === 'active') return 'Available';
    if (status === 'locked') return 'Locked';
    
    return wayPointDate < currentDate ? 'Outdated' : 'Coming Soon';
  };

  const isToday = () => {
    const today = new Date();
    const wayPointDate = new Date(month.split('-')[0], parseInt(month.split('-')[1]) - 1, day);
    return today.getDate() === wayPointDate.getDate() && 
           today.getMonth() === wayPointDate.getMonth() && 
           today.getFullYear() === wayPointDate.getFullYear();
  };

  const isClaimed = () => {
    return completedDays.includes(`${month}-${day}`);
  };

  const getBackgroundColor = () => {
    if (isToday()) {
      return isClaimed() 
        ? 'bg-red-100 text-red-800' 
        : 'bg-blue-700 text-white hover:bg-blue-800';
    }
    
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'locked':
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
      default:
        return 'bg-gray-50 text-gray-500 hover:bg-gray-100';
    }
  };

  return (
    <>
      <div
        className={`w-full p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all ${getBackgroundColor()}`}
        onClick={handleClick}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow
          ${isToday() && isClaimed() ? 'ring-2 ring-red-400' : ''}`}
        >
          {day}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Day {day}</div>
          <div className="text-xs opacity-75">
            {getStatusText()}
          </div>
        </div>
      </div>
      
      {showModal && (
        <WaypointModal
          month={month}
          day={day}
          prize={rewards[month][day].prize}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
} 