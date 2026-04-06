import React from 'react';
import { getStatusColor } from '../../utils/helpers';

interface StatusBadgeProps {
  code: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ code }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-[10px] font-mono font-bold ${getStatusColor(code)}`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {code}
  </span>
);
