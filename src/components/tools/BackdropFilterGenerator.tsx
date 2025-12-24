import { useState, useCallback } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function BackdropFilterGenerator() {
  const [blur, setBlur] = useState(10);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [opacity, setOpacity] = useState(100);
  const { showToast } = useToast();

  const generateCSS = useCallback(() => {
    const filters = [];
    if (blur > 0) filters.push(`blur(${blur}px)`);
    if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
    if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
    if (saturate !== 100) filters.push(`saturate(${saturate}%)`);
    if (opacity !== 100) filters.push(`opacity(${opacity}%)`);
    
    return filters.length > 0 
      ? `backdrop-filter: ${filters.join(' ')};`
      : 'backdrop-filter: none;';
  }, [blur, brightness, contrast, saturate, opacity]);

  const handleCopy = useCallback(() => {
    const css = generateCSS();
    navigator.clipboard.writeText(css).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [generateCSS, showToast]);

  const css = generateCSS();
  const filterValue = css.replace('backdrop-filter: ', '').replace(';', '');

  
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
            setBlur(10);
            setBrightness(100);
            setContrast(100);
            setSaturate(100);
            setOpacity(100);
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
          <div className="p-8 rounded-xl border relative overflow-hidden" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            minHeight: '400px'
          }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="p-8 rounded-xl border-2 border-white/20 text-white text-center"
                style={{
                  backdropFilter: filterValue || 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <h3 className="text-2xl font-bold mb-2">Glass Morphism</h3>
                <p className="text-sm opacity-90">Backdrop Filter Effect</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Filter Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Blur: {blur}px</label>
              <input
                type="range"
                min="0"
                max="50"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Brightness: {brightness}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Contrast: {contrast}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Saturate: {saturate}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturate}
                onChange={(e) => setSaturate(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Opacity: {opacity}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full"
              />
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

