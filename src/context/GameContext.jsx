import { createContext, useState, useContext, useEffect } from 'react';
import { getMonthKey, isDateLocked, isDateActive, isCurrentMonth, isPreviousMonthCompleted } from '../utils/dateUtils';
import { prizes } from '../data/prizes';

// Create the context
const GameContext = createContext(null);

// Export the useGame hook
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// Export the RewardError class
export class RewardError extends Error {
  constructor(message, type) {
    super(message);
    this.type = type;
  }
}

// Export the GameProvider component
export function GameProvider({ children }) {
  // Add user state
  const [user, setUser] = useState({
    id: "",
    name: ""
  });

  // Modify completedDays to track per user
  const [completedDays, setCompletedDays] = useState({});
  const [rewards, setRewards] = useState({});
  const [activeMonths, setActiveMonths] = useState([]);

  // Function to change user
  const changeUser = (userId, userName) => {
    setUser({
      id: userId,
      name: userName
    });
    // Initialize completedDays for new user if not exists
    setCompletedDays(prev => ({
      ...prev,
      [userId]: prev[userId] || []
    }));
  };

  // Get completed days for current user
  const getCurrentUserCompletedDays = () => {
    return completedDays[user.id] || [];
  };

  // Initialize active months
  useEffect(() => {
    const today = new Date();
    const months = [];
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(getMonthKey(date));
    }
    
    setActiveMonths(months);
  }, []);

  // Initialize rewards data
  useEffect(() => {
    const initializeRewards = () => {
      const rewardsData = {};
      
      activeMonths.forEach(monthKey => {
        const [year, month] = monthKey.split('-').map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();
        
        rewardsData[monthKey] = {};
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month - 1, day);
          rewardsData[monthKey][day] = {
            prize: prizes[monthKey]?.[day]?.description || `Prize for ${monthKey}-${day}`,
            prizeData: prizes[monthKey]?.[day] || { type: 'default', description: `Prize for ${monthKey}-${day}` },
            claimed: false,
            locked: isDateLocked(date),
            active: isDateActive(date)
          };
        }
      });
      
      setRewards(rewardsData);
    };

    if (activeMonths.length > 0) {
      initializeRewards();
    }
  }, [activeMonths]);

  const validateRewardClaim = async (monthKey, day) => {
    const reward = rewards[monthKey]?.[day];
    if (!reward) {
      throw new RewardError('Invalid reward', 'INVALID_REWARD');
    }

    // Check if it's a future date in current month
    const date = new Date(monthKey.split('-')[0], parseInt(monthKey.split('-')[1]) - 1, day);
    if (isCurrentMonth(monthKey) && isDateLocked(date)) {
      throw new RewardError(`Come back on ${date.toLocaleDateString()} to claim this prize!`, 'FUTURE_DATE');
    }

    // Check if trying to claim from a future month
    if (!isCurrentMonth(monthKey)) {
      const currentMonthKey = getMonthKey(new Date());
      const currentMonthCompleted = isPreviousMonthCompleted(monthKey, completedDays);
      
      if (!currentMonthCompleted) {
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        throw new RewardError(
          `Please complete all prizes in ${currentMonth} before claiming future months!`,
          'INCOMPLETE_MONTH'
        );
      }
    }

    if (reward.claimed) {
      throw new RewardError('You have already claimed this prize!', 'ALREADY_CLAIMED');
    }

    if (!reward.active) {
      throw new RewardError('This prize is not available yet', 'INACTIVE_REWARD');
    }

    return true;
  };

  // Modified validation to check per user
  const validateDayClick = async (monthKey, day) => {
    return new Promise((resolve) => {
      const reward = rewards[monthKey]?.[day];
      const prizeData = prizes[monthKey]?.[day];
      const date = new Date(monthKey.split('-')[0], parseInt(monthKey.split('-')[1]) - 1, day);
      const today = new Date();
      
      if (!reward) {
        resolve({ 
          canOpen: true, 
          message: 'Invalid day selected',
          showPrize: true,
          canClaim: false,
          type: 'INVALID'
        });
        return;
      }

      // Past days
      if (date < today && !isSameDay(date, today)) {
        resolve({ 
          canOpen: true,
          message: `Prize is outdated for ${date.toLocaleDateString()}`,
          showPrize: true,
          canClaim: false,
          type: 'PAST_DATE',
          prizeData
        });
        return;
      }

      // Future date in current month
      if (date > today && !isSameDay(date, today)) {
        resolve({ 
          canOpen: true,
          message: `Prize will be available on ${date.toLocaleDateString()}`,
          showPrize: true,
          canClaim: false,
          type: 'FUTURE_DATE',
          prizeData
        });
        return;
      }

      // Already claimed by current user
      const userCompletedDays = getCurrentUserCompletedDays();
      if (userCompletedDays.includes(`${monthKey}-${day}`)) {
        resolve({ 
          canOpen: true,
          message: 'You have already claimed this prize!',
          showPrize: true,
          canClaim: false,
          type: 'ALREADY_CLAIMED',
          prizeData
        });
        return;
      }

      // Current day - allow claiming
      if (isSameDay(date, today)) {
        resolve({ 
          canOpen: true,
          showPrize: true,
          canClaim: true,
          type: 'CURRENT_DATE',
          prizeData
        });
        return;
      }

      // Future month
      resolve({ 
        canOpen: true,
        message: 'Complete the current month first!',
        showPrize: true,
        canClaim: false,
        type: 'FUTURE_MONTH',
        prizeData
      });
    });
  };

  // Helper function to compare dates
  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };

  const claimReward = async (monthKey, day) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!user.id) {
          reject(new RewardError('Please login to claim this prize', 'NO_USER'));
          return;
        }

        const validation = await validateDayClick(monthKey, day);
        if (!validation.canClaim) {
          reject(new RewardError(validation.message || 'Cannot claim this prize', validation.type));
          return;
        }

        // Simulate network delay
        await new Promise(r => setTimeout(r, 500));

        // Update completedDays for current user
        setCompletedDays(prev => ({
          ...prev,
          [user.id]: [...(prev[user.id] || []), `${monthKey}-${day}`]
        }));

        resolve({ 
          success: true, 
          prize: validation.prizeData.description,
          prizeData: validation.prizeData,
          userName: user.name 
        });
      } catch (error) {
        reject(new RewardError('Failed to claim prize', 'ERROR'));
      }
    });
  };

  const getWaypointStatus = (monthKey, day) => {
    const reward = rewards[monthKey]?.[day];
    if (!reward) return 'locked';
    
    if (reward.claimed) return 'completed';
    if (reward.active) return 'active';
    if (reward.locked) return 'locked';
    return 'inactive';
  };

  const value = {
    user,
    changeUser,
    completedDays: getCurrentUserCompletedDays(),
    rewards,
    claimReward,
    validateDayClick,
    activeMonths,
    isIslandActive: (monthKey) => activeMonths.includes(monthKey),
    getWaypointStatus
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
} 