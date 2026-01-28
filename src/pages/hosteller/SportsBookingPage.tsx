import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSportsEquipment, useSportsBookings, useCreateSportsBooking, useUpdateSportsBooking, SportsEquipment, SportsBooking } from '@/hooks/useSportsBooking';
import { Dumbbell, Clock, Calendar, CheckCircle2, AlertCircle, Timer, ArrowLeft } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { Link } from 'react-router-dom';

const sportIcons: Record<string, string> = {
  cricket: '🏏',
  football: '⚽',
  basketball: '🏀',
  volleyball: '🏐',
  badminton: '🏸',
  'table tennis': '🏓',
  chess: '♟️',
  carrom: '🎯',
  default: '🎽',
};

const statusColors: Record<string, string> = {
  reserved: 'bg-blue-500',
  in_use: 'bg-amber-500',
  returned: 'bg-green-500',
  overdue: 'bg-red-500',
  cancelled: 'bg-gray-500',
};

export default function SportsBookingPage() {
  const { user } = useAuth();
  const [selectedEquipment, setSelectedEquipment] = useState<SportsEquipment | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('2');
  const [notes, setNotes] = useState('');

  // For demo, use a fixed hostel_id - in production this comes from profile
  const hostelId = user?.hostelId || null;
  
  const { data: equipment = [], isLoading: loadingEquipment } = useSportsEquipment(hostelId);
  const { data: bookings = [], isLoading: loadingBookings } = useSportsBookings(user?.id || null);
  const createBooking = useCreateSportsBooking();
  const updateBooking = useUpdateSportsBooking();

  // Group equipment by sport
  const equipmentBySport = equipment.reduce((acc, item) => {
    const sport = item.sport.toLowerCase();
    if (!acc[sport]) acc[sport] = [];
    acc[sport].push(item);
    return acc;
  }, {} as Record<string, SportsEquipment[]>);

  const handleBook = async () => {
    if (!selectedEquipment || !user || !hostelId || !startTime) return;

    const startDateTime = new Date(`${bookingDate}T${startTime}`);
    const endDateTime = addHours(startDateTime, parseInt(duration));

    await createBooking.mutateAsync({
      user_id: user.id,
      equipment_id: selectedEquipment.id,
      hostel_id: hostelId,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
    });

    setIsBookingOpen(false);
    setSelectedEquipment(null);
    setNotes('');
  };

  const handleReturn = async (booking: SportsBooking) => {
    await updateBooking.mutateAsync({
      id: booking.id,
      status: 'returned',
      actual_return_time: new Date().toISOString(),
    });
  };

  const activeBookings = bookings.filter(b => b.status === 'reserved' || b.status === 'in_use');
  const pastBookings = bookings.filter(b => b.status === 'returned' || b.status === 'overdue' || b.status === 'cancelled');

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
          <h1 className="text-2xl font-bold">Sports Room</h1>
          <p className="text-muted-foreground">Book sports equipment and track your bookings</p>
        </div>
      </div>

      <Tabs defaultValue="equipment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="equipment" className="gap-2">
            <Dumbbell className="w-4 h-4" />
            Equipment
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

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          {loadingEquipment ? (
            <div className="text-center py-8 text-muted-foreground">Loading equipment...</div>
          ) : Object.keys(equipmentBySport).length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sports equipment available in your hostel.</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(equipmentBySport).map(([sport, items]) => (
              <div key={sport}>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">{sportIcons[sport] || sportIcons.default}</span>
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Card key={item.id} className="card-hover">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{item.item_name}</CardTitle>
                          <Badge variant={item.available_quantity > 0 ? 'default' : 'secondary'}>
                            {item.available_quantity} / {item.total_quantity}
                          </Badge>
                        </div>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Max {item.max_booking_hours}h booking
                          </span>
                          <Dialog open={isBookingOpen && selectedEquipment?.id === item.id} onOpenChange={(open) => {
                            setIsBookingOpen(open);
                            if (!open) setSelectedEquipment(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                disabled={item.available_quantity === 0}
                                onClick={() => setSelectedEquipment(item)}
                              >
                                Book Now
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Book {item.item_name}</DialogTitle>
                                <DialogDescription>
                                  Select your preferred time slot. Maximum booking duration: {item.max_booking_hours} hours.
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
                                  <Label>Duration (hours)</Label>
                                  <Select value={duration} onValueChange={setDuration}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: item.max_booking_hours }, (_, i) => i + 1).map((h) => (
                                        <SelectItem key={h} value={h.toString()}>
                                          {h} hour{h > 1 ? 's' : ''}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Notes (optional)</Label>
                                  <Textarea
                                    placeholder="Any special requirements..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                  />
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
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
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
                <p>No active bookings. Book equipment to get started!</p>
              </CardContent>
            </Card>
          ) : (
            activeBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${statusColors[booking.status]}`}>
                        <Dumbbell className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {booking.sports_equipment?.item_name || 'Equipment'}
                        </h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(booking.start_time), 'MMM d, yyyy')}
                          <Clock className="w-3 h-3 ml-2" />
                          {format(new Date(booking.start_time), 'h:mm a')} - {format(new Date(booking.end_time), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[booking.status]}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                      {booking.status === 'in_use' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReturn(booking)}
                          disabled={updateBooking.isPending}
                        >
                          Return
                        </Button>
                      )}
                    </div>
                  </div>
                  {booking.penalty_amount > 0 && (
                    <div className="mt-3 p-3 bg-red-500/10 rounded-lg flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Penalty: ₹{booking.penalty_amount} - {booking.penalty_reason}</span>
                    </div>
                  )}
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
                        <Dumbbell className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {booking.sports_equipment?.item_name || 'Equipment'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.start_time), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className={statusColors[booking.status]}>
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
