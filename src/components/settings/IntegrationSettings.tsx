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
  Video, 
  Calendar,
  Mail,
  MessageSquare,
  Key,
  CheckCircle,
  AlertCircle,
  Settings
} from "lucide-react";

const IntegrationSettings = () => {
  const [integrations, setIntegrations] = useState({
    stripe: {
      enabled: false,
      publicKey: "",
      secretKey: "",
      status: "disconnected"
    },
    videoSDK: {
      enabled: false,
      apiKey: "",
      secretKey: "",
      appId: "",
      status: "disconnected"
    },
    googleCalendar: {
      enabled: false,
      clientId: "",
      clientSecret: "",
      apiKey: "",
      status: "disconnected"
    },
    email: {
      enabled: false,
      service: "sendgrid",
      apiKey: "",
      fromEmail: "",
      status: "disconnected"
    },
    sms: {
      enabled: false,
      service: "twilio",
      accountSid: "",
      authToken: "",
      phoneNumber: "",
      status: "disconnected"
    }
  });

  const updateIntegration = (service: string, field: string, value: any) => {
    setIntegrations(prev => ({
      ...prev,
      [service]: {
        ...prev[service as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const testConnection = async (service: string) => {
    console.log(`Testing ${service} connection...`);
    // Here you would test the actual API connection
    updateIntegration(service, "status", "connected");
  };

  const saveIntegration = (service: string) => {
    console.log(`Saving ${service} integration...`);
    // Here you would save the API keys securely
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
            <Settings className="h-5 w-5" />
            <span>External Service Integrations</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Configure API keys for external services to enable full functionality
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="payment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="video">Video SDK</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
        </TabsList>

        {/* Stripe Payment Integration */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6" />
                  <div>
                    <CardTitle>Stripe Payment Integration</CardTitle>
                    <p className="text-sm text-muted-foreground">Enable payment processing for appointments</p>
                  </div>
                </div>
                {getStatusBadge(integrations.stripe.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Stripe Payments</Label>
                <Switch 
                  checked={integrations.stripe.enabled}
                  onCheckedChange={(checked) => updateIntegration("stripe", "enabled", checked)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stripe-public">Stripe Publishable Key</Label>
                  <Input
                    id="stripe-public"
                    type="password"
                    placeholder="pk_test_..."
                    value={integrations.stripe.publicKey}
                    onChange={(e) => updateIntegration("stripe", "publicKey", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
                  <Input
                    id="stripe-secret"
                    type="password"
                    placeholder="sk_test_..."
                    value={integrations.stripe.secretKey}
                    onChange={(e) => updateIntegration("stripe", "secretKey", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => testConnection("stripe")} variant="outline">
                  Test Connection
                </Button>
                <Button onClick={() => saveIntegration("stripe")}>
                  Save Configuration
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Setup Instructions:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Create account at <a href="https://stripe.com" className="text-blue-600 hover:underline">stripe.com</a></li>
                  <li>Navigate to Developers → API Keys</li>
                  <li>Copy your Publishable and Secret keys</li>
                  <li>Paste them above and test the connection</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video SDK Integration */}
        <TabsContent value="video">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Video className="h-6 w-6" />
                  <div>
                    <CardTitle>Video SDK Integration</CardTitle>
                    <p className="text-sm text-muted-foreground">Enable video consultations and 3-way conferencing</p>
                  </div>
                </div>
                {getStatusBadge(integrations.videoSDK.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Video SDK</Label>
                <Switch 
                  checked={integrations.videoSDK.enabled}
                  onCheckedChange={(checked) => updateIntegration("videoSDK", "enabled", checked)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="video-api-key">Video SDK API Key</Label>
                  <Input
                    id="video-api-key"
                    type="password"
                    placeholder="Your Video SDK API Key"
                    value={integrations.videoSDK.apiKey}
                    onChange={(e) => updateIntegration("videoSDK", "apiKey", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="video-secret">Video SDK Secret Key</Label>
                  <Input
                    id="video-secret"
                    type="password"
                    placeholder="Your Video SDK Secret"
                    value={integrations.videoSDK.secretKey}
                    onChange={(e) => updateIntegration("videoSDK", "secretKey", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="video-app-id">App ID (if required)</Label>
                  <Input
                    id="video-app-id"
                    placeholder="Your App ID"
                    value={integrations.videoSDK.appId}
                    onChange={(e) => updateIntegration("videoSDK", "appId", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => testConnection("videoSDK")} variant="outline">
                  Test Connection
                </Button>
                <Button onClick={() => saveIntegration("videoSDK")}>
                  Save Configuration
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Setup Instructions:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Sign up at <a href="https://videosdk.live" className="text-blue-600 hover:underline">videosdk.live</a></li>
                  <li>Create a new project</li>
                  <li>Get your API Key and Secret from the dashboard</li>
                  <li>Configure webhook URLs for meeting events</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Google Calendar Integration */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6" />
                  <div>
                    <CardTitle>Google Calendar Integration</CardTitle>
                    <p className="text-sm text-muted-foreground">Sync appointments with Google Calendar</p>
                  </div>
                </div>
                {getStatusBadge(integrations.googleCalendar.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Google Calendar Sync</Label>
                <Switch 
                  checked={integrations.googleCalendar.enabled}
                  onCheckedChange={(checked) => updateIntegration("googleCalendar", "enabled", checked)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="google-client-id">Google Client ID</Label>
                  <Input
                    id="google-client-id"
                    placeholder="Your Google Client ID"
                    value={integrations.googleCalendar.clientId}
                    onChange={(e) => updateIntegration("googleCalendar", "clientId", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="google-client-secret">Google Client Secret</Label>
                  <Input
                    id="google-client-secret"
                    type="password"
                    placeholder="Your Google Client Secret"
                    value={integrations.googleCalendar.clientSecret}
                    onChange={(e) => updateIntegration("googleCalendar", "clientSecret", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="google-api-key">Google API Key</Label>
                  <Input
                    id="google-api-key"
                    type="password"
                    placeholder="Your Google API Key"
                    value={integrations.googleCalendar.apiKey}
                    onChange={(e) => updateIntegration("googleCalendar", "apiKey", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => testConnection("googleCalendar")} variant="outline">
                  Test Connection
                </Button>
                <Button onClick={() => saveIntegration("googleCalendar")}>
                  Save Configuration
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Setup Instructions:</strong></p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to <a href="https://console.developers.google.com" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                  <li>Create a new project or select existing</li>
                  <li>Enable Google Calendar API</li>
                  <li>Create credentials (OAuth 2.0 Client ID)</li>
                  <li>Add your domain to authorized origins</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Integration */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-6 w-6" />
                  <div>
                    <CardTitle>Email Service Integration</CardTitle>
                    <p className="text-sm text-muted-foreground">Send appointment reminders and notifications via email</p>
                  </div>
                </div>
                {getStatusBadge(integrations.email.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Email Notifications</Label>
                <Switch 
                  checked={integrations.email.enabled}
                  onCheckedChange={(checked) => updateIntegration("email", "enabled", checked)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email-service">Email Service</Label>
                  <select 
                    id="email-service"
                    className="w-full p-2 border rounded-md"
                    value={integrations.email.service}
                    onChange={(e) => updateIntegration("email", "service", e.target.value)}
                  >
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="ses">Amazon SES</option>
                    <option value="smtp">Custom SMTP</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="email-api-key">API Key</Label>
                  <Input
                    id="email-api-key"
                    type="password"
                    placeholder="Your email service API key"
                    value={integrations.email.apiKey}
                    onChange={(e) => updateIntegration("email", "apiKey", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="from-email">From Email Address</Label>
                  <Input
                    id="from-email"
                    type="email"
                    placeholder="noreply@yourdomain.com"
                    value={integrations.email.fromEmail}
                    onChange={(e) => updateIntegration("email", "fromEmail", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => testConnection("email")} variant="outline">
                  Send Test Email
                </Button>
                <Button onClick={() => saveIntegration("email")}>
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Integration */}
        <TabsContent value="sms">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-6 w-6" />
                  <div>
                    <CardTitle>SMS Service Integration</CardTitle>
                    <p className="text-sm text-muted-foreground">Send appointment reminders and notifications via SMS</p>
                  </div>
                </div>
                {getStatusBadge(integrations.sms.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable SMS Notifications</Label>
                <Switch 
                  checked={integrations.sms.enabled}
                  onCheckedChange={(checked) => updateIntegration("sms", "enabled", checked)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sms-service">SMS Service</Label>
                  <select 
                    id="sms-service"
                    className="w-full p-2 border rounded-md"
                    value={integrations.sms.service}
                    onChange={(e) => updateIntegration("sms", "service", e.target.value)}
                  >
                    <option value="twilio">Twilio</option>
                    <option value="msg91">MSG91</option>
                    <option value="textlocal">TextLocal</option>
                    <option value="gupshup">Gupshup</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="sms-account-sid">Account SID / API Key</Label>
                  <Input
                    id="sms-account-sid"
                    type="password"
                    placeholder="Your SMS service account SID"
                    value={integrations.sms.accountSid}
                    onChange={(e) => updateIntegration("sms", "accountSid", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sms-auth-token">Auth Token / Secret</Label>
                  <Input
                    id="sms-auth-token"
                    type="password"
                    placeholder="Your SMS service auth token"
                    value={integrations.sms.authToken}
                    onChange={(e) => updateIntegration("sms", "authToken", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sms-phone">From Phone Number</Label>
                  <Input
                    id="sms-phone"
                    placeholder="+1234567890"
                    value={integrations.sms.phoneNumber}
                    onChange={(e) => updateIntegration("sms", "phoneNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => testConnection("sms")} variant="outline">
                  Send Test SMS
                </Button>
                <Button onClick={() => saveIntegration("sms")}>
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationSettings;