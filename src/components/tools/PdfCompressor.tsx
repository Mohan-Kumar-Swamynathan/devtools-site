import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Download, Minimize2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function PdfCompressor() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
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

    setError('');
    setPdf(file);
    setOriginalSize(file.size);
    setCompressedSize(0);
  }, []);

  const handleCompress = useCallback(async () => {
    if (!pdf) {
      setError('Please select a PDF file');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const arrayBuffer = await pdf.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Re-save the PDF which can reduce size by removing unused objects
      // Note: This is a basic compression. For better compression, you'd need
      // to remove images, compress images, etc., which is more complex
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
      });

      // Try to compress further by removing metadata and optimizing
      const optimizedPdf = await PDFDocument.create();
      const pages = await optimizedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach(page => optimizedPdf.addPage(page));

      const compressedBytes = await optimizedPdf.save({
        useObjectStreams: false,
        addDefaultPage: false,
      });

      setCompressedSize(compressedBytes.length);

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdf.name.replace('.pdf', '-compressed.pdf');
      link.click();
      URL.revokeObjectURL(url);

      const savings = ((1 - compressedBytes.length / originalSize) * 100).toFixed(1);
      showToast(`Compressed! Size reduced by ${savings}%`, 'success');
    } catch (e) {
      setError(`Failed to compress PDF: ${(e as Error).message}`);
      showToast('Failed to compress PDF', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [pdf, originalSize, showToast]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) 

  return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const savings = originalSize > 0 && compressedSize > 0
    ? ((1 - compressedSize / originalSize) * 100).toFixed(1)
    : '0';

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
            onClick={handleCompress}
            disabled={isProcessing}
            className="btn-primary flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" />
                Compressing...
              </>
            ) : (
              <>
                <Minimize2 size={18} />
                Compress PDF
              </>
            )}
          </button>
        )}
        {pdf && (
          <button
            onClick={() => {
              setPdf(null);
              setOriginalSize(0);
              setCompressedSize(0);
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
              Original Size: {formatSize(originalSize)}
            </div>
          </div>

          {compressedSize > 0 && (
            <div className="p-6 rounded-xl border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Compression Results
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Original Size
                  </div>
                  <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {formatSize(originalSize)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Compressed Size
                  </div>
                  <div className="text-lg font-semibold" style={{ color: 'var(--status-success)' }}>
                    {formatSize(compressedSize)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Savings
                  </div>
                  <div className="text-lg font-semibold" style={{ color: 'var(--status-success)' }}>
                    {savings}%
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              <strong>Note:</strong> This tool performs basic PDF compression by optimizing the PDF structure. 
              For better compression, consider using specialized tools that can compress images within the PDF.
            </div>
          </div>
        </div>
      )}
    </ToolShell>
  );
}

