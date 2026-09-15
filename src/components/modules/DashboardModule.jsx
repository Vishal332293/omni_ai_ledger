import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import {
  DollarSign, ShoppingCart, TrendingUp, TrendingDown, Package,
  AlertTriangle, Users, Calendar, ArrowUpRight, ArrowDownRight, Sparkles, CheckCircle2
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, ArcElement
);

export const DashboardModule = () => {
  const { metrics, sales, products, expenses, setActiveModule, setActiveModal } = useApp();
  const [timeRange, setTimeRange] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'

  // Chart 1: Revenue vs Expenses
  const revenueChartData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep (MTD)', 'Oct (Proj)'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [18400, 22100, 26800, 31200, metrics.revenue, 38000],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses ($)',
        data: [8200, 9400, 11200, 10500, metrics.totalExpenses + (metrics.totalPurchases * 0.7), 12500],
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Chart 2: Category Sales
  const categoryChartData = {
    labels: ['Electronics', 'Accessories', 'Furniture', 'Software', 'Services'],
    datasets: [{
      label: 'Sales Amount ($)',
      data: [12800, 4200, 7900, 3100, 5400],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      borderRadius: 8
    }]
  };

  // Chart 3: Payment Status
  const paymentStatusData = {
    labels: ['Paid', 'Partial Payment', 'Overdue / Unpaid'],
    datasets: [{
      data: [
        sales.filter(s => s.status === 'Paid').reduce((a, b) => a + b.grandTotal, 0),
        sales.filter(s => s.status === 'Partial').reduce((a, b) => a + b.grandTotal, 0),
        metrics.outstandingReceivables
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }]
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-brand-400 font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Business Analytics & Operations Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-white">
            Welcome back, Alex! 👋
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Here is your live business performance summary. Net profit is up <strong className="text-emerald-400">+18.4%</strong> this month.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            {['daily', 'weekly', 'monthly'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  timeRange === range ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveModal('new_invoice')}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            + New Invoice
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${metrics.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="+14.2%"
          isPositive={true}
          icon={DollarSign}
          color="blue"
          subtitle="From 32 invoices this month"
        />
        <StatCard
          title="Net Profit"
          value={`$${metrics.netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="+18.4%"
          isPositive={true}
          icon={TrendingUp}
          color="green"
          subtitle="Revenue minus COGS & Expenses"
        />
        <StatCard
          title="Outstanding Receivables"
          value={`$${metrics.outstandingReceivables.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          change="-4.1%"
          isPositive={true}
          icon={ArrowDownRight}
          color="amber"
          subtitle="Pending customer collections"
        />
        <StatCard
          title="Low Stock Alerts"
          value={`${metrics.lowStockCount} Items`}
          change="Action Required"
          isPositive={false}
          icon={AlertTriangle}
          color="red"
          subtitle="Below reorder thresholds"
        />
      </div>

      {/* Charts Row 1: Line Chart & Doughnut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue vs Expenses Performance</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly financial comparison & 60-day trend</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200">
              Positive Margin
            </span>
          </div>
          <div className="h-[280px]">
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } }
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Payment Collection Breakdown</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Paid vs Outstanding receivables</p>
          </div>
          <div className="h-[200px] my-4 flex items-center justify-center">
            <Doughnut
              data={paymentStatusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }}
            />
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-500">Total Outstanding:</span>
            <strong className="text-rose-600 dark:text-rose-400 font-bold">${metrics.outstandingReceivables.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Row 2: Category Bar Chart & Low Stock Alert List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Sales by Product Category</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Revenue breakdown across major categories</p>
          <div className="h-[220px]">
            <Bar
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }}
            />
          </div>
        </div>

        {/* Low Stock Warning Box */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Critical Low Stock & Reorder Alerts</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Products requiring immediate supplier replenishment</p>
              </div>
            </div>
            <button
              onClick={() => setActiveModule('inventory')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Manage Inventory →
            </button>
          </div>

          <div className="space-y-3">
            {products.filter(p => p.stockMain <= p.reorderLevel).map(item => (
              <div key={item.id} className="p-3 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs">
                    {item.stockMain}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.name}</h4>
                    <span className="text-[11px] text-slate-500">SKU: {item.sku} | Reorder Threshold: {item.reorderLevel} units</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded">
                    Only {item.stockMain} Left
                  </span>
                  <button
                    onClick={() => setActiveModule('purchases')}
                    className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                  >
                    Raise Purchase Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
