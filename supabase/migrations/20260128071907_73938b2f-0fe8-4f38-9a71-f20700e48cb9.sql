-- =====================================================
-- HOSTELOS DATABASE SCHEMA - COMPLETE HOSTELLER FEATURES
-- =====================================================

-- 1. ENUMS
-- =====================================================
CREATE TYPE public.user_role AS ENUM ('day_scholar', 'hosteller', 'visitor', 'warden', 'college_admin', 'super_admin');
CREATE TYPE public.booking_status AS ENUM ('reserved', 'in_use', 'returned', 'overdue', 'cancelled');
CREATE TYPE public.complaint_status AS ENUM ('submitted', 'in_progress', 'resolved');
CREATE TYPE public.complaint_category AS ENUM ('washroom', 'room', 'water', 'electricity', 'mess', 'other');
CREATE TYPE public.gate_pass_status AS ENUM ('pending', 'approved', 'rejected', 'completed');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'on_leave', 'late_entry');
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.lost_found_status AS ENUM ('lost', 'found', 'claimed', 'returned');

-- 2. BASE TABLES
-- =====================================================

-- Colleges table
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  logo_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Hostels table
CREATE TABLE public.hostels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  blocks TEXT[] DEFAULT '{}',
  total_rooms INTEGER DEFAULT 0,
  capacity INTEGER DEFAULT 0,
  attendance_start_time TIME DEFAULT '21:00',
  attendance_end_time TIME DEFAULT '23:00',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  college_id UUID REFERENCES public.colleges(id),
  hostel_id UUID REFERENCES public.hostels(id),
  hostel_id_number TEXT, -- The unique hostel ID like "HOS-2024-0142"
  room_number TEXT,
  block TEXT,
  course TEXT,
  branch TEXT,
  year INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Warden hostel assignments
CREATE TABLE public.warden_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, hostel_id)
);

-- Rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  room_number TEXT NOT NULL,
  block TEXT,
  capacity INTEGER DEFAULT 2,
  current_occupancy INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'full', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (hostel_id, room_number)
);

-- 3. SPORTS EQUIPMENT & BOOKINGS
-- =====================================================

CREATE TABLE public.sports_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  sport TEXT NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  total_quantity INTEGER DEFAULT 1,
  available_quantity INTEGER DEFAULT 1,
  max_booking_hours INTEGER DEFAULT 6,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'all_issued', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.sports_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  equipment_id UUID REFERENCES public.sports_equipment(id) ON DELETE CASCADE NOT NULL,
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  actual_return_time TIMESTAMPTZ,
  status booking_status DEFAULT 'reserved',
  penalty_amount DECIMAL(10,2) DEFAULT 0,
  penalty_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_booking_time CHECK (end_time > start_time)
);

-- 4. LAUNDRY MACHINES & BOOKINGS
-- =====================================================

CREATE TABLE public.laundry_machines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  machine_number INTEGER NOT NULL,
  machine_name TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (hostel_id, machine_number)
);

CREATE TABLE public.laundry_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  machine_id UUID REFERENCES public.laundry_machines(id) ON DELETE CASCADE NOT NULL,
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status booking_status DEFAULT 'reserved',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_laundry_time CHECK (end_time > start_time)
);

-- 5. COMPLAINTS
-- =====================================================

CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  room_number TEXT NOT NULL,
  category complaint_category NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  status complaint_status DEFAULT 'submitted',
  assigned_to UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. GATE PASSES
-- =====================================================

CREATE TABLE public.gate_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  purpose TEXT NOT NULL,
  out_date DATE NOT NULL,
  out_time TIME NOT NULL,
  expected_return_date DATE NOT NULL,
  expected_return_time TIME NOT NULL,
  actual_return_time TIMESTAMPTZ,
  status gate_pass_status DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  warden_remarks TEXT,
  is_late_return BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. NIGHT ATTENDANCE
-- =====================================================

CREATE TABLE public.night_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in_time TIMESTAMPTZ,
  status attendance_status DEFAULT 'absent',
  marked_by TEXT DEFAULT 'self' CHECK (marked_by IN ('self', 'warden')),
  warden_id UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, date)
);

-- 8. ROOM CHANGE REQUESTS
-- =====================================================

CREATE TABLE public.room_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  current_room TEXT NOT NULL,
  requested_room TEXT NOT NULL,
  reason TEXT NOT NULL,
  status request_status DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. LOST AND FOUND
-- =====================================================

CREATE TABLE public.lost_found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  reported_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_type lost_found_status NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  location_found TEXT,
  claimed_by UUID REFERENCES auth.users(id),
  status request_status DEFAULT 'pending',
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. EMERGENCY ALERTS
-- =====================================================

