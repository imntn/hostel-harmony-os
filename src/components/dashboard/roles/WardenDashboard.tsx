import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Moon,
  MessageSquareWarning,
  DoorOpen,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  BedDouble,
} from 'lucide-react';

interface WardenDashboardProps {
  user: User;
}

const pendingApprovals = [
  { type: 'Gate Pass', student: 'Rahul Kumar', room: 'A-101', time: '2 hours ago' },
  { type: 'Room Change', student: 'Priya Singh', room: 'B-204', time: '3 hours ago' },
  { type: 'Visitor Request', student: 'Amit Patel', room: 'A-312', time: '5 hours ago' },
];

const recentComplaints = [
  { id: 'C-001', category: 'Water', room: 'A-205', status: 'in_progress', priority: 'high' },
  { id: 'C-002', category: 'Electricity', room: 'B-110', status: 'submitted', priority: 'medium' },
  { id: 'C-003', category: 'Room', room: 'A-401', status: 'resolved', priority: 'low' },
];

export function WardenDashboard({ user }: WardenDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Good Morning, {user.name.split(' ')[1]}!</h1>
          <p className="text-muted-foreground">Here's your hostel overview for today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Moon className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
          <Button>View Reports</Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: '248', change: '+12', icon: Users, color: 'text-blue-500' },
          { label: 'Present Today', value: '231', change: '93%', icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Pending Approvals', value: '8', change: '-3', icon: Clock, color: 'text-amber-500' },
          { label: 'Open Complaints', value: '5', change: '+2', icon: MessageSquareWarning, color: 'text-red-500' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {stat.change}
                    </span>
                  </div>
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
        {/* Night Attendance Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-primary" />
                <CardTitle>Tonight's Attendance</CardTitle>
              </div>
              <Badge>Window Open: 9:00 PM - 10:30 PM</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-green-500/10">
                <p className="text-3xl font-bold text-green-600">198</p>
                <p className="text-sm text-muted-foreground">Present</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-red-500/10">
                <p className="text-3xl font-bold text-red-600">12</p>
                <p className="text-sm text-muted-foreground">Absent</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-amber-500/10">
                <p className="text-3xl font-bold text-amber-600">8</p>
                <p className="text-sm text-muted-foreground">On Leave</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-blue-500/10">
                <p className="text-3xl font-bold text-blue-600">30</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Attendance Progress</span>
                <span className="font-medium">87.9%</span>
              </div>
              <Progress value={87.9} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-primary" />
              Room Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">94%</div>
              <p className="text-sm text-muted-foreground">Occupancy Rate</p>
            </div>
            <Progress value={94} className="h-3" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="font-semibold">248</p>
                <p className="text-xs text-muted-foreground">Occupied</p>
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="font-semibold">16</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Pending Approvals
              </CardTitle>
              <Badge variant="secondary">8 Pending</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApprovals.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <DoorOpen className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.student} • Room {item.room}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                    Approve
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">View All Requests</Button>
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-primary" />
                Recent Complaints
              </CardTitle>
              <Badge variant="secondary">5 Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    complaint.priority === 'high' ? 'bg-red-500/10' :
                    complaint.priority === 'medium' ? 'bg-amber-500/10' : 'bg-green-500/10'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 ${
                      complaint.priority === 'high' ? 'text-red-500' :
                      complaint.priority === 'medium' ? 'text-amber-500' : 'text-green-500'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{complaint.category} Issue</p>
                    <p className="text-xs text-muted-foreground">Room {complaint.room}</p>
                  </div>
                </div>
                <Badge variant={
                  complaint.status === 'resolved' ? 'default' :
                  complaint.status === 'in_progress' ? 'secondary' : 'outline'
                }>
                  {complaint.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">View All Complaints</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
