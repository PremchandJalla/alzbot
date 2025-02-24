import React, { useState } from 'react';
import { FaUtensils, FaBan, FaEdit, FaSave } from 'react-icons/fa';

const DietaryInfo = () => {
  const [dietaryInfo, setDietaryInfo] = useState({
    restrictions: [
      { id: 1, item: 'Lactose Intolerant', details: 'Avoid dairy products' },
      { id: 2, item: 'Low Sodium', details: 'Maximum 2000mg per day' }
    ],
    mealPlan: {
      breakfast: 'Oatmeal with fruits, Green tea',
      lunch: 'Grilled chicken salad, Whole grain bread',
      dinner: 'Steamed fish, Brown rice, Vegetables',
      snacks: 'Apple slices, Unsalted nuts'
    }
  });

  const [editing, setEditing] = useState(false);
  const [tempMealPlan, setTempMealPlan] = useState(dietaryInfo.mealPlan);
  const [newRestriction, setNewRestriction] = useState({ item: '', details: '' });

  const handleSaveMealPlan = () => {
    setDietaryInfo({ ...dietaryInfo, mealPlan: tempMealPlan });
    setEditing(false);
  };

  const handleAddRestriction = () => {
    if (!newRestriction.item.trim()) return;
    
    const newRestrictions = [
      ...dietaryInfo.restrictions,
      { id: Date.now(), ...newRestriction }
    ];
    setDietaryInfo({ ...dietaryInfo, restrictions: newRestrictions });
    setNewRestriction({ item: '', details: '' });
  };

  return (
    <div className="bg-slate-50 rounded-lg shadow-md p-6 border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Dietary Information</h2>

      {/* Dietary Restrictions */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <FaBan className="text-rose-500 mr-2" />
          <h3 className="text-lg font-medium text-slate-800">Dietary Restrictions</h3>
        </div>
        
        <div className="space-y-3">
          {dietaryInfo.restrictions.map(restriction => (
            <div key={restriction.id} className="border-l-4 border-rose-500 pl-3 bg-white rounded-r-lg p-3 shadow-sm">
              <h4 className="font-medium text-slate-800">{restriction.item}</h4>
              <p className="text-sm text-slate-600">{restriction.details}</p>
            </div>
          ))}
        </div>

        {/* Add New Restriction */}
        <div className="mt-4 space-y-2">
          <input
            type="text"
            value={newRestriction.item}
            onChange={(e) => setNewRestriction({ ...newRestriction, item: e.target.value })}
            placeholder="New restriction..."
            className="w-full p-2 border border-slate-300 rounded bg-white text-slate-700"
          />
          <input
            type="text"
            value={newRestriction.details}
            onChange={(e) => setNewRestriction({ ...newRestriction, details: e.target.value })}
            placeholder="Details..."
            className="w-full p-2 border border-slate-300 rounded bg-white text-slate-700"
          />
          <button
            onClick={handleAddRestriction}
            className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition-colors"
          >
            Add Restriction
          </button>
        </div>
      </div>

      {/* Meal Plan */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaUtensils className="text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-slate-800">Daily Meal Plan</h3>
          </div>
          <button
            onClick={() => editing ? handleSaveMealPlan() : setEditing(true)}
            className="text-blue-600 hover:text-blue-700"
          >
            {editing ? (
              <><FaSave className="inline mr-1" /> Save</>
            ) : (
              <><FaEdit className="inline mr-1" /> Edit</>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {editing ? (
            Object.entries(tempMealPlan).map(([meal, foods]) => (
              <div key={meal} className="space-y-2">
                <label className="block font-medium capitalize text-slate-700">{meal}</label>
                <textarea
                  value={foods}
                  onChange={(e) => setTempMealPlan({
                    ...tempMealPlan,
                    [meal]: e.target.value
                  })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-700"
                  rows="2"
                />
              </div>
            ))
          ) : (
            Object.entries(dietaryInfo.mealPlan).map(([meal, foods]) => (
              <div key={meal} className="border-b border-slate-200 pb-2 bg-white p-3 rounded-lg shadow-sm mb-2">
                <h4 className="font-medium capitalize text-slate-800">{meal}</h4>
                <p className="text-slate-600">{foods}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DietaryInfo; 