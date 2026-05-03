import React, { useState } from 'react';
import { Patient } from '../types';
import { Icons } from '../components/ui/Icons';
import { summarizeClinicalNote } from '../services/geminiService';
import { Modal } from '../components/ui/Modal';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient: initialPatient, onBack }) => {
  const [patient, setPatient] = useState(initialPatient);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: initialPatient.firstName,
    lastName: initialPatient.lastName,
    email: initialPatient.email,
    phone: initialPatient.phone,
    address: initialPatient.address
  });

  const handleGenerateSummary = async () => {
    if (!newNote) return;
    setIsGenerating(true);
    const summary = await summarizeClinicalNote(newNote);
    setGeneratedSummary(summary);
    setIsGenerating(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setPatient({ ...patient, ...editFormData });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
      >
        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        Back to Patients
      </button>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600 flex-shrink-0">
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.firstName} {patient.lastName}</h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mt-1">
                <span>DOB: {new Date(patient.dob).toLocaleDateString()}</span>
                <span className="hidden sm:inline">•</span>
                <span>{patient.phone}</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1 text-green-600 whitespace-nowrap">
                  <Icons.ShieldCheck className="w-3 h-3" /> PHI Secure
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button className="btn-secondary flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
              <Icons.Video className="w-4 h-4" />
              Start Telehealth
            </button>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-sm text-sm font-medium"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vitals & Sensitive Data */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
             <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Vitals</h3>
             <div className="grid grid-cols-2 gap-4">
               <div className="p-3 bg-gray-50 rounded-lg">
                 <span className="text-xs text-gray-500 block">Blood Pressure</span>
                 <span className="text-lg font-bold text-gray-900">120/80</span>
               </div>
               <div className="p-3 bg-gray-50 rounded-lg">
                 <span className="text-xs text-gray-500 block">Heart Rate</span>
                 <span className="text-lg font-bold text-gray-900">72 <span className="text-xs font-normal text-gray-500">bpm</span></span>
               </div>
               <div className="p-3 bg-gray-50 rounded-lg">
                 <span className="text-xs text-gray-500 block">Weight</span>
                 <span className="text-lg font-bold text-gray-900">185 <span className="text-xs font-normal text-gray-500">lbs</span></span>
               </div>
               <div className="p-3 bg-gray-50 rounded-lg">
                 <span className="text-xs text-gray-500 block">Height</span>
                 <span className="text-lg font-bold text-gray-900">5'10"</span>
               </div>
             </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Sensitive Data</h3>
                <button 
                  onClick={() => setIsDecrypted(!isDecrypted)}
                  className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  {isDecrypted ? <Icons.Lock className="w-3 h-3" /> : <Icons.Lock className="w-3 h-3" />}
                  {isDecrypted ? 'Encrypt View' : 'Decrypt View'}
                </button>
             </div>
             
             <div className={`relative p-4 rounded-lg border transition-colors ${isDecrypted ? 'bg-red-50 border-red-100' : 'bg-gray-100 border-gray-200'}`}>
                {!isDecrypted && (
                  <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center rounded-lg z-10 cursor-not-allowed">
                     <div className="bg-white/80 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 flex items-center gap-2 shadow-sm">
                       <Icons.Lock className="w-3 h-3" /> Encrypted Field
                     </div>
                  </div>
                )}
                <p className={`text-sm ${isDecrypted ? 'text-gray-900' : 'text-gray-400 blur-sm select-none'}`}>
                   SSN: ***-**-6789 <br/>
                   Detailed diagnosis: {patient.medicalHistorySummary}
                </p>
             </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max">
              {['overview', 'notes', 'prescriptions', 'billing'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors capitalize whitespace-nowrap ${
                    activeTab === tab 
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 md:p-6 min-h-[400px]">
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-2">
                    <Icons.Brain className="w-4 h-4" /> AI Medical Scribe
                  </h3>
                  <p className="text-xs text-blue-700 mb-3">
                    Enter rough clinical notes below. Gemini AI will format them into a structured SOAP note automatically.
                  </p>
                  <textarea
                    className="w-full p-3 border border-blue-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2"
                    rows={4}
                    placeholder="e.g. Patient complains of headache..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <button 
                    onClick={handleGenerateSummary}
                    disabled={isGenerating || !newNote}
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    {isGenerating ? 'Processing...' : 'Generate SOAP Note'}
                  </button>
                </div>

                {generatedSummary && (
                   <div className="bg-white border border-gray-200 rounded-lg p-4 animate-fade-in">
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Generated Output</h4>
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">{generatedSummary}</pre>
                      <div className="mt-4 flex gap-2">
                        <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700">Save</button>
                        <button onClick={() => setGeneratedSummary(null)} className="text-xs border border-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-50">Discard</button>
                      </div>
                   </div>
                )}
              </div>
            )}
            
            {activeTab === 'overview' && (
              <div className="space-y-4">
                 <h3 className="text-lg font-semibold text-gray-800">Patient Overview</h3>
                 <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Address:</span> {patient.address}</p>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Email:</span> {patient.email}</p>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Primary Concern:</span> Chronic Hypertension</p>
                 </div>
              </div>
            )}

            {activeTab === 'prescriptions' && <div className="text-center text-gray-500 py-12">No active prescriptions found.</div>}
            {activeTab === 'billing' && <div className="text-center text-gray-500 py-12">No pending invoices.</div>}
          </div>
        </div>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Patient Profile">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={editFormData.firstName}
                onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={editFormData.lastName}
                onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={editFormData.email}
              onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input 
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={editFormData.phone}
              onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input 
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={editFormData.address}
              onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
            />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientDetail;