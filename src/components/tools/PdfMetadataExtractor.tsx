import { useState, useRef, useCallback } from 'react';
import { Upload, Trash2, Info } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ErrorMessage from '@/components/common/ErrorMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function PdfMetadataExtractor() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    setError('');
    setPdf(file);
    setIsLoading(true);
    setMetadata(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const info = pdfDoc.getSubject() || {};
      const meta = {
        title: pdfDoc.getTitle() || 'N/A',
        author: pdfDoc.getAuthor() || 'N/A',
        subject: pdfDoc.getSubject() || 'N/A',
        creator: pdfDoc.getCreator() || 'N/A',
        producer: pdfDoc.getProducer() || 'N/A',
        creationDate: pdfDoc.getCreationDate()?.toString() || 'N/A',
        modificationDate: pdfDoc.getModificationDate()?.toString() || 'N/A',
        pageCount: pdfDoc.getPageCount(),
        fileSize: file.size,
        fileName: file.name,
      };

      setMetadata(meta);
    } catch (e) {
      setError(`Failed to extract metadata: ${(e as Error).message}`);
      setPdf(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="btn-primary flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Loading...
            </>
          ) : (
            <>
              <Upload size={18} />
              Select PDF
            </>
          )}
        </button>
        {pdf && (
          <button
            onClick={() => {
              setPdf(null);
              setMetadata(null);
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

      {pdf && metadata && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Info size={20} />
              PDF Information
            </h3>
            <div className="p-4 rounded-xl border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {metadata.fileName}
              </div>
              <div className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
                <div>File Size: {formatSize(metadata.fileSize)}</div>
                <div>Pages: {metadata.pageCount}</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Metadata
            </h3>
            <div className="p-4 rounded-xl border space-y-3" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Title
                </div>
                <div className="text-base" style={{ color: 'var(--text-primary)' }}>
                  {metadata.title}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Author
                </div>
                <div className="text-base" style={{ color: 'var(--text-primary)' }}>
                  {metadata.author}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Subject
                </div>
                <div className="text-base" style={{ color: 'var(--text-primary)' }}>
                  {metadata.subject}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Creator
                </div>
                <div className="text-base" style={{ color: 'var(--text-primary)' }}>
                  {metadata.creator}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Producer
                </div>
                <div className="text-base" style={{ color: 'var(--text-primary)' }}>
                  {metadata.producer}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Creation Date
                </div>
                <div className="text-base" style={{ color: 'var(--text-primary)' }}>
                  {metadata.creationDate}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Modification Date
                </div>
                <div className="text-base" style={{ color: 'var(--text-primary)' }}>
                  {metadata.modificationDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

