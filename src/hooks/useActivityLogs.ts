import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ActivityLogFilters } from '../types/activityLog';
import { fetchActivityLogs, deleteActivityLog } from '../api/log/activityLog.api';

const DEFAULT_FILTERS: ActivityLogFilters = {
  page: 1,
  limit: 15,
};

export function useActivityLogs() {
  const queryClient = useQueryClient();
  const [filters, setFiltersState] = useState<ActivityLogFilters>(DEFAULT_FILTERS);

  // 1. ใช้ useQuery สำหรับดึงข้อมูล
  // ตัว Query Key จะเปลี่ยนตาม filters อัตโนมัติ (ทำให้มันยิง API ใหม่ให้เอง)
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['activity-logs', filters],
    queryFn: () => fetchActivityLogs(filters),
    // ปรับตั้งค่าได้ตามใจชอบ เช่น ไม่ต้อง refetch ตอนสลับหน้าจอ
    refetchOnWindowFocus: false, 
  });

  // 2. ใช้ useMutation สำหรับการลบ (Action ที่มีการเปลี่ยนแปลงข้อมูล)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteActivityLog(id),
    onSuccess: () => {
      // เมื่อลบสำเร็จ ให้สั่ง 'activity-logs' เป็น invalid 
      // เพื่อให้ useQuery ข้างบนไปดึงข้อมูลใหม่มาโชว์ (ลบแล้วหายไปจากตารางทันที)
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });

  const setFilters = useCallback((partial: Partial<ActivityLogFilters>) => {
    setFiltersState((prev) => ({ 
      ...prev, 
      ...partial, 
      page: partial.page ?? 1 // ถ้าเปลี่ยน filter อื่น ให้กลับไปหน้า 1 เสมอ
    }));
  }, []);

  return {
    logs: data?.data ?? [],
    meta: data?.meta ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : isError ? 'เกิดข้อผิดพลาด' : null,
    filters,
    setFilters,
    refresh: refetch,
    handleDelete: deleteMutation.mutateAsync, // ส่ง function ลบออกไป
    isDeleting: deleteMutation.isPending,     // เผื่อเอาไปทำ Loading ตอนกดลบ
  };
}