import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function FlexboxPlayground() {
  const [direction, setDirection] = useState<'row' | 'column'>('row');
  const [justify, setJustify] = useState<'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'>('flex-start');
  const [align, setAlign] = useState<'flex-start' | 'center' | 'flex-end' | 'stretch'>('flex-start');
  const [wrap, setWrap] = useState(false);
  const [gap, setGap] = useState(8);

  const getCss = useCallback(() => {
    return `.container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap ? 'wrap' : 'nowrap'};
  gap: ${gap}px;
}`;
  }, [direction, justify, align, wrap, gap]);

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Flex Direction</label>
          <select value={direction} onChange={(e) => setDirection(e.target.value as any)} className="input-base">
            <option value="row">Row</option>
            <option value="column">Column</option>
          </select>
        </div>
        <div>
          <label className="label">Justify Content</label>
          <select value={justify} onChange={(e) => setJustify(e.target.value as any)} className="input-base">
            <option value="flex-start">Flex Start</option>
            <option value="center">Center</option>
            <option value="flex-end">Flex End</option>
            <option value="space-between">Space Between</option>
            <option value="space-around">Space Around</option>
          </select>
        </div>
        <div>
          <label className="label">Align Items</label>
          <select value={align} onChange={(e) => setAlign(e.target.value as any)} className="input-base">
            <option value="flex-start">Flex Start</option>
            <option value="center">Center</option>
            <option value="flex-end">Flex End</option>
            <option value="stretch">Stretch</option>
          </select>
        </div>
        <div>
          <label className="label">Gap: {gap}px</label>
          <input
            type="range"
            min="0"
            max="40"
            value={gap}
            onChange={(e) => setGap(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={wrap}
            onChange={(e) => setWrap(e.target.checked)}
            className="checkbox"
          />
          <span>Flex Wrap</span>
        </label>
      </div>

      <div className="p-8 rounded-xl border" style={{ 
        borderColor: 'var(--border-primary)',
        display: 'flex',
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        gap: `${gap}px`,
        minHeight: '200px',
        backgroundColor: 'var(--bg-tertiary)'
      }}>
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="p-4 rounded-lg text-center font-medium"
            style={{ 
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              minWidth: '80px',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Item {i}
          </div>
        ))}
      </div>

      <OutputPanel
        value={getCss()}
        label="CSS Code"
        language="css"
        showLineNumbers
      />
    </ToolShell>
  );
}

