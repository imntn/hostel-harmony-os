import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRoomChangeRequests, useCreateRoomChangeRequest, RoomChangeRequest } from '@/hooks/useRoomChange';
import { BedDouble, Clock, Plus, ArrowLeft, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
};

export default function RoomInfoPage() {
  const { user } = useAuth();
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestedRoom, setRequestedRoom] = useState('');
  const [reason, setReason] = useState('');

  const hostelId = user?.hostelId || null;
  const currentRoom = user?.roomNumber || '';
  const block = user?.block || '';
  
  const { data: requests = [], isLoading } = useRoomChangeRequests(user?.id || null);
  const createRequest = useCreateRoomChangeRequest();

  const handleSubmit = async () => {
    if (!requestedRoom || !reason || !user || !hostelId) return;

    await createRequest.mutateAsync({
      user_id: user.id,
      hostel_id: hostelId,
      current_room: currentRoom,
      requested_room: requestedRoom,
      reason,
    });

    setIsRequestOpen(false);
    setRequestedRoom('');
    setReason('');
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

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
          <h1 className="text-2xl font-bold">Room Information</h1>
          <p className="text-muted-foreground">View your room details and request changes</p>
        </div>
      </div>

      {/* Current Room Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BedDouble className="w-5 h-5" />
            Your Current Room
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-sm opacity-80">Room Number</p>
              <p className="text-2xl font-bold">{currentRoom || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Block</p>
              <p className="text-2xl font-bold">{block || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Hostel ID</p>
              <p className="text-lg font-semibold">{user?.hostelId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Status</p>
              <Badge variant="secondary" className="mt-1">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Change Request */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Room Change Requests</CardTitle>
            <CardDescription>Request to change your room allocation</CardDescription>
          </div>
          <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={pendingRequests.length > 0}>
                <Plus className="w-4 h-4" />
                Request Change
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Room Change</DialogTitle>
                <DialogDescription>
                  Current Room: {currentRoom} • Block: {block}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Requested Room Number</Label>
                  <Input
                    placeholder="e.g., B-301"
                    value={requestedRoom}
                    onChange={(e) => setRequestedRoom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reason for Change</Label>
                  <Textarea
                    placeholder="Explain why you need a room change..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={!requestedRoom || !reason || createRequest.isPending}
                >
                  {createRequest.isPending ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No room change requests yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-start justify-between p-4 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={statusColors[request.status]}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mb-1">
                      {request.current_room} → {request.requested_room}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">{request.reason}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(request.created_at), 'MMM d, yyyy • h:mm a')}
                    </p>
                    {request.admin_notes && (
                      <div className="mt-2 p-2 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Admin Notes:</strong> {request.admin_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
