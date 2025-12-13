import { useState, useCallback } from 'react';

export default function NumberBaseConverter() {
  const [decimal, setDecimal] = useState('');
  const [binary, setBinary] = useState('');
  const [hex, setHex] = useState('');
  const [octal, setOctal] = useState('');

  const updateFromDecimal = useCallback((value: string) => {
    if (!value) {
      setDecimal('');
      setBinary('');
      setHex('');
      setOctal('');
      return;
    }
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    setDecimal(value);
    setBinary(num.toString(2));
    setHex(num.toString(16).toUpperCase());
    setOctal(num.toString(8));
  }, []);

  const updateFromBinary = useCallback((value: string) => {
    if (!value) {
      setDecimal('');
      setBinary('');
      setHex('');
      setOctal('');
      return;
    }
    const num = parseInt(value, 2);
    if (isNaN(num)) return;
    setBinary(value);
    setDecimal(num.toString(10));
    setHex(num.toString(16).toUpperCase());
    setOctal(num.toString(8));
  }, []);

  const updateFromHex = useCallback((value: string) => {
    if (!value) {
      setDecimal('');
      setBinary('');
      setHex('');
      setOctal('');
      return;
    }
    const num = parseInt(value, 16);
    if (isNaN(num)) return;
    setHex(value.toUpperCase());
    setDecimal(num.toString(10));
    setBinary(num.toString(2));
    setOctal(num.toString(8));
  }, []);

  const updateFromOctal = useCallback((value: string) => {
    if (!value) {
      setDecimal('');
      setBinary('');
      setHex('');
      setOctal('');
      return;
    }
    const num = parseInt(value, 8);
    if (isNaN(num)) return;
    setOctal(value);
    setDecimal(num.toString(10));
    setBinary(num.toString(2));
    setHex(num.toString(16).toUpperCase());
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Decimal (Base 10)</label>
          <input
            type="text"
            value={decimal}
            onChange={(e) => updateFromDecimal(e.target.value)}
            placeholder="255"
            className="input-base font-mono"
          />
        </div>
        <div>
          <label className="label">Binary (Base 2)</label>
          <input
            type="text"
            value={binary}
            onChange={(e) => updateFromBinary(e.target.value)}
            placeholder="11111111"
            className="input-base font-mono"
          />
        </div>
        <div>
          <label className="label">Hexadecimal (Base 16)</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            placeholder="FF"
            className="input-base font-mono"
          />
        </div>
        <div>
          <label className="label">Octal (Base 8)</label>
          <input
            type="text"
            value={octal}
            onChange={(e) => updateFromOctal(e.target.value)}
            placeholder="377"
            className="input-base font-mono"
          />
        </div>
      </div>
    </div>
  );
}

