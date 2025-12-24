import { useState, useCallback } from 'react';
import { Copy, RotateCcw, Plus, Trash2 } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface Point {
  x: number;
  y: number;
}

export default function ClipPathGenerator() {
  const [points, setPoints] = useState<Point[]>([
    { x: 50, y: 0 },
    { x: 100, y: 50 },
    { x: 50, y: 100 },
    { x: 0, y: 50 },
  ]);
  const [shape, setShape] = useState<'polygon' | 'circle' | 'ellipse' | 'inset'>('polygon');
  const { showToast } = useToast();

  const generateCSS = useCallback(() => {
    if (shape === 'polygon') {
      const pointsStr = points.map(p => `${p.x}% ${p.y}%`).join(', ');
      return `clip-path: polygon(${pointsStr});`;
    } else if (shape === 'circle') {
      return `clip-path: circle(50% at 50% 50%);`;
    } else if (shape === 'ellipse') {
      return `clip-path: ellipse(50% 30% at 50% 50%);`;
    } else {
      return `clip-path: inset(10% 20% 30% 40%);`;
    }
  }, [points, shape]);

  const handleCopy = useCallback(() => {
    const css = generateCSS();
    navigator.clipboard.writeText(css).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [generateCSS, showToast]);

  const addPoint = useCallback(() => {
    setPoints(prev => [...prev, { x: 50, y: 50 }]);
  }, []);

  const removePoint = useCallback((index: number) => {
    if (points.length > 3) {
      setPoints(prev => prev.filter((_, i) => i !== index));
    }
  }, [points.length]);

  const updatePoint = useCallback((index: number, field: 'x' | 'y', value: number) => {
    setPoints(prev => prev.map((p, i) => 
      i === index ? { ...p, [field]: Math.max(0, Math.min(100, value)) } : p
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
          onClick={() => {
            setPoints([
              { x: 50, y: 0 },
              { x: 100, y: 50 },
              { x: 50, y: 100 },
              { x: 0, y: 50 },
            ]);
            setShape('polygon');
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
            Preview
          </h3>
          <div className="p-8 rounded-xl border flex items-center justify-center" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            minHeight: '400px'
          }}>
            <div
              className="w-64 h-64 rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                clipPath: shape === 'polygon' 
                  ? `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`
                  : shape === 'circle'
                  ? 'circle(50% at 50% 50%)'
                  : shape === 'ellipse'
                  ? 'ellipse(50% 30% at 50% 50%)'
                  : 'inset(10% 20% 30% 40%)'
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Shape Type</label>
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value as typeof shape)}
                className="input w-full"
              >
                <option value="polygon">Polygon</option>
                <option value="circle">Circle</option>
                <option value="ellipse">Ellipse</option>
                <option value="inset">Inset</option>
              </select>
            </div>

            {shape === 'polygon' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label">Polygon Points</label>
                    <button
                      onClick={addPoint}
                      className="btn-secondary btn-sm flex items-center gap-1"
                    >
                      <Plus size={14} />
                      Add Point
                    </button>
                  </div>
                  <div className="space-y-2">
                    {points.map((point, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm w-8" style={{ color: 'var(--text-muted)' }}>
                          {index + 1}
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={point.x}
                          onChange={(e) => updatePoint(index, 'x', parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={point.y}
                          onChange={(e) => updatePoint(index, 'y', parseInt(e.target.value))}
                          className="flex-1"
                        />
                        {points.length > 3 && (
                          <button
                            onClick={() => removePoint(index)}
                            className="btn-ghost btn-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
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

