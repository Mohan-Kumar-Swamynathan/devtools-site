import { useState, useCallback } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function CssTransformGenerator() {
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const { showToast } = useToast();

  const generateCSS = useCallback(() => {
    const transforms = [];
    if (translateX !== 0 || translateY !== 0) {
      transforms.push(`translate(${translateX}px, ${translateY}px)`);
    }
    if (scaleX !== 1 || scaleY !== 1) {
      transforms.push(`scale(${scaleX}, ${scaleY})`);
    }
    if (rotate !== 0) {
      transforms.push(`rotate(${rotate}deg)`);
    }
    if (skewX !== 0 || skewY !== 0) {
      transforms.push(`skew(${skewX}deg, ${skewY}deg)`);
    }
    return `transform: ${transforms.join(' ') || 'none'};`;
  }, [translateX, translateY, scaleX, scaleY, rotate, skewX, skewY]);

  const handleCopy = useCallback(() => {
    const css = generateCSS();
    navigator.clipboard.writeText(css).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [generateCSS, showToast]);

  const css = generateCSS();
  const transformValue = css.replace('transform: ', '').replace(';', '');

  
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
            setTranslateX(0);
            setTranslateY(0);
            setScaleX(1);
            setScaleY(1);
            setRotate(0);
            setSkewX(0);
            setSkewY(0);
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
            Transform Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Translate X: {translateX}px</label>
              <input
                type="range"
                min="-200"
                max="200"
                value={translateX}
                onChange={(e) => setTranslateX(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Translate Y: {translateY}px</label>
              <input
                type="range"
                min="-200"
                max="200"
                value={translateY}
                onChange={(e) => setTranslateY(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Scale X: {scaleX.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={scaleX}
                onChange={(e) => setScaleX(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Scale Y: {scaleY.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={scaleY}
                onChange={(e) => setScaleY(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Rotate: {rotate}°</label>
              <input
                type="range"
                min="-360"
                max="360"
                value={rotate}
                onChange={(e) => setRotate(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Skew X: {skewX}°</label>
              <input
                type="range"
                min="-45"
                max="45"
                value={skewX}
                onChange={(e) => setSkewX(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Skew Y: {skewY}°</label>
              <input
                type="range"
                min="-45"
                max="45"
                value={skewY}
                onChange={(e) => setSkewY(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
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
            <div
              className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-bold"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                transform: transformValue || 'none'
              }}
            >
              Box
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

