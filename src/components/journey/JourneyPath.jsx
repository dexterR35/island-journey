import { useGame } from '../../context/GameContext';
import Waypoint from './Waypoint';
import { formatMonth } from '../../utils/dateUtils';

export default function JourneyPath({ monthKey }) {
  const { getWaypointStatus } = useGame();
  const daysInMonth = new Date(
    monthKey.split('-')[0],
    monthKey.split('-')[1],
    0
  ).getDate();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold mb-2">{formatMonth(monthKey)}</h3>
      <div className="flex flex-col gap-3">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <Waypoint
            key={day}
            month={monthKey}
            day={day}
            status={getWaypointStatus(monthKey, day)}
          />
        ))}
      </div>
    </div>
  );
} 