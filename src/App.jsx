import { GameProvider } from './context/GameContext';
import IslandsPage from './components/pages/IslandsPage';
import JourneyPage from './components/pages/JourneyPage';
import { useState } from 'react';

function AppContent() {
  const [currentIsland, setCurrentIsland] = useState(null);

  return currentIsland ? (
    <JourneyPage currentIsland={currentIsland} setCurrentIsland={setCurrentIsland} />
  ) : (
    <IslandsPage setCurrentIsland={setCurrentIsland} />
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
} 