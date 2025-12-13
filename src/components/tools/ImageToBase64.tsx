import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import OutputPanel from '@/components/common/OutputPanel';

export default function ImageToBase64() {
  const [base64, setBase64] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setBase64(result);
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setBase64('');
    setImageUrl('');
    setFileName('');
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
          {fileName && (
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {fileName}
            </span>
          )}
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Supports PNG, JPG, GIF, SVG, WebP
        </p>
      </div>

      {imageUrl && (
        <div>
          <label className="label">Preview</label>
          <div className="rounded-xl border p-4 flex justify-center" style={{ borderColor: 'var(--border-primary)' }}>
            <img src={imageUrl} alt="Preview" className="max-w-full max-h-64 rounded-lg" />
          </div>
        </div>
      )}

      {base64 && (
        <>
          <div className="flex items-center gap-3">
            <button onClick={clear} className="btn-ghost">
              <X size={18} />
              Clear
            </button>
          </div>
          <OutputPanel
            value={base64}
            label="Base64 String"
            language="text"
          />
        </>
      )}
    </div>
  );
}

