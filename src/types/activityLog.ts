export interface ActivityLog {
  id: string;
  user_id: string;
  workspace_id?: string;
  action: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  route: string;
  status_code: number;
  target_type?: string;
  target_id?: string;
  ip_address?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ActivityLogResponse {
  message: string;
  data: ActivityLog[];
  meta: PaginationMeta;
}

export interface ActivityLogFilters {
  userId?: string;
  action?: string;
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
