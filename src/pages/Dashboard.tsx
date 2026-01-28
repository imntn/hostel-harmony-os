import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DayScholarDashboard } from '@/components/dashboard/roles/DayScholarDashboard';
import { HostellerDashboard } from '@/components/dashboard/roles/HostellerDashboard';
import { VisitorDashboard } from '@/components/dashboard/roles/VisitorDashboard';
import { WardenDashboard } from '@/components/dashboard/roles/WardenDashboard';
import { CollegeAdminDashboard } from '@/components/dashboard/roles/CollegeAdminDashboard';
import { SuperAdminDashboard } from '@/components/dashboard/roles/SuperAdminDashboard';
import { Routes, Route } from 'react-router-dom';

// Hosteller Pages
import SportsBookingPage from '@/pages/hosteller/SportsBookingPage';
import LaundryBookingPage from '@/pages/hosteller/LaundryBookingPage';
import ComplaintsPage from '@/pages/hosteller/ComplaintsPage';
import GatePassPage from '@/pages/hosteller/GatePassPage';
import AttendancePage from '@/pages/hosteller/AttendancePage';
import RoomInfoPage from '@/pages/hosteller/RoomInfoPage';
import LostFoundPage from '@/pages/hosteller/LostFoundPage';
import EmergencyPage from '@/pages/hosteller/EmergencyPage';

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

  // Hosteller-specific routes
  if (user.role === 'hosteller') {
    return (
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<HostellerDashboard user={user} />} />
          <Route path="/sports" element={<SportsBookingPage />} />
          <Route path="/laundry" element={<LaundryBookingPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/gate-pass" element={<GatePassPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/room" element={<RoomInfoPage />} />
          <Route path="/lost-found" element={<LostFoundPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="*" element={<HostellerDashboard user={user} />} />
        </Routes>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {getDashboardContent()}
    </DashboardLayout>
  );
}
