import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { VotingSystem } from './components/VotingSystem';
import { ElectionResults } from './components/ElectionResults';
import { Governance } from './components/Governance';
import { TaxManagement } from './components/TaxManagement';
import { CivicEngagement } from './components/CivicEngagement';
import { SignupForm } from './components/SignupForm';
import { LogoutConfirmation } from './components/LogoutConfirmation';
import { DeleteAccount } from './components/DeleteAccount';
import { AccountSettings } from './components/AccountSettings';
import { ChatBot } from './components/ChatBot';
import { LanguageSelector } from './components/LanguageSelector';
import { AdminDashboard } from './components/AdminDashboard';
import { LandingPage } from './components/LandingPage';

interface User {
  name: string;
  email: string;
  mobile: string;
  citizenId: string;
}

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);

  const handleSignupComplete = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowLandingPage(false);
  };

  const handleAdminLogin = () => {
    setShowAdminDashboard(true);
    setShowLandingPage(false);
  };

  const handleCitizenLogin = () => {
    setShowLandingPage(false);
  };

  // Listen for registration events dispatched by VotingSignup so SPA can react without reload
  React.useEffect(() => {
    const onRegistered = (e: any) => {
      try {
        const detail = e?.detail;
        const storedUser = detail?.user || JSON.parse(localStorage.getItem('voting-user') || 'null');
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
          setActiveSection('voting');
        }
      } catch (err) {
        console.warn('Error handling voting:registered event:', err);
      }
    };

    window.addEventListener('voting:registered', onRegistered as EventListener);

    return () => window.removeEventListener('voting:registered', onRegistered as EventListener);
  }, []);

  const handleLogoutRequest = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveSection('dashboard');
    setShowLogoutConfirmation(false);
    setShowLandingPage(true);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  const handleDeleteAccountRequest = () => {
    setShowDeleteAccount(true);
  };

  const handleDeleteAccountComplete = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveSection('dashboard');
    setShowDeleteAccount(false);
    setShowLandingPage(true);
  };

  const handleDeleteAccountCancel = () => {
    setShowDeleteAccount(false);
  };

  const handleLanguageChange = (language: any) => {
    setSelectedLanguage(language.code);
    console.log('Language changed to:', language.name);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'voting':
        return <VotingSystem user={user || undefined} />;
      case 'results':
        return <ElectionResults />;
      case 'governance':
        return <Governance />;
      case 'tax':
        return <TaxManagement />;
      case 'civic':
        return <CivicEngagement />;
      case 'account':
        return (
          <AccountSettings 
            user={user!}
            onLogoutRequest={handleLogoutRequest}
            onDeleteAccountRequest={handleDeleteAccountRequest}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  // Show landing page first
  if (showLandingPage) {
    return (
      <LandingPage 
        onAdminLogin={handleAdminLogin}
        onCitizenLogin={handleCitizenLogin}
      />
    );
  }

  // Show admin dashboard if requested
  if (showAdminDashboard) {
    return (
      <AdminDashboard 
        onBackToLanding={() => {
          setShowAdminDashboard(false);
          setShowLandingPage(true);
        }}
      />
    );
  }

  // Show delete account page
  if (isAuthenticated && showDeleteAccount && user) {
    return (
      <DeleteAccount 
        user={user}
        onAccountDeleted={handleDeleteAccountComplete}
        onCancel={handleDeleteAccountCancel}
      />
    );
  }

  // Show logout confirmation
  if (isAuthenticated && showLogoutConfirmation && user) {
    return (
      <LogoutConfirmation 
        user={user}
        onConfirmLogout={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    );
  }

  // Show signup form if user is not authenticated
  if (!isAuthenticated) {
    return <SignupForm onSignupComplete={handleSignupComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF9933' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        user={user}
        onLogout={handleLogoutRequest}
      />
      
      <main className="relative container mx-auto px-4 py-8">
        <div className="animate-in fade-in-0 duration-500">
          {renderContent()}
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white mt-16 overflow-hidden">
        {/* Footer Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20zM0 20v20h20c0-11.046-8.954-20-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Decorative Elements - Indian Flag Colors */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-green-600" />
        
        <div className="relative container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
                  🇮🇳
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-orange-300 to-green-300 bg-clip-text text-transparent">
                    Digital India
                  </h3>
                  <p className="text-slate-400 text-sm">Governance Portal</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Empowering citizens through digital governance, transparent administration, and seamless public services.
              </p>
              <div className="flex space-x-4 pt-4">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                  <span className="text-sm">📱</span>
                </div>
                <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <span className="text-sm">💬</span>
                </div>
                <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer">
                  <span className="text-sm">📧</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Help Center', 'Contact Support'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="w-1 h-1 bg-orange-400 rounded-full mr-3 group-hover:bg-orange-300 transition-colors" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Digital Voting', icon: '🗳️' },
                  { name: 'Tax Filing', icon: '💰' },
                  { name: 'Civic Services', icon: '🏘️' },
                  { name: 'Government Transparency', icon: '🏛️' }
                ].map((service) => (
                  <li key={service.name}>
                    <a href="#" className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group">
                      <span className="mr-3 text-sm group-hover:scale-110 transition-transform">
                        {service.icon}
                      </span>
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Emergency Services</h4>
              <div className="space-y-4">
                {[
                  { service: 'Police', number: '100', icon: '🚔' },
                  { service: 'Fire', number: '101', icon: '🚒' },
                  { service: 'Ambulance', number: '102', icon: '🚑' },
                  { service: 'Disaster', number: '108', icon: '🆘' }
                ].map((emergency) => (
                  <div key={emergency.service} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{emergency.icon}</span>
                      <span className="text-slate-300">{emergency.service}</span>
                    </div>
                    <span className="font-bold text-red-400">{emergency.number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-400 text-center md:text-left">
                &copy; 2024 Government of India. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-slate-400">
                <span>Made with</span>
                <span className="text-red-400 animate-pulse">❤️</span>
                <span>for Digital India</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Right Components */}
      {isAuthenticated && (
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-4 z-40">
          {/* Language Selector */}
          <LanguageSelector onLanguageChange={handleLanguageChange} />
          
          {/* ChatBot */}
          <ChatBot />
        </div>
      )}


    </div>
  );
}