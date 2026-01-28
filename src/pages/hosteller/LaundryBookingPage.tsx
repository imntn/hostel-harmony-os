import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLaundryMachines, useLaundryBookings, useCreateLaundryBooking, LaundryMachine, LaundryBooking } from '@/hooks/useLaundryBooking';
import { WashingMachine, Clock, Calendar, CheckCircle2, ArrowLeft, Timer } from 'lucide-react';
import { format, addMinutes } from 'date-fns';
import { Link } from 'react-router-dom';

const statusColors: Record<string, string> = {
  available: 'bg-green-500',
  in_use: 'bg-amber-500',
  maintenance: 'bg-red-500',
};

const bookingStatusColors: Record<string, string> = {
  reserved: 'bg-blue-500',
  in_use: 'bg-amber-500',
  returned: 'bg-green-500',
  completed: 'bg-green-500',
  cancelled: 'bg-gray-500',
};

export default function LaundryBookingPage() {
  const { user } = useAuth();
  const [selectedMachine, setSelectedMachine] = useState<LaundryMachine | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(45); // minutes

  const hostelId = user?.hostelId || null;
  
  const { data: machines = [], isLoading: loadingMachines } = useLaundryMachines(hostelId);
  const { data: bookings = [], isLoading: loadingBookings } = useLaundryBookings(user?.id || null);
  const createBooking = useCreateLaundryBooking();

  const handleBook = async () => {
    if (!selectedMachine || !user || !hostelId || !startTime) return;

    const startDateTime = new Date(`${bookingDate}T${startTime}`);
    const endDateTime = addMinutes(startDateTime, duration);

    await createBooking.mutateAsync({
      user_id: user.id,
      machine_id: selectedMachine.id,
      hostel_id: hostelId,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
    });

    setIsBookingOpen(false);
    setSelectedMachine(null);
  };

  const activeBookings = bookings.filter(b => b.status === 'reserved' || b.status === 'in_use');
  const pastBookings = bookings.filter(b => b.status === 'returned' || b.status === 'cancelled');

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
          <h1 className="text-2xl font-bold">Laundry Room</h1>
          <p className="text-muted-foreground">Book washing machine slots</p>
        </div>
      </div>

      <Tabs defaultValue="machines" className="space-y-4">
        <TabsList>
          <TabsTrigger value="machines" className="gap-2">
            <WashingMachine className="w-4 h-4" />
            Machines
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            <Timer className="w-4 h-4" />
            Active ({activeBookings.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Machines Tab */}
        <TabsContent value="machines" className="space-y-4">
          {loadingMachines ? (
            <div className="text-center py-8 text-muted-foreground">Loading machines...</div>
          ) : machines.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <WashingMachine className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No washing machines available in your hostel.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {machines.map((machine) => (
                <Card key={machine.id} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${statusColors[machine.status]}`}>
                          <WashingMachine className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            Machine #{machine.machine_number}
                          </CardTitle>
                          <CardDescription>
                            {machine.machine_name || 'Standard Washer'}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={statusColors[machine.status]}>
                        {machine.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={isBookingOpen && selectedMachine?.id === machine.id} onOpenChange={(open) => {
                      setIsBookingOpen(open);
                      if (!open) setSelectedMachine(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          disabled={machine.status !== 'available'}
                          onClick={() => setSelectedMachine(machine)}
                        >
                          Book Slot
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Book Machine #{machine.machine_number}</DialogTitle>
                          <DialogDescription>
                            Select your preferred time slot. One slot = 45 minutes.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              min={format(new Date(), 'yyyy-MM-dd')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Duration</Label>
                            <div className="flex gap-2">
                              {[45, 60, 90].map((mins) => (
                                <Button
                                  key={mins}
                                  type="button"
                                  variant={duration === mins ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setDuration(mins)}
                                >
                                  {mins} min
                                </Button>
                              ))}
                            </div>
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={handleBook}
                            disabled={!startTime || createBooking.isPending}
                          >
                            {createBooking.isPending ? 'Booking...' : 'Confirm Booking'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Active Bookings Tab */}
        <TabsContent value="active" className="space-y-4">
          {loadingBookings ? (
            <div className="text-center py-8 text-muted-foreground">Loading bookings...</div>
          ) : activeBookings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active bookings. Book a slot to get started!</p>
              </CardContent>
            </Card>
          ) : (
            activeBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${bookingStatusColors[booking.status]}`}>
                        <WashingMachine className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          Machine #{booking.laundry_machines?.machine_number || '-'}
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(booking.start_time), 'MMM d, yyyy')}
                          <Clock className="w-3 h-3 ml-2" />
                          {format(new Date(booking.start_time), 'h:mm a')} - {format(new Date(booking.end_time), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                    <Badge className={bookingStatusColors[booking.status]}>
                      {booking.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No booking history yet.</p>
              </CardContent>
            </Card>
          ) : (
            pastBookings.map((booking) => (
              <Card key={booking.id} className="opacity-75">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-muted">
                        <WashingMachine className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          Machine #{booking.laundry_machines?.machine_number || '-'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.start_time), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {booking.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
