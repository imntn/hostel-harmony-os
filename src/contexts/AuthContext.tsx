import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  setDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing without auth
const demoUsers: Record<UserRole, User> = {
  day_scholar: {
    id: 'ds-001',
    email: 'dayscholar@college.edu',
    name: 'Rahul Kumar',
    role: 'day_scholar',
    collegeId: 'col-001',
    status: 'active',
    phone: '+91 98765 43210',
    course: 'B.Tech',
    branch: 'Computer Science',
    year: 3,
  },
  hosteller: {
    id: 'h-001',
    email: 'hosteller@college.edu',
    name: 'Priya Sharma',
    role: 'hosteller',
    collegeId: 'col-001',
    hostelId: 'HOS-2024-0142',
    roomNumber: 'A-204',
    course: 'B.Tech',
    branch: 'Electronics',
    year: 2,
    block: 'A',
    status: 'active',
    phone: '+91 87654 32109',
  },
  visitor: {
    id: 'v-001',
    email: 'visitor@email.com',
    name: 'Amit Patel',
    role: 'visitor',
    status: 'active',
    phone: '+91 76543 21098',
  },
  warden: {
    id: 'w-001',
    email: 'warden@college.edu',
    name: 'Dr. Suresh Verma',
    role: 'warden',
    collegeId: 'col-001',
    hostelId: 'hostel-001',
    status: 'active',
    phone: '+91 65432 10987',
  },
  college_admin: {
    id: 'ca-001',
    email: 'admin@college.edu',
    name: 'Prof. Meera Iyer',
    role: 'college_admin',
    collegeId: 'col-001',
    status: 'active',
    phone: '+91 54321 09876',
  },
  super_admin: {
    id: 'sa-001',
    email: 'superadmin@hostelos.com',
    name: 'System Administrator',
    role: 'super_admin',
    status: 'active',
    phone: '+91 43210 98765',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetch to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      // Fetch role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (profile) {
        const userRole = (roleData?.role as UserRole) || 'hosteller';
        
        setUser({
          id: userId,
          email: profile.email,
          name: profile.name,
          role: userRole,
          collegeId: profile.college_id || undefined,
          hostelId: profile.hostel_id || undefined,
          roomNumber: profile.room_number || undefined,
          course: profile.course || undefined,
          branch: profile.branch || undefined,
          year: profile.year || undefined,
          block: profile.block || undefined,
          status: (profile.status as 'active' | 'inactive') || 'active',
          phone: profile.phone || undefined,
          avatar: profile.avatar_url || undefined,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
          },
        },
      });

      if (error) return { error };

      // Create profile for the new user
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            email,
            name,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        // Assign default role (hosteller for demo)
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'hosteller',
          });

        if (roleError) {
          console.error('Error assigning role:', roleError);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  // Demo mode - for testing without real auth
  const setDemoUser = (role: UserRole) => {
    setUser(demoUsers[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
