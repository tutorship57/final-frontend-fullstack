import React from 'react';
import { getMethodColor } from '../../utils/helpers';

interface MethodBadgeProps {
  method: string;
}

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-md border text-[10px] font-mono font-bold tracking-wider ${getMethodColor(method)}`}
  >
    {method}
  </span>
);
