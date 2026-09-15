import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, CreditCard, Send, CheckCircle2, Copy, Link as LinkIcon, DollarSign } from 'lucide-react';

export const PaymentModule = () => {
  const { payments, customers, sales, receivePayment, logAudit } = useApp();
  const [upiAmount, setUpiAmount] = useState('250.00');
  const [selectedCust, setSelectedCust] = useState(customers[0]?.name || '');
  const [copiedLink, setCopiedLink] = useState(false);

  const [payModal, setPayModal] = useState(false);
  const [payForm, setPayForm] = useState({ customerName: customers[0]?.name || '', amount: 500, mode: 'UPI / Bank Transfer', ref: 'UPI-994821', invoiceId: sales[0]?.id || '' });

  const handlePaySubmit = (e) => {
    e.preventDefault();
    receivePayment({ ...payForm, amount: parseFloat(payForm.amount) });
    setPayModal(false);
  };

  const copyPaymentLink = () => {
    setCopiedLink(true);
    logAudit('Payment Link', `Generated link for $${upiAmount}`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">UPI Payment Gateway & Link Generator</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate instant QR codes, payment links, collection reminders, and digital receipts.</p>
        </div>

        <button
          onClick={() => setPayModal(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
        >
          <DollarSign className="w-4 h-4" /> Record Collected Payment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic UPI Generator */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center mx-auto">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dynamic UPI QR Code Generator</h3>

          <div className="space-y-2 text-left text-xs">
            <label className="font-semibold block">Select Customer</label>
            <select className="w-full p-2 border rounded-lg dark:bg-slate-900" value={selectedCust} onChange={e => setSelectedCust(e.target.value)}>
              {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>

            <label className="font-semibold block">Amount ($ / ₹)</label>
            <input type="number" className="w-full p-2 border rounded-lg dark:bg-slate-900 font-bold" value={upiAmount} onChange={e => setUpiAmount(e.target.value)} />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-2">
            <div className="w-36 h-36 bg-white p-2 border rounded-xl shadow-xs flex items-center justify-center">
              <QrCode className="w-32 h-32 text-slate-900" />
            </div>
            <span className="text-[11px] font-mono text-slate-500">upi://pay?pa=omni@bank&am={upiAmount}</span>
          </div>

          <button
            onClick={copyPaymentLink}
            className="w-full py-2 bg-brand-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-brand-700"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            {copiedLink ? 'Link Copied to Clipboard!' : 'Copy Payment Link'}
          </button>
        </div>

        {/* Payments History Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Payment Collections & Receipts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3">Receipt ID</th>
                  <th className="p-3">Customer / Party</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Ref Code</th>
                  <th className="p-3 text-right">Amount Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {payments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{p.id}</td>
                    <td className="p-3 font-semibold">{p.customerName || p.supplierName}</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold">{p.mode}</span></td>
                    <td className="p-3 font-mono">{p.ref}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">${p.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {payModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Record Customer Payment</h3>
            <form onSubmit={handlePaySubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Customer</label>
                <select className="w-full p-2 border rounded-lg dark:bg-slate-900" value={payForm.customerName} onChange={e => setPayForm({...payForm, customerName: e.target.value})}>
                  {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Payment Mode</label>
                  <select className="w-full p-2 border rounded-lg dark:bg-slate-900" value={payForm.mode} onChange={e => setPayForm({...payForm, mode: e.target.value})}>
                    <option value="UPI / GPay">UPI / GPay</option>
                    <option value="Bank Transfer">Bank Wire</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Amount ($)</label>
                  <input required type="number" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={payForm.amount} onChange={e => setPayForm({...payForm, amount: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setPayModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg">Save Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
