import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string; // tailwind color class e.g. 'emerald'
  sub?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, accent, sub }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-[#0f1117] p-5 flex flex-col gap-3`}
    >
      {/* glow blob */}
      <div
        className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 bg-${accent}-500`}
      />
      <div className="flex items-center justify-between relative z-10">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500">{label}</span>
        <div className={`p-2 rounded-xl bg-${accent}-500/10 text-${accent}-400`}>{icon}</div>
      </div>
      <div className="relative z-10">
        <span className="text-3xl font-black text-white tabular-nums">{value}</span>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
};
