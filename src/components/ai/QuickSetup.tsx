import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApiKeys } from '@/contexts/ApiKeyContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Key, 
  ArrowRight,
  CheckCircle,
  Brain,
  Mic,
  MessageSquare,
  Search
} from 'lucide-react';

const QuickSetup = () => {
  const { apiKeys, updateApiKey, isConfigured } = useApiKeys();
  const { toast } = useToast();
  const [quickKeys, setQuickKeys] = useState({
    openai: '',
    elevenLabs: ''
  });

  const handleQuickSetup = () => {
    if (quickKeys.openai) updateApiKey('openai', quickKeys.openai);
    if (quickKeys.elevenLabs) updateApiKey('elevenLabs', quickKeys.elevenLabs);

    toast({
      title: 'Quick Setup Complete!',
      description: 'Your API keys have been saved. You can now use AI features.',
    });
  };

  const allConfigured = isConfigured('openai') && isConfigured('elevenLabs');

  if (allConfigured) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span>AI Features Ready!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 mb-4">
            Your API keys are configured. All AI features are now available.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Brain className="h-4 w-4" />
              <span>AI Triage</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <MessageSquare className="h-4 w-4" />
              <span>AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Mic className="h-4 w-4" />
              <span>Voice Features</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Search className="h-4 w-4" />
              <span>Real-time Search</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-800">
          <Zap className="h-5 w-5" />
          <span>Quick AI Setup</span>
        </CardTitle>
        <p className="text-blue-700">
          Get started in 2 minutes with just OpenAI and ElevenLabs
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quick-openai" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>OpenAI API Key</span>
            </Label>
            <Input
              id="quick-openai"
              type="password"
              placeholder="sk-..."
              value={quickKeys.openai}
              onChange={(e) => setQuickKeys(prev => ({ ...prev, openai: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              For AI triage, doctor assistant, and transcription
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quick-elevenlabs" className="flex items-center space-x-2">
              <Mic className="h-4 w-4" />
              <span>ElevenLabs API Key</span>
            </Label>
            <Input
              id="quick-elevenlabs"
              type="password"
              placeholder="your-api-key"
              value={quickKeys.elevenLabs}
              onChange={(e) => setQuickKeys(prev => ({ ...prev, elevenLabs: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              For text-to-speech and voice features
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex space-x-2">
            <Button 
              onClick={handleQuickSetup}
              disabled={!quickKeys.openai || !quickKeys.elevenLabs}
              className="flex items-center space-x-2"
            >
              <Key className="h-4 w-4" />
              <span>Save & Enable AI</span>
            </Button>
          </div>
          
          <Link to="/api-setup">
            <Button variant="outline" className="flex items-center space-x-2">
              <span>Advanced Setup</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p><strong>Where to get API keys:</strong></p>
          <p>• OpenAI: <a href="https://platform.openai.com/api-keys" target="_blank" className="text-blue-600 hover:underline">platform.openai.com/api-keys</a></p>
          <p>• ElevenLabs: <a href="https://elevenlabs.io/docs/api-reference/getting-started" target="_blank" className="text-blue-600 hover:underline">elevenlabs.io dashboard</a></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickSetup;