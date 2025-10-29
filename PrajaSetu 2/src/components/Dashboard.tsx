import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Vote, Users, FileText, CreditCard, MessageSquare, TrendingUp, Shield, Zap, Activity } from 'lucide-react';

export function Dashboard() {
  const stats = [
    {
      title: "Active Voters",
      value: "847M",
      change: "+2.1%",
      changeType: "increase",
      icon: Vote,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      title: "Ongoing Elections",
      value: "3",
      change: "State Level",
      changeType: "neutral",
      icon: Users,
      color: "from-green-600 to-green-700",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Tax Returns Filed",
      value: "12.4M",
      change: "+15.3%",
      changeType: "increase",
      icon: CreditCard,
      color: "from-blue-800 to-blue-900",
      bgColor: "bg-blue-50",
      textColor: "text-blue-900"
    },
    {
      title: "Civic Requests",
      value: "2,847",
      change: "This Month",
      changeType: "neutral",
      icon: MessageSquare,
      color: "from-orange-600 to-orange-700",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  const recentElections = [
    { state: "Karnataka", status: "Completed", turnout: 72.4, winner: "Congress", color: "green" },
    { state: "Rajasthan", status: "In Progress", turnout: 58.7, winner: "TBD", color: "blue" },
    { state: "Maharashtra", status: "Upcoming", turnout: 0, winner: "TBD", color: "yellow" }
  ];

  const quickActions = [
    { title: "Cast Vote", description: "Participate in active elections", icon: "🗳️", color: "from-orange-500 to-orange-600" },
    { title: "File Tax Return", description: "Submit your annual tax return", icon: "📋", color: "from-green-600 to-green-700" },
    { title: "Civic Complaint", description: "Report issues in your area", icon: "📝", color: "from-blue-800 to-blue-900" },
    { title: "View Results", description: "Check election outcomes", icon: "📊", color: "from-orange-600 to-orange-700" }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-green-700 to-blue-900 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome to Digital India Portal</h1>
            <p className="text-orange-100 text-lg">Your gateway to transparent governance and civic empowerment</p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secure Platform</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Real-time Updates</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block text-6xl opacity-20">🇮🇳</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:scale-105">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                  <IconComponent className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
                <div className="flex items-center gap-2">
                  {stat.changeType === 'increase' && (
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 rounded-full px-2 py-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs font-medium">{stat.change}</span>
                    </div>
                  )}
                  {stat.changeType === 'neutral' && (
                    <div className="flex items-center gap-1 text-slate-600 bg-slate-50 rounded-full px-2 py-1">
                      <Activity className="w-3 h-3" />
                      <span className="text-xs font-medium">{stat.change}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg shadow-slate-900/5">
        <CardHeader className="pb-6">
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-base">
            Access frequently used services and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:shadow-slate-900/10 transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className="space-y-3">
                  <div className="text-3xl">{action.icon}</div>
                  <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-slate-900">{action.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg shadow-slate-900/5">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Recent Elections
            </CardTitle>
            <CardDescription className="text-base">State-wise election overview and results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentElections.map((election, index) => (
                <div key={index} className="group relative overflow-hidden bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-800 group-hover:text-slate-900">{election.state}</h4>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          election.color === 'green' ? 'bg-green-500' :
                          election.color === 'blue' ? 'bg-orange-500' : 'bg-yellow-400'
                        } animate-pulse`} />
                        <Badge variant={
                          election.status === "Completed" ? "default" : 
                          election.status === "In Progress" ? "secondary" : "outline"
                        } className="text-xs">
                          {election.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">{election.turnout}%</p>
                      <p className="text-xs text-slate-500">Turnout</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Winner: {election.winner}</span>
                      {election.turnout > 0 && (
                        <span className="text-slate-500">{election.turnout}% participation</span>
                      )}
                    </div>
                    {election.turnout > 0 && (
                      <Progress value={election.turnout} className="h-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-slate-900/5">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-blue-900" />
              Platform Health
            </CardTitle>
            <CardDescription className="text-base">System performance and security metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-green-800">System Uptime</span>
                  <span className="text-lg font-bold text-green-600">99.9%</span>
                </div>
                <Progress value={99.9} className="h-2 bg-green-100" />
                <p className="text-xs text-green-600 mt-2">Excellent performance</p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-orange-800">Security Score</span>
                  <span className="text-lg font-bold text-orange-600">98.2%</span>
                </div>
                <Progress value={98.2} className="h-2 bg-orange-100" />
                <p className="text-xs text-orange-600 mt-2">Highly secure</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-800">Data Integrity</span>
                  <span className="text-lg font-bold text-blue-900">100%</span>
                </div>
                <Progress value={100} className="h-2 bg-blue-100" />
                <p className="text-xs text-blue-900 mt-2">Perfect integrity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}