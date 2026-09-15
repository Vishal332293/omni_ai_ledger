import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../common/DataTable';
import { Plus, UserCheck, Phone, Mail, FileText, Calendar, DollarSign, Tag, Clock, ArrowUpRight } from 'lucide-react';

export const CustomerModule = () => {
  const { customers, sales, addCustomer, setActiveModal } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'pipeline' | 'ledger'
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '', gstin: '', category: 'Retail', address: '', notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addCustomer(formData);
    setShowAddModal(false);
    setFormData({ name: '', company: '', email: '', phone: '', gstin: '', category: 'Retail', address: '', notes: '' });
  };

  const columns = [
    {
      key: 'name',
      label: 'Customer / Company',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-300 font-bold text-xs flex items-center justify-center">
            {val.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-xs">{val}</div>
            <div className="text-[11px] text-slate-500">{row.email}</div>
          </div>
        </div>
      )
    },
    { key: 'phone', label: 'Phone' },
    {
      key: 'category',
      label: 'Category',
      render: (val) => (
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
          val === 'VIP' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
          val === 'Wholesale' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
        }`}>
          {val}
        </span>
      )
    },
    {
      key: 'balance',
      label: 'Receivable Balance',
      render: (val) => (
        <span className={`font-bold text-xs ${val > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'}`}>
          ${val.toFixed(2)}
        </span>
      )
    },
    {
      key: 'leadStage',
      label: 'Pipeline Stage',
      render: (val) => (
        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${
          val === 'Won' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {val}
        </span>
      )
    },
    { key: 'lastOrder', label: 'Last Sale Date' }
  ];

  const customerInvoices = sales.filter(s => s.customerId === selectedCustomer?.id);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Customer Relationship Management (CRM)</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage client profiles, transaction history, debt ledgers, and sales pipeline.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${activeTab === 'directory' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
            >
              Directory
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${activeTab === 'pipeline' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
            >
              Lead Pipeline
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {activeTab === 'directory' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Table */}
          <div className="lg:col-span-2">
            <DataTable
              columns={columns}
              data={customers}
              searchPlaceholder="Search customers by name, phone, GSTIN..."
              onRowClick={(row) => setSelectedCustomer(row)}
            />
          </div>

          {/* Customer Detail Drawer Panel */}
          {selectedCustomer && (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-sm flex items-center justify-center">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedCustomer.name}</h3>
                    <p className="text-xs text-slate-500">{selectedCustomer.company}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-50 text-brand-600 rounded">
                  {selectedCustomer.category}
                </span>
              </div>

              {/* Balance Summary Box */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Total Due Balance</span>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">${selectedCustomer.balance.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => setActiveModal('receive_payment')}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-semibold text-xs rounded-lg shadow-xs hover:bg-emerald-700"
                >
                  Collect Payment
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400" /> {selectedCustomer.email}
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400" /> {selectedCustomer.phone}
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <FileText className="w-4 h-4 text-slate-400" /> GSTIN: {selectedCustomer.gstin || 'N/A'}
                </div>
              </div>

              {/* Notes */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Account Notes:</span>
                <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg italic">
                  "{selectedCustomer.notes}"
                </p>
              </div>

              {/* Transaction Ledger Snippet */}
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Recent Invoices ({customerInvoices.length})</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {customerInvoices.map(inv => (
                    <div key={inv.id} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">{inv.id}</span>
                        <span className="text-[10px] text-slate-400">{inv.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white block">${inv.grandTotal.toFixed(2)}</span>
                        <span className={`text-[10px] font-bold ${inv.status === 'Paid' ? 'text-emerald-600' : 'text-rose-500'}`}>{inv.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Lead Pipeline Board */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['New', 'Contacted', 'Negotiation', 'Won'].map(stage => {
            const stageCustomers = customers.filter(c => c.leadStage === stage);
            return (
              <div key={stage} className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">{stage}</h3>
                  <span className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700 text-[10px] font-bold flex items-center justify-center text-slate-700 dark:text-slate-200">
                    {stageCustomers.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageCustomers.map(cust => (
                    <div key={cust.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{cust.name}</h4>
                      <p className="text-[11px] text-slate-500">{cust.company}</p>
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Total Spent: ${cust.totalSpent.toFixed(0)}</span>
                        <span className="font-semibold text-brand-600">{cust.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Customer</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Customer Name</label>
                  <input required type="text" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Company Name</label>
                  <input type="text" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                  <input required type="email" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                  <input required type="text" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">GSTIN Number</label>
                  <input type="text" className="w-full p-2 border rounded-lg dark:bg-slate-900" placeholder="e.g. 27AAACT1234F1Z5" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <select className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="Retail">Retail</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="VIP">VIP Enterprise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Billing Address</label>
                <textarea className="w-full p-2 border rounded-lg dark:bg-slate-900" rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold rounded-lg">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
