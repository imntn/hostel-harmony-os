import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DayScholarDashboard } from '@/components/dashboard/roles/DayScholarDashboard';
import { HostellerDashboard } from '@/components/dashboard/roles/HostellerDashboard';
import { VisitorDashboard } from '@/components/dashboard/roles/VisitorDashboard';
import { WardenDashboard } from '@/components/dashboard/roles/WardenDashboard';
import { CollegeAdminDashboard } from '@/components/dashboard/roles/CollegeAdminDashboard';
import { SuperAdminDashboard } from '@/components/dashboard/roles/SuperAdminDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const getDashboardContent = () => {
    switch (user.role) {
      case 'day_scholar':
        return <DayScholarDashboard user={user} />;
      case 'hosteller':
        return <HostellerDashboard user={user} />;
      case 'visitor':
        return <VisitorDashboard user={user} />;
      case 'warden':
        return <WardenDashboard user={user} />;
      case 'college_admin':
        return <CollegeAdminDashboard user={user} />;
      case 'super_admin':
        return <SuperAdminDashboard user={user} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      {getDashboardContent()}
    </DashboardLayout>
  );
}
