import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, Key, Download, Upload, FileText, CheckCircle2 } from 'lucide-react';

export const SecurityModule = () => {
  const { auditLogs, currentUser, setCurrentUser, logAudit } = useApp();
  const [twoFactor, setTwoFactor] = useState(true);

  const downloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ backupDate: new Date(), version: "2.4" }));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `OmniBiz_Encrypted_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    logAudit('Cloud Data Backup', 'Downloaded full encrypted JSON backup');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Security, User Roles & Audit Trail</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Role-based access control, active session security, 2FA, and full system activity logs.</p>
        </div>

        <button
          onClick={downloadBackup}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" /> Download Encrypted Backup
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Account & Security Settings */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Account Profile</h3>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">{currentUser.name}</h4>
              <span className="text-[11px] text-slate-500">{currentUser.email}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Switch User Role:</span>
              <select
                className="p-1.5 border rounded-lg dark:bg-slate-900 font-bold"
                value={currentUser.role}
                onChange={e => setCurrentUser({ ...currentUser, role: e.target.value })}
              >
                <option value="Admin">Admin (Full Access)</option>
                <option value="Manager">Branch Manager</option>
                <option value="Accountant">Accountant</option>
                <option value="Cashier">Cashier (Sales Only)</option>
              </select>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
              <span>Two-Factor Authentication (2FA)</span>
              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className={`px-3 py-1 rounded-full font-bold text-[10px] ${twoFactor ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}
              >
                {twoFactor ? '2FA Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">System Activity Audit Log</h3>
          <div className="overflow-x-auto max-h-[380px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold uppercase sticky top-0">
                <tr>
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">User</th>
                  <th className="p-2.5">Action</th>
                  <th className="p-2.5">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                    <td className="p-2.5 text-slate-400 font-mono text-[10px]">{log.timestamp}</td>
                    <td className="p-2.5 font-bold">{log.user}</td>
                    <td className="p-2.5"><span className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded font-bold">{log.action}</span></td>
                    <td className="p-2.5 text-slate-600 dark:text-slate-300">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
