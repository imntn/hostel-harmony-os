import { 
  UtensilsCrossed, 
  Dumbbell, 
  WashingMachine, 
  MessageSquareWarning,
  DoorOpen,
  BedDouble,
  Search,
  Vote,
  Moon,
  AlertTriangle,
  Users,
  Building2,
  Shield,
  BarChart3
} from 'lucide-react';

const features = [
  {
    icon: UtensilsCrossed,
    title: 'Food & Mess Management',
    description: 'Digital menu display, meal booking for day scholars, QR-based entry, and payment tracking.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Dumbbell,
    title: 'Sports Equipment',
    description: 'Book sports gear, track usage time, manage returns with automated penalty system.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: WashingMachine,
    title: 'Laundry Booking',
    description: 'Reserve washing machines, view live availability, auto-release after slot ends.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: MessageSquareWarning,
    title: 'Complaint System',
    description: 'Report issues with photos, track status from submission to resolution.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: DoorOpen,
    title: 'Gate Pass & Outing',
    description: 'Apply for outings, get warden approval, track late returns automatically.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: BedDouble,
    title: 'Room Allocation',
    description: 'View assigned rooms, request changes with approval workflow.',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    icon: Search,
    title: 'Lost & Found',
    description: 'Report lost items, browse found items, warden verification system.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: Vote,
    title: 'Polls & Events',
    description: 'Create polls, one vote per hostel ID, auto-notify on majority decisions.',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Moon,
    title: 'Night Attendance',
    description: 'Hybrid self check-in with warden override, detailed attendance reports.',
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Module',
    description: 'One-tap emergency alerts to warden and security with location info.',
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
  },
  {
    icon: Users,
    title: 'Visitor Management',
    description: 'Request visits, student & warden approval, QR-based entry passes.',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive reports for wardens and admins with export options.',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to
            <span className="gradient-text"> Manage Your Hostel</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A comprehensive suite of modules designed to streamline every aspect of hostel operations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="module-card group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
