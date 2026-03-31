import type { HttpMethod } from '../types/activityLog';

export function getMethodColor(method: HttpMethod | string): string {
  const map: Record<string, string> = {
    GET: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    POST: 'text-sky-400 bg-sky-400/10 border-sky-400/30',
    PUT: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    PATCH: 'text-violet-400 bg-violet-400/10 border-violet-400/30',
    DELETE: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
  };
  return map[method] ?? 'text-slate-400 bg-slate-400/10 border-slate-400/30';
}

export function getStatusColor(code: number): string {
  if (code >= 500) return 'text-rose-400 bg-rose-400/10 border-rose-400/30';
  if (code >= 400) return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
  if (code >= 300) return 'text-sky-400 bg-sky-400/10 border-sky-400/30';
  if (code >= 200) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
  return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
}

export function getStatusLabel(code: number): string {
  if (code >= 500) return 'Error';
  if (code >= 400) return 'Client Err';
  if (code >= 300) return 'Redirect';
  if (code >= 200) return 'Success';
  return 'Info';
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(dateStr));
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'เมื่อกี้';
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`;
  return `${Math.floor(hrs / 24)} วันที่แล้ว`;
}

export function shortId(id: string): string {
  return id.slice(0, 8) + '…';
}
