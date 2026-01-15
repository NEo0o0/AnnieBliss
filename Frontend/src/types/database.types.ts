export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_settings: {
        Row: {
          key: string
          value: string
          updated_at: string
        }
        Insert: {
          key: string
          value: string
          updated_at?: string
        }
        Update: {
          key?: string
          value?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: number
          user_id: string
          class_id: number
          kind: Database['public']['Enums']['booking_kind']
          status: Database['public']['Enums']['booking_status']
          is_attended: boolean
          user_package_id: number | null
          payment_status: Database['public']['Enums']['payment_status']
          amount_due: number
          amount_paid: number
          paid_at: string | null
          payment_method: Database['public']['Enums']['payment_method'] | null
          payment_note: string | null
          created_at: string
          cancelled_at: string | null
          guest_name: string | null
          guest_contact: string | null
        }
        Insert: {
          id?: number
          user_id: string
          class_id: number
          kind?: Database['public']['Enums']['booking_kind']
          status?: Database['public']['Enums']['booking_status']
          is_attended?: boolean
          user_package_id?: number | null
          payment_status?: Database['public']['Enums']['payment_status']
          amount_due?: number
          amount_paid?: number
          paid_at?: string | null
          payment_method?: Database['public']['Enums']['payment_method'] | null
          payment_note?: string | null
          created_at?: string
          cancelled_at?: string | null
          guest_name?: string | null
          guest_contact?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          class_id?: number
          kind?: Database['public']['Enums']['booking_kind']
          status?: Database['public']['Enums']['booking_status']
          is_attended?: boolean
          user_package_id?: number | null
          payment_status?: Database['public']['Enums']['payment_status']
          amount_due?: number
          amount_paid?: number
          paid_at?: string | null
          payment_method?: Database['public']['Enums']['payment_method'] | null
          payment_note?: string | null
          created_at?: string
          cancelled_at?: string | null
          guest_name?: string | null
          guest_contact?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_package_id_fkey"
            columns: ["user_package_id"]
            isOneToOne: false
            referencedRelation: "user_packages"
            referencedColumns: ["id"]
          }
        ]
      }
      class_types: {
        Row: {
          id: number
          title: string
          description: string | null
          level: string | null
          duration_minutes: number | null
          default_price: number | null
          color_code: string | null
          created_at: string | null
        }
        Insert: {
          id?: never
          title: string
          description?: string | null
          level?: string | null
          duration_minutes?: number | null
          default_price?: number | null
          color_code?: string | null
          created_at?: string | null
        }
        Update: {
          id?: never
          title?: string
          description?: string | null
          level?: string | null
          duration_minutes?: number | null
          default_price?: number | null
          color_code?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      classes: {
        Row: {
          id: number
          title: string
          starts_at: string
          ends_at: string | null
          capacity: number
          booked_count: number
          location: string | null
          is_cancelled: boolean
          created_by: string | null
          instructor_id: string | null
          created_at: string
          description: string | null
          level: string | null
          category: string | null
          cover_image_url: string | null
          gallery_images: string[] | null
          price: number | null
          class_type_id: number | null
        }
        Insert: {
          id?: number
          title: string
          starts_at: string
          ends_at?: string | null
          capacity: number
          booked_count?: number
          location?: string | null
          is_cancelled?: boolean
          created_by?: string | null
          instructor_id?: string | null
          created_at?: string
          description?: string | null
          level?: string | null
          category?: string | null
          cover_image_url?: string | null
          gallery_images?: string[] | null
          price?: number | null
          class_type_id?: number | null
        }
        Update: {
          id?: number
          title?: string
          starts_at?: string
          ends_at?: string | null
          capacity?: number
          booked_count?: number
          location?: string | null
          is_cancelled?: boolean
          created_by?: string | null
          instructor_id?: string | null
          created_at?: string
          description?: string | null
          level?: string | null
          category?: string | null
          cover_image_url?: string | null
          gallery_images?: string[] | null
          price?: number | null
          class_type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_class_type_id_fkey"
            columns: ["class_type_id"]
            isOneToOne: false
            referencedRelation: "class_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      expenses: {
        Row: {
          id: number
          title: string
          amount: number
          category: string | null
          expense_date: string | null
          note: string | null
          created_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: never
          title: string
          amount: number
          category?: string | null
          expense_date?: string | null
          note?: string | null
          created_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: never
          title?: string
          amount?: number
          category?: string | null
          expense_date?: string | null
          note?: string | null
          created_by?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      kv_store_baa97425: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: number
          email: string
          created_at: string
        }
        Insert: {
          id?: never
          email: string
          created_at?: string
        }
        Update: {
          id?: never
          email?: string
          created_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          id: number
          name: string
          type: Database['public']['Enums']['package_type']
          credits: number | null
          duration_days: number
          price: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          type: Database['public']['Enums']['package_type']
          credits?: number | null
          duration_days: number
          price?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: Database['public']['Enums']['package_type']
          credits?: number | null
          duration_days?: number
          price?: number | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: number
          booking_id: number | null
          user_package_id: number | null
          user_id: string
          method: Database['public']['Enums']['payment_method']
          amount: number
          currency: string
          log_status: Database['public']['Enums']['payment_log_status']
          paid_at: string
          evidence_url: string | null
          note: string | null
          recorded_by: string | null
          created_at: string
        }
        Insert: {
          id?: number
          booking_id?: number | null
          user_package_id?: number | null
          user_id: string
          method: Database['public']['Enums']['payment_method']
          amount: number
          currency?: string
          log_status?: Database['public']['Enums']['payment_log_status']
          paid_at?: string
          evidence_url?: string | null
          note?: string | null
          recorded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          booking_id?: number | null
          user_package_id?: number | null
          user_id?: string
          method?: Database['public']['Enums']['payment_method']
          amount?: number
          currency?: string
          log_status?: Database['public']['Enums']['payment_log_status']
          paid_at?: string
          evidence_url?: string | null
          note?: string | null
          recorded_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_fk"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_package_fk"
            columns: ["user_package_id"]
            isOneToOne: false
            referencedRelation: "user_packages"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          role: Database['public']['Enums']['role_type']
          created_at: string
          bio: string | null
          avatar_url: string | null
          nationality: string | null
          contact_info: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          role?: Database['public']['Enums']['role_type']
          created_at?: string
          bio?: string | null
          avatar_url?: string | null
          nationality?: string | null
          contact_info?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          role?: Database['public']['Enums']['role_type']
          created_at?: string
          bio?: string | null
          avatar_url?: string | null
          nationality?: string | null
          contact_info?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_packages: {
        Row: {
          id: number
          user_id: string
          package_id: number
          credits_remaining: number | null
          start_at: string
          activated_at: string | null
          expire_at: string
          status: Database['public']['Enums']['user_package_status']
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          package_id: number
          credits_remaining?: number | null
          start_at?: string
          activated_at?: string | null
          expire_at: string
          status?: Database['public']['Enums']['user_package_status']
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          package_id?: number
          credits_remaining?: number | null
          start_at?: string
          activated_at?: string | null
          expire_at?: string
          status?: Database['public']['Enums']['user_package_status']
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_packages_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_packages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      book_dropin: {
        Args: {
          p_class_id: number
          p_amount_due: number
        }
        Returns: number
      }
      book_with_package: {
        Args: {
          p_class_id: number
        }
        Returns: number
      }
      admin_book_dropin: {
        Args: {
          p_user_id: string
          p_class_id: number
          p_amount_due: number
        }
        Returns: number
      }
      admin_book_package: {
        Args: {
          p_user_id: string
          p_class_id: number
        }
        Returns: number
      }
      cancel_booking: {
        Args: {
          p_booking_id: number
        }
        Returns: undefined
      }
      record_dropin_payment: {
        Args: {
          p_booking_id: number
          p_amount: number
          p_method: Database['public']['Enums']['payment_method']
          p_evidence_url: string | null
          p_note: string | null
        }
        Returns: number
      }
      get_dashboard_stats: {
        Args: Record<string, never>
        Returns: Json
      }
      get_monthly_financials: {
        Args: {
          year_input: number
          month_input: number
        }
        Returns: Json
      }
      get_monthly_report_stats: {
        Args: {
          target_year: number
          target_month: number
        }
        Returns: Json
      }
      get_yearly_report_stats: {
        Args: {
          target_year: number
        }
        Returns: Json
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      get_setting_bool: {
        Args: {
          key_name: string
        }
        Returns: boolean
      }
      get_setting_int: {
        Args: {
          key_name: string
        }
        Returns: number
      }
    }
    Enums: {
      booking_kind: 'package' | 'drop_in'
      booking_status: 'booked' | 'attended' | 'cancelled' | 'no_show'
      payment_log_status: 'recorded' | 'verified' | 'disputed'
      payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'promptpay'
      payment_status: 'unpaid' | 'partial' | 'paid'
      package_type: 'credits' | 'unlimited'
      role_type: 'member' | 'instructor' | 'admin'
      user_package_status: 'active' | 'expired' | 'suspended'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never
