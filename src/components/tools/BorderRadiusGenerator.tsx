import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function BorderRadiusGenerator() {
  const [topLeft, setTopLeft] = useState(8);
  const [topRight, setTopRight] = useState(8);
  const [bottomRight, setBottomRight] = useState(8);
  const [bottomLeft, setBottomLeft] = useState(8);
  const [uniform, setUniform] = useState(true);

  const getCss = useCallback(() => {
    if (uniform) {
      return `border-radius: ${topLeft}px;`;
    }
    return `border-radius: ${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px;`;
  }, [topLeft, topRight, bottomRight, bottomLeft, uniform]);

  const updateUniform = useCallback((value: number) => {
    setTopLeft(value);
    setTopRight(value);
    setBottomRight(value);
    setBottomLeft(value);
  }, []);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={uniform}
            onChange={(e) => setUniform(e.target.checked)}
            className="checkbox"
          />
          <span>Uniform radius</span>
        </label>
      </div>

      {uniform ? (
        <div>
          <label className="label">Radius: {topLeft}px</label>
          <input
            type="range"
            min="0"
            max="100"
            value={topLeft}
            onChange={(e) => updateUniform(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Top Left: {topLeft}px</label>
            <input
              type="range"
              min="0"
              max="100"
              value={topLeft}
              onChange={(e) => setTopLeft(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="label">Top Right: {topRight}px</label>
            <input
              type="range"
              min="0"
              max="100"
              value={topRight}
              onChange={(e) => setTopRight(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="label">Bottom Right: {bottomRight}px</label>
            <input
              type="range"
              min="0"
              max="100"
              value={bottomRight}
              onChange={(e) => setBottomRight(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="label">Bottom Left: {bottomLeft}px</label>
            <input
              type="range"
              min="0"
              max="100"
              value={bottomLeft}
              onChange={(e) => setBottomLeft(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      <div className="p-8 rounded-xl border flex items-center justify-center" style={{ 
        borderColor: 'var(--border-primary)',
        borderRadius: uniform ? `${topLeft}px` : `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`,
        backgroundColor: 'var(--bg-tertiary)'
      }}>
        <div className="text-center">
          <div className="text-lg font-medium">Preview</div>
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

