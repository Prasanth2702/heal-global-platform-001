// AI Service wrapper that uses stored API keys
class AIService {
  private getApiKey(service: string): string {
    const stored = localStorage.getItem('healGlobal_apiKeys');
    if (!stored) throw new Error(`No API keys configured. Please set up your API keys first.`);
    
    const keys = JSON.parse(stored);
    const key = keys[service];
    if (!key) throw new Error(`${service} API key not configured.`);
    
    return key;
  }

  async openaiRequest(messages: any[], model = 'gpt-4o') {
    const apiKey = this.getApiKey('openai');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return response.json();
  }

  async anthropicRequest(messages: any[], model = 'claude-3-haiku-20240307') {
    const apiKey = this.getApiKey('anthropic');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1000,
        messages: messages.map(msg => ({ role: msg.role, content: msg.content }))
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    return response.json();
  }

  async perplexityRequest(message: string, model = 'llama-3.1-sonar-small-128k-online') {
    const apiKey = this.getApiKey('perplexity');
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'Be precise and concise in medical contexts.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1000,
        return_images: false,
        return_related_questions: false,
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    return response.json();
  }

  async elevenLabsTextToSpeech(text: string, voiceId = '9BWtsMINqrJLrRacOk9x') {
    const apiKey = this.getApiKey('elevenLabs');
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return response.blob();
  }

  async speechToText(audioBlob: Blob) {
    const apiKey = this.getApiKey('openai');
    
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Triage assistant
  async triageConsultation(symptoms: string[], patientInfo: any) {
    const systemPrompt = `You are a medical triage AI assistant. Analyze symptoms and provide:
1. Urgency level (Emergency, Urgent, Standard, Self-care)
2. Recommended specialist type
3. Suggested next steps
4. Red flags to watch for

Be professional and always recommend consulting healthcare providers for serious concerns.`;

    const userMessage = `Patient symptoms: ${symptoms.join(', ')}
Patient info: Age ${patientInfo.age}, Gender ${patientInfo.gender}
Additional context: ${patientInfo.context || 'None'}`;

    return this.openaiRequest([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ]);
  }

  // Doctor assistant for ICD-10, treatment suggestions
  async doctorAssistant(query: string, specialty: string) {
    const systemPrompt = `You are an AI assistant for healthcare professionals in ${specialty}. 
Provide evidence-based suggestions for:
- ICD-10 codes (when relevant)
- Diagnostic considerations
- Treatment protocols
- Latest research findings
- Investigation recommendations

Always emphasize clinical judgment and current medical guidelines.`;

    try {
      // Use Perplexity for latest research and real-time information
      return await this.perplexityRequest(`${query} in ${specialty} - include ICD-10 codes, latest treatment protocols, and recent research`);
    } catch (error) {
      // Fallback to OpenAI
      return this.openaiRequest([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ]);
    }
  }

  // Multi-language support
  async translateText(text: string, targetLanguage: string) {
    const systemPrompt = `Translate the following medical text to ${targetLanguage}. 
Maintain medical accuracy and use appropriate medical terminology.`;

    return this.openaiRequest([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text }
    ]);
  }
}

export const aiService = new AIService();