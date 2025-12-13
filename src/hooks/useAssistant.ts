import { useState, useCallback } from 'react';
import { getResponse } from '@/lib/assistant/brain';

type Mood = 'idle' | 'listening' | 'thinking' | 'speaking' | 'happy' | 'confused';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UseAssistantReturn {
  messages: Message[];
  mood: Mood;
  sendMessage: (text: string) => Promise<void>;
  isProcessing: boolean;
}

export function useAssistant(): UseAssistantReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mood, setMood] = useState<Mood>('idle');
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setMood('thinking');
    setIsProcessing(true);

    // Simulate processing delay for better UX
    await new Promise(r => setTimeout(r, 500 + Math.random() * 500));

    // Get response from brain
    const response = getResponse(text);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    setMood(response.mood || 'happy');
    setIsProcessing(false);

    // Reset mood after speaking
    setTimeout(() => setMood('idle'), 3000);
  }, []);

  return { messages, mood, sendMessage, isProcessing };
}

