import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, change, isPositive, icon: Icon, color = 'blue', subtitle }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-100 dark:border-blue-900/40',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-100 dark:border-amber-900/40',
    red: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-100 dark:border-rose-900/40',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border-purple-100 dark:border-purple-900/40'
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">{title}</span>
        <div className={`p-2.5 rounded-xl border ${colorMap[color]} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        {change && (
          <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' 
              : 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  );
};
