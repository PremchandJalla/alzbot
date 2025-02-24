import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Chatbot from './Chatbot';
import { 
  FaTrophy, FaBookMedical, FaLightbulb, FaMedal, 
  FaChartLine, FaComments, FaCog, FaBars,
  FaSignOutAlt
} from 'react-icons/fa';

const StudentDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [caseStudy, setCaseStudy] = useState('');
  const [strategyGuess, setStrategyGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [points, setPoints] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [stats, setStats] = useState({
    casesSubmitted: 0,
    correctGuesses: 0,
    totalAttempts: 0
  });

  // Progress tracking
  const [progress, setProgress] = useState({
    level: 1,
    pointsToNextLevel: 100,
    badges: []
  });

  const navigationItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: FaChartLine },
    { id: 'case-study', label: 'Submit Case Study', icon: FaBookMedical },
    { id: 'strategy', label: 'Guess Strategy', icon: FaLightbulb },
    { id: 'leaderboard', label: 'Leaderboard', icon: FaTrophy },
    { id: 'chat-history', label: 'Chat History', icon: FaComments },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const handleCaseStudySubmit = () => {
    if (!caseStudy.trim()) return;
    
    // Add submission logic here
    setStats(prev => ({
      ...prev,
      casesSubmitted: prev.casesSubmitted + 1
    }));
    
    // Award points
    updatePoints(50);
    
    // Reset form
    setCaseStudy('');
    setFeedback('Case study submitted successfully! +50 points');
    
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleStrategyGuess = () => {
    if (!strategyGuess.trim()) return;

    if (attempts < 2) {
      // Mock check - replace with actual validation
      const isCorrect = Math.random() > 0.5;

      if (isCorrect) {
        updatePoints(100);
        setFeedback('Correct! +100 points');
        setAttempts(0);
        setShowHint(false);
      } else {
        setAttempts(prev => prev + 1);
        if (attempts === 0) {
          setShowHint(true);
          setFeedback('Try again! Here\'s a hint...');
        } else {
          setFeedback('Incorrect. The correct answer is...');
          setTimeout(() => {
            setAttempts(0);
            setShowHint(false);
          }, 3000);
        }
      }
    }

    setStrategyGuess('');
  };

  const updatePoints = (newPoints) => {
    setPoints(prev => prev + newPoints);
    checkLevelUp(points + newPoints);
  };

  const checkLevelUp = (currentPoints) => {
    const newLevel = Math.floor(currentPoints / 100) + 1;
    if (newLevel > progress.level) {
      setProgress(prev => ({
        ...prev,
        level: newLevel,
        pointsToNextLevel: (newLevel * 100) - currentPoints
      }));
      setFeedback(`Level Up! You're now level ${newLevel}! 🎉`);
    }
  };

  const fetchLeaderboard = () => {
    // Fetch leaderboard data from the server
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview stats={stats} progress={progress} points={points} />;
      case 'case-study':
        return <CaseStudySection 
          caseStudy={caseStudy} 
          setCaseStudy={setCaseStudy} 
          onSubmit={handleCaseStudySubmit} 
        />;
      case 'strategy':
        return <StrategySection 
          strategyGuess={strategyGuess}
          setStrategyGuess={setStrategyGuess}
          attempts={attempts}
          showHint={showHint}
          onSubmit={handleStrategyGuess}
        />;
      case 'leaderboard':
        return <LeaderboardSection leaderboard={leaderboard} />;
      case 'chat-history':
        return <ChatHistorySection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-white border-r border-slate-200
        flex flex-col
      `}>
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-slate-900">Student Portal</h1>
            <button 
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaBars />
            </button>
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-colors duration-200
                  ${activeSection === item.id 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50'}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg
              text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-600"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {renderContent()}
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border-l-4 border-indigo-500 animate-fade-in">
            {feedback}
          </div>
        )}

        {/* Chatbot */}
        {activeSection === 'chat-history' && (
          <div className="fixed bottom-4 right-4 z-50">
            <Chatbot />
          </div>
        )}
      </div>
    </div>
  );
};

// Section Components
const DashboardOverview = ({ stats, progress, points }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Current Level</h3>
        <div className="flex items-center space-x-2">
          <FaMedal className="text-indigo-500" />
          <span className="text-2xl font-bold">{progress.level}</span>
        </div>
        <div className="mt-2">
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(points % 100)}%` }}
            />
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {progress.pointsToNextLevel} points to next level
          </p>
        </div>
      </div>
      {/* Add more overview cards here */}
    </div>
  </div>
);

const CaseStudySection = ({ caseStudy, setCaseStudy, onSubmit }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <FaBookMedical className="text-indigo-500 mr-2" />
      <h2 className="text-xl font-semibold">Submit Case Study</h2>
    </div>
    <textarea
      value={caseStudy}
      onChange={(e) => setCaseStudy(e.target.value)}
      className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      placeholder="Describe your case study here..."
      rows="4"
    />
    <button
      onClick={onSubmit}
      className="mt-4 w-full bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors duration-200"
    >
      Submit Case Study
    </button>
  </div>
);

const StrategySection = ({ strategyGuess, setStrategyGuess, attempts, showHint, onSubmit }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <FaLightbulb className="text-indigo-500 mr-2" />
      <h2 className="text-xl font-semibold">Guess Caregiving Strategy</h2>
    </div>
    <div className="space-y-4">
      <input
        type="text"
        value={strategyGuess}
        onChange={(e) => setStrategyGuess(e.target.value)}
        className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        placeholder="Enter your strategy guess..."
      />
      {showHint && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800">Hint: Consider the patient's daily routine...</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">
          Attempts: {attempts}/2
        </span>
        <button
          onClick={onSubmit}
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors duration-200"
        >
          Submit Guess
        </button>
      </div>
    </div>
  </div>
);

const LeaderboardSection = ({ leaderboard }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <FaTrophy className="text-indigo-500 mr-2" />
      <h2 className="text-xl font-semibold">Leaderboard</h2>
    </div>
    <div className="space-y-2">
      {leaderboard.map((entry, index) => (
        <div 
          key={index}
          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
        >
          <div className="flex items-center">
            <span className="w-6 text-center font-semibold">{index + 1}</span>
            <span className="ml-3">{entry.name}</span>
          </div>
          <span className="font-semibold">{entry.points}</span>
        </div>
      ))}
    </div>
  </div>
);

const ChatHistorySection = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <FaComments className="text-indigo-500 mr-2" />
      <h2 className="text-xl font-semibold">Chat History</h2>
    </div>
    {/* Chat history content */}
  </div>
);

const SettingsSection = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <FaCog className="text-indigo-500 mr-2" />
      <h2 className="text-xl font-semibold">Settings</h2>
    </div>
    {/* Settings content */}
  </div>
);

export default StudentDashboard; 