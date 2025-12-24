import { useState, useCallback } from 'react';
import { Copy, Download, RotateCcw } from 'lucide-react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
const domains = ['example.com', 'test.com', 'demo.org', 'sample.net'];

export default function FakeDataGenerator() {
  const [count, setCount] = useState(10);
  const [includeFields, setIncludeFields] = useState({
    name: true,
    email: true,
    phone: true,
    address: true,
    city: true,
    country: true,
    age: true,
  });
  const [generatedData, setGeneratedData] = useState<any[]>([]);
  const { showToast } = useToast();

  const generateData = useCallback(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const obj: any = { id: i + 1 };
      
      if (includeFields.name) obj.name = `${firstName} ${lastName}`;
      if (includeFields.email) obj.email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
      if (includeFields.phone) obj.phone = `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
      if (includeFields.address) obj.address = `${Math.floor(Math.random() * 9999) + 1} Main St`;
      if (includeFields.city) obj.city = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)];
      if (includeFields.country) obj.country = 'USA';
      if (includeFields.age) obj.age = Math.floor(Math.random() * 50) + 18;
      
      data.push(obj);
    }
    setGeneratedData(data);
  }, [count, includeFields]);

  const handleCopy = useCallback(() => {
    const json = JSON.stringify(generatedData, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      showToast('Copied to clipboard!', 'success');
    });
  }, [generatedData, showToast]);

  const handleDownload = useCallback(() => {
    const json = JSON.stringify(generatedData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'fake-data.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }, [generatedData]);

  
  const controls = (
          <div className="flex items-center gap-3">
        <button
          onClick={generateData}
          className="btn-primary flex items-center gap-2"
        >
          Generate Data
        </button>
        {generatedData.length > 0 && (
          <>
            <button
              onClick={handleCopy}
              className="btn-secondary flex items-center gap-2"
            >
              <Copy size={18} />
              Copy JSON
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
      </div>
  );

  return (
    <ToolShell className="space-y-6" controls={controls}>
{/* Controls moved to header */}


























      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Settings
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Count: {count}</label>
              <input
                type="range"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="label">Include Fields</label>
              <div className="space-y-2">
                {Object.entries(includeFields).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setIncludeFields({ ...includeFields, [key]: e.target.checked })}
                      className="checkbox"
                    />
                    <span style={{ color: 'var(--text-primary)' }} className="capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Generated Data ({generatedData.length} items)
          </h3>
          <div className="p-4 rounded-xl border max-h-96 overflow-auto" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <pre className="text-xs" style={{ color: 'var(--text-primary)' }}>
              <code>{JSON.stringify(generatedData, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}

