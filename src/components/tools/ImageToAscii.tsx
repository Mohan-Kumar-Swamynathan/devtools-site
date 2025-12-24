import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Copy, Trash2 } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const ASCII_CHARS = '@%#*+=-:. ';
const ASCII_CHARS_DENSE = '@#$%&?*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ';

export default function ImageToAscii() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [asciiArt, setAsciiArt] = useState<string>('');
  const [density, setDensity] = useState(50);
  const [useColor, setUseColor] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToAscii = useCallback((img: HTMLImageElement): string => {
    const canvas = document.createElement('canvas');
    const width = Math.floor(img.width * (density / 100));
    const height = Math.floor(img.height * (density / 100) * 0.5);
    
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const chars = density > 30 ? ASCII_CHARS_DENSE : ASCII_CHARS;
    let result = '';

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const brightness = (r + g + b) / 3;
        const charIndex = Math.floor((brightness / 255) * (chars.length - 1));

        if (useColor) {
          const color = `rgb(${r},${g},${b})`;
          result += `<span style="color: ${color}">${chars[charIndex]}</span>`;
        } else {
          result += chars[charIndex];
        }
      }
      result += '\n';
    }

    return result;
  }, [density, useColor]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError('');
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        const ascii = convertToAscii(img);
        setAsciiArt(ascii);
        setIsProcessing(false);
      };
      img.onerror = () => {
        setError('Failed to load image');
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  }, [convertToAscii]);

  const handleCopy = useCallback(() => {
    const text = asciiArt.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy', 'error');
    });
  }, [asciiArt, showToast]);

  const handleDownload = useCallback(() => {
    const text = asciiArt.replace(/<[^>]*>/g, '');
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ascii-art.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  }, [asciiArt]);

  const handleReset = useCallback(() => {
    setImage(null);
    setAsciiArt('');
    setDensity(50);
    setUseColor(false);
    setError('');
  }, []);

  useEffect(() => {
    if (image) {
      const ascii = convertToAscii(image);
      setAsciiArt(ascii);
    }
  }, [image, density, useColor, convertToAscii]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="btn-primary flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <LoadingSpinner size="sm" />
              Processing...
            </>
          ) : (
            <>
              <Upload size={18} />
              Select Image
            </>
          )}
        </button>
        {asciiArt && (
          <>
            <button
              onClick={handleCopy}
              className="btn-secondary flex items-center gap-2"
            >
              <Copy size={18} />
              Copy Text
            </button>
            <button
              onClick={handleDownload}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={handleReset}
              className="btn-ghost flex items-center gap-2"
            >
              <Trash2 size={18} />
              Reset
            </button>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

{/* Controls moved to header */}



















































      {image && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Original Image
            </h3>
            <div className="p-4 rounded-xl border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <img
                src={image.src}
                alt="Original"
                className="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              ASCII Art
            </h3>
            <div className="p-4 rounded-xl border overflow-auto" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              maxHeight: '500px',
              fontFamily: 'monospace',
              fontSize: '8px',
              lineHeight: '1'
            }}>
              {useColor ? (
                <pre dangerouslySetInnerHTML={{ __html: asciiArt }} />
              ) : (
                <pre style={{ color: 'var(--text-primary)' }}>{asciiArt}</pre>
              )}
            </div>
          </div>
        </div>
      )}

      {image && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Density: {density}%</label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={density}
                onChange={(e) => setDensity(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Higher = more detailed but larger output
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useColor}
                onChange={(e) => setUseColor(e.target.checked)}
                className="checkbox"
              />
              <span style={{ color: 'var(--text-primary)' }}>Use Color (HTML output)</span>
            </label>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl border text-sm" style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)'
      }}>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Tips:
        </h3>
        <ul className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <li>• Adjust density to balance detail and file size</li>
          <li>• Use color mode for HTML output with colors</li>
          <li>• Copy as plain text for use in code or documents</li>
          <li>• Higher contrast images produce better results</li>
        </ul>
      </div>
    </ToolShell>
  );
}

