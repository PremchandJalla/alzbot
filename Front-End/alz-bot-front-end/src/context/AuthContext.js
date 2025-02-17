import { createContext, useState } from 'react';
import { useRouter } from 'next/router';

export const AuthContext = createContext();

// Hardcoded credentials for POC
const CREDENTIALS = {
  caregiver: { username: 'laurel', password: 'caregiver123' },
  patient: { username: 'pam', password: 'patient123' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (credentials) => {
    // Check against hardcoded credentials
    if (
      credentials.username === CREDENTIALS.caregiver.username &&
      credentials.password === CREDENTIALS.caregiver.password
    ) {
      const userData = {
        username: 'laurel',
        role: 'caregiver',
        displayName: 'Laurel (Caregiver)'
      };
      setUser(userData);
      router.push('/dashboard');
    } else if (
      credentials.username === CREDENTIALS.patient.username &&
      credentials.password === CREDENTIALS.patient.password
    ) {
      const userData = {
        username: 'pam',
        role: 'patient',
        displayName: 'Pam',
        medicalInfo: {
          age: 72,
          condition: "Alzheimer's (Moderate)",
          routines: [],
          medicalHistory: []
        }
      };
      setUser(userData);
      router.push('/chatbot');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 