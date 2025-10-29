import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { CreditCard, FileText, Calculator, Clock, CheckCircle, AlertTriangle, Download } from 'lucide-react';

export function TaxManagement() {
  const [selectedTaxYear, setSelectedTaxYear] = useState('2023-24');
  const [income, setIncome] = useState('');
  const [taxCalculated, setTaxCalculated] = useState(false);

  const taxReturns = [
    {
      year: "2023-24",
      status: "Filed",
      dateSubmitted: "2024-07-15",
      refundStatus: "Processed",
      refundAmount: 15420,
      acknowledgment: "ITR-V-2024-001234567"
    },
    {
      year: "2022-23",
      status: "Filed",
      dateSubmitted: "2023-07-20",
      refundStatus: "Completed",
      refundAmount: 8930,
      acknowledgment: "ITR-V-2023-001234568"
    },
    {
      year: "2021-22",
      status: "Filed",
      dateSubmitted: "2022-07-25",
      refundStatus: "Completed",
      refundAmount: 0,
      acknowledgment: "ITR-V-2022-001234569"
    }
  ];

  const taxSlabs = [
    { range: "Up to ₹2.5 Lakh", rate: "0%" },
    { range: "₹2.5L - ₹5L", rate: "5%" },
    { range: "₹5L - ₹10L", rate: "20%" },
    { range: "₹10L - ₹15L", rate: "30%" },
    { range: "Above ₹15L", rate: "30%" }
  ];

  const quickServices = [
    { title: "PAN Card Services", description: "Apply, track, or update PAN card", icon: CreditCard },
    { title: "TAN Registration", description: "Register for Tax Deduction Account Number", icon: FileText },
    { title: "Form 16 Download", description: "Download salary certificate from employer", icon: Download },
    { title: "Tax Payment", description: "Pay advance tax or self-assessment tax", icon: CreditCard }
  ];

  const calculateTax = () => {
    const annualIncome = parseFloat(income);
    if (annualIncome > 0) {
      setTaxCalculated(true);
    }
  };

  const getTaxAmount = (income: number) => {
    let tax = 0;
    if (income > 250000) tax += Math.min(income - 250000, 250000) * 0.05;
    if (income > 500000) tax += Math.min(income - 500000, 500000) * 0.20;
    if (income > 1000000) tax += Math.min(income - 1000000, 500000) * 0.30;
    if (income > 1500000) tax += (income - 1500000) * 0.30;
    return tax;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-600" />
            Tax Management Portal
          </CardTitle>
          <CardDescription>
            File returns, calculate tax, and manage your tax obligations
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="returns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="returns">Tax Returns</TabsTrigger>
          <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
          <TabsTrigger value="services">Quick Services</TabsTrigger>
          <TabsTrigger value="slabs">Tax Slabs</TabsTrigger>
        </TabsList>

        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Tax Returns</CardTitle>
              <CardDescription>
                View and manage your income tax return filings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxReturns.map((returnData, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Assessment Year {returnData.year}</h4>
                        <p className="text-sm text-muted-foreground">
                          Filed on: {returnData.dateSubmitted}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{returnData.status}</Badge>
                        <Badge 
                          variant={returnData.refundStatus === 'Completed' ? 'default' : 'secondary'}
                        >
                          {returnData.refundStatus}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Acknowledgment: </span>
                        <span className="font-mono">{returnData.acknowledgment}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Refund Amount: </span>
                        <span className="font-medium">
                          ₹{returnData.refundAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        View ITR
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      {returnData.refundStatus === 'Processed' && (
                        <Button size="sm">
                          <Clock className="h-4 w-4 mr-1" />
                          Track Refund
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">File New Tax Return</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Start filing your income tax return for AY 2024-25
                    </p>
                    <Button>
                      Start Filing ITR
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Income Tax Calculator</CardTitle>
              <CardDescription>
                Calculate your tax liability for the current financial year
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="income">Annual Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="Enter your annual income"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
                <Button onClick={calculateTax} disabled={!income}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Tax
                </Button>
              </div>

              {taxCalculated && income && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p><strong>Annual Income:</strong> ₹{parseFloat(income).toLocaleString()}</p>
                      <p><strong>Tax Liability:</strong> ₹{getTaxAmount(parseFloat(income)).toLocaleString()}</p>
                      <p><strong>Tax Rate:</strong> {((getTaxAmount(parseFloat(income)) / parseFloat(income)) * 100).toFixed(2)}%</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This is a simplified calculation. Actual tax may vary based on deductions, exemptions, and other factors.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <IconComponent className="h-8 w-8 text-blue-600 flex-shrink-0" />
                      <div className="space-y-2">
                        <h3 className="font-medium">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                        <Button size="sm" variant="outline">
                          Access Service
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="slabs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Tax Slabs (AY 2024-25)</CardTitle>
              <CardDescription>
                Income tax rates for individual taxpayers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {taxSlabs.map((slab, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">{slab.range}</span>
                    <Badge variant="secondary">{slab.rate}</Badge>
                  </div>
                ))}
              </div>
              
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Additional surcharge and cess may apply based on income levels. Consult a tax professional for detailed calculations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}