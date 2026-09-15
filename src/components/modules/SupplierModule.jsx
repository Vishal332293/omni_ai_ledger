import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../common/DataTable';
import { Truck, Plus, Star, Phone, Mail, FileText, DollarSign } from 'lucide-react';

export const SupplierModule = () => {
  const { suppliers, setSuppliers, purchases, logAudit } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', contactPerson: '', email: '', phone: '', gstin: '', payableBalance: 0, address: '', notes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSup = { id: `SUP-00${suppliers.length + 1}`, rating: 5.0, ...formData, payableBalance: parseFloat(formData.payableBalance) };
    setSuppliers([...suppliers, newSup]);
    logAudit('Add Supplier', `Added supplier: ${newSup.name}`);
    setShowAddModal(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Supplier Company',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-xs flex items-center justify-center">
            {val.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-xs">{val}</div>
            <div className="text-[11px] text-slate-500">Contact: {row.contactPerson}</div>
          </div>
        </div>
      )
    },
    { key: 'phone', label: 'Phone' },
    { key: 'gstin', label: 'GSTIN' },
    {
      key: 'payableBalance',
      label: 'Pending Payable',
      render: (val) => <span className={`font-bold text-xs ${val > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>${val.toFixed(2)}</span>
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (val) => (
        <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
          <Star className="w-3.5 h-3.5 fill-amber-400" /> {val}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Supplier Management & Vendor Ledger</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage supplier profiles, purchase orders, pending accounts payable, and performance.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      <DataTable
        columns={columns}
        data={suppliers}
        searchPlaceholder="Search suppliers by name, GSTIN, phone..."
      />

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Add New Supplier Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Company Name</label>
                <input required type="text" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Contact Person</label>
                  <input required type="text" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Phone Number</label>
                  <input required type="text" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Email</label>
                  <input required type="email" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">GSTIN</label>
                  <input type="text" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.gstin} onChange={e => setFormData({...formData, gstin: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold rounded-lg">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
