import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import WaypointModal from './WaypointModal';

export default function Waypoint({ month, day, status }) {
  const [showModal, setShowModal] = useState(false);
  const { rewards, validateDayClick } = useGame();

  const handleClick = async () => {
    try {
      const result = await validateDayClick(month, day);
      if (result.canOpen) {
        setShowModal(true);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error handling click:', error);
    }
  };

  return (
    <>
      <div
        className={`w-full p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all
          ${status === 'completed' ? 'bg-green-100 text-green-800' : 
            status === 'active' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
            status === 'locked' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 
            'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
        onClick={handleClick}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow">
          {day}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Day {day}</div>
          <div className="text-xs opacity-75">
            {status === 'completed' ? 'Claimed' :
             status === 'active' ? 'Available' :
             status === 'locked' ? 'Locked' : 'Coming Soon'}
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