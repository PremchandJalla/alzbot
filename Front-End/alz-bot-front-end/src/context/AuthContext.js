import { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    // Temporary credentials for POC
    const tempCredentials = {
      patient: { username: 'patientUser', password: 'patientPass' },
      caregiver: { username: 'adminUser', password: 'adminPass' },
    };

    if (
      credentials.username === tempCredentials.patient.username &&
      credentials.password === tempCredentials.patient.password
    ) {
      // Simulate a successful login for patient
      const userData = { username: credentials.username, role: 'patient' };
      setUser(userData);
      console.log('Logged in user:', userData);
    } else if (
      credentials.username === tempCredentials.caregiver.username &&
      credentials.password === tempCredentials.caregiver.password
    ) {
      // Simulate a successful login for caregiver
      const userData = { username: credentials.username, role: 'caregiver' };
      setUser(userData);
      console.log('Logged in user:', userData);
    } else {
      console.error('Invalid credentials');
      // Handle invalid credentials (e.g., show an error message)
    }
  };

  const logout = () => {
    setUser(null);
    // Remove JWT token from storage (optional)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 