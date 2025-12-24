import { useState, useCallback, useRef } from 'react';
import { Download } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';
import type { QRCode } from 'qrcode-generator';

export default function QrGenerator() {
  const [text, setText] = useState('');
  const [qrSvg, setQrSvg] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(() => {
    if (!text) {
      setQrSvg('');
      return;
    }

    try {
      // Dynamic import for qrcode-generator
      import('qrcode-generator').then((qrcode) => {
        const qr = qrcode.default(0, 'M');
        qr.addData(text);
        qr.make();
        
        const svg = qr.createSvgTag({ cellSize: 8, margin: 4 });
        setQrSvg(svg);
      });
    } catch (e) {
      setQrSvg(`Error: ${(e as Error).message}`);
    }
  }, [text]);

  const download = useCallback(() => {
    if (!canvasRef.current || !qrSvg) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'qrcode.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(qrSvg);
  }, [qrSvg]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button onClick={generate} disabled={!text} className="btn-primary">
          Generate QR Code
        </button>
        {qrSvg && (
          <button onClick={download} className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            Download PNG
          </button>
        )}
        <button onClick={() => { setText(''); setQrSvg(''); }} className="btn-ghost">
          Clear
        </button>
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">Text or URL</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL to generate QR code"
          className="input-base min-h-[100px]"
          onBlur={generate}
        />
      </div>

{/* Controls moved to header */}














      {qrSvg && (
        <div className="flex justify-center p-6 rounded-xl border" style={{ borderColor: 'var(--border-primary)' }}>
          <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </ToolShell>
  );
}

