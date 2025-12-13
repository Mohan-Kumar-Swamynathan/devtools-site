import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ErrorMessage from '@/components/common/ErrorMessage';

interface EnvVar {
  key: string;
  value: string;
  comment: string;
}

export default function EnvFileGenerator() {
  const [vars, setVars] = useState<EnvVar[]>([
    { key: 'DATABASE_URL', value: 'postgresql://localhost:5432/mydb', comment: 'Database connection string' },
    { key: 'API_KEY', value: 'your-api-key-here', comment: 'API key for external service' }
  ]);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generate = useCallback(() => {
    setError('');
    try {
      const lines = vars
        .filter(v => v.key.trim())
        .map(v => {
          const parts: string[] = [];
          if (v.comment.trim()) {
            parts.push(`# ${v.comment.trim()}`);
          }
          parts.push(`${v.key.trim()}=${v.value.trim()}`);
          return parts.join('\n');
        });
      
      setOutput(lines.join('\n\n'));
    } catch (e) {
      setError(`Generation error: ${(e as Error).message}`);
      setOutput('');
    }
  }, [vars]);

  const addVar = () => {
    setVars([...vars, { key: '', value: '', comment: '' }]);
  };

  const updateVar = (index: number, field: keyof EnvVar, value: string) => {
    const newVars = [...vars];
    newVars[index] = { ...newVars[index], [field]: value };
    setVars(newVars);
  };

  const removeVar = (index: number) => {
    setVars(vars.filter((_, i) => i !== index));
  };

  const [input, setInput] = useState('');

  const loadFromText = useCallback(() => {
    try {
      const lines = input.split('\n');
      const newVars: EnvVar[] = [];
      let currentComment = '';
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          if (trimmed.startsWith('#')) {
            currentComment = trimmed.substring(1).trim();
          }
          continue;
        }
        
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        
        if (key) {
          newVars.push({
            key: key.trim(),
            value: value.trim(),
            comment: currentComment
          });
          currentComment = '';
        }
      }
      
      if (newVars.length > 0) {
        setVars(newVars);
        setInput('');
      }
    } catch (e) {
      setError(`Parse error: ${(e as Error).message}`);
    }
  }, [input]);

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Environment Variables
          </h3>
          <button onClick={addVar} className="btn-primary btn-sm">
            + Add Variable
          </button>
        </div>

        <div className="space-y-3">
          {vars.map((v, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="label">Key</label>
                  <input
                    type="text"
                    value={v.key}
                    onChange={(e) => updateVar(index, 'key', e.target.value)}
                    className="input-base"
                    placeholder="VARIABLE_NAME"
                  />
                </div>
                <div>
                  <label className="label">Value</label>
                  <input
                    type="text"
                    value={v.value}
                    onChange={(e) => updateVar(index, 'value', e.target.value)}
                    className="input-base"
                    placeholder="variable value"
                  />
                </div>
                <div>
                  <label className="label">Comment (optional)</label>
                  <input
                    type="text"
                    value={v.comment}
                    onChange={(e) => updateVar(index, 'comment', e.target.value)}
                    className="input-base"
                    placeholder="Description"
                  />
                </div>
              </div>
              <button
                onClick={() => removeVar(index)}
                className="btn-ghost btn-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generate} className="btn-primary">
          Generate .env File
        </button>
        <button onClick={() => { setVars([{ key: '', value: '', comment: '' }]); setOutput(''); }} className="btn-ghost">
          Clear All
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label=".env file"
          language="text"
          filename=".env"
          showLineNumbers
        />
      )}

      <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Or paste existing .env file to edit:
        </h3>
        <CodeEditor
          value={input}
          onChange={setInput}
          language="text"
          placeholder="# Paste your .env file here..."
          rows={6}
        />
        <button onClick={loadFromText} className="btn-secondary mt-2">
          Load from Text
        </button>
      </div>
    </div>
  );
}

