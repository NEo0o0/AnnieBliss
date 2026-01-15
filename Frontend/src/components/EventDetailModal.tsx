 "use client";

import { X, Clock, Calendar, MapPin, DollarSign, Users, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface EventDetailModalProps {
  event: {
    id: number;
    title: string;
    image: string;
    starts_at: string;
    date: string;
    time: string;
    price: string;
    location: string;
    excerpt: string;
    category: string;
  };
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function EventDetailModal({ event, onClose, onNavigate }: EventDetailModalProps) {
  const { isLoggedIn } = useApp();

  const isPastEvent = new Date(event.starts_at) < new Date();

  const handleBooking = () => {
    if (isLoggedIn) {
      alert(`Successfully registered for ${event.title}! Check your email for confirmation.`);
      onClose();
    }
  };

  const handleLoginRedirect = () => {
    onClose();
    onNavigate('login');
  };

  const handleContactRedirect = () => {
    onClose();
    onNavigate('contact');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-300 text-white"
          >
            <X size={24} />
          </button>
          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm shadow-lg">
              <Tag size={16} className="text-[var(--color-sage)]" />
              {event.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-[var(--color-earth-dark)]">{event.title}</h2>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
              <Calendar className="text-[var(--color-sage)]" size={20} />
              <div>
                <p className="text-xs text-[var(--color-stone)]">Date</p>
                <p className="text-[var(--color-earth-dark)]">{event.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
              <Clock className="text-[var(--color-sage)]" size={20} />
              <div>
                <p className="text-xs text-[var(--color-stone)]">Time</p>
                <p className="text-[var(--color-earth-dark)]">{event.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
              <MapPin className="text-[var(--color-sage)]" size={20} />
              <div>
                <p className="text-xs text-[var(--color-stone)]">Location</p>
                <p className="text-[var(--color-earth-dark)]">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
              <DollarSign className="text-[var(--color-sage)]" size={20} />
              <div>
                <p className="text-xs text-[var(--color-stone)]">Investment</p>
                <p className="text-[var(--color-earth-dark)] text-xl">{event.price}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-[var(--color-earth-dark)] mb-3">About This Event</h3>
            <p className="text-[var(--color-stone)] leading-relaxed">
              {event.excerpt}
            </p>
          </div>

          {/* What to Bring */}
          <div className="bg-[var(--color-cream)] p-6 rounded-lg">
            <h4 className="text-[var(--color-earth-dark)] mb-3">What to Bring</h4>
            <ul className="space-y-2 text-sm text-[var(--color-stone)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-sage)] mt-1">•</span>
                <span>Yoga mat (or rent one at the studio for $5)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-sage)] mt-1">•</span>
                <span>Water bottle to stay hydrated</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-sage)] mt-1">•</span>
                <span>Comfortable clothing suitable for movement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-sage)] mt-1">•</span>
                <span>Open mind and positive energy!</span>
              </li>
            </ul>
          </div>

          {/* Booking Section */}
          <div className="border-t border-[var(--color-sand)] pt-6">
            {isPastEvent ? (
              <button
                disabled
                className="w-full bg-[var(--color-stone)] text-white py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-not-allowed opacity-80"
              >
                <Users size={20} />
                <span className="text-lg">Registration Closed</span>
              </button>
            ) : isLoggedIn ? (
              <button
                onClick={handleBooking}
                className="w-full bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Users size={20} />
                <span className="text-lg">Book Workshop</span>
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleLoginRedirect}
                  className="w-full bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span className="text-lg">Login to Book</span>
                </button>
                <p className="text-center text-[var(--color-stone)] text-sm">
                  Or{' '}
                  <button
                    onClick={handleContactRedirect}
                    className="text-[var(--color-sage)] hover:text-[var(--color-clay)] underline transition-colors duration-300"
                  >
                    contact us to book manually
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-r from-[var(--color-sage)]/10 to-[var(--color-clay)]/10 p-4 rounded-lg">
            <p className="text-sm text-[var(--color-stone)]">
              💡 <strong>Limited spots available.</strong> Pre-registration required. Cancellation policy: Full refund up to 48 hours before event.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
