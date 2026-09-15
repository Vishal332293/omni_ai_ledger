import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, Download, Share2, Plus, FileText, CheckCircle2, QrCode, Sparkles } from 'lucide-react';

export const InvoicingModule = () => {
  const { sales, customers, products, createInvoice, logAudit } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState(sales[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [template, setTemplate] = useState('Modern'); // 'Modern' | 'Classic' | 'Compact'

  // New Invoice Form
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [invoiceType, setInvoiceType] = useState('GST Invoice');
  const [cartItems, setCartItems] = useState([
    { productId: products[0]?.id, name: products[0]?.name, qty: 1, price: products[0]?.sellingPrice, taxRate: 18 }
  ]);
  const [discount, setDiscount] = useState(0);

  const addItemToInvoice = () => {
    const p = products[0];
    setCartItems([...cartItems, { productId: p.id, name: p.name, qty: 1, price: p.sellingPrice, taxRate: p.taxRate }]);
  };

  const removeItem = (idx) => {
    setCartItems(cartItems.filter((_, i) => i !== idx));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const cgst = invoiceType === 'GST Invoice' ? (subtotal - discount) * 0.09 : 0;
  const sgst = invoiceType === 'GST Invoice' ? (subtotal - discount) * 0.09 : 0;
  const taxTotal = cgst + sgst;
  const grandTotal = subtotal - discount + taxTotal;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === customerId);
    createInvoice({
      type: invoiceType,
      customerName: cust ? cust.name : 'Walk-in Customer',
      customerId,
      items: cartItems.map(item => ({ ...item, amount: item.qty * item.price })),
      subtotal,
      cgst,
      sgst,
      igst: 0,
      taxTotal,
      discount,
      grandTotal,
      status: 'Unpaid'
    });
    setShowCreateModal(false);
  };

  const handlePrint = () => {
    window.print();
    logAudit('Print Invoice', `Printed Invoice ${selectedInvoice.id}`);
  };

  const generateWhatsAppLink = () => {
    const msg = `Hello ${selectedInvoice.customerName}, your Tax Invoice ${selectedInvoice.id} for $${selectedInvoice.grandTotal.toFixed(2)} is ready. Pay online or download receipt. Thank you for doing business with OmniBiz AI!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">GST Billing & Invoicing Engine</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Create tax invoices, non-GST bills, HSN breakdowns, print & share digitally.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create New Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Invoice Selection List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Recent Invoices</h3>
          <div className="space-y-2">
            {sales.map(inv => (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoice(inv)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedInvoice?.id === inv.id
                    ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{inv.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                    inv.status === 'Partial' ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {inv.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">{inv.customerName}</div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
                  <span>{inv.date}</span>
                  <strong className="text-slate-900 dark:text-white font-bold">${inv.grandTotal.toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive Invoice Document Preview */}
        {selectedInvoice && (
          <div className="lg:col-span-2 space-y-4">
            {/* Template & Print Action Toolbar */}
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Template Style:</span>
                {['Modern', 'Classic', 'Compact'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      template === t ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / PDF
                </button>
                <button
                  onClick={generateWhatsAppLink}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-emerald-700"
                >
                  <Share2 className="w-3.5 h-3.5" /> WhatsApp Invoice
                </button>
              </div>
            </div>

            {/* Print Target Sheet */}
            <div id="printable-invoice" className="bg-white text-slate-900 p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6 font-sans">
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center font-bold">O</div>
                    <span className="text-xl font-extrabold tracking-tight text-slate-900">OmniBiz AI Corp</span>
                  </div>
                  <p className="text-xs text-slate-500">742 Innovation Way, Tech Suite 400<br/>San Francisco, CA 94107<br/>GSTIN: 27AAAC1234F1Z5 | Phone: +1 (555) 019-2831</p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 font-bold text-xs rounded-lg uppercase tracking-wider mb-2">
                    {selectedInvoice.type}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900">{selectedInvoice.id}</h2>
                  <p className="text-xs text-slate-500 mt-1">Date: <strong>{selectedInvoice.date}</strong></p>
                  <p className="text-xs text-slate-500">Due Date: <strong>{selectedInvoice.dueDate || selectedInvoice.date}</strong></p>
                </div>
              </div>

              {/* Billed To / Shipping */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Billed To (Customer):</span>
                  <strong className="text-sm font-bold text-slate-900 block">{selectedInvoice.customerName}</strong>
                  <p className="text-slate-600 mt-0.5">Account ID: {selectedInvoice.customerId}</p>
                  <p className="text-slate-600">Salesperson: {selectedInvoice.salesperson}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Payment Details:</span>
                  <p className="text-slate-600">Status: <strong className={selectedInvoice.status === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}>{selectedInvoice.status}</strong></p>
                  <p className="text-slate-600">Branch: <strong>{selectedInvoice.branch}</strong></p>
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right">GST Rate</th>
                    <th className="p-2.5 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-semibold text-slate-800">{item.name}</td>
                      <td className="p-2.5 text-center font-bold">{item.qty}</td>
                      <td className="p-2.5 text-right">${item.price.toFixed(2)}</td>
                      <td className="p-2.5 text-right">{item.taxRate || 18}%</td>
                      <td className="p-2.5 text-right font-bold">${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Summary Breakdown */}
              <div className="flex justify-between items-end pt-4 border-t border-slate-200">
                {/* UPI QR Code Block */}
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-16 h-16 bg-white p-1 border rounded flex items-center justify-center">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Instant UPI Payment</span>
                    <span className="text-xs font-bold text-slate-800 block">Scan to Pay via GPay / PhonePe</span>
                    <span className="text-[10px] text-slate-500 font-mono">upi@omnibiz.ai</span>
                  </div>
                </div>

                <div className="w-64 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between"><span>Subtotal:</span> <span>${selectedInvoice.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Discount:</span> <span>-${(selectedInvoice.discount || 0).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>CGST (9%):</span> <span>${selectedInvoice.cgst.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>SGST (9%):</span> <span>${selectedInvoice.sgst.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span className="text-brand-600">${selectedInvoice.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create New Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Tax Invoice</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Select Customer</label>
                  <select className="w-full p-2 border rounded-lg dark:bg-slate-900" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Invoice Type</label>
                  <select className="w-full p-2 border rounded-lg dark:bg-slate-900" value={invoiceType} onChange={e => setInvoiceType(e.target.value)}>
                    <option value="GST Invoice">GST Tax Invoice</option>
                    <option value="Non-GST Bill">Non-GST Bill of Supply</option>
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Line Items</span>
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      className="flex-1 p-2 border rounded-lg dark:bg-slate-900"
                      value={item.productId}
                      onChange={e => {
                        const p = products.find(prod => prod.id === e.target.value);
                        if (p) {
                          const updated = [...cartItems];
                          updated[idx] = { productId: p.id, name: p.name, qty: 1, price: p.sellingPrice, taxRate: p.taxRate };
                          setCartItems(updated);
                        }
                      }}
                    >
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.sellingPrice})</option>)}
                    </select>
                    <input
                      type="number"
                      min="1"
                      className="w-16 p-2 border rounded-lg dark:bg-slate-900 text-center font-bold"
                      value={item.qty}
                      onChange={e => {
                        const updated = [...cartItems];
                        updated[idx].qty = parseInt(e.target.value) || 1;
                        setCartItems(updated);
                      }}
                    />
                    <button type="button" onClick={() => removeItem(idx)} className="p-2 text-rose-500 font-bold">✕</button>
                  </div>
                ))}
                <button type="button" onClick={addItemToInvoice} className="text-brand-600 font-bold text-xs hover:underline">+ Add Line Item</button>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
                <div className="flex justify-between font-bold"><span>Grand Total Calculated:</span> <span className="text-brand-600 text-sm">${grandTotal.toFixed(2)}</span></div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold rounded-lg">Generate & Save Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
