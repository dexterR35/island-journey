import { useEffect } from 'react';

export default function LoginReminderModal({ onClose, onMaybeLater, onLoginClick }) {
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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 animate-fade-in">
        <div className="text-center mb-6">
          <span className="text-4xl mb-4 block">👋</span>
          <h2 className="text-2xl font-bold mb-2">Welcome to Journey Path!</h2>
          <p className="text-gray-600">
            Login to start claiming your daily prizes and track your progress.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onLoginClick}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Login Now
          </button>
          <button
            onClick={onMaybeLater}
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
} 