import React, { useMemo } from 'react';
import { Activity, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { useActivityLogs } from '../../hooks/useActivityLogs';
import { StatsCard } from '../../components/log/StatsCard';
import { FilterBar } from '../../components/log/FilterBar';
import { LogTable } from '../../components/log/LogTable';
import { Pagination } from '../../components/log/Pagination';
import { MethodDistribution } from '../../components/log/MethodDistribution';
import { StatusDistribution } from '../../components/log/StatusDistribution';

export const DashboardPage: React.FC = () => {
  const { logs, meta, loading, error, filters, setFilters, refresh, handleDelete } =
    useActivityLogs();
  console.log("this is logs",logs)

  const stats = useMemo(() => {
    const success = logs.filter((l) => l.status_code >= 200 && l.status_code < 300).length;
    const errors = logs.filter((l) => l.status_code >= 400).length;
    const uniqueUsers = new Set(logs.map((l) => l.user_id)).size;
    return { success, errors, uniqueUsers };
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#080a0f] text-white">
      {/* noise overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* top accent line */}
      <div className="h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">Activity Log</h1>
              <p className="text-xs text-slate-500 font-mono">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-500 font-mono">Live</span>
          </div>
        </div>

        {/* error alert */}
        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <p className="text-sm text-rose-300">{error}</p>
          </div>
        )}

        {/* stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Logs"
            value={(meta?.totalItems ?? 0).toLocaleString()}
            icon={<Activity className="w-4 h-4" />}
            accent="indigo"
            sub="ทั้งหมดในระบบ"
          />
          <StatsCard
            label="Success"
            value={stats.success}
            icon={<CheckCircle className="w-4 h-4" />}
            accent="emerald"
            sub="2xx responses"
          />
          <StatsCard
            label="Errors"
            value={stats.errors}
            icon={<AlertTriangle className="w-4 h-4" />}
            accent="rose"
            sub="4xx / 5xx"
          />
          <StatsCard
            label="Unique Users"
            value={stats.uniqueUsers}
            icon={<Zap className="w-4 h-4" />}
            accent="amber"
            sub="ใน page นี้"
          />
        </div>

        {/* mini charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MethodDistribution logs={logs} />
          <StatusDistribution logs={logs} />
        </div>

        {/* filters */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onRefresh={refresh}
          totalItems={meta?.totalItems ?? 0}
        />

        {/* table */}
        <LogTable logs={logs} loading={loading} onDelete={handleDelete} />

        {/* pagination */}
        {meta && meta.totalPages > 1 && (
          <Pagination
            meta={meta}
            onPageChange={(page) => setFilters({ page })}
          />
        )}
      </div>
    </div>
  );
};