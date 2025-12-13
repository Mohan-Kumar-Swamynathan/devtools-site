import { useState, useCallback } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [termType, setTermType] = useState<'years' | 'months'>('years');

  const calculateEMI = useCallback(() => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(interestRate) || 0) / 100 / 12; // Monthly interest rate
    const n = termType === 'years' 
      ? (parseFloat(loanTerm) || 0) * 12 
      : (parseFloat(loanTerm) || 0);

    if (p === 0 || r === 0 || n === 0) {
      return { emi: 0, totalInterest: 0, totalAmount: 0, schedule: [] };
    }

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - p;

    // Generate amortization schedule (first 12 months)
    const schedule = [];
    let balance = p;
    for (let i = 1; i <= Math.min(12, n); i++) {
      const interest = balance * r;
      const principalPayment = emi - interest;
      balance -= principalPayment;
      schedule.push({
        month: i,
        emi: emi,
        principal: principalPayment,
        interest: interest,
        balance: Math.max(0, balance),
      });
    }

    return { emi, totalInterest, totalAmount, schedule };
  }, [principal, interestRate, loanTerm, termType]);

  const results = calculateEMI();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Calculator size={20} />
            Loan Details
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Loan Amount ($)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="input w-full"
                placeholder="100000"
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
                placeholder="5.5"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="label">Loan Term</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="input flex-1"
                  placeholder="30"
                  min="1"
                />
                <select
                  value={termType}
                  onChange={(e) => setTermType(e.target.value as 'years' | 'months')}
                  className="input w-32"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
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
                  Monthly EMI
                </div>
                <div className="text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                  ${results.emi.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border text-center" style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-primary)'
                }}>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Total Interest
                  </div>
                  <div className="text-lg font-bold" style={{ color: 'var(--status-warning)' }}>
                    ${results.totalInterest.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 rounded-lg border text-center" style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-primary)'
                }}>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Total Amount
                  </div>
                  <div className="text-lg font-bold" style={{ color: 'var(--status-success)' }}>
                    ${results.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {results.schedule.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Amortization Schedule (First 12 Months)
          </h3>
          <div className="p-4 rounded-xl border overflow-x-auto" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
                  <th className="text-left p-2" style={{ color: 'var(--text-muted)' }}>Month</th>
                  <th className="text-right p-2" style={{ color: 'var(--text-muted)' }}>EMI</th>
                  <th className="text-right p-2" style={{ color: 'var(--text-muted)' }}>Principal</th>
                  <th className="text-right p-2" style={{ color: 'var(--text-muted)' }}>Interest</th>
                  <th className="text-right p-2" style={{ color: 'var(--text-muted)' }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {results.schedule.map((row) => (
                  <tr key={row.month} className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
                    <td className="p-2" style={{ color: 'var(--text-primary)' }}>{row.month}</td>
                    <td className="text-right p-2" style={{ color: 'var(--text-primary)' }}>
                      ${row.emi.toFixed(2)}
                    </td>
                    <td className="text-right p-2" style={{ color: 'var(--status-success)' }}>
                      ${row.principal.toFixed(2)}
                    </td>
                    <td className="text-right p-2" style={{ color: 'var(--status-warning)' }}>
                      ${row.interest.toFixed(2)}
                    </td>
                    <td className="text-right p-2" style={{ color: 'var(--text-primary)' }}>
                      ${row.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

