export function TeacherTrainingHero() {
  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1758797315487-b3b225dff7d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwdGVhY2hlciUyMHRyYWluaW5nJTIwZ3JvdXB8ZW58MXx8fHwxNzY2NDkxODU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Yoga teacher training group"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <span className="text-sm tracking-wide uppercase">Transform Your Practice</span>
          </div>
          <h1 className="mb-6 text-white">200-Hour Yoga Teacher Training</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Embark on a transformative journey to deepen your practice and share the gift of yoga with others. Our comprehensive program blends ancient wisdom with modern teaching techniques.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white" />
              <span>Yoga Alliance Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white" />
              <span>Small Class Sizes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white" />
              <span>Experienced Instructors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
