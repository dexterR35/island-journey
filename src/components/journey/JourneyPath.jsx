import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import Waypoint from './Waypoint';
import WaypointModal from './WaypointModal';
import { formatMonth } from '../../utils/dateUtils';

export default function JourneyPath({ monthKey, setCurrentIsland }) {
  const { getWaypointStatus } = useGame();
  const [activeModal, setActiveModal] = useState(null);
  const [showTooltip, setShowTooltip] = useState(true);
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  const daysInMonth = new Date(
    monthKey.split('-')[0],
    monthKey.split('-')[1],
    0
  ).getDate();

  // Hide tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold mb-2">{formatMonth(monthKey)}</h3>
      <div className="flex flex-col gap-3">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <div key={day} className="relative">
            <Waypoint
              month={monthKey}
              day={day}
              status={getWaypointStatus(monthKey, day)}
              onClick={() => setActiveModal({ month: monthKey, day })}
            />
            {day === currentDay && showTooltip && (
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-45 w-2 h-2 bg-blue-500"></div>
                Click to claim today's prize!
              </div>
            )}
          </div>
        ))}
      </div>

      {activeModal && (
        <WaypointModal
          month={activeModal.month}
          day={activeModal.day}
          onClose={() => setActiveModal(null)}
          setCurrentIsland={setCurrentIsland}
        />
      )}
    </div>
  );
} 