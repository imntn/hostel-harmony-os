import { GraduationCap, Home, UserCheck, Shield, Building, Settings } from 'lucide-react';

const roles = [
  {
    icon: GraduationCap,
    title: 'Day Scholar',
    description: 'Book hostel meals, make payments, and access food services without hostel stay privileges.',
    features: ['Meal Booking', 'QR Tickets', 'Payment History'],
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Home,
    title: 'Hosteller',
    description: 'Full access to all hostel services including attendance, complaints, laundry, and sports.',
    features: ['All Modules', 'Night Attendance', 'Gate Pass'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: UserCheck,
    title: 'Visitor',
    description: 'Request visits to students, get approvals, and receive digital entry passes.',
    features: ['Visit Request', 'QR Entry Pass', 'Time Tracking'],
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Warden',
    description: 'Manage hostel operations, approve requests, track attendance, and resolve issues.',
    features: ['Approvals', 'Reports', 'Student Management'],
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    icon: Building,
    title: 'College Admin',
    description: 'Oversee multiple hostels, assign wardens, configure rules, and view analytics.',
    features: ['Multi-Hostel', 'Analytics', 'Configuration'],
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Settings,
    title: 'Super Admin',
    description: 'Platform-level management of colleges, modules, and global settings.',
    features: ['All Colleges', 'Module Control', 'Global Config'],
    gradient: 'from-slate-500 to-zinc-500',
  },
];

export function RoleSection() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Role-Based Access for
            <span className="gradient-text"> Everyone</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            One platform, multiple roles. Each user gets a personalized experience based on their role.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <div
              key={role.title}
              className="relative p-6 rounded-2xl bg-card border border-border overflow-hidden card-hover group"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.gradient}`} />
              
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${role.gradient} mb-4`}>
                <role.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
              <p className="text-muted-foreground mb-4">{role.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {role.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
