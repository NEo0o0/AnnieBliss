import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  DollarSign, 
  Settings, 
  FileText, 
  TrendingUp,
  UserCheck,
  CreditCard,
  Clock,
  User,
  Plus,
  Menu,
  X,
  Home,
  LogOut,
  ChevronDown,
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  ExternalLink,
  AlertCircle,
  Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CreateClassModal } from './CreateClassModal';
import { ClassManagement } from './ClassManagement';
import { MembersManagement } from './MembersManagement';
import { PaymentsManagement } from './PaymentsManagement';
import { ReportsAnalytics } from './ReportsAnalytics';
import { TodaysClassesTable } from './TodaysClassesTable';
import { NewsletterSubscribers } from './NewsletterSubscribers';
import { ManualBookingModal } from './ManualBookingModal';
import { toast } from 'sonner';

// Mock student bookings for each class
const mockBookings = {
  1: [ // Morning Vinyasa Flow
    {
      id: 'b1',
      studentId: 's1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      phone: '+66 81 234 5678',
      contactInfo: 'https://line.me/ti/p/~sarahline',
      contactPlatform: 'line',
      status: 'confirmed',
      bookingTime: '2025-12-20 08:30 AM',
    },
    {
      id: 'b2',
      studentId: 's2',
      name: 'Emma Wilson',
      avatar: 'EW',
      phone: '+66 82 345 6789',
      contactInfo: 'https://instagram.com/emmawilson',
      contactPlatform: 'instagram',
      status: 'confirmed',
      bookingTime: '2025-12-21 10:15 AM',
    },
    {
      id: 'b3',
      studentId: 's3',
      name: 'Michael Chen',
      avatar: 'MC',
      phone: '+66 83 456 7890',
      contactInfo: 'https://wa.me/66834567890',
      contactPlatform: 'whatsapp',
      status: 'checked-in',
      bookingTime: '2025-12-19 02:00 PM',
    },
    {
      id: 'b4',
      studentId: 's4',
      name: 'Lisa Anderson',
      avatar: 'LA',
      phone: '+66 84 567 8901',
      contactInfo: '',
      contactPlatform: '',
      status: 'confirmed',
      bookingTime: '2025-12-22 11:45 AM',
    },
  ],
  2: [ // Gentle Yoga
    {
      id: 'b5',
      studentId: 's5',
      name: 'David Kim',
      avatar: 'DK',
      phone: '+66 85 678 9012',
      contactInfo: 'https://line.me/ti/p/~davidkim',
      contactPlatform: 'line',
      status: 'confirmed',
      bookingTime: '2025-12-23 09:00 AM',
    },
    {
      id: 'b6',
      studentId: 's6',
      name: 'Sophia Martinez',
      avatar: 'SM',
      phone: '+66 86 789 0123',
      contactInfo: 'https://facebook.com/sophiamartinez',
      contactPlatform: 'facebook',
      status: 'confirmed',
      bookingTime: '2025-12-23 10:30 AM',
    },
  ],
  3: [ // Power Yoga - Full
    {
      id: 'b7',
      studentId: 's7',
      name: 'James Taylor',
      avatar: 'JT',
      phone: '+66 87 890 1234',
      contactInfo: 'https://line.me/ti/p/~jamestaylor',
      contactPlatform: 'line',
      status: 'checked-in',
      bookingTime: '2025-12-20 01:00 PM',
    },
    {
      id: 'b8',
      studentId: 's8',
      name: 'Olivia Brown',
      avatar: 'OB',
      phone: '+66 88 901 2345',
      contactInfo: 'https://instagram.com/oliviabrown',
      contactPlatform: 'instagram',
      status: 'confirmed',
      bookingTime: '2025-12-21 03:45 PM',
    },
  ],
  4: [ // Restorative Yin
    {
      id: 'b9',
      studentId: 's9',
      name: 'Daniel Lee',
      avatar: 'DL',
      phone: '+66 89 012 3456',
      contactInfo: 'https://wa.me/66890123456',
      contactPlatform: 'whatsapp',
      status: 'confirmed',
      bookingTime: '2025-12-22 02:15 PM',
    },
  ],
  5: [ // Evening Flow
    {
      id: 'b10',
      studentId: 's10',
      name: 'Ava Garcia',
      avatar: 'AG',
      phone: '+66 90 123 4567',
      contactInfo: 'https://line.me/ti/p/~avagarcia',
      contactPlatform: 'line',
      status: 'confirmed',
      bookingTime: '2025-12-23 08:00 AM',
    },
  ],
};

