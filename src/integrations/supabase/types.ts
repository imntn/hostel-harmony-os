export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      colleges: {
        Row: {
          address: string | null
          code: string
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          code: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          code?: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      complaints: {
        Row: {
          assigned_to: string | null
          category: Database["public"]["Enums"]["complaint_category"]
          created_at: string | null
          description: string
          hostel_id: string
          id: string
          photo_url: string | null
          resolution_notes: string | null
          room_number: string
          status: Database["public"]["Enums"]["complaint_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category: Database["public"]["Enums"]["complaint_category"]
          created_at?: string | null
          description: string
          hostel_id: string
          id?: string
          photo_url?: string | null
          resolution_notes?: string | null
          room_number: string
          status?: Database["public"]["Enums"]["complaint_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["complaint_category"]
          created_at?: string | null
          description?: string
          hostel_id?: string
          id?: string
          photo_url?: string | null
          resolution_notes?: string | null
          room_number?: string
          status?: Database["public"]["Enums"]["complaint_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          created_at: string | null
          hostel_id: string
          hostel_id_number: string | null
          id: string
          is_acknowledged: boolean | null
          message: string | null
          room_number: string
          user_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string | null
          hostel_id: string
          hostel_id_number?: string | null
          id?: string
          is_acknowledged?: boolean | null
          message?: string | null
          room_number: string
          user_id: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string | null
          hostel_id?: string
          hostel_id_number?: string | null
          id?: string
          is_acknowledged?: boolean | null
          message?: string | null
          room_number?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emergency_alerts_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_passes: {
        Row: {
          actual_return_time: string | null
          approved_by: string | null
          created_at: string | null
          expected_return_date: string
          expected_return_time: string
          hostel_id: string
          id: string
          is_late_return: boolean | null
          out_date: string
          out_time: string
          purpose: string
          status: Database["public"]["Enums"]["gate_pass_status"] | null
          updated_at: string | null
          user_id: string
          warden_remarks: string | null
        }
        Insert: {
          actual_return_time?: string | null
          approved_by?: string | null
          created_at?: string | null
          expected_return_date: string
          expected_return_time: string
          hostel_id: string
          id?: string
          is_late_return?: boolean | null
          out_date: string
          out_time: string
          purpose: string
          status?: Database["public"]["Enums"]["gate_pass_status"] | null
          updated_at?: string | null
          user_id: string
          warden_remarks?: string | null
        }
        Update: {
          actual_return_time?: string | null
          approved_by?: string | null
          created_at?: string | null
          expected_return_date?: string
          expected_return_time?: string
          hostel_id?: string
          id?: string
          is_late_return?: boolean | null
          out_date?: string
          out_time?: string
          purpose?: string
          status?: Database["public"]["Enums"]["gate_pass_status"] | null
          updated_at?: string | null
          user_id?: string
          warden_remarks?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gate_passes_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      hostels: {
        Row: {
          attendance_end_time: string | null
          attendance_start_time: string | null
          blocks: string[] | null
          capacity: number | null
          college_id: string
          created_at: string | null
          id: string
          name: string
          total_rooms: number | null
          updated_at: string | null
        }
        Insert: {
          attendance_end_time?: string | null
          attendance_start_time?: string | null
          blocks?: string[] | null
          capacity?: number | null
          college_id: string
          created_at?: string | null
          id?: string
          name: string
          total_rooms?: number | null
          updated_at?: string | null
        }
        Update: {
          attendance_end_time?: string | null
          attendance_start_time?: string | null
          blocks?: string[] | null
          capacity?: number | null
          college_id?: string
          created_at?: string | null
          id?: string
          name?: string
          total_rooms?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hostels_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      laundry_bookings: {
        Row: {
          created_at: string | null
          end_time: string
          hostel_id: string
          id: string
          machine_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          hostel_id: string
          id?: string
          machine_id: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          hostel_id?: string
          id?: string
          machine_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "laundry_bookings_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "laundry_bookings_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "laundry_machines"
            referencedColumns: ["id"]
          },
        ]
      }
      laundry_machines: {
        Row: {
          created_at: string | null
          hostel_id: string
          id: string
          machine_name: string | null
          machine_number: number
          status: string | null
        }
        Insert: {
          created_at?: string | null
          hostel_id: string
          id?: string
          machine_name?: string | null
          machine_number: number
          status?: string | null
        }
        Update: {
          created_at?: string | null
          hostel_id?: string
          id?: string
          machine_name?: string | null
          machine_number?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "laundry_machines_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      lost_found_items: {
        Row: {
          claimed_by: string | null
          created_at: string | null
          description: string | null
          hostel_id: string
          id: string
          item_name: string
          item_type: Database["public"]["Enums"]["lost_found_status"]
          location_found: string | null
          photo_url: string | null
          reported_by: string
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string | null
          verified_by: string | null
        }
        Insert: {
          claimed_by?: string | null
          created_at?: string | null
          description?: string | null
          hostel_id: string
          id?: string
          item_name: string
          item_type: Database["public"]["Enums"]["lost_found_status"]
          location_found?: string | null
          photo_url?: string | null
          reported_by: string
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
          verified_by?: string | null
        }
        Update: {
          claimed_by?: string | null
          created_at?: string | null
          description?: string | null
          hostel_id?: string
          id?: string
          item_name?: string
          item_type?: Database["public"]["Enums"]["lost_found_status"]
          location_found?: string | null
          photo_url?: string | null
          reported_by?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lost_found_items_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      night_attendance: {
        Row: {
          check_in_time: string | null
          created_at: string | null
          date: string
          hostel_id: string
          id: string
          marked_by: string | null
          notes: string | null
          status: Database["public"]["Enums"]["attendance_status"] | null
          updated_at: string | null
          user_id: string
          warden_id: string | null
        }
        Insert: {
          check_in_time?: string | null
          created_at?: string | null
          date?: string
          hostel_id: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"] | null
          updated_at?: string | null
          user_id: string
          warden_id?: string | null
        }
        Update: {
          check_in_time?: string | null
          created_at?: string | null
          date?: string
          hostel_id?: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"] | null
          updated_at?: string | null
          user_id?: string
          warden_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "night_attendance_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          block: string | null
          branch: string | null
          college_id: string | null
          course: string | null
          created_at: string | null
          email: string
          hostel_id: string | null
          hostel_id_number: string | null
          id: string
          name: string
          phone: string | null
          room_number: string | null
          status: string | null
          updated_at: string | null
          user_id: string
          year: number | null
        }
        Insert: {
          avatar_url?: string | null
          block?: string | null
          branch?: string | null
          college_id?: string | null
          course?: string | null
          created_at?: string | null
          email: string
          hostel_id?: string | null
          hostel_id_number?: string | null
          id?: string
          name: string
          phone?: string | null
          room_number?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
          year?: number | null
        }
        Update: {
          avatar_url?: string | null
          block?: string | null
          branch?: string | null
          college_id?: string | null
          course?: string | null
          created_at?: string | null
          email?: string
          hostel_id?: string | null
          hostel_id_number?: string | null
          id?: string
          name?: string
          phone?: string | null
          room_number?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      room_change_requests: {
        Row: {
          admin_notes: string | null
          approved_by: string | null
          created_at: string | null
          current_room: string
          hostel_id: string
          id: string
          reason: string
          requested_room: string
          status: Database["public"]["Enums"]["request_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          approved_by?: string | null
          created_at?: string | null
          current_room: string
          hostel_id: string
          id?: string
          reason: string
          requested_room: string
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          approved_by?: string | null
          created_at?: string | null
          current_room?: string
          hostel_id?: string
          id?: string
          reason?: string
          requested_room?: string
          status?: Database["public"]["Enums"]["request_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_change_requests_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          block: string | null
          capacity: number | null
          created_at: string | null
          current_occupancy: number | null
          hostel_id: string
          id: string
          room_number: string
          status: string | null
        }
        Insert: {
          block?: string | null
          capacity?: number | null
          created_at?: string | null
          current_occupancy?: number | null
          hostel_id: string
          id?: string
          room_number: string
          status?: string | null
        }
        Update: {
          block?: string | null
          capacity?: number | null
          created_at?: string | null
          current_occupancy?: number | null
          hostel_id?: string
          id?: string
          room_number?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      sports_bookings: {
        Row: {
          actual_return_time: string | null
          created_at: string | null
          end_time: string
          equipment_id: string
          hostel_id: string
          id: string
          notes: string | null
          penalty_amount: number | null
          penalty_reason: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_return_time?: string | null
          created_at?: string | null
          end_time: string
          equipment_id: string
          hostel_id: string
          id?: string
          notes?: string | null
          penalty_amount?: number | null
          penalty_reason?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_return_time?: string | null
          created_at?: string | null
          end_time?: string
          equipment_id?: string
          hostel_id?: string
          id?: string
          notes?: string | null
          penalty_amount?: number | null
          penalty_reason?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sports_bookings_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "sports_equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sports_bookings_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      sports_equipment: {
        Row: {
          available_quantity: number | null
          created_at: string | null
          description: string | null
          hostel_id: string
          id: string
          item_name: string
          max_booking_hours: number | null
          sport: string
          status: string | null
          total_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          available_quantity?: number | null
          created_at?: string | null
          description?: string | null
          hostel_id: string
          id?: string
          item_name: string
          max_booking_hours?: number | null
          sport: string
          status?: string | null
          total_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          available_quantity?: number | null
          created_at?: string | null
          description?: string | null
          hostel_id?: string
          id?: string
          item_name?: string
          max_booking_hours?: number | null
          sport?: string
          status?: string | null
          total_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sports_equipment_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      warden_assignments: {
        Row: {
          created_at: string | null
          hostel_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hostel_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          hostel_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warden_assignments_hostel_id_fkey"
            columns: ["hostel_id"]
            isOneToOne: false
            referencedRelation: "hostels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_laundry_booking_overlap: {
        Args: {
          _end_time: string
          _exclude_booking_id?: string
          _machine_id: string
          _start_time: string
        }
        Returns: boolean
      }
      check_sports_booking_overlap: {
        Args: {
          _end_time: string
          _equipment_id: string
          _exclude_booking_id?: string
          _start_time: string
        }
        Returns: boolean
      }
      get_user_hostel_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_warden_of_hostel: {
        Args: { _hostel_id: string; _user_id: string }
        Returns: boolean
      }
      is_within_attendance_window: {
        Args: { _hostel_id: string }
        Returns: boolean
      }
    }
    Enums: {
      attendance_status: "present" | "absent" | "on_leave" | "late_entry"
      booking_status:
        | "reserved"
        | "in_use"
        | "returned"
        | "overdue"
        | "cancelled"
      complaint_category:
        | "washroom"
        | "room"
        | "water"
        | "electricity"
        | "mess"
        | "other"
      complaint_status: "submitted" | "in_progress" | "resolved"
      gate_pass_status: "pending" | "approved" | "rejected" | "completed"
      lost_found_status: "lost" | "found" | "claimed" | "returned"
      request_status: "pending" | "approved" | "rejected"
      user_role:
        | "day_scholar"
        | "hosteller"
        | "visitor"
        | "warden"
        | "college_admin"
        | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_status: ["present", "absent", "on_leave", "late_entry"],
      booking_status: [
        "reserved",
        "in_use",
        "returned",
        "overdue",
        "cancelled",
      ],
      complaint_category: [
        "washroom",
        "room",
        "water",
        "electricity",
        "mess",
        "other",
      ],
      complaint_status: ["submitted", "in_progress", "resolved"],
      gate_pass_status: ["pending", "approved", "rejected", "completed"],
      lost_found_status: ["lost", "found", "claimed", "returned"],
      request_status: ["pending", "approved", "rejected"],
      user_role: [
        "day_scholar",
        "hosteller",
        "visitor",
        "warden",
        "college_admin",
        "super_admin",
      ],
    },
  },
} as const
