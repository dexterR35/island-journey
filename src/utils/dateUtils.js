export const getMonthKey = (date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
};

export const isDateLocked = (date) => {
  const today = new Date();
  return date > today;
};

export const isDateActive = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const formatMonth = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1); // month - 1 because months are 0-based
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export const parseMonthKey = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1);
};

export const isCurrentMonth = (monthKey) => {
  const today = new Date();
  return monthKey === getMonthKey(today);
};

export const isPreviousMonthCompleted = (monthKey, completedDays) => {
  const [year, month] = monthKey.split('-').map(Number);
  const previousMonth = new Date(year, month - 2, 1);
  const previousMonthKey = getMonthKey(previousMonth);
  
  // Get all completed days from previous month
  const previousMonthCompletedDays = completedDays.filter(day => 
    day.startsWith(previousMonthKey)
  );

  const daysInPreviousMonth = new Date(year, month - 1, 0).getDate();
  return previousMonthCompletedDays.length === daysInPreviousMonth;
}; 