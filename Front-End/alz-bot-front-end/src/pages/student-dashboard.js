import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Chatbot from '../components/Chatbot';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'student') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <h1 className="text-2xl font-bold text-center mt-4">Student Dashboard</h1>
      <Chatbot />
      {/* Add points and rewards display here */}
    </div>
  );
};

export default StudentDashboard; 