import { ArrowRight } from 'lucide-react';

interface ClassTypesProps {
  onNavigate?: (page: string) => void;
}

const classTypes = [
  {
    level: 'Basic',
    title: 'Beginner Yoga',
    image: 'https://images.unsplash.com/photo-1758274535024-be3faa30f507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWdpbm5lciUyMHlvZ2ElMjBjbGFzc3xlbnwxfHx8fDE3NjY0OTE0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Perfect for those new to yoga. Learn foundational poses, basic breathwork, and gentle movements in a supportive environment.',
    duration: '60 minutes',
    focus: 'Fundamentals, Alignment, Breath',
  },
  {
    level: 'Intermediate',
    title: 'Intermediate Flow',
    image: 'https://images.unsplash.com/photo-1582106316415-d02d4d0e9066?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcm1lZGlhdGUlMjB5b2dhJTIwZmxvd3xlbnwxfHx8fDE3NjY0OTE0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Build strength and flexibility with dynamic sequences. Explore deeper variations and cultivate mindful flow between poses.',
    duration: '75 minutes',
    focus: 'Vinyasa Flow, Strength, Balance',
  },
  {
    level: 'Advanced',
    title: 'Advanced Practice',
    image: 'https://images.unsplash.com/photo-1766069339604-d4177198af7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZhbmNlZCUyMHlvZ2ElMjBwb3NlfGVufDF8fHx8MTc2NjQ5MTQ5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Challenge your practice with complex transitions, inversions, and advanced asanas. Requires solid foundation and body awareness.',
    duration: '90 minutes',
    focus: 'Inversions, Arm Balances, Advanced Asanas',
  },
];

export function ClassTypes({ onNavigate }: ClassTypesProps) {
  const handleViewDetails = () => {
    if (onNavigate) {
      onNavigate('class-detail');
    }
  };

  return (
    <section className="py-20 px-6 bg-[var(--color-cream)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-[var(--color-earth-dark)]">Class Types</h2>
          <p className="text-[var(--color-stone)] max-w-2xl mx-auto">
            Choose the right class for your experience level and personal goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {classTypes.map((classType, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Thumbnail Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={classType.image}
                  alt={classType.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                {/* Level Badge Overlay */}
                <div className="absolute top-4 right-4 bg-white/95 px-4 py-2 rounded-full shadow-lg">
                  <span className="text-[var(--color-earth-dark)]">{classType.level}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="mb-3 text-[var(--color-earth-dark)]">{classType.title}</h3>
                <p className="text-[var(--color-stone)] mb-4 text-sm">
                  {classType.description}
                </p>

                {/* Class Details */}
                <div className="space-y-2 mb-6 pb-6 border-b border-[var(--color-sand)]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-stone)]">Duration:</span>
                    <span className="text-[var(--color-earth-dark)]">{classType.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-stone)]">Focus:</span>
                    <span className="text-[var(--color-earth-dark)] text-right">{classType.focus}</span>
                  </div>
                </div>

                {/* View Details Button */}
                <button 
                  onClick={handleViewDetails}
                  className="w-full bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  View Details
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
