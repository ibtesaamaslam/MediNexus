import React from 'react';
import { Icons } from '../ui/Icons';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: string;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, userRole, isOpen, onClose }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Icons.Calendar },
    { id: 'patients', label: 'Patient Records', icon: Icons.Users },
    { id: 'invoices', label: 'Billing', icon: Icons.FileText },
    { id: 'settings', label: 'Settings', icon: Icons.Settings },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-slate-850 text-white border-r border-slate-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-lg font-semibold tracking-tight">MediNexus</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">Dr. Jane Smith</p>
            <p className="text-xs text-blue-400 mt-1 capitalize">{userRole}</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;