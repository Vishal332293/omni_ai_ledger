import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Bell, Clock, RefreshCw, CheckCircle2, Sliders } from 'lucide-react';

export const AutomationModule = () => {
  const { logAudit } = useApp();
  const [rules, setRules] = useState([
    { id: 1, name: 'Automated Payment Reminders', trigger: 'Invoice Overdue > 3 Days', action: 'Send WhatsApp & Email Reminder', active: true },
    { id: 2, name: 'Low Stock Auto-Replenish Alert', trigger: 'Stock Level <= Reorder Level', action: 'Draft Purchase Order & Alert Mgr', active: true },
    { id: 3, name: 'Recurring Monthly Rent Expense', trigger: '1st of Every Month', action: 'Post $3,500 Rent Expense Voucher', active: true },
    { id: 4, name: 'Daily EOD Executive Summary', trigger: 'Every Day at 8:00 PM', action: 'Email Revenue & Cashflow PDF to Admin', active: true },
    { id: 5, name: 'High Discount Approval Rule', trigger: 'Invoice Discount > 15%', action: 'Require Admin 2FA Approval', active: false }
  ]);

  const toggleRule = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    logAudit('Automation Workflow', `Toggled rule #${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Business Automation & Workflows</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure automated payment reminders, recurring invoices, low-stock triggers, and EOD reports.</p>
        </div>
      </div>

      <div className="space-y-4">
        {rules.map(rule => (
          <div key={rule.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${rule.active ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-100 text-slate-400'}`}>
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{rule.name}</h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Trigger: <strong className="text-slate-700 dark:text-slate-300">{rule.trigger}</strong> → Action: <span className="text-brand-600">{rule.action}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleRule(rule.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                rule.active
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {rule.active ? 'Rule Active' : 'Disabled'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
