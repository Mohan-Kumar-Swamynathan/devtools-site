import { useState, useEffect, useRef } from 'react';
import { Barcode, Download } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function BarcodeGenerator() {
  const [text, setText] = useState('123456789012');
  const [format, setFormat] = useState<'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39'>('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && text) {
      try {
        JsBarcode(canvasRef.current, text, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
        });
      } catch (error) {
        console.error('Barcode generation error:', error);
      }
    }
  }, [text, format, width, height, displayValue]);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `barcode-${format.toLowerCase()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Barcode size={20} />
            Barcode Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Text/Number</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input w-full"
                placeholder="123456789012"
              />
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Enter the data to encode in the barcode
              </div>
            </div>
            <div>
              <label className="label">Barcode Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="input w-full"
              >
                <option value="CODE128">CODE128 (Alphanumeric)</option>
                <option value="EAN13">EAN13 (13 digits)</option>
                <option value="EAN8">EAN8 (8 digits)</option>
                <option value="UPC">UPC (12 digits)</option>
                <option value="CODE39">CODE39 (Alphanumeric)</option>
              </select>
            </div>
            <div>
              <label className="label">Width: {width}</label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Height: {height}px</label>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={displayValue}
                onChange={(e) => setDisplayValue(e.target.checked)}
                className="checkbox"
              />
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                Display text below barcode
              </span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Generated Barcode
            </h3>
            <button
              onClick={handleDownload}
              className="btn btn-primary flex items-center gap-2"
            >
              <Download size={16} />
              Download
            </button>
          </div>
          <div className="p-6 rounded-xl border flex items-center justify-center" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            {text ? (
              <canvas ref={canvasRef} />
            ) : (
              <div className="text-center" style={{ color: 'var(--text-muted)' }}>
                Enter text to generate barcode
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

