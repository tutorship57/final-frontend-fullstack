import React, { useState } from 'react';
import { Trash2, ChevronRight, Loader2 } from 'lucide-react';
import type { ActivityLog } from '../../types/activityLog';
import { MethodBadge } from './MethodBadge';
import { StatusBadge } from './StatusBadge';
import { LogDetailModal } from './LogDetailModal';
import { timeAgo, shortId } from '../../utils/helpers';

interface LogTableProps {
  logs: ActivityLog[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export const LogTable: React.FC<LogTableProps> = ({ logs, loading, onDelete }) => {
  const [selected, setSelected] = useState<ActivityLog | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 rounded-2xl border border-white/5 bg-[#0f1117]">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-white/5 bg-[#0f1117] gap-3">
        <span className="text-4xl">📭</span>
        <p className="text-slate-500 text-sm">ไม่พบ log</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-white/5 bg-[#0f1117] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                {['Method', 'Route', 'Action', 'Status', 'IP', 'User', 'เวลา', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-slate-500 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr
                  key={log.id}
                  className={`border-b border-white/3 hover:bg-white/2 transition cursor-pointer group ${
                    i % 2 === 0 ? '' : 'bg-white/1'
                  }`}
                  onClick={() => setSelected(log)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <MethodBadge method={log.method} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-300 max-w-45 truncate">
                    {log.route}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-indigo-300 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge code={log.status_code} />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono whitespace-nowrap">
                    {log.ip_address ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                    {log.user_id ? shortId(log.user_id): null}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                    {timeAgo(log.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`ลบ log ${shortId(log.id)} ?`)) onDelete(log.id);
                        }}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-400/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <LogDetailModal
          log={selected}
          onClose={() => setSelected(null)}
          onDelete={onDelete}
        />
      )}
    </>
  );
};
