import { useState, useCallback, useEffect, useRef } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { Mic, MicOff, Square } from 'lucide-react';

export default function SpeechToText() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(prev => prev + finalTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return (
    <div className="space-y-6">
      {!isSupported && (
        <div className="alert-warning">
          Speech-to-Text is not supported in your browser. Please use Chrome, Edge, or Safari.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={!isSupported}
          className={`btn-primary flex items-center gap-2 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
        >
          {isListening ? (
            <>
              <Square size={18} />
              Stop Listening
            </>
          ) : (
            <>
              <Mic size={18} />
              Start Listening
            </>
          )}
        </button>
        <button
          onClick={() => setTranscript('')}
          disabled={isListening}
          className="btn-ghost"
        >
          Clear
        </button>
      </div>

      {isListening && (
        <div className="p-4 rounded-xl border alert-info flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span>Listening... Speak now</span>
        </div>
      )}

      {transcript && (
        <div>
          <label className="label">Transcript</label>
          <OutputPanel
            value={transcript}
            language="text"
          />
        </div>
      )}

      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          <strong>Tip:</strong> Click "Start Listening" and speak clearly. The transcript will appear in real-time. Click "Stop Listening" when done.
        </p>
      </div>
    </div>
  );
}

