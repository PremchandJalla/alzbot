import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

const Reminders = React.forwardRef((_, ref) => {
  const [reminders, setReminders] = useState([]);
  const [showReminders, setShowReminders] = useState(false);

  useEffect(() => {
    // Load reminders from localStorage
    const storedReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    setReminders(storedReminders);
  }, []);

  // Add new reminder (called from Chatbot component)
  React.useImperativeHandle(ref, () => ({
    addReminder: (reminder) => {
      const updatedReminders = [...reminders, reminder];
      setReminders(updatedReminders);
      localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    }
  }));

  const formatReminderTime = (timestamp) => {
    try {
      return format(parseISO(timestamp), 'MMM d, h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getReminderIcon = (type) => {
    switch (type) {
      case 'medication':
        return '💊';
      case 'appointment':
        return '🏥';
      default:
        return '⏰';
    }
  };

  const removeReminder = (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setShowReminders(!showReminders)} 
        className="bg-indigo-500 text-white rounded-full p-2 shadow-lg"
        aria-label="Show reminders"
      >
        🗓️
      </button>

      {showReminders && (
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm mt-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Reminders</h3>
            <button onClick={() => setShowReminders(false)} className="text-sm text-indigo-600">Close</button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {reminders.map((reminder, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-slate-50 rounded-md border border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl" role="img" aria-label="reminder type">
                    {getReminderIcon(reminder.type)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{reminder.text}</p>
                    <p className="text-xs text-slate-500">
                      {formatReminderTime(reminder.time)}
                    </p>
                  </div>
                </div>
                <button onClick={() => removeReminder(index)} className="text-red-500">❌</button>
              </div>
            ))}
            
            {reminders.length === 0 && (
              <p className="text-center text-slate-500 py-2">No active reminders</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default Reminders; 