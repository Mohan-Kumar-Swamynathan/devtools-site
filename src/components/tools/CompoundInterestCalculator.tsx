import { useState, useCallback, useMemo } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [time, setTime] = useState('');
  const [compoundingFrequency, setCompoundingFrequency] = useState(12); // Monthly
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');

  const calculate = useCallback(() => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(interestRate) || 0) / 100;
    const t = timeUnit === 'years' 
      ? parseFloat(time) || 0 
      : (parseFloat(time) || 0) / 12;
    const n = compoundingFrequency;

    if (p === 0 || r === 0 || t === 0) {
      return {
        finalAmount: p,
        interestEarned: 0,
        dataPoints: [],
      };
    }

    const finalAmount = p * Math.pow(1 + r / n, n * t);
    const interestEarned = finalAmount - p;

    // Generate data points for graph (yearly)
    const dataPoints = [];
    for (let year = 0; year <= Math.ceil(t); year++) {
      const amount = p * Math.pow(1 + r / n, n * year);
      dataPoints.push({
        year,
        amount,
        interest: amount - p,
      });
    }

    return {
      finalAmount,
      interestEarned,
      dataPoints,
    };
  }, [principal, interestRate, time, compoundingFrequency, timeUnit]);

  const results = calculate();
  const maxAmount = Math.max(...results.dataPoints.map(d => d.amount), parseFloat(principal) || 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Calculator size={20} />
            Investment Details
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Principal Amount ($)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="input w-full"
                placeholder="10000"
                min="0"
              />
            </div>
            <div>
              <label className="label">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="input w-full"
                placeholder="5"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="label">Time Period</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="input flex-1"
                  placeholder="10"
                  min="0"
                />
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value as 'years' | 'months')}
                  className="input w-32"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Compounding Frequency</label>
              <select
                value={compoundingFrequency}
                onChange={(e) => setCompoundingFrequency(parseInt(e.target.value))}
                className="input w-full"
              >
                <option value="1">Annually</option>
                <option value="2">Semi-Annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="365">Daily</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <TrendingUp size={20} />
            Results
          </h3>
          <div className="p-6 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-lg border text-center" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)'
              }}>
                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Final Amount
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--status-success)' }}>
                  ${results.finalAmount.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border text-center" style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-primary)'
                }}>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Principal
                  </div>
                  <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    ${(parseFloat(principal) || 0).toFixed(2)}
                  </div>
                </div>
                <div className="p-3 rounded-lg border text-center" style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-primary)'
                }}>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Interest Earned
                  </div>
                  <div className="text-lg font-bold" style={{ color: 'var(--brand-primary)' }}>
                    ${results.interestEarned.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {results.dataPoints.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Growth Over Time
          </h3>
          <div className="p-4 rounded-xl border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div className="space-y-2">
              {results.dataPoints.map((point, index) => {
                const width = (point.amount / maxAmount) * 100;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                      Year {point.year}
                    </div>
                    <div className="flex-1 relative h-8 rounded overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
                      <div
                        className="h-full rounded transition-all duration-300 flex items-center justify-end pr-2"
                        style={{
                          width: `${width}%`,
                          backgroundColor: 'var(--brand-primary)',
                        }}
                      >
                        <span className="text-xs font-semibold text-white">
                          ${point.amount.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

