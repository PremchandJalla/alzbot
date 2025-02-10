const RoutineForm = () => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-slate-900">Routine Management</h2>
      <form className="border rounded p-4 mt-4">
        <div className="mb-4">
          <label className="block text-slate-900 font-medium mb-2">Task</label>
          <input 
            type="text" 
            className="border border-slate-200 rounded w-full py-2 px-3 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Enter task description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-slate-900 font-medium mb-2">Time</label>
          <input 
            type="time" 
            className="border border-slate-200 rounded w-full py-2 px-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>
        <button 
          type="submit" 
          className="bg-indigo-600 text-white rounded py-2 px-4 hover:bg-indigo-700 transition-colors"
        >
          Add Routine
        </button>
      </form>
    </div>
  );
};

export default RoutineForm; 