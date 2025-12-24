import { useState, useCallback } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function TextShadowGenerator() {
  const [shadows, setShadows] = useState([
    { x: 2, y: 2, blur: 4, color: '#000000', opacity: 0.3 }
  ]);
  const { showToast } = useToast();

  const generateCSS = useCallback(() => {
    const shadowValues = shadows.map(s => 
      `${s.x}px ${s.y}px ${s.blur}px rgba(${hexToRgb(s.color)}, ${s.opacity})`
    ).join(', ');
    return `text-shadow: ${shadowValues};`;
  }, [shadows]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '0, 0, 0';
  };

  const handleCopy = useCallback(() => {
    const css = generateCSS();
    navigator.clipboard.writeText(css).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [generateCSS, showToast]);

  const addShadow = useCallback(() => {
    setShadows(prev => [...prev, { x: 0, y: 0, blur: 0, color: '#000000', opacity: 0.5 }]);
  }, []);

  const removeShadow = useCallback((index: number) => {
    setShadows(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateShadow = useCallback((index: number, field: string, value: number | string) => {
    setShadows(prev => prev.map((s, i) => 
      i === index ? { ...s, [field]: value } : s
    ));
  }, []);

  const css = generateCSS();

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          className="btn-primary flex items-center gap-2"
        >
          <Copy size={18} />
          Copy CSS
        </button>
        <button
          onClick={() => setShadows([{ x: 2, y: 2, blur: 4, color: '#000000', opacity: 0.3 }])}
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
            Text Shadow Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            {shadows.map((shadow, index) => (
              <div key={index} className="p-3 rounded-lg border space-y-3" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)'
              }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Shadow {index + 1}
                  </span>
                  {shadows.length > 1 && (
                    <button
                      onClick={() => removeShadow(index)}
                      className="btn-ghost btn-sm"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div>
                  <label className="label">X Offset: {shadow.x}px</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.x}
                    onChange={(e) => updateShadow(index, 'x', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="label">Y Offset: {shadow.y}px</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={shadow.y}
                    onChange={(e) => updateShadow(index, 'y', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="label">Blur: {shadow.blur}px</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={shadow.blur}
                    onChange={(e) => updateShadow(index, 'blur', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="label">Color</label>
                  <input
                    type="color"
                    value={shadow.color}
                    onChange={(e) => updateShadow(index, 'color', e.target.value)}
                    className="w-full h-10"
                  />
                </div>
                <div>
                  <label className="label">Opacity: {Math.round(shadow.opacity * 100)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={shadow.opacity}
                    onChange={(e) => updateShadow(index, 'opacity', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addShadow}
              className="btn-secondary w-full"
            >
              + Add Shadow
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Preview
          </h3>
          <div className="p-8 rounded-xl border flex items-center justify-center" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            minHeight: '300px'
          }}>
            <h1
              className="text-6xl font-bold"
              style={{
                color: 'var(--text-primary)',
                textShadow: shadows.map(s => 
                  `${s.x}px ${s.y}px ${s.blur}px rgba(${hexToRgb(s.color)}, ${s.opacity})`
                ).join(', ')
              }}
            >
              Text Shadow
            </h1>
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
    </ToolShell>
  );
}

