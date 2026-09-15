import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, CheckCircle2, FileText, Sparkles } from 'lucide-react';

export const NewInvoiceModal = ({ isOpen, onClose }) => {
  const { customers, products, createInvoice, setActiveModule, setSelectedInvoice } = useApp();

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [invoiceType, setInvoiceType] = useState('GST Invoice');
  const [discount, setDiscount] = useState(0);
  
  const [cartItems, setCartItems] = useState([
    { productId: products[0]?.id || '', name: products[0]?.name || 'MacBook Pro M3 16"', qty: 1, price: products[0]?.sellingPrice || 2499.00, taxRate: products[0]?.taxRate || 18 }
  ]);

  if (!isOpen) return null;

  const addItem = () => {
    const p = products[0] || { id: 'PRD-001', name: 'Product', sellingPrice: 100, taxRate: 18 };
    setCartItems([...cartItems, { productId: p.id, name: p.name, qty: 1, price: p.sellingPrice, taxRate: p.taxRate }]);
  };

  const removeItem = (idx) => {
    if (cartItems.length > 1) {
      setCartItems(cartItems.filter((_, i) => i !== idx));
    }
  };

  const handleProductChange = (idx, prodId) => {
    const p = products.find(prod => prod.id === prodId);
    if (p) {
      const updated = [...cartItems];
      updated[idx] = { productId: p.id, name: p.name, qty: updated[idx].qty || 1, price: p.sellingPrice, taxRate: p.taxRate };
      setCartItems(updated);
    }
  };

  const handleQtyChange = (idx, qtyVal) => {
    const updated = [...cartItems];
    updated[idx].qty = Math.max(1, parseInt(qtyVal) || 1);
    setCartItems(updated);
  };

  const handlePriceChange = (idx, priceVal) => {
    const updated = [...cartItems];
    updated[idx].price = parseFloat(priceVal) || 0;
    setCartItems(updated);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const discountVal = parseFloat(discount) || 0;
  const taxableAmount = Math.max(0, subtotal - discountVal);
  const cgst = invoiceType === 'GST Invoice' ? taxableAmount * 0.09 : 0;
  const sgst = invoiceType === 'GST Invoice' ? taxableAmount * 0.09 : 0;
  const taxTotal = cgst + sgst;
  const grandTotal = taxableAmount + taxTotal;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === customerId) || customers[0];

    const created = createInvoice({
      type: invoiceType,
      customerName: cust ? cust.name : 'Walk-in Customer',
      customerId: cust ? cust.id : 'CUST-001',
      items: cartItems.map(item => ({ ...item, amount: item.qty * item.price })),
      subtotal,
      cgst,
      sgst,
      igst: 0,
      taxTotal,
      discount: discountVal,
      grandTotal,
      status: 'Unpaid'
    });

    if (created && setSelectedInvoice) {
      setSelectedInvoice(created);
    }
    setActiveModule('invoicing');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-400" />
            <span className="font-bold text-sm">Create New Tax / Non-GST Invoice</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Customer</label>
              <select
                className="w-full p-2.5 border rounded-xl dark:bg-slate-900 font-semibold"
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Invoice Document Type</label>
              <select
                className="w-full p-2.5 border rounded-xl dark:bg-slate-900 font-semibold"
                value={invoiceType}
                onChange={e => setInvoiceType(e.target.value)}
              >
                <option value="GST Invoice">GST Tax Invoice (18% Tax)</option>
                <option value="Non-GST Bill">Non-GST Bill of Supply</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-bold text-slate-700 dark:text-slate-300">
              <span>Invoice Products / Items</span>
              <button
                type="button"
                onClick={addItem}
                className="text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline text-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product Line
              </button>
            </div>

            <div className="space-y-2">
              {cartItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Product</label>
                    <select
                      className="w-full p-1.5 border rounded-lg dark:bg-slate-800 text-xs font-semibold"
                      value={item.productId}
                      onChange={e => handleProductChange(idx, e.target.value)}
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (${p.sellingPrice})</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-20">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Qty</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full p-1.5 border rounded-lg dark:bg-slate-800 text-center font-bold text-xs"
                      value={item.qty}
                      onChange={e => handleQtyChange(idx, e.target.value)}
                    />
                  </div>

                  <div className="w-24">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Price ($)</label>
                    <input
                      type="number"
                      className="w-full p-1.5 border rounded-lg dark:bg-slate-800 text-right font-bold text-xs"
                      value={item.price}
                      onChange={e => handlePriceChange(idx, e.target.value)}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={cartItems.length === 1}
                      className="p-1 text-slate-400 hover:text-rose-500 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discount & Totals Summary */}
          <div className="p-4 bg-brand-50/60 dark:bg-brand-950/40 rounded-xl border border-brand-200 dark:border-brand-900 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-300">Discount Amount ($):</span>
              <input
                type="number"
                min="0"
                className="w-28 p-1.5 border rounded-lg bg-white dark:bg-slate-900 text-right font-bold"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
              />
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {invoiceType === 'GST Invoice' && (
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>GST Tax (CGST 9% + SGST 9%):</span>
                <span>${taxTotal.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-brand-200 dark:border-brand-800">
              <span>Grand Total:</span>
              <span className="text-brand-600 dark:text-brand-400 text-base">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Generate Invoice Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
