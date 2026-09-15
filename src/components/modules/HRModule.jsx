import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Calendar, Award, DollarSign, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const HRModule = () => {
  const { employees, setEmployees } = useApp();
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'attendance' | 'payroll'

  const toggleAttendance = (empId) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId) {
        const nextStatus = emp.status === 'Present' ? 'On Leave' : 'Present';
        return { ...emp, status: nextStatus };
      }
      return emp;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Employee & HR Payroll Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Employee directory, attendance logs, leave approvals, and monthly salary slips.</p>
        </div>

        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
          {['directory', 'attendance', 'payroll'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {employees.map(emp => (
            <div key={emp.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{emp.name}</h3>
                  <span className="text-xs text-slate-500">{emp.role}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                <div>Dept: <strong>{emp.department}</strong></div>
                <div>Email: <span>{emp.email}</span></div>
                <div>Salary: <strong>${emp.salary.toFixed(2)}/mo</strong></div>
                <div>Performance: <span className="font-semibold text-emerald-600">{emp.performance}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Daily Attendance Register</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Status Today</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{emp.name}</td>
                    <td className="p-3">{emp.department}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold ${emp.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleAttendance(emp.id)}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded hover:bg-slate-200"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
