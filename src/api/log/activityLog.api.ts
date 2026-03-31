import { api } from '../base.api'; // สมมติว่าไฟล์ที่ config axios ชื่อ axiosConfig.ts
import type { ActivityLogFilters, ActivityLogResponse } from '../../types/activityLog';

/**
 * ดึงข้อมูล Activity Logs พร้อม Filter และ Pagination
 */
export async function fetchActivityLogs(
  filters: ActivityLogFilters,
): Promise<ActivityLogResponse> {
  const response = await api.get<ActivityLogResponse>('/activity-log', {
    params: {
      userId: filters.userId,
      action: filters.action,
      startDate: filters.startDate,
      endDate: filters.endDate,
      page: filters.page,
      limit: filters.limit,
    },
  });

  return response.data;
}


export async function deleteActivityLog(id: string): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(`/activity-log/${id}`);
  return response.data;
}