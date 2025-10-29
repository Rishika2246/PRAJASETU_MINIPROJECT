import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Trash2, AlertTriangle, Shield, Lock, ArrowLeft, CheckCircle, X, Eye, EyeOff } from 'lucide-react';

interface User {
  name: string;
  email: string;
  mobile: string;
  citizenId: string;
}

interface DeleteAccountProps {
  user: User;
  onAccountDeleted: () => void;
  onCancel: () => void;
}

export function DeleteAccount({ user, onAccountDeleted, onCancel }: DeleteAccountProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmations, setConfirmations] = useState({
    dataLoss: false,
    serviceLoss: false,
    permanent: false,
    understanding: false
  });
  const [verificationData, setVerificationData] = useState({
    citizenId: '',
    email: '',
    deleteConfirmation: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCitizenId, setShowCitizenId] = useState(false);

  const servicesData = {
    activeServices: ['Digital Voting', 'Tax Filing', 'Civic Services', 'Government Transparency'],
    dataCount: {
      votes: 12,
      taxReturns: 3,
      applications: 8,
      documents: 15
    }
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (verificationData.citizenId !== user.citizenId) {
      newErrors.citizenId = 'Citizen ID does not match';
    }
    
    if (verificationData.email.toLowerCase() !== user.email.toLowerCase()) {
      newErrors.email = 'Email address does not match';
    }
    
    if (verificationData.deleteConfirmation !== 'DELETE MY ACCOUNT') {
      newErrors.deleteConfirmation = 'Please type exactly: DELETE MY ACCOUNT';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const allConfirmationsChecked = Object.values(confirmations).every(Boolean);

  const handleInputChange = (field: string, value: string) => {
    setVerificationData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleConfirmationChange = (field: string, checked: boolean) => {
    setConfirmations(prev => ({ ...prev, [field]: checked }));
  };

  const proceedToStep2 = () => {
    if (allConfirmationsChecked) {
      setCurrentStep(2);
    }
  };

  const deleteAccount = async () => {
    if (!validateStep2()) return;
    
    setIsProcessing(true);
    // Simulate account deletion process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setShowSuccess(true);
    
    // Complete deletion after showing success
    setTimeout(() => {
      onAccountDeleted();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl shadow-red-500/25 bg-gradient-to-br from-white to-red-50/50">
          <div className="h-2 bg-gradient-to-r from-red-400 via-red-500 to-red-600" />
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Account Deleted</h2>
            <p className="text-red-700 mb-4">Your account has been permanently removed</p>
            <div className="bg-red-100 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800">All data and services have been securely erased</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-red-600 text-sm">
              <Shield className="w-4 h-4" />
              <span>Deletion completed • Data securely removed</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DC2626' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <span className="font-semibold">Delete Account</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Account Deletion</h1>
          <p className="text-slate-600">This action cannot be undone</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
              currentStep >= 1 ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'
            }`}>
              {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <div className={`w-16 h-1 rounded-full transition-all ${
              currentStep > 1 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-slate-200'
            }`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
              currentStep >= 2 ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'
            }`}>
              {showSuccess ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-2xl shadow-slate-900/10 backdrop-blur-sm bg-white/95">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              {currentStep === 1 ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Understand the Consequences
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 text-red-600" />
                  Verify Your Identity
                </>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {currentStep === 1 ? (
              <>
                {/* User Info */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-sm text-slate-600 font-mono">ID: {user.citizenId}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Services & Data */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Active Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {servicesData.activeServices.map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Data to be Deleted</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-red-800 font-semibold">{servicesData.dataCount.votes} Votes</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-red-800 font-semibold">{servicesData.dataCount.taxReturns} Tax Returns</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-red-800 font-semibold">{servicesData.dataCount.applications} Applications</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-red-800 font-semibold">{servicesData.dataCount.documents} Documents</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirmations */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800">Please confirm you understand:</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="dataLoss"
                        checked={confirmations.dataLoss}
                        onCheckedChange={(checked) => handleConfirmationChange('dataLoss', checked as boolean)}
                      />
                      <Label htmlFor="dataLoss" className="text-sm leading-relaxed text-slate-700">
                        All my government data, voting history, tax records, and applications will be permanently deleted
                      </Label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="serviceLoss"
                        checked={confirmations.serviceLoss}
                        onCheckedChange={(checked) => handleConfirmationChange('serviceLoss', checked as boolean)}
                      />
                      <Label htmlFor="serviceLoss" className="text-sm leading-relaxed text-slate-700">
                        I will lose access to all Digital India services and will need to re-register to use them again
                      </Label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="permanent"
                        checked={confirmations.permanent}
                        onCheckedChange={(checked) => handleConfirmationChange('permanent', checked as boolean)}
                      />
                      <Label htmlFor="permanent" className="text-sm leading-relaxed text-slate-700">
                        This action is permanent and cannot be undone - my account cannot be recovered
                      </Label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="understanding"
                        checked={confirmations.understanding}
                        onCheckedChange={(checked) => handleConfirmationChange('understanding', checked as boolean)}
                      />
                      <Label htmlFor="understanding" className="text-sm leading-relaxed text-slate-700">
                        I understand the consequences and still want to proceed with account deletion
                      </Label>
                    </div>
                  </div>
                </div>

                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Warning:</strong> Account deletion is irreversible. All your government services data will be permanently erased.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={proceedToStep2}
                    disabled={!allConfirmationsChecked}
                    className="flex-1 h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Continue to Verification
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Alert className="border-red-200 bg-red-50">
                  <Shield className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    For security, please verify your identity before proceeding with account deletion.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="citizenId">Citizen ID</Label>
                    <div className="relative">
                      <Input
                        id="citizenId"
                        type={showCitizenId ? "text" : "password"}
                        placeholder="Enter your citizen ID"
                        value={verificationData.citizenId}
                        onChange={(e) => handleInputChange('citizenId', e.target.value)}
                        className={`pr-10 font-mono ${errors.citizenId ? 'border-red-500' : ''}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowCitizenId(!showCitizenId)}
                      >
                        {showCitizenId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.citizenId && (
                      <p className="text-red-500 text-sm mt-1">{errors.citizenId}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={verificationData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="deleteConfirmation">Type "DELETE MY ACCOUNT" to confirm</Label>
                    <Input
                      id="deleteConfirmation"
                      placeholder="Type exactly: DELETE MY ACCOUNT"
                      value={verificationData.deleteConfirmation}
                      onChange={(e) => handleInputChange('deleteConfirmation', e.target.value)}
                      className={`${errors.deleteConfirmation ? 'border-red-500' : ''}`}
                    />
                    {errors.deleteConfirmation && (
                      <p className="text-red-500 text-sm mt-1">{errors.deleteConfirmation}</p>
                    )}
                  </div>
                </div>

                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    This is your final chance to cancel. Once you proceed, your account and all data will be permanently deleted.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    disabled={isProcessing}
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={deleteAccount}
                    disabled={isProcessing}
                    className="flex-1 h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Deleting Account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete My Account
                      </div>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-slate-600 border border-slate-200">
            <Shield className="w-4 h-4 text-red-600" />
            <span>Secure Deletion Process • Government Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}