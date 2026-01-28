import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type GatePassStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface GatePass {
  id: string;
  user_id: string;
  hostel_id: string;
  purpose: string;
  out_date: string;
  out_time: string;
  expected_return_date: string;
  expected_return_time: string;
  actual_return_time: string | null;
  status: GatePassStatus;
  approved_by: string | null;
  warden_remarks: string | null;
  is_late_return: boolean;
  created_at: string;
  updated_at: string;
}

export function useGatePasses(userId: string | null) {
  return useQuery({
    queryKey: ['gate-passes', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('gate_passes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GatePass[];
    },
    enabled: !!userId,
  });
}

export function useCreateGatePass() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (gatePass: {
      user_id: string;
      hostel_id: string;
      purpose: string;
      out_date: string;
      out_time: string;
      expected_return_date: string;
      expected_return_time: string;
    }) => {
      const { data, error } = await supabase
        .from('gate_passes')
        .insert(gatePass)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gate-passes'] });
      toast({
        title: 'Gate Pass Requested',
        description: 'Your gate pass request has been submitted for approval.',
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
