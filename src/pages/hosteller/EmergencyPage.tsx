import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTriggerEmergency } from '@/hooks/useEmergency';
import { AlertTriangle, Phone, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmergencyPage() {
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  
  const triggerEmergency = useTriggerEmergency();

  const hostelId = user?.hostelId || null;
  const roomNumber = user?.roomNumber || '';
  const hostelIdNumber = user?.hostelId || '';

  const handleEmergency = async () => {
    if (!user || !hostelId) return;

    await triggerEmergency.mutateAsync({
      user_id: user.id,
      hostel_id: hostelId,
      room_number: roomNumber,
      hostel_id_number: hostelIdNumber,
    });

    setShowConfirm(false);
    setAlertSent(true);
  };

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
          <h1 className="text-2xl font-bold">Emergency</h1>
          <p className="text-muted-foreground">Get help when you need it most</p>
        </div>
      </div>

      {alertSent ? (
        <Card className="bg-green-500/10 border-green-500">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-bold text-green-700 dark:text-green-400">
                Emergency Alert Sent!
              </h2>
              <p className="text-muted-foreground">
                Your alert has been sent to the warden and security team.
                Stay calm and wait for assistance.
              </p>
              <div className="bg-muted p-4 rounded-lg text-left">
                <p className="text-sm"><strong>Your Location:</strong></p>
                <p className="text-sm">Room: {roomNumber}</p>
                <p className="text-sm">Hostel ID: {hostelIdNumber}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setAlertSent(false)}
              >
                Back to Emergency Page
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Emergency Button */}
          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 bg-red-500/20 rounded-full animate-ping" />
                  </div>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="relative w-40 h-40 rounded-full text-xl font-bold shadow-lg hover:scale-105 transition-transform"
                    onClick={() => setShowConfirm(true)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle className="w-12 h-12" />
                      <span>SOS</span>
                    </div>
                  </Button>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                    Press for Emergency
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will alert the warden and security team immediately
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Contacts */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="w-4 h-4" />
                  Warden Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">+91 98765 43210</p>
                <p className="text-sm text-muted-foreground mt-1">Available 24/7</p>
                <Button variant="outline" className="mt-3 w-full" asChild>
                  <a href="tel:+919876543210">Call Now</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="w-4 h-4" />
                  Security Office
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">+91 87654 32109</p>
                <p className="text-sm text-muted-foreground mt-1">Campus Security</p>
                <Button variant="outline" className="mt-3 w-full" asChild>
                  <a href="tel:+918765432109">Call Now</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Safety Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Safety Guidelines</CardTitle>
              <CardDescription>What to do in an emergency</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-lg">🚨</span>
                  <span>Press the SOS button to alert security immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">📞</span>
                  <span>Call the warden or security if you can speak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">🚪</span>
                  <span>Know your nearest exit routes from your room</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">🧯</span>
                  <span>Locate fire extinguishers on your floor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">🤝</span>
                  <span>Stay calm and help others if safe to do so</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Confirm Emergency Alert
            </DialogTitle>
            <DialogDescription>
              This will immediately notify the warden and security team with your location.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p className="text-sm"><strong>Your Information:</strong></p>
            <p className="text-sm">Name: {user?.name}</p>
            <p className="text-sm">Room: {roomNumber}</p>
            <p className="text-sm">Hostel ID: {hostelIdNumber}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1"
              onClick={handleEmergency}
              disabled={triggerEmergency.isPending}
            >
              {triggerEmergency.isPending ? 'Sending...' : 'Send Alert'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
