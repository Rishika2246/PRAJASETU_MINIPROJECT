import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MapPin, Award } from 'lucide-react';

export function ElectionResults() {
  const [selectedState, setSelectedState] = useState('karnataka');

  const stateResults = {
    karnataka: {
      name: "Karnataka",
      totalSeats: 224,
      results: [
        { party: "Congress", seats: 135, votes: 18240000, percentage: 42.9, color: "#19A0D9" },
        { party: "BJP", seats: 66, votes: 15890000, percentage: 36.2, color: "#FF9933" },
        { party: "JD(S)", seats: 19, votes: 5670000, percentage: 13.3, color: "#008000" },
        { party: "Others", seats: 4, votes: 3200000, percentage: 7.6, color: "#808080" }
      ],
      turnout: 73.2,
      status: "Declared"
    }
  };

  const constituencyData = [
    { name: "Bangalore South", winner: "Congress", margin: 15420, turnout: 68.5 },
    { name: "Bangalore North", winner: "BJP", margin: 8930, turnout: 71.2 },
    { name: "Bangalore Central", winner: "Congress", margin: 22100, turnout: 65.8 },
    { name: "Mysore", winner: "Congress", margin: 11250, turnout: 74.1 },
    { name: "Mangalore", winner: "BJP", margin: 19800, turnout: 76.3 }
  ];

  const currentResults = stateResults[selectedState];
  const chartData = currentResults.results.map(party => ({
    name: party.party,
    seats: party.seats,
    votes: party.votes,
    percentage: party.percentage
  }));

  const COLORS = currentResults.results.map(party => party.color);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Election Results - {currentResults.name}
          </CardTitle>
          <CardDescription>
            Live results and analytics from state assembly elections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Seats</p>
              <p className="text-2xl">{currentResults.totalSeats}</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Voter Turnout</p>
              <p className="text-2xl">{currentResults.turnout}%</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="default" className="text-base">
                {currentResults.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Analytics</TabsTrigger>
          <TabsTrigger value="constituencies">Constituencies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Party-wise Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentResults.results.map((party, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: party.color }}
                        />
                        <span className="font-medium">{party.party}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{party.seats} seats</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({party.percentage}%)
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={(party.seats / currentResults.totalSeats) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {party.votes.toLocaleString()} votes
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Seat Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="seats"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vote Share Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="constituencies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Constituency Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {constituencyData.map((constituency, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{constituency.name}</h4>
                      <Badge variant="outline">{constituency.winner}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>Victory Margin: {constituency.margin.toLocaleString()}</div>
                      <div>Turnout: {constituency.turnout}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}