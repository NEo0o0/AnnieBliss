import {
  Calendar,
  Mail,
  LogIn,
  Menu,
  X,
  Sparkles,
  GraduationCap,
  Package,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({
  currentPage,
  onNavigate,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workshopsDropdownOpen, setWorkshopsDropdownOpen] =
    useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for transparent-to-solid background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "pricing", label: "Pricing", icon: Package },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const workshopsItems = [
    {
      id: "workshops",
      label: "Workshops & Events",
      icon: Sparkles,
    },
    {
      id: "teacher-training",
      label: "Teacher Training",
      icon: GraduationCap,
    },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    setWorkshopsDropdownOpen(false);
  };

  const handleLogoClick = () => {
    onNavigate("home");
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md"
          : "bg-white/95 backdrop-blur-sm shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Clean Side-by-Side Layout */}
          <Logo onClick={handleLogoClick} />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Regular Nav Links */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2 px-1 py-2 transition-all duration-300 border-b-2 ${
                    isActive
                      ? "border-[var(--color-sage)] text-[var(--color-sage)]"
                      : "border-transparent text-[var(--color-stone)] hover:text-[var(--color-earth-dark)] hover:border-[var(--color-sand)]"
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span className="font-medium">
                    {link.label}
                  </span>
                </button>
              );
            })}

            {/* Workshops & Training Dropdown */}
            {/* 1. ย้าย Event Handlers มาไว้ที่ตัวแม่สุด (relative) */}
            <div
              className="relative"
              onMouseEnter={() =>
                setWorkshopsDropdownOpen(true)
              }
              onMouseLeave={() =>
                setWorkshopsDropdownOpen(false)
              }
            >
              <button
                onClick={() =>
                  setWorkshopsDropdownOpen(
                    !workshopsDropdownOpen,
                  )
                }
                className={`flex items-center gap-2 px-1 py-2 transition-all duration-300 border-b-2 ${
                  currentPage === "workshops" ||
                  currentPage === "teacher-training"
                    ? "border-[var(--color-sage)] text-[var(--color-sage)]"
                    : "border-transparent text-[var(--color-stone)] hover:text-[var(--color-earth-dark)] hover:border-[var(--color-sand)]"
                }`}
              >
                <Sparkles size={18} strokeWidth={2} />
                <span className="font-medium">Workshops</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    workshopsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {workshopsDropdownOpen && (
                /* 2. สร้าง Div ครอบเพื่อทำ "สะพาน" (Padding Bridge) */
                /* ใช้ pt-2 แทน mt-2 เพื่อให้พื้นที่ว่างถือเป็นส่วนหนึ่งของ element */
                <div className="absolute top-full left-0 pt-2 w-56 animate-fadeIn z-50">
                  {/* 3. ตัวกล่องเมนูจริงๆ ย้าย style (bg, border, shadow) มาไว้ข้างในนี้แทน */}
                  <div className="bg-white rounded-xl shadow-2xl border border-[var(--color-sand)] overflow-hidden">
                    {workshopsItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() =>
                            handleNavClick(item.id)
                          }
                          className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 ${
                            isActive
                              ? "bg-[var(--color-sage)]/10 text-[var(--color-sage)]"
                              : "text-[var(--color-stone)] hover:bg-[var(--color-cream)] hover:text-[var(--color-earth-dark)]"
                          }`}
                        >
                          <Icon size={18} strokeWidth={2} />
                          <span className="font-medium">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Login Button - Primary Action */}
            <button
              onClick={() => handleNavClick("login")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[var(--color-sage)] to-[var(--color-clay)] text-white hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
            >
              <LogIn size={18} strokeWidth={2} />
              <span>Login</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg hover:bg-[var(--color-cream)] transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X
                size={24}
                className="text-[var(--color-earth-dark)]"
                strokeWidth={2}
              />
            ) : (
              <Menu
                size={24}
                className="text-[var(--color-earth-dark)]"
                strokeWidth={2}
              />
            )}
          </button>
        </div>

        {/* Mobile Menu - Clean Slide-Down */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-[var(--color-sand)] animate-fadeIn">
            <div className="space-y-2">
              {/* Regular Nav Links */}
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--color-sage)] text-white shadow-md"
                        : "text-[var(--color-stone)] hover:bg-[var(--color-cream)] hover:text-[var(--color-earth-dark)]"
                    }`}
                  >
                    <Icon size={20} strokeWidth={2} />
                    <span className="font-medium">
                      {link.label}
                    </span>
                  </button>
                );
              })}

              {/* Workshops Section */}
              <div className="pt-2 pb-2">
                <div className="px-4 py-2 text-xs font-semibold text-[var(--color-stone)] uppercase tracking-wider">
                  Workshops & Training
                </div>
                {workshopsItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-[var(--color-sage)] text-white shadow-md"
                          : "text-[var(--color-stone)] hover:bg-[var(--color-cream)] hover:text-[var(--color-earth-dark)]"
                      }`}
                    >
                      <Icon size={20} strokeWidth={2} />
                      <span className="font-medium">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Login Button - Mobile */}
              <button
                onClick={() => handleNavClick("login")}
                className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl bg-gradient-to-r from-[var(--color-sage)] to-[var(--color-clay)] text-white hover:opacity-90 transition-all duration-300 shadow-lg font-medium mt-4"
              >
                <LogIn size={20} strokeWidth={2} />
                <span>Login</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}