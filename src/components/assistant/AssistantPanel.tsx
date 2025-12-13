import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Search, ArrowRight } from 'lucide-react';
import AssistantAvatar from './AssistantAvatar';
import MessageBubble from './MessageBubble';
import SuggestionChips from './SuggestionChips';
import { useAssistant } from '@/hooks/useAssistant';
import { searchTools } from '@/lib/tools';

interface Props {
  onClose: () => void;
}

export default function AssistantPanel({ onClose }: Props) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, mood, sendMessage, isProcessing, redirectToTool } = useAssistant();

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    setInput('');
    setSuggestions([]);
    await sendMessage(msg);
  }, [input, sendMessage]);

  const handleToolClick = useCallback((tool: any) => {
    redirectToTool(tool.slug);
  }, [redirectToTool]);

  return (
    <div className="assistant-panel animate-slide-up" style={{ maxHeight: '80vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-3">
          <AssistantAvatar mood={mood} size={40} />
          <div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>DevBot</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {isProcessing ? 'Searching...' : 'Find tools & navigate'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="btn-icon p-2"><X size={18} /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '350px', minHeight: '200px' }}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <AssistantAvatar mood="happy" size={80} />
            <p className="mt-4 font-medium" style={{ color: 'var(--text-primary)' }}>Hi! I'm DevBot 👋</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Search for tools or ask me to navigate. I'll help you find what you need!
            </p>
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
      <div className="p-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isProcessing) {
                  if (suggestions.length === 1) {
                    handleToolClick(suggestions[0]);
                  } else {
                    handleSend();
                  }
                }
              }}
              placeholder="Search tools or ask a question..."
              className="flex-1 input-base py-2.5 pl-10"
            />
          </div>
          
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isProcessing}
            className="btn-primary p-3 rounded-full"
          >
            <Send size={18} />
          </button>
        </div>
        {input.trim().length > 0 && suggestions.length === 0 && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Press Enter to search, or type more to see suggestions
          </p>
        )}
      </div>
    </div>
  );
}
