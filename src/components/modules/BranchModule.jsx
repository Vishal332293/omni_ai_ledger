import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, MapPin, Users, DollarSign, Layers } from 'lucide-react';

export const BranchModule = () => {
  const { activeBranch, setActiveBranch, sales, employees } = useApp();

  const branches = [
    { id: 'b1', name: 'Main Branch (HQ)', location: 'San Francisco, CA', manager: 'Alex Vance', staff: 14, sales: 84500 },
    { id: 'b2', name: 'Downtown Outlet', location: 'Chicago, IL', manager: 'Sarah Jenkins', staff: 6, sales: 42300 },
    { id: 'b3', name: 'Warehouse West', location: 'Seattle, WA', manager: 'Michael Chang', staff: 8, sales: 96400 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Multi-Business & Multi-Branch Directory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Switch between individual branch workspaces or view consolidated business group metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map(b => (
          <div
            key={b.id}
            onClick={() => setActiveBranch(b.name)}
            className={`p-6 rounded-2xl border cursor-pointer transition-all space-y-4 ${
              activeBranch === b.name
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 shadow-md ring-2 ring-brand-500/20'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 font-bold flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              {activeBranch === b.name && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-600 text-white rounded-full">Active View</span>
              )}
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{b.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5" /> {b.location}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Manager</span>
                <strong className="text-slate-800 dark:text-white">{b.manager}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Branch Sales</span>
                <strong className="text-emerald-600">${b.sales.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
