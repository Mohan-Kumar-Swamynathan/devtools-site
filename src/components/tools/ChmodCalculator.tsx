import { useState, useCallback } from 'react';
import OutputPanel from '@/components/common/OutputPanel';

export default function ChmodCalculator() {
  const [ownerRead, setOwnerRead] = useState(true);
  const [ownerWrite, setOwnerWrite] = useState(true);
  const [ownerExecute, setOwnerExecute] = useState(false);
  const [groupRead, setGroupRead] = useState(true);
  const [groupWrite, setGroupWrite] = useState(false);
  const [groupExecute, setGroupExecute] = useState(false);
  const [otherRead, setOtherRead] = useState(true);
  const [otherWrite, setOtherWrite] = useState(false);
  const [otherExecute, setOtherExecute] = useState(false);

  const calculate = useCallback(() => {
    let numeric = 0;
    if (ownerRead) numeric += 400;
    if (ownerWrite) numeric += 200;
    if (ownerExecute) numeric += 100;
    if (groupRead) numeric += 40;
    if (groupWrite) numeric += 20;
    if (groupExecute) numeric += 10;
    if (otherRead) numeric += 4;
    if (otherWrite) numeric += 2;
    if (otherExecute) numeric += 1;

    const symbolic = 
      (ownerRead ? 'r' : '-') + (ownerWrite ? 'w' : '-') + (ownerExecute ? 'x' : '-') + ' ' +
      (groupRead ? 'r' : '-') + (groupWrite ? 'w' : '-') + (groupExecute ? 'x' : '-') + ' ' +
      (otherRead ? 'r' : '-') + (otherWrite ? 'w' : '-') + (otherExecute ? 'x' : '-');

    return { numeric, symbolic };
  }, [ownerRead, ownerWrite, ownerExecute, groupRead, groupWrite, groupExecute, otherRead, otherWrite, otherExecute]);

  const result = calculate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium mb-3">Owner</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={ownerRead} onChange={(e) => setOwnerRead(e.target.checked)} className="checkbox" />
              <span>Read (r)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={ownerWrite} onChange={(e) => setOwnerWrite(e.target.checked)} className="checkbox" />
              <span>Write (w)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={ownerExecute} onChange={(e) => setOwnerExecute(e.target.checked)} className="checkbox" />
              <span>Execute (x)</span>
            </label>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-3">Group</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={groupRead} onChange={(e) => setGroupRead(e.target.checked)} className="checkbox" />
              <span>Read (r)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={groupWrite} onChange={(e) => setGroupWrite(e.target.checked)} className="checkbox" />
              <span>Write (w)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={groupExecute} onChange={(e) => setGroupExecute(e.target.checked)} className="checkbox" />
              <span>Execute (x)</span>
            </label>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-3">Other</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={otherRead} onChange={(e) => setOtherRead(e.target.checked)} className="checkbox" />
              <span>Read (r)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={otherWrite} onChange={(e) => setOtherWrite(e.target.checked)} className="checkbox" />
              <span>Write (w)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={otherExecute} onChange={(e) => setOtherExecute(e.target.checked)} className="checkbox" />
              <span>Execute (x)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <div className="space-y-2">
          <div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Numeric:</span>
            <span className="ml-2 font-mono font-bold text-lg">{result.numeric}</span>
          </div>
          <div>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Symbolic:</span>
            <span className="ml-2 font-mono font-bold text-lg">{result.symbolic}</span>
          </div>
        </div>
      </div>

      <OutputPanel
        value={`chmod ${result.numeric} filename\nchmod ${result.symbolic.replace(/\s/g, '')} filename`}
        label="Command"
        language="bash"
      />
    </div>
  );
}

