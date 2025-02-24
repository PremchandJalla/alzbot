import React, { useState } from 'react';
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';

const PatientNotes = () => {
  const [notes, setNotes] = useState([
    { id: 1, date: '2024-02-25', content: 'Patient showed improved mood during morning routine', author: 'Laurel' },
    { id: 2, date: '2024-02-24', content: 'Difficulty sleeping, needed assistance at 2 AM', author: 'Laurel' }
  ]);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const newNoteObj = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      content: newNote,
      author: 'Laurel' // Replace with actual logged-in user
    };
    
    setNotes([newNoteObj, ...notes]);
    setNewNote('');
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content: editContent } : note
    ));
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="bg-slate-50 rounded-lg shadow-md p-6 border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Patient Notes</h2>
      
      {/* Add New Note */}
      <div className="mb-6">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-700"
          placeholder="Add a new note..."
          rows="3"
        />
        <button
          onClick={handleAddNote}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Note
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map(note => (
          <div key={note.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            {editingId === note.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-700"
                  rows="3"
                />
                <button
                  onClick={() => handleSaveEdit(note.id)}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  <FaSave className="inline mr-1" /> Save
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-slate-600">{note.date}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaEdit className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-rose-600 hover:text-rose-700"
                    >
                      <FaTrash className="inline mr-1" /> Delete
                    </button>
                  </div>
                </div>
                <p className="text-slate-700">{note.content}</p>
                <p className="text-sm text-slate-600 mt-2">By: {note.author}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientNotes; 