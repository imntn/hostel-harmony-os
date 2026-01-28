import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGatePasses, useCreateGatePass, GatePass } from '@/hooks/useGatePass';
import { DoorOpen, Clock, Plus, CheckCircle2, ArrowLeft, Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  completed: 'bg-gray-500',
};

export default function GatePassPage() {
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [outDate, setOutDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [outTime, setOutTime] = useState('');
  const [returnDate, setReturnDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [returnTime, setReturnTime] = useState('');

  const hostelId = user?.hostelId || null;
  
  const { data: gatePasses = [], isLoading } = useGatePasses(user?.id || null);
  const createGatePass = useCreateGatePass();

  const handleSubmit = async () => {
    if (!purpose || !outDate || !outTime || !returnDate || !returnTime || !user || !hostelId) return;

    await createGatePass.mutateAsync({
      user_id: user.id,
      hostel_id: hostelId,
      purpose,
      out_date: outDate,
      out_time: outTime,
      expected_return_date: returnDate,
      expected_return_time: returnTime,
    });

    setIsCreateOpen(false);
    setPurpose('');
    setOutTime('');
    setReturnTime('');
  };

  const pendingPasses = gatePasses.filter(p => p.status === 'pending');
  const approvedPasses = gatePasses.filter(p => p.status === 'approved');
  const historyPasses = gatePasses.filter(p => p.status === 'completed' || p.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Gate Pass</h1>
            <p className="text-muted-foreground">Request and manage outing passes</p>
          </div>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Request Pass
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Request Gate Pass</DialogTitle>
              <DialogDescription>
                Fill in the details for your outing request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Purpose of Outing</Label>
                <Textarea
                  placeholder="Describe the reason for your outing..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Out Date</Label>
                  <Input
                    type="date"
                    value={outDate}
                    onChange={(e) => setOutDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Out Time</Label>
                  <Input
                    type="time"
                    value={outTime}
                    onChange={(e) => setOutTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Return Date</Label>
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={outDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Return Time</Label>
                  <Input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={handleSubmit}
                disabled={!purpose || !outTime || !returnTime || createGatePass.isPending}
              >
                {createGatePass.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-amber-500">{pendingPasses.length}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-500">{approvedPasses.length}</div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{historyPasses.length}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Approved
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <DoorOpen className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : pendingPasses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pending gate pass requests.</p>
              </CardContent>
            </Card>
          ) : (
            pendingPasses.map((pass) => (
              <GatePassCard key={pass.id} gatePass={pass} />
            ))
          )}
        </TabsContent>

        {/* Approved Tab */}
        <TabsContent value="approved" className="space-y-4">
          {approvedPasses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No approved gate passes.</p>
              </CardContent>
            </Card>
          ) : (
            approvedPasses.map((pass) => (
              <GatePassCard key={pass.id} gatePass={pass} />
            ))
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {historyPasses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <DoorOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No gate pass history.</p>
              </CardContent>
            </Card>
          ) : (
            historyPasses.map((pass) => (
              <GatePassCard key={pass.id} gatePass={pass} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GatePassCard({ gatePass }: { gatePass: GatePass }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={statusColors[gatePass.status]}>
                {gatePass.status}
              </Badge>
              {gatePass.is_late_return && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Late Return
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium mb-2">{gatePass.purpose}</p>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Out: {format(new Date(gatePass.out_date), 'MMM d')} at {gatePass.out_time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Return: {format(new Date(gatePass.expected_return_date), 'MMM d')} by {gatePass.expected_return_time}</span>
              </div>
            </div>
            {gatePass.warden_remarks && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Warden Remarks:</strong> {gatePass.warden_remarks}
                </p>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${statusColors[gatePass.status]}`}>
            <DoorOpen className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
