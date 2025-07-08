import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Key, 
  Smartphone, 
  Globe, 
  Shield,
  CheckCircle,
  AlertCircle,
  Wallet,
  Building
} from "lucide-react";

const PaymentSettings = () => {
  const [paymentConfig, setPaymentConfig] = useState({
    stripe: {
      enabled: true,
      publicKey: "",
      secretKey: "",
      webhookSecret: "",
      status: "disconnected"
    },
    razorpay: {
      enabled: true,
      keyId: "",
      keySecret: "",
      webhookSecret: "",
      status: "disconnected"
    },
    wallet: {
      enabled: true,
      minBalance: 100,
      maxBalance: 50000,
      autoTopUp: false,
      cashbackPercentage: 2
    },
    commission: {
      platformFee: 5,
      doctorCommission: 70,
      hospitalCommission: 25,
      payoutSchedule: "weekly"
    },
    insurance: {
      enabled: true,
      instantClaimProviders: ["star-health", "hdfc-ergo", "icici-lombard"],
      maxClaimAmount: 100000,
      requirePreAuth: true
    }
  });

  const updatePaymentConfig = (provider: string, field: string, value: any) => {
    setPaymentConfig(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const testConnection = async (provider: string) => {
    console.log(`Testing ${provider} connection...`);
    // API connection test logic
    updatePaymentConfig(provider, "status", "connected");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case "error":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Gateway Configuration</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Configure multiple payment providers for comprehensive payment processing
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="stripe" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="razorpay">Razorpay</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        {/* Stripe Configuration */}
        <TabsContent value="stripe">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6" />
                  <div>
                    <CardTitle>Stripe Payment Gateway</CardTitle>
                    <p className="text-sm text-muted-foreground">Global payment processing</p>
                  </div>
                </div>
                {getStatusBadge(paymentConfig.stripe.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Stripe Payments</Label>
                <Switch 
                  checked={paymentConfig.stripe.enabled}
                  onCheckedChange={(checked) => updatePaymentConfig("stripe", "enabled", checked)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stripe-public">Stripe Publishable Key</Label>
                  <Input
                    id="stripe-public"
                    type="password"
                    placeholder="pk_live_..."
                    value={paymentConfig.stripe.publicKey}
                    onChange={(e) => updatePaymentConfig("stripe", "publicKey", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
                  <Input
                    id="stripe-secret"
                    type="password"
                    placeholder="sk_live_..."
                    value={paymentConfig.stripe.secretKey}
                    onChange={(e) => updatePaymentConfig("stripe", "secretKey", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="stripe-webhook">Webhook Secret (Optional)</Label>
                  <Input
                    id="stripe-webhook"
                    type="password"
                    placeholder="whsec_..."
                    value={paymentConfig.stripe.webhookSecret}
                    onChange={(e) => updatePaymentConfig("stripe", "webhookSecret", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => testConnection("stripe")} variant="outline">
                  Test Connection
                </Button>
                <Button>Save Configuration</Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Supported Features:</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>One-time payments and subscriptions</li>
                  <li>Multi-currency support</li>
                  <li>Strong Customer Authentication (SCA)</li>
                  <li>Comprehensive fraud protection</li>
                  <li>Automatic invoice generation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Razorpay Configuration */}
        <TabsContent value="razorpay">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-6 w-6" />
                  <div>
                    <CardTitle>Razorpay Payment Gateway</CardTitle>
                    <p className="text-sm text-muted-foreground">India-focused payment solutions</p>
                  </div>
                </div>
                {getStatusBadge(paymentConfig.razorpay.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Razorpay Payments</Label>
                <Switch 
                  checked={paymentConfig.razorpay.enabled}
                  onCheckedChange={(checked) => updatePaymentConfig("razorpay", "enabled", checked)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="razorpay-key-id">Razorpay Key ID</Label>
                  <Input
                    id="razorpay-key-id"
                    type="password"
                    placeholder="rzp_live_..."
                    value={paymentConfig.razorpay.keyId}
                    onChange={(e) => updatePaymentConfig("razorpay", "keyId", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="razorpay-key-secret">Razorpay Key Secret</Label>
                  <Input
                    id="razorpay-key-secret"
                    type="password"
                    placeholder="Key secret..."
                    value={paymentConfig.razorpay.keySecret}
                    onChange={(e) => updatePaymentConfig("razorpay", "keySecret", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="razorpay-webhook">Webhook Secret (Optional)</Label>
                  <Input
                    id="razorpay-webhook"
                    type="password"
                    placeholder="Webhook secret..."
                    value={paymentConfig.razorpay.webhookSecret}
                    onChange={(e) => updatePaymentConfig("razorpay", "webhookSecret", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => testConnection("razorpay")} variant="outline">
                  Test Connection
                </Button>
                <Button>Save Configuration</Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Supported Payment Methods:</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>UPI (GPay, PhonePe, Paytm, etc.)</li>
                  <li>Net Banking (100+ banks)</li>
                  <li>Credit/Debit Cards</li>
                  <li>Digital Wallets</li>
                  <li>EMI options</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Configuration */}
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wallet className="h-6 w-6" />
                  <div>
                    <CardTitle>Digital Wallet System</CardTitle>
                    <p className="text-sm text-muted-foreground">In-app wallet for patients and clinics</p>
                  </div>
                </div>
                <Badge className="bg-green-500">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>Enable Wallet System</Label>
                <Switch 
                  checked={paymentConfig.wallet.enabled}
                  onCheckedChange={(checked) => updatePaymentConfig("wallet", "enabled", checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-balance">Minimum Wallet Balance</Label>
                  <Input
                    id="min-balance"
                    type="number"
                    value={paymentConfig.wallet.minBalance}
                    onChange={(e) => updatePaymentConfig("wallet", "minBalance", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="max-balance">Maximum Wallet Balance</Label>
                  <Input
                    id="max-balance"
                    type="number"
                    value={paymentConfig.wallet.maxBalance}
                    onChange={(e) => updatePaymentConfig("wallet", "maxBalance", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="cashback">Cashback Percentage</Label>
                  <Input
                    id="cashback"
                    type="number"
                    step="0.1"
                    value={paymentConfig.wallet.cashbackPercentage}
                    onChange={(e) => updatePaymentConfig("wallet", "cashbackPercentage", parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto Top-up</Label>
                  <Switch 
                    checked={paymentConfig.wallet.autoTopUp}
                    onCheckedChange={(checked) => updatePaymentConfig("wallet", "autoTopUp", checked)}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Wallet Features:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Instant payments</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Family wallet sharing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Cashback rewards</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Transaction history</span>
                  </div>
                </div>
              </div>

              <Button className="w-full">Save Wallet Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Management */}
        <TabsContent value="commission">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Building className="h-6 w-6" />
                <div>
                  <CardTitle>Commission & Revenue Sharing</CardTitle>
                  <p className="text-sm text-muted-foreground">Platform commission and payout settings</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                  <Input
                    id="platform-fee"
                    type="number"
                    step="0.1"
                    value={paymentConfig.commission.platformFee}
                    onChange={(e) => updatePaymentConfig("commission", "platformFee", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="doctor-commission">Doctor Commission (%)</Label>
                  <Input
                    id="doctor-commission"
                    type="number"
                    value={paymentConfig.commission.doctorCommission}
                    onChange={(e) => updatePaymentConfig("commission", "doctorCommission", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="hospital-commission">Hospital Commission (%)</Label>
                  <Input
                    id="hospital-commission"
                    type="number"
                    value={paymentConfig.commission.hospitalCommission}
                    onChange={(e) => updatePaymentConfig("commission", "hospitalCommission", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payout-schedule">Payout Schedule</Label>
                <select 
                  id="payout-schedule"
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  value={paymentConfig.commission.payoutSchedule}
                  onChange={(e) => updatePaymentConfig("commission", "payoutSchedule", e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Commission Breakdown</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <p>Platform Fee: {paymentConfig.commission.platformFee}%</p>
                  <p>Doctor/Provider: {paymentConfig.commission.doctorCommission}%</p>
                  <p>Hospital/Facility: {paymentConfig.commission.hospitalCommission}%</p>
                  <p className="pt-2 border-t border-blue-300">
                    Total: {paymentConfig.commission.platformFee + paymentConfig.commission.doctorCommission + paymentConfig.commission.hospitalCommission}%
                  </p>
                </div>
              </div>

              <Button className="w-full">Save Commission Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Configuration */}
        <TabsContent value="insurance">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6" />
                <div>
                  <CardTitle>Insurance Claims Integration</CardTitle>
                  <p className="text-sm text-muted-foreground">Configure insurance providers and claim processing</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>Enable Insurance Claims</Label>
                <Switch 
                  checked={paymentConfig.insurance.enabled}
                  onCheckedChange={(checked) => updatePaymentConfig("insurance", "enabled", checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-claim">Maximum Claim Amount</Label>
                  <Input
                    id="max-claim"
                    type="number"
                    value={paymentConfig.insurance.maxClaimAmount}
                    onChange={(e) => updatePaymentConfig("insurance", "maxClaimAmount", parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Pre-Authorization</Label>
                  <Switch 
                    checked={paymentConfig.insurance.requirePreAuth}
                    onCheckedChange={(checked) => updatePaymentConfig("insurance", "requirePreAuth", checked)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Supported Insurance Providers</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Star Health Insurance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">HDFC ERGO</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">ICICI Lombard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Bajaj Allianz</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Max Bupa</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">New India Assurance</span>
                  </div>
                </div>
              </div>

              <Button className="w-full">Save Insurance Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentSettings;