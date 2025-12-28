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
      const { data, error: createError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select('*, classes(*), user_packages(*)')
        .single();

      if (createError) throw createError;

      if (bookingData.kind === 'package' && bookingData.user_package_id) {
        const { error: updateError } = await supabase.rpc('decrement_package_credits', {
          package_id: bookingData.user_package_id,
        });

        if (updateError) {
          console.error('Error decrementing package credits:', updateError);
        }
      }

      setBookings(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
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
      const booking = bookings.find(b => b.id === id);
      
      const { data, error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*, classes(*), user_packages(*)')
        .single();

      if (updateError) throw updateError;

      if (booking?.kind === 'package' && booking.user_package_id) {
        const { error: refundError } = await supabase.rpc('increment_package_credits', {
          package_id: booking.user_package_id,
        });

        if (refundError) {
          console.error('Error refunding package credits:', refundError);
        }
      }

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
