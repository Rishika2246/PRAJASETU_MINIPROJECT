import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { LogOut, Shield, Clock, MapPin, Smartphone, CheckCircle, X, AlertTriangle } from 'lucide-react';

interface User {
  name: string;
  email: string;
  mobile: string;
  citizenId: string;
}

interface LogoutConfirmationProps {
  user: User;
  onConfirmLogout: () => void;
  onCancel: () => void;
}

export function LogoutConfirmation({ user, onConfirmLogout, onCancel }: LogoutConfirmationProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock session data
  const sessionInfo = {
    loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(), // 2 hours ago
    ipAddress: '203.192.xxx.xxx',
    location: 'Mumbai, Maharashtra',
    device: 'Chrome on Windows',
    activeServices: ['Digital Voting', 'Tax Portal', 'Civic Services']
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Simulate logout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowSuccess(true);
    
    // Complete logout after showing success
    setTimeout(() => {
      onConfirmLogout();
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md border-0 shadow-2xl shadow-green-500/25 bg-gradient-to-br from-white to-green-50/50">
          <div className="h-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600" />
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Logout Successful!</h2>
            <p className="text-green-700 mb-4">You have been securely logged out</p>
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
              <Shield className="w-4 h-4" />
              <span>Session terminated • All services secured</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl shadow-slate-900/10 backdrop-blur-sm bg-white/95">
          <CardHeader className="pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <LogOut className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-800">Confirm Logout</CardTitle>
            <p className="text-slate-600 mt-2">Are you sure you want to logout from Digital India Portal?</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <p className="text-sm text-slate-600 font-mono">ID: {user.citizenId}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Logged in: {sessionInfo.loginTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Location: {sessionInfo.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Device: {sessionInfo.device}</span>
                </div>
              </div>
            </div>

            {/* Active Services */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Active Services
              </h4>
              <div className="flex flex-wrap gap-2">
                {sessionInfo.activeServices.map((service) => (
                  <Badge key={service} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Logging out will terminate your session and you'll need to sign in again to access government services.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline"
                onClick={onCancel}
                className="flex-1 h-12 border-slate-300 hover:bg-slate-50"
                disabled={isLoggingOut}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoggingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging out...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Confirm Logout
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-slate-600 border border-slate-200">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Secure Session • Government Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}