const todaysClasses = [
  {
    id: 1,
    name: 'Morning Vinyasa Flow',
    time: '6:00 AM - 7:00 AM',
    booked: 12,
    capacity: 15,
    instructor: 'Annie Bliss',
  },
  {
    id: 2,
    name: 'Gentle Yoga',
    time: '8:00 AM - 9:00 AM',
    booked: 8,
    capacity: 12,
    instructor: 'Sarah Chen',
  },
  {
    id: 3,
    name: 'Power Yoga',
    time: '12:00 PM - 1:00 PM',
    booked: 15,
    capacity: 15,
    instructor: 'Annie Bliss',
  },
  {
    id: 4,
    name: 'Restorative Yin',
    time: '5:30 PM - 6:45 PM',
    booked: 10,
    capacity: 15,
    instructor: 'Maya Rodriguez',
  },
  {
    id: 5,
    name: 'Evening Flow',
    time: '7:00 PM - 8:00 PM',
    booked: 14,
    capacity: 15,
    instructor: 'Annie Bliss',
  },
];

interface AdminDashboardProps {
  onNavigateHome?: () => void;
  onLogout?: () => void;
}

export function AdminDashboard({ onNavigateHome, onLogout }: AdminDashboardProps = {}) {
  const { classes, setIsLoggedIn } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{ id: number; name: string; time: string } | null>(null);
  const [bookingsState, setBookingsState] = useState(mockBookings);
  const [mockMembers, setMockMembers] = useState([
    {
      id: 's1',
      fullName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+66 81 234 5678',
      avatar: 'SJ',
      packageType: 'unlimited' as const,
      packageName: 'Unlimited Monthly',
      creditsLeft: undefined
    },
    {
      id: 's2',
      fullName: 'Emma Wilson',
      email: 'emma.w@email.com',
      phone: '+66 82 345 6789',
      avatar: 'EW',
      packageType: 'class-pack' as const,
      packageName: '10-Class Pack',
      creditsLeft: 7
    },
    {
      id: 's3',
      fullName: 'Michael Chen',
      email: 'michael.c@email.com',
      phone: '+66 83 456 7890',
      avatar: 'MC',
      packageType: 'class-pack' as const,
      packageName: '20-Class Pack',
      creditsLeft: 15
    }
  ]);

  // Simulate login when accessing admin
  useEffect(() => {
    setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  const getCapacityColor = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  const getCapacityBg = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100;
    if (percentage >= 90) return 'bg-red-100';
    if (percentage >= 70) return 'bg-orange-100';
    return 'bg-green-100';
  };

  const handleNavigateHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      setIsLoggedIn(false);
      window.location.reload();
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    closeMobileSidebar();
  };

  const handleManualBooking = (classId: number, className: string, classTime: string) => {
    setSelectedClass({ id: classId, name: className, time: classTime });
    setShowManualBookingModal(true);
  };

  const handleBookingComplete = (booking: any, payment?: any) => {
    // Add new booking to state
    const classId = booking.class_id;
    setBookingsState(prev => ({
      ...prev,
      [classId]: [...(prev[classId] || []), booking]
    }));

    // If payment info is provided (for walk-in guests), create payment record
    if (payment && payment.isPaid) {
      const paymentRecord = {
        id: `payment-${Date.now()}`,
        title: `Drop-in: ${booking.guest_name} - ${selectedClass?.name || 'Class'}`,
        category: 'income',
        amount: payment.amount,
        date: new Date().toISOString().split('T')[0],
        method: payment.method,
        status: 'completed'
      };
      
      // TODO: In real implementation, save this to database
      console.log('Payment created:', paymentRecord);
      
      toast.success(`Booking and payment (฿${payment.amount}) recorded successfully!`, {
        duration: 4000
      });
    }
  };

  const handleMarkAsPaid = async (bookingId: string, classId: number, className: string, amount: number) => {
    try {
      // Update booking payment status in state
      setBookingsState(prev => ({
        ...prev,
        [classId]: (prev[classId] || []).map(booking => 
          booking.id === bookingId 
            ? { ...booking, paymentStatus: 'paid' }
            : booking
        )
      }));

      // Create payment record
      const booking = bookingsState[classId]?.find(b => b.id === bookingId);
      const paymentRecord = {
        id: `payment-${Date.now()}`,
        title: `Drop-in: ${booking?.name} - ${className}`,
        category: 'income',
        amount: amount,
        date: new Date().toISOString().split('T')[0],
        method: 'cash',
        status: 'completed'
      };
      
      // TODO: In real implementation, call API endpoint
      // PATCH /make-server-baa97425/bookings/${bookingId}/mark-paid
      console.log('Payment created for previously unpaid booking:', paymentRecord);
      
      toast.success(`Payment (฿${amount}) recorded successfully!`, {
        duration: 4000
      });
    } catch (error) {
      console.error('Error marking booking as paid:', error);
      toast.error('Failed to record payment');
    }
  };

  const handleMemberRegistered = (member: any) => {
    setMockMembers(prev => [...prev, member]);
  };

  const renderPlaceholder = (title: string) => (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl text-[var(--color-earth-dark)] mb-4">{title}</h1>
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-[var(--color-stone)] text-lg">This section is coming soon!</p>
      </div>
    </div>
  );

  // Sidebar Content Component (reusable for desktop and mobile)
  const SidebarContent = () => (
    <>
      {/* Logo/Brand */}
      <div className="p-6 border-b border-[var(--color-sand)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[var(--color-earth-dark)]">Annie Bliss Yoga</h2>
            <p className="text-xs text-[var(--color-stone)] mt-1">Admin Dashboard</p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={closeMobileSidebar}
            className="md:hidden p-2 hover:bg-[var(--color-cream)] rounded-lg transition-colors"
          >
            <X size={24} className="text-[var(--color-stone)]" />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => handleSectionChange('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentSection === 'dashboard' 
                  ? 'bg-[var(--color-sage)] text-white' 
                  : 'text-[var(--color-stone)] hover:bg-[var(--color-cream)]'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleSectionChange('classes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentSection === 'classes' 
                  ? 'bg-[var(--color-sage)] text-white' 
                  : 'text-[var(--color-stone)] hover:bg-[var(--color-cream)]'
              }`}
            >
              <Calendar size={20} />
              <span>Classes</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleSectionChange('members')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentSection === 'members' 
                  ? 'bg-[var(--color-sage)] text-white' 
                  : 'text-[var(--color-stone)] hover:bg-[var(--color-cream)]'
              }`}
            >
              <Users size={20} />
              <span>Members</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleSectionChange('payments')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentSection === 'payments' 
                  ? 'bg-[var(--color-sage)] text-white' 
                  : 'text-[var(--color-stone)] hover:bg-[var(--color-cream)]'
              }`}
            >
              <DollarSign size={20} />
              <span>Payments</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleSectionChange('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentSection === 'reports' 
                  ? 'bg-[var(--color-sage)] text-white' 
                  : 'text-[var(--color-stone)] hover:bg-[var(--color-cream)]'
              }`}
            >
              <FileText size={20} />
              <span>Reports</span>
            </button>
          </li>
        </ul>

        {/* Divider */}
        <div className="my-6 border-t border-[var(--color-sand)]" />

        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => handleSectionChange('subscribers')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentSection === 'subscribers' 
                  ? 'bg-[var(--color-sage)] text-white' 
                  : 'text-[var(--color-stone)] hover:bg-[var(--color-cream)]'
              }`}
            >
              <Mail size={20} />
              <span>Subscribers</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => handleSectionChange('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentSection === 'settings' 
                  ? 'bg-[var(--color-sage)] text-white' 
                  : 'text-[var(--color-stone)] hover:bg-[var(--color-cream)]'
              }`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Bottom Section - User Info and Actions */}
      <div className="mt-auto border-t border-[var(--color-sand)]">
        {/* User Info */}
        <div className="p-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--color-cream)]">
            <div className="w-10 h-10 rounded-full bg-[var(--color-sage)] flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-[var(--color-earth-dark)] truncate">Admin User</div>
              <div className="text-xs text-[var(--color-stone)]">admin@anniebliss.com</div>
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="p-4 space-y-2">
          <button
            onClick={handleNavigateHome}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--color-stone)] hover:bg-[var(--color-cream)] transition-all duration-300"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[var(--color-cream)]">
      {/* Mobile Header - Only visible on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-30">
        <div className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-lg text-[var(--color-earth-dark)]">Annie Bliss Yoga</h2>
            <p className="text-xs text-[var(--color-stone)]">Admin Dashboard</p>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 hover:bg-[var(--color-cream)] rounded-lg transition-colors"
          >
            <Menu size={24} className="text-[var(--color-earth-dark)]" />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar - Hidden on mobile, visible on desktop */}
      <aside className="hidden md:flex md:w-64 bg-white shadow-xl flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - Slide-over drawer */}
      {isMobileSidebarOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={closeMobileSidebar}
          />
          
          {/* Slide-over sidebar (80% width on mobile) */}
          <aside 
            className={`md:hidden fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto mt-16 md:mt-0">
        {/* Render current section */}
        {currentSection === 'dashboard' && (
          <>
            {/* Top Bar */}
            <div className="bg-white shadow-sm px-4 md:px-8 py-4 md:py-6 border-b border-[var(--color-sand)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl text-[var(--color-earth-dark)] mb-1">Dashboard</h1>
                  <p className="text-sm md:text-base text-[var(--color-stone)]">Wednesday, December 24, 2025</p>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-xs md:text-sm text-[var(--color-stone)]">Current Time</div>
                  <div className="text-xl md:text-2xl text-[var(--color-earth-dark)]">2:45 PM</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-8">
              {/* Stats Overview */}
              <div className="mb-8">
                <h2 className="mb-6 text-lg md:text-xl text-[var(--color-earth-dark)]">Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* Total Bookings Card */}
                  <div className="bg-white rounded-lg p-4 md:p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Calendar size={20} className="md:w-6 md:h-6 text-blue-600" />
                      </div>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp size={12} />
                        12%
                      </span>
                    </div>
                    <div className="text-2xl md:text-3xl text-[var(--color-earth-dark)] mb-1">247</div>
                    <div className="text-sm text-[var(--color-stone)]">Total Bookings</div>
                    <div className="text-xs text-[var(--color-stone)] mt-2">This month</div>
                  </div>

                  {/* Active Members Card */}
                  <div className="bg-white rounded-lg p-4 md:p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Users size={20} className="md:w-6 md:h-6 text-purple-600" />
                      </div>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp size={12} />
                        8%
                      </span>
                    </div>
                    <div className="text-2xl md:text-3xl text-[var(--color-earth-dark)] mb-1">156</div>
                    <div className="text-sm text-[var(--color-stone)]">Active Members</div>
                    <div className="text-xs text-[var(--color-stone)] mt-2">Current month</div>
                  </div>

                  {/* Revenue Card */}
                  <div className="bg-white rounded-lg p-4 md:p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-green-100 flex items-center justify-center">
                        <DollarSign size={20} className="md:w-6 md:h-6 text-green-600" />
                      </div>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp size={12} />
                        15%
                      </span>
                    </div>
                    <div className="text-2xl md:text-3xl text-[var(--color-earth-dark)] mb-1">฿82,450</div>
                    <div className="text-sm text-[var(--color-stone)]">Revenue</div>
                    <div className="text-xs text-[var(--color-stone)] mt-2">This month</div>
                  </div>

                  {/* Drop-ins Card */}
                  <div className="bg-white rounded-lg p-4 md:p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                        <UserCheck size={20} className="md:w-6 md:h-6 text-orange-600" />
                      </div>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp size={12} />
                        5%
                      </span>
                    </div>
                    <div className="text-2xl md:text-3xl text-[var(--color-earth-dark)] mb-1">43</div>
                    <div className="text-sm text-[var(--color-stone)]">Drop-ins</div>
                    <div className="text-xs text-[var(--color-stone)] mt-2">This month</div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Today's Classes Table */}
                <div className="lg:col-span-2">
                  <TodaysClassesTable 
                    classes={todaysClasses} 
                    bookings={bookingsState}
                    onManualBooking={handleManualBooking}
                    onMarkAsPaid={handleMarkAsPaid}
                  />
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                    <h3 className="mb-6 text-base md:text-lg text-[var(--color-earth-dark)]">Quick Actions</h3>
                    
                    <div className="space-y-4">
                      {/* Check-in User Button */}
                      <button className="w-full bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white px-4 md:px-6 py-3 md:py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-3 group">
                        <UserCheck size={20} className="group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-sm md:text-base">Check-in User</span>
                      </button>

                      {/* Record Payment Button */}
                      <button className="w-full bg-[var(--color-earth-dark)] hover:bg-[var(--color-clay)] text-white px-4 md:px-6 py-3 md:py-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-3 group">
                        <CreditCard size={20} className="group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-sm md:text-base">Record Payment</span>
                      </button>

                      {/* Divider */}
                      <div className="border-t border-[var(--color-sand)] my-6" />

                      {/* Additional Quick Links */}
                      <div className="space-y-2">
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-[var(--color-sage)] hover:bg-[var(--color-cream)] transition-colors duration-300 border-2 border-[var(--color-sage)] hover:border-[var(--color-clay)] text-sm md:text-base"
                        >
                          <Plus size={18} />
                          <span>Add New Class</span>
                        </button>
                        <button
                          onClick={() => handleSectionChange('classes')}
                          className="w-full text-left px-4 py-3 rounded-lg text-[var(--color-stone)] hover:bg-[var(--color-cream)] transition-colors duration-300 text-sm md:text-base"
                        >
                          → Manage Class Templates
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Widget */}
                  <div className="bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] rounded-lg shadow-md p-4 md:p-6 mt-6 text-white">
                    <h4 className="mb-4 text-base md:text-lg">Today's Summary</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm opacity-90">Total Check-ins</span>
                        <span className="text-xl md:text-2xl">38</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm opacity-90">Classes Completed</span>
                        <span className="text-xl md:text-2xl">3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm opacity-90">Revenue Today</span>
                        <span className="text-xl md:text-2xl">฿4,200</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {currentSection === 'classes' && <ClassManagement />}
        {currentSection === 'members' && <MembersManagement />}
        {currentSection === 'payments' && <PaymentsManagement />}
        {currentSection === 'reports' && <ReportsAnalytics />}
        {currentSection === 'subscribers' && <NewsletterSubscribers />}
        {currentSection === 'settings' && renderPlaceholder('Settings')}
      </main>
      
      {/* Create Class Modal */}
      {showCreateModal && (
        <CreateClassModal onClose={() => setShowCreateModal(false)} />
      )}
      
      {/* Manual Booking Modal */}
      {showManualBookingModal && selectedClass && (
        <ManualBookingModal
          isOpen={showManualBookingModal}
          onClose={() => setShowManualBookingModal(false)}
          classId={selectedClass.id}
          className={selectedClass.name}
          classTime={selectedClass.time}
          onBookingComplete={handleBookingComplete}
          members={mockMembers}
        />
      )}
    </div>
  );
}