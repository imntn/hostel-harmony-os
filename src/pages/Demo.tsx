import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Building2,
  GraduationCap,
  Home,
  UserCheck,
  Shield,
  Building,
  Settings,
} from 'lucide-react';

const demoRoles = [
  {
    role: 'day_scholar' as const,
    label: 'Day Scholar',
    description: 'Book meals, view menu, manage payments',
    icon: GraduationCap,
    color: 'from-orange-500 to-amber-500',
  },
  {
    role: 'hosteller' as const,
    label: 'Hosteller',
    description: 'Full hostel access - sports, laundry, complaints, attendance',
    icon: Home,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    role: 'visitor' as const,
    label: 'Visitor',
    description: 'Request visits, get approvals, receive entry passes',
    icon: UserCheck,
    color: 'from-green-500 to-emerald-500',
  },
  {
    role: 'warden' as const,
    label: 'Warden',
    description: 'Manage hostel operations, approve requests, view reports',
    icon: Shield,
    color: 'from-purple-500 to-violet-500',
  },
  {
    role: 'college_admin' as const,
    label: 'College Admin',
    description: 'Oversee multiple hostels, manage wardens, view analytics',
    icon: Building,
    color: 'from-pink-500 to-rose-500',
  },
  {
    role: 'super_admin' as const,
    label: 'Super Admin',
    description: 'Platform-level management of all colleges',
    icon: Settings,
    color: 'from-slate-500 to-zinc-500',
  },
];

export default function Demo() {
  const { setDemoUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDemoLogin = (role: typeof demoRoles[number]['role']) => {
    setDemoUser(role);
    toast({
      title: "Demo Mode Activated",
      description: `You're now viewing the platform as a ${role.replace('_', ' ')}.`,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">HostelOS</span>
          </Link>
          <Button asChild variant="outline">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Demo Content */}
      <main className="container px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Try HostelOS Demo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the platform from different perspectives. Choose a role below to see how each user interacts with the system.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoRoles.map((item) => (
              <Card
                key={item.role}
                className="relative overflow-hidden card-hover cursor-pointer group"
                onClick={() => handleDemoLogin(item.role)}
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`} />
                
                <CardHeader className="pb-2">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} mb-2 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {item.description}
                  </CardDescription>
                  <Button className="w-full mt-4" variant="outline">
                    Try as {item.label}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Ready to get started with your own hostel?
            </p>
            <Button asChild size="lg">
              <Link to="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
