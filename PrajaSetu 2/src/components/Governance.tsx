import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { FileText, Download, Search, Eye, Calendar, DollarSign } from 'lucide-react';

export function Governance() {
  const [searchTerm, setSearchTerm] = useState('');

  const publicDocuments = [
    {
      id: 1,
      title: "Annual Budget 2024-25",
      category: "Budget",
      department: "Finance Ministry",
      date: "2024-02-01",
      size: "2.4 MB",
      downloads: 15420,
      status: "Published"
    },
    {
      id: 2,
      title: "Infrastructure Development Plan",
      category: "Policy",
      department: "Urban Development",
      date: "2024-01-15",
      size: "5.1 MB",
      downloads: 8930,
      status: "Published"
    },
    {
      id: 3,
      title: "Education Reform Guidelines",
      category: "Education",
      department: "Education Ministry",
      date: "2024-01-10",
      size: "1.8 MB",
      downloads: 12650,
      status: "Published"
    },
    {
      id: 4,
      title: "Healthcare Allocation Report",
      category: "Healthcare",
      department: "Health Ministry",
      date: "2023-12-20",
      size: "3.2 MB",
      downloads: 9840,
      status: "Published"
    }
  ];

  const tenderNotices = [
    {
      id: 1,
      title: "Construction of Metro Line Extension",
      value: "₹2,400 Cr",
      department: "Transport",
      deadline: "2024-03-15",
      status: "Open"
    },
    {
      id: 2,
      title: "Digital Infrastructure Upgrade",
      value: "₹450 Cr",
      department: "IT Department",
      deadline: "2024-02-28",
      status: "Open"
    },
    {
      id: 3,
      title: "School Building Renovation",
      value: "₹180 Cr",
      department: "Education",
      deadline: "2024-02-20",
      status: "Evaluation"
    }
  ];

  const budgetAllocations = [
    { sector: "Education", allocated: 24500, spent: 18200, percentage: 74.3 },
    { sector: "Healthcare", allocated: 18000, spent: 14500, percentage: 80.6 },
    { sector: "Infrastructure", allocated: 32000, spent: 28900, percentage: 90.3 },
    { sector: "Agriculture", allocated: 15000, spent: 12100, percentage: 80.7 },
    { sector: "Defense", allocated: 28500, spent: 26800, percentage: 94.0 }
  ];

  const filteredDocuments = publicDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Transparent Governance Portal
          </CardTitle>
          <CardDescription>
            Access public documents, policies, and government transparency data
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Public Documents</TabsTrigger>
          <TabsTrigger value="tenders">Tenders & Contracts</TabsTrigger>
          <TabsTrigger value="budget">Budget Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Repository</CardTitle>
              <CardDescription>
                Search and access government policies, reports, and public documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents by title, category, or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{doc.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{doc.department}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {doc.date}
                            </span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{doc.category}</Badge>
                          <Badge variant="default">{doc.status}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Downloaded {doc.downloads.toLocaleString()} times
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Tenders & Contracts</CardTitle>
              <CardDescription>
                Public procurement opportunities and contract awards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenderNotices.map((tender) => (
                  <div key={tender.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{tender.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Department: {tender.department}
                        </p>
                      </div>
                      <Badge variant={tender.status === 'Open' ? 'default' : 'secondary'}>
                        {tender.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          Value: {tender.value}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Deadline: {tender.deadline}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Apply</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocation & Spending</CardTitle>
              <CardDescription>
                Real-time tracking of government budget allocation and expenditure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetAllocations.map((sector, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{sector.sector}</h4>
                      <Badge variant="outline">{sector.percentage}% Utilized</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Allocated: ₹{sector.allocated.toLocaleString()} Cr</span>
                        <span>Spent: ₹{sector.spent.toLocaleString()} Cr</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${sector.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Remaining: ₹{(sector.allocated - sector.spent).toLocaleString()} Cr
                      </p>
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