import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Cloud, 
  Database, 
  Key, 
  Server,
  CheckCircle,
  AlertCircle,
  HardDrive,
  Globe
} from "lucide-react";

const VaultSettings = () => {
  const [storageSettings, setStorageSettings] = useState({
    provider: "aws-s3",
    encryption: true,
    backupEnabled: true,
    region: "us-east-1",
    retentionPeriod: "7-years"
  });

  const [complianceSettings, setComplianceSettings] = useState({
    hipaaCompliance: true,
    auditLogging: true,
    dataResidency: "us-only",
    accessControls: true
  });

  const storageProviders = [
    {
      id: "aws-s3",
      name: "Amazon S3",
      icon: <Cloud className="h-5 w-5" />,
      description: "HIPAA-compliant S3 buckets with encryption",
      pricing: "$0.023/GB/month",
      compliance: ["HIPAA", "SOC 2", "ISO 27001"]
    },
    {
      id: "firebase",
      name: "Google Firebase",
      icon: <Database className="h-5 w-5" />,
      description: "Google Cloud Storage with Firebase integration",
      pricing: "$0.026/GB/month",
      compliance: ["HIPAA", "SOC 2", "ISO 27001"]
    },
    {
      id: "owncloud",
      name: "OwnCloud",
      icon: <Server className="h-5 w-5" />,
      description: "Self-hosted private cloud storage",
      pricing: "Self-hosted pricing",
      compliance: ["GDPR", "Custom compliance"]
    }
  ];

  const subscriptionPlans = [
    {
      name: "Basic",
      price: "$9.99/month",
      storage: "10 GB",
      features: [
        "Basic encryption",
        "Document upload",
        "Email support",
        "HIPAA compliance"
      ],
      recommended: false
    },
    {
      name: "Professional",
      price: "$24.99/month",
      storage: "100 GB", 
      features: [
        "Advanced encryption",
        "AI document analysis",
        "Priority support",
        "Advanced sharing",
        "Audit logs",
        "API access"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "$99.99/month",
      storage: "1 TB",
      features: [
        "Enterprise encryption",
        "Custom compliance",
        "Dedicated support",
        "White labeling",
        "Advanced analytics",
        "SSO integration",
        "Custom retention"
      ],
      recommended: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Vault Configuration</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Configure storage, compliance, and subscription settings for your document vault
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="storage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="storage">Storage Settings</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="subscription">Subscription Plans</TabsTrigger>
          <TabsTrigger value="api-keys">API Configuration</TabsTrigger>
        </TabsList>

        {/* Storage Settings */}
        <TabsContent value="storage">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Storage Provider</CardTitle>
                <p className="text-muted-foreground">
                  Select your preferred cloud storage provider for encrypted document storage
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {storageProviders.map((provider) => (
                    <Card 
                      key={provider.id} 
                      className={`cursor-pointer transition-colors ${
                        storageSettings.provider === provider.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setStorageSettings({...storageSettings, provider: provider.id})}
                    >
                      <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                          <div className="flex justify-center">
                            {provider.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{provider.name}</h3>
                            <p className="text-sm text-muted-foreground">{provider.description}</p>
                            <p className="text-sm font-medium text-primary mt-2">{provider.pricing}</p>
                          </div>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {provider.compliance.map((cert) => (
                              <Badge key={cert} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">AES-256 Encryption</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable advanced encryption for all stored documents
                        </p>
                      </div>
                      <Switch 
                        checked={storageSettings.encryption}
                        onCheckedChange={(checked) => setStorageSettings({
                          ...storageSettings, 
                          encryption: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Automated Backups</Label>
                        <p className="text-sm text-muted-foreground">
                          Daily encrypted backups to secondary location
                        </p>
                      </div>
                      <Switch 
                        checked={storageSettings.backupEnabled}
                        onCheckedChange={(checked) => setStorageSettings({
                          ...storageSettings, 
                          backupEnabled: checked
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="region">Storage Region</Label>
                      <select 
                        id="region"
                        className="w-full border rounded-md px-3 py-2 mt-1"
                        value={storageSettings.region}
                        onChange={(e) => setStorageSettings({
                          ...storageSettings, 
                          region: e.target.value
                        })}
                      >
                        <option value="us-east-1">US East (N. Virginia)</option>
                        <option value="us-west-2">US West (Oregon)</option>
                        <option value="eu-west-1">EU West (Ireland)</option>
                        <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="retention">Data Retention Period</Label>
                      <select 
                        id="retention"
                        className="w-full border rounded-md px-3 py-2 mt-1"
                        value={storageSettings.retentionPeriod}
                        onChange={(e) => setStorageSettings({
                          ...storageSettings, 
                          retentionPeriod: e.target.value
                        })}
                      >
                        <option value="1-year">1 Year</option>
                        <option value="3-years">3 Years</option>
                        <option value="7-years">7 Years (HIPAA Standard)</option>
                        <option value="10-years">10 Years</option>
                        <option value="indefinite">Indefinite</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">Save Storage Configuration</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance */}
        <TabsContent value="compliance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>HIPAA Compliance Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-800">HIPAA Compliance Active</h4>
                      <p className="text-sm text-green-700">
                        Your vault meets all HIPAA security and privacy requirements
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">HIPAA Compliance</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable HIPAA-compliant data handling
                        </p>
                      </div>
                      <Switch 
                        checked={complianceSettings.hipaaCompliance}
                        onCheckedChange={(checked) => setComplianceSettings({
                          ...complianceSettings, 
                          hipaaCompliance: checked
                        })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Audit Logging</Label>
                        <p className="text-sm text-muted-foreground">
                          Log all access and modification attempts
                        </p>
                      </div>
                      <Switch 
                        checked={complianceSettings.auditLogging}
                        onCheckedChange={(checked) => setComplianceSettings({
                          ...complianceSettings, 
                          auditLogging: checked
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="data-residency">Data Residency</Label>
                      <select 
                        id="data-residency"
                        className="w-full border rounded-md px-3 py-2 mt-1"
                        value={complianceSettings.dataResidency}
                        onChange={(e) => setComplianceSettings({
                          ...complianceSettings, 
                          dataResidency: e.target.value
                        })}
                      >
                        <option value="us-only">United States Only</option>
                        <option value="eu-only">European Union Only</option>
                        <option value="global">Global (Optimized)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Advanced Access Controls</Label>
                        <p className="text-sm text-muted-foreground">
                          Role-based access and multi-factor authentication
                        </p>
                      </div>
                      <Switch 
                        checked={complianceSettings.accessControls}
                        onCheckedChange={(checked) => setComplianceSettings({
                          ...complianceSettings, 
                          accessControls: checked
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Compliance Features Included:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">End-to-end encryption</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Access audit trails</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Data breach notifications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Business Associate Agreement</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Minimum necessary access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Secure data disposal</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscription Plans */}
        <TabsContent value="subscription">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Plan</CardTitle>
                <p className="text-muted-foreground">
                  Select the plan that best fits your storage and feature needs
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan) => (
                    <Card 
                      key={plan.name} 
                      className={`relative ${plan.recommended ? 'ring-2 ring-primary' : ''}`}
                    >
                      {plan.recommended && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary">Recommended</Badge>
                        </div>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="text-3xl font-bold text-primary">{plan.price}</div>
                        <p className="text-muted-foreground">{plan.storage} encrypted storage</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className={`w-full mt-6 ${plan.recommended ? '' : 'variant-outline'}`}
                          variant={plan.recommended ? 'default' : 'outline'}
                        >
                          {plan.recommended ? 'Start Free Trial' : 'Choose Plan'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Configuration */}
        <TabsContent value="api-keys">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>API Configuration</span>
                </CardTitle>
                <p className="text-muted-foreground">
                  Configure API keys for storage providers and AI services
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">AWS S3 Configuration</h4>
                    <div>
                      <Label htmlFor="aws-access-key">AWS Access Key ID</Label>
                      <Input id="aws-access-key" type="password" placeholder="AKIA..." />
                    </div>
                    <div>
                      <Label htmlFor="aws-secret-key">AWS Secret Access Key</Label>
                      <Input id="aws-secret-key" type="password" placeholder="Secret key..." />
                    </div>
                    <div>
                      <Label htmlFor="s3-bucket">S3 Bucket Name</Label>
                      <Input id="s3-bucket" placeholder="my-hipaa-vault-bucket" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">AI Services (Optional)</h4>
                    <div>
                      <Label htmlFor="openai-key">OpenAI API Key (for AI summaries)</Label>
                      <Input id="openai-key" type="password" placeholder="sk-..." />
                    </div>
                    <div>
                      <Label htmlFor="azure-key">Azure Cognitive Services Key</Label>
                      <Input id="azure-key" type="password" placeholder="Azure key..." />
                    </div>
                    <div>
                      <Label htmlFor="huggingface-key">HuggingFace API Key</Label>
                      <Input id="huggingface-key" type="password" placeholder="hf_..." />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Security Notice</h4>
                      <p className="text-sm text-yellow-700">
                        API keys are encrypted and stored securely. Never share your keys or store them in unsecured locations.
                        For production use, consider using IAM roles and temporary credentials where possible.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save API Configuration</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VaultSettings;