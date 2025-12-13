import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function GraphqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const format = useCallback(() => {
    setError('');
    setIsLoading(true);
    
    try {
      // Simple GraphQL formatter
      let formatted = input.trim();
      
      // Remove extra whitespace
      formatted = formatted.replace(/\s+/g, ' ');
      
      // Format query structure
      formatted = formatted
        .replace(/\{/g, ' {\n')
        .replace(/\}/g, '\n}')
        .replace(/\(/g, '(\n')
        .replace(/\)/g, '\n)')
        .replace(/:/g, ': ')
        .replace(/!/g, '!')
        .replace(/@/g, '@');
      
      // Add proper indentation
      const lines = formatted.split('\n');
      let indent = 0;
      const indented = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        if (trimmed.includes('}') || trimmed.includes(')')) {
          indent = Math.max(0, indent - 2);
        }
        
        const result = ' '.repeat(indent) + trimmed;
        
        if (trimmed.includes('{') || trimmed.includes('(')) {
          indent += 2;
        }
        
        return result;
      }).filter(Boolean).join('\n');
      
      setOutput(indented);
    } catch (e) {
      setError(`Formatting error: ${(e as Error).message}`);
      setOutput('');
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  const minify = useCallback(() => {
    setError('');
    try {
      const minified = input
        .replace(/\s+/g, ' ')
        .replace(/\s*\{\s*/g, '{')
        .replace(/\s*\}\s*/g, '}')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*,\s*/g, ',')
        .trim();
      setOutput(minified);
    } catch (e) {
      setError(`Minification error: ${(e as Error).message}`);
      setOutput('');
    }
  }, [input]);

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
      
      <CodeEditor
        value={input}
        onChange={setInput}
        language="graphql"
        label="GraphQL Query/Mutation"
        placeholder="query { user(id: 1) { name email } }"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={format} disabled={!input || isLoading} className="btn-primary">
          {isLoading ? <LoadingSpinner size="sm" /> : 'Format'}
        </button>
        <button onClick={minify} disabled={!input} className="btn-secondary">
          Minify
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="Formatted GraphQL"
          language="graphql"
          showLineNumbers
        />
      )}
    </div>
  );
}

