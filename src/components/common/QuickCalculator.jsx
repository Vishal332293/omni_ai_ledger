import React, { useState } from 'react';
import { X, Calculator, Delete } from 'lucide-react';

export const QuickCalculator = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  if (!isOpen) return null;

  const handleBtn = (val) => {
    if (val === 'C') {
      setDisplay('0');
      setEquation('');
      return;
    }

    if (val === 'DEL') {
      if (display.length > 1) {
        setDisplay(display.slice(0, -1));
      } else {
        setDisplay('0');
      }
      return;
    }

    if (val === '=') {
      try {
        const sanitized = (equation + display).replace(/×/g, '*').replace(/÷/g, '/');
        // safe eval for calc
        const res = Function(`"use strict"; return (${sanitized})`)();
        setDisplay(String(Number(res.toFixed(4))));
        setEquation('');
      } catch (err) {
        setDisplay('Error');
      }
      return;
    }

    if (['+', '-', '×', '÷'].includes(val)) {
      setEquation(equation + display + ' ' + val + ' ');
      setDisplay('0');
      return;
    }

    if (display === '0') {
      setDisplay(val);
    } else {
      setDisplay(display + val);
    }
  };

  const buttons = [
    'C', 'DEL', '÷', '×',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    '0', '.', '00', '%'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-xs overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-brand-400" />
            <span className="font-semibold text-sm tracking-wide">Quick Business Calculator</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-100 dark:bg-slate-900 text-right">
          <div className="text-xs text-slate-400 min-h-[16px] font-mono">{equation}</div>
          <div className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white truncate">
            {display}
          </div>
        </div>

        <div className="p-4 grid grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleBtn(btn)}
              className={`p-3 font-semibold rounded-xl text-base transition-all active:scale-95 shadow-xs ${
                btn === '='
                  ? 'bg-brand-600 hover:bg-brand-700 text-white col-span-1 shadow-brand-500/20'
                  : ['C', 'DEL'].includes(btn)
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-200'
                  : ['+', '-', '×', '÷'].includes(btn)
                  ? 'bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 hover:bg-brand-200'
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
