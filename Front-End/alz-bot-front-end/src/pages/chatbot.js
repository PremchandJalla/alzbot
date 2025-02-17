import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Chatbot from '../components/Chatbot';

const ChatbotPage = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'patient') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Chatbot />
    </div>
  );
};

export default ChatbotPage; 