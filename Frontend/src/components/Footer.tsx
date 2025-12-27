import { Instagram, MessageCircle,MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const navigationLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Schedule', page: 'schedule' },
    { label: 'Pricing', page: 'pricing' },
    { label: 'Workshops', page: 'workshops' },
    { label: 'Teacher Training', page: 'teacher-training' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const socialLinks = [
    { 
      icon: MessageCircle, 
      href: 'https://wa.me/66844207947', 
      label: 'WhatsApp',
      color: 'hover:bg-[#25D366]/20'
    },
    { 
      icon: Instagram, 
      href: 'https://www.instagram.com/annie_bliss_yoga?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', 
      label: 'Instagram',
      color: 'hover:bg-[#E4405F]/20'
    },
    { 
      icon: MapPin, 
      href: 'https://maps.app.goo.gl/3cDFZzsVmXx6s32f6', 
      label: 'MapPin',
      color: 'hover:bg-[#E4405F]/20'
    },
  ];

  const handleLinkClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="bg-[var(--color-earth-dark)] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-white">Annie Bliss Yoga</h3>
            <p className="text-white/70 text-sm">
              Creating a sanctuary for transformation through mindful movement and intentional practice.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-white">Explore</h3>
            <nav className="flex flex-col gap-2">
              {navigationLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(link.page)}
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 text-white">Connect</h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-full bg-white/10 ${social.color} flex items-center justify-center transition-colors duration-200`}
                >
                  <social.icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Annie Bliss Yoga. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}