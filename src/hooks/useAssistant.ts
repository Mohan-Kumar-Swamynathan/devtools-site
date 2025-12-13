import { useState, useCallback } from 'react';
import { getResponse } from '@/lib/assistant/brain';
import { getToolBySlug, searchTools } from '@/lib/tools';

type Mood = 'idle' | 'thinking' | 'happy' | 'confused';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  tool?: any;
  tools?: any[];
}

interface UseAssistantReturn {
  messages: Message[];
  mood: Mood;
  sendMessage: (text: string) => Promise<void>;
  isProcessing: boolean;
  redirectToTool: (slug: string) => void;
}

export function useAssistant(): UseAssistantReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mood, setMood] = useState<Mood>('idle');
  const [isProcessing, setIsProcessing] = useState(false);

  const redirectToTool = useCallback((slug: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/${slug}`;
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setMood('thinking');
    setIsProcessing(true);

    // Quick tool search first
    const toolMatches = searchTools(text);
    if (toolMatches.length > 0) {
      // If exact match or single strong match, redirect immediately
      const exactMatch = toolMatches.find(t => 
        t.name.toLowerCase() === text.toLowerCase() ||
        t.slug === text.toLowerCase().replace(/\s+/g, '-')
      );
      
      if (exactMatch || (toolMatches.length === 1 && toolMatches[0])) {
        const tool = exactMatch || toolMatches[0];
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Found ${tool.icon} **${tool.name}**! Taking you there...`,
          tool
        }]);
        setMood('happy');
        setIsProcessing(false);
        
        // Redirect after short delay
        setTimeout(() => {
          redirectToTool(tool.slug);
        }, 800);
        return;
      }
      
      // Multiple matches - show options with all tools
      if (toolMatches.length > 1 && toolMatches.length <= 5) {
        const toolList = toolMatches.slice(0, 3);
        const toolNames = toolList.map(t => `${t.icon} ${t.name}`).join(', ');
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `I found ${toolMatches.length} matching tools: ${toolNames}. Click below to open one!`,
          tool: toolList[0], // Show first as primary
          tools: toolList // All tools for chips
        }]);
        setMood('happy');
        setIsProcessing(false);
        return;
      }
    }

    // Simulate processing delay for better UX
    await new Promise(r => setTimeout(r, 300 + Math.random() * 400));

    // Get response from brain
    const response = getResponse(text);
    
    // Check if response includes a tool match
    let toolMatch = null;
    if (response.toolSlug) {
      toolMatch = getToolBySlug(response.toolSlug);
    } else {
      // Try to find tool from response text
      const toolMatches = searchTools(text);
      if (toolMatches.length === 1) {
        toolMatch = toolMatches[0];
      }
    }
    
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: response.text,
      tool: toolMatch
    }]);
    setMood(response.mood || 'happy');
    setIsProcessing(false);

    // Auto-redirect if single tool match
    if (toolMatch && response.autoRedirect) {
      setTimeout(() => {
        redirectToTool(toolMatch.slug);
      }, 1500);
    }

    // Reset mood after delay
    setTimeout(() => setMood('idle'), 3000);
  }, [redirectToTool]);

  return { messages, mood, sendMessage, isProcessing, redirectToTool };
}
