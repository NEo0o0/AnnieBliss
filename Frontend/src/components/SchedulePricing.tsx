import { Calendar, Clock, MapPin, Check } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrainingDetailModal } from './TrainingDetailModal';

interface SchedulePricingProps {
  onNavigate: (page: string) => void;
}

const pricingPackages = [
  {
    name: 'Early Bird',
    price: '$2,800',
    originalPrice: '$3,200',
    description: 'Save $400 when you register 60+ days before start date',
    features: [
      'Complete 200-hour program',
      'All training materials included',
      'Yoga Alliance certification',
      'Lifetime alumni support',
      'Course manual & textbooks',
    ],
    badge: 'Best Value',
    highlighted: true,
  },
  {
    name: 'Standard',
    price: '$3,200',
    description: 'Full tuition for 200-hour teacher training program',
    features: [
      'Complete 200-hour program',
      'All training materials included',
      'Yoga Alliance certification',
      'Lifetime alumni support',
      'Course manual & textbooks',
    ],
    badge: null,
    highlighted: false,
  },
  {
    name: 'Payment Plan',
    price: '$3,400',
    description: 'Split your tuition into 4 monthly payments',
    features: [
      'Complete 200-hour program',
      'All training materials included',
      'Yoga Alliance certification',
      'Lifetime alumni support',
      '4 monthly installments of $850',
    ],
    badge: 'Flexible',
    highlighted: false,
  },
];

export function SchedulePricing({ onNavigate }: SchedulePricingProps) {
  const { classes } = useApp();
  const [selectedTraining, setSelectedTraining] = useState<any>(null);

  // Filter training sessions from classes
  const trainingSessions = classes.filter(cls => cls.category === 'training');

  return (
    <>
      <section className="py-20 px-6 bg-[var(--color-cream)]">
        <div className="max-w-6xl mx-auto">
          {/* Schedule Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-[var(--color-earth-dark)]">Upcoming Sessions</h2>
              <p className="text-[var(--color-stone)] max-w-2xl mx-auto">
                Choose the session that fits your schedule. All sessions meet on weekends to accommodate working professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trainingSessions.map((session) => {
                const spotsRemaining = session.capacity - session.enrolled;
                return (
                  <button
                    key={session.id}
                    onClick={() => setSelectedTraining(session)}
                    className="bg-white rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left"
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl text-[var(--color-earth-dark)]">{session.season}</span>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        session.status === 'Enrolling Now'
                          ? 'bg-[var(--color-sage)] text-white'
                          : session.status === 'Early Bird Open'
                          ? 'bg-[var(--color-terracotta)]/30 text-[var(--color-clay)]'
                          : 'bg-[var(--color-sand)] text-[var(--color-stone)]'
                      }`}>
                        {session.status}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <Calendar size={18} className="text-[var(--color-clay)] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-[var(--color-stone)]">Start Date</div>
                          <div className="text-[var(--color-earth-dark)]">{session.startDate}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar size={18} className="text-[var(--color-clay)] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-[var(--color-stone)]">End Date</div>
                          <div className="text-[var(--color-earth-dark)]">{session.endDate}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock size={18} className="text-[var(--color-clay)] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-[var(--color-stone)]">Schedule</div>
                          <div className="text-[var(--color-earth-dark)] text-sm">Sat-Sun, {session.time}</div>
                        </div>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="pt-4 border-t border-[var(--color-sand)]">
                      <div className="text-sm text-[var(--color-stone)]">{spotsRemaining} spots remaining</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Location */}
            <div className="mt-8 flex items-center justify-center gap-2 text-[var(--color-stone)]">
              <MapPin size={18} className="text-[var(--color-clay)]" />
              <span>Annie Bliss Yoga Studio, Downtown Location</span>
            </div>
          </div>

          {/* Pricing Section */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mb-4 text-[var(--color-earth-dark)]">Investment & Pricing</h2>
              <p className="text-[var(--color-stone)] max-w-2xl mx-auto">
                Choose the payment option that works best for you. All packages include the same comprehensive training.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPackages.map((pkg, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-8 shadow-lg transition-all duration-300 relative ${
                    pkg.highlighted
                      ? 'ring-2 ring-[var(--color-sage)] md:-translate-y-2 hover:shadow-2xl'
                      : 'hover:shadow-xl'
                  }`}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-block px-4 py-1 bg-[var(--color-clay)] text-white text-xs rounded-full shadow-lg">
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  {/* Package Name */}
                  <h3 className="mb-2 text-center text-[var(--color-earth-dark)]">{pkg.name}</h3>

                  {/* Price */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2">
                      {pkg.originalPrice && (
                        <span className="text-xl text-[var(--color-stone)] line-through">{pkg.originalPrice}</span>
                      )}
                      <span className="text-4xl text-[var(--color-earth-dark)]">{pkg.price}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[var(--color-stone)] text-center mb-6 h-12">
                    {pkg.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check size={18} className="text-[var(--color-sage)] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[var(--color-stone)]">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[var(--color-sand)] my-6" />

                  {/* Additional Info */}
                  <div className="text-center text-xs text-[var(--color-stone)]">
                    Non-refundable $500 deposit required
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center text-sm text-[var(--color-stone)] bg-white p-6 rounded-lg">
              <p>
                <strong className="text-[var(--color-earth-dark)]">Included in all packages:</strong> Course manual, recommended reading materials, 
                unlimited studio classes during training period, post-graduation mentorship, and continuing education discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Training Detail Modal */}
      {selectedTraining && (
        <TrainingDetailModal
          training={selectedTraining}
          onClose={() => setSelectedTraining(null)}
          onNavigate={onNavigate}
        />
      )}
    </>
  );
}
