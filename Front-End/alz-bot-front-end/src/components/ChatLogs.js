import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

const ChatLogs = () => {
  const [chatLogs, setChatLogs] = useState([]);

  // Function to format timestamp safely
  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp) return 'No date';
      return format(parseISO(timestamp), 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid date';
    }
  };

  // Get alert severity class
  const getAlertClass = (hasAlert) => {
    if (!hasAlert) return 'border-l-4 border-gray-200';
    return 'border-l-4 border-red-500 bg-red-50';
  };

  // Load chat logs from localStorage
  useEffect(() => {
    try {
      const storedLogs = JSON.parse(localStorage.getItem('chatLogs') || '[]');
      setChatLogs(storedLogs.filter(log => log !== null));
    } catch (error) {
      console.error('Error loading chat logs:', error);
      setChatLogs([]);
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Conversation History</h2>
      
      <div className="space-y-4">
        {chatLogs.map((log, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg ${getAlertClass(log.alert)}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">
                {formatTimestamp(log.timestamp)}
              </span>
              <span className={`text-sm ${
                log.user_type === 'patient' ? 'text-blue-600' : 'text-green-600'
              }`}>
                {log.user_type === 'patient' ? 'Pam' : 'Laurel'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="font-medium text-gray-700 mr-2">User:</span>
                <p className="text-gray-900">{log.user_message}</p>
              </div>
              
              <div className="flex items-start">
                <span className="font-medium text-gray-700 mr-2">Bot:</span>
                <p className="text-gray-900">{log.bot_response}</p>
              </div>
              
              {log.alert && log.alert_message && (
                <div className="mt-2 text-red-600 text-sm">
                  ⚠️ {log.alert_message}
                </div>
              )}
            </div>
          </div>
        ))}

        {chatLogs.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No conversation logs available
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLogs; 