import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import { Download } from 'lucide-react';

export default function Base64ImageDecoder() {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const decode = useCallback(() => {
    setError('');
    try {
      if (!input.trim()) {
        setError('Please enter a base64 string');
        setImageUrl('');
        return;
      }

      // Remove data URL prefix if present
      const base64 = input.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageUrl = `data:image/png;base64,${base64}`;
      setImageUrl(imageUrl);
    } catch (e) {
      setError(`Error: ${(e as Error).message}`);
      setImageUrl('');
    }
  }, [input]);

  const download = useCallback(() => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'decoded-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageUrl]);

  return (
    <div className="space-y-6">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="Base64 String"
        placeholder="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={decode} disabled={!input} className="btn-primary">
          Decode Image
        </button>
        {imageUrl && (
          <button onClick={download} className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            Download Image
          </button>
        )}
        <button onClick={() => { setInput(''); setImageUrl(''); setError(''); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {imageUrl && (
        <div className="rounded-xl border p-4 flex justify-center" style={{ borderColor: 'var(--border-primary)' }}>
          <img src={imageUrl} alt="Decoded" className="max-w-full max-h-96 rounded-lg" />
        </div>
      )}
    </div>
  );
}

