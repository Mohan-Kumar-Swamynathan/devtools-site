import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function ApiDocumentationGenerator() {
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState('GET');
  const [description, setDescription] = useState('');
  const [params, setParams] = useState<Array<{ name: string; type: string; required: boolean; desc: string }>>([]);
  const [response, setResponse] = useState('');
  const [output, setOutput] = useState('');

  const addParam = () => {
    setParams([...params, { name: '', type: 'string', required: false, desc: '' }]);
  };

  const updateParam = (index: number, field: string, value: any) => {
    const newParams = [...params];
    newParams[index] = { ...newParams[index], [field]: value };
    setParams(newParams);
  };

  const removeParam = (index: number) => {
    setParams(params.filter((_, i) => i !== index));
  };

  const generate = useCallback(() => {
    const doc = `## ${method} ${endpoint}

${description || 'API endpoint description'}

### Parameters

${params.length > 0 ? params.map(p => `- **${p.name}** (${p.type})${p.required ? ' *required*' : ''} - ${p.desc || 'No description'}`).join('\n') : 'No parameters'}

### Response

\`\`\`json
${response || '{}'}
\`\`\`

### Example Request

\`\`\`bash
curl -X ${method} ${endpoint}
\`\`\`
`;

    setOutput(doc);
  }, [endpoint, method, description, params, response]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Endpoint</label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="/api/users"
            className="input-base font-mono"
          />
        </div>
        <div>
          <label className="label">HTTP Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="input-base">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Endpoint description"
          className="input-base min-h-[80px]"
        />
      </div>

      <div>
        <label className="label">Parameters</label>
        <div className="space-y-3">
          {params.map((param, i) => (
            <div key={i} className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
                <input
                  type="text"
                  value={param.name}
                  onChange={(e) => updateParam(i, 'name', e.target.value)}
                  placeholder="Parameter name"
                  className="input-base text-sm"
                />
                <select
                  value={param.type}
                  onChange={(e) => updateParam(i, 'type', e.target.value)}
                  className="input-base text-sm"
                >
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
                  <option value="object">object</option>
                  <option value="array">array</option>
                </select>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={param.required}
                    onChange={(e) => updateParam(i, 'required', e.target.checked)}
                    className="checkbox"
                  />
                  <span className="text-sm">Required</span>
                </label>
                <button onClick={() => removeParam(i)} className="btn-ghost text-sm">Remove</button>
              </div>
              <input
                type="text"
                value={param.desc}
                onChange={(e) => updateParam(i, 'desc', e.target.value)}
                placeholder="Description"
                className="input-base text-sm w-full"
              />
            </div>
          ))}
          <button onClick={addParam} className="btn-secondary text-sm">+ Add Parameter</button>
        </div>
      </div>

      <div>
        <label className="label">Example Response (JSON)</label>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder='{"status": "success", "data": {}}'
          className="input-base min-h-[100px] font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generate} className="btn-primary">
          Generate Documentation
        </button>
        <button onClick={() => { setEndpoint(''); setDescription(''); setParams([]); setResponse(''); setOutput(''); }} className="btn-ghost">
          Reset
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="API Documentation (Markdown)"
          language="markdown"
          showLineNumbers
        />
      )}
    </div>
  );
}

