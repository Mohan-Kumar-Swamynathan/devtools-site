import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
}

// Extend Window interface for webkit types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not available');
      return;
    }
    
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true; // Enable interim results for better UX
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event: any) => {
      if (!event.results || event.results.length === 0) return;
      
      // Get the latest result
      const result = event.results[event.results.length - 1];
      if (result && result[0]) {
        const transcript = result[0].transcript || '';
        if (transcript.trim()) {
          // Update transcript immediately for interim results
          setTranscript(transcript.trim());
          
          // If it's final, keep it
          if (result.isFinal) {
            setTranscript(transcript.trim());
          }
        }
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      // Don't clear transcript on end - keep it for processing
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      // Don't clear transcript on error - user might want to retry
      if (event.error === 'no-speech') {
        // This is normal - user didn't speak
        setTranscript('');
      } else if (event.error === 'aborted') {
        // Recognition was aborted - this is fine
      } else {
        // Other errors - keep transcript if available
        console.warn('Speech recognition error type:', event.error);
      }
    };
    
    recognitionRef.current.onnomatch = () => {
      console.warn('No speech match found');
      setIsListening(false);
      // Keep transcript if available
    };
    
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript(''); // Clear previous transcript when starting
    };

    return () => {
      recognitionRef.current?.abort();
    };
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      // Ignore errors
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      console.warn('Speech recognition not supported in this browser');
      if (typeof window !== 'undefined') {
        alert('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
      }
      return;
    }
    
    if (!recognitionRef.current) {
      console.error('Speech recognition not initialized');
      return;
    }
    
    // If already listening, stop first
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors
        }
      }
      setIsListening(false);
      return;
    }
    
    setTranscript('');
    
    try {
      // Check current state and clean up if needed
      const currentState = recognitionRef.current.readyState;
      // 0 = idle, 1 = starting, 2 = listening, 3 = stopped
      
      if (currentState === 2 || currentState === 1) {
        // Already running or starting - abort first
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore abort errors
        }
      }
      
      // Small delay to ensure clean state
      setTimeout(() => {
        try {
          setIsListening(true);
          recognitionRef.current.start();
        } catch (e: any) {
          console.error('Error starting speech recognition:', e);
          setIsListening(false);
          
          // Handle specific error cases
          if (e.name === 'InvalidStateError' || e.message?.includes('already started') || e.message?.includes('started')) {
            // Already started - abort and retry once
            try {
              recognitionRef.current.abort();
            } catch (abortError) {
              // Ignore
            }
            setTimeout(() => {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch (retryError) {
                console.error('Retry failed:', retryError);
                setIsListening(false);
              }
            }, 300);
          } else if (e.name === 'NotAllowedError' || e.error === 'not-allowed') {
            if (typeof window !== 'undefined') {
              alert('Microphone permission denied. Please allow microphone access in your browser settings and try again.');
            }
          } else if (e.name === 'NoSpeechError' || e.error === 'no-speech') {
            // This is handled by onerror
            setIsListening(false);
          } else {
            console.warn('Unknown speech recognition error:', e);
            setIsListening(false);
          }
        }
      }, 50);
    } catch (e) {
      console.error('Error in startListening:', e);
      setIsListening(false);
    }
  }, [isSupported, isListening]);

  return { isListening, transcript, startListening, stopListening, isSupported };
}

