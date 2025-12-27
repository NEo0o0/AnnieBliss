import { useState } from 'react';
import { Hero } from './components/Hero';
import { WhyAnnieBliss } from './components/WhyAnnieBliss';
import { StudioPreview } from './components/StudioPreview';
import { ClassRules } from './components/ClassRules';
import { Footer } from './components/Footer';
import { AboutHero } from './components/AboutHero';
import { InstructorProfile } from './components/InstructorProfile';
import { OurVision } from './components/OurVision';
import { Certifications } from './components/Certifications';
import { ClassesHero } from './components/ClassesHero';
import { WeeklySchedule } from './components/WeeklySchedule';
import { ClassTypes } from './components/ClassTypes';
import { ClassDetailHero } from './components/ClassDetailHero';
import { ClassDetailContent } from './components/ClassDetailContent';
import { BookingBar } from './components/BookingBar';
import { TeacherTrainingHero } from './components/TeacherTrainingHero';
import { Curriculum } from './components/Curriculum';
import { SchedulePricing } from './components/SchedulePricing';
import { ApplyCTA } from './components/ApplyCTA';
import { WorkshopsEvents } from './components/WorkshopsEvents';
import { ContactBooking } from './components/ContactBooking';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginRegister } from './components/LoginRegister';
import { MemberDashboard } from './components/MemberDashboard';
import { Pricing } from './components/Pricing';
import { Navbar } from './components/Navbar';
import { AppProvider } from './context/AppContext';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'admin';
  phone?: string;
  lineId?: string;
  packageType?: string;
  creditsLeft?: number;
  totalCredits?: number;
  expiryDate?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  const handleNavigate = (page: string) => {
    // If trying to access admin without auth, redirect to login
    if (page === 'admin' && !isAuthenticated) {
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If trying to access admin but not an admin user, redirect to member dashboard
    if (page === 'admin' && isAuthenticated && currentUser?.role !== 'admin') {
      setCurrentPage('member');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userData: UserData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    // Redirect ALL users to /member after login
    setCurrentPage('member');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAdmin = () => {
    if (currentUser?.role === 'admin') {
      setCurrentPage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Login page (no navbar/footer)
  if (currentPage === 'login') {
    return (
      <AppProvider>
        <LoginRegister 
          onLoginSuccess={handleLoginSuccess}
          onNavigateHome={() => handleNavigate('home')}
        />
      </AppProvider>
    );
  }

  // Member dashboard (no navbar/footer, separate layout)
  if (currentPage === 'member' && isAuthenticated && currentUser) {
    return (
      <AppProvider>
        <MemberDashboard 
          userData={currentUser} 
          onLogout={handleLogout}
          onNavigateToAdmin={handleNavigateToAdmin}
          onNavigateHome={() => handleNavigate('home')}
          onNavigateToPricing={() => handleNavigate('pricing')}
        />
      </AppProvider>
    );
  }

  // Admin dashboard (no navbar/footer)
  if (currentPage === 'admin' && isAuthenticated && currentUser?.role === 'admin') {
    return (
      <AppProvider>
        <AdminDashboard 
          onNavigateHome={() => handleNavigate('home')}
          onLogout={handleLogout}
        />
      </AppProvider>
    );
  }

  // Render public pages with navbar and footer
  return (
    <AppProvider>
      <div className="min-h-screen">
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
        
        {/* Home Page - No top padding (Hero is full-screen) */}
        {currentPage === 'home' && (
          <>
            <Hero />
            <WhyAnnieBliss />
            <StudioPreview />
            <ClassRules />
          </>
        )}
        
        {/* Other pages with padding for fixed navbar */}
        <main className={currentPage !== 'home' ? 'pt-20' : ''}>
          {/* Schedule Page */}
          {currentPage === 'schedule' && (
            <>
              <ClassesHero />
              <WeeklySchedule onNavigate={handleNavigate} />
              <ClassTypes onNavigate={handleNavigate} />
            </>
          )}
          
          {/* Contact Page */}
          {currentPage === 'contact' && (
            <>
              <ContactBooking />
            </>
          )}
          
          {/* Additional pages (accessible via other navigation) */}
          {currentPage === 'about' && (
            <>
              <AboutHero />
              <InstructorProfile />
              <OurVision />
              <Certifications />
            </>
          )}
          
          {currentPage === 'class-detail' && (
            <>
              <ClassDetailHero />
              <ClassDetailContent />
              <BookingBar onNavigate={handleNavigate} />
            </>
          )}
          
          {currentPage === 'teacher-training' && (
            <>
              <TeacherTrainingHero />
              <Curriculum />
              <SchedulePricing onNavigate={handleNavigate} />
              <ApplyCTA />
            </>
          )}
          
          {currentPage === 'workshops' && (
            <>
              <WorkshopsEvents onNavigate={handleNavigate} />
            </>
          )}
          
          {currentPage === 'pricing' && (
            <>
              <Pricing 
                isAuthenticated={isAuthenticated}
                onNavigate={handleNavigate}
              />
            </>
          )}
        </main>
        
        <Footer onNavigate={handleNavigate} />
      </div>
    </AppProvider>
  );
}