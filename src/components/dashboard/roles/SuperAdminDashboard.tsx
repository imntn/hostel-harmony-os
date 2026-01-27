import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Building2,
  Users,
  Shield,
  BarChart3,
  Globe,
  Settings,
  Plus,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface SuperAdminDashboardProps {
  user: User;
}

const colleges = [
  { name: 'ABC Engineering College', hostels: 4, students: 798, status: 'active' },
  { name: 'XYZ University', hostels: 6, students: 1250, status: 'active' },
  { name: 'PQR Institute of Technology', hostels: 3, students: 450, status: 'active' },
  { name: 'LMN College', hostels: 2, students: 280, status: 'inactive' },
];

const modules = [
  { name: 'Food & Mess', enabled: true },
  { name: 'Sports Equipment', enabled: true },
  { name: 'Laundry', enabled: true },
  { name: 'Complaints', enabled: true },
  { name: 'Gate Pass', enabled: true },
  { name: 'Room Allocation', enabled: true },
  { name: 'Lost & Found', enabled: false },
  { name: 'Polls & Events', enabled: true },
  { name: 'Night Attendance', enabled: true },
  { name: 'Emergency', enabled: true },
  { name: 'Visitor Management', enabled: false },
];

export function SuperAdminDashboard({ user }: SuperAdminDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Platform Administration</h1>
          <p className="text-muted-foreground">Manage all colleges and platform settings</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add College
        </Button>
      </div>

      {/* Platform Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Colleges', value: '4', icon: Building2, color: 'text-blue-500' },
          { label: 'Total Hostels', value: '15', icon: Globe, color: 'text-green-500' },
          { label: 'Total Students', value: '2,778', icon: Users, color: 'text-purple-500' },
          { label: 'Active Modules', value: '9/11', icon: Shield, color: 'text-amber-500' },
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Colleges List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Registered Colleges</CardTitle>
            <CardDescription>All colleges using the HostelOS platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {colleges.map((college) => (
                <div
                  key={college.name}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{college.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {college.hostels} Hostels • {college.students} Students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={college.status === 'active' ? 'default' : 'secondary'}>
                      {college.status === 'active' ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {college.status}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Module Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Global Modules
            </CardTitle>
            <CardDescription>Enable/disable modules globally</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {modules.map((module) => (
                <div
                  key={module.name}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium">{module.name}</span>
                  <Switch checked={module.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="card-hover cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="p-4 rounded-xl bg-blue-500/10 inline-flex mb-3">
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="font-semibold">Global Analytics</h4>
            <p className="text-sm text-muted-foreground">Platform-wide statistics</p>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="p-4 rounded-xl bg-green-500/10 inline-flex mb-3">
              <Settings className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="font-semibold">Platform Config</h4>
            <p className="text-sm text-muted-foreground">System-wide settings</p>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer">
          <CardContent className="pt-6 text-center">
            <div className="p-4 rounded-xl bg-purple-500/10 inline-flex mb-3">
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <h4 className="font-semibold">User Management</h4>
            <p className="text-sm text-muted-foreground">Manage platform users</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
