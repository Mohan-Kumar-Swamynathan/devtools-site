import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Download, RotateCw } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import { useToast } from '@/hooks/useToast';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function PdfPageRotator() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotation, setRotation] = useState(90);
  const [rotateMode, setRotateMode] = useState<'all' | 'range' | 'custom'>('all');
  const [pageRange, setPageRange] = useState('1-');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
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

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPageCount(pdfDoc.getPageCount());
    } catch (e) {
      setError('Failed to load PDF');
      setPdf(null);
    }
  }, []);

  const parsePageRange = useCallback((range: string): number[] => {
    const pages: number[] = [];
    const parts = range.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(s => parseInt(s.trim()));
        const startPage = start || 1;
        const endPage = end || pageCount;
        for (let i = startPage; i <= endPage && i <= pageCount; i++) {
          if (i >= 1) pages.push(i);
        }
      } else {
        const page = parseInt(trimmed);
        if (page >= 1 && page <= pageCount) pages.push(page);
      }
    }

    return [...new Set(pages)].sort((a, b) => a - b);
  }, [pageCount]);

  const handleRotate = useCallback(async () => {
    if (!pdf) {
      setError('Please select a PDF file');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const arrayBuffer = await pdf.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      let pagesToRotate: number[] = [];

      if (rotateMode === 'all') {
        pagesToRotate = Array.from({ length: pageCount }, (_, i) => i);
      } else if (rotateMode === 'range') {
        pagesToRotate = parsePageRange(pageRange).map(p => p - 1);
        if (pagesToRotate.length === 0) {
          setError('Invalid page range');
          return;
        }
      } else {
        pagesToRotate = selectedPages.map(p => p - 1);
        if (pagesToRotate.length === 0) {
          setError('Please select at least one page');
          return;
        }
      }

      pagesToRotate.forEach(pageIndex => {
        const page = pdfDoc.getPage(pageIndex);
        page.setRotation(degrees(rotation));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdf.name.replace('.pdf', '-rotated.pdf');
      link.click();
      URL.revokeObjectURL(url);

      showToast('PDF rotated successfully!', 'success');
    } catch (e) {
      setError(`Failed to rotate PDF: ${(e as Error).message}`);
      showToast('Failed to rotate PDF', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [pdf, rotateMode, pageRange, selectedPages, rotation, pageCount, parsePageRange, showToast]);

  const togglePage = useCallback((page: number) => {
    setSelectedPages(prev =>
      prev.includes(page)
        ? prev.filter(p => p !== page)
        : [...prev, page].sort((a, b) => a - b)
    );
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
          <Upload size={18} />
          Select PDF
        </button>
        {pdf && (
          <button
            onClick={handleRotate}
            disabled={isProcessing}
            className="btn-primary flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" />
                Rotating...
              </>
            ) : (
              <>
                <RotateCw size={18} />
                Rotate PDF
              </>
            )}
          </button>
        )}
        {pdf && (
          <button
            onClick={() => {
              setPdf(null);
              setPageCount(0);
              setSelectedPages([]);
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
              <label className="label">Rotation Angle</label>
              <select
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="input w-full"
              >
                <option value="90">90° (Clockwise)</option>
                <option value="180">180° (Upside Down)</option>
                <option value="270">270° (Counter-clockwise)</option>
                <option value="-90">-90° (Counter-clockwise)</option>
              </select>
            </div>
            <div>
              <label className="label">Pages to Rotate</label>
              <select
                value={rotateMode}
                onChange={(e) => setRotateMode(e.target.value as typeof rotateMode)}
                className="input w-full"
              >
                <option value="all">All Pages</option>
                <option value="range">Page Range</option>
                <option value="custom">Select Pages</option>
              </select>
            </div>
          </div>

          {rotateMode === 'range' && (
            <div>
              <label className="label">Page Range (e.g., 1-5, 10-20, or 1,3,5)</label>
              <input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                className="input w-full"
                placeholder="1-5 or 1,3,5"
              />
            </div>
          )}

          {rotateMode === 'custom' && (
            <div>
              <label className="label">Select Pages</label>
              <div className="grid grid-cols-10 gap-2 max-h-64 overflow-y-auto custom-scrollbar p-2 border rounded-lg" style={{ borderColor: 'var(--border-primary)' }}>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => togglePage(page)}
                    className={`p-2 rounded text-sm font-medium transition-all ${
                      selectedPages.includes(page)
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              {selectedPages.length > 0 && (
                <div className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  Selected: {selectedPages.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

