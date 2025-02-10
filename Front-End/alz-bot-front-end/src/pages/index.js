import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Chatbot from '../components/Chatbot';
import { useRouter } from 'next/router';

const Home = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'patient') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Chatbot />
    </div>
  );
};

export default Home;
