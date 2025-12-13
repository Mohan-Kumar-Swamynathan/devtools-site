import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function JsonCsvConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');

  const jsonToCsv = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('JSON must be an array of objects');
      }

      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];

      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          const str = String(value);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        });
        csvRows.push(values.join(','));
      }

      return csvRows.join('\n');
    } catch (e) {
      throw new Error(`Invalid JSON: ${(e as Error).message}`);
    }
  }, []);

  const csvToJson = useCallback((csv: string) => {
    try {
      const lines = csv.trim().split('\n');
      if (lines.length < 2) throw new Error('CSV must have at least a header and one data row');

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });
        rows.push(row);
      }

      return JSON.stringify(rows, null, 2);
    } catch (e) {
      throw new Error(`Invalid CSV: ${(e as Error).message}`);
    }
  }, []);

  const convert = useCallback(() => {
    setError('');
    try {
      if (mode === 'json-to-csv') {
        setOutput(jsonToCsv(input));
      } else {
        setOutput(csvToJson(input));
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, mode, jsonToCsv, csvToJson]);

  const handleModeChange = (newMode: 'json-to-csv' | 'csv-to-json') => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <button
          onClick={() => handleModeChange('json-to-csv')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'json-to-csv' ? 'tab-active' : ''
          }`}
          style={mode === 'json-to-csv' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          JSON → CSV
        </button>
        <button
          onClick={() => handleModeChange('csv-to-json')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'csv-to-json' ? 'tab-active' : ''
          }`}
          style={mode === 'csv-to-json' ? { backgroundColor: 'var(--bg-primary)' } : {}}
        >
          CSV → JSON
        </button>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language={mode === 'json-to-csv' ? 'json' : 'text'}
        label={mode === 'json-to-csv' ? 'JSON Array Input' : 'CSV Input'}
        placeholder={mode === 'json-to-csv' ? '[{"name": "John", "age": 30}]' : 'name,age\nJohn,30'}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={convert} disabled={!input} className="btn-primary">
          Convert
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {output && (
        <OutputPanel
          value={output}
          label={mode === 'json-to-csv' ? 'CSV Output' : 'JSON Output'}
          language={mode === 'json-to-csv' ? 'text' : 'json'}
          filename={mode === 'json-to-csv' ? 'output.csv' : 'output.json'}
        />
      )}
    </div>
  );
}

