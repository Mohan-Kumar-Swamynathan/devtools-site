import { useState, useCallback } from 'react';
import { Palette } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function RgbToHex() {
  const [r, setR] = useState(59);
  const [g, setG] = useState(130);
  const [b, setB] = useState(246);
  const [a, setA] = useState(1);

  const convert = useCallback(() => {
    const rVal = Math.max(0, Math.min(255, parseInt(String(r)) || 0));
    const gVal = Math.max(0, Math.min(255, parseInt(String(g)) || 0));
    const bVal = Math.max(0, Math.min(255, parseInt(String(b)) || 0));
    const aVal = Math.max(0, Math.min(1, parseFloat(String(a)) || 1));

    const hex = `#${rVal.toString(16).padStart(2, '0')}${gVal.toString(16).padStart(2, '0')}${bVal.toString(16).padStart(2, '0')}`;
    const hexWithAlpha = aVal < 1 
      ? `${hex}${Math.round(aVal * 255).toString(16).padStart(2, '0')}`
      : hex;

    return {
      hex,
      hexWithAlpha,
      rgb: `rgb(${rVal}, ${gVal}, ${bVal})`,
      rgba: `rgba(${rVal}, ${gVal}, ${bVal}, ${aVal})`,
    };
  }, [r, g, b, a]);

  const result = convert();
  const color = result.rgba;

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Palette size={20} />
            RGB Values
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Red (0-255)</label>
              <input
                type="range"
                min="0"
                max="255"
                value={r}
                onChange={(e) => setR(parseInt(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                value={r}
                onChange={(e) => setR(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
                className="input w-full mt-2"
                min="0"
                max="255"
              />
            </div>
            <div>
              <label className="label">Green (0-255)</label>
              <input
                type="range"
                min="0"
                max="255"
                value={g}
                onChange={(e) => setG(parseInt(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                value={g}
                onChange={(e) => setG(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
                className="input w-full mt-2"
                min="0"
                max="255"
              />
            </div>
            <div>
              <label className="label">Blue (0-255)</label>
              <input
                type="range"
                min="0"
                max="255"
                value={b}
                onChange={(e) => setB(parseInt(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                value={b}
                onChange={(e) => setB(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
                className="input w-full mt-2"
                min="0"
                max="255"
              />
            </div>
            <div>
              <label className="label">Alpha (0-1)</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={a}
                onChange={(e) => setA(parseFloat(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                value={a}
                onChange={(e) => setA(Math.max(0, Math.min(1, parseFloat(e.target.value) || 1)))}
                className="input w-full mt-2"
                min="0"
                max="1"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Converted Values
          </h3>
          <div className="p-6 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div className="p-4 rounded-lg border" style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Hex Color
              </div>
              <div className="font-mono text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
                {result.hex}
              </div>
              {a < 1 && (
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  With Alpha: {result.hexWithAlpha}
                </div>
              )}
            </div>
            <div
              className="w-full h-32 rounded-lg border"
              style={{
                backgroundColor: color,
                borderColor: 'var(--border-primary)'
              }}
            />
            <div className="p-4 rounded-lg border space-y-2" style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                CSS Values
              </div>
              <div className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                {result.rgb}
              </div>
              <div className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                {result.rgba}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

