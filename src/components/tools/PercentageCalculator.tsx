import { useState, useCallback } from 'react';
import { Calculator } from 'lucide-react';

type CalculationMode = 'percentage' | 'increase' | 'decrease' | 'discount' | 'markup';

export default function PercentageCalculator() {
  const [mode, setMode] = useState<CalculationMode>('percentage');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  const calculate = useCallback(() => {
    const v1 = parseFloat(value1) || 0;
    const v2 = parseFloat(value2) || 0;

    switch (mode) {
      case 'percentage':
        // What is X% of Y?
        return {
          result: (v1 / 100) * v2,
          formula: `${v1}% of ${v2} = ${((v1 / 100) * v2).toFixed(2)}`,
        };
      case 'increase':
        // X increased by Y% = ?
        const increase = v1 * (1 + v2 / 100);
        return {
          result: increase,
          formula: `${v1} increased by ${v2}% = ${increase.toFixed(2)}`,
        };
      case 'decrease':
        // X decreased by Y% = ?
        const decrease = v1 * (1 - v2 / 100);
        return {
          result: decrease,
          formula: `${v1} decreased by ${v2}% = ${decrease.toFixed(2)}`,
        };
      case 'discount':
        // Original price X with Y% discount = ?
        const discounted = v1 * (1 - v2 / 100);
        const savings = v1 - discounted;
        return {
          result: discounted,
          formula: `$${v1} with ${v2}% discount = $${discounted.toFixed(2)} (Save $${savings.toFixed(2)})`,
          savings,
        };
      case 'markup':
        // Cost X with Y% markup = ?
        const markedUp = v1 * (1 + v2 / 100);
        const profit = markedUp - v1;
        return {
          result: markedUp,
          formula: `$${v1} with ${v2}% markup = $${markedUp.toFixed(2)} (Profit $${profit.toFixed(2)})`,
          profit,
        };
      default:
        return { result: 0, formula: '' };
    }
  }, [mode, value1, value2]);

  const results = calculate();

  const getLabels = () => {
    switch (mode) {
      case 'percentage':
        return { label1: 'Percentage (%)', label2: 'Of Value', placeholder1: '15', placeholder2: '200' };
      case 'increase':
        return { label1: 'Value', label2: 'Increase by (%)', placeholder1: '100', placeholder2: '10' };
      case 'decrease':
        return { label1: 'Value', label2: 'Decrease by (%)', placeholder1: '100', placeholder2: '10' };
      case 'discount':
        return { label1: 'Original Price ($)', label2: 'Discount (%)', placeholder1: '100', placeholder2: '20' };
      case 'markup':
        return { label1: 'Cost ($)', label2: 'Markup (%)', placeholder1: '50', placeholder2: '25' };
      default:
        return { label1: '', label2: '', placeholder1: '', placeholder2: '' };
    }
  };

  const labels = getLabels();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Calculator size={20} />
            Calculation Mode
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Calculation Type</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as CalculationMode)}
                className="input w-full"
              >
                <option value="percentage">What is X% of Y?</option>
                <option value="increase">X increased by Y%</option>
                <option value="decrease">X decreased by Y%</option>
                <option value="discount">Discount Calculator</option>
                <option value="markup">Markup Calculator</option>
              </select>
            </div>
            <div>
              <label className="label">{labels.label1}</label>
              <input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                className="input w-full"
                placeholder={labels.placeholder1}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="label">{labels.label2}</label>
              <input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                className="input w-full"
                placeholder={labels.placeholder2}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Result
          </h3>
          <div className="p-6 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div className="p-4 rounded-lg border text-center" style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Result
              </div>
              <div className="text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                {mode === 'discount' || mode === 'markup' ? '$' : ''}{results.result.toFixed(2)}
                {mode === 'percentage' && '%'}
              </div>
            </div>
            {results.formula && (
              <div className="p-3 rounded-lg border text-sm" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-muted)'
              }}>
                {results.formula}
              </div>
            )}
            {'savings' in results && results.savings > 0 && (
              <div className="p-3 rounded-lg text-sm text-center" style={{
                backgroundColor: 'var(--status-success)',
                color: 'white'
              }}>
                You save: ${results.savings.toFixed(2)}
              </div>
            )}
            {'profit' in results && results.profit > 0 && (
              <div className="p-3 rounded-lg text-sm text-center" style={{
                backgroundColor: 'var(--status-info)',
                color: 'white'
              }}>
                Profit: ${results.profit.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

