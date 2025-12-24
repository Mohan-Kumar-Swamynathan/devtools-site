import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Trash2, Download, Image as ImageIcon } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

let pdfjsLib: any = null;

// Dynamically import pdfjs-dist only on client-side
if (typeof window !== 'undefined') {
  import('pdfjs-dist').then((module) => {
    pdfjsLib = module;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  });
}

export default function PdfToImages() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState(0.9);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    if (!pdfjsLib) {
      // Try to load it
      const module = await import('pdfjs-dist');
      pdfjsLib = module;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    setError('');
    setPdf(file);
    setImages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
    } catch (e) {
      setError('Failed to load PDF');
      setPdf(null);
    }
  }, []);

  useEffect(() => {
    // Ensure pdfjs-dist is loaded
    if (typeof window !== 'undefined' && !pdfjsLib) {
      import('pdfjs-dist').then((module) => {
        pdfjsLib = module;
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      });
    }
  }, []);

  const convertToImages = useCallback(async () => {
    if (!pdf) return;

    if (!pdfjsLib) {
      setError('PDF library is loading, please wait...');
      // Try to load it
      const module = await import('pdfjs-dist');
      pdfjsLib = module;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    setError('');
    setIsProcessing(true);
    setImages([]);

    try {
      const arrayBuffer = await pdf.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const imageUrls: string[] = [];

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const dataUrl = canvas.toDataURL(`image/${format}`, quality);
        imageUrls.push(dataUrl);
      }

      setImages(imageUrls);
      showToast(`Converted ${imageUrls.length} pages to images!`, 'success');
    } catch (e) {
      setError(`Failed to convert PDF: ${(e as Error).message}`);
      showToast('Failed to convert PDF', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [pdf, format, quality, showToast]);

  const downloadImage = useCallback((dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${pdf?.name.replace('.pdf', '') || 'page'}-${index + 1}.${format}`;
    link.click();
  }, [pdf, format]);

  const downloadAll = useCallback(() => {
    images.forEach((dataUrl, index) => {
      setTimeout(() => downloadImage(dataUrl, index), index * 100);
    });
  }, [images, downloadImage]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={18} />
          Select PDF
        </button>
        {pdf && (
          <button
            onClick={convertToImages}
            disabled={isProcessing}
            className="btn-primary flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" />
                Converting...
              </>
            ) : (
              <>
                <ImageIcon size={18} />
                Convert to Images
              </>
            )}
          </button>
        )}
        {images.length > 0 && (
          <button
            onClick={downloadAll}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Download All
          </button>
        )}
        {pdf && (
          <button
            onClick={() => {
              setPdf(null);
              setPageCount(0);
              setImages([]);
            }}
            className="btn-ghost flex items-center gap-2"
          >
            <Trash2 size={18} />
            Clear
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

{/* Controls moved to header */}


























































      {pdf && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {pdf.name}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {pageCount} {pageCount === 1 ? 'page' : 'pages'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Image Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
                className="input w-full"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>
            {format === 'jpeg' && (
              <div>
                <label className="label">Quality: {Math.round(quality * 100)}%</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Converted Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((dataUrl, index) => (
              <div
                key={index}
                className="relative group rounded-xl border overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)'
                }}
              >
                <img
                  src={dataUrl}
                  alt={`Page ${index + 1}`}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => downloadImage(dataUrl, index)}
                    className="btn-primary btn-sm"
                  >
                    <Download size={16} />
                  </button>
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                  Page {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  );
}

