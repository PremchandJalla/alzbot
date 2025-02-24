import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import TeacherDashboard from '../components/TeacherDashboard';

const TeacherDashboardPage = () => {
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

  return <TeacherDashboard />;
};

export default TeacherDashboardPage; 