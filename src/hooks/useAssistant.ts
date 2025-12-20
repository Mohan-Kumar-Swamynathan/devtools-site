import { useState, useCallback, useEffect } from 'react';
import { getRuleBasedResponse } from '@/lib/assistant/ruleBasedBrain';
import { generateResponse, isModelReady, getToolsListForPrompt } from '@/lib/assistant/browserLLM';
import { getToolBySlug, searchTools } from '@/lib/tools';
import { getToolContext, type ToolContext } from '@/lib/assistant/context';
import { fillInput, triggerCalculation, readResults } from '@/lib/assistant/toolActions';
import { matchIntent } from '@/lib/assistant/intents';

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
  context: ToolContext | null;
}

export function useAssistant(): UseAssistantReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mood, setMood] = useState<Mood>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [context, setContext] = useState<ToolContext | null>(null);
  
  // Update context when component mounts or URL changes
  useEffect(() => {
    const updateContext = () => {
      if (typeof window !== 'undefined') {
        setContext(getToolContext());
      }
    };
    
    updateContext();
    
    // Update context on navigation
    window.addEventListener('popstate', updateContext);
    const interval = setInterval(updateContext, 2000); // Check every 2 seconds
    
    return () => {
      window.removeEventListener('popstate', updateContext);
      clearInterval(interval);
    };
  }, []);

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
          
        // Update context before responding
        const currentContext = getToolContext();
        setContext(currentContext);
        
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

      // Update context before processing
      const currentContext = getToolContext();
      setContext(currentContext);
      
      // Check if this is a tool interaction that needs action
      const intent = matchIntent(text);
      let actionPerformed = false;
      
      // Handle fill_input intent directly
      if (intent.type === 'fill_input' && currentContext && currentContext.pageType === 'tool') {
        if (intent.field && intent.value) {
          const fillResult = fillInput(intent.field, intent.value);
          actionPerformed = true;
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: fillResult.success 
              ? `✅ ${fillResult.message || `Set ${intent.field} to ${intent.value}`}`
              : `❌ ${fillResult.message || 'Could not fill input'}`,
            tool: currentContext.tool
          }]);
          setMood(fillResult.success ? 'happy' : 'confused');
          setIsProcessing(false);
          setTimeout(() => setMood('idle'), 3000);
          return;
        }
      }
      
      // Rule-based response (default or fallback)
      const ruleResponse = getRuleBasedResponse(text);
      const toolMatch = ruleResponse.toolSlug ? getToolBySlug(ruleResponse.toolSlug) : null;
    
      // If response has an action, perform it
      if (ruleResponse.action && !actionPerformed) {
        if (ruleResponse.action === 'calculate' && currentContext && currentContext.pageType === 'tool') {
          triggerCalculation();
          // Wait a bit then read results
          setTimeout(() => {
            const readResult = readResults();
            if (readResult.success) {
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg.role === 'assistant') {
                  lastMsg.content = `${lastMsg.content}\n\n📊 ${readResult.message}`;
                }
                return newMessages;
              });
            }
          }, 500);
        }
      }
    
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

  return { messages, mood, sendMessage, isProcessing, redirectToTool, context };
}
