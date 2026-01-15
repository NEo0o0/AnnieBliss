 "use client";

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import type { Tables, TablesInsert, TablesUpdate, Enums } from '../types/database.types';

type Booking = Tables<'bookings'>;
type BookingInsert = TablesInsert<'bookings'>;
type BookingUpdate = TablesUpdate<'bookings'>;
type BookingStatus = Enums<'booking_status'>;

interface UseBookingsOptions {
  userId?: string;
  classId?: number;
  status?: BookingStatus;
  autoFetch?: boolean;
}

export function useBookings(options: UseBookingsOptions = {}) {
  const { userId, classId, status, autoFetch = true } = options;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('bookings')
        .select('*, classes(*), user_packages(*), profiles(*)')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (classId) {
        query = query.eq('class_id', classId);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setBookings(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
  }, [userId, classId, status, autoFetch]);

  const createBooking = async (bookingData: BookingInsert) => {
    try {
      setLoading(true);
      
      let data, error;
      
      // ✅ แก้ไข: เช็คประเภทการจอง และเรียก RPC ให้ถูกตัว
      if (bookingData.kind === 'package') {
        // กรณีใช้แพ็กเกจ
        console.log('📦 Booking via Package Payload:', { 
           p_class_id: bookingData.class_id 
        });
        
        const res = await supabase.rpc('book_with_package', {
          p_class_id: Number(bookingData.class_id) // แปลงเป็นตัวเลขให้ชัวร์
        });
        data = res.data;
        error = res.error;
        
      } else {
        // กรณีจ่ายรายครั้ง (Drop-in)
        const payload = { 
          p_class_id: Number(bookingData.class_id), 
          p_amount_due: Number(bookingData.amount_due || 0) 
        };
        console.log('💵 Booking Drop-in Payload:', payload);
        
        const res = await supabase.rpc('book_dropin', payload);
        data = res.data;
        error = res.error;
      }

      if (error) throw error;

      // โหลดข้อมูลใหม่หลังจองสำเร็จ
      await fetchBookings();
      
      return { data, error: null };
    } catch (err) {
      console.error('Booking failed:', err);
      return { data: null, error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  const updateBooking = async (id: number, updates: BookingUpdate) => {
    try {
      const { data, error: updateError } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select('*, classes(*), user_packages(*)')
        .single();

      if (updateError) throw updateError;

      setBookings(prev => prev.map(b => (b.id === id ? data : b)));
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const cancelBooking = async (id: number) => {
    try {
      // Use cancel_booking RPC which handles credit refunds automatically
      const { error: rpcError } = await supabase.rpc('cancel_booking', {
        p_booking_id: id,
      });

      if (rpcError) throw rpcError;

      // Fetch the updated booking with relations
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select('*, classes(*), user_packages(*)')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      setBookings(prev => prev.map(b => (b.id === id ? data : b)));
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const markAsAttended = async (id: number) => {
    return updateBooking(id, { status: 'attended' });
  };

  const markAsNoShow = async (id: number) => {
    return updateBooking(id, { status: 'no_show' });
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking,
    markAsAttended,
    markAsNoShow,
  };
}
