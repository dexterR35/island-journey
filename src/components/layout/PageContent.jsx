import { formatMonth } from '../../utils/dateUtils';
import { useGame } from '../../context/GameContext';
import { prizes } from '../../data/prizes';

const SPONSOR_GAMES = [
  { name: "Slots Paradise", icon: "🎰", bonus: "200 Free Spins" },
  { name: "Poker Masters", icon: "♠️", bonus: "$50 Free Play" },
  { name: "Lucky Roulette", icon: "🎲", bonus: "100% Match Bonus" },
  { name: "Blackjack Pro", icon: "🃏", bonus: "$25 No Deposit" },
  { name: "Mega Slots", icon: "💎", bonus: "50 Free Spins" },
  { name: "Royal Flush", icon: "👑", bonus: "$100 Welcome" },
  { name: "Fortune Wheel", icon: "🎡", bonus: "Daily Spin Bonus" },
  { name: "Golden Cards", icon: "🏆", bonus: "VIP Package" },
  { name: "Lucky Draw", icon: "🎯", bonus: "Weekly Cashback" },
  { name: "Casino Royale", icon: "💫", bonus: "High Roller Bonus" },
];

export default function PageContent({ monthKey }) {
  const { getCurrentUserCompletedDays } = useGame();
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  // Get current day's prize
  const currentPrize = prizes[monthKey]?.[currentDay];

  return (
    <div className="bg-white rounded-lg shadow-lg h-full">
      <div className="p-6 space-y-8 min-h-[calc(100vh-12rem)]">
        {/* Today's Prize Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-500">🎁</span>
            Today's Prize
          </h2>
          {currentPrize && (
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  {currentPrize.type === 'coins' && <span className="text-2xl">🪙</span>}
                  {currentPrize.type === 'gem' && <span className="text-2xl">💎</span>}
                  {currentPrize.type === 'chest' && <span className="text-2xl">🎁</span>}
                  {currentPrize.type === 'potion' && <span className="text-2xl">🧪</span>}
                  {currentPrize.type === 'special' && <span className="text-2xl">✨</span>}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{currentPrize.description}</h3>
                  {currentPrize.amount && (
                    <p className="text-sm text-gray-600">Amount: {currentPrize.amount}</p>
                  )}
                  {currentPrize.rarity && (
                    <p className="text-sm text-gray-600">Rarity: {currentPrize.rarity}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Special Offers Text */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-500">📢</span>
            Special Offers
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p>Welcome to {formatMonth(monthKey)}! This month we have amazing rewards waiting for you:</p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Daily prizes increase in value throughout the month</li>
              <li>Special weekend bonuses</li>
              <li>Bonus rewards for consecutive daily claims</li>
              <li>Exclusive monthly collector items</li>
            </ul>
          </div>
        </section>

        {/* Sponsors Section - Casino Style Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-500">🎰</span>
            Featured Games
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SPONSOR_GAMES.map((game, index) => (
              <div 
                key={index}
                className="p-4 border rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 text-white hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <span className="text-3xl mb-2">{game.icon}</span>
                  <h3 className="font-bold text-sm">{game.name}</h3>
                  <div className="text-xs px-2 py-1 bg-yellow-500 text-black rounded-full font-bold">
                    {game.bonus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Terms & Conditions Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-500">📜</span>
            Terms & Conditions
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2">1. Prize Eligibility</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Must be 18 years or older to participate</li>
                <li>Valid account registration required</li>
                <li>One prize claim per user per day</li>
                <li>Prizes must be claimed within 24 hours</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-2">2. Game Rules</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>All games are subject to individual terms</li>
                <li>Bonus credits expire after 30 days</li>
                <li>Wagering requirements may apply</li>
                <li>Maximum withdrawal limits may apply</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">3. General Conditions</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Management reserves the right to modify or cancel promotions</li>
                <li>Abuse of promotions will result in account suspension</li>
                <li>All decisions are final and binding</li>
                <li>Regional restrictions may apply</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 