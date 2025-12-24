import { useState, useCallback, useEffect } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { Languages, Loader, AlertCircle } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { initModel, isModelReady, isModelLoading, generateResponse } from '@/lib/assistant/browserLLM';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }
];

export default function TextTranslator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [fromLang, setFromLang] = useState('auto');
  const [toLang, setToLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');
  const [modelReady, setModelReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);

  // Initialize model on mount
  const initializeModel = useCallback(async () => {
    if (isModelReady() || isModelLoading()) {
      setModelReady(isModelReady());
      return;
    }

    setModelLoading(true);
    try {
      await initModel((progress) => {
        setModelProgress(progress);
      });
      setModelReady(true);
    } catch (err) {
      setError('Failed to load AI model. Please check your internet connection and try again.');
      console.error('Model initialization error:', err);
    } finally {
      setModelLoading(false);
    }
  }, []);

  // Auto-initialize model
  useEffect(() => {
    initializeModel();
  }, [initializeModel]);

  const translate = useCallback(async () => {
    if (!input.trim()) {
      setError('Please enter text to translate');
      return;
    }

    if (!modelReady) {
      setError('AI model is not ready. Please wait for it to load.');
      return;
    }

    setError('');
    setIsTranslating(true);

    try {
      const targetLanguage = LANGUAGES.find(l => l.code === toLang)?.name || toLang;
      const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text, nothing else:\n\n${input}`;
      
      const translated = await generateResponse(prompt, '');
      setOutput(translated.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed. Please try again.');
      setOutput('');
    } finally {
      setIsTranslating(false);
    }
  }, [input, toLang, modelReady]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={translate}
          disabled={!input.trim() || isTranslating || !modelReady}
          className="btn-primary flex items-center gap-2"
        >
          {isTranslating ? (
            <>
              <Loader size={16} className="animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Languages size={16} />
              Translate
            </>
          )}
        </button>
        <button
          onClick={() => { setInput(''); setOutput(''); setError(''); }}
          className="btn-ghost"
          disabled={isTranslating}
        >
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {/* Model Status */}
      {!modelReady && !modelLoading && (
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-3">
            <AlertCircle size={20} style={{ color: 'var(--status-warning)' }} />
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                AI model not loaded
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Click "Load AI Model" to enable translation. This requires internet connection.
              </p>
            </div>
            <button onClick={initializeModel} className="btn-primary text-sm">
              Load AI Model
            </button>
          </div>
        </div>
      )}

      {modelLoading && (
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-3">
            <LoadingSpinner size="sm" />
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Loading AI model... {modelProgress}%
              </p>
              <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div 
                  className="h-full transition-all duration-300 rounded-full"
                  style={{ 
                    width: `${modelProgress}%`,
                    backgroundColor: 'var(--brand-primary)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label mb-2">From Language</label>
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            className="input-base"
            disabled={isTranslating}
          >
            <option value="auto">Auto-detect</option>
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label mb-2">To Language</label>
          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="input-base"
            disabled={isTranslating}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Input */}
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="Text to Translate"
        placeholder="Enter text to translate..."
        rows={8}
      />

      {/* Actions */}
{/* Controls moved to header */}


























      {/* Error */}
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* Output */}
      {output && (
        <OutputPanel
          value={output}
          label="Translated Text"
          language="text"
        />
      )}
    </ToolShell>
  );
}

