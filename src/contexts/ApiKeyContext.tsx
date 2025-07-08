import React, { createContext, useContext, useState, useEffect } from 'react';

interface ApiKeys {
  openai: string;
  anthropic: string;
  elevenLabs: string;
  azure: string;
  perplexity: string;
  gemini: string;
}

interface ApiKeyContextType {
  apiKeys: ApiKeys;
  updateApiKey: (service: keyof ApiKeys, key: string) => void;
  clearApiKeys: () => void;
  isConfigured: (service: keyof ApiKeys) => boolean;
  testApiKey: (service: keyof ApiKeys) => Promise<boolean>;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const DEFAULT_KEYS: ApiKeys = {
  openai: '',
  anthropic: '',
  elevenLabs: '',
  azure: '',
  perplexity: '',
  gemini: ''
};

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_KEYS);

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem('healGlobal_apiKeys');
    if (stored) {
      try {
        setApiKeys(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored API keys:', error);
      }
    }
  }, []);

  const updateApiKey = (service: keyof ApiKeys, key: string) => {
    const newKeys = { ...apiKeys, [service]: key };
    setApiKeys(newKeys);
    localStorage.setItem('healGlobal_apiKeys', JSON.stringify(newKeys));
  };

  const clearApiKeys = () => {
    setApiKeys(DEFAULT_KEYS);
    localStorage.removeItem('healGlobal_apiKeys');
  };

  const isConfigured = (service: keyof ApiKeys) => {
    return apiKeys[service].trim() !== '';
  };

  const testApiKey = async (service: keyof ApiKeys): Promise<boolean> => {
    const key = apiKeys[service];
    if (!key) return false;

    try {
      switch (service) {
        case 'openai':
          const openaiResponse = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${key}` }
          });
          return openaiResponse.ok;

        case 'anthropic':
          const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': key,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-3-haiku-20240307',
              max_tokens: 10,
              messages: [{ role: 'user', content: 'test' }]
            })
          });
          return anthropicResponse.ok;

        case 'elevenLabs':
          const elevenResponse = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: { 'xi-api-key': key }
          });
          return elevenResponse.ok;

        case 'perplexity':
          const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'llama-3.1-sonar-small-128k-online',
              messages: [{ role: 'user', content: 'test' }],
              max_tokens: 10
            })
          });
          return perplexityResponse.ok;

        default:
          return false;
      }
    } catch (error) {
      console.error(`Error testing ${service} API key:`, error);
      return false;
    }
  };

  return (
    <ApiKeyContext.Provider value={{
      apiKeys,
      updateApiKey,
      clearApiKeys,
      isConfigured,
      testApiKey
    }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKeys = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKeys must be used within an ApiKeyProvider');
  }
  return context;
};