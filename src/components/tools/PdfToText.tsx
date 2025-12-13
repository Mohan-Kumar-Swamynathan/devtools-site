import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Trash2, Copy, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

let pdfjsLib: any = null;

// Dynamically import pdfjs-dist only on client-side
if (typeof window !== 'undefined') {
  import('pdfjs-dist').then((module) => {
    pdfjsLib = module;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  });
}

export default function PdfToText() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    // Ensure pdfjs-dist is loaded
    if (typeof window !== 'undefined' && !pdfjsLib) {
      import('pdfjs-dist').then((module) => {
        pdfjsLib = module;
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      });
    }
  }, []);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    if (!pdfjsLib) {
      setError('PDF library is loading, please wait...');
      // Try to load it
      const module = await import('pdfjs-dist');
      pdfjsLib = module;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }

    setError('');
    setPdf(file);
    setIsProcessing(true);
    setText('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += `\n--- Page ${i} ---\n${pageText}\n`;
      }

      setText(fullText.trim());
      showToast('Text extracted successfully!', 'success');
    } catch (e) {
      setError(`Failed to extract text: ${(e as Error).message}`);
      showToast('Failed to extract text', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [showToast]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [text, showToast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = pdf ? pdf.name.replace('.pdf', '.txt') : 'extracted-text.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  }, [text, pdf]);

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
              Extracting...
            </>
          ) : (
            <>
              <Upload size={18} />
              Select PDF
            </>
          )}
        </button>
        {text && (
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
          </>
        )}
        {pdf && (
          <button
            onClick={() => {
              setPdf(null);
              setText('');
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

      {pdf && !text && !isProcessing && (
        <div className="p-4 rounded-xl border text-center" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)'
        }}>
          <FileText size={48} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
          <div style={{ color: 'var(--text-primary)' }}>{pdf.name}</div>
        </div>
      )}

      {text && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Extracted Text
          </h3>
          <textarea
            value={text}
            readOnly
            className="input w-full h-96 font-mono text-sm"
            placeholder="Extracted text will appear here..."
          />
        </div>
      )}
    </div>
  );
}

