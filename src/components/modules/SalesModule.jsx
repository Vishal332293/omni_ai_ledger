import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../common/DataTable';
import { ShoppingCart, Plus, FileText, CheckCircle2, AlertCircle, UserCheck } from 'lucide-react';

export const SalesModule = () => {
  const { sales, setActiveModule, setActiveModal } = useApp();
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' | 'quotations' | 'returns'

  const columns = [
    {
      key: 'id',
      label: 'Invoice / Quotation #',
      render: (val, row) => (
        <div>
          <span className="font-bold text-xs font-mono text-brand-600 dark:text-brand-400 block">{val}</span>
          <span className="text-[10px] text-slate-400">{row.type}</span>
        </div>
      )
    },
    { key: 'customerName', label: 'Customer' },
    { key: 'date', label: 'Date' },
    { key: 'salesperson', label: 'Salesperson' },
    {
      key: 'grandTotal',
      label: 'Grand Total',
      render: (val) => <span className="font-bold text-xs">${val.toFixed(2)}</span>
    },
    {
      key: 'status',
      label: 'Payment Status',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          val === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
          val === 'Partial' ? 'bg-amber-100 text-amber-800' :
          'bg-rose-100 text-rose-800'
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
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Sales Management & Quotations</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Quotations, Sales Orders, Tax Invoices, Sales Returns, and Commission Tracking.</p>
        </div>

        <button
          onClick={() => setActiveModal('new_invoice')}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Sales Invoice
        </button>
      </div>

      <DataTable
        columns={columns}
        data={sales}
        searchPlaceholder="Search sales by invoice #, customer name, salesperson..."
        onRowClick={() => setActiveModule('invoicing')}
      />
    </div>
  );
};
