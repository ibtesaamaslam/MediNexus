import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { Icons } from '../components/ui/Icons';
import { PatientService, AIService } from '../services/api';
import { Modal } from '../components/ui/Modal';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient: initialPatient, onBack }) => {
  const [patient, setPatient] = useState<any>(initialPatient);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDecrypted, setIsDecrypted] = useState(false);
  
  // AI State
  const [newNote, setNewNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);

  // Document State
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadPatient();
  }, [initialPatient.id]);

  const loadPatient = async () => {
    try {
      // Fetch full details including documents if available on backend
      const { data } = await PatientService.getOne(initialPatient.id);
      setPatient(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateSummary = async () => {
    if (!newNote) return;
    setIsGenerating(true);
    try {
      const { data } = await AIService.summarize(newNote);
      setGeneratedSummary(data.summary);
    } catch (err) {
      alert('Failed to generate summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !patient.id) return;
    setUploading(true);
    try {
      await PatientService.uploadDocument(patient.id, e.target.files[0]);
      loadPatient(); // Refresh to show new doc
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!patient) return <div className="p-8">Patient not found</div>;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
        <Icons.LayoutDashboard className="w-4 h-4 mr-1 rotate-180" /> Back
      </button>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">{patient.firstName} {patient.lastName}</h1>
        <p className="text-sm text-gray-500">{patient.email} • {patient.phone}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {['overview', 'notes', 'documents'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium capitalize ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Medical History (Encrypted)</h3>
                  <button onClick={() => setIsDecrypted(!isDecrypted)} className="text-xs text-blue-600 flex items-center gap-1">
                    <Icons.Lock className="w-3 h-3" /> {isDecrypted ? 'Hide' : 'Decrypt'}
                  </button>
               </div>
               <div className={`p-4 rounded-lg border ${isDecrypted ? 'bg-white' : 'bg-gray-100'}`}>
                  {isDecrypted ? <p className="text-sm text-gray-800">{patient.medicalHistory}</p> : <p className="text-sm text-gray-400 blur-sm select-none">Encrypted Data Hidden</p>}
               </div>
            </div>
          )}

          {activeTab === 'notes' && (
             <div className="space-y-4">
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={4}
                  placeholder="Enter clinical notes..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <button onClick={handleGenerateSummary} disabled={isGenerating} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg">
                  {isGenerating ? 'AI Thinking...' : 'Generate SOAP Summary'}
                </button>
                {generatedSummary && <pre className="mt-4 p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap">{generatedSummary}</pre>}
             </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer text-sm hover:bg-blue-700">
                    {uploading ? "Uploading..." : "Upload Document"}
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                 </label>
                 <p className="text-xs text-gray-500">Stored securely in Supabase Storage</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {patient.documents && patient.documents.map((doc: any) => (
                   <div key={doc.name} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <Icons.FileText className="w-5 h-5 text-gray-400" />
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500">{(doc.metadata?.size / 1024).toFixed(1)} KB</p>
                      </div>
                   </div>
                 ))}
                 {(!patient.documents || patient.documents.length === 0) && (
                    <p className="text-gray-500 text-sm">No documents found.</p>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;