import { useState, useCallback } from 'react';
import { Calculator, Activity } from 'lucide-react';

export default function BmiCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const calculateBMI = useCallback(() => {
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;

    if (w === 0 || h === 0) {
      return { bmi: 0, category: '', color: '' };
    }

    let bmi: number;
    if (unit === 'metric') {
      // BMI = weight (kg) / height (m)²
      bmi = w / Math.pow(h / 100, 2);
    } else {
      // BMI = (weight (lbs) / height (in)²) × 703
      bmi = (w / Math.pow(h, 2)) * 703;
    }

    let category = '';
    let color = '';
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'var(--status-info)';
    } else if (bmi < 25) {
      category = 'Normal weight';
      color = 'var(--status-success)';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'var(--status-warning)';
    } else {
      category = 'Obese';
      color = 'var(--status-error)';
    }

    return { bmi, category, color };
  }, [weight, height, unit]);

  const results = calculateBMI();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Activity size={20} />
            Body Measurements
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Unit System</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setUnit('metric')}
                  className={`btn flex-1 ${unit === 'metric' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Metric (kg, cm)
                </button>
                <button
                  onClick={() => setUnit('imperial')}
                  className={`btn flex-1 ${unit === 'imperial' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Imperial (lbs, in)
                </button>
              </div>
            </div>
            <div>
              <label className="label">
                Weight ({unit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input w-full"
                placeholder={unit === 'metric' ? '70' : '154'}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="label">
                Height ({unit === 'metric' ? 'cm' : 'inches'})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="input w-full"
                placeholder={unit === 'metric' ? '175' : '69'}
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Calculator size={20} />
            BMI Result
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
                Your BMI
              </div>
              <div className="text-4xl font-bold mb-2" style={{ color: results.color || 'var(--text-primary)' }}>
                {results.bmi > 0 ? results.bmi.toFixed(1) : '--'}
              </div>
              {results.category && (
                <div className="text-lg font-semibold" style={{ color: results.color }}>
                  {results.category}
                </div>
              )}
            </div>
            <div className="p-3 rounded-lg border text-sm space-y-2" style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)'
            }}>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--status-info)' }}>Underweight</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>&lt; 18.5</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--status-success)' }}>Normal weight</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>18.5 - 24.9</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--status-warning)' }}>Overweight</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>25 - 29.9</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--status-error)' }}>Obese</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>≥ 30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

