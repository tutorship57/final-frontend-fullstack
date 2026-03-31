import React, { useMemo } from 'react';
import type { ActivityLog } from '../../types/activityLog';

interface StatusDistributionProps {
  logs: ActivityLog[];
}

const GROUPS = [
  { label: '2xx', min: 200, max: 299, color: 'bg-emerald-400', text: 'text-emerald-400' },
  { label: '3xx', min: 300, max: 399, color: 'bg-sky-400', text: 'text-sky-400' },
  { label: '4xx', min: 400, max: 499, color: 'bg-amber-400', text: 'text-amber-400' },
  { label: '5xx', min: 500, max: 599, color: 'bg-rose-400', text: 'text-rose-400' },
];

export const StatusDistribution: React.FC<StatusDistributionProps> = ({ logs }) => {
  const counts = useMemo(() => {
    return GROUPS.map((g) => ({
      ...g,
      count: logs.filter((l) => l.status_code >= g.min && l.status_code <= g.max).length,
    }));
  }, [logs]);

  // const total = logs.length || 1;
  const maxCount = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="rounded-2xl border border-white/5 bg-[#0f1117] p-5">
      <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Status Overview</p>
      <div className="flex items-end gap-3 h-20">
        {counts.map((g) => {
          const pct = g.count / maxCount;
          return (
            <div key={g.label} className="flex-1 flex flex-col items-center gap-1">
              <span className={`text-[10px] font-mono font-bold ${g.text}`}>{g.count}</span>
              <div className="w-full bg-white/5 rounded-t-sm flex items-end" style={{ height: '60px' }}>
                <div
                  className={`w-full rounded-t-sm ${g.color} transition-all duration-700`}
                  style={{ height: `${pct * 60}px` }}
                />
              </div>
              <span className="text-[9px] font-mono text-slate-600">{g.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
