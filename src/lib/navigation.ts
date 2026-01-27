import { UserRole } from '@/types';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Dumbbell,
  WashingMachine,
  MessageSquareWarning,
  DoorOpen,
  BedDouble,
  Search,
  Vote,
  Moon,
  AlertTriangle,
  Users,
  Building2,
  Settings,
  BarChart3,
  ClipboardList,
  UserCog,
  CreditCard,
  Calendar,
  Bell,
  Shield,
  Ticket,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function getNavItems(role: UserRole): NavItem[] {
  const commonItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  switch (role) {
    case 'day_scholar':
      return [
        ...commonItems,
        { label: 'Today\'s Menu', href: '/dashboard/menu', icon: UtensilsCrossed },
        { label: 'Book Meal', href: '/dashboard/book-meal', icon: Ticket },
        { label: 'My Bookings', href: '/dashboard/bookings', icon: ClipboardList },
        { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
        { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
        { label: 'Profile', href: '/dashboard/profile', icon: Settings },
      ];

    case 'hosteller':
      return [
        ...commonItems,
        { label: 'Food & Menu', href: '/dashboard/menu', icon: UtensilsCrossed },
        { label: 'Sports Room', href: '/dashboard/sports', icon: Dumbbell },
        { label: 'Laundry', href: '/dashboard/laundry', icon: WashingMachine },
        { label: 'Complaints', href: '/dashboard/complaints', icon: MessageSquareWarning },
        { label: 'Gate Pass', href: '/dashboard/gate-pass', icon: DoorOpen },
        { label: 'Room Info', href: '/dashboard/room', icon: BedDouble },
        { label: 'Lost & Found', href: '/dashboard/lost-found', icon: Search },
        { label: 'Polls & Events', href: '/dashboard/polls', icon: Vote },
        { label: 'Attendance', href: '/dashboard/attendance', icon: Moon },
        { label: 'Emergency', href: '/dashboard/emergency', icon: AlertTriangle },
        { label: 'Profile', href: '/dashboard/profile', icon: Settings },
      ];

    case 'visitor':
      return [
        ...commonItems,
        { label: 'Request Visit', href: '/dashboard/request-visit', icon: Calendar },
        { label: 'My Requests', href: '/dashboard/my-requests', icon: ClipboardList },
        { label: 'Profile', href: '/dashboard/profile', icon: Settings },
      ];

    case 'warden':
      return [
        ...commonItems,
        { label: 'Night Attendance', href: '/dashboard/attendance', icon: Moon },
        { label: 'Student Management', href: '/dashboard/students', icon: Users },
        { label: 'Mess & Menu', href: '/dashboard/menu-manage', icon: UtensilsCrossed },
        { label: 'Sports Management', href: '/dashboard/sports-manage', icon: Dumbbell },
        { label: 'Laundry Slots', href: '/dashboard/laundry-manage', icon: WashingMachine },
        { label: 'Complaints', href: '/dashboard/complaints', icon: MessageSquareWarning },
        { label: 'Gate Pass', href: '/dashboard/gate-pass-approvals', icon: DoorOpen },
        { label: 'Room Allocation', href: '/dashboard/room-allocation', icon: BedDouble },
        { label: 'Lost & Found', href: '/dashboard/lost-found', icon: Search },
        { label: 'Visitor Requests', href: '/dashboard/visitor-requests', icon: Users },
        { label: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
        { label: 'Settings', href: '/dashboard/settings', icon: Settings },
      ];

    case 'college_admin':
      return [
        ...commonItems,
        { label: 'Hostels', href: '/dashboard/hostels', icon: Building2 },
        { label: 'Wardens', href: '/dashboard/wardens', icon: UserCog },
        { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { label: 'Configuration', href: '/dashboard/config', icon: Settings },
        { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
        { label: 'Reports', href: '/dashboard/reports', icon: ClipboardList },
      ];

    case 'super_admin':
      return [
        ...commonItems,
        { label: 'Colleges', href: '/dashboard/colleges', icon: Building2 },
        { label: 'Module Control', href: '/dashboard/modules', icon: Shield },
        { label: 'Global Analytics', href: '/dashboard/global-analytics', icon: BarChart3 },
        { label: 'Platform Config', href: '/dashboard/platform-config', icon: Settings },
      ];

    default:
      return commonItems;
  }
}
