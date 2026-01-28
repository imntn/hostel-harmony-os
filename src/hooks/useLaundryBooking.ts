import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LaundryMachine {
  id: string;
  hostel_id: string;
  machine_number: number;
  machine_name: string | null;
  status: string;
}

export interface LaundryBooking {
  id: string;
  user_id: string;
  machine_id: string;
  hostel_id: string;
  start_time: string;
  end_time: string;
  status: 'reserved' | 'in_use' | 'returned' | 'overdue' | 'cancelled';
  created_at: string;
  laundry_machines?: LaundryMachine;
}

export function useLaundryMachines(hostelId: string | null) {
  return useQuery({
    queryKey: ['laundry-machines', hostelId],
    queryFn: async () => {
      if (!hostelId) return [];
      
      const { data, error } = await supabase
        .from('laundry_machines')
        .select('*')
        .eq('hostel_id', hostelId)
        .order('machine_number', { ascending: true });

      if (error) throw error;
      return data as LaundryMachine[];
    },
    enabled: !!hostelId,
  });
}

export function useLaundryBookings(userId: string | null) {
  return useQuery({
    queryKey: ['laundry-bookings', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('laundry_bookings')
        .select('*, laundry_machines(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LaundryBooking[];
    },
    enabled: !!userId,
  });
}

export function useCreateLaundryBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (booking: {
      user_id: string;
      machine_id: string;
      hostel_id: string;
      start_time: string;
      end_time: string;
    }) => {
      // Check for overlapping bookings
      const { data: overlap } = await supabase.rpc('check_laundry_booking_overlap', {
        _machine_id: booking.machine_id,
        _start_time: booking.start_time,
        _end_time: booking.end_time,
      });

      if (overlap) {
        throw new Error('This time slot is already booked. Please select a different time.');
      }

      const { data, error } = await supabase
        .from('laundry_bookings')
        .insert(booking)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laundry-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['laundry-machines'] });
      toast({
        title: 'Booking Confirmed',
        description: 'Your laundry slot has been booked successfully.',
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
