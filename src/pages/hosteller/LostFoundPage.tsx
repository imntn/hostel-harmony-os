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
import { useLostFoundItems, useMyLostItems, useReportLostItem, useClaimItem, uploadLostFoundPhoto, LostFoundItem, LostFoundType } from '@/hooks/useLostFound';
import { Search, Clock, Plus, ArrowLeft, Upload, Package } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const typeLabels: Record<LostFoundType, string> = {
  lost: '🔴 Lost',
  found: '🟢 Found',
  claimed: '🟡 Claimed',
  returned: '✅ Returned',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
};

export default function LostFoundPage() {
  const { user } = useAuth();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [itemType, setItemType] = useState<'lost' | 'found'>('lost');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const hostelId = user?.hostelId || null;
  
  const { data: allItems = [], isLoading } = useLostFoundItems(hostelId);
  const { data: myItems = [] } = useMyLostItems(user?.id || null);
  const reportItem = useReportLostItem();
  const claimItem = useClaimItem();

  const lostItems = allItems.filter(i => i.item_type === 'lost');
  const foundItems = allItems.filter(i => i.item_type === 'found');

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
    if (!itemName || !user || !hostelId) return;

    setIsUploading(true);
    try {
      let photoUrl: string | undefined;
      
      if (photoFile) {
        photoUrl = await uploadLostFoundPhoto(photoFile, user.id);
      }

      await reportItem.mutateAsync({
        hostel_id: hostelId,
        reported_by: user.id,
        item_type: itemType,
        item_name: itemName,
        description,
        photo_url: photoUrl,
        location_found: location,
      });

      setIsReportOpen(false);
      setItemName('');
      setDescription('');
      setLocation('');
      setPhotoFile(null);
      setPhotoPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClaim = async (itemId: string) => {
    if (!user) return;
    await claimItem.mutateAsync({ itemId, userId: user.id });
  };

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
            <h1 className="text-2xl font-bold">Lost & Found</h1>
            <p className="text-muted-foreground">Report lost items or claim found items</p>
          </div>
        </div>
        <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Report Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Report Lost/Found Item</DialogTitle>
              <DialogDescription>
                Help reunite items with their owners.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Item Type</Label>
                <Select value={itemType} onValueChange={(v) => setItemType(v as 'lost' | 'found')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost">🔴 I Lost Something</SelectItem>
                    <SelectItem value="found">🟢 I Found Something</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  placeholder="e.g., Blue Umbrella, ID Card"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Provide details to help identify the item..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Location {itemType === 'found' ? 'Found' : 'Last Seen'}</Label>
                <Input
                  placeholder="e.g., Common Room, Mess Hall"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
                disabled={!itemName || reportItem.isPending || isUploading}
              >
                {isUploading ? 'Uploading...' : reportItem.isPending ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="lost" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lost" className="gap-2">
            🔴 Lost Items ({lostItems.length})
          </TabsTrigger>
          <TabsTrigger value="found" className="gap-2">
            🟢 Found Items ({foundItems.length})
          </TabsTrigger>
          <TabsTrigger value="my-reports" className="gap-2">
            <Package className="w-4 h-4" />
            My Reports ({myItems.length})
          </TabsTrigger>
        </TabsList>

        {/* Lost Items Tab */}
        <TabsContent value="lost" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : lostItems.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No lost items reported. That's good!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {lostItems.map((item) => (
                <ItemCard key={item.id} item={item} onClaim={handleClaim} userId={user?.id} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Found Items Tab */}
        <TabsContent value="found" className="space-y-4">
          {foundItems.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No found items reported yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {foundItems.map((item) => (
                <ItemCard key={item.id} item={item} onClaim={handleClaim} userId={user?.id} showClaim />
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Reports Tab */}
        <TabsContent value="my-reports" className="space-y-4">
          {myItems.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>You haven't reported any items yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {myItems.map((item) => (
                <ItemCard key={item.id} item={item} onClaim={handleClaim} userId={user?.id} isOwn />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ItemCard({ 
  item, 
  onClaim, 
  userId, 
  showClaim = false,
  isOwn = false 
}: { 
  item: LostFoundItem; 
  onClaim: (id: string) => void;
  userId?: string;
  showClaim?: boolean;
  isOwn?: boolean;
}) {
  const canClaim = showClaim && !item.claimed_by && item.reported_by !== userId;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          {item.photo_url ? (
            <img 
              src={item.photo_url} 
              alt={item.item_name}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ) : (
            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{item.item_name}</h4>
                <Badge variant="outline" className="text-xs mt-1">
                  {typeLabels[item.item_type]}
                </Badge>
              </div>
              {item.status !== 'pending' && (
                <Badge className={statusColors[item.status]}>
                  {item.status}
                </Badge>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
            )}
            {item.location_found && (
              <p className="text-xs text-muted-foreground mt-1">
                📍 {item.location_found}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(item.created_at), 'MMM d, yyyy')}
            </p>
            {canClaim && (
              <Button 
                size="sm" 
                className="mt-3"
                onClick={() => onClaim(item.id)}
              >
                Claim This Item
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
