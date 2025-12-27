import { Award, BookOpen, Heart, Flower } from 'lucide-react';

const certifications = [
  {
    icon: Flower,
    title: 'RYT-500',
    organization: 'Yoga Alliance',
    description: '500-Hour Registered Yoga Teacher',
  },
  {
    icon: Heart,
    title: 'Trauma-Informed',
    organization: 'Yoga Certification',
    description: 'Certified Trauma-Sensitive Instructor',
  },
  {
    icon: BookOpen,
    title: 'Meditation',
    organization: 'Teacher Training',
    description: 'Advanced Mindfulness Meditation',
  },
  {
    icon: Award,
    title: 'Restorative',
    organization: 'Yoga Specialist',
    description: 'Certified Restorative Yoga Teacher',
  },
];

export function Certifications() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-[var(--color-earth-dark)]">Certifications & Training</h2>
          <p className="text-[var(--color-stone)] max-w-2xl mx-auto">
            Committed to excellence through continuous learning and professional development in yoga and holistic wellness.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg bg-[var(--color-cream)] border-2 border-[var(--color-sand)] hover:border-[var(--color-sage)] transition-colors duration-300"
            >
              {/* Icon/Logo */}
              <div className="w-20 h-20 rounded-full bg-white border-2 border-[var(--color-terracotta)] flex items-center justify-center mb-4">
                <cert.icon size={36} className="text-[var(--color-clay)]" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="mb-2 text-[var(--color-earth-dark)]">{cert.title}</h3>
              
              {/* Organization */}
              <p className="text-sm text-[var(--color-terracotta)] mb-2">
                {cert.organization}
              </p>

              {/* Description */}
              <p className="text-sm text-[var(--color-stone)]">
                {cert.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-[var(--color-sage)]/20 px-8 py-6 rounded-lg">
            <p className="text-[var(--color-earth-dark)]">
              Continuing Education: Anatomy, Ayurveda, Pranayama, Yoga Philosophy
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}