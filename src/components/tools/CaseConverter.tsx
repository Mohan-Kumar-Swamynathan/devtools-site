import { useState, useCallback, useEffect } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [caseType, setCaseType] = useState<'camel' | 'pascal' | 'snake' | 'kebab' | 'upper' | 'lower' | 'title'>('camel');

  const convert = useCallback(() => {
    if (!input) {
      setOutput('');
      return;
    }

    let result = '';
    const words = input.trim().split(/\s+/);

    switch (caseType) {
      case 'camel':
        result = words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        break;
      case 'pascal':
        result = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        break;
      case 'snake':
        result = words.map(w => w.toLowerCase()).join('_');
        break;
      case 'kebab':
        result = words.map(w => w.toLowerCase()).join('-');
        break;
      case 'upper':
        result = input.toUpperCase();
        break;
      case 'lower':
        result = input.toLowerCase();
        break;
      case 'title':
        result = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        break;
    }

    setOutput(result);
  }, [input, caseType]);

  useEffect(() => {
    convert();
  }, [convert]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={(v) => { setInput(v); convert(); }}
        language="text"
        label="Text Input"
        placeholder="hello world example"
      />

      <div>
        <label className="label">Case Type</label>
        <select value={caseType} onChange={(e) => { setCaseType(e.target.value as any); convert(); }} className="input-base">
          <option value="camel">camelCase</option>
          <option value="pascal">PascalCase</option>
          <option value="snake">snake_case</option>
          <option value="kebab">kebab-case</option>
          <option value="upper">UPPER CASE</option>
          <option value="lower">lower case</option>
          <option value="title">Title Case</option>
        </select>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="Converted Text"
          language="text"
        />
      )}
    </div>
  );
}

