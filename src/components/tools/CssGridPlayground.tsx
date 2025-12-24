import { useState, useCallback } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function CssGridPlayground() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(10);
  const [justifyItems, setJustifyItems] = useState('stretch');
  const [alignItems, setAlignItems] = useState('stretch');
  const { showToast } = useToast();

  const generateCSS = useCallback(() => {
    return `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(${columns}, 1fr);\n  grid-template-rows: repeat(${rows}, 1fr);\n  gap: ${gap}px;\n  justify-items: ${justifyItems};\n  align-items: ${alignItems};\n}`;
  }, [columns, rows, gap, justifyItems, alignItems]);

  const handleCopy = useCallback(() => {
    const css = generateCSS();
    navigator.clipboard.writeText(css).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [generateCSS, showToast]);

  const css = generateCSS();
  const totalItems = columns * rows;

  
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
            setColumns(3);
            setRows(3);
            setGap(10);
            setJustifyItems('stretch');
            setAlignItems('stretch');
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
            Grid Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Columns: {columns}</label>
              <input
                type="range"
                min="1"
                max="12"
                value={columns}
                onChange={(e) => setColumns(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Rows: {rows}</label>
              <input
                type="range"
                min="1"
                max="12"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Gap: {gap}px</label>
              <input
                type="range"
                min="0"
                max="50"
                value={gap}
                onChange={(e) => setGap(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Justify Items</label>
              <select
                value={justifyItems}
                onChange={(e) => setJustifyItems(e.target.value)}
                className="input w-full"
              >
                <option value="stretch">Stretch</option>
                <option value="start">Start</option>
                <option value="end">End</option>
                <option value="center">Center</option>
              </select>
            </div>
            <div>
              <label className="label">Align Items</label>
              <select
                value={alignItems}
                onChange={(e) => setAlignItems(e.target.value)}
                className="input w-full"
              >
                <option value="stretch">Stretch</option>
                <option value="start">Start</option>
                <option value="end">End</option>
                <option value="center">Center</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Preview
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div
              className="w-full"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: `${gap}px`,
                justifyItems,
                alignItems,
                minHeight: '300px'
              }}
            >
              {Array.from({ length: totalItems }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{
                    background: `linear-gradient(135deg, hsl(${(i * 360) / totalItems}, 70%, 60%) 0%, hsl(${((i * 360) / totalItems) + 30}, 70%, 50%) 100%)`
                  }}
                >
                  {i + 1}
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
    </ToolShell>
  );
}

