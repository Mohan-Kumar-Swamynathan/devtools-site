import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Download, X } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

export default function PdfPageDeleter() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [deleteMode, setDeleteMode] = useState<'range' | 'custom'>('custom');
  const [pageRange, setPageRange] = useState('');
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

  const handleDelete = useCallback(async () => {
    if (!pdf) {
      setError('Please select a PDF file');
      return;
    }

    let pagesToDelete: number[] = [];

    if (deleteMode === 'range') {
      if (!pageRange.trim()) {
        setError('Please enter a page range');
        return;
      }
      pagesToDelete = parsePageRange(pageRange);
      if (pagesToDelete.length === 0) {
        setError('Invalid page range');
        return;
      }
    } else {
      if (selectedPages.length === 0) {
        setError('Please select at least one page to delete');
        return;
      }
      pagesToDelete = selectedPages;
    }

    if (pagesToDelete.length >= pageCount) {
      setError('Cannot delete all pages');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const arrayBuffer = await pdf.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pagesToKeep = Array.from({ length: pageCount }, (_, i) => i + 1)
        .filter(page => !pagesToDelete.includes(page));

      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdfDoc, pagesToKeep.map(p => p - 1));
      pages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdf.name.replace('.pdf', '-pages-removed.pdf');
      link.click();
      URL.revokeObjectURL(url);

      showToast(`Deleted ${pagesToDelete.length} page(s) successfully!`, 'success');
    } catch (e) {
      setError(`Failed to delete pages: ${(e as Error).message}`);
      showToast('Failed to delete pages', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [pdf, deleteMode, pageRange, selectedPages, pageCount, parsePageRange, showToast]);

  const togglePage = useCallback((page: number) => {
    setSelectedPages(prev =>
      prev.includes(page)
        ? prev.filter(p => p !== page)
        : [...prev, page].sort((a, b) => a - b)
    );
  }, []);

  
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
            onClick={handleDelete}
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
                <Trash2 size={18} />
                Delete Pages
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
              setPageRange('');
            }}
            className="btn-ghost flex items-center gap-2"
          >
            <X size={18} />
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

          <div>
            <label className="label">Delete Mode</label>
            <select
              value={deleteMode}
              onChange={(e) => setDeleteMode(e.target.value as typeof deleteMode)}
              className="input w-full"
            >
              <option value="range">Page Range</option>
              <option value="custom">Select Pages</option>
            </select>
          </div>

          {deleteMode === 'range' && (
            <div>
              <label className="label">Pages to Delete (e.g., 1-5, 10-20, or 1,3,5)</label>
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

          {deleteMode === 'custom' && (
            <div>
              <label className="label">Select Pages to Delete</label>
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
                  Selected to delete: {selectedPages.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}

