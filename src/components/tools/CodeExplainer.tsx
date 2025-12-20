import { useState, useCallback, useEffect } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { BookOpen, Loader, AlertCircle } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { initModel, isModelReady, isModelLoading, generateResponse } from '@/lib/assistant/browserLLM';

export default function CodeExplainer() {
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [error, setError] = useState('');
  const [modelReady, setModelReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [modelProgress, setModelProgress] = useState(0);

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

  useEffect(() => {
    initializeModel();
  }, [initializeModel]);

  const explain = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter code to explain');
      return;
    }

    if (!modelReady) {
      setError('AI model is not ready. Please wait for it to load.');
      return;
    }

    setError('');
    setIsExplaining(true);

    try {
      const prompt = `Explain the following code in plain English. Describe what it does, how it works, and any important details:\n\n\`\`\`\n${code}\n\`\`\``;
      const explained = await generateResponse(prompt, '');
      setExplanation(explained.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Explanation failed. Please try again.');
      setExplanation('');
    } finally {
      setIsExplaining(false);
    }
  }, [code, modelReady]);

  return (
    <div className="space-y-6">
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
                Click "Load AI Model" to enable code explanation. This requires internet connection.
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

      {/* Code Input */}
      <CodeEditor
        value={code}
        onChange={setCode}
        language="javascript"
        label="Code to Explain"
        placeholder="function example() {\n  return 'Hello World';\n}"
        rows={12}
      />

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={explain}
          disabled={!code.trim() || isExplaining || !modelReady}
          className="btn-primary flex items-center gap-2"
        >
          {isExplaining ? (
            <>
              <Loader size={16} className="animate-spin" />
              Explaining...
            </>
          ) : (
            <>
              <BookOpen size={16} />
              Explain Code
            </>
          )}
        </button>
        <button
          onClick={() => { setCode(''); setExplanation(''); setError(''); }}
          className="btn-ghost"
          disabled={isExplaining}
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* Output */}
      {explanation && (
        <OutputPanel
          value={explanation}
          label="Code Explanation"
          language="text"
        />
      )}
    </div>
  );
}






