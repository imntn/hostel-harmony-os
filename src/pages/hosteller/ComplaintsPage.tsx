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
import { useComplaints, useCreateComplaint, uploadComplaintPhoto, ComplaintCategory, Complaint } from '@/hooks/useComplaints';
import { MessageSquareWarning, Clock, Plus, CheckCircle2, ArrowLeft, Upload, Image } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const categoryLabels: Record<ComplaintCategory, string> = {
  washroom: '🚿 Washroom',
  room: '🏠 Room',
  water: '💧 Water',
  electricity: '⚡ Electricity',
  mess: '🍽️ Mess',
  other: '📝 Other',
};

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-500',
  in_progress: 'bg-amber-500',
  resolved: 'bg-green-500',
};

export default function ComplaintsPage() {
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [category, setCategory] = useState<ComplaintCategory | ''>('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const hostelId = user?.hostelId || null;
  const roomNumber = user?.roomNumber || '';
  
  const { data: complaints = [], isLoading } = useComplaints(user?.id || null);
  const createComplaint = useCreateComplaint();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!category || !description || !user || !hostelId) return;

    setIsUploading(true);
    try {
      let photoUrl: string | undefined;
      
      if (photoFile) {
        photoUrl = await uploadComplaintPhoto(photoFile, user.id);
      }

      await createComplaint.mutateAsync({
        user_id: user.id,
        hostel_id: hostelId,
        room_number: roomNumber,
        category: category as ComplaintCategory,
        description,
        photo_url: photoUrl,
      });

      setIsCreateOpen(false);
      setCategory('');
      setDescription('');
      setPhotoFile(null);
      setPhotoPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const activeComplaints = complaints.filter(c => c.status !== 'resolved');
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Complaints</h1>
            <p className="text-muted-foreground">Report issues and track resolution</p>
          </div>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Report a Complaint</DialogTitle>
              <DialogDescription>
                Describe your issue and we'll address it as soon as possible.
                Room: {roomNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as ComplaintCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Photo (optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  {photoPreview ? (
                    <div className="relative">
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="max-h-40 mx-auto rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setPhotoFile(null);
                          setPhotoPreview(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <span className="text-sm">Click to upload photo</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={handleSubmit}
                disabled={!category || !description || createComplaint.isPending || isUploading}
              >
                {isUploading ? 'Uploading...' : createComplaint.isPending ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            <MessageSquareWarning className="w-4 h-4" />
            Active ({activeComplaints.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Resolved ({resolvedComplaints.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Complaints */}
        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading complaints...</div>
          ) : activeComplaints.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active complaints. Everything looks good!</p>
              </CardContent>
            </Card>
          ) : (
            activeComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          )}
        </TabsContent>

        {/* Resolved Complaints */}
        <TabsContent value="resolved" className="space-y-4">
          {resolvedComplaints.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No resolved complaints yet.</p>
              </CardContent>
            </Card>
          ) : (
            resolvedComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ComplaintCard({ complaint }: { complaint: Complaint }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">
                {categoryLabels[complaint.category]}
              </Badge>
              <Badge className={statusColors[complaint.status]}>
                {complaint.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-sm mb-2">{complaint.description}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {format(new Date(complaint.created_at), 'MMM d, yyyy • h:mm a')}
              <span className="mx-1">•</span>
              Room {complaint.room_number}
            </p>
            {complaint.resolution_notes && (
              <div className="mt-3 p-3 bg-green-500/10 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">
                  <strong>Resolution:</strong> {complaint.resolution_notes}
                </p>
              </div>
            )}
          </div>
          {complaint.photo_url && (
            <img 
              src={complaint.photo_url} 
              alt="Complaint" 
              className="w-20 h-20 object-cover rounded-lg"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
