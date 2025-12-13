import { useState, useCallback, useRef, useEffect } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import { Play, Square, Volume2 } from 'lucide-react';

export default function TextToSpeech() {
  const [input, setInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !voice) {
          setVoice(availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0]);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [voice]);

  const speak = useCallback(() => {
    if (!input.trim() || !synthRef.current) return;

    synthRef.current.cancel(); // Stop any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(input);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, [input, voice, rate, pitch, volume]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="Text to Speak"
        placeholder="Enter text you want to convert to speech..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Voice</label>
          <select
            value={voice?.name || ''}
            onChange={(e) => {
              const selected = voices.find(v => v.name === e.target.value);
              setVoice(selected || null);
            }}
            className="input-base"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
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
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={isSpeaking ? stop : speak}
          disabled={!input.trim()}
          className={`btn-primary flex items-center gap-2 ${isSpeaking ? 'bg-red-500 hover:bg-red-600' : ''}`}
        >
          {isSpeaking ? (
            <>
              <Square size={18} />
              Stop
            </>
          ) : (
            <>
              <Play size={18} />
              Speak
            </>
          )}
        </button>
        <button onClick={() => { setInput(''); stop(); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {!synthRef.current && (
        <div className="alert-warning">
          Text-to-Speech is not supported in your browser.
        </div>
      )}
    </div>
  );
}

