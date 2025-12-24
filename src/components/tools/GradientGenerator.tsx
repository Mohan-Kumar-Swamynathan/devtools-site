import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function GradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#8b5cf6');
  const [stop1, setStop1] = useState(0);
  const [stop2, setStop2] = useState(100);

  const getCss = useCallback(() => {
    if (type === 'linear') {
      return `background: linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%);`;
    } else {
      return `background: radial-gradient(circle, ${color1} ${stop1}%, ${color2} ${stop2}%);`;
    }
  }, [type, angle, color1, color2, stop1, stop2]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">Gradient Type</label>
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="input-base">
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
      </div>

      {type === 'linear' && (
        <div>
          <label className="label">Angle: {angle}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Color 1</label>
          <input
            type="color"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            className="w-full h-10 rounded border cursor-pointer"
            style={{ borderColor: 'var(--border-primary)' }}
          />
          <input
            type="text"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            className="input-base font-mono mt-2"
          />
          <div className="mt-2">
            <label className="label-inline">Stop: {stop1}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={stop1}
              onChange={(e) => setStop1(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <label className="label">Color 2</label>
          <input
            type="color"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            className="w-full h-10 rounded border cursor-pointer"
            style={{ borderColor: 'var(--border-primary)' }}
          />
          <input
            type="text"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            className="input-base font-mono mt-2"
          />
          <div className="mt-2">
            <label className="label-inline">Stop: {stop2}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={stop2}
              onChange={(e) => setStop2(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="p-16 rounded-xl border" style={{ 
        borderColor: 'var(--border-primary)',
        background: type === 'linear' 
          ? `linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%)`
          : `radial-gradient(circle, ${color1} ${stop1}%, ${color2} ${stop2}%)`
      }}>
        <div className="text-center">
          <div className="text-lg font-medium" style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Preview</div>
        </div>
      </div>

      <OutputPanel
        value={getCss()}
        label="CSS Code"
        language="css"
      />
    </ToolShell>
  );
}

