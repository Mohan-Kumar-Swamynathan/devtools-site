import { useState, useCallback } from 'react';
import { getRuleBasedResponse } from '@/lib/assistant/ruleBasedBrain';
import { generateResponse, isModelReady, getToolsListForPrompt } from '@/lib/assistant/browserLLM';
import { getToolBySlug, searchTools } from '@/lib/tools';

type Mood = 'idle' | 'thinking' | 'happy' | 'confused' | 'listening' | 'speaking';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  tool?: any;
  tools?: any[];
}

interface UseAssistantReturn {
  messages: Message[];
  mood: Mood;
  sendMessage: (text: string, useLLM?: boolean) => Promise<void>;
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

  const sendMessage = useCallback(async (text: string, useLLM: boolean = false) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setMood('thinking');
    setIsProcessing(true);

    try {
      // If smart mode is enabled and model is ready, try LLM first for better responses
      if (useLLM && isModelReady()) {
        try {
          const toolsList = getToolsListForPrompt(30);
          const llmResponse = await generateResponse(text, toolsList);
          
          // Check if LLM response mentions a tool
          const toolMatches = searchTools(llmResponse);
          const toolMatch = toolMatches.length > 0 ? toolMatches[0] : null;
          
          // Also check rule-based for tool slug if LLM didn't find one
          const ruleResponse = getRuleBasedResponse(text);
          const finalToolMatch = toolMatch || (ruleResponse.toolSlug ? getToolBySlug(ruleResponse.toolSlug) : null);
          
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: llmResponse,
            tool: finalToolMatch
          }]);
          setMood('happy');
          setIsProcessing(false);
          
          // Reset mood after delay
          setTimeout(() => setMood('idle'), 3000);
          return;
        } catch (error) {
          console.error('LLM error, falling back to rule-based:', error);
          // Fall through to rule-based
        }
      }
      
      // Rule-based response (default or fallback)
      const ruleResponse = getRuleBasedResponse(text);
      const toolMatch = ruleResponse.toolSlug ? getToolBySlug(ruleResponse.toolSlug) : null;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: ruleResponse.text,
        tool: toolMatch,
        tools: toolMatch ? [toolMatch] : undefined
      }]);
      setMood(ruleResponse.mood || 'happy');
      setIsProcessing(false);
      
      // Auto-redirect if single tool match
      if (toolMatch && ruleResponse.autoRedirect) {
        setTimeout(() => {
          redirectToTool(toolMatch.slug);
        }, 1500);
      }

      // Reset mood after delay
      setTimeout(() => setMood('idle'), 3000);

      setIsProcessing(false);

      // Reset mood after delay
      setTimeout(() => setMood('idle'), 3000);
    } catch (error) {
      console.error('Error processing message:', error);
    setMessages(prev => [...prev, { 
      role: 'assistant', 
        content: "Sorry, I encountered an error. Please try again."
    }]);
      setMood('confused');
    setIsProcessing(false);
      setTimeout(() => setMood('idle'), 3000);
    }
  }, [redirectToTool]);

  return { messages, mood, sendMessage, isProcessing, redirectToTool };
}
