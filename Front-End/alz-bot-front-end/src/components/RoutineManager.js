import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PREDEFINED_ROUTINES = [
  "Wake up at 7 AM",
  "Breakfast at 8 AM",
  "Take medication at 9 AM",
  "Go for a walk at 10 AM",
  "Lunch at 12 PM",
  "Afternoon nap at 2 PM",
  "Dinner at 6 PM",
  "Bedtime at 9 PM"
];

const RoutineManager = () => {
  const [routines, setRoutines] = useState(PREDEFINED_ROUTINES);
  const [newRoutine, setNewRoutine] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [error, setError] = useState(null);

  const handleAddRoutine = async (e) => {
    e.preventDefault();
    if (!newRoutine.trim() || !timeSlot) return;

    const routineItem = `${timeSlot} - ${newRoutine}`;
    try {
      setRoutines([...routines, routineItem]);
      setNewRoutine('');
      setTimeSlot('');
    } catch (error) {
      setError('Failed to update routine');
      console.error('Error updating routine:', error);
    }
  };

  const handleDeleteRoutine = async (index) => {
    try {
      const updatedRoutines = routines.filter((_, i) => i !== index);
      setRoutines(updatedRoutines);
    } catch (error) {
      setError('Failed to delete routine');
      console.error('Error deleting routine:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-4">Pam's Daily Routine</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleAddRoutine} className="mb-6">
        <div className="flex gap-4">
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-1/3 border-2 border-indigo-100 rounded-md px-4 py-2 focus:outline-none focus:border-indigo-500"
            required
          >
            <option value="">Select Time</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
          <input
            type="text"
            value={newRoutine}
            onChange={(e) => setNewRoutine(e.target.value)}
            placeholder="Add new routine..."
            className="flex-1 border-2 border-indigo-100 rounded-md px-4 py-2 focus:outline-none focus:border-indigo-500"
            required
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
        {routines.map((routine, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-slate-50 p-4 rounded-md"
          >
            <span className="text-slate-900">{routine}</span>
            <button
              onClick={() => handleDeleteRoutine(index)}
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

export default RoutineManager; 