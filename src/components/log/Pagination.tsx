import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '../../types/activityLog';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { currentPage, totalPages } = meta;

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (currentPage <= 4) return i + 1;
    if (currentPage >= totalPages - 3) return totalPages - 6 + i;
    return currentPage - 3 + i;
  });

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-slate-600 font-mono">
        หน้า <span className="text-slate-400">{currentPage}</span> จาก{' '}
        <span className="text-slate-400">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[36px] h-9 px-2 rounded-xl border text-xs font-mono font-bold transition ${
              p === currentPage
                ? 'bg-indigo-500 border-indigo-500 text-white'
                : 'border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
