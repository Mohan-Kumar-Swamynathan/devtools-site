import { useState, useCallback } from 'react';
import CodeEditor from '@/components/common/CodeEditor';
import OutputPanel from '@/components/common/OutputPanel';

export default function CreditCardValidator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Array<{ card: string; valid: boolean; type?: string; details?: string }>>([]);

  const luhnCheck = (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const detectCardType = (cardNumber: string): string => {
    const digits = cardNumber.replace(/\D/g, '');
    if (/^4/.test(digits)) return 'Visa';
    if (/^5[1-5]/.test(digits)) return 'Mastercard';
    if (/^3[47]/.test(digits)) return 'American Express';
    if (/^6(?:011|5)/.test(digits)) return 'Discover';
    if (/^3[068]/.test(digits)) return 'Diners Club';
    if (/^35/.test(digits)) return 'JCB';
    return 'Unknown';
  };

  const validate = useCallback(() => {
    const cards = input.split('\n').filter(c => c.trim());
    const results = cards.map(card => {
      const trimmed = card.trim().replace(/\s/g, '');
      const digits = trimmed.replace(/\D/g, '');
      
      if (digits.length < 13 || digits.length > 19) {
        return {
          card: trimmed,
          valid: false,
          details: 'Invalid length (must be 13-19 digits)'
        };
      }

      const isValid = luhnCheck(trimmed);
      const type = detectCardType(trimmed);

      return {
        card: trimmed,
        valid: isValid,
        type: isValid ? type : undefined,
        details: isValid ? `Valid ${type} card` : 'Invalid card number (Luhn check failed)'
      };
    });
    setResults(results);
  }, [input]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          <strong>Note:</strong> This tool only validates card number format using the Luhn algorithm. 
          It does not verify if the card is active or has funds. Never use real card numbers for testing.
        </p>
      </div>

      <CodeEditor
        value={input}
        onChange={setInput}
        language="text"
        label="Credit Card Numbers (one per line)"
        placeholder="4532015112830366
4111111111111111
invalid-card"
      />

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={validate} disabled={!input} className="btn-primary">
          Validate
        </button>
        <button onClick={() => { setInput(''); setResults([]); }} className="btn-ghost">
          Clear
        </button>
      </div>

      {results.length > 0 && (
        <div>
          <label className="label">Validation Results</label>
          <div className="space-y-2">
            {results.map((result, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  result.valid ? 'alert-success' : 'alert-error'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">
                    {result.card.replace(/(.{4})/g, '$1 ').trim()}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-medium">
                      {result.valid ? '✓ Valid' : '✗ Invalid'}
                    </span>
                    {result.type && (
                      <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>
                        {result.type}
                      </span>
                    )}
                  </div>
                </div>
                {result.details && (
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {result.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

