import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { MessageSquare, MapPin, Clock, CheckCircle, AlertTriangle, Users, Phone } from 'lucide-react';

export function CivicEngagement() {
  const [complaintForm, setComplaintForm] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeComplaints = [
    {
      id: "CMP-2024-001234",
      title: "Broken Street Light on MG Road",
      category: "Infrastructure",
      status: "In Progress",
      priority: "High",
      dateSubmitted: "2024-01-15",
      department: "Public Works",
      estimatedResolution: "2024-02-01"
    },
    {
      id: "CMP-2024-001235",
      title: "Garbage Collection Delay",
      category: "Sanitation",
      status: "Resolved",
      priority: "Medium",
      dateSubmitted: "2024-01-10",
      department: "Municipal Services",
      estimatedResolution: "2024-01-12"
    },
    {
      id: "CMP-2024-001236",
      title: "Pothole on Brigade Road",
      category: "Roads",
      status: "Acknowledged",
      priority: "High",
      dateSubmitted: "2024-01-20",
      department: "Public Works",
      estimatedResolution: "2024-02-05"
    }
  ];

  const citizenServices = [
    {
      title: "Birth Certificate",
      description: "Apply for birth certificate online",
      processingTime: "7-10 days",
      fee: "₹50",
      department: "Registrar Office"
    },
    {
      title: "Property Tax Payment",
      description: "Pay property tax and get receipt",
      processingTime: "Instant",
      fee: "As applicable",
      department: "Revenue Department"
    },
    {
      title: "Trade License",
      description: "Apply for new trade license",
      processingTime: "15-20 days",
      fee: "₹500-2000",
      department: "Municipal Corporation"
    },
    {
      title: "Water Connection",
      description: "Apply for new water connection",
      processingTime: "10-15 days",
      fee: "₹1500",
      department: "Water Board"
    }
  ];

  const emergencyServices = [
    { name: "Police", number: "100", description: "Emergency police assistance" },
    { name: "Fire Service", number: "101", description: "Fire emergency and rescue" },
    { name: "Ambulance", number: "102", description: "Medical emergency services" },
    { name: "Disaster Management", number: "108", description: "Natural disaster helpline" }
  ];

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setComplaintForm(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Complaint Submitted Successfully
          </CardTitle>
          <CardDescription className="text-green-700">
            Your complaint has been registered and assigned to the relevant department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Badge variant="outline" className="border-green-200 text-green-800">
                Complaint ID: CMP-2024-{Math.random().toString(36).substr(2, 6).toUpperCase()}
              </Badge>
            </div>
            <div className="text-sm text-green-700">
              Expected resolution: Within 7-10 working days
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSubmitted(false)}
              className="border-green-200 text-green-800 hover:bg-green-100"
            >
              Submit Another Complaint
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Civic Engagement Platform
          </CardTitle>
          <CardDescription>
            Connect with your government, raise concerns, and access citizen services
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="complaints" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="services">Citizen Services</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="complaints" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Complaint</CardTitle>
                <CardDescription>
                  Report issues in your area for quick resolution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleComplaintSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select 
                      id="category"
                      className="w-full p-2 border rounded-md"
                      value={complaintForm.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="sanitation">Sanitation</option>
                      <option value="roads">Roads</option>
                      <option value="water">Water Supply</option>
                      <option value="electricity">Electricity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="title">Complaint Title</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={complaintForm.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about the issue"
                      value={complaintForm.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Specific address or landmark"
                      value={complaintForm.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <select 
                      id="priority"
                      className="w-full p-2 border rounded-md"
                      value={complaintForm.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Complaints</CardTitle>
                <CardDescription>
                  Track the status of your submitted complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeComplaints.map((complaint) => (
                    <div key={complaint.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{complaint.title}</h4>
                        <Badge variant={
                          complaint.status === 'Resolved' ? 'default' :
                          complaint.status === 'In Progress' ? 'secondary' : 'outline'
                        }>
                          {complaint.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>ID: {complaint.id}</p>
                        <p>Department: {complaint.department}</p>
                        <p>Est. Resolution: {complaint.estimatedResolution}</p>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {citizenServices.map((service, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Processing: </span>
                      <span>{service.processingTime}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fee: </span>
                      <span>{service.fee}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Department: {service.department}
                  </p>
                  <Button size="sm" className="w-full">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              For life-threatening emergencies, call the appropriate emergency number immediately
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyServices.map((service, index) => (
              <Card key={index} className="border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{service.name}</h3>
                    <Phone className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-red-600">{service.number}</div>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <Button variant="destructive" size="sm" className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call {service.number}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Feedback</CardTitle>
              <CardDescription>
                Help us improve the digital governance platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="feedback-category">Feedback Category</Label>
                  <select id="feedback-category" className="w-full p-2 border rounded-md">
                    <option value="">Select Category</option>
                    <option value="usability">Website Usability</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="general">General Feedback</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="feedback-title">Title</Label>
                  <Input
                    id="feedback-title"
                    placeholder="Brief description of your feedback"
                  />
                </div>

                <div>
                  <Label htmlFor="feedback-description">Detailed Feedback</Label>
                  <Textarea
                    id="feedback-description"
                    placeholder="Please provide detailed feedback or suggestions"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}