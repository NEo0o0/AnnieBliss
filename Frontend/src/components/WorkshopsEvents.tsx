import { useState } from 'react';
import { Calendar, Clock, DollarSign, MapPin, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { EventDetailModal } from './EventDetailModal';
import { PastEventModal } from './PastEventModal';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

const upcomingEvents = [
  {
    id: 1,
    title: 'Weekend Yoga Retreat: Finding Inner Peace',
    image: 'https://images.unsplash.com/photo-1662961154170-d2421e29f94b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwcmV0cmVhdCUyMG5hdHVyZXxlbnwxfHx8fDE3NjY1MDAyMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: 'March 15-17, 2025',
    time: 'Friday 5:00 PM - Sunday 3:00 PM',
    price: '$450',
    location: 'Mountain View Retreat Center',
    excerpt: 'Escape the hustle and immerse yourself in three days of rejuvenating yoga, meditation, and mindful connection with nature. Includes accommodation, meals, and all sessions.',
    category: 'Retreat',
  },
  {
    id: 2,
    title: 'Sound Healing & Restorative Yoga',
    image: 'https://images.unsplash.com/photo-1564513290352-53b18ee0c797?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VuZCUyMGhlYWxpbmclMjBib3dsc3xlbnwxfHx8fDE3NjY1MDAyMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: 'January 18, 2025',
    time: '6:00 PM - 8:00 PM',
    price: '$35',
    location: 'Annie Bliss Studio',
    excerpt: 'Experience deep relaxation through the healing vibrations of crystal singing bowls combined with gentle restorative poses. Perfect for stress relief and renewal.',
    category: 'Workshop',
  },
  {
    id: 3,
    title: 'Introduction to Aerial Yoga',
    image: 'https://images.unsplash.com/photo-1578882113036-761708189373?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjB5b2dhfGVufDF8fHx8MTc2NjUwMDIxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: 'January 25, 2025',
    time: '10:00 AM - 12:00 PM',
    price: '$45',
    location: 'Annie Bliss Studio',
    excerpt: 'Discover the joy of flying! Learn fundamental aerial yoga techniques using silk hammocks. No experience necessary. Limited to 10 participants.',
    category: 'Workshop',
  },
  {
    id: 4,
    title: 'Meditation Mastery Workshop',
    image: 'https://images.unsplash.com/photo-1766069339604-d4177198af7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwd29ya3Nob3B8ZW58MXx8fHwxNzY2NTAwMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: 'February 8, 2025',
    time: '2:00 PM - 5:00 PM',
    price: '$50',
    location: 'Annie Bliss Studio',
    excerpt: 'Deepen your meditation practice with guided techniques including mindfulness, visualization, and breath awareness. Suitable for all levels.',
    category: 'Workshop',
  },
  {
    id: 5,
    title: 'Arm Balance Intensive',
    image: 'https://images.unsplash.com/photo-1602827114685-efbb2717da9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwd29ya3Nob3AlMjBncm91cHxlbnwxfHx8fDE3NjY1MDAyMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: 'February 22, 2025',
    time: '1:00 PM - 3:30 PM',
    price: '$40',
    location: 'Annie Bliss Studio',
    excerpt: 'Build strength and confidence as you master crow, side crow, and flying pigeon poses. Intermediate level recommended.',
    category: 'Workshop',
  },
  {
    id: 6,
    title: 'Yin & Yang: Finding Balance',
    image: 'https://images.unsplash.com/photo-1552206735-e18f41fe76de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0b3JhdGl2ZSUyMHlvZ2F8ZW58MXx8fHwxNzY2NTAwMjE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: 'March 1, 2025',
    time: '4:00 PM - 6:00 PM',
    price: '$38',
    location: 'Annie Bliss Studio',
    excerpt: 'Experience the perfect blend of dynamic yang flow and passive yin holds. Learn to balance effort and ease both on and off the mat.',
    category: 'Workshop',
  },
];

const pastEvents = [
  {
    id: 7,
    title: 'New Year Intention Setting Workshop',
    image: 'https://images.unsplash.com/photo-1766069339604-d4177198af7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwd29ya3Nob3B8ZW58MXx8fHwxNzY2NTAwMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: 'January 6, 2025',
    time: '10:00 AM - 12:00 PM',
    price: '$30',
    location: 'Annie Bliss Studio',
    excerpt: 'Started the year with clarity and purpose through yoga, meditation, and vision board creation. A beautiful gathering of souls.',
    category: 'Workshop',
  },
  {
    id: 8,
    title: 'Winter Solstice Candlelight Flow',
    image: 'https://images.unsplash.com/photo-1552206735-e18f41fe76de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0b3JhdGl2ZSUyMHlvZ2F8ZW58MXx8fHwxNzY2NTAwMjE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: 'December 21, 2024',
    time: '7:00 PM - 8:30 PM',
    price: '$25',
    location: 'Annie Bliss Studio',
    excerpt: 'Honored the longest night with a gentle flow by candlelight, celebrating the return of the light within and around us.',
    category: 'Special Event',
  },
  {
    id: 9,
    title: 'Backbend Workshop Series',
    image: 'https://images.unsplash.com/photo-1602827114685-efbb2717da9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwd29ya3Nob3AlMjBncm91cHxlbnwxfHx8fDE3NjY1MDAyMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: 'November 10, 2024',
    time: '2:00 PM - 4:00 PM',
    price: '$45',
    location: 'Annie Bliss Studio',
    excerpt: 'Opened hearts and spines through safe, progressive backbending techniques. Students discovered new depths in wheel and camel poses.',
    category: 'Workshop',
  },
  {
    id: 10,
    title: 'Fall Gratitude Retreat',
    image: 'https://images.unsplash.com/photo-1662961154170-d2421e29f94b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwcmV0cmVhdCUyMG5hdHVyZXxlbnwxfHx8fDE3NjY1MDAyMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: 'October 18-20, 2024',
    time: 'All Day',
    price: '$425',
    location: 'Lakeside Wellness Center',
    excerpt: 'Three transformative days of yoga, meditation, and gratitude practices surrounded by autumn beauty. Unforgettable memories made.',
    category: 'Retreat',
  },
];

interface WorkshopsEventsProps {
  onNavigate?: (page: string) => void;
}

export function WorkshopsEvents({ onNavigate = () => {} }: WorkshopsEventsProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const events = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-baa97425/newsletter/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email: newsletterEmail }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle duplicate email (error code 23505)
        if (response.status === 409 || data.code === 23505) {
          toast.info('This email is already subscribed to our newsletter!');
          setNewsletterEmail('');
          return;
        }
        throw new Error(data.error || 'Failed to subscribe');
      }

      toast.success('Successfully subscribed to our newsletter! 🎉');
      setNewsletterEmail('');
      setSubscribeSuccess(true);
      
      // Reset success state after 5 seconds
      setTimeout(() => setSubscribeSuccess(false), 5000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-[var(--color-cream)] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4 text-[var(--color-earth-dark)]">Workshops & Events</h1>
          <p className="text-[var(--color-stone)] max-w-2xl mx-auto">
            Join us for transformative workshops, special events, and retreats designed to deepen your practice and connect with community.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-8 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'upcoming'
                  ? 'bg-[var(--color-sage)] text-white shadow-lg'
                  : 'text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-8 py-3 rounded-lg transition-all duration-300 ${
                activeTab === 'past'
                  ? 'bg-[var(--color-sage)] text-white shadow-lg'
                  : 'text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Event Cover Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs text-[var(--color-earth-dark)] shadow-lg">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 flex flex-col flex-1">
                {/* Title */}
                <h3 className="mb-3 text-[var(--color-earth-dark)] line-clamp-2">
                  {event.title}
                </h3>

                {/* Date & Time */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2">
                    <Calendar size={16} className="text-[var(--color-clay)] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[var(--color-stone)]">{event.date}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={16} className="text-[var(--color-clay)] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[var(--color-stone)]">{event.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-[var(--color-clay)] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[var(--color-stone)]">{event.location}</span>
                  </div>
                </div>

                {/* Excerpt */}
                <p className="text-sm text-[var(--color-stone)] mb-4 line-clamp-3 flex-1">
                  {event.excerpt}
                </p>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-sand)] mt-auto">
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} className="text-[var(--color-clay)]" />
                    <span className="text-xl text-[var(--color-earth-dark)]">{event.price}</span>
                  </div>
                  <button
                    className="bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm group"
                    onClick={() => setSelectedEvent(event)}
                  >
                    {activeTab === 'upcoming' ? 'Register' : 'View Details'}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for No Events */}
        {events.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--color-stone)] text-lg">
              No {activeTab} events at this time. Check back soon!
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        {activeTab === 'upcoming' && (
          <div className="mt-16 bg-white rounded-lg p-8 text-center shadow-lg">
            <h3 className="mb-3 text-[var(--color-earth-dark)]">Stay Updated</h3>
            <p className="text-[var(--color-stone)] mb-6">
              Subscribe to our newsletter to be the first to know about new workshops and special events.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)]"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={isSubscribing}
                required
              />
              <button
                type="submit"
                className="bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white px-6 py-3 rounded-lg transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
            {subscribeSuccess && (
              <div className="mt-4 flex items-center justify-center gap-2 text-[var(--color-sage)]">
                <CheckCircle size={20} />
                <span>Successfully subscribed!</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && activeTab === 'upcoming' && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onNavigate={onNavigate}
        />
      )}

      {/* Past Event Modal */}
      {selectedEvent && activeTab === 'past' && (
        <PastEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
}