import { useState, useCallback } from 'react';
import ToolShell from './ToolShell';
import { useToast } from '@/hooks/useToast';

type UnitType = 'length' | 'weight' | 'temperature';

export default function UnitConverter() {
  const [unitType, setUnitType] = useState<UnitType>('length');
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');

  const lengthUnits = ['meter', 'kilometer', 'centimeter', 'millimeter', 'mile', 'yard', 'foot', 'inch'];
  const weightUnits = ['kilogram', 'gram', 'pound', 'ounce', 'ton'];
  const tempUnits = ['celsius', 'fahrenheit', 'kelvin'];

  const convert = useCallback(() => {
    if (!fromValue || !fromUnit || !toUnit) return;
    
    const value = parseFloat(fromValue);
    if (isNaN(value)) return;

    let converted = 0;

    if (unitType === 'length') {
      const toMeters: Record<string, number> = {
        meter: 1,
        kilometer: 1000,
        centimeter: 0.01,
        millimeter: 0.001,
        mile: 1609.34,
        yard: 0.9144,
        foot: 0.3048,
        inch: 0.0254
      };
      const meters = value * toMeters[fromUnit];
      converted = meters / toMeters[toUnit];
    } else if (unitType === 'weight') {
      const toKilograms: Record<string, number> = {
        kilogram: 1,
        gram: 0.001,
        pound: 0.453592,
        ounce: 0.0283495,
        ton: 1000
      };
      const kilograms = value * toKilograms[fromUnit];
      converted = kilograms / toKilograms[toUnit];
    } else if (unitType === 'temperature') {
      let celsius = 0;
      if (fromUnit === 'celsius') celsius = value;
      else if (fromUnit === 'fahrenheit') celsius = (value - 32) * 5/9;
      else if (fromUnit === 'kelvin') celsius = value - 273.15;

      if (toUnit === 'celsius') converted = celsius;
      else if (toUnit === 'fahrenheit') converted = (celsius * 9/5) + 32;
      else if (toUnit === 'kelvin') converted = celsius + 273.15;
    }

    setResult(converted.toFixed(6).replace(/\.?0+$/, ''));
  }, [fromValue, fromUnit, toUnit, unitType]);

  const units = unitType === 'length' ? lengthUnits : unitType === 'weight' ? weightUnits : tempUnits;

  const controls = null;

  return (
    <ToolShell className="space-y-6" controls={controls}>
      <div>
        <label className="label">Unit Type</label>
        <select value={unitType} onChange={(e) => { setUnitType(e.target.value as UnitType); setFromValue(''); setResult(''); }} className="input-base">
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="temperature">Temperature</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">From Value</label>
          <input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            placeholder="0"
            className="input-base"
            onBlur={convert}
          />
        </div>
        <div>
          <label className="label">From Unit</label>
          <select value={fromUnit} onChange={(e) => { setFromUnit(e.target.value); convert(); }} className="input-base">
            <option value="">Select unit</option>
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">To Unit</label>
          <select value={toUnit} onChange={(e) => { setToUnit(e.target.value); convert(); }} className="input-base">
            <option value="">Select unit</option>
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
          <p className="text-2xl font-bold">{result}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{toUnit}</p>
        </div>
      )}
    </ToolShell>
  );
}

