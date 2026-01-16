import { X, Clock, User, MapPin, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import { ImageCarousel } from './ImageCarousel';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { sendBookingConfirmationEmail } from '../utils/emailHelpers';

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
    gallery_images?: string[] | null;
    class_types?: {
      cover_image_url?: string | null;
    };
  };
  onClose: () => void;
  onNavigate: (page: string) => void;
  onBookingSuccess?: () => void;
}

export function ClassDetailsModal({ classData, onClose, onNavigate, onBookingSuccess }: ClassDetailsModalProps) {
  const { user } = useAuth();
  const { createBooking, checkUserPackage, checkExistingBooking } = useBookings({ autoFetch: false });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [userPackage, setUserPackage] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [existingBooking, setExistingBooking] = useState<any>(null);
  const [checkingBooking, setCheckingBooking] = useState(true);
  const [loadingPackageData, setLoadingPackageData] = useState(true);
  const [dataLoadError, setDataLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setLoadingPackageData(true);
        setDataLoadError(null);
        
        try {
          // Load package data
          const pkg = await checkUserPackage(user.id);
          console.log('📦 User package data:', pkg);
          console.log('📦 Has active package:', !!pkg);
          console.log('📦 Credits remaining:', pkg?.credits_remaining);
          console.log('📦 Package name:', pkg?.name);
          setUserPackage(pkg);
          
          // Check if user already has a booking for this class
          const booking = await checkExistingBooking(user.id, parseInt(classData.id));
          setExistingBooking(booking);
          setCheckingBooking(false);
          setLoadingPackageData(false);
        } catch (error) {
          console.error('❌ Error loading package data:', error);
          setDataLoadError('Failed to load package information. Please try again.');
          setLoadingPackageData(false);
          setCheckingBooking(false);
        }
      } else {
        setCheckingBooking(false);
        setLoadingPackageData(false);
      }
    };
    
    loadData();
  }, [user, classData.id]);

  const handleBookingClick = () => {
    if (!user) {
      handleLoginRedirect();
      return;
    }
    // Prevent booking if already booked
    if (existingBooking) {
      return;
    }
    // Ensure data is loaded before showing payment selector
    if (loadingPackageData) {
      console.log('⏳ Still loading package data, please wait...');
      return;
    }
    setShowPaymentSelector(true);
  };

  const handlePaymentSelect = async (method: 'package' | 'cash' | 'bank_transfer' | 'promptpay', paymentNote?: string, slipUrl?: string) => {
    if (!user) return;

    try {
      setBookingLoading(true);
      setBookingError(null);
      setSelectedPaymentMethod(method);

      const bookingData: any = {
        user_id: user.id,
        class_id: parseInt(classData.id),
        amount_due: classData.price,
      };

      if (method === 'package') {
        // Package booking - payment_status is 'paid' immediately
        bookingData.kind = 'package';
        bookingData.payment_status = 'paid';
        bookingData.payment_method = 'package';
        bookingData.user_package_id = userPackage?.id;
      } else {
        // Transfer/Cash/PromptPay - payment_status is 'unpaid' initially
        bookingData.kind = 'dropin';
        bookingData.payment_method = method;
        bookingData.payment_status = 'unpaid';
        bookingData.payment_note = paymentNote;
        bookingData.payment_slip_url = slipUrl;
      }

      const result = await createBooking(bookingData);

      if (result.error) {
        throw result.error;
      }

      setBookingSuccess(true);
      setShowPaymentSelector(false);
      // Update existing booking state to prevent re-booking
      setExistingBooking(result.data);

      // Send booking confirmation email
      if (user && result.data) {
        const packageInfo = method === 'package' && userPackage ? {
          name: userPackage.name,
          creditsRemaining: userPackage.credits_remaining,
          isUnlimited: userPackage.is_unlimited
        } : undefined;
        
        sendBookingConfirmationEmail(user, result.data, classData, packageInfo).catch(err => {
          console.error('Failed to send confirmation email:', err);
        });
      }

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
          {/* Gallery Carousel or Cover Image Banner */}
          {classData.gallery_images && classData.gallery_images.length > 0 ? (
            <div className="p-6 bg-[var(--color-cream)]">
              <ImageCarousel images={classData.gallery_images} className="w-full h-96" />
            </div>
          ) : (classData.cover_image_url || classData.class_types?.cover_image_url) ? (
            <div className="relative w-full h-64 bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)]">
              <img
                src={classData.cover_image_url || classData.class_types?.cover_image_url || ''}
                alt={classData.title}
                className="w-full h-full object-cover"
                onError={(e) => {
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

            {/* Already Booked Banner */}
            {existingBooking && !checkingBooking && (
              <div className="mb-6 p-5 bg-gradient-to-r from-[var(--color-sage)]/10 to-[var(--color-clay)]/10 border-2 border-[var(--color-sage)] rounded-xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] rounded-full flex items-center justify-center shadow-md">
                    <CheckCircle2 size={24} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--color-earth-dark)] font-bold text-lg mb-1">
                      Already Booked ✓
                    </p>
                    <p className="text-[var(--color-stone)] text-sm leading-relaxed">
                      You have an active booking for this class. View your booking details and payment status in your profile.
                    </p>
                    <a 
                      href="/profile" 
                      className="inline-block mt-3 text-sm text-[var(--color-sage)] hover:text-[var(--color-clay)] font-medium underline transition-colors"
                    >
                      Go to My Bookings →
                    </a>
                  </div>
                </div>
              </div>
            )}

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

            {/* Data Loading Error */}
            {dataLoadError && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 text-sm">⚠️ {dataLoadError}</p>
              </div>
            )}

            {/* Booking Error Message */}
            {bookingError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{bookingError}</p>
              </div>
            )}

            {/* Loading Package Data */}
            {loadingPackageData && user && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-blue-800 text-sm">Loading payment options...</p>
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            {showPaymentSelector && !bookingSuccess && !loadingPackageData && (
              <div className="mb-6">
                <PaymentMethodSelector
                  hasActivePackage={!!userPackage}
                  packageName={userPackage?.name}
                  creditsRemaining={userPackage?.credits_remaining}
                  isUnlimited={userPackage?.is_unlimited || false}
                  classPrice={classData.price}
                  isWorkshop={false}
                  itemName={classData.title}
                  onSelect={handlePaymentSelect}
                  selectedMethod={selectedPaymentMethod}
                  userId={user?.id}
                  userFullName={user?.user_metadata?.full_name}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {user ? (
                !showPaymentSelector ? (
                  <button
                    onClick={handleBookingClick}
                    disabled={bookingLoading || bookingSuccess || isFull || existingBooking || loadingPackageData}
                    className={`flex-1 py-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
                      bookingSuccess
                        ? 'bg-green-500 text-white cursor-default'
                        : existingBooking
                        ? 'bg-blue-300 text-blue-800 cursor-not-allowed'
                        : isFull
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : loadingPackageData
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white'
                    }`}
                  >
                    {loadingPackageData
                      ? 'Loading...'
                      : bookingLoading
                      ? 'Booking...'
                      : bookingSuccess
                      ? 'Booked ✓'
                      : existingBooking
                      ? 'Already Booked'
                      : isFull
                      ? 'Fully Booked'
                      : 'Book This Class'}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPaymentSelector(false)}
                    className="flex-1 py-4 border-2 border-[var(--color-sand)] hover:border-[var(--color-sage)] text-[var(--color-earth-dark)] rounded-lg font-medium transition-all duration-300"
                  >
                    Back
                  </button>
                )
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
