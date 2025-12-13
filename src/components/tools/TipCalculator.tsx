import { useState, useCallback } from 'react';
import { Calculator, Users } from 'lucide-react';

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [numPeople, setNumPeople] = useState(1);
  const [roundUp, setRoundUp] = useState(false);

  const calculate = useCallback(() => {
    const bill = parseFloat(billAmount) || 0;
    const tip = (bill * tipPercent) / 100;
    const total = bill + tip;
    let tipPerPerson = tip / numPeople;
    let totalPerPerson = total / numPeople;

    if (roundUp) {
      tipPerPerson = Math.ceil(tipPerPerson);
      totalPerPerson = bill / numPeople + tipPerPerson;
    }

    return {
      bill,
      tip,
      total,
      tipPerPerson,
      totalPerPerson,
    };
  }, [billAmount, tipPercent, numPeople, roundUp]);

  const results = calculate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Calculator size={20} />
            Input
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Bill Amount ($)</label>
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="input w-full"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="label">Tip Percentage: {tipPercent}%</label>
              <input
                type="range"
                min="0"
                max="50"
                value={tipPercent}
                onChange={(e) => setTipPercent(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex gap-2 mt-2">
                {[10, 15, 18, 20, 25].map(percent => (
                  <button
                    key={percent}
                    onClick={() => setTipPercent(percent)}
                    className={`btn-sm px-3 py-1 rounded-lg text-sm ${
                      tipPercent === percent ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label flex items-center gap-2">
                <Users size={16} />
                Number of People
              </label>
              <input
                type="number"
                value={numPeople}
                onChange={(e) => setNumPeople(Math.max(1, parseInt(e.target.value) || 1))}
                className="input w-full"
                min="1"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={roundUp}
                onChange={(e) => setRoundUp(e.target.checked)}
                className="checkbox"
              />
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Round up tip per person</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Results
          </h3>
          <div className="p-6 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border text-center" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)'
              }}>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Tip Amount
                </div>
                <div className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                  ${results.tip.toFixed(2)}
                </div>
              </div>
              <div className="p-4 rounded-lg border text-center" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)'
              }}>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Total Amount
                </div>
                <div className="text-2xl font-bold" style={{ color: 'var(--status-success)' }}>
                  ${results.total.toFixed(2)}
                </div>
              </div>
            </div>
            {numPeople > 1 && (
              <div className="pt-4 border-t space-y-3" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Per Person:
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Tip per person:</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ${results.tipPerPerson.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-muted)' }}>Total per person:</span>
                  <span className="font-semibold text-lg" style={{ color: 'var(--status-success)' }}>
                    ${results.totalPerPerson.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

