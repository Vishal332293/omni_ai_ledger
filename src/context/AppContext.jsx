import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Platform Mode
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'mobile' | 'split'
  const [mobileOS, setMobileOS] = useState('android'); // 'android' | 'ios'
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activeBranch, setActiveBranch] = useState('Main Branch (HQ)');
  const [theme, setTheme] = useState('light');
  const [offlineMode, setOfflineMode] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // User & Permissions
  const [currentUser, setCurrentUser] = useState({
    id: 'USR-001',
    name: 'Alex Vance',
    role: 'Admin',
    email: 'alex.vance@omnibiz.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    branch: 'Main Branch (HQ)'
  });

  // Modal / Multi-window management
  const [activeModal, setActiveModal] = useState(null); // null | 'new_invoice' | 'new_customer' | 'new_product' | 'receive_payment' | 'calculator' | 'barcode_scanner' | 'ocr_modal' | 'voice_modal'
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Low Stock Alert', message: 'Logitech MX Master 3S is below reorder level (4 units left).', time: '10 mins ago', type: 'warning' },
    { id: 2, title: 'Payment Overdue', message: 'Invoice #INV-2026-003 for Global Retailers ($4,250) is 5 days overdue.', time: '1 hour ago', type: 'error' },
    { id: 3, title: 'New Sale Order', message: 'Quotation #QT-2026-008 was accepted by Sunrise Mart.', time: '2 hours ago', type: 'success' },
    { id: 4, title: 'AI Recommendation', message: 'Reorder USB-C Hubs now to prevent stockout next week.', time: '3 hours ago', type: 'info' }
  ]);

  // --- MOCK DATABASE ---
  
  // 1. Customers
  const [customers, setCustomers] = useState([
    {
      id: 'CUST-001',
      name: 'TechCorp Solutions Pvt Ltd',
      company: 'TechCorp Solutions',
      email: 'billing@techcorp.io',
      phone: '+1 (555) 234-5678',
      gstin: '27AAACT1234F1Z5',
      category: 'VIP',
      leadStage: 'Won',
      balance: 14250.00,
      creditLimit: 50000.00,
      address: '742 Innovation Way, Tech Park, San Francisco, CA',
      notes: 'Key enterprise account. Requires net 30 payment terms.',
      salesCount: 18,
      totalSpent: 84500.00,
      lastOrder: '2026-09-12'
    },
    {
      id: 'CUST-002',
      name: 'Global Retailers Inc',
      company: 'Global Retailers',
      email: 'accounts@globalretail.com',
      phone: '+1 (555) 876-5432',
      gstin: '29ABCDE6789G1Z2',
      category: 'Wholesale',
      leadStage: 'Won',
      balance: 4250.00,
      creditLimit: 20000.00,
      address: '100 Commerce Blvd, Suite 400, Chicago, IL',
      notes: 'Follow up every Friday for payment release.',
      salesCount: 12,
      totalSpent: 42300.00,
      lastOrder: '2026-09-08'
    },
    {
      id: 'CUST-003',
      name: 'Sunrise Supermart',
      company: 'Sunrise Retail',
      email: 'info@sunrisemart.org',
      phone: '+1 (555) 432-1098',
      gstin: '33FGHIJ9012K1Z9',
      category: 'Retail',
      leadStage: 'Negotiation',
      balance: 0.00,
      creditLimit: 10000.00,
      address: '45 Market Street, Austin, TX',
      notes: 'Interested in bulk orders of ergonomic chairs.',
      salesCount: 5,
      totalSpent: 12800.00,
      lastOrder: '2026-08-28'
    },
    {
      id: 'CUST-004',
      name: 'Apex Logistics & Cargo',
      company: 'Apex Logistics',
      email: 'ops@apexcargo.net',
      phone: '+1 (555) 998-7766',
      gstin: '07KLMNO3456P1Z3',
      category: 'VIP',
      leadStage: 'Won',
      balance: 8900.00,
      creditLimit: 35000.00,
      address: '88 Freight Depot Rd, Seattle, WA',
      notes: 'Prefers monthly consolidated tax invoices.',
      salesCount: 22,
      totalSpent: 96400.00,
      lastOrder: '2026-09-14'
    }
  ]);

  // 2. Suppliers
  const [suppliers, setSuppliers] = useState([
    {
      id: 'SUP-001',
      name: 'Apex Microelectronics Ltd',
      contactPerson: 'David Chen',
      email: 'orders@apexmicro.com',
      phone: '+1 (555) 111-2233',
      gstin: '27APEXM9876Q1Z1',
      payableBalance: 12800.00,
      address: '900 Silicon Ave, San Jose, CA',
      rating: 4.9,
      notes: 'Primary supplier for laptops and monitors. 15-day delivery window.'
    },
    {
      id: 'SUP-002',
      name: 'Metro Office Furniture Co',
      contactPerson: 'Sarah Jenkins',
      email: 'sales@metrofurniture.com',
      phone: '+1 (555) 333-4455',
      gstin: '06METRO4567R1Z4',
      payableBalance: 3400.00,
      address: '320 Industrial Pkwy, Grand Rapids, MI',
      rating: 4.7,
      notes: 'Bulk discounts available on orders above $5,000.'
    },
    {
      id: 'SUP-003',
      name: 'CyberTech Distributors',
      contactPerson: 'Mark Miller',
      email: 'mark@cybertechdist.com',
      phone: '+1 (555) 555-6677',
      gstin: '36CYBER1234S1Z8',
      payableBalance: 0.00,
      address: '50 Tech Plaza, Dallas, TX',
      rating: 4.8,
      notes: 'Fast 24-hour shipping on accessories.'
    }
  ]);

  // 3. Products / Inventory
  const [products, setProducts] = useState([
    {
      id: 'PRD-001',
      name: 'MacBook Pro M3 16"',
      sku: 'APP-MBP-M3-16',
      hsn: '84713010',
      category: 'Electronics',
      unit: 'Pcs',
      purchasePrice: 2100.00,
      sellingPrice: 2499.00,
      taxRate: 18,
      stockMain: 14,
      stockBranchA: 6,
      stockTransit: 2,
      reorderLevel: 5,
      barcode: '890123456701',
      batchNo: 'BAT-2026-08',
      expiryDate: '2028-12-31',
      damagedStock: 0,
      warehouse: 'Main Warehouse'
    },
    {
      id: 'PRD-002',
      name: 'Logitech MX Master 3S Mouse',
      sku: 'LOG-MXM-3S',
      hsn: '84716060',
      category: 'Accessories',
      unit: 'Pcs',
      purchasePrice: 75.00,
      sellingPrice: 99.00,
      taxRate: 18,
      stockMain: 4,
      stockBranchA: 2,
      stockTransit: 0,
      reorderLevel: 10,
      barcode: '890123456702',
      batchNo: 'BAT-2026-05',
      expiryDate: 'N/A',
      damagedStock: 1,
      warehouse: 'Main Warehouse'
    },
    {
      id: 'PRD-003',
      name: 'Dell UltraSharp 27" 4K Monitor',
      sku: 'DEL-U2724D',
      hsn: '85285200',
      category: 'Electronics',
      unit: 'Pcs',
      purchasePrice: 420.00,
      sellingPrice: 549.00,
      taxRate: 18,
      stockMain: 18,
      stockBranchA: 8,
      stockTransit: 0,
      reorderLevel: 5,
      barcode: '890123456703',
      batchNo: 'BAT-2026-07',
      expiryDate: 'N/A',
      damagedStock: 0,
      warehouse: 'Main Warehouse'
    },
    {
      id: 'PRD-004',
      name: 'Ergonomic Executive Mesh Chair',
      sku: 'FUR-ERGO-CHAIR',
      hsn: '94013000',
      category: 'Furniture',
      unit: 'Pcs',
      purchasePrice: 180.00,
      sellingPrice: 289.00,
      taxRate: 18,
      stockMain: 12,
      stockBranchA: 4,
      stockTransit: 0,
      reorderLevel: 4,
      barcode: '890123456704',
      batchNo: 'BAT-2026-03',
      expiryDate: 'N/A',
      damagedStock: 0,
      warehouse: 'Main Warehouse'
    },
    {
      id: 'PRD-005',
      name: 'USB-C Thunderbolt 4 Docking Station',
      sku: 'ACC-TB4-DOCK',
      hsn: '84718000',
      category: 'Accessories',
      unit: 'Pcs',
      purchasePrice: 110.00,
      sellingPrice: 169.00,
      taxRate: 18,
      stockMain: 2,
      stockBranchA: 1,
      stockTransit: 5,
      reorderLevel: 8,
      barcode: '890123456705',
      batchNo: 'BAT-2026-09',
      expiryDate: 'N/A',
      damagedStock: 0,
      warehouse: 'Downtown Warehouse'
    }
  ]);

  // 4. Invoices & Sales
  const [sales, setSales] = useState([
    {
      id: 'INV-2026-001',
      type: 'GST Invoice',
      customerName: 'TechCorp Solutions Pvt Ltd',
      customerId: 'CUST-001',
      date: '2026-09-12',
      dueDate: '2026-10-12',
      items: [
        { productId: 'PRD-001', name: 'MacBook Pro M3 16"', qty: 2, price: 2499.00, taxRate: 18, amount: 4998.00 },
        { productId: 'PRD-003', name: 'Dell UltraSharp 27" 4K Monitor', qty: 2, price: 549.00, taxRate: 18, amount: 1098.00 }
      ],
      subtotal: 6096.00,
      cgst: 548.64,
      sgst: 548.64,
      igst: 0.00,
      taxTotal: 1097.28,
      discount: 100.00,
      grandTotal: 7093.28,
      paidAmount: 7093.28,
      balanceDue: 0.00,
      status: 'Paid',
      salesperson: 'Sarah Jenkins',
      branch: 'Main Branch (HQ)'
    },
    {
      id: 'INV-2026-002',
      type: 'GST Invoice',
      customerName: 'Apex Logistics & Cargo',
      customerId: 'CUST-004',
      date: '2026-09-14',
      dueDate: '2026-09-28',
      items: [
        { productId: 'PRD-004', name: 'Ergonomic Executive Mesh Chair', qty: 10, price: 289.00, taxRate: 18, amount: 2890.00 },
        { productId: 'PRD-005', name: 'USB-C Thunderbolt 4 Docking Station', qty: 5, price: 169.00, taxRate: 18, amount: 845.00 }
      ],
      subtotal: 3735.00,
      cgst: 336.15,
      sgst: 336.15,
      igst: 0.00,
      taxTotal: 672.30,
      discount: 0.00,
      grandTotal: 4407.30,
      paidAmount: 2000.00,
      balanceDue: 2407.30,
      status: 'Partial',
      salesperson: 'Alex Vance',
      branch: 'Main Branch (HQ)'
    },
    {
      id: 'INV-2026-003',
      type: 'GST Invoice',
      customerName: 'Global Retailers Inc',
      customerId: 'CUST-002',
      date: '2026-09-08',
      dueDate: '2026-09-10',
      items: [
        { productId: 'PRD-002', name: 'Logitech MX Master 3S Mouse', qty: 15, price: 99.00, taxRate: 18, amount: 1485.00 },
        { productId: 'PRD-003', name: 'Dell UltraSharp 27" 4K Monitor', qty: 4, price: 549.00, taxRate: 18, amount: 2196.00 }
      ],
      subtotal: 3681.00,
      cgst: 0.00,
      sgst: 0.00,
      igst: 662.58,
      taxTotal: 662.58,
      discount: 50.00,
      grandTotal: 4293.58,
      paidAmount: 0.00,
      balanceDue: 4293.58,
      status: 'Overdue',
      salesperson: 'Michael Chang',
      branch: 'Downtown Outlet'
    }
  ]);

  // Selected Invoice for active view
  const [selectedInvoice, setSelectedInvoice] = useState(sales[0]);

  // Keep selectedInvoice in sync when sales change
  useEffect(() => {
    if (sales.length > 0 && (!selectedInvoice || !sales.find(s => s.id === selectedInvoice.id))) {
      setSelectedInvoice(sales[0]);
    }
  }, [sales]);

  // 5. Purchases
  const [purchases, setPurchases] = useState([
    {
      id: 'PO-2026-001',
      supplierName: 'Apex Microelectronics Ltd',
      supplierId: 'SUP-001',
      date: '2026-09-05',
      items: [
        { productName: 'MacBook Pro M3 16"', qty: 5, price: 2100.00, total: 10500.00 }
      ],
      grandTotal: 12390.00,
      paidAmount: 12390.00,
      status: 'Received',
      warehouse: 'Main Warehouse'
    },
    {
      id: 'PO-2026-002',
      supplierName: 'Metro Office Furniture Co',
      supplierId: 'SUP-002',
      date: '2026-09-10',
      items: [
        { productName: 'Ergonomic Executive Mesh Chair', qty: 15, price: 180.00, total: 2700.00 }
      ],
      grandTotal: 3186.00,
      paidAmount: 0.00,
      status: 'Pending Payment',
      warehouse: 'Main Warehouse'
    }
  ]);

  // 6. Expenses
  const [expenses, setExpenses] = useState([
    { id: 'EXP-001', date: '2026-09-01', category: 'Rent', title: 'HQ Office Lease Sept 2026', amount: 3500.00, account: 'Bank Account', payee: 'Skyline Properties', ref: 'CHK-9941' },
    { id: 'EXP-002', date: '2026-09-04', category: 'Utilities', title: 'High-speed Fiber Internet & Electricity', amount: 420.00, account: 'Bank Account', payee: 'City Power & Telecom', ref: 'AUT-1029' },
    { id: 'EXP-003', date: '2026-09-08', category: 'Software', title: 'Cloud Infrastructure & AI Subscriptions', amount: 280.00, account: 'Credit Card', payee: 'AWS & OpenAI', ref: 'SUB-8812' },
    { id: 'EXP-004', date: '2026-09-11', category: 'Marketing', title: 'Google Ads & LinkedIn Lead Gen', amount: 1250.00, amountVal: 1250.00, account: 'Bank Account', payee: 'Google Ads', ref: 'ADV-4410' }
  ]);

  // 7. Payments Log
  const [payments, setPayments] = useState([
    { id: 'PAY-001', type: 'Received', customerName: 'TechCorp Solutions', amount: 7093.28, mode: 'UPI / Bank Transfer', date: '2026-09-12', ref: 'UPI-9920192', invoiceId: 'INV-2026-001' },
    { id: 'PAY-002', type: 'Received', customerName: 'Apex Logistics', amount: 2000.00, mode: 'Check', date: '2026-09-14', ref: 'CHK-44102', invoiceId: 'INV-2026-002' },
    { id: 'PAY-003', type: 'Sent', supplierName: 'Apex Microelectronics', amount: 12390.00, mode: 'Bank Wire', date: '2026-09-05', ref: 'WIR-88102', poId: 'PO-2026-001' }
  ]);

  // 8. Employees & HR
  const [employees, setEmployees] = useState([
    { id: 'EMP-001', name: 'Alex Vance', role: 'Business Administrator', department: 'Executive', email: 'alex@omnibiz.ai', phone: '+1 555-0101', salary: 7500.00, status: 'Present', performance: 'Exemplary' },
    { id: 'EMP-002', name: 'Sarah Jenkins', role: 'Senior Sales Lead', department: 'Sales', email: 'sarah@omnibiz.ai', phone: '+1 555-0102', salary: 5200.00, status: 'Present', performance: '94% Targets Achieved' },
    { id: 'EMP-003', name: 'Michael Chang', role: 'Inventory & Operations Mgr', department: 'Operations', email: 'michael@omnibiz.ai', phone: '+1 555-0103', salary: 4800.00, status: 'Present', performance: '100% Stock Accuracy' },
    { id: 'EMP-004', name: 'Priya Sharma', role: 'Lead Accountant', department: 'Finance', email: 'priya@omnibiz.ai', phone: '+1 555-0104', salary: 5500.00, status: 'On Leave', performance: 'Punctual Reconciliations' }
  ]);

  // 9. Projects
  const [projects, setProjects] = useState([
    {
      id: 'PRJ-001',
      title: 'Enterprise ERP & Cloud Migration',
      client: 'TechCorp Solutions',
      budget: 35000.00,
      spent: 18400.00,
      progress: 68,
      deadline: '2026-10-31',
      status: 'In Progress',
      assignedTo: ['Sarah Jenkins', 'Alex Vance'],
      tasks: [
        { id: 'TSK-1', title: 'Database Schema Audit', status: 'Done', priority: 'High' },
        { id: 'TSK-2', title: 'API Integration Testing', status: 'In Progress', priority: 'High' },
        { id: 'TSK-3', title: 'User Acceptance Training', status: 'To Do', priority: 'Medium' }
      ]
    },
    {
      id: 'PRJ-002',
      title: 'Q4 Retail POS Rollout',
      client: 'Sunrise Supermart',
      budget: 15000.00,
      spent: 4200.00,
      progress: 30,
      deadline: '2026-11-15',
      status: 'In Progress',
      assignedTo: ['Michael Chang'],
      tasks: [
        { id: 'TSK-4', title: 'Hardware Procurement', status: 'Done', priority: 'High' },
        { id: 'TSK-5', title: 'Barcode Scanner Config', status: 'In Progress', priority: 'Medium' }
      ]
    }
  ]);

  // 10. Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: 'Created Invoice', detail: 'Generated INV-2026-002 for Apex Logistics ($4,407.30)', user: 'Alex Vance', timestamp: '2026-09-14 14:32:10' },
    { id: 2, action: 'Payment Recorded', detail: 'Received $2,000.00 for INV-2026-002 via Check', user: 'Alex Vance', timestamp: '2026-09-14 14:35:04' },
    { id: 3, action: 'Product Added', detail: 'Added MacBook Pro M3 16" (SKU: APP-MBP-M3-16)', user: 'Michael Chang', timestamp: '2026-09-12 09:15:22' },
    { id: 4, action: 'Stock Transfer', detail: 'Transferred 2 units of Dell UltraSharp to Branch A', user: 'Michael Chang', timestamp: '2026-09-11 16:40:00' }
  ]);

  // --- DERIVED METRICS ---
  const totalSales = sales.reduce((acc, curr) => acc + curr.grandTotal, 0);
  const totalPurchases = purchases.reduce((acc, curr) => acc + curr.grandTotal, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const revenue = totalSales;
  const netProfit = revenue - (totalPurchases * 0.7) - totalExpenses; // Profit calculation
  const outstandingReceivables = sales.reduce((acc, curr) => acc + curr.balanceDue, 0);
  const outstandingPayables = suppliers.reduce((acc, curr) => acc + curr.payableBalance, 0);
  const lowStockCount = products.filter(p => p.stockMain <= p.reorderLevel).length;

  // Handlers & Mutators
  const addCustomer = (customerData) => {
    const newCust = {
      id: `CUST-00${customers.length + 1}`,
      salesCount: 0,
      totalSpent: 0,
      balance: 0,
      leadStage: 'New',
      ...customerData
    };
    setCustomers([newCust, ...customers]);
    logAudit('Add Customer', `Added new customer profile: ${newCust.name}`);
    return newCust;
  };

  const addProduct = (productData) => {
    const newProd = {
      id: `PRD-00${products.length + 1}`,
      damagedStock: 0,
      stockTransit: 0,
      ...productData
    };
    setProducts([newProd, ...products]);
    logAudit('Add Product', `Added product: ${newProd.name} (SKU: ${newProd.sku})`);
    return newProd;
  };

  const createInvoice = (invoiceData) => {
    const nextNum = sales.length + 1;
    const invNumStr = nextNum < 10 ? `00${nextNum}` : nextNum < 100 ? `0${nextNum}` : `${nextNum}`;
    const newInv = {
      id: `INV-2026-${invNumStr}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      salesperson: currentUser.name,
      branch: activeBranch,
      paidAmount: invoiceData.status === 'Paid' ? invoiceData.grandTotal : 0,
      balanceDue: invoiceData.status === 'Paid' ? 0 : invoiceData.grandTotal,
      ...invoiceData
    };
    
    setSales(prev => [newInv, ...prev]);
    setSelectedInvoice(newInv);

    // Update product stock levels
    if (newInv.items && Array.isArray(newInv.items)) {
      newInv.items.forEach(item => {
        setProducts(prev => prev.map(p => {
          if (p.id === item.productId || p.name === item.name) {
            return { ...p, stockMain: Math.max(0, p.stockMain - item.qty) };
          }
          return p;
        }));
      });
    }

    // Update customer balances
    if (newInv.balanceDue > 0) {
      setCustomers(prev => prev.map(c => {
        if (c.id === newInv.customerId || c.name === newInv.customerName) {
          return { ...c, balance: c.balance + newInv.balanceDue, salesCount: c.salesCount + 1, totalSpent: c.totalSpent + newInv.grandTotal };
        }
        return c;
      }));
    }

    setNotifications(prev => [
      { id: Date.now(), title: 'New Invoice Created', message: `Tax Invoice #${newInv.id} created for $${newInv.grandTotal.toFixed(2)}`, time: 'Just now', type: 'success' },
      ...prev
    ]);

    logAudit('Create Invoice', `Generated Tax Invoice ${newInv.id} for ${newInv.customerName} - $${newInv.grandTotal.toFixed(2)}`);
    return newInv;
  };

  const receivePayment = (paymentData) => {
    const newPay = {
      id: `PAY-00${payments.length + 1}`,
      type: 'Received',
      date: new Date().toISOString().split('T')[0],
      ...paymentData
    };
    setPayments([newPay, ...payments]);

    // Reduce customer balance & invoice balance
    setSales(prev => prev.map(inv => {
      if (inv.id === paymentData.invoiceId || inv.customerName === paymentData.customerName) {
        const newPaid = inv.paidAmount + paymentData.amount;
        const newDue = Math.max(0, inv.grandTotal - newPaid);
        return {
          ...inv,
          paidAmount: newPaid,
          balanceDue: newDue,
          status: newDue === 0 ? 'Paid' : 'Partial'
        };
      }
      return inv;
    }));

    setCustomers(prev => prev.map(c => {
      if (c.name === paymentData.customerName) {
        return { ...c, balance: Math.max(0, c.balance - paymentData.amount) };
      }
      return c;
    }));

    logAudit('Receive Payment', `Recorded payment of $${paymentData.amount} from ${paymentData.customerName}`);
  };

  const logAudit = (action, detail) => {
    const entry = {
      id: auditLogs.length + 1,
      action,
      detail,
      user: currentUser.name,
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  const triggerOfflineSync = () => {
    setOfflineMode(false);
    setPendingSyncCount(0);
    setNotifications(prev => [
      { id: Date.now(), title: 'Cloud Sync Completed', message: 'All offline sales, stock edits, and invoices synced successfully.', time: 'Just now', type: 'success' },
      ...prev
    ]);
  };

  return (
    <AppContext.Provider value={{
      viewMode, setViewMode,
      mobileOS, setMobileOS,
      activeModule, setActiveModule,
      activeBranch, setActiveBranch,
      theme, setTheme,
      offlineMode, setOfflineMode,
      pendingSyncCount, setPendingSyncCount,
      currentUser, setCurrentUser,
      activeModal, setActiveModal,
      quickSearchQuery, setQuickSearchQuery,
      notifications, setNotifications,
      customers, setCustomers, addCustomer,
      suppliers, setSuppliers,
      products, setProducts, addProduct,
      sales, setSales, createInvoice, selectedInvoice, setSelectedInvoice,
      purchases, setPurchases,
      expenses, setExpenses,
      payments, setPayments, receivePayment,
      employees, setEmployees,
      projects, setProjects,
      auditLogs, logAudit,
      triggerOfflineSync,
      metrics: {
        totalSales,
        totalPurchases,
        totalExpenses,
        revenue,
        netProfit,
        outstandingReceivables,
        outstandingPayables,
        lowStockCount
      }
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
