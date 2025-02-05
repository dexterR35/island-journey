import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { prizes } from '../data/prizes';

export default function UserForm() {
  const { user, changeUser, completedDays } = useGame();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    changeUser(userId, userName);
  };

  const getUserPrizes = () => {
    return completedDays.map(dayKey => {
      const [monthKey, day] = dayKey.split('-');
      return prizes[monthKey]?.[day];
    }).filter(Boolean);
  };

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow">
      {user.id ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg">Current User: <span className="font-bold">{user.name}</span></p>
              <p className="text-sm text-gray-600">ID: {user.id}</p>
            </div>
            <button
              onClick={() => changeUser('', '')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          
          {/* Claimed Prizes Section */}
          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Claimed Prizes:</h3>
            <div className="flex flex-wrap gap-2">
              {getUserPrizes().map((prize, index) => (
                <div 
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-2
                    ${prize.type === 'coins' ? 'bg-yellow-100 text-yellow-800' :
                      prize.type === 'gem' ? 'bg-blue-100 text-blue-800' :
                      prize.type === 'chest' ? 'bg-purple-100 text-purple-800' :
                      prize.type === 'potion' ? 'bg-green-100 text-green-800' :
                      prize.type === 'special' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'}`}
                >
                  <span className="font-medium">
                    {prize.type === 'coins' && '🪙'}
                    {prize.type === 'gem' && '💎'}
                    {prize.type === 'chest' && '🎁'}
                    {prize.type === 'potion' && '🧪'}
                    {prize.type === 'special' && '✨'}
                  </span>
                  {prize.description}
                  {prize.amount && <span className="font-bold">({prize.amount})</span>}
                  {prize.rarity && <span className="text-xs opacity-75">[{prize.rarity}]</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
} 