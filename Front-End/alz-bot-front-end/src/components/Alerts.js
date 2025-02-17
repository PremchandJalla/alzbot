import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Load alerts from chat logs
    const chatLogs = JSON.parse(localStorage.getItem('chatLogs') || '[]');
    const activeAlerts = chatLogs
      .filter(log => log?.alert && log?.alert_type)
      .map(log => ({
        id: log.timestamp,
        type: log.alert_type,
        message: log.alert_message,
        severity: log.severity,
        timestamp: log.timestamp,
        userMessage: log.user_message
      }))
      .slice(0, 5); // Show only 5 most recent alerts

    setAlerts(activeAlerts);
  }, []);

  const getAlertStyle = (type, severity) => {
    const baseStyle = 'border-l-4 rounded-lg';
    
    if (severity === 'high') {
      return `${baseStyle} bg-red-50 border-red-500`;
    }
    
    switch (type) {
      case 'MEDICATION_MISSED':
        return `${baseStyle} bg-red-50 border-red-500`;
      case 'SLEEP_DISRUPTION':
        return `${baseStyle} bg-purple-50 border-purple-500`;
      case 'ROUTINE_DEVIATION':
        return `${baseStyle} bg-amber-50 border-amber-500`;
      case 'CONFUSION':
        return `${baseStyle} bg-orange-50 border-orange-500`;
      case 'WANDERING':
        return `${baseStyle} bg-red-50 border-red-500`;
      default:
        return `${baseStyle} bg-amber-50 border-amber-500`;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'MEDICATION_MISSED':
        return '💊';
      case 'SLEEP_DISRUPTION':
        return '😴';
      case 'ROUTINE_DEVIATION':
        return '📅';
      case 'CONFUSION':
        return '❓';
      case 'WANDERING':
        return '🚶';
      default:
        return '⚠️';
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp) return 'No date';
      return format(parseISO(timestamp), 'MMM d, h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Active Alerts</h2>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`${getAlertStyle(alert.type, alert.severity)} p-4`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-2xl" role="img" aria-label="alert icon">
                  {getAlertIcon(alert.type)}
                </span>
                <div>
                  <h3 className="font-medium text-slate-900">
                    {alert.type.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {alert.message}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Trigger: "{alert.userMessage}"
                  </p>
                </div>
              </div>
              <span className="text-sm text-slate-500">
                {formatTimestamp(alert.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="text-center py-6 text-slate-500">
            No active alerts
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts; 