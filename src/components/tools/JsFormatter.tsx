import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function JsFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [indent, setIndent] = useState(2);

  const format = useCallback(() => {
    try {
      // Basic JavaScript formatting
      let formatted = input;
      
      // Add line breaks after semicolons (not in strings)
      formatted = formatted.replace(/;(?![^"']*["'][^"']*["'])/g, ';\n');
      
      // Add line breaks after braces
      formatted = formatted.replace(/\{/g, ' {\n');
      formatted = formatted.replace(/\}/g, '\n}\n');
      
      // Indent
      const lines = formatted.split('\n');
      let indentLevel = 0;
      const indented = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        if (trimmed.includes('}')) indentLevel = Math.max(0, indentLevel - 1);
        
        const indentedLine = ' '.repeat(indentLevel * indent) + trimmed;
        
        if (trimmed.includes('{')) indentLevel++;
        
        return indentedLine;
      }).filter(l => l).join('\n');
      
      setOutput(indented.trim());
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    const minified = input
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*/g, '') // Remove line comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*\{\s*/g, '{')
      .replace(/\s*\}\s*/g, '}')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')')
      .replace(/\s*;\s*/g, ';')
      .trim();
    setOutput(minified);
  }, [input]);

  const handleModeChange = (newMode: 'format' | 'minify') => {
    setMode(newMode);
    setOutput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <button
          onClick={() => handleModeChange('format')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'format' ? 'tab-active' : ''
          }`}
          style={mode === 'format' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Format
        </button>
        <button
          onClick={() => handleModeChange('minify')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'minify' ? 'tab-active' : ''
          }`}
          style={mode === 'minify' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          Minify
        </button>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language="javascript"
        label="JavaScript Input"
        placeholder="function test() { return 'hello'; }"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={mode === 'format' ? format : minify} 
          disabled={!input} 
          className="btn-primary"
        >
          {mode === 'format' ? 'Format' : 'Minify'}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-ghost">
          Clear
        </button>
        {mode === 'format' && (
          <div className="flex items-center gap-2 ml-auto">
            <label className="label-inline">Indent:</label>
            <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="input-base w-auto py-2">
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
        )}
      </div>

      {output && (
        <OutputPanel
          value={output}
          label={mode === 'format' ? 'Formatted JavaScript' : 'Minified JavaScript'}
          language="javascript"
          showLineNumbers={mode === 'format'}
        />
      )}
    </div>
  );
}

