import { useGame } from '../../context/GameContext';
import JourneyPath from '../journey/JourneyPath';
import PageContent from '../layout/PageContent';

export default function JourneyPage({ currentIsland, setCurrentIsland }) {
  const handleBack = () => {
    setCurrentIsland(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Islands
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">
          Journey Path
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
        {/* Mobile: Full width sections */}
        <div className="lg:hidden space-y-4 w-full">
          {/* Special Offers Section */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <PageContent monthKey={currentIsland} mobileView={true} />
          </div>
          
          {/* Waypoints Section */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <JourneyPath monthKey={currentIsland} />
          </div>
          
          {/* Rest of Content */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <PageContent monthKey={currentIsland} mobileView={false} />
          </div>
        </div>

        {/* Desktop: Side-by-side layout */}
        <div className="hidden lg:flex gap-8 w-full">
          {/* Left side - Waypoints */}
          <div className="w-1/4 bg-white rounded-lg p-4 shadow-lg">
            <JourneyPath monthKey={currentIsland} />
          </div>

          {/* Right side - Content */}
          <div className="w-3/4">
            <PageContent monthKey={currentIsland} />
          </div>
        </div>
      </div>
    </div>
  );
} 