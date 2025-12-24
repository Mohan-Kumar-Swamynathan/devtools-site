import { useState, useCallback, useRef, useEffect } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import { Play, Square, Volume2, Download, Copy } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function TextToSpeech() {
  const [input, setInput] = useState('Hello! This is a text to speech converter. You can adjust the voice, rate, pitch, and volume.');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          if (!voice) {
            // Prefer natural-sounding voices
            const preferred = availableVoices.find(v => 
              v.name.includes('Google') || 
              v.name.includes('Natural') ||
              v.name.includes('Samantha') ||
              (v.lang.startsWith('en') && !v.localService)
            ) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
            setVoice(preferred);
          }
        }
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      setIsSupported(false);
      setError('Text-to-Speech is not supported in your browser. Please use Chrome, Edge, Safari, or Firefox.');
    }
  }, [voice]);

  const speak = useCallback(() => {
    if (!input.trim() || !synthRef.current) {
      setError('Please enter some text to speak.');
      return;
    }

    setError('');
    setIsLoading(true);
    synthRef.current.cancel(); // Stop any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(input);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsLoading(false);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsLoading(false);
    };
    
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      setIsLoading(false);
      setError(`Speech error: ${event.error}. Please try again.`);
    };
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [input, voice, rate, pitch, volume]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(input);
    } catch (e) {
      setError('Failed to copy text to clipboard.');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-to-speech.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const charCount = input.length;

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={isSpeaking ? stop : speak}
          disabled={!input.trim() || !isSupported || isLoading}
          className={`btn-primary flex items-center gap-2 transition-all duration-200 ${
            isSpeaking ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''
          }`}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Preparing...
            </>
          ) : isSpeaking ? (
            <>
              <Square size={18} />
              Stop Speaking
            </>
          ) : (
            <>
              <Play size={18} />
              Speak Text
            </>
          )}
        </button>
        <button 
          onClick={() => { setInput(''); stop(); setError(''); }} 
          className="btn-ghost"
          disabled={isSpeaking}
        >
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      
      {!isSupported && (
        <ErrorMessage 
          message="Text-to-Speech is not supported in your browser. Please use Chrome, Edge, Safari, or Firefox." 
          type="warning"
        />
      )}

      <div>
        <CodeEditor
          value={input}
          onChange={setInput}
          language="text"
          label="Text to Speak"
          placeholder="Enter text you want to convert to speech..."
        />
        <div className="flex items-center justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{wordCount} words • {charCount} characters</span>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-icon p-1" title="Copy text">
              <Copy size={14} />
            </button>
            <button onClick={handleDownload} className="btn-icon p-1" title="Download text">
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Voice {voice && `(${voice.lang})`}</label>
          <select
            value={voice?.name || ''}
            onChange={(e) => {
              const selected = voices.find(v => v.name === e.target.value);
              setVoice(selected || null);
            }}
            className="input-base"
            disabled={voices.length === 0}
          >
            {voices.length === 0 ? (
              <option>Loading voices...</option>
            ) : (
              voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} {v.localService ? '(Local)' : '(Online)'} - {v.lang}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="label">Rate: {rate.toFixed(1)}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
            disabled={isSpeaking}
          />
        </div>
        <div>
          <label className="label">Pitch: {pitch.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
            disabled={isSpeaking}
          />
        </div>
        <div>
          <label className="label">Volume: {Math.round(volume * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full"
            disabled={isSpeaking}
          />
        </div>
      </div>

{/* Controls moved to header */}

































      {isSpeaking && (
        <div className="p-4 rounded-xl border animate-fade-in" style={{ 
          backgroundColor: 'var(--status-info-bg)', 
          borderColor: 'var(--status-info)' 
        }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Volume2 size={24} style={{ color: 'var(--status-info)' }} className="animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </div>
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Speaking...
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Click "Stop Speaking" to cancel
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-primary)' 
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Tips:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• Use punctuation marks for natural pauses</li>
          <li>• Adjust rate for faster or slower speech</li>
          <li>• Try different voices for variety</li>
          <li>• Volume controls the output loudness</li>
        </ul>
      </div>
    </ToolShell>
  );
}

