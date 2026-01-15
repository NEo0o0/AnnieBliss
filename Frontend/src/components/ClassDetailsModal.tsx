import { X, Clock, User, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';

interface ClassDetailsModalProps {
  classData: {
    id: string;
    title: string;
    time: string;
    starts_at: string;
    instructor: string;
    level: string;
    capacity: number;
    enrolled: number;
    day: string;
    duration: string;
    description: string;
    long_description?: string | null;
    room: string;
    price: number;
    cover_image_url?: string | null;
  };
  onClose: () => void;
  onNavigate: (page: string) => void;
  onBookingSuccess?: () => void;
}

export function ClassDetailsModal({ classData, onClose, onNavigate, onBookingSuccess }: ClassDetailsModalProps) {
  const { user } = useAuth();
  const { createBooking } = useBookings({ autoFetch: false });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBooking = async () => {
    if (!user) {
      handleLoginRedirect();
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(null);

      const result = await createBooking({
        user_id: user.id,
        class_id: parseInt(classData.id),
        kind: 'drop_in',
        status: 'booked',
        amount_due: classData.price,
      });

      if (result.error) {
        throw result.error;
      }

      setBookingSuccess(true);

      if (onBookingSuccess) {
        onBookingSuccess();
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Booking error:', err);
      
      if (err.message?.includes('full')) {
        setBookingError('This class is fully booked. Please try another class or join the waitlist.');
      } else if (err.message?.includes('credit')) {
        setBookingError('You do not have enough credits. Please purchase a package first.');
      } else if (err.message?.includes('already booked')) {
        setBookingError('You have already booked this class.');
      } else {
        setBookingError(err.message || 'Failed to book class. Please try again.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    onClose();
    onNavigate('login');
  };

  const spotsLeft = classData.capacity - classData.enrolled;
  const isFull = spotsLeft <= 0;
  const displayPrice = classData.price > 0 ? `฿${classData.price.toLocaleString()}` : 'Free';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Close"
        >
          <X size={24} className="text-[var(--color-earth-dark)]" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {/* Cover Image Banner */}
          {classData.cover_image_url ? (
            <div className="relative w-full h-64 bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)]">
              <img
                src={classData.cover_image_url}
                alt={classData.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="relative w-full h-64 bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-3xl font-bold mb-2">{classData.title}</h3>
                <p className="text-lg opacity-90">{classData.level}</p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Title & Level */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-[var(--color-earth-dark)] mb-2">
                {classData.title}
              </h2>
              <span className="inline-block px-4 py-1 bg-[var(--color-sage)]/10 text-[var(--color-sage)] rounded-full text-sm font-medium">
                {classData.level}
              </span>
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
                <Calendar size={20} className="text-[var(--color-clay)]" />
                <div>
                  <div className="text-xs text-[var(--color-stone)]">Date & Time</div>
                  <div className="text-sm font-medium text-[var(--color-earth-dark)]">
                    {classData.day}, {classData.time}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
                <Clock size={20} className="text-[var(--color-clay)]" />
                <div>
                  <div className="text-xs text-[var(--color-stone)]">Duration</div>
                  <div className="text-sm font-medium text-[var(--color-earth-dark)]">
                    {classData.duration}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
                <User size={20} className="text-[var(--color-clay)]" />
                <div>
                  <div className="text-xs text-[var(--color-stone)]">Instructor</div>
                  <div className="text-sm font-medium text-[var(--color-earth-dark)]">
                    {classData.instructor}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
                <MapPin size={20} className="text-[var(--color-clay)]" />
                <div>
                  <div className="text-xs text-[var(--color-stone)]">Location</div>
                  <div className="text-sm font-medium text-[var(--color-earth-dark)]">
                    {classData.room}
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between p-4 bg-[var(--color-cream)] rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-[var(--color-clay)]" />
                <span className="text-sm text-[var(--color-stone)]">Price</span>
              </div>
              <span className="text-2xl font-bold text-[var(--color-earth-dark)]">
                {displayPrice}
              </span>
            </div>

            {/* Availability */}
            <div className="mb-6 p-4 bg-[var(--color-cream)] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--color-stone)]">Availability</span>
                <span className={`text-sm font-medium ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                  {isFull ? 'Fully Booked' : `${spotsLeft} spots left`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isFull ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(classData.enrolled / classData.capacity) * 100}%` }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[var(--color-earth-dark)] mb-3">
                About This Class
              </h3>
              <p className="text-[var(--color-stone)] leading-relaxed">
                {classData.description}
              </p>
            </div>

            {/* Long Description (if available) */}
            {classData.long_description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-earth-dark)] mb-3">
                  What to Expect
                </h3>
                <div className="text-[var(--color-stone)] leading-relaxed whitespace-pre-line">
                  {classData.long_description}
                </div>
              </div>
            )}

            {/* Booking Success Message */}
            {bookingSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-center font-medium">
                  ✓ Booking confirmed! See you in class.
                </p>
              </div>
            )}

            {/* Booking Error Message */}
            {bookingError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{bookingError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {user ? (
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading || bookingSuccess || isFull}
                  className={`flex-1 py-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
                    bookingSuccess
                      ? 'bg-green-500 text-white cursor-default'
                      : isFull
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white'
                  }`}
                >
                  {bookingLoading
                    ? 'Booking...'
                    : bookingSuccess
                    ? 'Booked ✓'
                    : isFull
                    ? 'Fully Booked'
                    : 'Book This Class'}
                </button>
              ) : (
                <button
                  onClick={handleLoginRedirect}
                  className="flex-1 py-4 bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Login to Book
                </button>
              )}
              <button
                onClick={onClose}
                className="px-8 py-4 border-2 border-[var(--color-sand)] hover:border-[var(--color-sage)] text-[var(--color-earth-dark)] rounded-lg font-medium transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
