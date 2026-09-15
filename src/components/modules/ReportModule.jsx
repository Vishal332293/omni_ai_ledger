import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, Printer, Filter, Calendar, Table, CheckCircle2 } from 'lucide-react';

export const ReportModule = () => {
  const { sales, purchases, expenses, products, customers, logAudit } = useApp();
  const [reportType, setReportType] = useState('sales'); // 'sales' | 'gst' | 'inventory' | 'expenses' | 'pnl'

  const exportCSV = () => {
    let content = "Report Type: " + reportType.toUpperCase() + "\nDate: 2026-09-15\n\n";
    if (reportType === 'sales') {
      content += "Invoice ID,Customer Name,Date,Total Amount,Status\n";
      sales.forEach(s => {
        content += `${s.id},"${s.customerName}",${s.date},${s.grandTotal},${s.status}\n`;
      });
    } else {
      content += "SKU,Product Name,Stock,Price,Valuation\n";
      products.forEach(p => {
        content += `${p.sku},"${p.name}",${p.stockMain},${p.sellingPrice},${p.stockMain * p.purchasePrice}\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniBiz_${reportType}_Report.csv`;
    a.click();
    logAudit('Export CSV', `Exported ${reportType} report to CSV`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Business Reports & Analytics Hub</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate, print, and export official PDF, Excel, and CSV financial and operational reports.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV / Excel
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto text-xs font-semibold gap-1">
        {[
          { id: 'sales', label: 'Sales & Revenue Report' },
          { id: 'gst', label: 'GST Tax Summary (GSTR-1)' },
          { id: 'inventory', label: 'Stock Valuation Report' },
          { id: 'expenses', label: 'Expense Audit Log' },
          { id: 'pnl', label: 'Profit & Loss Summary' }
        ].map(r => (
          <button
            key={r.id}
            onClick={() => setReportType(r.id)}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              reportType === r.id ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Report Content Sheet */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white capitalize">{reportType} Statement</h3>
            <p className="text-xs text-slate-500">Period: Sept 01, 2026 - Sept 15, 2026</p>
          </div>
          <span className="text-xs bg-brand-50 text-brand-700 font-bold px-3 py-1 rounded-full border border-brand-200">
            Verified Audit Certified
          </span>
        </div>

        {reportType === 'sales' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-3">Invoice #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Taxable Subtotal</th>
                <th className="p-3 text-right">GST Tax</th>
                <th className="p-3 text-right">Grand Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {sales.map(s => (
                <tr key={s.id}>
                  <td className="p-3 font-bold font-mono text-slate-900 dark:text-white">{s.id}</td>
                  <td className="p-3">{s.customerName}</td>
                  <td className="p-3">{s.date}</td>
                  <td className="p-3 text-right">${s.subtotal.toFixed(2)}</td>
                  <td className="p-3 text-right">${s.taxTotal.toFixed(2)}</td>
                  <td className="p-3 text-right font-bold text-brand-600">${s.grandTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === 'gst' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-slate-500">Total Taxable Sales</span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">${sales.reduce((a, b) => a + b.subtotal, 0).toFixed(2)}</h4>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-slate-500">CGST + SGST Collected</span>
                <h4 className="text-lg font-bold text-emerald-600">${sales.reduce((a, b) => a + b.cgst + b.sgst, 0).toFixed(2)}</h4>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <span className="text-slate-500">IGST Collected</span>
                <h4 className="text-lg font-bold text-blue-600">${sales.reduce((a, b) => a + b.igst, 0).toFixed(2)}</h4>
              </div>
            </div>
          </div>
        )}

        {reportType === 'inventory' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-3">SKU</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">In Stock</th>
                <th className="p-3 text-right">Cost Price</th>
                <th className="p-3 text-right">Total Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {products.map(p => (
                <tr key={p.id}>
                  <td className="p-3 font-mono font-bold">{p.sku}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 text-center font-bold">{p.stockMain + p.stockBranchA} pcs</td>
                  <td className="p-3 text-right">${p.purchasePrice.toFixed(2)}</td>
                  <td className="p-3 text-right font-bold text-emerald-600">${((p.stockMain + p.stockBranchA) * p.purchasePrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
