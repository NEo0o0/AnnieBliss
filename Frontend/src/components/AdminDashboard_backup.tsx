  const handleTogglePaymentStatus = async (
    bookingId: string,
    classId: number,
    nextStatus: 'paid' | 'unpaid',
    amountDue: number
  ) => {
    const bookingIdAsNumber = Number(bookingId);
    if (!Number.isFinite(bookingIdAsNumber)) {
      toast.error('Invalid booking id');
      return;
    }

    const nextAmountPaid = nextStatus === 'paid' ? Number(amountDue ?? 0) : 0;
    const nextPaidAt = nextStatus === 'paid' ? new Date().toISOString() : null;

    // Optimistic update
    setBookingsState((prev) => ({
      ...prev,
      [classId]: (prev[classId] || []).map((b: AdminBooking) =>
        String(b.id) === String(bookingId)
          ? { ...b, paymentStatus: nextStatus, amountPaid: nextAmountPaid, paidAt: nextPaidAt }
          : b
      ),
    }));

    try {
      // Get current admin user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Get booking details for payment record
      const booking = bookingsState[classId]?.find((b: AdminBooking) => String(b.id) === String(bookingId));
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Update bookings table
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          payment_status: nextStatus,
          amount_paid: nextAmountPaid,
          paid_at: nextPaidAt,
        } as any)
        .eq('id' as any, bookingIdAsNumber as any);

      if (bookingError) throw bookingError;

      // If marking as PAID, insert payment record for audit trail
      if (nextStatus === 'paid' && nextAmountPaid > 0) {
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            booking_id: bookingIdAsNumber,
            user_id: booking.studentId || user.id,
            amount: nextAmountPaid,
            method: 'cash',
            log_status: 'completed',
            paid_at: nextPaidAt,
            recorded_by: user.id,
            currency: 'THB',
            note: `Payment recorded via admin dashboard for class booking #${bookingIdAsNumber}`
          });

        if (paymentError) {
          console.error('Failed to create payment record:', paymentError);
          toast.warning('Payment recorded but audit log failed. Please check logs.');
        }
      }

      // Refresh revenue immediately
      void refetchStats();

      // Show success toast
      toast.success(
        nextStatus === 'paid' 
          ? `Payment of ฿${amountDue} recorded successfully!` 
          : 'Payment status updated to unpaid',
        { duration: 3000 }
      );
    } catch (e) {
      // Revert on error
      setBookingsState((prev) => ({
        ...prev,
        [classId]: (prev[classId] || []).map((b: AdminBooking) => {
          if (String(b.id) !== String(bookingId)) return b;
          const revertedStatus = nextStatus === 'paid' ? 'unpaid' : 'paid';
          return {
            ...b,
            paymentStatus: revertedStatus,
            amountPaid: revertedStatus === 'paid' ? Number(amountDue ?? 0) : 0,
            paidAt: revertedStatus === 'paid' ? new Date().toISOString() : null,
          };
        }),
      }));

      const message = e instanceof Error ? e.message : String(e);
      toast.error(message || 'Failed to update payment status');
    }
  };
