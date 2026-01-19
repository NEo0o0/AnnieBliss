"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Calendar, User, DollarSign, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface Booking {
  id: number;
  user_id: string | null;
  class_id: number;
  payment_method: string | null;
  payment_status: string | null;
  payment_slip_url: string | null;
  payment_note: string | null;
  amount_due: number;
  created_at: string;
  guest_name: string | null;
  guest_contact: string | null;
  classes: {
    id: number;
    title: string | null;
    starts_at: string;
    price: number | null;
  } | null;
  profiles?: {
    id: string;
    full_name: string | null;
    phone: string | null;
  } | null;
}

export function VerifySlipsSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [unpaidGuestBookings, setUnpaidGuestBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [paidAmount, setPaidAmount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        // Fetch bookings with partial payment status (awaiting verification)
        const { data: pendingBookings, error } = await supabase
          .from('bookings')
          .select(`
            *,
            classes (
              id,
              title,
              starts_at,
              price
            ),
            profiles (
              id,
              full_name,
              phone
            )
          `)
          .filter('payment_status', 'eq', 'partial')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setBookings(pendingBookings || []);

        // Fetch unpaid guest bookings (no slip uploaded)
        const { data: unpaidGuests, error: unpaidError } = await supabase
          .from('bookings')
          .select(`
            *,
            classes (
              id,
              title,
              starts_at,
              price
            )
          `)
          .eq('payment_status', 'unpaid')
          .not('guest_name', 'is', null)
          .neq('status', 'cancelled')
          .order('created_at', { ascending: false });

        if (unpaidError) throw unpaidError;

        setUnpaidGuestBookings(unpaidGuests || []);
      } catch (error: any) {
        console.error('Error fetching pending bookings:', error);
        toast.error(error.message || 'Failed to load pending bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update paidAmount when selectedBooking changes
  useEffect(() => {
    if (selectedBooking) {
      setPaidAmount(selectedBooking.amount_due);
    }
  }, [selectedBooking]);

  const handleApprove = async (bookingId: number) => {
    setProcessing(bookingId);
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) throw new Error('Booking not found');

      // Determine payment status based on amount paid vs amount due
      const paymentStatus = paidAmount >= booking.amount_due ? 'paid' : 'partial';

      const { error } = await supabase
        .from('bookings')
        .update({
          amount_paid: paidAmount,
          payment_status: paymentStatus,
          status: 'booked',
          paid_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      if (paymentStatus === 'paid') {
        toast.success('Payment approved as fully paid!');
      } else {
        toast.success(`Partial payment approved (฿${paidAmount} of ฿${booking.amount_due})`);
      }
      
      // Remove from list
      setBookings(bookings.filter(b => b.id !== bookingId));
      setSelectedBooking(null);
    } catch (error: any) {
      console.error('Error approving payment:', error);
      toast.error(error.message || 'Failed to approve payment');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (bookingId: number) => {
    setProcessing(bookingId);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'unpaid',
          payment_slip_url: null,
          paid_at: null
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Payment rejected. User can re-upload slip.');
      
      // Remove from list
      setBookings(bookings.filter(b => b.id !== bookingId));
      setSelectedBooking(null);
    } catch (error: any) {
      console.error('Error rejecting payment:', error);
      toast.error(error.message || 'Failed to reject payment');
    } finally {
      setProcessing(null);
    }
  };

  const handleMarkGuestAsPaid = async (bookingId: number) => {
    setProcessing(bookingId);
    try {
      const booking = unpaidGuestBookings.find(b => b.id === bookingId);
      if (!booking) throw new Error('Booking not found');

      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          payment_method: 'cash',
          amount_paid: booking.amount_due,
          paid_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success(`Guest payment marked as paid (฿${booking.amount_due})`);
      
      // Remove from unpaid list
      setUnpaidGuestBookings(unpaidGuestBookings.filter(b => b.id !== bookingId));
    } catch (error: any) {
      console.error('Error marking guest as paid:', error);
      toast.error(error.message || 'Failed to mark as paid');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-[var(--color-sage)]" />
      </div>
    );
  }

  const hasSlipVerifications = bookings.length > 0;
  const hasUnpaidGuests = unpaidGuestBookings.length > 0;

  if (!hasSlipVerifications && !hasUnpaidGuests) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-[var(--color-earth-dark)] mb-2">
          All Clear!
        </h2>
        <p className="text-[var(--color-stone)]">
          No payment slips or unpaid guest bookings at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bookings List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-earth-dark)] mb-4">
          Pending Verifications ({bookings.length})
        </h2>
        
        {bookings.map((booking) => (
          <div
            key={booking.id}
            onClick={() => setSelectedBooking(booking)}
            className={`bg-white rounded-xl shadow-md p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedBooking?.id === booking.id
                ? 'ring-2 ring-[var(--color-sage)] bg-[var(--color-sage)]/5'
                : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--color-earth-dark)]">
                  {booking.classes?.title || 'Unknown Class'}
                </h3>
                <div className="flex items-center gap-2 text-sm text-[var(--color-stone)] mt-1">
                  <User size={14} />
                  <span>{booking.profiles?.full_name || 'Unknown User'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-[var(--color-clay)] font-semibold">
                  <DollarSign size={16} />
                  <span>฿{booking.amount_due}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--color-stone)]">
              <Calendar size={12} />
              <span>{formatDate(booking.created_at)}</span>
            </div>

            {booking.payment_method && (
              <div className="mt-2">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {booking.payment_method}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Slip Preview & Actions */}
      <div className="lg:sticky lg:top-4 lg:h-fit">
        {selectedBooking ? (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-[var(--color-earth-dark)] mb-4">
              Payment Slip Details
            </h2>

            {/* User Info */}
            <div className="mb-6 p-4 bg-[var(--color-cream)] rounded-lg">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-[var(--color-stone)]">User:</span>
                  <span className="ml-2 font-medium text-[var(--color-earth-dark)]">
                    {selectedBooking.profiles?.full_name}
                  </span>
                </div>
                {selectedBooking.profiles?.phone && (
                  <div>
                    <span className="text-[var(--color-stone)]">Phone:</span>
                    <span className="ml-2 font-medium text-[var(--color-earth-dark)]">
                      {selectedBooking.profiles.phone}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-[var(--color-stone)]">Class:</span>
                  <span className="ml-2 font-medium text-[var(--color-earth-dark)]">
                    {selectedBooking.classes?.title}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-stone)]">Amount Due:</span>
                  <span className="ml-2 font-medium text-[var(--color-clay)]">
                    ฿{selectedBooking.amount_due}
                  </span>
                </div>
                {selectedBooking.payment_note && (
                  <div>
                    <span className="text-[var(--color-stone)]">Note:</span>
                    <span className="ml-2 font-medium text-[var(--color-earth-dark)]">
                      {selectedBooking.payment_note}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Editable Paid Amount */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[var(--color-earth-dark)] mb-2">
                Confirm Paid Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-stone)]">
                  ฿
                </span>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  min="0"
                  max={selectedBooking.amount_due}
                  step="1"
                  className="w-full pl-8 pr-4 py-2 border-2 border-[var(--color-sand)] rounded-lg focus:border-[var(--color-sage)] focus:ring-2 focus:ring-[var(--color-sage)]/20 outline-none transition-colors"
                />
              </div>
              {paidAmount < selectedBooking.amount_due && (
                <p className="text-xs text-orange-600 mt-1">
                  ⚠️ Partial payment: ฿{paidAmount} of ฿{selectedBooking.amount_due} (฿{selectedBooking.amount_due - paidAmount} remaining)
                </p>
              )}
              {paidAmount >= selectedBooking.amount_due && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Full payment confirmed
                </p>
              )}
            </div>

            {/* Payment Slip Image */}
            {selectedBooking.payment_slip_url ? (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[var(--color-earth-dark)] mb-2">
                  Payment Slip
                </h3>
                <div className="relative group">
                  <img
                    src={selectedBooking.payment_slip_url}
                    alt="Payment Slip"
                    className="w-full rounded-lg border-2 border-[var(--color-sand)] cursor-pointer hover:border-[var(--color-sage)] transition-colors"
                    onClick={() => window.open(selectedBooking.payment_slip_url!, '_blank')}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all rounded-lg flex items-center justify-center">
                    <Eye
                      size={32}
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
                <p className="text-xs text-[var(--color-stone)] mt-2 text-center">
                  Click to view full size
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  ⚠️ No payment slip uploaded
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(selectedBooking.id)}
                disabled={processing === selectedBooking.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <CheckCircle size={18} />
                {processing === selectedBooking.id ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => handleReject(selectedBooking.id)}
                disabled={processing === selectedBooking.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <XCircle size={18} />
                {processing === selectedBooking.id ? 'Processing...' : 'Reject'}
              </button>
            </div>

            <p className="text-xs text-[var(--color-stone)] mt-4 text-center">
              {paidAmount >= selectedBooking.amount_due 
                ? 'Approving will mark the booking as fully paid and confirmed.'
                : `Approving will mark ฿${paidAmount} as partial payment (฿${selectedBooking.amount_due - paidAmount} remaining).`}
              <br />
              Rejecting will allow the user to re-upload a new slip.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Eye size={48} className="mx-auto text-[var(--color-stone)] mb-4" />
            <p className="text-[var(--color-stone)]">
              Select a booking to view payment slip details
            </p>
          </div>
        )}
      </div>

      {/* Unpaid Guest Bookings Section */}
      {hasUnpaidGuests && (
        <div className="col-span-full mt-8">
          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <DollarSign size={24} />
              Pending Guest Payments (No Slip)
            </h2>
            <p className="text-sm text-orange-700">
              These are manual guest bookings where payment was not received at the time of booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unpaidGuestBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-md p-5 border-2 border-orange-200 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-[var(--color-earth-dark)] mb-1">
                    {booking.guest_name || 'Unknown Guest'}
                  </h3>
                  <p className="text-sm text-[var(--color-stone)]">
                    {booking.classes?.title || 'Unknown Class'}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-[var(--color-stone)]" />
                    <span className="text-[var(--color-stone)]">
                      {booking.guest_contact || 'No contact info'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-[var(--color-stone)]" />
                    <span className="text-[var(--color-stone)]">
                      {formatDate(booking.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-orange-600" />
                    <span className="text-lg font-semibold text-orange-600">
                      ฿{booking.amount_due}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleMarkGuestAsPaid(booking.id)}
                  disabled={processing === booking.id}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {processing === booking.id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Mark as Paid (Cash)
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
