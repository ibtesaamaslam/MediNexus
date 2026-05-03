import React from 'react';
import { Appointment, Patient } from '../types';
import { Icons } from '../components/ui/Icons';

interface DashboardProps {
  appointments: Appointment[];
  patients: Patient[];
  onNavigate: (page: string) => void;
}

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {trend}
      </span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ appointments, patients, onNavigate }) => {
  const todayAppointments = appointments.filter(a => {
    const apptDate = new Date(a.date);
    const today = new Date();
    return apptDate.getDate() === today.getDate() && 
           apptDate.getMonth() === today.getMonth() &&
           apptDate.getFullYear() === today.getFullYear();
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Dr. Smith. Here's what's happening today.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Appointments" 
          value={todayAppointments.length} 
          icon={Icons.Calendar} 
          trend="+12%" 
          color="bg-blue-500"
        />
        <StatCard 
          title="Total Patients" 
          value={patients.length} 
          icon={Icons.Users} 
          trend="+5%" 
          color="bg-indigo-500"
        />
        <StatCard 
          title="Revenue (MTD)" 
          value="$12,450" 
          icon={Icons.FileText} 
          trend="+8.2%" 
          color="bg-emerald-500"
        />
        <StatCard 
          title="Telehealth Visits" 
          value="4" 
          icon={Icons.Video} 
          trend="-2%" 
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            <button onClick={() => onNavigate('appointments')} className="text-sm text-blue-600 hover:underline">View Calendar</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 border-b border-gray-100">
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.slice(0, 5).map((appt) => (
                  <tr key={appt.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                          {appt.patientName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{appt.patientName}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${appt.type === 'TELEHEALTH' ? 'bg-purple-100 text-purple-700' : 
                          appt.type === 'CHECKUP' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {appt.type}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`flex items-center gap-1 text-xs font-medium ${appt.status === 'COMPLETED' ? 'text-green-600' : 'text-amber-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${appt.status === 'COMPLETED' ? 'bg-green-600' : 'bg-amber-600'}`}></span>
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Icons.Settings className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onNavigate('patients')}
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 text-center group"
            >
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Icons.Plus className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">New Patient</span>
            </button>
            <button 
              onClick={() => onNavigate('appointments')}
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 text-center group"
            >
              <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Icons.Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Schedule</span>
            </button>
            <button 
              onClick={() => onNavigate('appointments')}
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 text-center group"
            >
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Icons.Video className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Telehealth</span>
            </button>
            <button 
              onClick={() => onNavigate('invoices')}
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 text-center group"
            >
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Icons.FileText className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Invoice</span>
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
             <div className="flex gap-2 items-start">
               <Icons.ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
               <div className="text-xs text-slate-600">
                 <span className="font-semibold block text-slate-800 mb-1">HIPAA Compliant</span>
                 System audit log active. Last backup: 2 hours ago.
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;