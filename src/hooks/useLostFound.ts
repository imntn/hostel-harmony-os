import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type LostFoundType = 'lost' | 'found' | 'claimed' | 'returned';
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface LostFoundItem {
  id: string;
  hostel_id: string;
  reported_by: string;
  item_type: LostFoundType;
  item_name: string;
  description: string | null;
  photo_url: string | null;
  location_found: string | null;
  claimed_by: string | null;
  status: RequestStatus;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useLostFoundItems(hostelId: string | null) {
  return useQuery({
    queryKey: ['lost-found', hostelId],
    queryFn: async () => {
      if (!hostelId) return [];
      
      const { data, error } = await supabase
        .from('lost_found_items')
        .select('*')
        .eq('hostel_id', hostelId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LostFoundItem[];
    },
    enabled: !!hostelId,
  });
}

export function useMyLostItems(userId: string | null) {
  return useQuery({
    queryKey: ['my-lost-items', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('lost_found_items')
        .select('*')
        .eq('reported_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LostFoundItem[];
    },
    enabled: !!userId,
  });
}

export function useReportLostItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (item: {
      hostel_id: string;
      reported_by: string;
      item_type: LostFoundType;
      item_name: string;
      description?: string;
      photo_url?: string;
      location_found?: string;
    }) => {
      const { data, error } = await supabase
        .from('lost_found_items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lost-found'] });
      queryClient.invalidateQueries({ queryKey: ['my-lost-items'] });
      toast({
        title: 'Item Reported',
        description: 'Your lost/found item has been reported successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Report Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useClaimItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ itemId, userId }: { itemId: string; userId: string }) => {
      const { data, error } = await supabase
        .from('lost_found_items')
        .update({ claimed_by: userId, status: 'pending' })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lost-found'] });
      toast({
        title: 'Claim Submitted',
        description: 'Your claim has been submitted for verification.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Claim Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export async function uploadLostFoundPhoto(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('hostel-uploads')
    .upload(`lost-found/${fileName}`, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('hostel-uploads')
    .getPublicUrl(`lost-found/${fileName}`);

  return data.publicUrl;
}
