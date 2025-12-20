import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Search, ArrowRight, Mic, MicOff, Sparkles, Loader, AlertCircle } from 'lucide-react';
import AssistantAvatar from './AssistantAvatar';
import MessageBubble from './MessageBubble';
import SuggestionChips from './SuggestionChips';
import { useAssistant } from '@/hooks/useAssistant';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { searchTools } from '@/lib/tools';
import { initModel, isModelReady, isModelLoading, getLoadError } from '@/lib/assistant/browserLLM';

interface Props {
  onClose: () => void;
}

export default function AssistantPanel({ onClose }: Props) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [smartMode, setSmartMode] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastSpokenIndexRef = useRef<number>(-1);
  
  const { messages, mood, sendMessage, isProcessing, redirectToTool } = useAssistant();
  const { isListening, transcript, startListening, stopListening, isSupported: speechRecognitionSupported } = useSpeechRecognition();
  const { speak, stop, isSpeaking, isSupported: speechSynthesisSupported } = useSpeechSynthesis();

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle voice transcript with enhanced parsing
  useEffect(() => {
    if (transcript && !isProcessing && !isListening) {
      // Clean up the transcript (remove extra spaces, normalize)
      const cleanedTranscript = transcript.trim().replace(/\s+/g, ' ');
      setInput(cleanedTranscript);
      
      // Use a small delay to ensure state is updated and allow for natural speech pauses
      setTimeout(() => {
        handleSend(cleanedTranscript);
      }, 150);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, isProcessing, isListening]);

  // Initialize model when smart mode is enabled
  useEffect(() => {
    if (smartMode && !isModelReady() && !isModelLoading() && !isLoadingModel) {
      setIsLoadingModel(true);
      initModel((progress) => {
        setModelProgress(progress);
      })
        .then(() => {
          setIsLoadingModel(false);
          setModelProgress(100);
        })
        .catch((error) => {
          console.error('Failed to load model:', error);
          setIsLoadingModel(false);
          setModelProgress(0);
          setSmartMode(false);
          
          const errorMessage = error?.message || 'Unknown error';
          if (errorMessage.includes('CSP') || errorMessage.includes('Content Security Policy')) {
            setModelError('Content Security Policy is blocking model download. Smart mode requires network access.');
          } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network')) {
            setModelError('Network error. Please check your internet connection and try again.');
          } else {
            setModelError('Failed to load AI model. Rule-based mode is still available.');
          }
          
          // Clear error after 10 seconds
          setTimeout(() => setModelError(null), 10000);
        });
    }
  }, [smartMode]);

  // Speak assistant messages (only once per message)
  useEffect(() => {
    if (messages.length > 0 && speechSynthesisSupported && !isSpeaking) {
      const lastMessage = messages[messages.length - 1];
      const messageIndex = messages.length - 1;
      
      // Only speak if this is a new assistant message that hasn't been spoken yet
      if (lastMessage.role === 'assistant' && messageIndex > lastSpokenIndexRef.current) {
        // Extract text from markdown (simple extraction)
        const text = lastMessage.content.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\n/g, ' ').trim();
        // Only speak if message is not too long and not empty
        if (text.length > 0 && text.length < 200) {
          lastSpokenIndexRef.current = messageIndex;
          // Note: We don't set mood here as it's managed by useAssistant hook
          speak(text);
        }
      }
    }
  }, [messages, speechSynthesisSupported, isSpeaking, speak]);

  // Real-time tool search as user types
  useEffect(() => {
    if (input.trim().length > 2) {
      const matches = searchTools(input.trim()).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const handleSend = useCallback(async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    
    // Normalize the message for better command recognition
    const normalizedMsg = msg
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    
    setInput('');
    setSuggestions([]);
    stop(); // Stop any ongoing speech
    
    // Check if we're on a tool page
    const isToolPage = typeof window !== 'undefined' && 
      window.location.pathname !== '/' && 
      window.location.pathname !== '/index.html' && 
      window.location.pathname.length > 1;
    
    // Detect tool commands (works for both voice and text input)
    const isToolCommand = /^(set|fill|put|enter|calculate|compute|what'?s|show|tell|read|explore|clear|reset)/i.test(normalizedMsg);
    
    // If on tool page and it's a tool command, always use rule-based for immediate action
    // This ensures both voice and text input fill tool inputs
    const useLLM = smartMode && isModelReady() && !isToolCommand && !isToolPage;
    
    // sendMessage will handle tool interactions automatically via ruleBasedBrain
    await sendMessage(msg, useLLM);
  }, [input, sendMessage, smartMode, stop]);

  const handleToolClick = useCallback((tool: any) => {
    redirectToTool(tool.slug);
  }, [redirectToTool]);

  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return (
    <div className="assistant-panel animate-slide-up rounded-3xl elevation-8" style={{ maxHeight: '80vh', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-3">
          <AssistantAvatar mood={mood} size={40} />
          <div>
            <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>DevBot</h3>
              {smartMode && isModelReady() && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>
                  <Sparkles size={12} />
                  Smart
                </span>
              )}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {isProcessing ? 'Searching...' : isLoadingModel ? 'Loading smart mode...' : 'Find tools & navigate'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Smart Mode Toggle */}
          <button
            onClick={() => setSmartMode(!smartMode)}
            disabled={isLoadingModel}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${
              smartMode && isModelReady() ? 'opacity-100' : 'opacity-60'
            }`}
            style={{
              borderColor: smartMode && isModelReady() ? 'var(--brand-primary)' : 'var(--border-primary)',
              backgroundColor: smartMode && isModelReady() ? 'var(--bg-primary)' : 'var(--bg-secondary)',
              color: smartMode && isModelReady() ? 'var(--brand-primary)' : 'var(--text-muted)'
            }}
            title={smartMode && isModelReady() ? 'Smart mode enabled' : 'Enable smart mode (loads AI model)'}
          >
            {isLoadingModel ? (
              <>
                <Loader size={12} className="animate-spin" />
                <span>{modelProgress}%</span>
              </>
            ) : (
              <>
                <Sparkles size={12} />
                <span>Smart</span>
              </>
            )}
          </button>
        <button onClick={onClose} className="btn-icon p-2"><X size={18} /></button>
        </div>
      </div>

      {/* Model Error Display */}
      {modelError && (
        <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--status-error)', backgroundColor: 'var(--status-error-bg)' }}>
          <div className="flex items-start gap-2">
            <AlertCircle size={16} style={{ color: 'var(--status-error)' }} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium" style={{ color: 'var(--status-error)' }}>
                {modelError}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                You can still use rule-based mode for tool suggestions.
              </p>
            </div>
            <button onClick={() => setModelError(null)} className="btn-icon p-1">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Model Loading Progress */}
      {isLoadingModel && (
        <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Loader size={14} className="animate-spin" style={{ color: 'var(--brand-primary)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              Loading AI model... ({modelProgress}%)
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{
                width: `${modelProgress}%`,
                backgroundColor: 'var(--brand-primary)'
              }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            First time? This may take a minute. Model will be cached for future visits.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar" style={{ maxHeight: '350px', minHeight: '200px' }}>
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-6">
              <AssistantAvatar mood="happy" size={80} />
            </div>
            <p className="mt-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Hi! I'm DevBot 👋</p>
            <p className="text-sm mt-2 px-4" style={{ color: 'var(--text-muted)' }}>
              Search for tools, ask me to navigate, or use voice commands to interact with tools!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
              <button
                onClick={() => handleSend('explore this tool')}
                className="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ripple"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                Explore Tool
              </button>
              <button
                onClick={() => handleSend('show popular tools')}
                className="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ripple"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                Popular Tools
              </button>
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => {
          // If message has multiple tools, show all as clickable chips
          const allTools = (msg as any).tools || (msg.tool ? [msg.tool] : []);
          
          return (
            <div key={i}>
              <MessageBubble 
                role={msg.role} 
                content={msg.content}
                tool={msg.tool}
                onToolClick={msg.tool ? () => handleToolClick(msg.tool) : undefined}
              />
              {allTools.length > 1 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {allTools.map((tool: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleToolClick(tool)}
                      className="px-3 py-1.5 text-xs rounded-lg border transition-all hover:scale-105 flex items-center gap-1.5"
                      style={{
                        borderColor: 'var(--brand-primary)',
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--brand-primary)'
                      }}
                    >
                      <span>{tool.icon}</span>
                      <span>{tool.name}</span>
                      <ArrowRight size={12} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {isProcessing && (
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Tool Suggestions (while typing) */}
      {suggestions.length > 0 && input.trim().length > 2 && (
        <div className="px-4 pb-2 border-t" style={{ borderColor: 'var(--border-primary)' }}>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Quick Access:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="px-3 py-1.5 text-xs rounded-lg border transition-all hover:scale-105 flex items-center gap-1.5"
                style={{ 
                  borderColor: 'var(--border-primary)', 
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)'
                }}
              >
                <span>{tool.icon}</span>
                <span>{tool.name}</span>
                <ArrowRight size={12} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {messages.length === 0 && suggestions.length === 0 && (
        <SuggestionChips onSelect={handleSend} />
      )}

      {/* Input */}
      <div className="p-5 border-t" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10" style={{ color: 'var(--text-primary)' }} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isProcessing && !isListening) {
                  if (suggestions.length === 1) {
                    handleToolClick(suggestions[0]);
                  } else {
                    handleSend();
                  }
                }
              }}
              placeholder={isListening ? "Listening..." : "Search tools or ask a question..."}
              className="flex-1 input-base py-3 pl-10 pr-4 rounded-2xl"
              style={{ 
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-primary)'
              }}
              disabled={isListening}
            />
          </div>
          
          {/* Voice Input Button */}
          {speechRecognitionSupported && (
            <button
              onClick={toggleVoiceInput}
              disabled={isProcessing}
              className={`p-3 rounded-xl transition-all ripple touch-target ${
                isListening 
                  ? 'animate-pulse' 
                  : ''
              }`}
              style={{
                backgroundColor: isListening ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                color: isListening ? 'white' : 'var(--text-primary)',
                border: `1px solid ${isListening ? 'var(--brand-primary)' : 'var(--border-primary)'}`
              }}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
          
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isProcessing || isListening}
            className="btn-primary p-3 rounded-xl ripple touch-target"
            style={{
              backgroundColor: (!input.trim() || isProcessing || isListening) ? 'var(--bg-tertiary)' : 'var(--brand-primary)',
              opacity: (!input.trim() || isProcessing || isListening) ? 0.5 : 1
            }}
          >
            <Send size={18} />
          </button>
        </div>
        {input.trim().length > 0 && suggestions.length === 0 && !isListening && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Press Enter to search, or type more to see suggestions
          </p>
        )}
        {isListening && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '300ms' }} />
            </div>
            <p className="text-xs" style={{ color: 'var(--brand-primary)' }}>
              Listening... Speak now
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
