import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';
import AssistantAvatar from './AssistantAvatar';
import MessageBubble from './MessageBubble';
import SuggestionChips from './SuggestionChips';
import { useAssistant } from '@/hooks/useAssistant';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

interface Props {
  onClose: () => void;
}

export default function AssistantPanel({ onClose }: Props) {
  const [input, setInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, mood, sendMessage, isProcessing } = useAssistant();
  const { isListening, startListening, stopListening, transcript, isSupported: speechSupported } = useSpeechRecognition();
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis();

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    stopSpeaking();
    await sendMessage(msg);
  }, [input, stopSpeaking, sendMessage]);

  // Handle transcript
  useEffect(() => {
    if (transcript && !isListening) {
      handleSend(transcript);
    }
  }, [transcript, isListening, handleSend]);

  // Speak assistant response
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === 'assistant' && voiceEnabled && !isProcessing && !isSpeaking) {
      speak(lastMsg.content);
    }
  }, [messages, voiceEnabled, isProcessing, isSpeaking]);

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };

  return (
    <div className="assistant-panel animate-slide-up" style={{ maxHeight: '80vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-3">
          <AssistantAvatar mood={mood} size={40} />
          <div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>DevBot</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ask me anything'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setVoiceEnabled(!voiceEnabled)} 
            className="btn-icon p-2"
            title={voiceEnabled ? 'Mute' : 'Unmute'}
          >
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button onClick={onClose} className="btn-icon p-2"><X size={18} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '350px', minHeight: '200px' }}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <AssistantAvatar mood="happy" size={80} />
            <p className="mt-4 font-medium" style={{ color: 'var(--text-primary)' }}>Hi! I'm DevBot 👋</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              I can help you find tools and explain how to use them.
            </p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        
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

      {/* Suggestions */}
      {messages.length === 0 && (
        <SuggestionChips onSelect={handleSend} />
      )}

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-2">
          {speechSupported && (
            <button
              onClick={toggleVoice}
              className={`btn-icon p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : ''}`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type or speak..."
            className="flex-1 input-base py-2.5"
            disabled={isListening}
          />
          
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isProcessing}
            className="btn-primary p-3 rounded-full"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

