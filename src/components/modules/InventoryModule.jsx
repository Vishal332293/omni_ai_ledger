import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DataTable } from '../common/DataTable';
import { Package, Plus, Barcode, AlertTriangle, Layers, ArrowLeftRight, Camera, Sparkles, CheckCircle2 } from 'lucide-react';

export const InventoryModule = () => {
  const { products, addProduct, setActiveModal, logAudit } = useApp();
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'warehouses' | 'transfers' | 'valuation'
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState(null);

  const [formData, setFormData] = useState({
    name: '', sku: '', hsn: '', category: 'Electronics', unit: 'Pcs',
    purchasePrice: 100, sellingPrice: 150, taxRate: 18, stockMain: 20, reorderLevel: 5, barcode: '890123456799', batchNo: 'BAT-2026-10', expiryDate: '2028-12-31'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({
      ...formData,
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      stockMain: parseInt(formData.stockMain),
      reorderLevel: parseInt(formData.reorderLevel)
    });
    setShowAddModal(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Product Item',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-xs">{val}</div>
            <div className="text-[11px] text-slate-500">SKU: {row.sku} | HSN: {row.hsn}</div>
          </div>
        </div>
      )
    },
    { key: 'category', label: 'Category' },
    {
      key: 'sellingPrice',
      label: 'Price',
      render: (val) => <span className="font-bold text-xs">${val.toFixed(2)}</span>
    },
    {
      key: 'stockMain',
      label: 'Main Stock',
      render: (val, row) => (
        <span className={`px-2 py-0.5 rounded font-bold text-xs ${
          val <= row.reorderLevel ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {val} {row.unit}
        </span>
      )
    },
    { key: 'stockBranchA', label: 'Branch A Stock' },
    { key: 'batchNo', label: 'Batch #' },
    {
      key: 'barcode',
      label: 'Barcode',
      render: (val, row) => (
        <button
          onClick={() => setSelectedBarcode(row)}
          className="flex items-center gap-1 text-[11px] font-mono text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200 hover:bg-brand-100"
        >
          <Barcode className="w-3.5 h-3.5" /> {val}
        </button>
      )
    }
  ];

  const totalStockValuation = products.reduce((acc, p) => acc + (p.stockMain + p.stockBranchA) * p.purchasePrice, 0);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Multi-Warehouse Inventory & Stock Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track stock levels, reorder thresholds, barcode scanning, batches, and valuation.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('barcode_scanner')}
            className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 hover:bg-slate-700"
          >
            <Camera className="w-4 h-4 text-brand-400" /> Barcode Camera Scanner
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Total Stock Valuation</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">${totalStockValuation.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600"><Layers className="w-5 h-5" /></div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Active SKUs</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{products.length} Products</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600"><Package className="w-5 h-5" /></div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Low Stock Reorder Alerts</span>
            <h3 className="text-xl font-bold text-rose-600">{products.filter(p => p.stockMain <= p.reorderLevel).length} Items</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600"><AlertTriangle className="w-5 h-5" /></div>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search products by SKU, name, HSN, barcode..."
      />

      {/* Barcode Viewer Modal */}
      {selectedBarcode && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 text-center max-w-xs w-full space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{selectedBarcode.name}</h3>
            <p className="text-xs text-slate-500">SKU: {selectedBarcode.sku}</p>

            {/* Generated Barcode Graphic */}
            <div className="p-4 bg-white rounded-xl border border-slate-300 flex flex-col items-center justify-center space-y-2">
              <div className="h-16 w-full bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px,#000_4px,#000_8px,#fff_8px,#fff_10px)]" />
              <span className="font-mono text-xs tracking-widest font-bold text-slate-900">{selectedBarcode.barcode}</span>
            </div>

            <button onClick={() => setSelectedBarcode(null)} className="w-full py-2 bg-slate-800 text-white rounded-lg text-xs font-bold">
              Close Label
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Inventory Product</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Product Name</label>
                  <input required type="text" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">SKU Code</label>
                  <input required type="text" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">HSN Code</label>
                  <input type="text" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.hsn} onChange={e => setFormData({...formData, hsn: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Purchase Price ($)</label>
                  <input required type="number" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.purchasePrice} onChange={e => setFormData({...formData, purchasePrice: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Selling Price ($)</label>
                  <input required type="number" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Opening Stock</label>
                  <input required type="number" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.stockMain} onChange={e => setFormData({...formData, stockMain: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Reorder Level</label>
                  <input required type="number" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.reorderLevel} onChange={e => setFormData({...formData, reorderLevel: e.target.value})} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Tax Rate (%)</label>
                  <input type="number" className="w-full p-2 border rounded-lg dark:bg-slate-900" value={formData.taxRate} onChange={e => setFormData({...formData, taxRate: e.target.value})} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold rounded-lg">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
