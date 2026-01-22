export function InstructorProfile() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Portrait */}
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-[var(--color-sand)] rounded-lg -z-10"></div>
              <img
                src="/images/instructor/annie.jpg"
                alt="Annie Bliss - Yoga Instructor"
                className="w-full h-auto rounded-lg shadow-xl object-cover"
              />
            </div>
          </div>

          {/* Biography */}
          <div className="order-1 md:order-2">
            <h2 className="mb-6 text-[var(--color-earth-dark)]">Meet Annie Bliss</h2>
            <div className="space-y-4 text-[var(--color-stone)]">
              <p>
                Annie discovered yoga over 15 years ago during a transformative journey through Southeast Asia. What began as a physical practice quickly evolved into a profound spiritual awakening that would reshape her entire life's purpose.
              </p>
              <p>
                After completing her 500-hour advanced teacher training in Rishikesh, India, Annie returned home with a deep commitment to sharing the healing power of yoga with her community. Her teaching style blends traditional Hatha and Vinyasa flows with mindfulness meditation and breathwork.
              </p>
              <p>
                Annie believes that yoga is not about perfection—it's about presence. Her classes create a safe, inclusive space where students of all levels can explore their practice without judgment, connecting to their inner wisdom and authentic self.
              </p>
              <p>
                When she's not on the mat, Annie enjoys hiking in nature, practicing ceramics, and spending time with her rescue dog, Luna. She continues to deepen her studies in yoga philosophy, anatomy, and trauma-informed teaching practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
