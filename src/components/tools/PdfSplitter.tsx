import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Download, Scissors } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useToast } from '@/hooks/useToast';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function PdfSplitter() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitMode, setSplitMode] = useState<'all' | 'range' | 'custom'>('all');
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

  const handleSplit = useCallback(async () => {
    if (!pdf) {
      setError('Please select a PDF file');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const arrayBuffer = await pdf.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);

      let pagesToExtract: number[] = [];

      if (splitMode === 'all') {
        // Split each page into separate PDF
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(sourcePdf, [i]);
          newPdf.addPage(page);
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `page-${i + 1}.pdf`;
          link.click();
          URL.revokeObjectURL(url);
        }
        showToast(`Split into ${pageCount} PDFs!`, 'success');
      } else if (splitMode === 'range') {
        pagesToExtract = parsePageRange(pageRange);
        if (pagesToExtract.length === 0) {
          setError('Invalid page range');
          return;
        }

        const newPdf = await PDFDocument.create();
        const pages = await newPdf.copyPages(sourcePdf, pagesToExtract.map(p => p - 1));
        pages.forEach(page => newPdf.addPage(page));
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pages-${pagesToExtract[0]}-${pagesToExtract[pagesToExtract.length - 1]}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
        showToast('PDF split successfully!', 'success');
      } else {
        // Custom - selected pages
        if (selectedPages.length === 0) {
          setError('Please select at least one page');
          return;
        }

        const newPdf = await PDFDocument.create();
        const pages = await newPdf.copyPages(sourcePdf, selectedPages.map(p => p - 1));
        pages.forEach(page => newPdf.addPage(page));
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pages-${selectedPages.join('-')}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
        showToast('PDF split successfully!', 'success');
      }
    } catch (e) {
      setError(`Failed to split PDF: ${(e as Error).message}`);
      showToast('Failed to split PDF', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [pdf, splitMode, pageRange, selectedPages, pageCount, parsePageRange, showToast]);

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
            onClick={handleSplit}
            disabled={isProcessing}
            className="btn-primary flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" />
                Splitting...
              </>
            ) : (
              <>
                <Scissors size={18} />
                Split PDF
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

          <div>
            <label className="label">Split Mode</label>
            <select
              value={splitMode}
              onChange={(e) => setSplitMode(e.target.value as typeof splitMode)}
              className="input w-full"
            >
              <option value="all">Split all pages (one PDF per page)</option>
              <option value="range">Extract page range</option>
              <option value="custom">Select specific pages</option>
            </select>
          </div>

          {splitMode === 'range' && (
            <div>
              <label className="label">Page Range (e.g., 1-5, 10-20, or 1,3,5)</label>
              <input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                className="input w-full"
                placeholder="1-5 or 1,3,5"
              />
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Examples: "1-5" (pages 1 to 5), "10-" (page 10 to end), "1,3,5" (pages 1, 3, and 5)
              </div>
            </div>
          )}

          {splitMode === 'custom' && (
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

