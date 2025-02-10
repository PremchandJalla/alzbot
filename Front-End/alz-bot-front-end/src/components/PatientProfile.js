const PatientProfile = ({ patient }) => {
  if (!patient) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{patient.name}</h2>
          <p className="text-indigo-600">Last active: {patient.lastActive}</p>
        </div>
        <button className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Patient Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-600">Age</label>
              <p className="text-slate-900 font-medium">{patient.age} years old</p>
            </div>
            <div>
              <label className="text-sm text-slate-600">Condition</label>
              <p className="text-slate-900 font-medium">{patient.condition}</p>
            </div>
            <div>
              <label className="text-sm text-slate-600">Patient ID</label>
              <p className="text-slate-900 font-medium">{patient.id}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-600">Chat Interactions</label>
              <p className="text-slate-900 font-medium">{patient.chatLogs?.length || 0} messages</p>
            </div>
            <div>
              <label className="text-sm text-slate-600">Medical Files</label>
              <p className="text-slate-900 font-medium">{patient.medicalFiles?.length || 0} files</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile; 