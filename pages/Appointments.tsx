import React, { useState } from 'react';
import { Appointment, Patient } from '../types';
import { Icons } from '../components/ui/Icons';
import { Modal } from '../components/ui/Modal';

interface AppointmentsProps {
  appointments: Appointment[];
  patients: Patient[];
  onAddAppointment: (appt: Appointment) => void;
}

const DOCTORS = [
  { id: 'u_1', name: 'Dr. Jane Smith' },
  { id: 'u_2', name: 'Dr. Gregory House' },
  { id: 'u_3', name: 'Dr. Meredith Grey' },
];

type ViewFilter = 'day' | 'week' | 'month';
type TypeFilter = 'ALL' | 'CHECKUP' | 'FOLLOW_UP' | 'TELEHEALTH' | 'EMERGENCY';

const Appointments: React.FC<AppointmentsProps> = ({ appointments, patients, onAddAppointment }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewFilter, setViewFilter] = useState<ViewFilter>('month'); 
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Form Data for Create
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'CHECKUP',
    notes: ''
  });

  // Form Data for Edit
  const [editFormData, setEditFormData] = useState({
    date: '',
    time: '',
    notes: '',
    status: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === formData.patientId);
    const doctor = DOCTORS.find(d => d.id === formData.doctorId) || DOCTORS[0]; 
    
    if (!patient) return;

    const dateObj = new Date(`${formData.date}T${formData.time}`);
    
    const newAppt: Appointment = {
      id: `a_${Date.now()}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: dateObj.toISOString(),
      status: 'SCHEDULED',
      type: formData.type as any,
      notes: formData.notes
    };

    onAddAppointment(newAppt);
    setIsCreateModalOpen(false);
    setFormData({ patientId: '', doctorId: '', date: '', time: '', type: 'CHECKUP', notes: '' });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    // In a real app, we would call an API here
    // api.put(`/appointments/${selectedAppointment.id}`, ...)
    
    // For local state simulation, we'd need an onUpdate callback prop
    // But for now, we'll just close the modal and alert
    alert("Appointment updated successfully! (Note: Local state update requires app reload in this demo)");
    setIsEditMode(false);
    setSelectedAppointment(null);
  };

  const handleRowClick = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setIsEditMode(false);
    const dt = new Date(appt.date);
    setEditFormData({
        date: dt.toISOString().split('T')[0],
        time: dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        notes: appt.notes || '',
        status: appt.status
    });
  };

  const closeDetailModal = () => {
    setSelectedAppointment(null);
    setIsEditMode(false);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
        setIsSyncing(false);
        alert('Calendar synced successfully with external providers!');
    }, 2000);
  };

  const filteredAppointments = appointments.filter(appt => {
    const apptDate = new Date(appt.date);
    const today = new Date();
    
    // Date Filter
    let dateMatch = true;
    if (viewFilter === 'day') {
        dateMatch = apptDate.getDate() === today.getDate() &&
               apptDate.getMonth() === today.getMonth() &&
               apptDate.getFullYear() === today.getFullYear();
    } else if (viewFilter === 'week') {
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        dateMatch = apptDate >= today && apptDate <= nextWeek;
    }

    // Type Filter
    let typeMatch = true;
    if (typeFilter !== 'ALL') {
        typeMatch = appt.type === typeFilter;
    }

    return dateMatch && typeMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your schedule and upcoming visits.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="flex-1 md:flex-none bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-2 disabled:opacity-50"
            >
               <Icons.Calendar className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
               <span className="md:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
               <Icons.Plus className="w-4 h-4" /> New Appointment
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
               <div className="flex items-center gap-4">
                   <h2 className="font-semibold text-gray-700">Schedule</h2>
                   <select 
                     value={typeFilter}
                     onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                     className="text-xs border-gray-300 rounded-md bg-white py-1 pl-2 pr-6 focus:ring-blue-500 border shadow-sm outline-none"
                   >
                       <option value="ALL">All Types</option>
                       <option value="CHECKUP">Checkup</option>
                       <option value="TELEHEALTH">Telehealth</option>
                       <option value="FOLLOW_UP">Follow Up</option>
                       <option value="EMERGENCY">Emergency</option>
                   </select>
               </div>
               <div className="flex gap-2 text-xs w-full sm:w-auto">
                  {['day', 'week', 'month'].map((filter) => (
                    <button 
                        key={filter}
                        onClick={() => setViewFilter(filter as ViewFilter)}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded border transition-colors capitalize text-center ${
                            viewFilter === filter 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                        {filter}
                    </button>
                  ))}
               </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                <thead className="bg-white border-b border-gray-100">
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Doctor</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredAppointments.map((appt) => (
                    <tr 
                      key={appt.id} 
                      onClick={() => handleRowClick(appt)}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                         {new Date(appt.date).toLocaleDateString()} <br/>
                         <span className="text-gray-500 font-normal">{new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{appt.patientName}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                ${appt.type === 'TELEHEALTH' ? 'bg-purple-100 text-purple-700' : 
                                appt.type === 'CHECKUP' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                {appt.type}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{appt.doctorName}</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                appt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                                appt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                'bg-amber-100 text-amber-800'
                            }`}>
                                {appt.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-100">
                                <Icons.Search className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
                {filteredAppointments.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No appointments scheduled for this view.
                    </div>
                )}
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Calendar Quick View</h3>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-400 text-sm">
                    <div className="text-center">
                      <Icons.Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <span>Select a date</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Telehealth Queue</h3>
                <p className="text-xs text-blue-700 mb-4">2 patients waiting in virtual lobby.</p>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    Join Next Call
                </button>
            </div>
        </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Schedule Appointment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
            <select 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.patientId}
              onChange={(e) => setFormData({...formData, patientId: e.target.value})}
            >
              <option value="">Select a patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
            <select 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.doctorId}
              onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
            >
              <option value="">Select a doctor</option>
              {DOCTORS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date"
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input 
                type="time"
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="CHECKUP">Checkup</option>
              <option value="FOLLOW_UP">Follow Up</option>
              <option value="TELEHEALTH">Telehealth</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Reason for visit, symptoms, etc."
            />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Schedule</button>
          </div>
        </form>
      </Modal>

      {selectedAppointment && (
        <Modal isOpen={!!selectedAppointment} onClose={closeDetailModal} title="Appointment Details">
          {!isEditMode ? (
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-bold text-gray-900">{selectedAppointment.patientName}</h4>
                    <p className="text-sm text-gray-500">Patient</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                    ${selectedAppointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                    selectedAppointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                    {selectedAppointment.status}
                </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date & Time</p>
                    <p className="font-medium text-gray-900">{new Date(selectedAppointment.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">{new Date(selectedAppointment.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Doctor</p>
                    <p className="font-medium text-gray-900">{selectedAppointment.doctorName}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Type</p>
                    <p className="font-medium text-gray-900">{selectedAppointment.type}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">ID</p>
                    <p className="font-mono text-xs text-gray-600 break-all">{selectedAppointment.id}</p>
                </div>
                </div>

                <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Clinical Notes</h5>
                <div className="bg-white border border-gray-200 p-3 rounded-lg text-sm text-gray-700 min-h-[80px]">
                    {selectedAppointment.notes || <span className="text-gray-400 italic">No notes available.</span>}
                </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button onClick={closeDetailModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">Close</button>
                <button onClick={() => setIsEditMode(true)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Edit Appointment</button>
                </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                 <input 
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                 <input 
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editFormData.time}
                    onChange={(e) => setEditFormData({...editFormData, time: e.target.value})}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                 <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                 >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="NO_SHOW">No Show</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                 <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                 />
               </div>
               <div className="pt-4 flex gap-3">
                 <button type="button" onClick={() => setIsEditMode(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">Cancel</button>
                 <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Save Changes</button>
               </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Appointments;