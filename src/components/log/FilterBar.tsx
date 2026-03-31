import React, { useState } from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import type { ActivityLogFilters } from '../../types/activityLog';

interface FilterBarProps {
  filters: ActivityLogFilters;
  onFilterChange: (f: Partial<ActivityLogFilters>) => void;
  onRefresh: () => void;
  totalItems: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onRefresh,
  totalItems,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="rounded-2xl border border-white/5 bg-[#0f1117] p-4 flex flex-col gap-3">
      {/* top row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* search action */}
        <div className="flex-1 min-w-[180px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="ค้นหา action..."
            value={filters.action ?? ''}
            onChange={(e) => onFilterChange({ action: e.target.value || undefined })}
            className="w-full bg-[#1a1d27] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition"
          />
        </div>

        {/* search userId */}
        <div className="flex-1 min-w-[180px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="User ID..."
            value={filters.userId ?? ''}
            onChange={(e) => onFilterChange({ userId: e.target.value || undefined })}
            className="w-full bg-[#1a1d27] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition"
          />
        </div>

        {/* limit select */}
        <select
          value={filters.limit}
          onChange={(e) => onFilterChange({ limit: Number(e.target.value) })}
          className="bg-[#1a1d27] border border-white/5 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
        >
          {[10, 15, 25, 50].map((n) => (
            <option key={n} value={n}>
              {n} / หน้า
            </option>
          ))}
        </select>

        {/* advanced filter toggle */}
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
            showAdvanced
              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
              : 'bg-[#1a1d27] border-white/5 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          วันที่
        </button>

        {/* refresh */}
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-[#1a1d27] text-slate-400 hover:text-slate-200 text-sm font-medium transition hover:border-white/10 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          รีเฟรช
        </button>
      </div>

      {/* advanced date range */}
      {showAdvanced && (
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-white/5">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">จาก</label>
            <input
              type="datetime-local"
              value={filters.startDate ?? ''}
              onChange={(e) => onFilterChange({ startDate: e.target.value || undefined })}
              className="bg-[#1a1d27] border border-white/5 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">ถึง</label>
            <input
              type="datetime-local"
              value={filters.endDate ?? ''}
              onChange={(e) => onFilterChange({ endDate: e.target.value || undefined })}
              className="bg-[#1a1d27] border border-white/5 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <button
            onClick={() => onFilterChange({ startDate: undefined, endDate: undefined })}
            className="text-xs text-rose-400 hover:text-rose-300 transition"
          >
            ล้างวันที่
          </button>
        </div>
      )}

      {/* info row */}
      <p className="text-xs text-slate-600 font-mono">
        พบ <span className="text-indigo-400 font-bold">{totalItems.toLocaleString()}</span> รายการ
      </p>
    </div>
  );
};
