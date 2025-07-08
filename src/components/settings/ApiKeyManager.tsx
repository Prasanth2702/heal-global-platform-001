import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApiKeys } from '@/contexts/ApiKeyContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  Settings,
  Brain,
  MessageSquare,
  Mic,
  Search,
  Sparkles
} from 'lucide-react';

const ApiKeyManager = () => {
  const { apiKeys, updateApiKey, isConfigured, testApiKey, clearApiKeys } = useApiKeys();
  const { toast } = useToast();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (service: string) => {
    setShowKeys(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const handleTestKey = async (service: keyof typeof apiKeys) => {
    setTesting(prev => ({ ...prev, [service]: true }));
    try {
      const isValid = await testApiKey(service);
      toast({
        title: isValid ? 'API Key Valid' : 'API Key Invalid',
        description: isValid 
          ? `${service} API key is working correctly`
          : `Failed to validate ${service} API key`,
        variant: isValid ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: 'Test Failed',
        description: `Error testing ${service} API key`,
        variant: 'destructive'
      });
    } finally {
      setTesting(prev => ({ ...prev, [service]: false }));
    }
  };

  const handleClearAll = () => {
    clearApiKeys();
    toast({
      title: 'API Keys Cleared',
      description: 'All API keys have been removed from local storage'
    });
  };

  const getStatusBadge = (service: keyof typeof apiKeys) => {
    const configured = isConfigured(service);
    return configured ? (
      <Badge className="bg-green-500">
        <CheckCircle className="h-3 w-3 mr-1" />
        Configured
      </Badge>
    ) : (
      <Badge variant="secondary">
        <XCircle className="h-3 w-3 mr-1" />
        Not Set
      </Badge>
    );
  };

  const services = [
    {
      key: 'openai' as const,
      name: 'OpenAI',
      icon: Brain,
      description: 'GPT models for chat, triage, and assistance',
      placeholder: 'sk-...',
      docs: 'https://platform.openai.com/api-keys'
    },
    {
      key: 'anthropic' as const,
      name: 'Anthropic Claude',
      icon: MessageSquare,
      description: 'Claude models for advanced reasoning',
      placeholder: 'sk-ant-...',
      docs: 'https://console.anthropic.com/'
    },
    {
      key: 'elevenLabs' as const,
      name: 'ElevenLabs',
      icon: Mic,
      description: 'Voice synthesis and transcription',
      placeholder: 'your-api-key',
      docs: 'https://elevenlabs.io/docs/api-reference/getting-started'
    },
    {
      key: 'perplexity' as const,
      name: 'Perplexity',
      icon: Search,
      description: 'Real-time web search and research',
      placeholder: 'pplx-...',
      docs: 'https://docs.perplexity.ai/docs/getting-started'
    },
    {
      key: 'gemini' as const,
      name: 'Google Gemini',
      icon: Sparkles,
      description: 'Google AI models',
      placeholder: 'AI...',
      docs: 'https://ai.google.dev/docs'
    },
    {
      key: 'azure' as const,
      name: 'Azure OpenAI',
      icon: Brain,
      description: 'Enterprise OpenAI models',
      placeholder: 'your-azure-key',
      docs: 'https://docs.microsoft.com/en-us/azure/cognitive-services/openai/'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>AI Service API Keys</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Configure your API keys to enable AI features. Keys are stored securely in your browser.
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {services.map((service) => (
          <Card key={service.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <service.icon className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                {getStatusBadge(service.key)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${service.key}-key`}>API Key</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      id={`${service.key}-key`}
                      type={showKeys[service.key] ? 'text' : 'password'}
                      placeholder={service.placeholder}
                      value={apiKeys[service.key]}
                      onChange={(e) => updateApiKey(service.key, e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => toggleKeyVisibility(service.key)}
                    >
                      {showKeys[service.key] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleTestKey(service.key)}
                    disabled={!isConfigured(service.key) || testing[service.key]}
                    variant="outline"
                  >
                    {testing[service.key] ? 'Testing...' : 'Test'}
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>
                  Get your API key from{' '}
                  <a 
                    href={service.docs} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {service.name} Dashboard
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-muted-foreground">
          API keys are stored locally in your browser and never sent to our servers.
        </div>
        <Button variant="destructive" onClick={handleClearAll}>
          Clear All Keys
        </Button>
      </div>
    </div>
  );
};

export default ApiKeyManager;