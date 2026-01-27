export type UserRole = 'day_scholar' | 'hosteller' | 'visitor' | 'warden' | 'college_admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  collegeId?: string;
  hostelId?: string;
  roomNumber?: string;
  course?: string;
  branch?: string;
  year?: number;
  block?: string;
  status: 'active' | 'inactive';
  avatar?: string;
  phone?: string;
}

export interface College {
  id: string;
  name: string;
  code: string;
  address: string;
  logo?: string;
  status: 'active' | 'inactive';
}

export interface Hostel {
  id: string;
  name: string;
  collegeId: string;
  blocks: string[];
  totalRooms: number;
  capacity: number;
  wardenId?: string;
}

export interface MenuItem {
  id: string;
  hostelId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  items: string[];
  timing: string;
}

export interface Complaint {
  id: string;
  userId: string;
  hostelId: string;
  roomNumber: string;
  category: 'washroom' | 'room' | 'water' | 'electricity' | 'mess' | 'other';
  description: string;
  photo?: string;
  status: 'submitted' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface GatePass {
  id: string;
  userId: string;
  hostelId: string;
  purpose: string;
  outDate: string;
  outTime: string;
  expectedReturnDate: string;
  expectedReturnTime: string;
  actualReturnTime?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  wardenRemarks?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  hostelId: string;
  date: string;
  status: 'present' | 'absent' | 'on_leave' | 'late_entry';
  checkInTime?: string;
  markedBy: 'self' | 'warden';
}

export interface SportEquipment {
  id: string;
  hostelId: string;
  sport: string;
  itemName: string;
  totalQuantity: number;
  availableQuantity: number;
  status: 'available' | 'all_issued';
}

export interface EquipmentBooking {
  id: string;
  userId: string;
  equipmentId: string;
  issuedAt: string;
  returnDue: string;
  returnedAt?: string;
  status: 'reserved' | 'in_use' | 'returned' | 'overdue';
  penaltyAmount?: number;
  penaltyReason?: string;
}

export interface LaundrySlot {
  id: string;
  hostelId: string;
  machineNumber: number;
  date: string;
  startTime: string;
  endTime: string;
  bookedBy?: string;
  status: 'available' | 'booked' | 'in_use' | 'completed';
}

export interface VisitorRequest {
  id: string;
  visitorId: string;
  studentId: string;
  hostelId: string;
  visitDate: string;
  visitTime: string;
  purpose: string;
  studentApproval: 'pending' | 'approved' | 'rejected';
  wardenApproval: 'pending' | 'approved' | 'rejected';
  entryTime?: string;
  exitTime?: string;
  qrCode?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface DayScholarBooking {
  id: string;
  userId: string;
  hostelId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  ticketNumber: string;
  qrCode: string;
  paymentStatus: 'pending' | 'paid';
  amount: number;
  createdAt: string;
}
