import React, { useState } from 'react';
import { Icons } from '../components/ui/Icons';
import { Modal } from '../components/ui/Modal';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'templates' | 'staff'>('general');
  
  // General Form State
  const [generalForm, setGeneralForm] = useState({
      name: 'Springfield Family Health',
      phone: '(555) 123-4567',
      email: 'admin@springfield.health',
      address: '742 Evergreen Terrace, Springfield'
  });

  // Staff State
  const [staffList, setStaffList] = useState([
    { name: 'Dr. Jane Smith', role: 'Admin', email: 'jane@clinic.com' },
    { name: 'Dr. Gregory House', role: 'Doctor', email: 'house@clinic.com' },
    { name: 'Pam Beesly', role: 'Receptionist', email: 'pam@clinic.com' },
  ]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'DOCTOR' });

  const handleGeneralSave = (e: React.FormEvent) => {
      e.preventDefault();
      alert('Clinic settings updated successfully!');
  };

  const handleInvite = (e: React.FormEvent) => {
      e.preventDefault();
      const newStaff = {
          name: 'Pending User',
          role: inviteForm.role,
          email: inviteForm.email
      };
      setStaffList([...staffList, newStaff]);
      setIsInviteModalOpen(false);
      setInviteForm({ email: '', role: 'DOCTOR' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your clinic profile and preferences.</p>
      </header>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
         {/* Sidebar Navigation */}
         <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4">
            <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto no-scrollbar pb-2 md:pb-0">
               {[
                 { id: 'general', label: 'General', icon: Icons.Users },
                 { id: 'security', label: 'Security', icon: Icons.ShieldCheck },
                 { id: 'templates', label: 'Templates', icon: Icons.FileText },
                 { id: 'staff', label: 'Staff', icon: Icons.Users },
               ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                  </button>
               ))}
            </nav>
         </div>

         {/* Content Area */}
         <div className="flex-1 p-4 md:p-8">
            {activeTab === 'general' && (
              <div className="animate-fade-in">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Clinic Information</h2>
                
                <form onSubmit={handleGeneralSave} className="space-y-6 max-w-2xl">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                      <input 
                        type="text" 
                        value={generalForm.name} 
                        onChange={(e) => setGeneralForm({...generalForm, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input 
                            type="text" 
                            value={generalForm.phone}
                            onChange={(e) => setGeneralForm({...generalForm, phone: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={generalForm.email}
                            onChange={(e) => setGeneralForm({...generalForm, email: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input 
                        type="text" 
                        value={generalForm.address}
                        onChange={(e) => setGeneralForm({...generalForm, address: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                  </div>

                  <div className="pt-4">
                     <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animate-fade-in">
                 <h2 className="text-lg font-medium text-gray-900 mb-4">Security Configuration</h2>
                 <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg mb-6">
                    <p className="text-sm text-yellow-800 font-medium">Two-factor authentication is currently enforced for all staff members.</p>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                       <div>
                          <p className="font-medium text-gray-900 text-sm">Password Expiry</p>
                          <p className="text-xs text-gray-500">Require password change every 90 days</p>
                       </div>
                       <input type="checkbox" defaultChecked className="toggle-checkbox" />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                       <div>
                          <p className="font-medium text-gray-900 text-sm">IP Whitelisting</p>
                          <p className="text-xs text-gray-500">Restrict access to clinic IP addresses only</p>
                       </div>
                       <input type="checkbox" className="toggle-checkbox" />
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'templates' && (
               <div className="animate-fade-in text-center py-12">
                  <Icons.FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-900 font-medium">Document Templates</h3>
                  <p className="text-gray-500 text-sm mt-1">Manage consent forms and intake templates.</p>
                  <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                     Manage Templates
                  </button>
               </div>
            )}

            {activeTab === 'staff' && (
               <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-lg font-medium text-gray-900">Staff Management</h2>
                     <button 
                       onClick={() => setIsInviteModalOpen(true)}
                       className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 shadow-sm"
                     >
                        Invite User
                     </button>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                     <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                           <tr>
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Name</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Role</th>
                              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Email</th>
                              <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                           {staffList.map((staff, idx) => (
                              <tr key={idx}>
                                 <td className="py-3 px-4 text-sm font-medium text-gray-900">{staff.name}</td>
                                 <td className="py-3 px-4 text-sm text-gray-500">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{staff.role}</span>
                                 </td>
                                 <td className="py-3 px-4 text-sm text-gray-500">{staff.email}</td>
                                 <td className="py-3 px-4 text-right text-sm">
                                    <button className="text-red-600 hover:underline">Remove</button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}
         </div>
      </div>

      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Staff Member">
         <form onSubmit={handleInvite} className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
               <input 
                  type="email" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                  placeholder="colleague@clinic.com"
               />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
               <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
               >
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="ADMIN">Admin</option>
               </select>
            </div>
            <div className="pt-4 flex gap-3">
               <button type="button" onClick={() => setIsInviteModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">Cancel</button>
               <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Send Invite</button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default Settings;