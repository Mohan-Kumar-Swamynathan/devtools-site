import { useState, useCallback } from 'react';
import { Copy, Play, RotateCcw } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function CssAnimationGenerator() {
  const [animationName, setAnimationName] = useState('fadeIn');
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [iterationCount, setIterationCount] = useState(1);
  const [direction, setDirection] = useState('normal');
  const [timingFunction, setTimingFunction] = useState('ease');
  const [fillMode, setFillMode] = useState('forwards');
  const [keyframes, setKeyframes] = useState([
    { percent: 0, properties: 'opacity: 0; transform: translateY(-20px);' },
    { percent: 100, properties: 'opacity: 1; transform: translateY(0);' },
  ]);
  const { showToast } = useToast();

  const generateCSS = useCallback(() => {
    const keyframesCSS = keyframes
      .map(kf => `  ${kf.percent}% {\n    ${kf.properties}\n  }`)
      .join('\n');

    const animationCSS = `@keyframes ${animationName} {\n${keyframesCSS}\n}\n\n.element {\n  animation: ${animationName} ${duration}s ${timingFunction} ${delay}s ${iterationCount} ${direction} ${fillMode};\n}`;

    return animationCSS;
  }, [animationName, duration, delay, iterationCount, direction, timingFunction, fillMode, keyframes]);

  const handleCopy = useCallback(() => {
    const css = generateCSS();
    navigator.clipboard.writeText(css).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [generateCSS, showToast]);

  const addKeyframe = useCallback(() => {
    setKeyframes(prev => [...prev, { percent: 50, properties: 'opacity: 0.5;' }]);
  }, []);

  const removeKeyframe = useCallback((index: number) => {
    setKeyframes(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateKeyframe = useCallback((index: number, field: 'percent' | 'properties', value: string | number) => {
    setKeyframes(prev => prev.map((kf, i) => 
      i === index ? { ...kf, [field]: value } : kf
    ));
  }, []);

  const presetAnimations = [
    { name: 'fadeIn', keyframes: [
      { percent: 0, properties: 'opacity: 0;' },
      { percent: 100, properties: 'opacity: 1;' }
    ]},
    { name: 'slideIn', keyframes: [
      { percent: 0, properties: 'transform: translateX(-100%);' },
      { percent: 100, properties: 'transform: translateX(0);' }
    ]},
    { name: 'bounce', keyframes: [
      { percent: 0, properties: 'transform: translateY(0);' },
      { percent: 50, properties: 'transform: translateY(-30px);' },
      { percent: 100, properties: 'transform: translateY(0);' }
    ]},
    { name: 'rotate', keyframes: [
      { percent: 0, properties: 'transform: rotate(0deg);' },
      { percent: 100, properties: 'transform: rotate(360deg);' }
    ]},
  ];

  const loadPreset = useCallback((preset: typeof presetAnimations[0]) => {
    setAnimationName(preset.name);
    setKeyframes(preset.keyframes);
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
            setAnimationName('fadeIn');
            setDuration(1);
            setDelay(0);
            setIterationCount(1);
            setDirection('normal');
            setTimingFunction('ease');
            setFillMode('forwards');
            setKeyframes([
              { percent: 0, properties: 'opacity: 0; transform: translateY(-20px);' },
              { percent: 100, properties: 'opacity: 1; transform: translateY(0);' },
            ]);
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
            Animation Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Animation Name</label>
              <input
                type="text"
                value={animationName}
                onChange={(e) => setAnimationName(e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="label">Duration: {duration}s</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Delay: {delay}s</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={delay}
                onChange={(e) => setDelay(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Iteration Count</label>
              <input
                type="number"
                min="1"
                max="100"
                value={iterationCount}
                onChange={(e) => setIterationCount(parseInt(e.target.value) || 1)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="label">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="input w-full"
              >
                <option value="normal">Normal</option>
                <option value="reverse">Reverse</option>
                <option value="alternate">Alternate</option>
                <option value="alternate-reverse">Alternate Reverse</option>
              </select>
            </div>
            <div>
              <label className="label">Timing Function</label>
              <select
                value={timingFunction}
                onChange={(e) => setTimingFunction(e.target.value)}
                className="input w-full"
              >
                <option value="ease">Ease</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
                <option value="linear">Linear</option>
                <option value="cubic-bezier(0.68, -0.55, 0.265, 1.55)">Bounce</option>
              </select>
            </div>
            <div>
              <label className="label">Fill Mode</label>
              <select
                value={fillMode}
                onChange={(e) => setFillMode(e.target.value)}
                className="input w-full"
              >
                <option value="none">None</option>
                <option value="forwards">Forwards</option>
                <option value="backwards">Backwards</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Keyframes
          </h3>
          <div className="p-4 rounded-xl border space-y-3" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            {keyframes.map((kf, index) => (
              <div key={index} className="flex gap-2 items-start">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={kf.percent}
                  onChange={(e) => updateKeyframe(index, 'percent', parseInt(e.target.value) || 0)}
                  className="input w-20"
                />
                <span className="py-2">%</span>
                <input
                  type="text"
                  value={kf.properties}
                  onChange={(e) => updateKeyframe(index, 'properties', e.target.value)}
                  className="input flex-1"
                  placeholder="opacity: 0; transform: scale(0.5);"
                />
                {keyframes.length > 1 && (
                  <button
                    onClick={() => removeKeyframe(index)}
                    className="btn-ghost btn-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addKeyframe}
              className="btn-secondary w-full btn-sm"
            >
              + Add Keyframe
            </button>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Presets
            </h4>
            <div className="flex flex-wrap gap-2">
              {presetAnimations.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => loadPreset(preset)}
                  className="btn-secondary btn-sm"
                >
                  {preset.name}
                </button>
              ))}
            </div>
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
            className="w-32 h-32 mx-auto rounded-lg flex items-center justify-center text-white font-bold"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              animation: `${animationName} ${duration}s ${timingFunction} ${delay}s ${iterationCount} ${direction} ${fillMode}`,
            }}
          >
            <Play size={32} />
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

