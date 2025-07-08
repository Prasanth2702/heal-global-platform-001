import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreditCard, 
  Wallet, 
  Shield, 
  Receipt, 
  Building2,
  UserCheck,
  Calendar,
  Heart,
  DollarSign,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users
} from "lucide-react";

interface PaymentOption {
  id: string;
  type: "one-time" | "subscription" | "insurance" | "wallet";
  name: string;
  description: string;
  amount: number;
  category: string;
  isRefundable: boolean;
}

interface InsuranceClaim {
  id: string;
  policyNumber: string;
  provider: string;
  coverageAmount: number;
  deductible: number;
  status: "pending" | "approved" | "rejected";
}

const PaymentHub = () => {
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [walletBalance, setWalletBalance] = useState(2500);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [insuranceDetails, setInsuranceDetails] = useState<InsuranceClaim | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("");

  const paymentOptions: PaymentOption[] = [
    {
      id: "appointment",
      type: "one-time",
      name: "Doctor Consultation",
      description: "One-time appointment payment",
      amount: 1200,
      category: "consultation",
      isRefundable: false
    },
    {
      id: "lab-tests",
      type: "one-time", 
      name: "Laboratory Tests",
      description: "Pathology and diagnostic services",
      amount: 850,
      category: "diagnostics",
      isRefundable: false
    },
    {
      id: "surgery",
      type: "one-time",
      name: "Surgical Procedure",
      description: "Hospital surgical services",
      amount: 45000,
      category: "surgery",
      isRefundable: false
    },
    {
      id: "diabetes-care",
      type: "subscription",
      name: "Diabetes Care Plan",
      description: "Monthly chronic condition management",
      amount: 2499,
      category: "chronic-care",
      isRefundable: true
    },
    {
      id: "cardiac-care",
      type: "subscription",
      name: "Cardiac Care Plan",
      description: "Comprehensive heart health monitoring",
      amount: 3999,
      category: "chronic-care",
      isRefundable: true
    },
    {
      id: "corporate-health",
      type: "insurance",
      name: "Corporate Health Checkup",
      description: "Employee health screening package",
      amount: 5500,
      category: "corporate",
      isRefundable: false
    }
  ];

  const subscriptionPlans = [
    {
      id: "individual-doctor",
      name: "Individual Doctor",
      price: 299,
      features: ["5 appointments/month", "Basic analytics", "Email support"],
      popular: false
    },
    {
      id: "clinic",
      name: "Clinic/Small Practice",
      price: 999,
      features: ["Unlimited appointments", "Multi-doctor support", "Advanced analytics", "Priority support"],
      popular: true
    },
    {
      id: "hospital",
      name: "Hospital/Large Facility",
      price: 4999,
      features: ["Enterprise features", "Custom integrations", "Dedicated support", "White labeling"],
      popular: false
    }
  ];

  const jurisdictions = [
    { code: "US", name: "United States", refundPolicy: "14-day cancellation for subscriptions, no refunds for completed services" },
    { code: "IN", name: "India", refundPolicy: "48-hour cancellation window, governed by Consumer Protection Act 2019" },
    { code: "UK", name: "United Kingdom", refundPolicy: "7-day cooling-off period under Consumer Rights Act 2015" },
    { code: "CA", name: "Canada", refundPolicy: "Provincial consumer protection laws apply" },
    { code: "AU", name: "Australia", refundPolicy: "Australian Consumer Law protections apply" }
  ];

  const handlePayment = (option: PaymentOption) => {
    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions before proceeding");
      return;
    }
    if (!selectedJurisdiction) {
      alert("Please select your jurisdiction");
      return;
    }
    
    console.log("Processing payment:", {
      option,
      paymentMethod,
      jurisdiction: selectedJurisdiction,
      useWallet: paymentMethod === "wallet"
    });
    // Payment processing logic would go here
  };

  const processInsuranceClaim = () => {
    console.log("Processing insurance claim:", insuranceDetails);
    // Insurance claim processing logic
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Multi-Mode Payment Hub</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Comprehensive payment solution for healthcare services, subscriptions, and insurance claims
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
        </TabsList>

        {/* Services Payment */}
        <TabsContent value="services">
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button
                    variant={paymentMethod === "stripe" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("stripe")}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <CreditCard className="h-6 w-6" />
                    <span>Card (Stripe)</span>
                  </Button>
                  <Button
                    variant={paymentMethod === "razorpay" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("razorpay")}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <CreditCard className="h-6 w-6" />
                    <span>UPI/Card (Razorpay)</span>
                  </Button>
                  <Button
                    variant={paymentMethod === "wallet" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("wallet")}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Wallet className="h-6 w-6" />
                    <span>Wallet (₹{walletBalance})</span>
                  </Button>
                  <Button
                    variant={paymentMethod === "insurance" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("insurance")}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Shield className="h-6 w-6" />
                    <span>Insurance</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Service Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentOptions.map((option) => (
                <Card key={option.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{option.name}</CardTitle>
                      <Badge variant={option.type === "subscription" ? "default" : "secondary"}>
                        {option.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{option.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-primary">
                        ₹{option.amount.toLocaleString()}
                        {option.type === "subscription" && <span className="text-sm">/month</span>}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {option.isRefundable ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">
                          {option.isRefundable ? "Refundable" : "Non-refundable"}
                        </span>
                      </div>

                      <Button 
                        onClick={() => handlePayment(option)}
                        disabled={paymentMethod === "wallet" && walletBalance < option.amount}
                        className="w-full"
                      >
                        {paymentMethod === "wallet" ? "Pay from Wallet" : "Pay Now"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Terms and Jurisdiction */}
            <Card>
              <CardHeader>
                <CardTitle>Terms & Jurisdiction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="jurisdiction">Select Jurisdiction</Label>
                  <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your country/state" />
                    </SelectTrigger>
                    <SelectContent>
                      {jurisdictions.map((jurisdiction) => (
                        <SelectItem key={jurisdiction.code} value={jurisdiction.code}>
                          {jurisdiction.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedJurisdiction && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm">
                      <strong>Refund Policy ({jurisdictions.find(j => j.code === selectedJurisdiction)?.name}):</strong>
                      <br />
                      {jurisdictions.find(j => j.code === selectedJurisdiction)?.refundPolicy}
                    </p>
                  </div>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>,{" "}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>, and{" "}
                    <a href="#" className="text-blue-600 hover:underline">Non-Refundable Policy</a> as per the selected jurisdiction.
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insurance Claims */}
        <TabsContent value="insurance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Insurance Claims Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="instant-claim">
                  <TabsList>
                    <TabsTrigger value="instant-claim">Instant Claim</TabsTrigger>
                    <TabsTrigger value="pay-then-claim">Pay Then Claim</TabsTrigger>
                    <TabsTrigger value="corporate-health">Corporate Health</TabsTrigger>
                  </TabsList>

                  <TabsContent value="instant-claim" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="policy-number">Insurance Policy Number</Label>
                        <Input id="policy-number" placeholder="POL123456789" />
                      </div>
                      <div>
                        <Label htmlFor="insurance-provider">Insurance Provider</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="star-health">Star Health Insurance</SelectItem>
                            <SelectItem value="hdfc-ergo">HDFC ERGO</SelectItem>
                            <SelectItem value="icici-lombard">ICICI Lombard</SelectItem>
                            <SelectItem value="bajaj-allianz">Bajaj Allianz</SelectItem>
                            <SelectItem value="max-bupa">Max Bupa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="sum-insured">Sum Insured</Label>
                        <Input id="sum-insured" type="number" placeholder="500000" />
                      </div>
                      <div>
                        <Label htmlFor="deductible">Deductible Amount</Label>
                        <Input id="deductible" type="number" placeholder="5000" />
                      </div>
                    </div>
                    <Button onClick={processInsuranceClaim} className="w-full">
                      Submit Instant Claim
                    </Button>
                  </TabsContent>

                  <TabsContent value="pay-then-claim" className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Pay First, Claim Later Process</h4>
                      <ol className="list-decimal list-inside text-sm space-y-1">
                        <li>Pay for the service using any payment method</li>
                        <li>Receive detailed invoice and medical reports</li>
                        <li>Submit claim documents to your insurance provider</li>
                        <li>Receive reimbursement directly from insurance company</li>
                      </ol>
                    </div>
                    <Button className="w-full">Proceed with Payment</Button>
                  </TabsContent>

                  <TabsContent value="corporate-health" className="space-y-4">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" placeholder="Acme Corporation" />
                    </div>
                    <div>
                      <Label htmlFor="employee-id">Employee ID</Label>
                      <Input id="employee-id" placeholder="EMP001" />
                    </div>
                    <div>
                      <Label htmlFor="hr-approval">HR Approval Code</Label>
                      <Input id="hr-approval" placeholder="HR-APPR-2024-001" />
                    </div>
                    <Button className="w-full">Submit Corporate Health Claim</Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Wallet Management */}
        <TabsContent value="wallet">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5" />
                    <span>Patient Wallet</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">
                    ₹{walletBalance.toLocaleString()}
                  </div>
                  <p className="text-muted-foreground mb-4">Available Balance</p>
                  <div className="space-y-2">
                    <Button className="w-full">Add Money</Button>
                    <Button variant="outline" className="w-full">Transaction History</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Dr. Smith Consultation</p>
                        <p className="text-sm text-muted-foreground">Yesterday</p>
                      </div>
                      <span className="text-red-600">-₹1,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Wallet Top-up</p>
                        <p className="text-sm text-muted-foreground">2 days ago</p>
                      </div>
                      <span className="text-green-600">+₹5,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Lab Tests</p>
                        <p className="text-sm text-muted-foreground">3 days ago</p>
                      </div>
                      <span className="text-red-600">-₹850</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Wallet Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Instant payments</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Cashback rewards</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Family sharing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Auto-refill</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Subscription Plans */}
        <TabsContent value="subscriptions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Provider Subscriptions</CardTitle>
                <p className="text-muted-foreground">
                  Choose the right plan for your practice size and needs
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan) => (
                    <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary">Most Popular</Badge>
                        </div>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="text-3xl font-bold text-primary">
                          ₹{plan.price.toLocaleString()}
                          <span className="text-sm text-muted-foreground">/month</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                          variant={plan.popular ? 'default' : 'outline'}
                        >
                          {plan.popular ? 'Start Free Trial' : 'Choose Plan'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chronic Care Subscriptions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Chronic Care Subscriptions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentOptions.filter(option => option.type === "subscription").map((plan) => (
                    <Card key={plan.id}>
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <p className="text-muted-foreground">{plan.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary mb-4">
                          ₹{plan.amount}/month
                        </div>
                        <Button className="w-full">Subscribe Now</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Invoice Management */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5" />
                <span>Auto-Generated Invoices</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Invoice management system</p>
                <p className="text-sm">Auto-generated invoices for all transactions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Management */}
        <TabsContent value="commission">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Commission Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <p>Platform commission tracking</p>
                <p className="text-sm">Revenue sharing and commission management</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentHub;