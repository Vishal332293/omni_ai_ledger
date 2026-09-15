import React from 'react';
import { Share2, Mail, QrCode, HardDrive, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const IntegrationsModule = () => {
  const integrations = [
    { name: 'WhatsApp Business API', desc: 'Send automated invoice links & payment reminders', status: 'Connected', icon: Share2, color: 'emerald' },
    { name: 'Email (SMTP / SendGrid)', desc: 'Automated EOD summaries & PDF bill dispatch', status: 'Connected', icon: Mail, color: 'blue' },
    { name: 'UPI Payment Gateway (PhonePe/Razorpay)', desc: 'Instant QR payment collection & auto-reconciliation', status: 'Active', icon: QrCode, color: 'purple' },
    { name: 'Cloud Storage (Google Drive / S3)', desc: 'Automated daily database backups', status: 'Connected', icon: HardDrive, color: 'amber' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">API Integrations & Hardware Connectors</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Connect third-party WhatsApp, Email, UPI gateways, and barcode scanners.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                <button className="mt-3 px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold">
                  Configure Settings
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
