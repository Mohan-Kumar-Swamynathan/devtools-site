import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import OutputPanel from '@/components/common/OutputPanel';

export default function ImageMetadataExtractor() {
  const [metadata, setMetadata] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setImageUrl(URL.createObjectURL(file));
    
    const meta: any = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    };

    // Try to extract EXIF if available (simplified - full EXIF requires library)
    const img = new Image();
    img.onload = () => {
      meta.width = img.width;
      meta.height = img.height;
      setMetadata(meta);
    };
    img.src = URL.createObjectURL(file);
  };

  const clear = () => {
    setMetadata(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="label">Upload Image</label>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary flex items-center gap-2"
          >
            <Upload size={18} />
            Choose Image
          </button>
        </div>
      </div>

      {imageUrl && (
        <div>
          <label className="label">Preview</label>
          <div className="rounded-xl border p-4 flex justify-center" style={{ borderColor: 'var(--border-primary)' }}>
            <img src={imageUrl} alt="Preview" className="max-w-full max-h-64 rounded-lg" />
          </div>
        </div>
      )}

      {metadata && (
        <>
          <div className="flex items-center gap-3">
            <button onClick={clear} className="btn-ghost">
              <X size={18} />
              Clear
            </button>
          </div>
          <OutputPanel
            value={JSON.stringify(metadata, null, 2)}
            label="Image Metadata"
            language="json"
            showLineNumbers
          />
        </>
      )}
    </div>
  );
}

