import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bell, Settings, LogOut, Menu, Shield } from 'lucide-react';

interface User {
  name: string;
  email: string;
  mobile: string;
  citizenId: string;
}

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user?: User | null;
  onLogout?: () => void;
}

export function Navigation({ activeSection, onSectionChange, user, onLogout }: NavigationProps) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: 'from-orange-500 to-orange-600' },
    { id: 'voting', label: 'Voting', icon: '🗳️', color: 'from-green-600 to-green-700' },
    { id: 'results', label: 'Results', icon: '📈', color: 'from-blue-800 to-blue-900' },
    { id: 'governance', label: 'Governance', icon: '🏛️', color: 'from-orange-600 to-orange-700' },
    { id: 'tax', label: 'Tax Portal', icon: '💰', color: 'from-green-700 to-green-800' },
    { id: 'civic', label: 'Civic Services', icon: '🏘️', color: 'from-orange-500 to-orange-600' },
    { id: 'account', label: 'Account', icon: '⚙️', color: 'from-slate-600 to-slate-700' }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-lg shadow-slate-900/5">
      {/* Top accent bar - Indian Flag Colors */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600" />
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-orange-500/25 transform hover:scale-105 transition-transform duration-200">
                🇮🇳
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                <Shield className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Digital India Portal
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Unified Digital Platform • Secure & Transparent
              </p>
            </div>
          </div>

          {/* Enhanced Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-2 bg-slate-50/50 rounded-2xl p-2 backdrop-blur-sm border border-slate-200/50">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onSectionChange(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 relative overflow-hidden
                  ${activeSection === item.id 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105` 
                    : 'hover:bg-white/60 hover:shadow-md text-slate-600 hover:text-slate-800'
                  }
                `}
              >
                <span className={`text-sm transition-transform ${activeSection === item.id ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <div className="absolute inset-0 bg-white/20 rounded-xl" />
                )}
              </Button>
            ))}
          </nav>

          {/* Enhanced User Actions */}
          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              variant="ghost" 
              className="relative hover:bg-orange-50 hover:text-orange-600 transition-colors rounded-xl"
            >
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-gradient-to-r from-red-500 to-red-600 animate-pulse"
              >
                3
              </Badge>
            </Button>
            
            <Button 
              size="sm" 
              variant="ghost"
              className="hover:bg-slate-50 hover:text-slate-700 transition-colors rounded-xl"
            >
              <Settings className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                    {user ? getInitials(user.name) : 'JD'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div className="hidden md:block">
                <p className="font-semibold text-slate-800">{user?.name || 'John Doe'}</p>
                <p className="text-xs text-slate-500 font-mono">ID: {user?.citizenId || 'IN123456789'}</p>
              </div>
            </div>

            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-xl ml-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>

            <Button 
              size="sm" 
              variant="ghost" 
              className="lg:hidden hover:bg-slate-50 transition-colors rounded-xl"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-slate-200/50 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onSectionChange(item.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200
                  ${activeSection === item.id 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-md` 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }
                `}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}