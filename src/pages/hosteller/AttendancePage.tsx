import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAttendance, useTodayAttendance, useMarkAttendance, calculateAttendanceStats, AttendanceRecord } from '@/hooks/useAttendance';
import { Moon, Clock, CheckCircle2, XCircle, ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const statusColors: Record<string, string> = {
  present: 'bg-green-500',
  absent: 'bg-red-500',
  on_leave: 'bg-amber-500',
  late_entry: 'bg-orange-500',
};

const statusIcons: Record<string, React.ReactNode> = {
  present: <CheckCircle2 className="w-4 h-4" />,
  absent: <XCircle className="w-4 h-4" />,
  on_leave: <Clock className="w-4 h-4" />,
  late_entry: <Clock className="w-4 h-4" />,
};

export default function AttendancePage() {
  const { user } = useAuth();
  const hostelId = user?.hostelId || null;
  
  const { data: attendance = [], isLoading } = useAttendance(user?.id || null);
  const { data: todayAttendance } = useTodayAttendance(user?.id || null);
  const markAttendance = useMarkAttendance();

  const stats = calculateAttendanceStats(attendance);

  const handleMarkAttendance = async () => {
    if (!user || !hostelId) return;

    await markAttendance.mutateAsync({
      user_id: user.id,
      hostel_id: hostelId,
      date: new Date().toISOString().split('T')[0],
      check_in_time: new Date().toISOString(),
      status: 'present',
    });
  };

  // Check if within attendance window (9 PM - 11 PM for demo)
  const now = new Date();
  const hour = now.getHours();
  const isWithinWindow = hour >= 21 && hour < 23;
  const canMarkAttendance = isWithinWindow && !todayAttendance;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Night Attendance</h1>
          <p className="text-muted-foreground">Mark and view your attendance history</p>
        </div>
      </div>

      {/* Today's Attendance Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Tonight's Attendance
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayAttendance ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">
                  ✓ Attendance Marked
                </p>
                <p className="text-sm text-primary-foreground/80">
                  Checked in at {format(new Date(todayAttendance.check_in_time!), 'h:mm a')}
                </p>
              </div>
              <Badge className={`${statusColors[todayAttendance.status]} text-white`}>
                {todayAttendance.status.replace('_', ' ')}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">
                  {isWithinWindow ? 'Ready to mark attendance' : 'Attendance window closed'}
                </p>
                <p className="text-sm text-primary-foreground/80">
                  Window: 9:00 PM - 11:00 PM
                </p>
              </div>
              <Button 
                variant="secondary" 
                onClick={handleMarkAttendance}
                disabled={!canMarkAttendance || markAttendance.isPending}
              >
                {markAttendance.isPending ? 'Marking...' : 'Mark Present'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary">{stats.percentage}%</div>
            <p className="text-sm text-muted-foreground">Attendance Rate</p>
            <Progress value={stats.percentage} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-500">{stats.present}</div>
            <p className="text-sm text-muted-foreground">Days Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-red-500">{stats.absent}</div>
            <p className="text-sm text-muted-foreground">Days Absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-amber-500">{stats.onLeave}</div>
            <p className="text-sm text-muted-foreground">On Leave</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Attendance History
          </CardTitle>
          <CardDescription>Your night attendance records for this month</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading attendance...</div>
          ) : attendance.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Moon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No attendance records found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attendance.slice(0, 30).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${statusColors[record.status]}`}>
                      {statusIcons[record.status]}
                    </div>
                    <div>
                      <p className="font-medium">{format(new Date(record.date), 'EEEE, MMM d')}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.check_in_time 
                          ? `Checked in at ${format(new Date(record.check_in_time), 'h:mm a')}`
                          : record.status === 'on_leave' ? 'On approved leave' : 'Not marked'
                        }
                        {record.marked_by === 'warden' && ' • Marked by Warden'}
                      </p>
                    </div>
                  </div>
                  <Badge className={statusColors[record.status]}>
                    {record.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
