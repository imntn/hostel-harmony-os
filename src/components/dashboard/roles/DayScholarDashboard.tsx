import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UtensilsCrossed, 
  Ticket, 
  CreditCard, 
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface DayScholarDashboardProps {
  user: User;
}

const todayMenu = {
  breakfast: { time: '7:30 AM - 9:00 AM', items: ['Poha', 'Bread & Butter', 'Milk', 'Tea/Coffee'] },
  lunch: { time: '12:30 PM - 2:00 PM', items: ['Rice', 'Dal Fry', 'Mix Veg', 'Chapati', 'Salad', 'Buttermilk'] },
  snacks: { time: '5:00 PM - 6:00 PM', items: ['Samosa', 'Tea/Coffee'] },
  dinner: { time: '7:30 PM - 9:00 PM', items: ['Rice', 'Paneer Curry', 'Chapati', 'Dal', 'Dessert'] },
};

const recentBookings = [
  { id: 'TKT-001', meal: 'Lunch', date: 'Today', status: 'confirmed', amount: 50 },
  { id: 'TKT-002', meal: 'Dinner', date: 'Yesterday', status: 'used', amount: 60 },
  { id: 'TKT-003', meal: 'Lunch', date: '2 days ago', status: 'used', amount: 50 },
];

export function DayScholarDashboard({ user }: DayScholarDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Here's your meal booking overview for today.</p>
        </div>
        <Button variant="hero">
          <Ticket className="w-4 h-4 mr-2" />
          Book Meal Now
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Available Seats', value: '24', icon: UtensilsCrossed, color: 'text-green-500' },
          { label: 'Today\'s Bookings', value: '1', icon: Ticket, color: 'text-blue-500' },
          { label: 'Pending Payments', value: '₹0', icon: AlertCircle, color: 'text-amber-500' },
          { label: 'Total Spent', value: '₹1,250', icon: CreditCard, color: 'text-purple-500' },
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
        {/* Today's Menu */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              Today's Menu
            </CardTitle>
            <CardDescription>View what's being served today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(todayMenu).map(([meal, data]) => (
              <div key={meal} className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold capitalize">{meal}</h4>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {data.time}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.items.map((item) => (
                    <Badge key={item} variant="secondary">{item}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              Recent Bookings
            </CardTitle>
            <CardDescription>Your latest meal tickets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    booking.status === 'confirmed' ? 'bg-green-500/10' : 'bg-muted'
                  }`}>
                    {booking.status === 'confirmed' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Ticket className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{booking.meal}</p>
                    <p className="text-xs text-muted-foreground">{booking.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">₹{booking.amount}</p>
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              View All Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
