import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Wallet, Smartphone, Plus, TrendingUp, TrendingDown, DollarSign, Receipt, Calendar, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "wallet" | "bank";
  name: string;
  details: string;
  isDefault: boolean;
  lastUsed: string;
}

interface Transaction {
  id: string;
  type: "consultation" | "medicine" | "test" | "procedure" | "subscription";
  description: string;
  amount: number;
  paymentMethod: string;
  insuranceCovered: number;
  outOfPocket: number;
  date: string;
  status: "completed" | "pending" | "failed";
  doctor?: string;
  receiptUrl?: string;
}

const PaymentManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - will be replaced with real data
  const paymentMethods: PaymentMethod[] = [
    {
      id: "1",
      type: "card",
      name: "HDFC Credit Card",
      details: "•••• •••• •••• 4242",
      isDefault: true,
      lastUsed: "2024-01-15"
    },
    {
      id: "2", 
      type: "upi",
      name: "Google Pay",
      details: "john.doe@okaxis",
      isDefault: false,
      lastUsed: "2024-01-12"
    },
    {
      id: "3",
      type: "wallet",
      name: "Paytm Wallet",
      details: "Balance: ₹2,450",
      isDefault: false,
      lastUsed: "2024-01-10"
    }
  ];

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "consultation",
      description: "Dr. Sarah Johnson - Cardiology Consultation",
      amount: 800,
      paymentMethod: "HDFC Credit Card",
      insuranceCovered: 600,
      outOfPocket: 200,
      date: "2024-01-15",
      status: "completed",
      doctor: "Dr. Sarah Johnson"
    },
    {
      id: "2",
      type: "test",
      description: "Blood Test - Complete Blood Count",
      amount: 1200,
      paymentMethod: "Google Pay",
      insuranceCovered: 1000,
      outOfPocket: 200,
      date: "2024-01-12",
      status: "completed"
    },
    {
      id: "3",
      type: "medicine",
      description: "Cardiac Medications - Monthly Supply",
      amount: 650,
      paymentMethod: "Paytm Wallet",
      insuranceCovered: 0,
      outOfPocket: 650,
      date: "2024-01-10",
      status: "completed"
    },
    {
      id: "4",
      type: "subscription",
      description: "Cardiac Care Plus - Monthly Plan",
      amount: 2999,
      paymentMethod: "HDFC Credit Card",
      insuranceCovered: 0,
      outOfPocket: 2999,
      date: "2024-01-01",
      status: "completed"
    }
  ];

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalInsuranceCovered = transactions.reduce((sum, t) => sum + t.insuranceCovered, 0);
  const totalOutOfPocket = transactions.reduce((sum, t) => sum + t.outOfPocket, 0);

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />;
      case "upi":
        return <Smartphone className="h-5 w-5" />;
      case "wallet":
        return <Wallet className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return "👨‍⚕️";
      case "medicine":
        return "💊";
      case "test":
        return "🔬";
      case "procedure":
        return "🏥";
      case "subscription":
        return "📋";
      default:
        return "💳";
    }
  };

  const handleAddPaymentMethod = () => {
    toast({
      title: "Add Payment Method",
      description: "Opening payment method setup...",
    });
  };

  const handleSetDefault = (methodId: string) => {
    toast({
      title: "Default Payment Method Updated",
      description: "Your default payment method has been changed.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment & Insurance Tracking</h2>
          <p className="text-muted-foreground">
            Monitor your healthcare expenses and insurance coverage
          </p>
        </div>
        <Button variant="patient" onClick={handleAddPaymentMethod}>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent (This Year)</CardTitle>
                <CardDescription className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Insurance Covered</CardTitle>
                <CardDescription className="text-2xl font-bold text-green-600">₹{totalInsuranceCovered.toLocaleString()}</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Out of Pocket</CardTitle>
                <CardDescription className="text-2xl font-bold text-orange-600">₹{totalOutOfPocket.toLocaleString()}</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Monthly</CardTitle>
                <CardDescription className="text-2xl font-bold">₹{Math.round(totalSpent/12).toLocaleString()}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="mr-2 h-5 w-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTransactionIcon(transaction.type)}</span>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()} • {transaction.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{transaction.amount}</p>
                      <div className="text-xs space-x-2">
                        <span className="text-green-600">Insurance: ₹{transaction.insuranceCovered}</span>
                        <span className="text-orange-600">Paid: ₹{transaction.outOfPocket}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Transactions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Spending by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: "Consultations", amount: 2400, percentage: 40 },
                  { category: "Medications", amount: 1800, percentage: 30 },
                  { category: "Tests & Diagnostics", amount: 1200, percentage: 20 },
                  { category: "Subscriptions", amount: 600, percentage: 10 }
                ].map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.category}</span>
                      <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-patient h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Transaction Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <select className="px-3 py-2 border rounded-md">
                  <option value="">All Categories</option>
                  <option value="consultation">Consultations</option>
                  <option value="medicine">Medications</option>
                  <option value="test">Tests & Diagnostics</option>
                  <option value="procedure">Procedures</option>
                  <option value="subscription">Subscriptions</option>
                </select>
                <select className="px-3 py-2 border rounded-md">
                  <option value="">All Payment Methods</option>
                  <option value="card">Credit/Debit Cards</option>
                  <option value="upi">UPI</option>
                  <option value="wallet">Digital Wallets</option>
                </select>
                <select className="px-3 py-2 border rounded-md">
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* All Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{getTransactionIcon(transaction.type)}</span>
                      <div>
                        <h4 className="font-medium">{transaction.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()} • {transaction.paymentMethod}
                        </p>
                        {transaction.doctor && (
                          <p className="text-sm text-muted-foreground">Provider: {transaction.doctor}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={transaction.status === "completed" ? "secondary" : "destructive"}>
                        {transaction.status}
                      </Badge>
                      <p className="font-semibold">₹{transaction.amount}</p>
                      <div className="text-xs space-y-1">
                        <div className="text-green-600">Insurance: ₹{transaction.insuranceCovered}</div>
                        <div className="text-orange-600">Out of Pocket: ₹{transaction.outOfPocket}</div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Receipt className="mr-2 h-3 w-3" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          {/* Payment Methods */}
          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={method.isDefault ? "border-patient" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getPaymentMethodIcon(method.type)}
                      <div>
                        <h4 className="font-medium">{method.name}</h4>
                        <p className="text-sm text-muted-foreground">{method.details}</p>
                        <p className="text-xs text-muted-foreground">
                          Last used: {new Date(method.lastUsed).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && (
                        <Badge variant="default">Default</Badge>
                      )}
                      {!method.isDefault && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSetDefault(method.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Payment Method */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Plus className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Add New Payment Method</h3>
                  <p className="text-sm text-muted-foreground">
                    Add credit cards, UPI, or digital wallets
                  </p>
                </div>
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" onClick={handleAddPaymentMethod}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Card
                  </Button>
                  <Button variant="outline" onClick={handleAddPaymentMethod}>
                    <Smartphone className="mr-2 h-4 w-4" />
                    Add UPI
                  </Button>
                  <Button variant="outline" onClick={handleAddPaymentMethod}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Add Wallet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          {/* Insurance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Coverage Used</CardTitle>
                <CardDescription className="text-2xl font-bold">₹{totalInsuranceCovered.toLocaleString()}</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Annual Limit</CardTitle>
                <CardDescription className="text-2xl font-bold">₹5,00,000</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
                <CardDescription className="text-2xl font-bold text-green-600">₹4,98,400</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Insurance Details */}
          <Card>
            <CardHeader>
              <CardTitle>Insurance Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Star Health Insurance</h4>
                  <p className="text-sm text-muted-foreground">Policy No: SH123456789</p>
                  <p className="text-sm text-muted-foreground">Valid until: Dec 31, 2024</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium">Coverage Details</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Annual Limit: ₹5,00,000</div>
                  <div>Co-payment: 10%</div>
                  <div>Deductible: ₹5,000</div>
                  <div>Network Hospitals: 8,500+</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Claims */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Insurance Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Blood Test - CBC</p>
                    <p className="text-sm text-muted-foreground">Claim ID: CLM001</p>
                    <p className="text-sm text-muted-foreground">Submitted: Jan 12, 2024</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Approved</Badge>
                    <p className="text-sm font-medium">₹1,000</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Cardiology Consultation</p>
                    <p className="text-sm text-muted-foreground">Claim ID: CLM002</p>
                    <p className="text-sm text-muted-foreground">Submitted: Jan 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">Processing</Badge>
                    <p className="text-sm font-medium">₹600</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentManagement;