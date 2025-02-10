const Alerts = () => {
  const mockAlerts = [
    {
      id: 1,
      type: 'urgent',
      message: 'Missed evening medication',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Unusual night-time activity detected',
      time: '4 hours ago'
    }
  ];

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Active Alerts</h2>
      <div className="space-y-4">
        {mockAlerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-4 rounded-lg border-l-4 ${
              alert.type === 'urgent' 
                ? 'bg-red-50 border-red-500' 
                : 'bg-amber-50 border-amber-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`font-medium ${
                  alert.type === 'urgent' ? 'text-red-800' : 'text-amber-800'
                }`}>
                  {alert.message}
                </p>
                <p className="text-slate-700 text-sm mt-1">{alert.time}</p>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                Mark as Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts; 