'use client';

import { X, Calendar, Clock, MapPin, DollarSign, BookOpen, Check, Users, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import type { Tables } from '../types/database.types';

type Training = Tables<'classes'> & {
  early_bird_price: number | null;
  early_bird_deadline: string | null;
  registration_opens_at: string | null;
};

interface TrainingDetailModalProps {
  training: Training;
  onClose: () => void;
}

export function TrainingDetailModal({ training, onClose }: TrainingDetailModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { createBooking } = useBookings({ autoFetch: false });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [paymentOption, setPaymentOption] = useState<'full' | 'plan'>('full');
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  const now = Date.now();

  const spotsRemaining = training.capacity - training.booked_count;

  const startDate = useMemo(() => new Date(training.starts_at), [training.starts_at]);
  const endDate = useMemo(
    () => new Date(training.ends_at ?? training.starts_at),
    [training.ends_at, training.starts_at]
  );

  const formattedStartDate = useMemo(() => {
    return startDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [startDate]);

  const formattedEndDate = useMemo(() => {
    return endDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [endDate]);

  const formattedTime = useMemo(() => {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    const startTime = startDate.toLocaleTimeString('en-US', timeOptions);
    const endTime = endDate.toLocaleTimeString('en-US', timeOptions);
    return `${startTime} - ${endTime}`;
  }, [startDate, endDate]);

  const earlyBirdDeadline = useMemo(() => {
    if (!training.early_bird_deadline) return null;
    const d = new Date(training.early_bird_deadline);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  }, [training.early_bird_deadline]);

  const isEarlyBirdActive = useMemo(() => {
    if (!earlyBirdDeadline) return false;
    if (training.early_bird_price == null) return false;
    return new Date(now) <= earlyBirdDeadline;
  }, [earlyBirdDeadline, now, training.early_bird_price]);

  const payInFullAmount = useMemo(() => {
    if (isEarlyBirdActive && training.early_bird_price != null) return training.early_bird_price;
    return training.price ?? 0;
  }, [isEarlyBirdActive, training.early_bird_price, training.price]);

  const paymentPlanTotal = useMemo(() => {
    if (!training.price) return null;
    return Math.round(training.price * 1.1);
  }, [training.price]);

  const paymentPlanInstallment = useMemo(() => {
    if (!paymentPlanTotal) return null;
    return Math.round(paymentPlanTotal / 4);
  }, [paymentPlanTotal]);

  const amountDueToday = useMemo(() => {
    if (paymentOption === 'plan') return paymentPlanInstallment ?? 0;
    return payInFullAmount;
  }, [payInFullAmount, paymentOption, paymentPlanInstallment]);

  const formatMoney = (amount: number | null | undefined) => {
    if (!amount || amount === 0) return 'Free';
    return `฿${amount.toLocaleString()}`;
  };

  const handlePaymentMethodSelect = async (
    method: 'package' | 'cash' | 'bank_transfer' | 'promptpay',
    paymentNote?: string,
    slipUrl?: string
  ) => {
    if (!user) {
      handleLoginRedirect();
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(null);

      const paymentStatus = method === 'cash' ? 'unpaid' : 'paid';
      const paymentMethodValue = method === 'package' ? 'other' : method;

      const result = await createBooking({
        user_id: user.id,
        class_id: training.id,
        kind: 'dropin',
        status: 'booked',
        amount_due: amountDueToday,
        payment_method: paymentMethodValue,
        payment_status: paymentStatus,
        payment_note: paymentNote,
        payment_slip_url: slipUrl,
      });

      if (result.error) throw result.error;

      setBookingSuccess(true);
      setShowPaymentSelector(false);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Training booking error:', err);
      setBookingError(err.message || 'Failed to apply. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      handleLoginRedirect();
      return;
    }

    setShowPaymentSelector(true);
  };

  const handleLoginRedirect = () => {
    onClose();
    router.push('/login');
  };

  const handleContactRedirect = () => {
    onClose();
    router.push('/contact');
  };

  const handleNotifyMe = () => {
    const email = prompt('Enter your email to be notified when enrollment opens:');
    if (email) {
      alert(`Great! We'll notify ${email} when enrollment for ${training.title} opens.`);
      onClose();
    }
  };

  const registrationOpensAt = useMemo(() => {
    if (!training.registration_opens_at) return null;
    const d = new Date(training.registration_opens_at);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  }, [training.registration_opens_at]);

  const isPastTraining = useMemo(() => {
    return new Date(training.starts_at) < new Date();
  }, [training.starts_at]);

  const isEnrollmentOpen = useMemo(() => {
    if (isPastTraining) return false;
    if (registrationOpensAt && new Date() < registrationOpensAt) return false;
    return true;
  }, [isPastTraining, registrationOpensAt]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8"
        onClick={(e: any) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] text-white p-8 rounded-t-2xl">

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
          >
            <X size={24} />
          </button>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block px-3 py-1 rounded-full text-sm bg-white/20 text-white">
                {isEnrollmentOpen ? 'Enrolling Now' : 'Closed'}
              </span>
              <span className="text-white/90 text-sm">
                {spotsRemaining} spots remaining
              </span>
            </div>
            <h2 className="text-white">{training.title}</h2>
            <p className="text-2xl text-white/95">Upcoming Teacher Training</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Training Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
              <Calendar className="text-[var(--color-sage)]" size={24} />
              <div>
                <p className="text-xs text-[var(--color-stone)]">Start Date</p>
                <p className="text-[var(--color-earth-dark)]">{formattedStartDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
              <Calendar className="text-[var(--color-sage)]" size={24} />
              <div>
                <p className="text-xs text-[var(--color-stone)]">End Date</p>
                <p className="text-[var(--color-earth-dark)]">{formattedEndDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
              <Clock className="text-[var(--color-sage)]" size={24} />
              <div>
                <p className="text-xs text-[var(--color-stone)]">Daily Schedule</p>
                <p className="text-[var(--color-earth-dark)] text-sm">{formattedTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
              <MapPin className="text-[var(--color-sage)]" size={24} />
              <div>
                <p className="text-xs text-[var(--color-stone)]">Location</p>
                <p className="text-[var(--color-earth-dark)] text-sm">{training.location || 'TBA'}</p>
              </div>
            </div>
          </div>

          {/* Program Overview */}
          <div className="bg-gradient-to-r from-[var(--color-sage)]/10 to-[var(--color-clay)]/10 p-6 rounded-lg">
            <h3 className="text-[var(--color-earth-dark)] mb-3 flex items-center gap-2">
              <BookOpen size={20} className="text-[var(--color-sage)]" />
              Program Overview
            </h3>
            <p className="text-[var(--color-stone)] leading-relaxed">
              {training.description ||
                'Our comprehensive teacher training is designed to deepen your personal practice while equipping you with the skills to teach confidently.'}
            </p>
          </div>

          {/* Curriculum */}
          <div>
            <h3 className="text-[var(--color-earth-dark)] mb-4">Curriculum Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Yoga Philosophy',
                'Anatomy & Physiology',
                'Teaching Methodology',
                'Asana Practice & Alignment',
                'Pranayama & Meditation',
                'Practicum',
              ].map((module, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white border border-[var(--color-sand)] rounded-lg hover:shadow-md transition-shadow">
                  <Check size={18} className="text-[var(--color-sage)] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[var(--color-earth-dark)]">{module}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[var(--color-cream)] p-6 rounded-lg">
            <h3 className="text-[var(--color-earth-dark)] mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-[var(--color-sage)]" />
              Investment
            </h3>

            <div className="max-w-md mx-auto">
              <div className="bg-white p-6 rounded-lg border-2 border-[var(--color-sage)] shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg text-[var(--color-earth-dark)]">Program Tuition</span>
                  <span className="px-3 py-1 bg-[var(--color-sage)] text-white text-xs rounded-full">Active</span>
                </div>
                {isEarlyBirdActive && training.price != null && training.early_bird_price != null ? (
                  <div className="mb-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl text-[var(--color-stone)] line-through">{formatMoney(training.price)}</span>
                      <span className="text-4xl text-[var(--color-earth-dark)]">{formatMoney(training.early_bird_price)}</span>
                    </div>
                    <p className="text-sm text-[var(--color-stone)]">Early Bird pricing</p>
                  </div>
                ) : (
                  <div className="mb-2">
                    <p className="text-4xl text-[var(--color-earth-dark)]">{formatMoney(training.price ?? 0)}</p>
                    <p className="text-sm text-[var(--color-stone)]">Standard registration</p>
                  </div>
                )}

                <div className="mt-4 mb-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      id="tt-pay-full"
                      type="radio"
                      name="payment-option"
                      checked={paymentOption === 'full'}
                      onChange={() => setPaymentOption('full')}
                      className="mt-1"
                    />
                    <label htmlFor="tt-pay-full" className="text-sm text-[var(--color-earth-dark)]">
                      <div className="font-medium">Pay in Full</div>
                      <div className="text-[var(--color-stone)]">
                        {isEarlyBirdActive ? 'Early Bird price (if active)' : 'Standard price'}: {formatMoney(payInFullAmount)}
                      </div>
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="tt-pay-plan"
                      type="radio"
                      name="payment-option"
                      checked={paymentOption === 'plan'}
                      onChange={() => setPaymentOption('plan')}
                      disabled={!training.price}
                      className="mt-1"
                    />
                    <label htmlFor="tt-pay-plan" className="text-sm text-[var(--color-earth-dark)]">
                      <div className="font-medium">Payment Plan (4 Installments)</div>
                      {paymentPlanTotal != null && paymentPlanInstallment != null ? (
                        <div className="text-[var(--color-stone)]">
                          Total {formatMoney(paymentPlanTotal)} (Pay {formatMoney(paymentPlanInstallment)} today)
                        </div>
                      ) : (
                        <div className="text-[var(--color-stone)]">Not available</div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[var(--color-sand)]">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-stone)]">
                    <Check size={16} className="text-[var(--color-sage)]" />
                    <span>Payment plans available</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[var(--color-stone)]">
                    <Check size={16} className="text-[var(--color-sage)]" />
                    <span>Deposit to secure your spot</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Instructor */}
          <div className="flex items-center gap-4 p-4 bg-white border border-[var(--color-sand)] rounded-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] flex items-center justify-center text-white text-2xl">
              AB
            </div>
            <div>
              <p className="text-sm text-[var(--color-stone)]">Lead Instructor</p>
              <p className="text-lg text-[var(--color-earth-dark)]">Annie Bliss</p>
              <p className="text-xs text-[var(--color-stone)]">500-Hour E-RYT, Yoga Alliance Certified</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-[var(--color-sand)] pt-6">
            {bookingError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{bookingError}</p>
              </div>
            )}

            {bookingSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <p className="text-sm">✅ Application submitted for {training.title}.</p>
              </div>
            )}

            {isPastTraining ? (
              <button
                disabled
                className="w-full bg-[var(--color-stone)] text-white py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-not-allowed opacity-80"
              >
                <Users size={20} />
                <span className="text-lg">Registration Closed</span>
              </button>
            ) : isEnrollmentOpen ? (
              // Enrollment is open
              user ? (
                showPaymentSelector ? (
                  <div className="space-y-4">
                    <PaymentMethodSelector
                      hasActivePackage={false}
                      classPrice={amountDueToday}
                      isWorkshop={true}
                      itemName={training.title}
                      onSelect={handlePaymentMethodSelect}
                      selectedMethod={selectedPaymentMethod}
                      userId={user.id}
                      userFullName={user.user_metadata?.full_name || user.email || 'User'}
                    />
                    <button
                      onClick={() => setShowPaymentSelector(false)}
                      className="w-full py-3 border-2 border-[var(--color-sand)] hover:border-[var(--color-sage)] text-[var(--color-earth-dark)] rounded-lg transition-colors"
                    >
                      Back
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading || bookingSuccess}
                    className="w-full bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Users size={20} />
                    <span className="text-lg">
                      {bookingLoading
                        ? 'Submitting...'
                        : bookingSuccess
                          ? 'Submitted!'
                          : `Apply / Book Now (${formatMoney(amountDueToday)} due today)`}
                    </span>
                  </button>
                )
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <span className="text-lg">Login to Apply</span>
                  </button>
                  <p className="text-center text-[var(--color-stone)] text-sm">
                    Or{' '}
                    <button
                      onClick={handleContactRedirect}
                      className="text-[var(--color-sage)] hover:text-[var(--color-clay)] underline transition-colors duration-300"
                    >
                      contact us for more info
                    </button>
                  </p>
                </div>
              )
            ) : (
              // Coming Soon - Show Notify Me button
              <button
                onClick={handleNotifyMe}
                className="w-full bg-[var(--color-stone)] hover:bg-[var(--color-earth-dark)] text-white py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <Bell size={20} />
                <span className="text-lg">Notify Me When Enrollment Opens</span>
              </button>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-r from-[var(--color-sage)]/10 to-[var(--color-clay)]/10 p-4 rounded-lg">
            <p className="text-sm text-[var(--color-stone)]">
              💡 <strong>Prerequisites:</strong> Minimum 6 months of regular yoga practice recommended. 
              Complete application includes a personal essay and interview with lead instructor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}