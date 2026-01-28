import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface RoomChangeRequest {
  id: string;
  user_id: string;
  hostel_id: string;
  current_room: string;
  requested_room: string;
  reason: string;
  status: RequestStatus;
  approved_by: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useRoomChangeRequests(userId: string | null) {
  return useQuery({
    queryKey: ['room-change-requests', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('room_change_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as RoomChangeRequest[];
    },
    enabled: !!userId,
  });
}

export function useCreateRoomChangeRequest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (request: {
      user_id: string;
      hostel_id: string;
      current_room: string;
      requested_room: string;
      reason: string;
    }) => {
      const { data, error } = await supabase
        .from('room_change_requests')
        .insert(request)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room-change-requests'] });
      toast({
        title: 'Request Submitted',
        description: 'Your room change request has been submitted for approval.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Request Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
