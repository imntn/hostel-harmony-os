import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ComplaintCategory = 'washroom' | 'room' | 'water' | 'electricity' | 'mess' | 'other';
export type ComplaintStatus = 'submitted' | 'in_progress' | 'resolved';

export interface Complaint {
  id: string;
  user_id: string;
  hostel_id: string;
  room_number: string;
  category: ComplaintCategory;
  description: string;
  photo_url: string | null;
  status: ComplaintStatus;
  assigned_to: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useComplaints(userId: string | null) {
  return useQuery({
    queryKey: ['complaints', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Complaint[];
    },
    enabled: !!userId,
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (complaint: {
      user_id: string;
      hostel_id: string;
      room_number: string;
      category: ComplaintCategory;
      description: string;
      photo_url?: string;
    }) => {
      const { data, error } = await supabase
        .from('complaints')
        .insert(complaint)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast({
        title: 'Complaint Submitted',
        description: 'Your complaint has been submitted and will be addressed soon.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Submission Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export async function uploadComplaintPhoto(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('hostel-uploads')
    .upload(`complaints/${fileName}`, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('hostel-uploads')
    .getPublicUrl(`complaints/${fileName}`);

  return data.publicUrl;
}
