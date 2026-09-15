import React, { useState } from 'react';
import { X, Camera, Scan, Upload, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CameraScannerModal = ({ isOpen, onClose, mode = 'barcode' }) => {
  const { products, createInvoice, logAudit } = useApp();
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [ocrFile, setOcrFile] = useState(null);
  const [ocrStatus, setOcrStatus] = useState('idle'); // idle | scanning | parsed

  if (!isOpen) return null;

  const simulateBarcodeScan = (barcodeStr) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const matchedProduct = products.find(p => p.barcode === barcodeStr || p.sku.toLowerCase().includes(barcodeStr.toLowerCase())) || products[0];
      setScannedResult(matchedProduct);
      logAudit('Barcode Scan', `Scanned item ${matchedProduct.name} (${matchedProduct.barcode})`);
    }, 1200);
  };

  const simulateOCRScan = () => {
    setOcrStatus('scanning');
    setTimeout(() => {
      setOcrStatus('parsed');
      logAudit('AI OCR Invoice Scan', 'Extracted Vendor: Apex Microelectronics, Total: $12,390.00, Tax: $1,890.00');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-400" />
            <span className="font-semibold text-sm">
              {mode === 'ocr' ? 'AI Invoice OCR Scanner' : 'Barcode & QR Code Scanner'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {mode === 'barcode' ? (
            <div>
              {/* Camera Frame Viewfinder Simulator */}
              <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border-2 border-dashed border-brand-500/50">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/10 to-transparent animate-pulse" />
                
                {/* Viewfinder crosshairs */}
                <div className="w-48 h-32 border-2 border-brand-400 rounded-lg relative flex items-center justify-center">
                  <div className="w-full h-0.5 bg-rose-500 animate-ping opacity-75" />
                  <Scan className="w-8 h-8 text-brand-400 opacity-60 animate-spin" />
                </div>

                {scanning && (
                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-white text-sm font-semibold gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
                    Scanning Barcode...
                  </div>
                )}
              </div>

              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
                Align barcode or QR code inside the viewfinder box.
              </p>

              {/* Sample Scan Triggers */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-500 block mb-2">Simulate Camera Feed:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => simulateBarcodeScan('890123456701')}
                    className="px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-700 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-slate-700 dark:text-slate-200 rounded-lg text-left transition-colors border border-slate-200 dark:border-slate-600"
                  >
                    🔍 MacBook Pro M3
                  </button>
                  <button
                    onClick={() => simulateBarcodeScan('890123456702')}
                    className="px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-700 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-slate-700 dark:text-slate-200 rounded-lg text-left transition-colors border border-slate-200 dark:border-slate-600"
                  >
                    🔍 Logitech MX Mouse
                  </button>
                </div>
              </div>

              {/* Result card */}
              {scannedResult && (
                <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-4 h-4" /> Item Matched!
                    </div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">{scannedResult.name}</div>
                    <div className="text-xs text-slate-500">Price: ${scannedResult.sellingPrice} | Stock: {scannedResult.stockMain} pcs</div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* OCR Invoice Scanner Mode */
            <div>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center bg-slate-50 dark:bg-slate-900/50 hover:border-brand-500 transition-colors">
                <Upload className="w-10 h-10 text-brand-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Drag & Drop Invoice / Bill Image or PDF
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP, PDF up to 10MB</p>
                
                <button
                  onClick={simulateOCRScan}
                  disabled={ocrStatus === 'scanning'}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  {ocrStatus === 'scanning' ? 'AI OCR Processing...' : 'Run AI Invoice Extraction'}
                </button>
              </div>

              {ocrStatus === 'parsed' && (
                <div className="mt-4 p-4 bg-brand-50/50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 rounded-xl space-y-2">
                  <div className="flex items-center justify-between border-b border-brand-200/60 pb-2">
                    <span className="text-xs font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Extracted Data
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">99.4% Confidence</span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-700 dark:text-slate-200">
                    <div className="flex justify-between"><span>Vendor Name:</span> <strong>Apex Microelectronics Ltd</strong></div>
                    <div className="flex justify-between"><span>Invoice #:</span> <strong>PO-2026-9041</strong></div>
                    <div className="flex justify-between"><span>GSTIN:</span> <strong>27APEXM9876Q1Z1</strong></div>
                    <div className="flex justify-between"><span>Grand Total:</span> <strong className="text-brand-600 dark:text-brand-400">$12,390.00</strong></div>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full mt-3 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-brand-700"
                  >
                    Auto-fill Purchase Voucher
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
