import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const login = async (email: string, password: string) => {
    // Demo login - in production, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // For demo, detect role from email domain
    if (email.includes('warden')) {
      setUser(demoUsers.warden);
    } else if (email.includes('admin')) {
      setUser(demoUsers.college_admin);
    } else if (email.includes('super')) {
      setUser(demoUsers.super_admin);
    } else if (email.includes('visitor')) {
      setUser(demoUsers.visitor);
    } else if (email.includes('day') || email.includes('scholar')) {
      setUser(demoUsers.day_scholar);
    } else {
      setUser(demoUsers.hosteller);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const setDemoUser = (role: UserRole) => {
    setUser(demoUsers[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
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
