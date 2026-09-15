import React, { useState } from 'react';
import { Mic, X, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VoiceModal = ({ isOpen, onClose }) => {
  const { setActiveModule, setActiveModal, logAudit } = useApp();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [executedCommand, setExecutedCommand] = useState(null);

  if (!isOpen) return null;

  const sampleCommands = [
    { text: "Create new tax invoice for TechCorp", action: () => { setActiveModal('new_invoice'); onClose(); } },
    { text: "Show low stock products alert", action: () => { setActiveModule('inventory'); onClose(); } },
    { text: "What is my net profit today?", action: () => { setActiveModule('dashboard'); onClose(); } },
    { text: "Open Customer CRM directory", action: () => { setActiveModule('customers'); onClose(); } }
  ];

  const handleMicClick = (cmd) => {
    setListening(true);
    setTranscript(cmd.text);
    setTimeout(() => {
      setListening(false);
      setExecutedCommand(cmd.text);
      logAudit('Voice Command Executed', `Command: "${cmd.text}"`);
      setTimeout(() => {
        cmd.action();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-center p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400">
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center relative mb-4">
          <Mic className={`w-8 h-8 ${listening ? 'animate-bounce text-rose-500' : ''}`} />
          {listening && (
            <div className="absolute inset-0 rounded-full border-4 border-rose-500 animate-ping opacity-50" />
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Voice AI Command Assistant</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {listening ? 'Listening to your prompt...' : 'Speak natural language instructions to control your business software.'}
        </p>

        {transcript && (
          <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2">
            <Volume2 className="w-4 h-4 text-brand-500 animate-pulse" />
            "{transcript}"
          </div>
        )}

        {executedCommand && (
          <div className="mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Command recognized! Executing...
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Try Voice Prompts:</span>
          <div className="space-y-1.5">
            {sampleCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => handleMicClick(cmd)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-900 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between group transition-colors"
              >
                <span>🎙️ "{cmd.text}"</span>
                <Sparkles className="w-3.5 h-3.5 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
