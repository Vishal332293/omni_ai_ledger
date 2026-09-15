import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard, Users, Truck, ShoppingCart, ShoppingBag, Package,
  FileText, Landmark, QrCode, UserCheck, Briefcase, Bot, BarChart3,
  Zap, Building2, Shield, Share2, Search, Bell, Calculator, Camera, Mic, Sparkles, X, ChevronRight, Plus
} from 'lucide-react';

// Modules
import { DashboardModule } from '../modules/DashboardModule';
import { CustomerModule } from '../modules/CustomerModule';
import { SupplierModule } from '../modules/SupplierModule';
import { SalesModule } from '../modules/SalesModule';
import { PurchaseModule } from '../modules/PurchaseModule';
import { InventoryModule } from '../modules/InventoryModule';
import { InvoicingModule } from '../modules/InvoicingModule';
import { AccountingModule } from '../modules/AccountingModule';
import { PaymentModule } from '../modules/PaymentModule';
import { HRModule } from '../modules/HRModule';
import { ProjectModule } from '../modules/ProjectModule';
import { AIAssistantModule } from '../modules/AIAssistantModule';
import { ReportModule } from '../modules/ReportModule';
import { AutomationModule } from '../modules/AutomationModule';
import { BranchModule } from '../modules/BranchModule';
import { SecurityModule } from '../modules/SecurityModule';
import { IntegrationsModule } from '../modules/IntegrationsModule';

// Common Modals
import { QuickCalculator } from '../common/QuickCalculator';
import { CameraScannerModal } from '../common/CameraScannerModal';
import { VoiceModal } from '../common/VoiceModal';
import { NewInvoiceModal } from '../common/NewInvoiceModal';

export const DesktopLayout = () => {
  const {
    activeModule, setActiveModule,
    activeBranch,
    activeModal, setActiveModal,
    notifications,
    currentUser
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers (CRM)', icon: Users },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'sales', label: 'Sales Management', icon: ShoppingCart },
    { id: 'purchases', label: 'Purchase Orders', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package },
    { id: 'invoicing', label: 'Billing & GST Invoices', icon: FileText },
    { id: 'accounting', label: 'Accounting & Finance', icon: Landmark },
    { id: 'payments', label: 'UPI & Payment Links', icon: QrCode },
    { id: 'hr', label: 'Employee & HR', icon: UserCheck },
    { id: 'projects', label: 'Project Manager', icon: Briefcase },
    { id: 'ai_assistant', label: 'AI Assistant (OmniAI)', icon: Bot, badge: 'AI' },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'automation', label: 'Automation & Alerts', icon: Zap },
    { id: 'branches', label: 'Multi-Branch', icon: Building2 },
    { id: 'security', label: 'Security & Audit', icon: Shield },
    { id: 'integrations', label: 'API Integrations', icon: Share2 }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard': return <DashboardModule />;
      case 'customers': return <CustomerModule />;
      case 'suppliers': return <SupplierModule />;
      case 'sales': return <SalesModule />;
      case 'purchases': return <PurchaseModule />;
      case 'inventory': return <InventoryModule />;
      case 'invoicing': return <InvoicingModule />;
      case 'accounting': return <AccountingModule />;
      case 'payments': return <PaymentModule />;
      case 'hr': return <HRModule />;
      case 'projects': return <ProjectModule />;
      case 'ai_assistant': return <AIAssistantModule />;
      case 'reports': return <ReportModule />;
      case 'automation': return <AutomationModule />;
      case 'branches': return <BranchModule />;
      case 'security': return <SecurityModule />;
      case 'integrations': return <IntegrationsModule />;
      default: return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
              O
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-tight">OmniBiz AI</h2>
              <span className="text-[10px] text-slate-400 block font-mono">{activeBranch}</span>
            </div>
          </div>
        </div>

        {/* Nav list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-gradient-to-r from-amber-400 to-purple-500 text-slate-950 uppercase">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
            <div className="flex-1 truncate">
              <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
              <span className="text-[10px] text-slate-400 block font-mono">{currentUser.role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Right Panel */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <header className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200/80 dark:border-slate-700/60 px-6 flex items-center justify-between gap-4 shrink-0 shadow-xs">
          {/* Quick Search */}
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Quick search records (Ctrl + K)..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Quick Action Utilities */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('new_invoice')}
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> + Invoice
            </button>

            <button
              onClick={() => setActiveModal('calculator')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="Quick Calculator"
            >
              <Calculator className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveModal('barcode_scanner')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="Barcode & OCR Scanner"
            >
              <Camera className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveModal('voice_modal')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="Voice AI Controls"
            >
              <Mic className="w-4 h-4 text-purple-500" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-800" />
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 z-50">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-bold text-xs">Alerts & Notifications ({notifications.length})</span>
                    <button onClick={() => setShowNotifications(false)}><X className="w-4 h-4 text-slate-400" /></button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white flex justify-between">
                          <span>{n.title}</span>
                          <span className="text-[9px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveModule('ai_assistant')}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-90 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> OmniAI
            </button>
          </div>
        </header>

        {/* Scrollable Module Workspace Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderActiveModule()}
        </div>
      </main>

      {/* Global Modals */}
      <QuickCalculator isOpen={activeModal === 'calculator'} onClose={() => setActiveModal(null)} />
      <CameraScannerModal isOpen={activeModal === 'barcode_scanner' || activeModal === 'ocr_modal'} mode={activeModal === 'ocr_modal' ? 'ocr' : 'barcode'} onClose={() => setActiveModal(null)} />
      <VoiceModal isOpen={activeModal === 'voice_modal'} onClose={() => setActiveModal(null)} />
      <NewInvoiceModal isOpen={activeModal === 'new_invoice'} onClose={() => setActiveModal(null)} />
    </div>
  );
};
