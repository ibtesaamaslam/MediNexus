import React, { useState } from 'react';
import { Invoice, Patient } from '../types';
import { Icons } from '../components/ui/Icons';
import { Modal } from '../components/ui/Modal';

interface InvoicesProps {
  invoices: Invoice[];
  onAddInvoice: (inv: any) => void;
  patients: Patient[];
}

const Invoices: React.FC<InvoicesProps> = ({ invoices, onAddInvoice, patients }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  const [formData, setFormData] = useState({
    patientId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    items: ''
  });

  const totalOutstanding = invoices
    .filter(i => i.status !== 'PAID')
    .reduce((sum, i) => sum + parseFloat(i.amount as any), 0); // Ensure number

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    const newInvoice = {
      patientId: patient.id,
      amount: parseFloat(formData.amount),
      items: formData.items.split(',').map(i => i.trim()),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    };

    onAddInvoice(newInvoice);
    setIsModalOpen(false);
    setFormData({ patientId: '', amount: '', date: new Date().toISOString().split('T')[0], items: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">Track payments, claims, and financial health.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 shadow-sm flex items-center gap-2"
        >
           <Icons.Plus className="w-4 h-4" /> Create Invoice
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase">Outstanding Balance</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${totalOutstanding.toFixed(2)}</p>
            <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-amber-500 w-2/3"></div>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase">Collected This Month</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">$12,450.00</p>
            <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-green-500 w-4/5"></div>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase">Pending Claims</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
            <p className="text-xs text-gray-400 mt-1">Requires attention</p>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
           <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 px-1 pb-1">All Invoices</button>
              <button className="text-sm font-medium text-gray-500 hover:text-gray-700 px-1 pb-1">Unpaid</button>
              <button className="text-sm font-medium text-gray-500 hover:text-gray-700 px-1 pb-1">Drafts</button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-100">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Invoice ID</th>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <tr 
                  key={inv.id} 
                  onClick={() => setSelectedInvoice(inv)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">#{inv.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{inv.patientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(inv.date || (inv as any).createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">${parseFloat(inv.amount as any).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${inv.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                        inv.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 
                        'bg-amber-100 text-amber-800'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                     <button className="text-blue-600 hover:underline">View</button>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No invoices found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Invoice">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
            <select 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input 
              type="number"
              step="0.01"
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Items (comma separated)</label>
            <textarea 
              placeholder="Consultation, Lab Work, etc."
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.items}
              onChange={(e) => setFormData({...formData, items: e.target.value})}
            />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Create Invoice</button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      {selectedInvoice && (
        <Modal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} title="Invoice Details">
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-xl font-bold text-gray-900">#{selectedInvoice.id.slice(-6).toUpperCase()}</h4>
                        <p className="text-sm text-gray-500">Issued to {selectedInvoice.patientName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border
                      ${selectedInvoice.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 
                        selectedInvoice.status === 'OVERDUE' ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {selectedInvoice.status}
                    </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-xs text-gray-500 uppercase">Issue Date</span>
                        <p className="font-medium text-gray-900">{new Date(selectedInvoice.date || (selectedInvoice as any).createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 uppercase">Due Date</span>
                        <p className="font-medium text-gray-900">{selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                </div>

                <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2 border-b pb-2">Line Items</h5>
                    <div className="space-y-2">
                        {selectedInvoice.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-700">• {item}</span>
                                <span className="text-gray-400">-</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">${parseFloat(selectedInvoice.amount as any).toFixed(2)}</span>
                </div>

                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={() => setSelectedInvoice(null)} 
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                    >
                        Close
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-2">
                        <Icons.FileText className="w-4 h-4" /> Download PDF
                    </button>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default Invoices;
