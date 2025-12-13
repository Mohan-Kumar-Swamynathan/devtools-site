import { useState, useRef, useCallback } from 'react';
import { Upload, Download, X } from 'lucide-react';

export default function ImageResizer() {
  const [imageUrl, setImageUrl] = useState('');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [resizedUrl, setResizedUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    const img = new Image();
    img.onload = () => {
      if (maintainAspect) {
        const aspect = img.width / img.height;
        setWidth(Math.round(height * aspect));
      }
      resize();
    };
    img.src = url;
  };

  const resize = useCallback(() => {
    if (!canvasRef.current || !imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          setResizedUrl(URL.createObjectURL(blob));
        }
      }, 'image/png');
    };
    img.src = imageUrl;
  }, [imageUrl, width, height]);

  const download = useCallback(() => {
    if (!resizedUrl) return;
    const link = document.createElement('a');
    link.href = resizedUrl;
    link.download = 'resized-image.png';
    link.click();
  }, [resizedUrl]);

  const clear = () => {
    setImageUrl('');
    setResizedUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Upload Image</label>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary flex items-center gap-2"
          >
            <Upload size={18} />
            Choose Image
          </button>
        </div>
      </div>

      {imageUrl && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => {
                  const w = parseInt(e.target.value) || 0;
                  setWidth(w);
                  if (maintainAspect && imageUrl) {
                    const img = new Image();
                    img.onload = () => {
                      const aspect = img.width / img.height;
                      setHeight(Math.round(w / aspect));
                    };
                    img.src = imageUrl;
                  }
                }}
                className="input-base"
              />
            </div>
            <div>
              <label className="label">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => {
                  const h = parseInt(e.target.value) || 0;
                  setHeight(h);
                  if (maintainAspect && imageUrl) {
                    const img = new Image();
                    img.onload = () => {
                      const aspect = img.width / img.height;
                      setWidth(Math.round(h * aspect));
                    };
                    img.src = imageUrl;
                  }
                }}
                className="input-base"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={maintainAspect}
              onChange={(e) => setMaintainAspect(e.target.checked)}
              className="checkbox"
            />
            <span>Maintain aspect ratio</span>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={resize} className="btn-primary">
              Resize Image
            </button>
            {resizedUrl && (
              <button onClick={download} className="btn-secondary flex items-center gap-2">
                <Download size={18} />
                Download
              </button>
            )}
            <button onClick={clear} className="btn-ghost">
              <X size={18} />
              Clear
            </button>
          </div>

          {resizedUrl && (
            <div>
              <label className="label">Resized Image</label>
              <div className="rounded-xl border p-4 flex justify-center" style={{ borderColor: 'var(--border-primary)' }}>
                <img src={resizedUrl} alt="Resized" className="max-w-full max-h-96 rounded-lg" />
              </div>
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

