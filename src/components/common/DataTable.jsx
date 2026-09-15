import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, ArrowUpDown, Download } from 'lucide-react';

export const DataTable = ({
  columns,
  data,
  searchPlaceholder = "Search records...",
  onRowClick,
  actionButton
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const itemsPerPage = 8;

  // Filter
  const filteredData = data.filter(item => {
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    let valA = a[sortColumn];
    let valB = b[sortColumn];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    }
    return sortDirection === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key) => {
    if (sortColumn === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2">
          {actionButton}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-100/70 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-4 py-3 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors ${col.className || ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.sortable !== false && <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 dark:divide-slate-700/60">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-brand-50/40 dark:hover:bg-slate-700/40 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3.5 whitespace-nowrap ${col.className || ''}`}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">
                  No records matching search parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 border-t border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/50">
        <span>
          Showing <strong className="text-slate-700 dark:text-slate-200">{sortedData.length ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to <strong className="text-slate-700 dark:text-slate-200">{Math.min(currentPage * itemsPerPage, sortedData.length)}</strong> of <strong className="text-slate-700 dark:text-slate-200">{sortedData.length}</strong> results
        </span>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-semibold text-slate-700 dark:text-slate-200">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
