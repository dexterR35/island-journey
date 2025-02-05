import { useGame } from '../../context/GameContext';
import Island from './Island';

export default function IslandsContainer({ setCurrentIsland }) {
  const { activeMonths, isIslandActive } = useGame();

  return (
    <div className="container mx-auto">
      <div className="flex justify-center gap-16">
        {activeMonths.map((monthKey) => (
          <Island 
            key={monthKey}
            month={monthKey}
            isActive={isIslandActive(monthKey)}
            setCurrentIsland={setCurrentIsland}
          />
        ))}
      </div>
    </div>
  );
} 