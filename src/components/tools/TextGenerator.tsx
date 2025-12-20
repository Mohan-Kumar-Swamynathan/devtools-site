import { useState, useCallback, useEffect } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import { Sparkles, Loader, AlertCircle } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { initModel, isModelReady, isModelLoading, generateResponse } from '@/lib/assistant/browserLLM';

const PROMPTS = [
  { label: 'Blog Post', value: 'Write a blog post about: ' },
  { label: 'Article', value: 'Write an article about: ' },
  { label: 'Story', value: 'Write a short story about: ' },
  { label: 'Email', value: 'Write an email about: ' },
  { label: 'Summary', value: 'Summarize: ' },
  { label: 'Custom', value: '' }
];

export default function TextGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [promptType, setPromptType] = useState('Blog Post');
  const [isGenerating, setIsGenerating] = useState(false);
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

  useEffect(() => {
    initializeModel();
  }, [initializeModel]);

  const generate = useCallback(async () => {
    if (!input.trim()) {
      setError('Please enter a prompt or topic');
      return;
    }

    if (!modelReady) {
      setError('AI model is not ready. Please wait for it to load.');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const selectedPrompt = PROMPTS.find(p => p.label === promptType);
      const fullPrompt = selectedPrompt?.value 
        ? `${selectedPrompt.value}${input}`
        : input;
      
      const generated = await generateResponse(fullPrompt, '');
      setOutput(generated.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
      setOutput('');
    } finally {
      setIsGenerating(false);
    }
  }, [input, promptType, modelReady]);

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
                Click "Load AI Model" to enable text generation. This requires internet connection.
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

      {/* Prompt Type */}
      <div>
        <label className="label mb-2">Prompt Type</label>
        <select
          value={promptType}
          onChange={(e) => setPromptType(e.target.value)}
          className="input-base"
          disabled={isGenerating}
        >
          {PROMPTS.map(prompt => (
            <option key={prompt.label} value={prompt.label}>{prompt.label}</option>
          ))}
        </select>
      </div>

      {/* Input */}
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label={promptType === 'Custom' ? 'Custom Prompt' : 'Topic or Prompt'}
        placeholder={promptType === 'Custom' ? 'Enter your custom prompt...' : 'Enter topic or description...'}
        rows={6}
      />

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={generate}
          disabled={!input.trim() || isGenerating || !modelReady}
          className="btn-primary flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader size={16} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Generate Text
            </>
          )}
        </button>
        <button
          onClick={() => { setInput(''); setOutput(''); setError(''); }}
          className="btn-ghost"
          disabled={isGenerating}
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* Output */}
      {output && (
        <OutputPanel
          value={output}
          label="Generated Text"
          language="text"
        />
      )}
    </div>
  );
}

