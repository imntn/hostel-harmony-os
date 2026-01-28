import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EmergencyAlert {
  id: string;
  user_id: string;
  hostel_id: string;
  room_number: string;
  hostel_id_number: string | null;
  message: string;
  is_acknowledged: boolean;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  created_at: string;
}

export function useTriggerEmergency() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (alert: {
      user_id: string;
      hostel_id: string;
      room_number: string;
      hostel_id_number?: string;
      message?: string;
    }) => {
      const { data, error } = await supabase
        .from('emergency_alerts')
        .insert({
          ...alert,
          message: alert.message || 'Emergency Alert',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-alerts'] });
      toast({
        title: '🚨 Emergency Alert Sent',
        description: 'Help is on the way. Stay calm and wait for assistance.',
        variant: 'destructive',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Alert Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
