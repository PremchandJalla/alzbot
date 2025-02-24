import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'teacher') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <h1 className="text-2xl font-bold text-center mt-4">Teacher Dashboard</h1>
      {/* Add student monitoring features here */}
    </div>
  );
};

export default TeacherDashboard; 