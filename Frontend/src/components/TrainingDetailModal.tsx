import { X, Calendar, Clock, MapPin, DollarSign, BookOpen, Check, Users, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TrainingDetailModalProps {
  training: {
    id: string;
    title: string;
    season: string;
    startDate: string;
    endDate: string;
    time: string;
    location: string;
    description: string;
    earlyBirdPrice: string;
    regularPrice: string;
    status: string;
    capacity: number;
    enrolled: number;
    instructor: string;
    duration: string;
  };
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function TrainingDetailModal({ training, onClose, onNavigate }: TrainingDetailModalProps) {
  const { isLoggedIn } = useApp();
  const spotsRemaining = training.capacity - training.enrolled;

  // Parse curriculum modules from description
  const curriculumModules = training.description.split('|').map(module => module.trim());

  const handleBooking = () => {
    if (isLoggedIn) {
      alert(`Application submitted for ${training.title} - ${training.season}! Our team will contact you within 24 hours.`);
      onClose();
    }
  };

  const handleLoginRedirect = () => {
    onClose();
    onNavigate('admin');
  };

  const handleContactRedirect = () => {
    onClose();
    onNavigate('contact');
  };

  const handleNotifyMe = () => {
    const email = prompt('Enter your email to be notified when enrollment opens:');
    if (email) {
      alert(`Great! We'll notify ${email} when enrollment for ${training.season} opens.`);
      onClose();
    }
  };

  const isEnrollmentOpen = training.status === 'Enrolling Now' || training.status === 'Early Bird Open';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
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
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                training.status === 'Enrolling Now'
                  ? 'bg-white text-[var(--color-sage)]'
                  : training.status === 'Early Bird Open'
                  ? 'bg-[var(--color-terracotta)] text-white'
                  : 'bg-white/20 text-white'
              }`}>
                {training.status}
              </span>
              <span className="text-white/90 text-sm">
                {spotsRemaining} spots remaining
              </span>
            </div>
            <h2 className="text-white">{training.title}</h2>
            <p className="text-2xl text-white/95">{training.season}</p>
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
                <p className="text-[var(--color-earth-dark)]">{training.startDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
              <Calendar className="text-[var(--color-sage)]" size={24} />
              <div>
                <p className="text-xs text-[var(--color-stone)]">End Date</p>
                <p className="text-[var(--color-earth-dark)]">{training.endDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
              <Clock className="text-[var(--color-sage)]" size={24} />
              <div>
                <p className="text-xs text-[var(--color-stone)]">Daily Schedule</p>
                <p className="text-[var(--color-earth-dark)] text-sm">{training.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[var(--color-cream)] rounded-lg">
              <MapPin className="text-[var(--color-sage)]" size={24} />
              <div>
                <p className="text-xs text-[var(--color-stone)]">Location</p>
                <p className="text-[var(--color-earth-dark)] text-sm">{training.location}</p>
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
              Our comprehensive 200-hour Yoga Teacher Training is designed to deepen your personal practice while equipping you with the skills to teach confidently. 
              This intensive program meets on weekends over {training.duration}, blending ancient yogic wisdom with modern teaching methodology.
            </p>
          </div>

          {/* Curriculum */}
          <div>
            <h3 className="text-[var(--color-earth-dark)] mb-4">Curriculum Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {curriculumModules.map((module, index) => (
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

            {/* Early Bird Open - Show both prices with Early Bird highlighted */}
            {training.status === 'Early Bird Open' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-[var(--color-sage)] relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[var(--color-stone)]">Early Bird</span>
                      <span className="px-2 py-1 bg-[var(--color-clay)] text-white text-xs rounded-full">Best Value</span>
                    </div>
                    <p className="text-3xl text-[var(--color-earth-dark)] mb-1">{training.earlyBirdPrice}</p>
                    <p className="text-xs text-[var(--color-stone)]">Register 60+ days in advance</p>
                    <div className="mt-3 pt-3 border-t border-[var(--color-sand)]">
                      <p className="text-sm text-[var(--color-sage)]">
                        💰 Save ${parseInt(training.regularPrice.replace(/[$,]/g, '')) - parseInt(training.earlyBirdPrice.replace(/[$,]/g, ''))}!
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-[var(--color-sand)] opacity-70">
                    <div className="mb-2">
                      <span className="text-sm text-[var(--color-stone)]">Regular Price</span>
                    </div>
                    <p className="text-3xl text-[var(--color-earth-dark)] mb-1">{training.regularPrice}</p>
                    <p className="text-xs text-[var(--color-stone)]">Standard registration</p>
                    <div className="mt-3 pt-3 border-t border-[var(--color-sand)]">
                      <p className="text-xs text-[var(--color-stone)]">
                        Payment plans available
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-stone)] mt-4 text-center">
                  ⏰ Early Bird pricing ends 60 days before program start date
                </p>
              </>
            )}

            {/* Enrolling Now - Show only Regular Price */}
            {training.status === 'Enrolling Now' && (
              <>
                <div className="max-w-md mx-auto">
                  <div className="bg-white p-6 rounded-lg border-2 border-[var(--color-sage)] shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg text-[var(--color-earth-dark)]">Program Tuition</span>
                      <span className="px-3 py-1 bg-[var(--color-sage)] text-white text-xs rounded-full">Active</span>
                    </div>
                    <p className="text-4xl text-[var(--color-earth-dark)] mb-2">{training.regularPrice}</p>
                    <p className="text-sm text-[var(--color-stone)] mb-4">Standard registration</p>
                    <div className="space-y-2 pt-4 border-t border-[var(--color-sand)]">
                      <div className="flex items-center gap-2 text-sm text-[var(--color-stone)]">
                        <Check size={16} className="text-[var(--color-sage)]" />
                        <span>Payment plans available</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--color-stone)]">
                        <Check size={16} className="text-[var(--color-sage)]" />
                        <span>$500 deposit to secure your spot</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--color-stone)]">
                        <Check size={16} className="text-[var(--color-sage)]" />
                        <span>4 monthly installments available</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-stone)] mt-4 text-center">
                  All packages include course materials, unlimited studio classes, and post-graduation mentorship
                </p>
              </>
            )}

            {/* Coming Soon - Show preview pricing */}
            {training.status === 'Coming Soon' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 opacity-60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Early Bird (Preview)</span>
                      <span className="px-2 py-1 bg-gray-400 text-white text-xs rounded-full">Coming Soon</span>
                    </div>
                    <p className="text-3xl text-gray-600 mb-1">{training.earlyBirdPrice}</p>
                    <p className="text-xs text-gray-500">Available 60+ days before start</p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 opacity-60">
                    <div className="mb-2">
                      <span className="text-sm text-gray-500">Regular Price (Preview)</span>
                    </div>
                    <p className="text-3xl text-gray-600 mb-1">{training.regularPrice}</p>
                    <p className="text-xs text-gray-500">Standard registration</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-stone)] mt-4 text-center">
                  💡 Pricing shown is preliminary. Final pricing will be confirmed when enrollment opens.
                </p>
              </>
            )}
          </div>

          {/* Lead Instructor */}
          <div className="flex items-center gap-4 p-4 bg-white border border-[var(--color-sand)] rounded-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] flex items-center justify-center text-white text-2xl">
              {training.instructor.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm text-[var(--color-stone)]">Lead Instructor</p>
              <p className="text-lg text-[var(--color-earth-dark)]">{training.instructor}</p>
              <p className="text-xs text-[var(--color-stone)]">500-Hour E-RYT, Yoga Alliance Certified</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-[var(--color-sand)] pt-6">
            {isEnrollmentOpen ? (
              // Enrollment is open
              isLoggedIn ? (
                <button
                  onClick={handleBooking}
                  className="w-full bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Users size={20} />
                  <span className="text-lg">Apply / Book Now</span>
                </button>
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