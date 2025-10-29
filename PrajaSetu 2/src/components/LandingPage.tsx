import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, Users, Crown, Vote, FileText, MessageSquare } from 'lucide-react';

interface LandingPageProps {
  onAdminLogin: () => void;
  onCitizenLogin: () => void;
}

export function LandingPage({ onAdminLogin, onCitizenLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF9933' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Indian Flag Colors Top Bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-white to-green-600" />

      <div className="relative max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-3xl shadow-2xl">
              🇮🇳
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent mb-2">
                Prajasetu
              </h1>
              <p className="text-xl text-slate-700">Digital India Governance Portal</p>
            </div>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Empowering citizens through digital governance, transparent administration, and seamless public services.
          </p>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Citizen Login */}
          <Card className="bg-white/80 border-orange-200 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-800">Citizen Portal</CardTitle>
              <CardDescription className="text-slate-600">
                Access voting, civic services, and government transparency tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <Vote className="h-5 w-5 text-orange-500" />
                  <span>Digital Voting System</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Tax Filing & Services</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span>Civic Complaints & Requests</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <span>Government Transparency</span>
                </div>
              </div>
              
              <Button 
                onClick={onCitizenLogin}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold h-12 text-lg"
              >
                Enter as Citizen
              </Button>
              
              <div className="text-center text-sm text-slate-500">
                <p>New to the platform? Registration is quick and secure.</p>
              </div>
            </CardContent>
          </Card>

          {/* Admin Login */}
          <Card className="bg-white/80 border-red-200 hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg border-2">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-800">Admin Portal</CardTitle>
              <CardDescription className="text-slate-600">
                Government administration and citizen data management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-semibold">Restricted Access</span>
                </div>
                <p className="text-red-600 text-sm">
                  This portal is for authorized government personnel only. 
                  Demo mode - any credentials accepted.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Citizen Database Management</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Vote className="h-5 w-5 text-green-600" />
                  <span>Election Results & Analytics</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  <span>Complaints & Service Monitoring</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span>Security & System Control</span>
                </div>
              </div>
              
              <Button 
                onClick={onAdminLogin}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold h-12 text-lg"
              >
                Admin Access
              </Button>
              
              <div className="text-center text-xs text-slate-500 space-y-1">
                <p className="font-semibold">Demo Mode Active</p>
                <p>Enter any credentials to access dashboard</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-slate-800 font-semibold mb-2">Secure & Encrypted</h3>
            <p className="text-slate-600 text-sm">
              End-to-end encryption with biometric verification and advanced security protocols.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-slate-800 font-semibold mb-2">Citizen-Centric</h3>
            <p className="text-slate-600 text-sm">
              Designed for ease of use with multilingual support and accessibility features.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Vote className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-slate-800 font-semibold mb-2">Transparent</h3>
            <p className="text-slate-600 text-sm">
              Real-time tracking, open data, and complete transparency in all government processes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-300">
          <p className="text-slate-600 text-sm">
            &copy; 2024 Government of India. All rights reserved. | Digital India Initiative
          </p>
        </div>
      </div>
    </div>
  );
}