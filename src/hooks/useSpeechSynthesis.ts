import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load voices when available
  useEffect(() => {
    if (!isSupported) return;
    
    // Chrome loads voices asynchronously
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isSupported]);

  const speak = useCallback((text: string) => {
    if (!isSupported) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to get a natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google') || 
      v.name.includes('Natural') || 
      v.name.includes('Samantha') ||
      (v.lang.startsWith('en') && v.localService === false)
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    } else if (voices.length > 0) {
      utterance.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}

