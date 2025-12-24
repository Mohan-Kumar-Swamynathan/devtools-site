import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Trash2, Play } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
// @ts-ignore
import GIF from 'gif.js';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface ImageFrame {
  image: HTMLImageElement;
  index: number;
}

export default function GifCreator() {
  const [images, setImages] = useState<ImageFrame[]>([]);
  const [gifUrl, setGifUrl] = useState<string>('');
  const [frameDelay, setFrameDelay] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError('');
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      setError('Please select image files');
      return;
    }

    const loadPromises = imageFiles.map((file, index) => {
      return new Promise<ImageFrame>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => resolve({ image: img, index });
          img.onerror = () => reject(new Error(`Failed to load ${file.name}`));
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(loadPromises)
      .then(loadedImages => {
        setImages(loadedImages.sort((a, b) => a.index - b.index));
      })
      .catch(e => {
        setError(`Error loading images: ${(e as Error).message}`);
      });
  }, []);

  const createGif = useCallback(async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setError('');

    try {
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: images[0].image.width,
        height: images[0].image.height,
      });

      images.forEach((frame) => {
        const canvas = document.createElement('canvas');
        canvas.width = frame.image.width;
        canvas.height = frame.image.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(frame.image, 0, 0);
          gif.addFrame(canvas, { delay: frameDelay });
        }
      });

      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setGifUrl(url);
        setIsProcessing(false);
      });

      gif.on('progress', (p: number) => {
        if (p === 1) {
          setIsProcessing(false);
        }
      });

      gif.render();
    } catch (e) {
      setError(`GIF creation error: ${(e as Error).message}`);
      setIsProcessing(false);
    }
  }, [images, frameDelay]);

  const handleDownload = useCallback(() => {
    if (!gifUrl) return;
    const link = document.createElement('a');
    link.href = gifUrl;
    link.download = 'created-gif.gif';
    link.click();
  }, [gifUrl]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, index: i })));
  }, []);

  const handleReset = useCallback(() => {
    setImages([]);
    setGifUrl('');
    setError('');
  }, []);

  useEffect(() => {
    if (images.length > 0 && !gifUrl) {
      createGif();
    }
  }, [images, frameDelay]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={18} />
          Select Images
        </button>
        {gifUrl && (
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Download GIF
          </button>
        )}
        {images.length > 0 && (
          <button
            onClick={handleReset}
            className="btn-ghost flex items-center gap-2"
          >
            <Trash2 size={18} />
            Clear
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
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





































      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {images.map((frame, index) => (
              <div key={index} className="relative group">
                <img
                  src={frame.image.src}
                  alt={`Frame ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                  style={{ borderColor: 'var(--border-primary)' }}
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            GIF Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Frame Delay: {frameDelay}ms</label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={frameDelay}
                onChange={(e) => setFrameDelay(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Lower = faster animation
              </p>
            </div>
            <button
              onClick={createGif}
              disabled={isProcessing}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" />
                  Creating GIF...
                </>
              ) : (
                <>
                  <Play size={18} />
                  Create GIF
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {gifUrl && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Created GIF
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <img
              src={gifUrl}
              alt="Created GIF"
              className="w-full max-w-md mx-auto rounded-lg"
            />
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
          <li>• Upload multiple images to create an animated GIF</li>
          <li>• Adjust frame delay to control animation speed</li>
          <li>• Images are processed in the order they were uploaded</li>
          <li>• All images will be resized to match the first image</li>
        </ul>
      </div>
    </ToolShell>
  );
}

