import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../common/DataTable';
import { ShoppingBag, Plus, Truck, FileText, CheckCircle2 } from 'lucide-react';

export const PurchaseModule = () => {
  const { purchases, suppliers, setPurchases, logAudit } = useApp();
  const [showPOModal, setShowPOModal] = useState(false);
  const [poForm, setPoForm] = useState({ supplierId: suppliers[0]?.id || '', total: 1000 });

  const handlePOSubmit = (e) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === poForm.supplierId);
    const newPO = {
      id: `PO-2026-00${purchases.length + 1}`,
      supplierName: sup ? sup.name : 'Vendor',
      supplierId: poForm.supplierId,
      date: new Date().toISOString().split('T')[0],
      items: [{ productName: 'Inventory Order', qty: 10, price: poForm.total / 10, total: poForm.total }],
      grandTotal: parseFloat(poForm.total),
      paidAmount: 0,
      status: 'Pending Payment',
      warehouse: 'Main Warehouse'
    };
    setPurchases([newPO, ...purchases]);
    logAudit('Purchase Order', `Created PO ${newPO.id} for ${newPO.supplierName}`);
    setShowPOModal(false);
  };

  const columns = [
    {
      key: 'id',
      label: 'Purchase Order #',
      render: (val) => <span className="font-bold text-xs font-mono text-brand-600 dark:text-brand-400">{val}</span>
    },
    { key: 'supplierName', label: 'Supplier Vendor' },
    { key: 'date', label: 'Order Date' },
    { key: 'warehouse', label: 'Receiving Warehouse' },
    {
      key: 'grandTotal',
      label: 'PO Amount',
      render: (val) => <span className="font-bold text-xs">${val.toFixed(2)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          val === 'Received' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Purchase Orders & Invoices</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Supplier procurement, PO vouchers, receiving goods, and payment logs.</p>
        </div>

        <button
          onClick={() => setShowPOModal(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Purchase Order
        </button>
      </div>

      <DataTable
        columns={columns}
        data={purchases}
        searchPlaceholder="Search purchase orders..."
      />

      {showPOModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Create Purchase Order (PO)</h3>
            <form onSubmit={handlePOSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Select Supplier</label>
                <select className="w-full p-2 border rounded-lg dark:bg-slate-900" value={poForm.supplierId} onChange={e => setPoForm({...poForm, supplierId: e.target.value})}>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Total PO Amount ($)</label>
                <input required type="number" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={poForm.total} onChange={e => setPoForm({...poForm, total: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowPOModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold rounded-lg">Save PO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
