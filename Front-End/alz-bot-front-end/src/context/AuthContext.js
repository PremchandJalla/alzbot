import { createContext, useState } from 'react';
import { useRouter } from 'next/router';

export const AuthContext = createContext();

// Hardcoded credentials for POC
const CREDENTIALS = {
  caregiver: { username: 'laurel', password: 'caregiver123' },
  patient: { username: 'pam', password: 'patient123' },
  student: { username: 'studentUser', password: 'student123' },
  teacher: { username: 'teacherUser', password: 'teacher123' }
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
    } else if (
      credentials.username === CREDENTIALS.student.username &&
      credentials.password === CREDENTIALS.student.password
    ) {
      const userData = {
        username: 'studentUser',
        role: 'student',
        displayName: 'Student User'
      };
      setUser(userData);
      router.push('/student-dashboard');
    } else if (
      credentials.username === CREDENTIALS.teacher.username &&
      credentials.password === CREDENTIALS.teacher.password
    ) {
      const userData = {
        username: 'teacherUser',
        role: 'teacher',
        displayName: 'Teacher User'
      };
      setUser(userData);
      router.push('/teacher-dashboard');
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