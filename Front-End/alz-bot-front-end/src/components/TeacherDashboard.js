import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  FaChartLine, FaUserGraduate, FaComments, 
  FaBookMedical, FaTrophy, FaCog, FaBars,
  FaSignOutAlt, FaClock, FaStar
} from 'react-icons/fa';

// Placeholder data
const DUMMY_STUDENTS = [
  { id: 1, name: "John Doe", points: 150, correctGuesses: 5, caseStudies: 3, lastActive: "1 hour ago" },
  { id: 2, name: "Jane Smith", points: 250, correctGuesses: 8, caseStudies: 5, lastActive: "30 mins ago" },
  { id: 3, name: "Emily Johnson", points: 180, correctGuesses: 6, caseStudies: 4, lastActive: "2 hours ago" },
];

const DUMMY_CHAT_LOGS = [
  {
    id: 1,
    student: "John Doe",
    message: "I think the best caregiving strategy is to redirect attention",
    response: "That's a good approach! Consider also the timing of the intervention.",
    timestamp: "10:30 AM"
  },
  {
    id: 2,
    student: "Jane Smith",
    message: "How should I handle memory loss episodes?",
    response: "Redirect the conversation to familiar topics and maintain a calm environment.",
    timestamp: "11:15 AM"
  },
];

const DUMMY_CASE_STUDIES = [
  {
    id: 1,
    student: "John Doe",
    title: "Handling Aggression in Alzheimer's Patients",
    date: "Feb 24, 2025",
    status: "Pending Review"
  },
  {
    id: 2,
    student: "Jane Smith",
    title: "Effective Communication Techniques",
    date: "Feb 23, 2025",
    status: "Reviewed"
  },
];

const TeacherDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'progress', label: 'Student Progress', icon: FaUserGraduate },
    { id: 'chat-logs', label: 'Chat Logs', icon: FaComments },
    { id: 'case-studies', label: 'Case Studies', icon: FaBookMedical },
    { id: 'leaderboard', label: 'Leaderboard', icon: FaTrophy },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'progress':
        return <StudentProgressSection />;
      case 'chat-logs':
        return <ChatLogsSection />;
      case 'case-studies':
        return <CaseStudiesSection />;
      case 'leaderboard':
        return <LeaderboardSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 bg-white border-r border-slate-200 flex flex-col
      `}>
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-slate-900">Teacher Portal</h1>
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
        
        {/* Logout Button */}
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
      </div>
    </div>
  );
};

// Section Components
const OverviewSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={FaUserGraduate}
        title="Total Students"
        value="15"
        trend="+2 this week"
      />
      <StatCard
        icon={FaBookMedical}
        title="Case Studies"
        value="25"
        trend="12 pending review"
      />
      <StatCard
        icon={FaStar}
        title="Average Score"
        value="85%"
        trend="+5% from last week"
      />
    </div>
  </div>
);

const StudentProgressSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Student Progress</h2>
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Student
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Points
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Correct Guesses
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Case Studies
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              Last Active
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {DUMMY_STUDENTS.map((student) => (
            <tr key={student.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">{student.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">{student.points}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">{student.correctGuesses}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">{student.caseStudies}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-500">{student.lastActive}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ChatLogsSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Student Chat Logs</h2>
    <div className="bg-white rounded-lg shadow-md p-6">
      {DUMMY_CHAT_LOGS.map((log) => (
        <div key={log.id} className="mb-6 border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FaUserGraduate className="text-indigo-500 mr-2" />
              <span className="font-medium text-slate-900">{log.student}</span>
            </div>
            <span className="text-sm text-slate-500">{log.timestamp}</span>
          </div>
          <div className="ml-8 space-y-2">
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-slate-600">
                <span className="font-medium">Student: </span>
                {log.message}
              </p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-slate-600">
                <span className="font-medium">Bot: </span>
                {log.response}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LeaderboardSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Student Leaderboard</h2>
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Top Performers</h3>
          <select className="border rounded-lg px-3 py-2 text-slate-600">
            <option>All Time</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
        {DUMMY_STUDENTS.sort((a, b) => b.points - a.points).map((student, index) => (
          <div 
            key={student.id}
            className="flex items-center justify-between p-4 border-b border-slate-200"
          >
            <div className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                  index === 1 ? 'bg-slate-100 text-slate-600' :
                  index === 2 ? 'bg-amber-100 text-amber-600' :
                  'bg-slate-50 text-slate-500'}
              `}>
                {index + 1}
              </div>
              <div className="ml-4">
                <p className="font-medium text-slate-900">{student.name}</p>
                <p className="text-sm text-slate-500">
                  {student.correctGuesses} correct guesses
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-indigo-600">{student.points} pts</p>
              <p className="text-sm text-slate-500">
                {student.caseStudies} case studies
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SettingsSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-900">Dashboard Settings</h2>
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        {/* Notifications Settings */}
        <div className="border-b border-slate-200 pb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-indigo-600" defaultChecked />
              <span className="ml-2">Email notifications for new case studies</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-indigo-600" defaultChecked />
              <span className="ml-2">Daily student progress summary</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-indigo-600" />
              <span className="ml-2">Weekly performance reports</span>
            </label>
          </div>
        </div>

        {/* Display Settings */}
        <div className="border-b border-slate-200 pb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Display Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Default Dashboard View
              </label>
              <select className="w-full border rounded-lg px-3 py-2 text-slate-600">
                <option>Overview</option>
                <option>Student Progress</option>
                <option>Chat Logs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Items per page
              </label>
              <select className="w-full border rounded-lg px-3 py-2 text-slate-600">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                className="w-full border rounded-lg px-3 py-2"
                defaultValue="teacher@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <button className="text-indigo-600 hover:text-indigo-700">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, title, value, trend }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon className="w-8 h-8 text-indigo-500" />
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
    <p className="mt-2 text-sm text-slate-600">{trend}</p>
  </div>
);

export default TeacherDashboard; 