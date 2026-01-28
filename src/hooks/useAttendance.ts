import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type AttendanceStatus = 'present' | 'absent' | 'on_leave' | 'late_entry';

export interface AttendanceRecord {
  id: string;
  user_id: string;
  hostel_id: string;
  date: string;
  check_in_time: string | null;
  status: AttendanceStatus;
  marked_by: 'self' | 'warden';
  warden_id: string | null;
  notes: string | null;
  created_at: string;
}

export function useAttendance(userId: string | null) {
  return useQuery({
    queryKey: ['attendance', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('night_attendance')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as AttendanceRecord[];
    },
    enabled: !!userId,
  });
}

export function useTodayAttendance(userId: string | null) {
  const today = new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['attendance-today', userId, today],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('night_attendance')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      return data as AttendanceRecord | null;
    },
    enabled: !!userId,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (attendance: {
      user_id: string;
      hostel_id: string;
      date: string;
      check_in_time: string;
      status: AttendanceStatus;
    }) => {
      const { data, error } = await supabase
        .from('night_attendance')
        .upsert(attendance, { onConflict: 'user_id,date' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-today'] });
      toast({
        title: 'Attendance Marked',
        description: 'Your night attendance has been recorded successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Mark Attendance',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function calculateAttendanceStats(records: AttendanceRecord[]) {
  const total = records.length;
  const present = records.filter(r => r.status === 'present' || r.status === 'late_entry').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const onLeave = records.filter(r => r.status === 'on_leave').length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return { total, present, absent, onLeave, percentage };
}
