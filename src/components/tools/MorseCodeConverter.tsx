import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const morseCode: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/'
};

const reverseMorse: Record<string, string> = Object.fromEntries(
  Object.entries(morseCode).map(([k, v]) => [v, k])
);

export default function MorseCodeConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'text-to-morse' | 'morse-to-text'>('text-to-morse');

  const textToMorse = useCallback(() => {
    const text = input.toUpperCase();
    const morse = text.split('').map(char => {
      if (char === ' ') return '/';
      return morseCode[char] || char;
    }).join(' ');
    setOutput(morse);
  }, [input]);

  const morseToText = useCallback(() => {
    const morse = input.trim();
    const words = morse.split(' / ');
    const text = words.map(word => {
      const letters = word.split(' ');
      return letters.map(letter => reverseMorse[letter] || letter).join('');
    }).join(' ');
    setOutput(text);
  }, [input]);

  const handleModeChange = (newMode: 'text-to-morse' | 'morse-to-text') => {
    setMode(newMode);
    setInput('');
    setOutput('');
  };

  
  const controls = (
          <div className="flex items-center gap-3">
        <button 
          onClick={mode === 'text-to-morse' ? textToMorse : morseToText} 
          disabled={!input} 
          className="btn-primary"
        >
          Convert
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <button
          onClick={() => handleModeChange('text-to-morse')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'text-to-morse' ? 'tab-active' : ''
          }`}
          style={mode === 'text-to-morse' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Text → Morse Code
        </button>
        <button
          onClick={() => handleModeChange('morse-to-text')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'morse-to-text' ? 'tab-active' : ''
          }`}
          style={mode === 'morse-to-text' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Morse Code → Text
        </button>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label={mode === 'text-to-morse' ? 'Text Input' : 'Morse Code Input'}
        placeholder={mode === 'text-to-morse' ? 'Hello World' : '.... . .-.. .-.. --- / .-- --- .-. .-.. -..'}
      />

{/* Controls moved to header */}












      {output && (
        <OutputPanel
          value={output}
          label={mode === 'text-to-morse' ? 'Morse Code Output' : 'Text Output'}
          language="text"
        />
      )}
    </ToolShell>
  );
}

