import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  UtensilsCrossed,
  Dumbbell,
  WashingMachine,
  MessageSquareWarning,
  DoorOpen,
  Moon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  BedDouble,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface HostellerDashboardProps {
  user: User;
}

const quickActions = [
  { label: 'Sports Booking', icon: Dumbbell, href: '/dashboard/sports', color: 'bg-green-500' },
  { label: 'Laundry', icon: WashingMachine, href: '/dashboard/laundry', color: 'bg-blue-500' },
  { label: 'Complaint', icon: MessageSquareWarning, href: '/dashboard/complaints', color: 'bg-amber-500' },
  { label: 'Gate Pass', icon: DoorOpen, href: '/dashboard/gate-pass', color: 'bg-purple-500' },
  { label: 'Attendance', icon: Moon, href: '/dashboard/attendance', color: 'bg-indigo-500' },
  { label: 'Room Info', icon: BedDouble, href: '/dashboard/room', color: 'bg-teal-500' },
  { label: 'Lost & Found', icon: Search, href: '/dashboard/lost-found', color: 'bg-orange-500' },
  { label: 'Emergency', icon: AlertTriangle, href: '/dashboard/emergency', color: 'bg-red-500' },
];

const recentActivity = [
  { type: 'attendance', message: 'Night attendance marked', time: 'Yesterday, 10:00 PM', status: 'present' },
  { type: 'complaint', message: 'Water issue resolved', time: '2 days ago', status: 'resolved' },
  { type: 'laundry', message: 'Laundry slot completed', time: '3 days ago', status: 'completed' },
  { type: 'gatepass', message: 'Gate pass approved', time: '4 days ago', status: 'approved' },
];

export function HostellerDashboard({ user }: HostellerDashboardProps) {
  const attendancePercentage = 92;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">
            Room {user.roomNumber} • Hostel ID: {user.hostelId}
          </p>
        </div>
        <Link to="/dashboard/emergency">
          <Button variant="destructive" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Emergency
          </Button>
        </Link>
      </div>

      {/* Hostel ID Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
        <CardContent className="pt-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm opacity-80">Hostel ID</p>
                <p className="text-2xl font-bold tracking-wider">{user.hostelId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Room</p>
                <p className="text-xl font-semibold">{user.roomNumber}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-4">
              <div>
                <p className="text-xs opacity-70">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-xs opacity-70">Course</p>
                <p className="font-medium">{user.course} - {user.branch}</p>
              </div>
              <div>
                <p className="text-xs opacity-70">Year</p>
                <p className="font-medium">{user.year}</p>
              </div>
              <div>
                <p className="text-xs opacity-70">Block</p>
                <p className="font-medium">{user.block}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.label} to={action.href}>
            <Card className="card-hover cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <div className={`inline-flex p-3 rounded-xl ${action.color} mb-3`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-sm">{action.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Menu */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                <CardTitle>Today's Mess Menu</CardTitle>
              </div>
              <Badge>Breakfast Ongoing</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { meal: 'Breakfast', time: '7:30 AM - 9:00 AM', items: 'Idli, Sambar, Chutney, Coffee', current: true },
                { meal: 'Lunch', time: '12:30 PM - 2:00 PM', items: 'Rice, Dal, Sabzi, Chapati, Curd' },
                { meal: 'Snacks', time: '5:00 PM - 6:00 PM', items: 'Vada Pav, Tea' },
                { meal: 'Dinner', time: '7:30 PM - 9:00 PM', items: 'Rice, Paneer, Chapati, Dal' },
              ].map((menu) => (
                <div
                  key={menu.meal}
                  className={`p-4 rounded-xl border ${
                    menu.current ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{menu.meal}</h4>
                    {menu.current && (
                      <Badge variant="default" className="text-xs">Now</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <Clock className="w-3 h-3" />
                    {menu.time}
                  </p>
                  <p className="text-sm text-muted-foreground">{menu.items}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary" />
              <CardTitle>Night Attendance</CardTitle>
            </div>
            <CardDescription>This month's attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{attendancePercentage}%</div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
            </div>
            <Progress value={attendancePercentage} className="h-3" />
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="p-2 rounded-lg bg-green-500/10">
                <p className="font-semibold text-green-600">23</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10">
                <p className="font-semibold text-red-600">2</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10">
                <p className="font-semibold text-amber-600">1</p>
                <p className="text-xs text-muted-foreground">Leave</p>
              </div>
            </div>
            <Link to="/dashboard/attendance">
              <Button variant="outline" className="w-full">
                Mark Tonight's Attendance
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest hostel activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="capitalize">{activity.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
