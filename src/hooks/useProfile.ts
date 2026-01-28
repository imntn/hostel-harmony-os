import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
  college_id: string | null;
  hostel_id: string | null;
  hostel_id_number: string | null;
  room_number: string | null;
  block: string | null;
  course: string | null;
  branch: string | null;
  year: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!user,
  });
}
