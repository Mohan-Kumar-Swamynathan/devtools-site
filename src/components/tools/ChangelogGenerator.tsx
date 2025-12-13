import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function ChangelogGenerator() {
  const [version, setVersion] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [changes, setChanges] = useState<Array<{ type: string; description: string }>>([]);
  const [output, setOutput] = useState('');

  const addChange = () => {
    setChanges([...changes, { type: 'Added', description: '' }]);
  };

  const updateChange = (index: number, field: string, value: string) => {
    const newChanges = [...changes];
    newChanges[index] = { ...newChanges[index], [field]: value };
    setChanges(newChanges);
  };

  const removeChange = (index: number) => {
    setChanges(changes.filter((_, i) => i !== index));
  };

  const generate = useCallback(() => {
    const grouped = changes.reduce((acc, change) => {
      if (!acc[change.type]) acc[change.type] = [];
      acc[change.type].push(change.description);
      return acc;
    }, {} as Record<string, string[]>);

    let changelog = `## [${version || 'Unreleased'}] - ${date}\n\n`;

    Object.entries(grouped).forEach(([type, items]) => {
      changelog += `### ${type}\n\n`;
      items.forEach(item => {
        changelog += `- ${item}\n`;
      });
      changelog += '\n';
    });

    setOutput(changelog);
  }, [version, date, changes]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Version</label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0.0"
            className="input-base"
          />
        </div>
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-base"
          />
        </div>
      </div>

      <div>
        <label className="label">Changes</label>
        <div className="space-y-3">
          {changes.map((change, i) => (
            <div key={i} className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
                <select
                  value={change.type}
                  onChange={(e) => updateChange(i, 'type', e.target.value)}
                  className="input-base text-sm"
                >
                  <option value="Added">Added</option>
                  <option value="Changed">Changed</option>
                  <option value="Deprecated">Deprecated</option>
                  <option value="Removed">Removed</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Security">Security</option>
                </select>
                <input
                  type="text"
                  value={change.description}
                  onChange={(e) => updateChange(i, 'description', e.target.value)}
                  placeholder="Change description"
                  className="input-base text-sm col-span-2"
                />
                <button onClick={() => removeChange(i)} className="btn-ghost text-sm">Remove</button>
              </div>
            </div>
          ))}
          <button onClick={addChange} className="btn-secondary text-sm">+ Add Change</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={generate} className="btn-primary">
          Generate Changelog
        </button>
        <button onClick={() => { setVersion(''); setDate(new Date().toISOString().split('T')[0]); setChanges([]); setOutput(''); }} className="btn-ghost">
          Reset
        </button>
      </div>

      {output && (
        <OutputPanel
          value={output}
          label="CHANGELOG.md"
          language="markdown"
          showLineNumbers
        />
      )}
    </div>
  );
}

