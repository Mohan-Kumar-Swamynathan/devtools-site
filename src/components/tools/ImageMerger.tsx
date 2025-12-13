import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Trash2, Grid3x3, LayoutList, Columns } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

type Layout = 'horizontal' | 'vertical' | 'grid';

interface MergedImage {
  dataUrl: string;
  file: File;
}

export default function ImageMerger() {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [mergedImage, setMergedImage] = useState<MergedImage | null>(null);
  const [layout, setLayout] = useState<Layout>('horizontal');
  const [spacing, setSpacing] = useState(10);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mergeImages = useCallback(async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setError('');

    try {
      let canvas: HTMLCanvasElement;
      const ctx = document.createElement('canvas').getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      if (layout === 'horizontal') {
        const totalWidth = images.reduce((sum, img) => sum + img.width, 0) + spacing * (images.length - 1);
        const maxHeight = Math.max(...images.map(img => img.height));
        canvas = document.createElement('canvas');
        canvas.width = totalWidth;
        canvas.height = maxHeight;
        const canvasCtx = canvas.getContext('2d')!;
        canvasCtx.fillStyle = backgroundColor;
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        let x = 0;
        images.forEach((img) => {
          canvasCtx.drawImage(img, x, (maxHeight - img.height) / 2);
          x += img.width + spacing;
        });
      } else if (layout === 'vertical') {
        const maxWidth = Math.max(...images.map(img => img.width));
        const totalHeight = images.reduce((sum, img) => sum + img.height, 0) + spacing * (images.length - 1);
        canvas = document.createElement('canvas');
        canvas.width = maxWidth;
        canvas.height = totalHeight;
        const canvasCtx = canvas.getContext('2d')!;
        canvasCtx.fillStyle = backgroundColor;
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        let y = 0;
        images.forEach((img) => {
          canvasCtx.drawImage(img, (maxWidth - img.width) / 2, y);
          y += img.height + spacing;
        });
      } else {
        const cols = Math.ceil(Math.sqrt(images.length));
        const rows = Math.ceil(images.length / cols);
        const maxWidth = Math.max(...images.map(img => img.width));
        const maxHeight = Math.max(...images.map(img => img.height));
        canvas = document.createElement('canvas');
        canvas.width = maxWidth * cols + spacing * (cols - 1);
        canvas.height = maxHeight * rows + spacing * (rows - 1);
        const canvasCtx = canvas.getContext('2d')!;
        canvasCtx.fillStyle = backgroundColor;
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        images.forEach((img, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const x = col * (maxWidth + spacing);
          const y = row * (maxHeight + spacing);
          canvasCtx.drawImage(img, x + (maxWidth - img.width) / 2, y + (maxHeight - img.height) / 2);
        });
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          setError('Failed to merge images');
          setIsProcessing(false);
          return;
        }

        const dataUrl = canvas.toDataURL('image/png');
        setMergedImage({
          dataUrl,
          file: new File([blob], 'merged-image.png', { type: 'image/png' }),
        });
        setIsProcessing(false);
      }, 'image/png');
    } catch (e) {
      setError(`Merge error: ${(e as Error).message}`);
      setIsProcessing(false);
    }
  }, [images, layout, spacing, backgroundColor]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError('');
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      setError('Please select image files');
      return;
    }

    const loadPromises = imageFiles.map(file => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load ${file.name}`));
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(loadPromises)
      .then(loadedImages => {
        setImages(prev => [...prev, ...loadedImages]);
      })
      .catch(e => {
        setError(`Error loading images: ${(e as Error).message}`);
      });
  }, []);

  const handleDownload = useCallback(() => {
    if (!mergedImage) return;
    const link = document.createElement('a');
    link.href = mergedImage.dataUrl;
    link.download = mergedImage.file.name;
    link.click();
  }, [mergedImage]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const reorderImage = useCallback((fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const newImages = [...prev];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      return newImages;
    });
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      mergeImages();
    }
  }, [images, layout, spacing, backgroundColor, mergeImages]);

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={18} />
          Select Images
        </button>
        {mergedImage && (
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Download Merged Image
          </button>
        )}
        {images.length > 0 && (
          <button
            onClick={() => setImages([])}
            className="btn-ghost flex items-center gap-2"
          >
            <Trash2 size={18} />
            Clear All
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

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative group"
              >
                <img
                  src={img.src}
                  alt={`Image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                  style={{ borderColor: 'var(--border-primary)' }}
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={12} />
                </button>
                <div className="text-xs text-center mt-1" style={{ color: 'var(--text-muted)' }}>
                  {img.width} × {img.height}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Merge Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Layout</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setLayout('horizontal')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    layout === 'horizontal' ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  <LayoutList size={18} />
                  Horizontal
                </button>
                <button
                  onClick={() => setLayout('vertical')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    layout === 'vertical' ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  <Columns size={18} />
                  Vertical
                </button>
                <button
                  onClick={() => setLayout('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    layout === 'grid' ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  <Grid3x3 size={18} />
                  Grid
                </button>
              </div>
            </div>
            <div>
              <label className="label">Spacing: {spacing}px</label>
              <input
                type="range"
                min="0"
                max="50"
                value={spacing}
                onChange={(e) => setSpacing(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Background Color</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </div>
      )}

      {mergedImage && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Merged Image
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            {isProcessing ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              <img
                src={mergedImage.dataUrl}
                alt="Merged"
                className="w-full rounded-lg"
              />
            )}
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
          <li>• Horizontal: Images side by side</li>
          <li>• Vertical: Images stacked vertically</li>
          <li>• Grid: Images arranged in a grid layout</li>
          <li>• Adjust spacing to control gaps between images</li>
          <li>• Set background color for areas not covered by images</li>
        </ul>
      </div>
    </div>
  );
}

