import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Users, Package, Bot, Plus, QrCode, DollarSign,
  ShoppingCart, FileText, Camera, Mic, Calculator, Bell, WifiOff, Sparkles, X, ChevronRight, Layers, ArrowUpRight
} from 'lucide-react';

import { DashboardModule } from '../modules/DashboardModule';
import { CustomerModule } from '../modules/CustomerModule';
import { SalesModule } from '../modules/SalesModule';
import { InventoryModule } from '../modules/InventoryModule';
import { AIAssistantModule } from '../modules/AIAssistantModule';
import { InvoicingModule } from '../modules/InvoicingModule';
import { PaymentModule } from '../modules/PaymentModule';

import { QuickCalculator } from '../common/QuickCalculator';
import { CameraScannerModal } from '../common/CameraScannerModal';
import { VoiceModal } from '../common/VoiceModal';
import { NewInvoiceModal } from '../common/NewInvoiceModal';

export const MobileLayout = ({ isEmbedded = false }) => {
  const {
    mobileOS,
    activeModule, setActiveModule,
    activeModal, setActiveModal,
    offlineMode, pendingSyncCount, triggerOfflineSync,
    metrics
  } = useApp();

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'customers' | 'stock' | 'ai' | 'more'
  const [showQuickActionDrawer, setShowQuickActionDrawer] = useState(false);

  const quickActions = [
    { label: 'Add Customer', icon: Users, action: () => { setActiveModule('customers'); setShowQuickActionDrawer(false); } },
    { label: 'New Invoice', icon: FileText, action: () => { setActiveModal('new_invoice'); setShowQuickActionDrawer(false); } },
    { label: 'Receive Payment', icon: DollarSign, action: () => { setActiveModule('payments'); setShowQuickActionDrawer(false); } },
    { label: 'Give Payment', icon: ArrowUpRight, action: () => { setActiveModule('suppliers'); setShowQuickActionDrawer(false); } },
    { label: 'Add Product', icon: Package, action: () => { setActiveModule('inventory'); setShowQuickActionDrawer(false); } },
    { label: 'Calculator', icon: Calculator, action: () => { setActiveModal('calculator'); setShowQuickActionDrawer(false); } },
    { label: 'Camera Scanner', icon: Camera, action: () => { setActiveModal('barcode_scanner'); setShowQuickActionDrawer(false); } },
    { label: 'Voice AI', icon: Mic, action: () => { setActiveModal('voice_modal'); setShowQuickActionDrawer(false); } }
  ];

  const renderMobileContent = () => {
    switch (activeTab) {
      case 'home': return <DashboardModule />;
      case 'customers': return <CustomerModule />;
      case 'stock': return <InventoryModule />;
      case 'ai': return <AIAssistantModule />;
      default: return <DashboardModule />;
    }
  };

  const frameContainerStyle = isEmbedded
    ? 'w-[375px] h-[750px] my-4 mx-auto'
    : 'max-w-sm mx-auto my-6 h-[800px]';

  return (
    <div className={`relative flex flex-col ${frameContainerStyle} mobile-device-frame ${mobileOS === 'ios' ? 'ios' : ''} border-8 border-slate-900 shadow-2xl`}>
      {/* Mobile Top Status Bar */}
      <div className="h-7 bg-slate-900 text-white px-5 flex items-center justify-between text-[11px] font-mono shrink-0 select-none z-30">
        <span>9:41 AM</span>
        {/* Notch / Speaker */}
        <div className="w-20 h-4 bg-slate-950 rounded-b-xl flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-800" />
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Offline Alert Banner if dropped */}
      {offlineMode && (
        <div className="bg-amber-500 text-slate-950 text-[11px] font-bold px-3 py-1 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1"><WifiOff className="w-3.5 h-3.5" /> Offline Entry ({pendingSyncCount} queued)</span>
          <button onClick={triggerOfflineSync} className="underline font-extrabold">Sync</button>
        </div>
      )}

      {/* Mobile Header Bar */}
      <div className="h-12 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-600 text-white font-extrabold text-xs flex items-center justify-center">O</div>
          <span className="font-bold text-xs text-slate-900 dark:text-white">OmniBiz Mobile</span>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setActiveModal('barcode_scanner')} className="p-1.5 text-slate-600 dark:text-slate-300">
            <Camera className="w-4 h-4" />
          </button>
          <button onClick={() => setActiveModal('voice_modal')} className="p-1.5 text-purple-600">
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Mobile Body */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900">
        {renderMobileContent()}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="h-16 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-2 flex items-center justify-around shrink-0 relative z-30">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'home' ? 'text-brand-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'customers' ? 'text-brand-600' : 'text-slate-400'}`}
        >
          <Users className="w-5 h-5" />
          <span>Clients</span>
        </button>

        {/* Center Floating (+) Quick Action Button */}
        <button
          onClick={() => setShowQuickActionDrawer(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-lg -mt-6 ring-4 ring-slate-100 dark:ring-slate-900 hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>

        <button
          onClick={() => setActiveTab('stock')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'stock' ? 'text-brand-600' : 'text-slate-400'}`}
        >
          <Package className="w-5 h-5" />
          <span>Stock</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${activeTab === 'ai' ? 'text-purple-600' : 'text-slate-400'}`}
        >
          <Bot className="w-5 h-5" />
          <span>AI</span>
        </button>
      </div>

      {/* Quick Action Drawer Overlay */}
      {showQuickActionDrawer && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white dark:bg-slate-800 rounded-t-3xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">Quick Actions</span>
              <button onClick={() => setShowQuickActionDrawer(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              {quickActions.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <button
                    key={idx}
                    onClick={act.action}
                    className="flex flex-col items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-900 hover:bg-brand-50 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 leading-tight">{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <QuickCalculator isOpen={activeModal === 'calculator'} onClose={() => setActiveModal(null)} />
      <CameraScannerModal isOpen={activeModal === 'barcode_scanner'} mode="barcode" onClose={() => setActiveModal(null)} />
      <VoiceModal isOpen={activeModal === 'voice_modal'} onClose={() => setActiveModal(null)} />
      <NewInvoiceModal isOpen={activeModal === 'new_invoice'} onClose={() => setActiveModal(null)} />
    </div>
  );
};
