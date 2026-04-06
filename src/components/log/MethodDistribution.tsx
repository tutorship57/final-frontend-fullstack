import React, { useMemo } from 'react';
import type { ActivityLog } from '../../types/activityLog';
// import { getMethodColor } from '../../utils/helpers';

interface MethodDistributionProps {
  logs: ActivityLog[];
}

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export const MethodDistribution: React.FC<MethodDistributionProps> = ({ logs }) => {
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const log of logs) map[log.method] = (map[log.method] ?? 0) + 1;
    return map;
  }, [logs]);

  const total = logs.length || 1;

  return (
    <div className="rounded-2xl border border-white/5 bg-[#0f1117] p-5">
      <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">Method Distribution</p>
      <div className="flex flex-col gap-3">
        {METHODS.map((method) => {
          const count = counts[method] ?? 0;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={method} className="flex items-center gap-3">
              <span className="w-14 text-[10px] font-mono font-bold text-slate-400">{method}</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    {
                      GET: 'bg-emerald-400',
                      POST: 'bg-sky-400',
                      PUT: 'bg-amber-400',
                      PATCH: 'bg-violet-400',
                      DELETE: 'bg-rose-400',
                    }[method]
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs font-mono text-slate-500">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
