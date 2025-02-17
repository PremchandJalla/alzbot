import React, { useState } from 'react';
import axios from 'axios';

const PREDEFINED_MEDICAL_HISTORY = [
  "Diagnosed with Alzheimer's at age 68",
  "Mild hypertension",
  "Occasional confusion during nighttime"
];

const MedicalHistoryManager = () => {
  const [medicalHistory, setMedicalHistory] = useState(PREDEFINED_MEDICAL_HISTORY);
  const [newEntry, setNewEntry] = useState('');
  const [error, setError] = useState(null);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    try {
      setMedicalHistory([...medicalHistory, newEntry]);
      setNewEntry('');
    } catch (error) {
      setError('Failed to update medical history');
      console.error('Error updating medical history:', error);
    }
  };

  const handleDeleteEntry = async (index) => {
    try {
      const updatedHistory = medicalHistory.filter((_, i) => i !== index);
      setMedicalHistory(updatedHistory);
    } catch (error) {
      setError('Failed to delete entry');
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Pam's Medical History</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleAddEntry} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Add new medical history entry..."
            className="flex-1 border-2 border-indigo-100 rounded-md px-4 py-2 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {medicalHistory.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-slate-50 p-4 rounded-md"
          >
            <span className="text-slate-900">{entry}</span>
            <button
              onClick={() => handleDeleteEntry(index)}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalHistoryManager; 