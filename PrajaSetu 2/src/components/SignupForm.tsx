import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Shield, Phone, Mail, User, CheckCircle, ArrowRight, ArrowLeft, Lock, Fingerprint, Info, Eye } from 'lucide-react';

interface SignupFormProps {
  onSignupComplete: (userData: any) => void;
}

export function SignupForm({ onSignupComplete }: SignupFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showDemoOTP, setShowDemoOTP] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    otp: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Demo OTP for testing purposes
  const DEMO_OTP = '123456';

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp !== DEMO_OTP) {
      newErrors.otp = `Invalid OTP. For demo, use: ${DEMO_OTP}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const sendOTP = async () => {
    if (!validateStep1()) return;
    
    setIsLoading(true);
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    setOtpSent(true);
    setCurrentStep(2);
    setIsLoading(false);
    setShowDemoOTP(true);
  };

  const verifyOTP = async () => {
    if (!validateOTP()) return;
    
    setIsLoading(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setOtpVerified(true);
    setIsLoading(false);
    
    // Complete signup after a brief success display
    setTimeout(() => {
      onSignupComplete({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        mobile: formData.mobile,
        citizenId: `IN${Math.random().toString().substr(2, 9)}`
      });
    }, 2000);
  };

  const resendOTP = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShowDemoOTP(true);
  };

  const useDemoOTP = () => {
    setFormData(prev => ({ ...prev, otp: DEMO_OTP }));
    setErrors(prev => ({ ...prev, otp: '' }));
  };

  const skipVerification = () => {
    setOtpVerified(true);
    setTimeout(() => {
      onSignupComplete({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        mobile: formData.mobile,
        citizenId: `IN${Math.random().toString().substr(2, 9)}`
      });
    }, 1000);
  };

  if (otpVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl shadow-green-500/25 bg-gradient-to-br from-white to-green-50/50">
          <div className="h-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600" />
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg animate-pulse">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Registration Successful!</h2>
            <p className="text-green-700 mb-4">Welcome to Digital India Portal</p>
            <div className="bg-green-100 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-800">Your Citizen ID: <span className="font-mono font-bold">IN{Math.random().toString().substr(2, 9)}</span></p>
            </div>
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
              <Shield className="w-4 h-4" />
              <span>Account verified and secured</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Demo Notice */}
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Demo Mode:</strong> This is a prototype application. No real OTP will be sent to your mobile number.
          </AlertDescription>
        </Alert>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              🇮🇳
            </div>
            <span className="font-semibold">Digital India Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Your Account</h1>
          <p className="text-slate-600">Join India's digital governance revolution</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
              currentStep >= 1 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <div className={`w-16 h-1 rounded-full transition-all ${
              currentStep > 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-slate-200'
            }`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
              currentStep >= 2 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'
            }`}>
              {otpVerified ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-2xl shadow-slate-900/10 backdrop-blur-sm bg-white/95">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              {currentStep === 1 ? (
                <>
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 text-green-600" />
                  Verify Your Mobile
                </>
              )}
            </CardTitle>
            <CardDescription className="text-base">
              {currentStep === 1 
                ? 'Enter your details to create your Digital India account'
                : `Demo OTP verification for +91 ${formData.mobile}`
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {currentStep === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-slate-600 text-sm">+91</div>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className={`pl-16 ${errors.mobile ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Your information is secured with military-grade encryption and will only be used for government services.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={sendOTP}
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Simulating OTP Send...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Send Demo OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-700 mb-2">Demo OTP sent to</p>
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      +91 {formData.mobile}
                    </Badge>
                  </div>
                </div>

                {/* Demo OTP Information */}
                <Alert className="border-amber-200 bg-amber-50">
                  <Eye className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <div className="space-y-2">
                      <p><strong>Demo Mode:</strong> No real SMS sent. Use demo OTP:</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-lg px-3 py-1 border-amber-300">
                          {DEMO_OTP}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={useDemoOTP}
                          className="text-amber-700 hover:bg-amber-100"
                        >
                          Auto-fill
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="otp">Enter OTP</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className={`pl-10 text-center text-lg tracking-widest ${errors.otp ? 'border-red-500' : ''}`}
                      maxLength={6}
                    />
                  </div>
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Didn't receive OTP?</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={resendOTP}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Resend Demo OTP
                  </Button>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <Fingerprint className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    OTP verification ensures secure account creation and prevents unauthorized access.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setCurrentStep(1);
                      setOtpSent(false);
                      setShowDemoOTP(false);
                      setFormData(prev => ({ ...prev, otp: '' }));
                    }}
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={verifyOTP}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Verify & Continue
                      </div>
                    )}
                  </Button>
                </div>

                {/* Demo Skip Option */}
                <div className="text-center pt-4 border-t border-slate-200">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={skipVerification}
                    className="text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                  >
                    Skip Verification (Demo Only)
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-slate-600 border border-slate-200">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Demo Environment • 256-bit SSL Encrypted • Government Grade Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}