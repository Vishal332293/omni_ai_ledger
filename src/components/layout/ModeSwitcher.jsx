import React from 'react';
import { Monitor, Smartphone, Columns, Wifi, WifiOff, RefreshCw, Moon, Sun, Layers, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ModeSwitcher = () => {
  const {
    viewMode, setViewMode,
    mobileOS, setMobileOS,
    activeBranch, setActiveBranch,
    theme, setTheme,
    offlineMode, setOfflineMode,
    pendingSyncCount, triggerOfflineSync,
    currentUser, setCurrentUser
  } = useApp();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="bg-slate-900 text-white px-4 py-2 flex flex-wrap items-center justify-between text-xs border-b border-slate-800 shadow-md z-40 sticky top-0">
      {/* Left: App Logo & Mode Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-xs">
            O
          </div>
          <span className="font-extrabold tracking-tight text-sm bg-gradient-to-r from-white via-slate-200 to-brand-300 bg-clip-text text-transparent">
            OmniBiz AI <span className="text-[10px] text-brand-400 font-mono font-semibold uppercase px-1.5 py-0.5 bg-brand-950 rounded-full border border-brand-800">Suite v2.4</span>
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800 hidden sm:block" />

        {/* View Mode Buttons */}
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold ${
              viewMode === 'desktop'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop Software</span>
          </button>

          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold ${
              viewMode === 'mobile'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile App Simulator</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold ${
              viewMode === 'split'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Split Dual View</span>
          </button>
        </div>

        {/* Mobile OS Switcher if in mobile or split view */}
        {(viewMode === 'mobile' || viewMode === 'split') && (
          <div className="flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded-md border border-slate-700/50">
            <span className="text-[10px] text-slate-400 font-semibold">OS:</span>
            <button
              onClick={() => setMobileOS('android')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                mobileOS === 'android' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Android
            </button>
            <button
              onClick={() => setMobileOS('ios')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                mobileOS === 'ios' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              iOS
            </button>
          </div>
        )}
      </div>

      {/* Right: Branch Switcher, Real-time Sync & Theme */}
      <div className="flex items-center gap-3 mt-1 sm:mt-0">
        {/* Branch Switcher */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
          <Layers className="w-3.5 h-3.5 text-brand-400" />
          <select
            value={activeBranch}
            onChange={(e) => setActiveBranch(e.target.value)}
            className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="Main Branch (HQ)" className="bg-slate-800 text-white">HQ Main Branch</option>
            <option value="Downtown Outlet" className="bg-slate-800 text-white">Downtown Outlet</option>
            <option value="Warehouse West" className="bg-slate-800 text-white">Warehouse West</option>
          </select>
        </div>

        {/* Sync & Offline Simulator */}
        <div className="flex items-center gap-2">
          {offlineMode ? (
            <button
              onClick={triggerOfflineSync}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800 text-[11px] font-semibold animate-pulse"
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline ({pendingSyncCount} pending) - Sync Now</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Cloud Sync</span>
            </div>
          )}

          <button
            onClick={() => {
              setOfflineMode(!offlineMode);
              if (!offlineMode) setPendingSyncCount(3);
            }}
            title="Toggle simulated network drop"
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Toggle Light / Dark theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Role Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-700/60 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-300">{currentUser.role}</span>
        </div>
      </div>
    </div>
  );
};
