import React from 'react';
import { X, Trash2 } from 'lucide-react';
import type { ActivityLog } from '../../types/activityLog';
import { MethodBadge } from './MethodBadge';
import { StatusBadge } from './StatusBadge';
import { formatDate, shortId } from '../../utils/helpers';

interface LogDetailModalProps {
  log: ActivityLog;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{label}</span>
    <span className="text-sm text-slate-200 break-all">{value ?? <span className="text-slate-600 italic">—</span>}</span>
  </div>
);

export const LogDetailModal: React.FC<LogDetailModalProps> = ({ log, onClose, onDelete }) => {
  const handleDelete = () => {
    if (confirm(`ลบ log ${shortId(log.id)} ?`)) {
      onDelete(log.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0f1117] shadow-2xl">
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0f1117]/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <MethodBadge method={log.method} />
            <StatusBadge code={log.status_code} />
            <span className="text-sm text-slate-400 font-mono">{shortId(log.id)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-400/10 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-white/5 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* body */}
        <div className="p-6 grid grid-cols-2 gap-5">
          <Row label="ID" value={log.id} />
          <Row label="เวลา" value={formatDate(log.created_at)} />
          <Row label="User ID" value={log.user_id} />
          <Row label="Workspace ID" value={log.workspace_id} />
          <Row label="Action" value={<span className="font-mono text-indigo-300">{log.action}</span>} />
          <Row label="Route" value={<span className="font-mono text-slate-300">{log.route}</span>} />
          <Row label="Method" value={<MethodBadge method={log.method} />} />
          <Row label="Status Code" value={<StatusBadge code={log.status_code} />} />
          <Row label="IP Address" value={log.ip_address} />
          <Row label="Target Type" value={log.target_type} />
          <Row label="Target ID" value={log.target_id} />
        </div>

        {/* metadata */}
        {log.metadata && Object.keys(log.metadata).length > 0 && (
          <div className="px-6 pb-6">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">Metadata</p>
            <pre className="bg-[#1a1d27] rounded-xl p-4 text-xs text-emerald-300 font-mono overflow-x-auto border border-white/5">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
