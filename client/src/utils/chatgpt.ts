import { storage } from './storage';

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatGPTParams {
  messages: ChatMessage[];
}

interface ChatGPTResponse {
  response: string;
}

export const sendToChatGPT = async (
  params: ChatGPTParams, 
  abortSignal?: AbortSignal
): Promise<string> => {
  const config = storage.getConfig();
  if (!config.openaiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.openaiKey,
    },
    body: JSON.stringify(params),
    signal: abortSignal, // Add the AbortSignal here
  });

  if (!response.ok) {
    throw new Error('Failed to communicate with ChatGPT');
  }

  const data = await response.json() as ChatGPTResponse;
  return data.response;
};