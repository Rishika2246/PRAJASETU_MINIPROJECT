import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  LogOut,
  Trash2,
  Edit,
  Bell,
  Lock,
  Download,
  Eye,
  AlertTriangle,
} from "lucide-react";

interface User {
  name: string;
  email: string;
  mobile: string;
  citizenId: string;
}

interface AccountSettingsProps {
  user: User;
  onLogoutRequest: () => void;
  onDeleteAccountRequest: () => void;
}

export function AccountSettings({
  user,
  onLogoutRequest,
  onDeleteAccountRequest,
}: AccountSettingsProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Mock additional user data
  const userDetails = {
    memberSince: "January 2024",
    location: "Mumbai, Maharashtra",
    lastLogin: new Date().toLocaleString(),
    verificationLevel: "Government Verified",
    activeServices: 6,
    totalTransactions: 28,
  };

  const securityFeatures = [
    {
      name: "Two-Factor Authentication",
      status: "Enabled",
      color: "green",
    },
    {
      name: "Email Notifications",
      status: "Enabled",
      color: "green",
    },
    { name: "SMS Alerts", status: "Enabled", color: "green" },
    { name: "Login Alerts", status: "Enabled", color: "green" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Account Settings
        </h1>
        <p className="text-slate-600">
          Manage your Digital India Portal account
        </p>
      </div>

      {/* Profile Overview */}
      <Card className="border-0 shadow-lg shadow-slate-900/5 bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Profile Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-blue-100">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {user.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {userDetails.verificationLevel}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-200"
                  >
                    Member since {userDetails.memberSince}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4" />
                  <span>+91 {user.mobile}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{userDetails.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Last login: {userDetails.lastLogin}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-slate-600 hover:bg-slate-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Data
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg shadow-slate-900/5">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🏛️</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              {userDetails.activeServices}
            </h3>
            <p className="text-slate-600 text-sm">
              Active Services
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-900/5">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              {userDetails.totalTransactions}
            </h3>
            <p className="text-slate-600 text-sm">
              Total Transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-900/5">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🛡️</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              100%
            </h3>
            <p className="text-slate-600 text-sm">
              Security Score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card className="border-0 shadow-lg shadow-slate-900/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-green-600" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityFeatures.map((feature) => (
              <div
                key={feature.name}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border"
              >
                <span className="text-sm text-slate-700">
                  {feature.name}
                </span>
                <Badge
                  variant={
                    feature.color === "green"
                      ? "secondary"
                      : "outline"
                  }
                  className={
                    feature.color === "green"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : ""
                  }
                >
                  {feature.status}
                </Badge>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-800">
                Citizen ID Verification
              </h4>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">
                  Your account is verified with Citizen ID:
                </p>
                <p className="font-mono text-sm text-blue-800 font-semibold">
                  {user.citizenId}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-0 shadow-lg shadow-slate-900/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800">
                Email Notifications
              </h4>
              <div className="space-y-2">
                {[
                  "Election Updates",
                  "Tax Reminders",
                  "Service Updates",
                  "Security Alerts",
                ].map((notification) => (
                  <div
                    key={notification}
                    className="flex items-center justify-between p-2"
                  >
                    <span className="text-sm text-slate-700">
                      {notification}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      Enabled
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-800">
                SMS Notifications
              </h4>
              <div className="space-y-2">
                {[
                  "OTP Codes",
                  "Emergency Alerts",
                  "Important Updates",
                  "Payment Confirmations",
                ].map((notification) => (
                  <div
                    key={notification}
                    className="flex items-center justify-between p-2"
                  >
                    <span className="text-sm text-slate-700">
                      {notification}
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      Enabled
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-0 shadow-lg shadow-slate-900/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-slate-600" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Eye className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Your account and data are protected by
              government-grade security. All actions are logged
              for your safety.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={onLogoutRequest}
              variant="outline"
              className="flex-1 h-12 border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout Securely
            </Button>

            <Button
              onClick={onDeleteAccountRequest}
              variant="outline"
              className="flex-1 h-12 border-red-200 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>

          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Important:</strong> Account deletion is
              permanent and cannot be undone. Please consider
              downloading your data first.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}