CREATE TABLE public.emergency_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  room_number TEXT NOT NULL,
  hostel_id_number TEXT,
  message TEXT DEFAULT 'Emergency Alert',
  is_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 11. SECURITY DEFINER FUNCTIONS
-- =====================================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Get user's hostel_id from profile
CREATE OR REPLACE FUNCTION public.get_user_hostel_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT hostel_id FROM public.profiles WHERE user_id = _user_id
$$;

-- Check if user is warden of a specific hostel
CREATE OR REPLACE FUNCTION public.is_warden_of_hostel(_user_id UUID, _hostel_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.warden_assignments
    WHERE user_id = _user_id AND hostel_id = _hostel_id
  ) OR public.has_role(_user_id, 'college_admin') OR public.has_role(_user_id, 'super_admin')
$$;

-- Check for sports booking overlap
CREATE OR REPLACE FUNCTION public.check_sports_booking_overlap(_equipment_id UUID, _start_time TIMESTAMPTZ, _end_time TIMESTAMPTZ, _exclude_booking_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sports_bookings
    WHERE equipment_id = _equipment_id
      AND status IN ('reserved', 'in_use')
      AND (_exclude_booking_id IS NULL OR id != _exclude_booking_id)
      AND (start_time, end_time) OVERLAPS (_start_time, _end_time)
  )
$$;

-- Check for laundry booking overlap
CREATE OR REPLACE FUNCTION public.check_laundry_booking_overlap(_machine_id UUID, _start_time TIMESTAMPTZ, _end_time TIMESTAMPTZ, _exclude_booking_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.laundry_bookings
    WHERE machine_id = _machine_id
      AND status IN ('reserved', 'in_use')
      AND (_exclude_booking_id IS NULL OR id != _exclude_booking_id)
      AND (start_time, end_time) OVERLAPS (_start_time, _end_time)
  )
$$;

-- Check if within attendance window
CREATE OR REPLACE FUNCTION public.is_within_attendance_window(_hostel_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.hostels
    WHERE id = _hostel_id
      AND CURRENT_TIME BETWEEN attendance_start_time AND attendance_end_time
  )
$$;

-- =====================================================
-- 12. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warden_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laundry_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laundry_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.night_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 13. RLS POLICIES
-- =====================================================

-- COLLEGES POLICIES
CREATE POLICY "Anyone can view colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Admins can manage colleges" ON public.colleges FOR ALL 
  USING (public.has_role(auth.uid(), 'super_admin'));

-- HOSTELS POLICIES
CREATE POLICY "Users can view their hostel" ON public.hostels FOR SELECT 
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'college_admin') OR
    public.is_warden_of_hostel(auth.uid(), id) OR
    public.get_user_hostel_id(auth.uid()) = id
  );

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT 
  USING (user_id = auth.uid());
CREATE POLICY "Wardens can view hostel profiles" ON public.profiles FOR SELECT 
  USING (public.is_warden_of_hostel(auth.uid(), hostel_id));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE 
  USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- USER ROLES POLICIES
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT 
  USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL 
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'college_admin'));

-- WARDEN ASSIGNMENTS POLICIES
CREATE POLICY "View warden assignments" ON public.warden_assignments FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'college_admin')
  );

-- ROOMS POLICIES
CREATE POLICY "View hostel rooms" ON public.rooms FOR SELECT 
  USING (
    public.get_user_hostel_id(auth.uid()) = hostel_id OR
    public.is_warden_of_hostel(auth.uid(), hostel_id)
  );

-- SPORTS EQUIPMENT POLICIES
CREATE POLICY "View hostel sports equipment" ON public.sports_equipment FOR SELECT 
  USING (
    public.get_user_hostel_id(auth.uid()) = hostel_id OR
    public.is_warden_of_hostel(auth.uid(), hostel_id)
  );

-- SPORTS BOOKINGS POLICIES
CREATE POLICY "Hostellers can view own bookings" ON public.sports_bookings FOR SELECT 
  USING (user_id = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));
CREATE POLICY "Hostellers can create bookings" ON public.sports_bookings FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND 
    public.get_user_hostel_id(auth.uid()) = hostel_id AND
    public.has_role(auth.uid(), 'hosteller')
  );
CREATE POLICY "Hostellers can update own bookings" ON public.sports_bookings FOR UPDATE 
  USING (user_id = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));

