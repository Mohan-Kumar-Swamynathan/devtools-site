import { useState, useRef, useCallback } from 'react';
import { Upload, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import JSZip from 'jszip';

interface ExtractedFrame {
  dataUrl: string;
  index: number;
  blob: Blob;
}

export default function GifFrameExtractor() {
  const [frames, setFrames] = useState<ExtractedFrame[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractFrames = useCallback(async (file: File) => {
    return new Promise<ExtractedFrame[]>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const bytes = new Uint8Array(arrayBuffer);
          
          const extractedFrames: ExtractedFrame[] = [];
          let i = 0;
          
          while (i < bytes.length - 10) {
            if (bytes[i] === 0x21 && bytes[i + 1] === 0xF9) {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              if (!ctx) continue;
              
              const img = new Image();
              const blob = new Blob([bytes], { type: 'image/gif' });
              const url = URL.createObjectURL(blob);
              
              img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((frameBlob) => {
                  if (frameBlob) {
                    const dataUrl = canvas.toDataURL('image/png');
                    extractedFrames.push({
                      dataUrl,
                      index: extractedFrames.length,
                      blob: frameBlob,
                    });
                  }
                }, 'image/png');
              };
              
              img.src = url;
              i += 2;
            } else {
              i++;
            }
          }
          
          if (extractedFrames.length === 0) {
            const img = new Image();
            const blob = new Blob([bytes], { type: 'image/gif' });
            const url = URL.createObjectURL(blob);
            
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((frameBlob) => {
                  if (frameBlob) {
                    const dataUrl = canvas.toDataURL('image/png');
                    extractedFrames.push({
                      dataUrl,
                      index: 0,
                      blob: frameBlob,
                    });
                    resolve(extractedFrames);
                  } else {
                    reject(new Error('Failed to extract frames'));
                  }
                }, 'image/png');
              } else {
                reject(new Error('Could not get canvas context'));
              }
              URL.revokeObjectURL(url);
            };
            
            img.onerror = () => reject(new Error('Failed to load GIF'));
            img.src = url;
          } else {
            setTimeout(() => resolve(extractedFrames), 1000);
          }
        } catch (e) {
          reject(e);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'image/gif') {
      setError('Please select a GIF file');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const extracted = await extractFrames(file);
      setFrames(extracted);
    } catch (e) {
      setError(`Extraction error: ${(e as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [extractFrames]);

  const handleDownloadFrame = useCallback((frame: ExtractedFrame) => {
    const link = document.createElement('a');
    link.href = frame.dataUrl;
    link.download = `frame-${frame.index + 1}.png`;
    link.click();
  }, []);

  const handleDownloadAll = useCallback(async () => {
    if (frames.length === 0) return;

    setIsProcessing(true);
    try {
      const zip = new JSZip();
      
      frames.forEach((frame, index) => {
        zip.file(`frame-${index + 1}.png`, frame.blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'gif-frames.zip';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      setError(`Download error: ${(e as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [frames]);

  const handleReset = useCallback(() => {
    setFrames([]);
    setError('');
  }, []);

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="flex flex-wrap items-center gap-3">
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
              Select GIF
            </>
          )}
        </button>
        {frames.length > 0 && (
          <>
            <button
              onClick={handleDownloadAll}
              disabled={isProcessing}
              className="btn-secondary flex items-center gap-2"
            >
              <Download size={18} />
              Download All ({frames.length})
            </button>
            <button
              onClick={handleReset}
              className="btn-ghost flex items-center gap-2"
            >
              <Trash2 size={18} />
              Clear
            </button>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/gif"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {frames.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Extracted Frames ({frames.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {frames.map((frame) => (
              <div
                key={frame.index}
                className="p-3 rounded-xl border animate-fade-in-scale"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)'
                }}
              >
                <img
                  src={frame.dataUrl}
                  alt={`Frame ${frame.index + 1}`}
                  className="w-full h-32 object-contain rounded-lg mb-2 bg-gray-100 dark:bg-gray-800"
                />
                <div className="text-xs text-center mb-2" style={{ color: 'var(--text-muted)' }}>
                  Frame {frame.index + 1}
                </div>
                <button
                  onClick={() => handleDownloadFrame(frame)}
                  className="btn-primary w-full btn-sm"
                >
                  <Download size={14} className="mr-1" />
                  Download
                </button>
              </div>
            ))}
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
          <li>• Upload an animated GIF to extract all frames</li>
          <li>• Download individual frames or all frames as a ZIP</li>
          <li>• Frames are extracted as PNG images</li>
          <li>• Large GIFs may take longer to process</li>
        </ul>
      </div>
    </div>
  );
}

