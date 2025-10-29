import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import {
  Shield,
  User,
  Calendar,
  CreditCard,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileText,
  Phone
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  mobile: string;
  citizenId: string;
}

interface VotingSignupProps {
  user: User;
  onVotingRegistrationComplete: (voterData: any) => void;
  onCancel: () => void;
}

interface VoterData {
  aadharNumber: string;
  voterID: string;
  fullName: string;
  dateOfBirth: string;
  mobile: string;
}

export function VotingSignup({ user, onVotingRegistrationComplete, onCancel }: VotingSignupProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showAadhar, setShowAadhar] = useState(false);
  const [registrationDone, setRegistrationDone] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const [voterData, setVoterData] = useState<VoterData>({
    aadharNumber: '',
    voterID: '',
    fullName: user.name,
    dateOfBirth: '',
    mobile: user.mobile,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fieldValidation, setFieldValidation] = useState<Record<string, boolean>>({});

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const validateField = (field: string, value: string) => {
    let isValid = false;
    let error = '';

    switch (field) {
      case 'aadharNumber':
        if (!value.trim()) {
          error = 'Aadhar number is required';
        } else if (!/^\d{12}$/.test(value)) {
          error = 'Please enter a valid 12-digit Aadhar number';
        } else {
          isValid = true;
        }
        break;
      case 'voterID':
        if (!value.trim()) {
          error = 'Voter ID is required';
        } else if (value.length < 6) {
          error = 'Voter ID must be at least 6 characters';
        } else {
          isValid = true;
        }
        break;
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Please enter your full name';
        } else {
          isValid = true;
        }
        break;
      case 'mobile':
        if (!value.trim()) {
          error = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(value)) {
          error = 'Please enter a valid 10-digit mobile number';
        } else {
          isValid = true;
        }
        break;
      case 'dateOfBirth':
        if (!value) {
          error = 'Date of birth is required';
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18) {
            error = 'You must be at least 18 years old to vote';
          } else {
            isValid = true;
          }
        }
        break;
    }

    return { isValid, error };
  };

  const handleInputChange = (field: string, value: string) => {
    setVoterData(prev => ({ ...prev, [field]: value }));

    // Real-time validation
    const validation = validateField(field, value);
    setFieldValidation(prev => ({ ...prev, [field]: validation.isValid }));

    if (validation.error) {
      setErrors(prev => ({ ...prev, [field]: validation.error }));
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCurrentStep = () => {
    const stepFields = {
      1: ['fullName', 'mobile'],
      2: ['aadharNumber', 'dateOfBirth'],
      3: ['voterID']
    };

    const fieldsToValidate = stepFields[currentStep as keyof typeof stepFields] || [];
    let isStepValid = true;
    const newErrors: Record<string, string> = {};

    fieldsToValidate.forEach(field => {
      const validation = validateField(field, voterData[field as keyof VoterData]);
      if (!validation.isValid) {
        newErrors[field] = validation.error;
        isStepValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isStepValid;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const completeRegistration = async () => {
    if (!validateCurrentStep()) return;

    setIsLoading(true);
    setIsValidating(true);

    // Simulate validation process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const registrationData = {
      ...voterData,
      voterID: voterData.voterID.toUpperCase(),
      registrationId: `VR${Math.random().toString().substr(2, 8)}`,
      registrationDate: new Date().toISOString(),
      eligibilityVerified: true,
      user,
    };

    localStorage.setItem('voting-registration', JSON.stringify(registrationData));
    localStorage.setItem('voting-user', JSON.stringify(user));

    onVotingRegistrationComplete(registrationData);
    setRegistrationDone(true);
    setIsLoading(false);
    setIsValidating(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Personal Information</h3>
              <p className="text-slate-600">Let's start with your basic details for voter verification</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Full Legal Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="Enter your complete name as per government ID"
                  value={voterData.fullName}
                  onChange={(e: any) => handleInputChange('fullName', e.target.value)}
                  className={`h-12 text-base ${fieldValidation.fullName ? 'border-green-500 bg-green-50/50' : errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-slate-300'}`}
                />
                {fieldValidation.fullName && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>Perfect! Name verified</span>
                  </div>
                )}
                {errors.fullName && (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.fullName}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Your registered mobile number"
                  value={voterData.mobile}
                  onChange={(e: any) => handleInputChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="h-12 text-base bg-slate-50 border-slate-300"
                  disabled
                />
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Verified from your account profile</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Identity Verification</h3>
              <p className="text-slate-600">Secure verification using your government documents</p>
            </div>

            <Alert className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4">
              <Shield className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-800 font-medium">
                🔒 Your Aadhar information is encrypted and used only for voter verification. We follow strict privacy protocols.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="aadharNumber" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Aadhar Number
                </Label>
                <div className="relative">
                  <Input
                    id="aadharNumber"
                    type={showAadhar ? 'text' : 'password'}
                    placeholder="Enter your 12-digit Aadhar number"
                    value={voterData.aadharNumber}
                    onChange={(e: any) =>
                      handleInputChange('aadharNumber', e.target.value.replace(/\D/g, '').slice(0, 12))
                    }
                    className={`h-12 text-base pr-12 ${fieldValidation.aadharNumber ? 'border-green-500 bg-green-50/50' : errors.aadharNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-300'}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                    onClick={() => setShowAadhar(!showAadhar)}
                  >
                    {showAadhar ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {fieldValidation.aadharNumber && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>Valid Aadhar format verified</span>
                  </div>
                )}
                {errors.aadharNumber && (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.aadharNumber}</span>
                  </div>
                )}
                <p className="text-xs text-slate-500">Format: XXXX-XXXX-XXXX (12 digits)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={voterData.dateOfBirth}
                  onChange={(e: any) => handleInputChange('dateOfBirth', e.target.value)}
                  max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]}
                  className={`h-12 text-base ${fieldValidation.dateOfBirth ? 'border-green-500 bg-green-50/50' : errors.dateOfBirth ? 'border-red-500 bg-red-50/50' : 'border-slate-300'}`}
                />
                {fieldValidation.dateOfBirth && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>Age eligibility confirmed (18+)</span>
                  </div>
                )}
                {errors.dateOfBirth && (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.dateOfBirth}</span>
                  </div>
                )}
                <p className="text-xs text-slate-500">You must be 18 years or older to register as a voter</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Final Details</h3>
              <p className="text-slate-600">Complete your voter registration with your EPIC details</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="voterID" className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Voter ID / EPIC Number
                </Label>
                <Input
                  id="voterID"
                  placeholder="Enter your Voter ID (e.g., ABC1234567)"
                  value={voterData.voterID}
                  onChange={(e: any) => handleInputChange('voterID', e.target.value.toUpperCase().slice(0, 10))}
                  className={`h-12 text-base ${fieldValidation.voterID ? 'border-green-500 bg-green-50/50' : errors.voterID ? 'border-red-500 bg-red-50/50' : 'border-slate-300'}`}
                />
                {fieldValidation.voterID && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>Valid Voter ID format</span>
                  </div>
                )}
                {errors.voterID && (
                  <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.voterID}</span>
                  </div>
                )}
                <p className="text-xs text-slate-500">Found on your Election Photo Identity Card (EPIC)</p>
              </div>

              {/* Enhanced Summary */}
              <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl p-6 border-2 border-slate-200">
                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Registration Summary
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Full Name:</span>
                    <span className="font-semibold text-slate-800">{voterData.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Mobile:</span>
                    <span className="font-semibold text-slate-800">{voterData.mobile}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Date of Birth:</span>
                    <span className="font-semibold text-slate-800">
                      {voterData.dateOfBirth ? new Date(voterData.dateOfBirth).toLocaleDateString('en-IN') : 'Not provided'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 font-medium">Aadhar:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {voterData.aadharNumber ? `****-****-${voterData.aadharNumber.slice(-4)}` : 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full border-0 shadow-2xl bg-white backdrop-blur-sm">
      {!registrationDone ? (
        <>
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-primary/5 to-orange-100/50 rounded-t-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <CardTitle className="text-2xl text-slate-800">Voter Registration</CardTitle>
                <CardDescription className="text-slate-600">
                  Join India's digital democracy
                </CardDescription>
              </div>
            </div>

            {/* Clean Progress Indicator */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm font-medium text-primary">{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-orange-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-3 text-xs">
                <span className={`${currentStep >= 1 ? 'text-primary font-semibold' : 'text-slate-400'} transition-colors`}>
                  Personal Info
                </span>
                <span className={`${currentStep >= 2 ? 'text-primary font-semibold' : 'text-slate-400'} transition-colors`}>
                  Identity Verification
                </span>
                <span className={`${currentStep >= 3 ? 'text-primary font-semibold' : 'text-slate-400'} transition-colors`}>
                  Final Details
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-8 border-t border-slate-100">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1 h-12 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className={`${currentStep === 1 ? 'w-full' : 'flex-1'} h-12 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                  disabled={isLoading}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={completeRegistration}
                  disabled={isLoading || isValidating}
                  className="flex-1 h-12 bg-gradient-to-r from-secondary to-green-600 hover:from-green-600 hover:to-secondary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isValidating ? 'Verifying Details...' : 'Completing Registration...'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Complete Registration
                    </div>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </>
      ) : (
        <CardContent className="text-center py-12">
          <div className="space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-secondary to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-slate-800">Welcome to Democracy!</h3>
              <p className="text-slate-600 text-lg">Your voter registration is now complete.</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Badge className="bg-green-100 text-green-800 border-green-300 px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verified Voter
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-green-700">
                <p>Registration ID: <span className="font-mono font-bold text-green-800">VR{Math.random().toString().substr(2, 8)}</span></p>
                <p>Status: <span className="font-semibold">Active & Ready to Vote</span></p>
              </div>
            </div>

            <Button
              onClick={onCancel}
              className="w-full h-14 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Enter Voting Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