-- LAUNDRY MACHINES POLICIES
CREATE POLICY "View hostel laundry machines" ON public.laundry_machines FOR SELECT 
  USING (
    public.get_user_hostel_id(auth.uid()) = hostel_id OR
    public.is_warden_of_hostel(auth.uid(), hostel_id)
  );

-- LAUNDRY BOOKINGS POLICIES
CREATE POLICY "Hostellers can view own laundry bookings" ON public.laundry_bookings FOR SELECT 
  USING (user_id = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));
CREATE POLICY "Hostellers can create laundry bookings" ON public.laundry_bookings FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND 
    public.get_user_hostel_id(auth.uid()) = hostel_id AND
    public.has_role(auth.uid(), 'hosteller')
  );
CREATE POLICY "Hostellers can update own laundry bookings" ON public.laundry_bookings FOR UPDATE 
  USING (user_id = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));

-- COMPLAINTS POLICIES
CREATE POLICY "View own complaints" ON public.complaints FOR SELECT 
  USING (user_id = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));
CREATE POLICY "Hostellers can create complaints" ON public.complaints FOR INSERT 
  WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(), 'hosteller'));
CREATE POLICY "Update complaints" ON public.complaints FOR UPDATE 
  USING (user_id = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));

-- GATE PASSES POLICIES
CREATE POLICY "View own gate passes" ON public.gate_passes FOR SELECT 
  USING (user_id = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));
CREATE POLICY "Hostellers can create gate passes" ON public.gate_passes FOR INSERT 
  WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(), 'hosteller'));
CREATE POLICY "Update gate passes" ON public.gate_passes FOR UPDATE 
  USING (user_id = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));

-- NIGHT ATTENDANCE POLICIES
CREATE POLICY "View own attendance" ON public.night_attendance FOR SELECT 
  USING (user_id = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));
CREATE POLICY "Hostellers can mark attendance" ON public.night_attendance FOR INSERT 
  WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(), 'hosteller'));
CREATE POLICY "Update attendance" ON public.night_attendance FOR UPDATE 
  USING (user_id = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));

-- ROOM CHANGE REQUESTS POLICIES
CREATE POLICY "View own room requests" ON public.room_change_requests FOR SELECT 
  USING (user_id = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));
CREATE POLICY "Hostellers can create room requests" ON public.room_change_requests FOR INSERT 
  WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(), 'hosteller'));
CREATE POLICY "Update room requests" ON public.room_change_requests FOR UPDATE 
  USING (public.is_warden_of_hostel(auth.uid(), hostel_id));

-- LOST AND FOUND POLICIES
CREATE POLICY "View hostel lost items" ON public.lost_found_items FOR SELECT 
  USING (
    public.get_user_hostel_id(auth.uid()) = hostel_id OR
    public.is_warden_of_hostel(auth.uid(), hostel_id)
  );
CREATE POLICY "Users can report lost items" ON public.lost_found_items FOR INSERT 
  WITH CHECK (reported_by = auth.uid());
CREATE POLICY "Update lost items" ON public.lost_found_items FOR UPDATE 
  USING (reported_by = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));

-- EMERGENCY ALERTS POLICIES
CREATE POLICY "Hostellers can create alerts" ON public.emergency_alerts FOR INSERT 
  WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(), 'hosteller'));
CREATE POLICY "Wardens can view alerts" ON public.emergency_alerts FOR SELECT 
  USING (user_id = auth.uid() OR public.is_warden_of_hostel(auth.uid(), hostel_id));
CREATE POLICY "Wardens can update alerts" ON public.emergency_alerts FOR UPDATE 
  USING (public.is_warden_of_hostel(auth.uid(), hostel_id));

-- =====================================================
-- 14. STORAGE BUCKET FOR COMPLAINTS/LOST FOUND PHOTOS
-- =====================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('hostel-uploads', 'hostel-uploads', true);

CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'hostel-uploads' AND auth.role() = 'authenticated');
CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT 
  USING (bucket_id = 'hostel-uploads');

-- =====================================================
-- 15. TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON public.colleges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hostels_updated_at BEFORE UPDATE ON public.hostels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sports_equipment_updated_at BEFORE UPDATE ON public.sports_equipment FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sports_bookings_updated_at BEFORE UPDATE ON public.sports_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_laundry_bookings_updated_at BEFORE UPDATE ON public.laundry_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gate_passes_updated_at BEFORE UPDATE ON public.gate_passes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_night_attendance_updated_at BEFORE UPDATE ON public.night_attendance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_room_change_requests_updated_at BEFORE UPDATE ON public.room_change_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lost_found_items_updated_at BEFORE UPDATE ON public.lost_found_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();