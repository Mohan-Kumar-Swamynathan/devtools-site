import { useState, useCallback } from 'react';
import { Image, Download } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function Base64ToImage() {
  const [base64, setBase64] = useState('');
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const convert = useCallback(() => {
    setError('');
    setImageUrl('');

    if (!base64.trim()) {
      return;
    }

    try {
      // Remove data URL prefix if present
      let base64Data = base64.trim();
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }

      // Validate base64
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
        setError('Invalid base64 string.');
        return;
      }

      const imageUrl = `data:image/png;base64,${base64Data}`;
      setImageUrl(imageUrl);

      // Test if it's actually an image
      const img = new window.Image();
      img.onerror = () => {
        setError('The base64 string does not represent a valid image.');
        setImageUrl('');
      };
      img.onload = () => {
        setError('');
      };
      img.src = imageUrl;
    } catch (err) {
      setError('Error decoding base64 image.');
      setImageUrl('');
    }
  }, [base64]);

  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'decoded-image.png';
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
            <Image size={20} />
            Base64 String
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Base64 Encoded Image</label>
              <textarea
                value={base64}
                onChange={(e) => setBase64(e.target.value)}
                className="input w-full font-mono text-xs"
                rows={12}
                placeholder="data:image/png;base64,iVBORw0KGgoAAAANS..."
                onBlur={convert}
              />
              <button
                onClick={convert}
                className="btn btn-primary w-full mt-2"
              >
                Decode Image
              </button>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Paste base64 encoded image string. Data URL prefix is optional.
              </div>
            </div>
            {error && (
              <div className="p-3 rounded-lg text-sm" style={{
                backgroundColor: 'var(--status-error)',
                color: 'white'
              }}>
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Decoded Image
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            {imageUrl ? (
              <>
                <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border-primary)' }}>
                  <img
                    src={imageUrl}
                    alt="Decoded"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Image
                </button>
              </>
            ) : (
              <div className="p-8 rounded-lg border text-center" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-muted)'
              }}>
                Decoded image will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

