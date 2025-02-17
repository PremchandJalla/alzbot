import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChatLogs from '../components/ChatLogs';
import RoutineManager from '../components/RoutineManager';
import MedicalHistoryManager from '../components/MedicalHistoryManager';
import Alerts from '../components/Alerts';
import PatientProfile from '../components/PatientProfile';
import MedicalFiles from '../components/MedicalFiles';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');

  // Check if the user is authenticated and has the correct role
  if (!user || user.role !== 'caregiver') {
    return <div>Access Denied</div>;
  }

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'routines', label: 'Routines', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'medical-history', label: 'Medical History', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'chat-logs', label: 'Chat Logs', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: 'alerts', label: 'Alerts', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <PatientProfile />;
      case 'routines':
        return <RoutineManager />;
      case 'medical-history':
        return <MedicalHistoryManager />;
      case 'chat-logs':
        return <ChatLogs />;
      case 'alerts':
        return <Alerts />;
      default:
        return <PatientProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-slate-900">Caregiver Dashboard</h1>
            <div className="flex items-center">
              <span className="mr-4 text-slate-600">Welcome, {user?.username}</span>
              <button 
                onClick={logout} 
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      activeTab === item.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-900 hover:bg-indigo-50 hover:text-indigo-700'
                    }`}
                  >
                    <svg
                      className={`mr-3 h-6 w-6 ${
                        activeTab === item.id ? 'text-indigo-500' : 'text-slate-600'
                      }`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d={item.icon} />
                    </svg>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>

          {/* Right Sidebar - Quick Stats */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <p className="text-sm font-medium text-slate-900">Today's Interactions</p>
                  <p className="text-lg font-semibold text-indigo-700">12</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <p className="text-sm font-medium text-slate-900">Completed Tasks</p>
                  <p className="text-lg font-semibold text-emerald-700">8/10</p>
                </div>
                <div className="border-l-4 border-amber-500 pl-4">
                  <p className="text-sm font-medium text-slate-900">Pending Alerts</p>
                  <p className="text-lg font-semibold text-amber-700">2</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-sm font-medium text-slate-900">Task Compliance</p>
                  <div className="flex items-center">
                    <p className="text-lg font-semibold text-purple-700">80%</p>
                    <div className="ml-2 w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: '80%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 