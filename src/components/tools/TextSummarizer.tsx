import { useState, useCallback, useEffect } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { FileText, Loader, AlertCircle } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { initModel, isModelReady, isModelLoading, generateResponse } from '@/lib/assistant/browserLLM';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function TextSummarizer() {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
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

  const summarize = useCallback(async () => {
    if (!input.trim()) {
      setError('Please enter text to summarize');
      return;
    }

    if (!modelReady) {
      setError('AI model is not ready. Please wait for it to load.');
      return;
    }

    setError('');
    setIsSummarizing(true);

    try {
      const prompt = `Summarize the following text in 2-3 sentences, capturing the main points:\n\n${input}`;
      const summarized = await generateResponse(prompt, '');
      setSummary(summarized.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Summarization failed. Please try again.');
      setSummary('');
    } finally {
      setIsSummarizing(false);
    }
  }, [input, modelReady]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={summarize}
          disabled={!input.trim() || isSummarizing || !modelReady}
          className="btn-primary flex items-center gap-2"
        >
          {isSummarizing ? (
            <>
              <Loader size={16} className="animate-spin" />
              Summarizing...
            </>
          ) : (
            <>
              <FileText size={16} />
              Summarize
            </>
          )}
        </button>
        <button
          onClick={() => { setInput(''); setSummary(''); setError(''); }}
          className="btn-ghost"
          disabled={isSummarizing}
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
                Click "Load AI Model" to enable summarization. This requires internet connection.
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

      {/* Input */}
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="Text to Summarize"
        placeholder="Enter or paste the text you want to summarize..."
        rows={12}
      />

      {/* Actions */}
{/* Controls moved to header */}


























      {/* Error */}
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* Output */}
      {summary && (
        <OutputPanel
          value={summary}
          label="Summary"
          language="text"
        />
      )}
    </ToolShell>
  );
}








