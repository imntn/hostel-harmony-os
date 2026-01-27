import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building2,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Settings,
  User,
  ChevronDown,
} from 'lucide-react';
import { getNavItems } from '@/lib/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const navItems = getNavItems(user.role);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 bg-sidebar transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sidebar-primary">
              <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            {sidebarOpen && <span className="text-lg font-bold text-sidebar-foreground">HostelOS</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-90' : '-rotate-90'}`} />
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar">
            <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sidebar-primary">
                  <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-sidebar-foreground">HostelOS</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-sidebar-foreground" />
              </button>
            </div>
            <nav className="py-4 px-3">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={`nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 lg:px-6 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 hover:bg-accent rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-40 lg:w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
