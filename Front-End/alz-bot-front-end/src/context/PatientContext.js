import { createContext, useState } from 'react';

// Temporary patient data
const DEMO_PATIENTS = [
  {
    id: "p1",
    name: "John Doe",
    age: 78,
    condition: "Alzheimer's (Moderate)",
    lastActive: "2 hours ago",
    chatLogs: [
      {
        id: 1,
        timestamp: '10:30 AM',
        message: "I'm feeling confused about my medication",
        response: "Let me help you with that. Your next medication is the blue pill at 11:00 AM.",
        sentiment: 'concerned'
      }
    ],
    medicalFiles: [
      { id: 1, name: 'Medical History.pdf', type: 'pdf', uploadedAt: '2024-01-15' },
      { id: 2, name: 'Brain Scan.jpg', type: 'image', uploadedAt: '2024-01-10' }
    ]
  },
  {
    id: "p2",
    name: "Sarah Williams",
    age: 82,
    condition: "Alzheimer's (Early Stage)",
    lastActive: "30 minutes ago",
    chatLogs: [
      {
        id: 1,
        timestamp: '09:45 AM',
        message: "What day is it today?",
        response: "Today is Monday, February 19th, 2024. You have a doctor's appointment at 2 PM.",
        sentiment: 'neutral'
      }
    ],
    medicalFiles: [
      { id: 1, name: 'Initial Assessment.pdf', type: 'pdf', uploadedAt: '2024-02-01' }
    ]
  }
];

export const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patients] = useState(DEMO_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState(DEMO_PATIENTS[0]);

  const selectPatient = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
    }
  };

  const uploadMedicalFile = (patientId, file) => {
    // Temporary file upload handler
    console.log(`Uploading file for patient ${patientId}:`, file);
  };

  return (
    <PatientContext.Provider value={{ 
      patients, 
      selectedPatient, 
      selectPatient,
      uploadMedicalFile 
    }}>
      {children}
    </PatientContext.Provider>
  );
}; 