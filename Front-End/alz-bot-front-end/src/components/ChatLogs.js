const ChatLogs = () => {
  const mockLogs = [
    {
      id: 1,
      timestamp: '10:30 AM',
      message: "I'm feeling a bit confused today",
      response: "I understand. Let's take it step by step. Can you tell me what's confusing you?",
      sentiment: 'concerned'
    },
    {
      id: 2,
      timestamp: '11:45 AM',
      message: "What time is my medication?",
      response: "Your next medication is scheduled for 12:00 PM, in about 15 minutes. It's the blue pill with water.",
      sentiment: 'neutral'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Chat History</h2>
        <div className="flex space-x-2">
          <select className="border rounded-md px-3 py-2 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option>All Messages</option>
            <option>Important</option>
            <option>Flagged</option>
          </select>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
            Export Logs
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {mockLogs.map((log) => (
          <div key={log.id} className="border rounded-lg p-4 hover:bg-indigo-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-slate-900">{log.timestamp}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                log.sentiment === 'concerned' 
                  ? 'bg-amber-100 text-amber-900' 
                  : 'bg-emerald-100 text-emerald-900'
              }`}>
                {log.sentiment}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-slate-900">
                <span className="font-medium text-indigo-900">Patient:</span> {log.message}
              </p>
              <p className="text-slate-900">
                <span className="font-medium text-indigo-900">Bot:</span> {log.response}
              </p>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="text-sm text-indigo-600 hover:text-indigo-800">Flag</button>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">Add Note</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatLogs; 