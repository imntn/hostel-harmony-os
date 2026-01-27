import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock,
  User as UserIcon,
  Building2,
  QrCode,
  CheckCircle2,
  XCircle,
  Hourglass,
} from 'lucide-react';

interface VisitorDashboardProps {
  user: User;
}

const visitRequests = [
  {
    id: 'VR-001',
    studentName: 'Priya Sharma',
    hostel: 'Block A',
    room: 'A-204',
    date: '2024-01-15',
    time: '2:00 PM',
    studentApproval: 'approved',
    wardenApproval: 'pending',
    purpose: 'Family Visit',
  },
  {
    id: 'VR-002',
    studentName: 'Rahul Verma',
    hostel: 'Block B',
    room: 'B-112',
    date: '2024-01-10',
    time: '11:00 AM',
    studentApproval: 'approved',
    wardenApproval: 'approved',
    purpose: 'Document Delivery',
    completed: true,
  },
];

export function VisitorDashboard({ user }: VisitorDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">Request and manage your hostel visits</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Request New Visit
            </CardTitle>
            <CardDescription>Fill in the details to request a visit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student Hostel ID</Label>
                <Input id="studentId" placeholder="Enter student's hostel ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input id="studentName" placeholder="Will auto-fill on ID entry" disabled />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visitDate">Visit Date</Label>
                <Input id="visitDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitTime">Preferred Time</Label>
                <Input id="visitTime" type="time" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Visit</Label>
              <Textarea id="purpose" placeholder="Describe the reason for your visit" rows={3} />
            </div>
            <Button className="w-full">Submit Visit Request</Button>
          </CardContent>
        </Card>

        {/* Visitor Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 rounded-xl bg-muted/50">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.phone}</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Visits</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending Requests</span>
                <span className="font-medium">1</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Visit</span>
                <span className="font-medium">Jan 10, 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visit Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Your Visit Requests</CardTitle>
          <CardDescription>Track the status of your visit requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visitRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{request.studentName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {request.hostel} • Room {request.room}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {request.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {request.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Student:</span>
                      {request.studentApproval === 'approved' ? (
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Hourglass className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Warden:</span>
                      {request.wardenApproval === 'approved' ? (
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      ) : request.wardenApproval === 'pending' ? (
                        <Badge variant="secondary">
                          <Hourglass className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Rejected
                        </Badge>
                      )}
                    </div>
                    {request.completed && (
                      <Button variant="outline" size="sm" className="mt-2">
                        <QrCode className="w-4 h-4 mr-2" />
                        View Pass
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
