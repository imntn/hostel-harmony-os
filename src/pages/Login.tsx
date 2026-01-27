import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, setDemoUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: 'day_scholar' | 'hosteller' | 'visitor' | 'warden' | 'college_admin' | 'super_admin') => {
    setDemoUser(role);
    toast({
      title: "Demo Mode",
      description: `Logged in as ${role.replace('_', ' ')}`,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
              <Building2 className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold">HostelOS</span>
          </Link>
          
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Smart Hostel Management
          </h1>
          <p className="text-lg text-white/80 mb-8">
            One platform for all your hostel needs. Sign in to access your personalized dashboard.
          </p>
          
          <div className="space-y-4">
            {[
              'Role-based access for everyone',
              'Real-time notifications',
              'Secure & scalable platform',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span className="text-white/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="p-2 rounded-lg bg-primary">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">HostelOS</span>
          </Link>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="demo">Demo Access</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email / Mobile / ID</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="text"
                          placeholder="Enter your email or ID"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>

                  <p className="text-center text-sm text-muted-foreground mt-6">
                    New to HostelOS?{' '}
                    <Link to="/register" className="text-primary hover:underline font-medium">
                      Contact your admin
                    </Link>
                  </p>
                </TabsContent>

                <TabsContent value="demo">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Try the platform with demo accounts
                    </p>
                    
                    {[
                      { role: 'day_scholar' as const, label: 'Day Scholar', icon: User, color: 'bg-orange-500' },
                      { role: 'hosteller' as const, label: 'Hosteller', icon: User, color: 'bg-blue-500' },
                      { role: 'visitor' as const, label: 'Visitor', icon: User, color: 'bg-green-500' },
                      { role: 'warden' as const, label: 'Warden', icon: User, color: 'bg-purple-500' },
                      { role: 'college_admin' as const, label: 'College Admin', icon: User, color: 'bg-pink-500' },
                      { role: 'super_admin' as const, label: 'Super Admin', icon: User, color: 'bg-slate-500' },
                    ].map((item) => (
                      <Button
                        key={item.role}
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => handleDemoLogin(item.role)}
                      >
                        <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <span>Login as {item.label}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
