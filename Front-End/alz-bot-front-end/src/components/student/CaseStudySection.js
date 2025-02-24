export const CaseStudySection = ({ caseStudy, setCaseStudy, onSubmit }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <FaBookMedical className="text-indigo-500 mr-2" />
      <h2 className="text-xl font-semibold">Submit Case Study</h2>
    </div>
    <textarea
      value={caseStudy}
      onChange={(e) => setCaseStudy(e.target.value)}
      className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      placeholder="Describe your case study here..."
      rows="6"
    />
    <button
      onClick={onSubmit}
      className="mt-4 bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors duration-200"
    >
      Submit Case Study
    </button>
  </div>
); 