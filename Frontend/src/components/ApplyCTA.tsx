import { Send, Phone, Mail } from 'lucide-react';

export function ApplyCTA() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[var(--color-sage)]/20 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Main CTA Box */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[var(--color-sage)] to-[var(--color-clay)] px-8 py-12 text-center text-white">
            <h2 className="mb-4 text-white">Ready to Begin Your Journey?</h2>
            <p className="text-lg opacity-95 max-w-2xl mx-auto">
              Take the first step toward becoming a certified yoga teacher. Limited spaces available for each session.
            </p>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Application Steps */}
            <div className="mb-10">
              <h3 className="mb-6 text-center text-[var(--color-earth-dark)]">Simple Application Process</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-sage)]/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl text-[var(--color-earth-dark)]">1</span>
                  </div>
                  <h4 className="mb-2 text-[var(--color-earth-dark)] text-sm">Submit Application</h4>
                  <p className="text-xs text-[var(--color-stone)]">Complete our online form with your background and intentions</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-sage)]/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl text-[var(--color-earth-dark)]">2</span>
                  </div>
                  <h4 className="mb-2 text-[var(--color-earth-dark)] text-sm">Interview</h4>
                  <p className="text-xs text-[var(--color-stone)]">Connect with us for a brief conversation about your goals</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-sage)]/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl text-[var(--color-earth-dark)]">3</span>
                  </div>
                  <h4 className="mb-2 text-[var(--color-earth-dark)] text-sm">Confirmation</h4>
                  <p className="text-xs text-[var(--color-stone)]">Receive acceptance and secure your spot with a deposit</p>
                </div>
              </div>
            </div>

            {/* Main Apply Button */}
            <div className="text-center mb-8">
              <button className="bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white px-12 py-5 rounded-lg text-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-3 mx-auto group">
                <span>Apply Now</span>
                <Send size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <p className="text-sm text-[var(--color-stone)] mt-4">
                Application deadline: 30 days before session start date
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-sand)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-[var(--color-stone)]">or</span>
              </div>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-[var(--color-cream)] rounded-lg hover:bg-[var(--color-sand)]/50 transition-colors duration-300 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-[var(--color-clay)]" />
                </div>
                <div>
                  <div className="text-sm text-[var(--color-stone)] mb-1">Call Us</div>
                  <div className="text-[var(--color-earth-dark)]">(555) 123-4567</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-[var(--color-cream)] rounded-lg hover:bg-[var(--color-sand)]/50 transition-colors duration-300 cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-[var(--color-clay)]" />
                </div>
                <div>
                  <div className="text-sm text-[var(--color-stone)] mb-1">Email Us</div>
                  <div className="text-[var(--color-earth-dark)]">training@anniebliss.com</div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-[var(--color-sage)]/10 rounded-lg">
              <p className="text-sm text-[var(--color-stone)] text-center">
                <strong className="text-[var(--color-earth-dark)]">Have questions?</strong> Join us for a free info session on the first Saturday of each month at 10 AM. 
                No registration required.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-12 text-center">
          <blockquote className="text-lg italic text-[var(--color-stone)] mb-4 max-w-2xl mx-auto">
            "This training transformed not just my practice, but my entire life. Annie and her team create a supportive, inspiring environment where you truly discover your authentic teaching voice."
          </blockquote>
          <cite className="text-[var(--color-earth-dark)] not-italic">
            — Sarah Martinez, RYT-200, Class of 2024
          </cite>
        </div>
      </div>
    </section>
  );
}
