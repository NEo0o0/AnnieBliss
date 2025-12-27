import { useState } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, MessageCircle, Instagram, Facebook, CheckCircle, Home } from 'lucide-react';
import { supabase } from '../utils/supabase/client';

interface LoginRegisterProps {
  onLoginSuccess: (userData: {
    id: string;
    name: string;
    email: string;
    role: 'member' | 'admin';
    phone?: string;
    contactInfo?: string;
    contactPlatform?: string;
    packageType?: string;
    creditsLeft?: number;
    totalCredits?: number;
    expiryDate?: string;
  }) => void;
  onNavigateHome: () => void;
}

type ContactPlatform = 'line' | 'instagram' | 'facebook' | 'whatsapp';

export function LoginRegister({ onLoginSuccess, onNavigateHome }: LoginRegisterProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [contactPlatform, setContactPlatform] = useState<ContactPlatform>('line');
  const [contactHandle, setContactHandle] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  
  // Error and success states
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Helper function to format contact info into clickable URL
  const formatContactUrl = (platform: ContactPlatform, handle: string): string => {
    if (!handle) return '';
    
    // Remove @ or other special characters
    const cleanHandle = handle.replace(/^@/, '').trim();
    
    switch (platform) {
      case 'line':
        return `https://line.me/ti/p/~${cleanHandle}`;
      case 'instagram':
        return `https://instagram.com/${cleanHandle}`;
      case 'facebook':
        return `https://facebook.com/${cleanHandle}`;
      case 'whatsapp':
        // Remove non-numeric characters for WhatsApp
        const phoneNumber = cleanHandle.replace(/\D/g, '');
        return `https://wa.me/${phoneNumber}`;
      default:
        return '';
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Find user
      const user = mockUsers.find(
        u => u.email === loginEmail && u.password === loginPassword
      );

      if (!user) {
        setLoginError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Successful login
      onLoginSuccess(user);
      setIsLoading(false);
    }, 500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setIsLoading(true);

    // Validation
    if (!registerName || !registerEmail || !registerPhone || !registerPassword) {
      setRegisterError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === registerEmail);
    if (existingUser) {
      setRegisterError('Email already registered. Please login instead.');
      setIsLoading(false);
      return;
    }

    // Format contact info into clickable URL
    const contactUrl = formatContactUrl(contactPlatform, contactHandle);

    // Simulate sending verification email
    setTimeout(() => {
      setVerificationSent(true);
      setIsLoading(false);

      // Simulate auto-login after 3 seconds (in real app, user would verify email first)
      setTimeout(() => {
        // Create new user
        const newUser = {
          id: `user_${Date.now()}`,
          name: registerName,
          email: registerEmail,
          phone: registerPhone,
          contactInfo: contactUrl, // Store as full URL
          contactPlatform: contactPlatform,
          role: 'member' as const,
          packageType: 'Drop-in' // Default package
        };

        // Auto-login (in real app, this would happen after email verification)
        onLoginSuccess(newUser);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-cream)] via-white to-[var(--color-sand)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl text-[var(--color-earth-dark)] mb-2">Annie Bliss Yoga</h1>
          <p className="text-[var(--color-stone)]">Find Your Balance</p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2 bg-[var(--color-cream)]">
            <button
              onClick={() => {
                setActiveTab('login');
                setLoginError('');
                setRegisterError('');
              }}
              className={`py-4 transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-white text-[var(--color-sage)] shadow-md'
                  : 'text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setLoginError('');
                setRegisterError('');
              }}
              className={`py-4 transition-all duration-300 ${
                activeTab === 'register'
                  ? 'bg-white text-[var(--color-sage)] shadow-md'
                  : 'text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Forms */}
          <div className="p-8">
            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm text-[var(--color-stone)] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)]"
                    />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-stone)] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)]"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Login
                </button>

                <div className="text-center text-sm text-[var(--color-stone)]">
                  <p>Demo Credentials:</p>
                  <p className="mt-1">Member: sarah@email.com / member123</p>
                  <p>Admin: admin@anniebliss.com / admin123</p>
                </div>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-sm text-[var(--color-stone)] mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)]"
                    />
                    <input
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-stone)] mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)]"
                    />
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-stone)] mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)]"
                    />
                    <input
                      type="tel"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                      placeholder="+66 81 234 5678"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-stone)] mb-2">
                    Contact Platform (Optional)
                  </label>
                  <div className="relative">
                    <MessageCircle
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)]"
                    />
                    <select
                      value={contactPlatform}
                      onChange={(e) => setContactPlatform(e.target.value as ContactPlatform)}
                      className="w-full pl-12 pr-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                    >
                      <option value="line">Line</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-stone)] mb-2">
                    Contact Handle (Optional)
                  </label>
                  <div className="relative">
                    {contactPlatform === 'line' && (
                      <MessageCircle
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)]"
                      />
                    )}
                    {contactPlatform === 'instagram' && (
                      <Instagram
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)]"
                      />
                    )}
                    {contactPlatform === 'facebook' && (
                      <Facebook
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)]"
                      />
                    )}
                    <input
                      type="text"
                      value={contactHandle}
                      onChange={(e) => setContactHandle(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                      placeholder={contactPlatform === 'line' ? '@yourlineID' : 'your handle'}
                    />
                  </div>
                  <p className="text-xs text-[var(--color-stone)] mt-1">
                    Preferred contact method for class updates
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-stone)] mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)]"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)] hover:text-[var(--color-earth-dark)]"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-stone)] mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-stone)]"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {registerError && (
                  <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {registerError}
                  </div>
                )}

                {verificationSent ? (
                  <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">
                    Verification email sent. Please check your inbox.
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Create Account
                  </button>
                )}

                <p className="text-xs text-center text-[var(--color-stone)]">
                  By registering, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={onNavigateHome}
            className="text-[var(--color-stone)] hover:text-[var(--color-sage)] transition-colors flex items-center gap-2 mx-auto"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Mock users for demonstration purposes
const mockUsers = [
  {
    id: 'user_1',
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    password: 'member123',
    phone: '+66 81 234 5678',
    contactInfo: 'https://line.me/ti/p/~sarahline',
    contactPlatform: 'line',
    role: 'member' as const,
    packageType: 'Drop-in' // Default package
  },
  {
    id: 'user_2',
    name: 'Admin User',
    email: 'admin@anniebliss.com',
    password: 'admin123',
    phone: '+66 81 234 5678',
    contactInfo: 'https://instagram.com/adminuser',
    contactPlatform: 'instagram',
    role: 'admin' as const,
    packageType: 'Drop-in' // Default package
  }
];