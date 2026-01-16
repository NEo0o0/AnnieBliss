"use client";

import { useState, useEffect } from 'react';
import { Camera, CheckCircle, Clock, AlertCircle, Filter } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { useBookings } from '@/hooks/useBookings';
import { PaymentSlipViewer } from './PaymentSlipViewer';
import { toast } from 'sonner';

type BookingWithDetails = {
  id: number;
  class_id: number;
  user_id: string | null;
  guest_name: string | null;
  payment_status: string;
  payment_method: string | null;
  payment_slip_url: string | null;
  payment_note: string | null;
  amount_due: number;
  amount_paid: number;
  created_at: string;
  classes: {
    title: string;
    starts_at: string;
  } | null;
  profiles: {
    full_name: string | null;
  } | null;
};

type FilterType = 'all' | 'pending_verification' | 'unpaid' | 'paid';

export function AdminSlipVerification() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('pending_verification');
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const { verifyPayment } = useBookings({ autoFetch: false });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('bookings')
        .select('*, classes(title, starts_at), profiles(full_name)')
        .eq('status', 'booked')
        .order('created_at', { ascending: false });

      if (filter === 'pending_verification') {
        query = query.eq('payment_status', 'pending_verification');
      } else if (filter === 'unpaid') {
        query = query.eq('payment_status', 'unpaid');
      } else if (filter === 'paid') {
        query = query.eq('payment_status', 'paid');
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const handleApprovePayment = async (bookingId: number) => {
    const result = await verifyPayment(bookingId);
    
    if (result.error) {
      toast.error('Failed to approve payment');
    } else {
      toast.success('Payment verified successfully! ✓');
      fetchBookings();
    }
  };

  const getPaymentBadge = (booking: BookingWithDetails) => {
    if (booking.payment_status === 'paid') {
      return {
        label: 'Paid',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle size={14} />
      };
    }
    if (booking.payment_status === 'pending_verification') {
      return {
        label: 'Pending Verification',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Clock size={14} />
      };
    }
    if (booking.payment_status === 'unpaid') {
      return {
        label: 'Unpaid',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: <AlertCircle size={14} />
      };
    }
    return {
      label: 'Unknown',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: <Clock size={14} />
    };
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'pending_verification') return b.payment_status === 'pending_verification';
    if (filter === 'unpaid') return b.payment_status === 'unpaid';
    if (filter === 'paid') return b.payment_status === 'paid';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-earth-dark)]">
            Payment Verification
          </h2>
          <p className="text-sm text-[var(--color-stone)] mt-1">
            Review and approve payment slips
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={20} className="text-[var(--color-stone)]" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-4 py-2 border border-[var(--color-sand)] rounded-lg focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
          >
            <option value="all">All Bookings</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-sage)]"></div>
          <p className="text-[var(--color-stone)] mt-4">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-[var(--color-cream)]/40 rounded-lg border border-[var(--color-sand)]">
          <p className="text-[var(--color-stone)]">
            {filter === 'pending_verification' 
              ? 'No payments pending verification'
              : 'No bookings found'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => {
            const badge = getPaymentBadge(booking);
            const userName = booking.profiles?.full_name || booking.guest_name || 'Unknown';
            const className = booking.classes?.title || 'Unknown Class';

            return (
              <div
                key={booking.id}
                className="p-4 bg-white border border-[var(--color-sand)] rounded-lg hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[var(--color-earth-dark)]">
                        {className}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${badge.color}`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-[var(--color-stone)]">
                      <div>
                        <span className="font-medium">Student:</span> {userName}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ฿{booking.amount_due.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Method:</span>{' '}
                        {booking.payment_method === 'bank_transfer' ? 'Bank Transfer' :
                         booking.payment_method === 'promptpay' ? 'PromptPay' :
                         booking.payment_method || 'N/A'}
                      </div>
                    </div>
                    {booking.payment_note && (
                      <div className="mt-2 text-xs text-[var(--color-stone)]">
                        <span className="font-medium">Note:</span> {booking.payment_note}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {booking.payment_slip_url && (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white rounded-lg transition-colors text-sm"
                      >
                        <Camera size={16} />
                        View Slip
                      </button>
                    )}
                    {!booking.payment_slip_url && booking.payment_status !== 'paid' && (
                      <span className="text-xs text-[var(--color-stone)] italic">
                        No slip uploaded
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slip Viewer Modal */}
      {selectedBooking && selectedBooking.payment_slip_url && (
        <PaymentSlipViewer
          slipUrl={selectedBooking.payment_slip_url}
          bookingId={selectedBooking.id}
          bookingDetails={{
            className: selectedBooking.classes?.title || 'Unknown Class',
            userName: selectedBooking.profiles?.full_name || selectedBooking.guest_name || 'Unknown',
            amount: selectedBooking.amount_due,
            paymentMethod: selectedBooking.payment_method || 'Unknown',
            paymentNote: selectedBooking.payment_note || undefined
          }}
          onApprove={handleApprovePayment}
          onClose={() => setSelectedBooking(null)}
          isAdmin={true}
        />
      )}
    </div>
  );
}
