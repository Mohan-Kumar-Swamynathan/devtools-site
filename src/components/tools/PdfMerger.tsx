import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Download, Merge, X } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

interface PdfFile {
  file: File;
  name: string;
  pages: number;
}

export default function PdfMerger() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError('');
    const newPdfs: PdfFile[] = [];

    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf') {
        setError(`File "${file.name}" is not a PDF`);
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        newPdfs.push({
          file,
          name: file.name,
          pages: pdfDoc.getPageCount(),
        });
      } catch (e) {
        setError(`Failed to load PDF: ${file.name}`);
      }
    }

    setPdfs(prev => [...prev, ...newPdfs]);
  }, []);

  const handleMerge = useCallback(async () => {
    if (pdfs.length < 2) {
      setError('Please select at least 2 PDF files');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdf of pdfs) {
        const arrayBuffer = await pdf.file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      link.click();
      URL.revokeObjectURL(url);

      showToast('PDFs merged successfully!', 'success');
    } catch (e) {
      setError(`Failed to merge PDFs: ${(e as Error).message}`);
      showToast('Failed to merge PDFs', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [pdfs, showToast]);

  const removePdf = useCallback((index: number) => {
    setPdfs(prev => prev.filter((_, i) => i !== index));
  }, []);

  const movePdf = useCallback((index: number, direction: 'up' | 'down') => {
    setPdfs(prev => {
      const newPdfs = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= newPdfs.length) return prev;
      [newPdfs[index], newPdfs[newIndex]] = [newPdfs[newIndex], newPdfs[index]];
      return newPdfs;
    });
  }, []);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={18} />
          Add PDFs
        </button>
        <button
          onClick={handleMerge}
          disabled={pdfs.length < 2 || isProcessing}
          className="btn-primary flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <LoadingSpinner size="sm" />
              Merging...
            </>
          ) : (
            <>
              <Merge size={18} />
              Merge PDFs
            </>
          )}
        </button>
        {pdfs.length > 0 && (
          <button
            onClick={() => setPdfs([])}
            className="btn-ghost flex items-center gap-2"
          >
            <Trash2 size={18} />
            Clear All
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

{/* Controls moved to header */}












































      {pdfs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            PDF Files ({pdfs.length})
          </h3>
          <div className="space-y-2">
            {pdfs.map((pdf, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border flex items-center justify-between"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)'
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">📄</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {pdf.name}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {pdf.pages} {pdf.pages === 1 ? 'page' : 'pages'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => movePdf(index, 'up')}
                    disabled={index === 0}
                    className="btn-icon btn-sm"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => movePdf(index, 'down')}
                    disabled={index === pdfs.length - 1}
                    className="btn-icon btn-sm"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removePdf(index)}
                    className="btn-icon btn-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  );
}

