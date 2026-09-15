import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, CheckSquare, Clock, Plus, Users, DollarSign, ArrowUpRight } from 'lucide-react';

export const ProjectModule = () => {
  const { projects, setProjects } = useApp();
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Project Management & Profitability</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track client projects, Kanban tasks, assign team members, and monitor live profitability.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Projects</h3>
          <div className="space-y-3">
            {projects.map(prj => {
              const profit = prj.budget - prj.spent;
              return (
                <div
                  key={prj.id}
                  onClick={() => setSelectedProject(prj)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedProject?.id === prj.id
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{prj.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">{prj.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Client: {prj.client}</p>

                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Progress</span>
                      <strong className="text-slate-900 dark:text-white">{prj.progress}%</strong>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-600 rounded-full" style={{ width: `${prj.progress}%` }} />
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between text-[11px]">
                    <span>Budget: <strong>${prj.budget}</strong></span>
                    <span className="text-emerald-600 font-bold">Profit: ${profit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Project Kanban Task Board */}
        {selectedProject && (
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedProject.title}</h3>
                <p className="text-xs text-slate-500">Deadline: {selectedProject.deadline} | Assigned: {selectedProject.assignedTo.join(', ')}</p>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-3 gap-3">
              {['To Do', 'In Progress', 'Done'].map(statusCol => {
                const colTasks = selectedProject.tasks.filter(t => t.status === statusCol);
                return (
                  <div key={statusCol} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600 uppercase">
                      <span>{statusCol}</span>
                      <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">{colTasks.length}</span>
                    </div>

                    {colTasks.map(t => (
                      <div key={t.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
                        <span className="font-bold text-xs text-slate-900 dark:text-white block">{t.title}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                          {t.priority} Priority
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
