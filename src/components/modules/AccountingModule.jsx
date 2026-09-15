import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, PieChart, Scale, ArrowUpRight, ArrowDownRight, CheckCircle2, FileSpreadsheet, Plus } from 'lucide-react';

export const AccountingModule = () => {
  const { metrics, expenses, sales, purchases, setExpenses, logAudit } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'pnl' | 'balance_sheet' | 'bank_rec'
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ title: '', category: 'Rent', amount: 100, account: 'Bank Account', payee: '' });

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const newExp = {
      id: `EXP-00${expenses.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      ...expenseForm,
      amount: parseFloat(expenseForm.amount)
    };
    setExpenses([newExp, ...expenses]);
    logAudit('Add Expense', `Logged expense: ${newExp.title} ($${newExp.amount})`);
    setShowAddExpense(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Accounting & Financial Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Profit & Loss, Balance Sheet, Expenses, Cash/Bank accounts, and Reconciliation.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            {['overview', 'pnl', 'balance_sheet', 'bank_rec'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddExpense(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">Gross Revenue</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">${metrics.revenue.toFixed(2)}</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">Operating Expenses</span>
              <h3 className="text-xl font-bold text-rose-600">${metrics.totalExpenses.toFixed(2)}</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">Accounts Receivable (AR)</span>
              <h3 className="text-xl font-bold text-amber-600">${metrics.outstandingReceivables.toFixed(2)}</h3>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">Accounts Payable (AP)</span>
              <h3 className="text-xl font-bold text-indigo-600">${metrics.outstandingPayables.toFixed(2)}</h3>
            </div>
          </div>

          {/* Expense History Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Operating Expenses Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Title / Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Account</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="p-3 font-mono font-bold">{exp.id}</td>
                      <td className="p-3">{exp.date}</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{exp.title}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded font-bold">{exp.category}</span></td>
                      <td className="p-3">{exp.account}</td>
                      <td className="p-3 text-right font-bold text-rose-600">${exp.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pnl' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto space-y-4">
          <div className="text-center border-b pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Profit & Loss Statement (P&L)</h2>
            <p className="text-xs text-slate-500">For Month Ending September 2026</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white border-b pb-1">
              <span>Operating Revenue (Sales)</span>
              <span>${metrics.revenue.toFixed(2)}</span>
            </div>

            <div className="pl-4 space-y-1 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between"><span>Less: Cost of Goods Sold (COGS)</span> <span>-${(metrics.totalPurchases * 0.7).toFixed(2)}</span></div>
            </div>

            <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-2 border-t">
              <span>Gross Profit</span>
              <span className="text-emerald-600">${(metrics.revenue - (metrics.totalPurchases * 0.7)).toFixed(2)}</span>
            </div>

            <div className="pt-2 font-bold text-slate-700 dark:text-slate-300">Operating Expenses</div>
            <div className="pl-4 space-y-1 text-slate-600 dark:text-slate-300">
              {expenses.map(exp => (
                <div key={exp.id} className="flex justify-between">
                  <span>{exp.title} ({exp.category})</span>
                  <span>-${exp.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white pt-3 border-t-2 border-slate-900 dark:border-slate-100">
              <span>Net Profit Before Tax</span>
              <span className="text-emerald-600 text-base">${metrics.netProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Log Expense Voucher</h3>
            <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Expense Title</label>
                <input required type="text" className="w-full p-2 border rounded-lg dark:bg-slate-900" placeholder="e.g. Office Stationery & Supplies" value={expenseForm.title} onChange={e => setExpenseForm({...expenseForm, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select className="w-full p-2 border rounded-lg dark:bg-slate-900" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Software">Software</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Travel">Travel</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Amount ($)</label>
                  <input required type="number" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddExpense(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold rounded-lg">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
