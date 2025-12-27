import { BookOpen, Heart, Users, Brain, Sparkles, Target, Compass, Flower } from 'lucide-react';

const modules = [
  {
    icon: Heart,
    title: 'Yoga Philosophy',
    hours: '25 hours',
    description: 'Explore the ancient texts, ethical principles, and philosophical foundations of yoga including the Yoga Sutras and Bhagavad Gita.',
    topics: ['Yoga Sutras of Patanjali', 'Eight Limbs of Yoga', 'Bhagavad Gita', 'Yogic Lifestyle'],
  },
  {
    icon: Brain,
    title: 'Anatomy & Physiology',
    hours: '30 hours',
    description: 'Deep dive into the human body, skeletal system, muscular system, and how yoga affects physical and energetic anatomy.',
    topics: ['Skeletal System', 'Muscular System', 'Nervous System', 'Chakras & Energy'],
  },
  {
    icon: Flower,
    title: 'Asana Practice',
    hours: '50 hours',
    description: 'Refine your personal practice through detailed exploration of poses, alignment principles, modifications, and variations.',
    topics: ['Standing Poses', 'Inversions', 'Backbends', 'Restorative Practice'],
  },
  {
    icon: Sparkles,
    title: 'Pranayama & Meditation',
    hours: '15 hours',
    description: 'Master breathwork techniques and meditation practices to cultivate inner awareness and energy management.',
    topics: ['Breathing Techniques', 'Meditation Styles', 'Bandhas & Mudras', 'Energy Regulation'],
  },
  {
    icon: Users,
    title: 'Teaching Methodology',
    hours: '40 hours',
    description: 'Learn the art and science of teaching yoga, including class sequencing, demonstration, observation, and hands-on adjustments.',
    topics: ['Class Sequencing', 'Cueing & Language', 'Adjustments', 'Class Management'],
  },
  {
    icon: Target,
    title: 'Practicum',
    hours: '20 hours',
    description: 'Apply your knowledge through practice teaching sessions, receiving feedback, and building confidence in your teaching skills.',
    topics: ['Practice Teaching', 'Peer Feedback', 'Self-Reflection', 'Teaching Observations'],
  },
  {
    icon: Compass,
    title: 'Professional Development',
    hours: '15 hours',
    description: 'Prepare for your career as a yoga teacher with guidance on ethics, business skills, and building your unique teaching voice.',
    topics: ['Ethics & Boundaries', 'Marketing Basics', 'Business Skills', 'Personal Brand'],
  },
  {
    icon: BookOpen,
    title: 'Self-Study & Reading',
    hours: '5 hours',
    description: 'Engage with recommended readings and reflective journaling to deepen your understanding and personal integration.',
    topics: ['Required Readings', 'Journaling', 'Self-Reflection', 'Research Projects'],
  },
];

export function Curriculum() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="mb-4 text-[var(--color-earth-dark)]">Comprehensive Curriculum</h2>
          <p className="text-[var(--color-stone)] max-w-2xl mx-auto">
            Our 200-hour program covers all essential aspects of yoga teaching, meeting and exceeding Yoga Alliance standards.
          </p>
        </div>

        {/* Total Hours Display */}
        <div className="bg-[var(--color-sage)]/20 rounded-lg p-8 mb-12 text-center">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div>
              <div className="text-5xl text-[var(--color-earth-dark)] mb-2">200</div>
              <div className="text-[var(--color-stone)]">Total Hours</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-[var(--color-sand)]" />
            <div>
              <div className="text-5xl text-[var(--color-earth-dark)] mb-2">8</div>
              <div className="text-[var(--color-stone)]">Core Modules</div>
            </div>
            <div className="hidden md:block w-px h-16 bg-[var(--color-sand)]" />
            <div>
              <div className="text-5xl text-[var(--color-earth-dark)] mb-2">12</div>
              <div className="text-[var(--color-stone)]">Weeks</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={index}
                className="bg-[var(--color-cream)] rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-[var(--color-sage)]"
              >
                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-sage)]/30 flex items-center justify-center flex-shrink-0">
                    <Icon size={24} className="text-[var(--color-clay)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-[var(--color-earth-dark)]">{module.title}</h3>
                    <span className="text-sm text-[var(--color-stone)]">{module.hours}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[var(--color-stone)] text-sm mb-4">
                  {module.description}
                </p>

                {/* Topics */}
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wide text-[var(--color-stone)] mb-2">Key Topics:</div>
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-3 py-1 bg-white rounded-full text-xs text-[var(--color-earth-dark)]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certification Note */}
        <div className="mt-12 text-center bg-[var(--color-sand)] p-6 rounded-lg">
          <p className="text-[var(--color-earth-dark)]">
            Upon successful completion, you'll receive a{' '}
            <span className="font-semibold">Yoga Alliance RYT-200 Certification</span>
            {' '}and be eligible to register as a Registered Yoga Teacher.
          </p>
        </div>
      </div>
    </section>
  );
}
