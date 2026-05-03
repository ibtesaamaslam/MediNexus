import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientDetail from './pages/PatientDetail';
import PatientList from './pages/PatientList';
import Appointments from './pages/Appointments';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import { Icons } from './components/ui/Icons';
import { MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_USER, MOCK_INVOICES } from './constants';
import { Patient, Appointment, Invoice } from './types';

// Simple simulated router
type Page = 'login' | 'dashboard' | 'appointments' | 'patients' | 'patient_detail' | 'invoices' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Centralized State (Simulating Database)
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setPage('dashboard');
  };

  const handleNavigate = (newPage: string) => {
    setPage(newPage as Page);
    setIsSidebarOpen(false);
  };

  const handlePatientClick = (id: string) => {
    setSelectedPatientId(id);
    setPage('patient_detail');
  };

  // Handlers for adding new data
  const handleAddPatient = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
  };

  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments([newAppointment, ...appointments]);
  };

  const handleAddInvoice = (newInvoice: Invoice) => {
    setInvoices([newInvoice, ...invoices]);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        currentPage={page} 
        onNavigate={handleNavigate} 
        userRole={MOCK_USER.role} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:hidden flex-shrink-0 z-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Icons.LayoutDashboard className="w-6 h-6" />
          </button>
          <span className="ml-4 font-bold text-gray-900">MediNexus</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {page === 'dashboard' && (
            <Dashboard 
              appointments={appointments} 
              patients={patients} 
              onNavigate={handleNavigate}
            />
          )}
          
          {page === 'patients' && (
            <PatientList 
              patients={patients} 
              onPatientClick={handlePatientClick} 
              onAddPatient={handleAddPatient}
            />
          )}
          
          {page === 'patient_detail' && selectedPatientId && (
            <PatientDetail 
              patient={patients.find(p => p.id === selectedPatientId)!} 
              onBack={() => setPage('patients')} 
            />
          )}

          {page === 'appointments' && (
            <Appointments 
              appointments={appointments} 
              onAddAppointment={handleAddAppointment}
              patients={patients}
            />
          )}

          {page === 'invoices' && (
            <Invoices 
              invoices={invoices} 
              onAddInvoice={handleAddInvoice}
              patients={patients}
            />
          )}

          {page === 'settings' && (
            <Settings />
          )}
        </main>
      </div>
    </div>
  );
}