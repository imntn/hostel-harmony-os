import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground py-16">
      <div className="container px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">HostelOS</span>
            </div>
            <p className="text-sidebar-foreground/70 text-sm">
              Transform hostel management with our comprehensive, scalable platform trusted by 100+ colleges.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link to="/features" className="hover:text-sidebar-foreground transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-sidebar-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/demo" className="hover:text-sidebar-foreground transition-colors">Demo</Link></li>
              <li><Link to="/docs" className="hover:text-sidebar-foreground transition-colors">Documentation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link to="/about" className="hover:text-sidebar-foreground transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-sidebar-foreground transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-sidebar-foreground transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-sidebar-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-sidebar-foreground/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                support@hostelos.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Bangalore, Karnataka, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-sidebar-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-sidebar-foreground/60">
          <p>© 2024 HostelOS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-sidebar-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-sidebar-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
