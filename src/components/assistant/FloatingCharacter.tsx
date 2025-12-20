import { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff } from 'lucide-react';
import AssistantAvatar from './AssistantAvatar';
import { useAssistant } from '@/hooks/useAssistant';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

interface Props {
  onOpenPanel?: () => void;
}

export default function FloatingCharacter({ onOpenPanel }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  const { messages, mood, sendMessage, isProcessing } = useAssistant();
  const { isListening, transcript, startListening, stopListening, isSupported: speechRecognitionSupported } = useSpeechRecognition();
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);

  // Handle voice transcript - process when listening stops
  useEffect(() => {
    if (transcript && !isProcessing && !isListening && transcript.trim().length > 0) {
      // Process the transcript - this will fill inputs if it's a tool command
      const cleanedTranscript = transcript.trim();
      if (cleanedTranscript.length > 0) {
        // Small delay to ensure UI updates
        const timer = setTimeout(() => {
          sendMessage(cleanedTranscript, false); // Use rule-based for tool commands
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [transcript, isProcessing, isListening, sendMessage]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    // Don't automatically open the full panel - let user choose
  };

  const handleVoiceToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent triggering expand
    if (isListening) {
      stopListening();
    } else {
      // Expand panel when starting to listen for better UX
      if (!isExpanded) {
        setIsExpanded(true);
      }
      // Small delay to ensure panel is expanded before starting
      setTimeout(() => {
        startListening();
      }, 100);
    }
  };

  const handleQuickMessage = (message: string) => {
    sendMessage(message, false);
  };

  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const isAssistantMessage = lastMessage?.role === 'assistant';

  return (
    <>
      {/* Floating Character Button */}
      <div
        className="fixed bottom-24 right-6 z-50"
        style={{ 
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isExpanded ? 'scale(0.95)' : 'scale(1)'
        }}
      >
        <button
          onClick={handleToggleExpand}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-16 h-16 rounded-full flex items-center justify-center ripple touch-target transition-material"
          style={{
            backgroundColor: 'var(--brand-primary)',
            boxShadow: isHovered || isExpanded ? 'var(--elevation-8)' : 'var(--elevation-4)',
            transform: isHovered && !isExpanded ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform var(--duration-standard) var(--ease-standard), box-shadow var(--duration-standard) var(--ease-standard)'
          }}
          aria-label="Voice assistant"
          title="Voice assistant - Click to expand"
        >
          <AssistantAvatar mood={isListening ? 'listening' : isSpeaking ? 'speaking' : mood} size={48} />
          {(isListening || isSpeaking) && (
            <div className="absolute inset-0 rounded-full animate-ping" style={{ 
              backgroundColor: 'var(--brand-primary)',
              opacity: 0.3
            }} />
          )}
        </button>
      </div>

      {/* Expanded Mini Panel */}
      {isExpanded && (
        <div
          ref={panelRef}
          className="fixed bottom-32 right-6 z-50 w-80 rounded-3xl transition-material elevation-8 animate-slide-up"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center gap-3">
              <AssistantAvatar mood={isListening ? 'listening' : isSpeaking ? 'speaking' : mood} size={40} />
              <div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>DevBot</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {isProcessing ? 'Thinking...' : isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'How can I help?'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors touch-target"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            {lastMessage && isAssistantMessage && (
              <div className="p-3 rounded-xl text-sm elevation-1" style={{ 
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)'
              }}>
                {lastMessage.content.substring(0, 120)}
                {lastMessage.content.length > 120 && '...'}
              </div>
            )}
            
            {isListening && (
              <div className="p-4 rounded-xl elevation-1 text-center" style={{ 
                backgroundColor: 'var(--brand-primary-light)',
                border: '1px solid var(--brand-primary)'
              }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse" />
                  <p className="text-sm font-medium" style={{ color: 'var(--brand-primary)' }}>
                    Listening...
                  </p>
                </div>
                {transcript && (
                  <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                    "{transcript}"
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              {speechRecognitionSupported && (
                <button
                  onClick={(e) => handleVoiceToggle(e)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ripple"
                  style={{
                    backgroundColor: isListening ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                    color: isListening ? 'white' : 'var(--text-primary)',
                    border: `1px solid ${isListening ? 'var(--brand-primary)' : 'var(--border-primary)'}`,
                  }}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  {isListening ? 'Stop' : 'Voice'}
                </button>
              )}
              <button
                onClick={() => handleQuickMessage('explore this tool')}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ripple"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                Explore
              </button>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
                // Small delay to close mini panel before opening full panel
                setTimeout(() => {
                  if (onOpenPanel) onOpenPanel();
                }, 200);
              }}
              className="w-full px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ripple elevation-1 hover:elevation-2"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'white',
              }}
            >
              Open Chat Panel
            </button>
          </div>
        </div>
      )}

    </>
  );
}

