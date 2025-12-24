import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';
import JsonTreeViewer from '@/components/common/JsonTreeViewer';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import { AlignLeft, Minimize2, TreeDeciduous, FileText } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [viewMode, setViewMode] = useState<'tree' | 'raw'>('tree');
  const { showToast } = useToast();

  const format = useCallback(() => {
    setError('');
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setOutput(JSON.stringify(parsed, null, indent));
      showToast('JSON Formatted successfully', 'success');
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
      setParsedData(null);
      showToast('Invalid JSON input', 'error');
    }
  }, [input, indent, showToast]);

  const minify = useCallback(() => {
    setError('');
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setOutput(JSON.stringify(parsed));
      showToast('JSON Minified successfully', 'success');
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
      setParsedData(null);
      showToast('Invalid JSON input', 'error');
    }
  }, [input, showToast]);

  const handleClear = () => {
    setInput('');
    setOutput('');
    setParsedData(null);
    setError('');
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showToast('Copied to clipboard', 'success');
    }
  };

  const controls = (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-[var(--text-secondary)]">Indent:</label>
        <select
          value={indent}
          onChange={(e) => setIndent(Number(e.target.value))}
          className="input-sm border-[var(--border-primary)] bg-[var(--bg-tertiary)] rounded-lg py-1 px-2 text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none transition-all"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={1}>1 space</option>
        </select>
      </div>
      <button onClick={format} disabled={!input} className="btn-primary btn-sm px-4 py-1.5 flex items-center gap-2">
        <AlignLeft size={16} />
        Format
      </button>
      <button onClick={minify} disabled={!input} className="btn-secondary btn-sm px-4 py-1.5 flex items-center gap-2">
        <Minimize2 size={16} />
        Minify
      </button>
    </div>
  );

  return (
    <ToolShell
      controls={controls}
      onClear={handleClear}
      onCopy={output ? handleCopy : undefined}
    >
      <div className="space-y-6">
        <CollapsibleSection
          title="Input"
          persistKey="json-formatter-input-expanded"
          defaultExpanded={true}
        >
          <CodeEditor
            value={input}
            onChange={setInput}
            language="json"
            label="JSON Input"
            placeholder='{"name": "John", "age": 30}'
            minHeight="200px"
          />
        </CollapsibleSection>

        {error && <div className="alert-error animate-fade-in">{error}</div>}

        {(output || parsedData) && (
          <CollapsibleSection
            title="Output"
            persistKey="json-formatter-output-expanded"
            defaultExpanded={true}
          >
            <div className="animate-slide-up space-y-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('tree')}
                  className={`btn-sm px-3 py-1.5 flex items-center gap-2 ${viewMode === 'tree' ? 'btn-primary' : 'btn-secondary'
                    }`}
                >
                  <TreeDeciduous size={14} />
                  Tree View
                </button>
                <button
                  onClick={() => setViewMode('raw')}
                  className={`btn-sm px-3 py-1.5 flex items-center gap-2 ${viewMode === 'raw' ? 'btn-primary' : 'btn-secondary'
                    }`}
                >
                  <FileText size={14} />
                  Raw
                </button>
              </div>

              {/* Tree View */}
              {viewMode === 'tree' && parsedData && (
                <JsonTreeViewer data={parsedData} label="Formatted JSON" />
              )}

              {/* Raw View */}
              {viewMode === 'raw' && output && (
                <OutputPanel
                  value={output}
                  label="Formatted JSON"
                  language="json"
                  showLineNumbers
                />
              )}
            </div>
          </CollapsibleSection>
        )}
      </div>
    </ToolShell>
  );
}

