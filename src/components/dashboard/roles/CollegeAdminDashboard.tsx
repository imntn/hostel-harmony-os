import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Users,
  UserCog,
  BarChart3,
  TrendingUp,
  CreditCard,
  Download,
} from 'lucide-react';

interface CollegeAdminDashboardProps {
  user: User;
}

const hostels = [
  { name: 'Boys Hostel A', students: 248, occupancy: 94, warden: 'Dr. Suresh Verma' },
  { name: 'Boys Hostel B', students: 180, occupancy: 87, warden: 'Mr. Rajesh Kumar' },
  { name: 'Girls Hostel A', students: 220, occupancy: 92, warden: 'Dr. Priya Iyer' },
  { name: 'Girls Hostel B', students: 150, occupancy: 78, warden: 'Ms. Anita Sharma' },
];

export function CollegeAdminDashboard({ user }: CollegeAdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">College hostel management overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Building2 className="w-4 h-4 mr-2" />
            Add Hostel
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Hostels', value: '4', icon: Building2, color: 'text-blue-500' },
          { label: 'Total Students', value: '798', icon: Users, color: 'text-green-500' },
          { label: 'Wardens', value: '4', icon: UserCog, color: 'text-purple-500' },
          { label: 'Revenue (MTD)', value: '₹4.2L', icon: CreditCard, color: 'text-amber-500' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hostels List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Managed Hostels</CardTitle>
              <CardDescription>Overview of all hostels under your management</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {hostels.map((hostel) => (
              <div
                key={hostel.name}
                className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{hostel.name}</h4>
                      <p className="text-sm text-muted-foreground">{hostel.warden}</p>
                    </div>
                  </div>
                  <Badge variant={hostel.occupancy >= 90 ? 'default' : 'secondary'}>
                    {hostel.occupancy}% Full
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-2 rounded-lg bg-muted">
                    <p className="text-xl font-bold">{hostel.students}</p>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <p className="text-xl font-bold flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      {hostel.occupancy}%
                    </p>
                    <p className="text-xs text-muted-foreground">Occupancy</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="card-hover cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="p-4 rounded-xl bg-blue-500/10 inline-flex mb-3">
              <UserCog className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="font-semibold">Manage Wardens</h4>
            <p className="text-sm text-muted-foreground">Assign and update warden details</p>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="p-4 rounded-xl bg-green-500/10 inline-flex mb-3">
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="font-semibold">View Analytics</h4>
            <p className="text-sm text-muted-foreground">Detailed reports and insights</p>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="p-4 rounded-xl bg-purple-500/10 inline-flex mb-3">
              <CreditCard className="w-8 h-8 text-purple-500" />
            </div>
            <h4 className="font-semibold">Payment Overview</h4>
            <p className="text-sm text-muted-foreground">Track fees and payments</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
