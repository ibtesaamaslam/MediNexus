import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientDetail from './pages/PatientDetail';
import PatientList from './pages/PatientList';
import Appointments from './pages/Appointments';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import { Icons } from './components/ui/Icons';
import { PatientService, ApptService, BillingService } from './services/api';
import { Patient, Appointment, Invoice } from './types';

// Layout Component
const Layout = ({ children, page, setPage }: any) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        currentPage={page} 
        onNavigate={(p) => { setPage(p); setIsSidebarOpen(false); }} 
        userRole={user?.role || 'DOCTOR'} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:hidden flex-shrink-0 z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Icons.LayoutDashboard className="w-6 h-6" />
            </button>
            <span className="ml-4 font-bold text-gray-900">MediNexus</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// Authenticated Content
const AuthenticatedApp = () => {
  const [page, setPage] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, aRes, iRes] = await Promise.all([
        PatientService.getAll(),
        ApptService.getAll(),
        BillingService.getAll()
      ]);
      setPatients(pRes.data);
      setAppointments(aRes.data);
      setInvoices(iRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNavigate = (newPage: string) => setPage(newPage);

  const handlePatientClick = (id: string) => {
    setSelectedPatientId(id);
    setPage('patient_detail');
  };

  const handleAddPatient = async (newPatientData: any) => {
    try {
      await PatientService.create(newPatientData);
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Error adding patient", error);
      alert("Failed to add patient");
    }
  };

  const handleAddAppointment = async (newApptData: any) => {
    try {
      await ApptService.create(newApptData);
      fetchData();
    } catch (error) {
      console.error("Error adding appointment", error);
      alert("Failed to schedule appointment");
    }
  };

  const handleAddInvoice = async (newInvoiceData: any) => {
    try {
      await BillingService.create(newInvoiceData);
      fetchData();
    } catch (error) {
      console.error("Error creating invoice", error);
      alert("Failed to create invoice");
    }
  };

  if (loading && patients.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium">Loading Clinic Data...</p>
      </div>
    );
  }

  return (
    <Layout page={page} setPage={setPage}>
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
    </Layout>
  );
};

const AuthWrapper = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return null; 
  
  return isAuthenticated ? <AuthenticatedApp /> : <Login />;
};

export default function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}
