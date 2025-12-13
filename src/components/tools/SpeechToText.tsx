import { useState, useCallback, useEffect, useRef } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Mic, Square, Copy, Download, Globe } from 'lucide-react';

export default function SpeechToText() {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en-US');
  const recognitionRef = useRef<any>(null);
  
  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'es-MX', name: 'Spanish (Mexico)' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'ru-RU', name: 'Russian' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        initializeRecognition();
      } else {
        setIsSupported(false);
        setError('Speech-to-Text is not supported in your browser. Please use Chrome, Edge, or Safari.');
      }
    }
  }, []);

  const initializeRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;

    recognitionRef.current.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += result + ' ';
        } else {
          interim += result;
        }
      }

      setInterimTranscript(interim);
      if (final) {
        setTranscript(prev => prev + final);
        setInterimTranscript('');
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = 'Speech recognition error occurred.';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not found. Please check your microphone settings.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }
      
      setError(errorMessage);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  }, [language]);

  useEffect(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.lang = language;
    }
  }, [language, isListening]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (!recognitionRef.current) {
      initializeRecognition();
    }

    if (recognitionRef.current && !isListening) {
      setError('');
      setTranscript('');
      setInterimTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e: any) {
        if (e.message?.includes('already started')) {
          // Already listening, ignore
        } else {
          setError('Failed to start listening. Please try again.');
        }
      }
    }
  }, [isListening, isSupported, initializeRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore stop errors
      }
      setIsListening(false);
      setInterimTranscript('');
    }
  }, [isListening]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
    } catch (e) {
      setError('Failed to copy transcript to clipboard.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speech-transcript.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} type={isSupported ? 'error' : 'warning'} />}
      
      {!isSupported && (
        <ErrorMessage 
          message="Speech-to-Text is not supported in your browser. Please use Chrome, Edge, or Safari." 
          type="warning"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label flex items-center gap-2">
            <Globe size={16} />
            Language
          </label>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              if (isListening) {
                stopListening();
                setTimeout(() => startListening(), 100);
              }
            }}
            className="input-base"
            disabled={isListening || !isSupported}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <div className="flex flex-wrap items-center gap-3 w-full">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={!isSupported}
              className={`btn-primary flex items-center gap-2 flex-1 transition-all duration-200 ${
                isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''
              }`}
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
          </div>
        </div>
      </div>

      {isListening && (
        <div className="p-4 rounded-xl border animate-fade-in" style={{ 
          backgroundColor: 'var(--status-info-bg)', 
          borderColor: 'var(--status-info)' 
        }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Mic size={24} style={{ color: 'var(--status-info)' }} className="animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Listening... Speak clearly
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Language: {languages.find(l => l.code === language)?.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {(transcript || interimTranscript) && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label">Transcript</label>
            <div className="flex items-center gap-2">
              {transcript && (
                <>
                  <button onClick={handleCopy} className="btn-icon p-1.5" title="Copy transcript">
                    <Copy size={16} />
                  </button>
                  <button onClick={handleDownload} className="btn-icon p-1.5" title="Download transcript">
                    <Download size={16} />
                  </button>
                </>
              )}
              <button
                onClick={() => { setTranscript(''); setInterimTranscript(''); }}
                disabled={isListening}
                className="btn-ghost btn-sm"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {transcript && (
              <OutputPanel
                value={transcript}
                language="text"
                showLineNumbers={false}
              />
            )}
            {interimTranscript && (
              <div className="p-4 rounded-xl border animate-fade-in" style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                borderStyle: 'dashed'
              }}>
                <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
                  {interimTranscript}
                </p>
              </div>
            )}
          </div>
          
          {transcript && (
            <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              {wordCount} words • {transcript.length} characters
            </div>
          )}
        </div>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-primary)' 
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Tips for Best Results:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Use a quiet environment to reduce background noise</li>
          <li>• Ensure your microphone is working and permissions are granted</li>
          <li>• Select the correct language for better accuracy</li>
          <li>• Pause briefly between sentences for better recognition</li>
        </ul>
      </div>
    </div>
  );
}

