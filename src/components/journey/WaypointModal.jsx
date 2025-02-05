import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { prizes } from '../../data/prizes';

export default function WaypointModal({ month, day, prize, onClose }) {
  const { claimReward, user, validateDayClick } = useGame();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  const prizeData = prizes[month]?.[day];
  const date = new Date(month.split('-')[0], parseInt(month.split('-')[1]) - 1, day);
  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Handle click outside
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const checkStatus = async () => {
    try {
      const result = await validateDayClick(month, day);
      setStatus(result);
      if (!result.canClaim) {
        setError(result);
      }
    } catch (err) {
      setError({ message: 'Failed to check prize status', type: 'ERROR' });
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleClaim = async () => {
    if (!user.id) {
      setError({
        message: 'Please login to claim this prize',
        type: 'NO_USER'
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await claimReward(month, day);
      alert(`Congratulations ${result.userName}! You won: ${result.prize}`);
      onClose();
    } catch (err) {
      setError({
        message: err.message,
        type: err.type || 'ERROR'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">Prize for {formattedDate}</h2>
        
        {user.id && (
          <p className="text-sm text-gray-600 mb-4">
            Logged in as: {user.name} (ID: {user.id})
          </p>
        )}

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm
            ${prizeData?.type === 'coins' ? 'bg-yellow-100 text-yellow-800' :
              prizeData?.type === 'gem' ? 'bg-blue-100 text-blue-800' :
              prizeData?.type === 'chest' ? 'bg-purple-100 text-purple-800' :
              prizeData?.type === 'potion' ? 'bg-green-100 text-green-800' :
              prizeData?.type === 'special' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'}`}
          >
            <span className="font-medium">
              {prizeData?.type === 'coins' && '🪙'}
              {prizeData?.type === 'gem' && '💎'}
              {prizeData?.type === 'chest' && '🎁'}
              {prizeData?.type === 'potion' && '🧪'}
              {prizeData?.type === 'special' && '✨'}
            </span>
            {prizeData?.description}
            {prizeData?.amount && <span className="font-bold">({prizeData.amount})</span>}
            {prizeData?.rarity && <span className="text-xs opacity-75">[{prizeData.rarity}]</span>}
          </div>
        </div>
        
        {error && (
          <div className={`mb-4 p-3 rounded ${
            error.type === 'PAST_DATE' ? 'bg-gray-100 text-gray-800' :
            error.type === 'FUTURE_DATE' ? 'bg-blue-100 text-blue-800' :
            error.type === 'INCOMPLETE_MONTH' ? 'bg-yellow-100 text-yellow-800' :
            error.type === 'NO_USER' ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              {error.type === 'PAST_DATE' && <span>⏰</span>}
              {error.type === 'FUTURE_DATE' && <span>📅</span>}
              {error.type === 'INCOMPLETE_MONTH' && <span>🎯</span>}
              {error.type === 'NO_USER' && <span>👤</span>}
              {error.message}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          {!user.id ? (
            <p className="text-sm text-gray-600 italic mr-auto">
              Login to claim this prize
            </p>
          ) : null}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 disabled:opacity-50
              hover:bg-blue-600 transition-colors"
            onClick={handleClaim}
            disabled={isLoading || (error && error.type !== 'NO_USER' && error.type !== 'CURRENT_DATE')}
          >
            {isLoading ? 'Claiming...' : 'Claim'}
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded
              hover:bg-gray-600 transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 