import { useContext, useState } from 'react';
import { PatientContext } from '../context/PatientContext';

const MedicalFiles = ({ patient }) => {
  const { uploadMedicalFile } = useContext(PatientContext);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => uploadMedicalFile(patient.id, file));
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => uploadMedicalFile(patient.id, file));
  };

  if (!patient) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Medical Files</h2>
        <label className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer">
          Upload File
          <input type="file" className="hidden" onChange={handleFileInput} multiple />
        </label>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300'
        }`}
      >
        <p className="text-slate-600">
          Drag and drop files here or click the Upload button
        </p>
      </div>

      {/* Files List */}
      <div className="space-y-4">
        {patient.medicalFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-md ${
                file.type === 'pdf' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {file.type === 'pdf' ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500">Uploaded on {file.uploadedAt}</p>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800">
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalFiles; 