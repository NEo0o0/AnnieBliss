import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1618425977996-bebc5afe88f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWVkaXRhdGlvbiUyMGNhbG18ZW58MXx8fHwxNzY2NDg0OTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Peaceful yoga meditation"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-white mb-6">Find Your Balance</h1>
        <p className="text-white/90 mb-8 max-w-xl mx-auto">
          Experience mindful movement and inner peace in a nurturing space designed for your wellness journey.
        </p>
        <button className="bg-white text-[var(--color-earth-dark)] px-8 py-4 rounded-full hover:bg-[var(--color-sand)] transition-all duration-300 inline-flex items-center gap-2 shadow-lg">
          Start Your Journey
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
