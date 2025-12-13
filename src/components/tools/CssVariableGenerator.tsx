import { useState, useCallback } from 'react';
import { Copy, Plus, Trash2, RotateCcw, Palette } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface Variable {
  name: string;
  value: string;
  type: 'color' | 'size' | 'spacing' | 'other';
}

export default function CssVariableGenerator() {
  const [variables, setVariables] = useState<Variable[]>([
    { name: '--primary-color', value: '#0ea5e9', type: 'color' },
    { name: '--spacing-md', value: '1rem', type: 'spacing' },
  ]);
  const { showToast } = useToast();

  const generateCSS = useCallback(() => {
    const css = `:root {\n${variables.map(v => `  ${v.name}: ${v.value};`).join('\n')}\n}`;
    return css;
  }, [variables]);

  const handleCopy = useCallback(() => {
    const css = generateCSS();
    navigator.clipboard.writeText(css).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [generateCSS, showToast]);

  const addVariable = useCallback(() => {
    setVariables(prev => [...prev, { name: '--variable-name', value: '', type: 'other' }]);
  }, []);

  const removeVariable = useCallback((index: number) => {
    setVariables(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateVariable = useCallback((index: number, field: keyof Variable, value: string | Variable['type']) => {
    setVariables(prev => prev.map((v, i) => 
      i === index ? { ...v, [field]: value } : v
    ));
  }, []);

  const css = generateCSS();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleCopy}
          className="btn-primary flex items-center gap-2"
        >
          <Copy size={18} />
          Copy CSS
        </button>
        <button
          onClick={() => {
            setVariables([
              { name: '--primary-color', value: '#0ea5e9', type: 'color' },
              { name: '--spacing-md', value: '1rem', type: 'spacing' },
            ]);
          }}
          className="btn-ghost flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            CSS Variables
          </h3>
          <div className="p-4 rounded-xl border space-y-3" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            {variables.map((variable, index) => (
              <div key={index} className="flex gap-2 items-start">
                <input
                  type="text"
                  value={variable.name}
                  onChange={(e) => updateVariable(index, 'name', e.target.value)}
                  className="input flex-1 font-mono text-sm"
                  placeholder="--variable-name"
                />
                <select
                  value={variable.type}
                  onChange={(e) => updateVariable(index, 'type', e.target.value as Variable['type'])}
                  className="input w-32"
                >
                  <option value="color">Color</option>
                  <option value="size">Size</option>
                  <option value="spacing">Spacing</option>
                  <option value="other">Other</option>
                </select>
                {variable.type === 'color' ? (
                  <input
                    type="color"
                    value={variable.value}
                    onChange={(e) => updateVariable(index, 'value', e.target.value)}
                    className="w-16 h-10"
                  />
                ) : (
                  <input
                    type="text"
                    value={variable.value}
                    onChange={(e) => updateVariable(index, 'value', e.target.value)}
                    className="input flex-1"
                    placeholder="value"
                  />
                )}
                <button
                  onClick={() => removeVariable(index)}
                  className="btn-ghost btn-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addVariable}
              className="btn-secondary w-full btn-sm flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Variable
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Palette size={20} />
            Preview
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div className="space-y-3">
              {variables.filter(v => v.type === 'color').map((v, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg border"
                    style={{
                      backgroundColor: v.value,
                      borderColor: 'var(--border-primary)'
                    }}
                  />
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {v.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {v.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Generated CSS
        </h3>
        <div className="p-4 rounded-xl border" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>
          <pre className="text-sm overflow-x-auto" style={{ color: 'var(--text-primary)' }}>
            <code>{css}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

