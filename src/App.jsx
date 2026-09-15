import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ModeSwitcher } from './components/layout/ModeSwitcher';
import { DesktopLayout } from './components/layout/DesktopLayout';
import { MobileLayout } from './components/layout/MobileLayout';

const AppContent = () => {
  const { viewMode } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 font-sans">
      {/* Top Controls Header Bar */}
      <ModeSwitcher />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {viewMode === 'desktop' && (
          <DesktopLayout />
        )}

        {viewMode === 'mobile' && (
          <div className="flex-1 flex items-center justify-center p-4 bg-slate-950/90 min-h-[calc(100vh-42px)]">
            <MobileLayout isEmbedded={false} />
          </div>
        )}

        {viewMode === 'split' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[calc(100vh-42px)]">
            {/* Desktop View Pane */}
            <div className="lg:col-span-8 border-r border-slate-300 dark:border-slate-800 overflow-hidden">
              <DesktopLayout />
            </div>

            {/* Live Synchronized Mobile Device View Pane */}
            <div className="lg:col-span-4 bg-slate-950 p-4 flex flex-col items-center justify-center overflow-y-auto">
              <div className="text-center text-white mb-2">
                <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block">Live Cross-Platform Sync</span>
                <span className="text-[11px] text-slate-400">Edits made on Desktop instantly reflect on Mobile Simulator</span>
              </div>
              <MobileLayout isEmbedded={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
