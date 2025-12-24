import { useState, useCallback } from 'react';
import { Copy, Download, Plus, Trash2, RotateCcw } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface Field {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  value: string;
}

export default function ApiMockBuilder() {
  const [fields, setFields] = useState<Field[]>([
    { key: 'id', type: 'number', value: '1' },
    { key: 'name', type: 'string', value: 'John Doe' },
  ]);
  const [statusCode, setStatusCode] = useState(200);
  const { showToast } = useToast();

  const generateMock = useCallback(() => {
    const obj: any = {};
    fields.forEach(field => {
      if (field.key.trim()) {
        if (field.type === 'number') {
          obj[field.key] = parseFloat(field.value) || 0;
        } else if (field.type === 'boolean') {
          obj[field.key] = field.value === 'true';
        } else if (field.type === 'array') {
          try {
            obj[field.key] = JSON.parse(field.value);
          } catch {
            obj[field.key] = [];
          }
        } else if (field.type === 'object') {
          try {
            obj[field.key] = JSON.parse(field.value);
          } catch {
            obj[field.key] = {};
          }
        } else {
          obj[field.key] = field.value;
        }
      }
    });
    return {
      status: statusCode,
      data: obj,
    };
  }, [fields, statusCode]);

  const handleCopy = useCallback(() => {
    const mock = generateMock();
    const json = JSON.stringify(mock, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [generateMock, showToast]);

  const handleDownload = useCallback(() => {
    const mock = generateMock();
    const json = JSON.stringify(mock, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mock-api-response.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }, [generateMock]);

  const addField = useCallback(() => {
    setFields(prev => [...prev, { key: '', type: 'string', value: '' }]);
  }, []);

  const removeField = useCallback((index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateField = useCallback((index: number, field: keyof Field, value: string | Field['type']) => {
    setFields(prev => prev.map((f, i) => 
      i === index ? { ...f, [field]: value } : f
    ));
  }, []);

  const mock = generateMock();

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          className="btn-primary flex items-center gap-2"
        >
          <Copy size={18} />
          Copy JSON
        </button>
        <button
          onClick={handleDownload}
          className="btn-secondary flex items-center gap-2"
        >
          <Download size={18} />
          Download
        </button>
        <button
          onClick={() => {
            setFields([
              { key: 'id', type: 'number', value: '1' },
              { key: 'name', type: 'string', value: 'John Doe' },
            ]);
            setStatusCode(200);
          }}
          className="btn-ghost flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
{/* Controls moved to header */}





























      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Fields
          </h3>
          <div className="p-4 rounded-xl border space-y-3" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            {fields.map((field, index) => (
              <div key={index} className="flex gap-2 items-start">
                <input
                  type="text"
                  value={field.key}
                  onChange={(e) => updateField(index, 'key', e.target.value)}
                  className="input flex-1"
                  placeholder="Key"
                />
                <select
                  value={field.type}
                  onChange={(e) => updateField(index, 'type', e.target.value as Field['type'])}
                  className="input w-32"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="array">Array</option>
                  <option value="object">Object</option>
                </select>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => updateField(index, 'value', e.target.value)}
                  className="input flex-1"
                  placeholder="Value"
                />
                <button
                  onClick={() => removeField(index)}
                  className="btn-ghost btn-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addField}
              className="btn-secondary w-full btn-sm flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Field
            </button>
          </div>
          <div>
            <label className="label">Status Code</label>
            <input
              type="number"
              value={statusCode}
              onChange={(e) => setStatusCode(parseInt(e.target.value) || 200)}
              className="input w-full"
              min="100"
              max="599"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Generated Mock Response
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <pre className="text-sm overflow-x-auto max-h-96" style={{ color: 'var(--text-primary)' }}>
              <code>{JSON.stringify(mock, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

