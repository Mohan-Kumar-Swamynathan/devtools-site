import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

const licensePatterns: Record<string, RegExp[]> = {
  'MIT': [/MIT License/i, /MIT/i, /The MIT License/i],
  'Apache-2.0': [/Apache License/i, /Apache-2.0/i, /Apache Software License/i],
  'GPL-3.0': [/GNU General Public License/i, /GPL-3.0/i, /GPL v3/i],
  'BSD-3-Clause': [/BSD 3-Clause/i, /BSD-3-Clause/i, /3-Clause BSD/i],
  'ISC': [/ISC License/i, /ISC/i],
  'Unlicense': [/Unlicense/i, /Public Domain/i],
  'CC0-1.0': [/Creative Commons/i, /CC0/i]
};

export default function LicenseIdentifier() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ licenses: string[]; confidence: string } | null>(null);

  const identify = useCallback(() => {
    const matches: string[] = [];
    
    Object.entries(licensePatterns).forEach(([license, patterns]) => {
      patterns.forEach(pattern => {
        if (pattern.test(input)) {
          if (!matches.includes(license)) {
            matches.push(license);
          }
        }
      });
    });

    const confidence = matches.length === 0 ? 'None' : 
                      matches.length === 1 ? 'High' : 
                      'Multiple matches';

    setResult({ licenses: matches, confidence });
  }, [input]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="License Text"
        placeholder="MIT License

Copyright (c) 2024

Permission is hereby granted..."
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={identify} disabled={!input} className="btn-primary">
          Identify License
        </button>
        <button onClick={() => { setInput(''); setResult(null); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${
            result.licenses.length > 0 ? 'alert-success' : 'alert-error'
          }`}>
            <div className="font-medium mb-2">
              {result.licenses.length > 0 ? '✓ License Identified' : '✗ No License Found'}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Confidence: {result.confidence}
            </div>
          </div>
          {result.licenses.length > 0 && (
            <div>
              <label className="label">Possible Licenses</label>
              <div className="space-y-2">
                {result.licenses.map(license => (
                  <div key={license} className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-primary)' }}>
                    <span className="font-medium">{license}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

