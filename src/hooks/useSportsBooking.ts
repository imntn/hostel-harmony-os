import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SportsEquipment {
  id: string;
  hostel_id: string;
  sport: string;
  item_name: string;
  description: string | null;
  total_quantity: number;
  available_quantity: number;
  max_booking_hours: number;
  status: string;
}

export interface SportsBooking {
  id: string;
  user_id: string;
  equipment_id: string;
  hostel_id: string;
  start_time: string;
  end_time: string;
  actual_return_time: string | null;
  status: 'reserved' | 'in_use' | 'returned' | 'overdue' | 'cancelled';
  penalty_amount: number;
  penalty_reason: string | null;
  notes: string | null;
  created_at: string;
  sports_equipment?: SportsEquipment;
}

export function useSportsEquipment(hostelId: string | null) {
  return useQuery({
    queryKey: ['sports-equipment', hostelId],
    queryFn: async () => {
      if (!hostelId) return [];
      
      const { data, error } = await supabase
        .from('sports_equipment')
        .select('*')
        .eq('hostel_id', hostelId)
        .order('sport', { ascending: true });

      if (error) throw error;
      return data as SportsEquipment[];
    },
    enabled: !!hostelId,
  });
}

export function useSportsBookings(userId: string | null) {
  return useQuery({
    queryKey: ['sports-bookings', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('sports_bookings')
        .select('*, sports_equipment(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SportsBooking[];
    },
    enabled: !!userId,
  });
}

export function useCreateSportsBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (booking: {
      user_id: string;
      equipment_id: string;
      hostel_id: string;
      start_time: string;
      end_time: string;
    }) => {
      // Check for overlapping bookings
      const { data: overlap } = await supabase.rpc('check_sports_booking_overlap', {
        _equipment_id: booking.equipment_id,
        _start_time: booking.start_time,
        _end_time: booking.end_time,
      });

      if (overlap) {
        throw new Error('This time slot is already booked. Please select a different time.');
      }

      const { data, error } = await supabase
        .from('sports_bookings')
        .insert(booking)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sports-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['sports-equipment'] });
      toast({
        title: 'Booking Confirmed',
        description: 'Your sports equipment booking has been confirmed.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Booking Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateSportsBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SportsBooking> & { id: string }) => {
      const { data, error } = await supabase
        .from('sports_bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sports-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['sports-equipment'] });
      toast({
        title: 'Booking Updated',
        description: 'Your booking has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
