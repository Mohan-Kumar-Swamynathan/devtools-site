import { useState, useCallback } from 'react';
import { Calculator, Home } from 'lucide-react';

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState('');
  const [homeInsurance, setHomeInsurance] = useState('');
  const [pmi, setPmi] = useState('');

  const calculate = useCallback(() => {
    const price = parseFloat(homePrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const principal = price - down;
    const r = (parseFloat(interestRate) || 0) / 100 / 12;
    const n = (loanTerm || 30) * 12;

    if (principal === 0 || r === 0 || n === 0) {
      return {
        principal,
        monthlyPayment: 0,
        monthlyInterest: 0,
        monthlyTax: 0,
        monthlyInsurance: 0,
        monthlyPMI: 0,
        totalMonthly: 0,
      };
    }

    const monthlyPayment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyInterest = principal * r;
    const monthlyTax = (parseFloat(propertyTax) || 0) / 12;
    const monthlyInsurance = (parseFloat(homeInsurance) || 0) / 12;
    const monthlyPMI = parseFloat(pmi) || 0;
    const totalMonthly = monthlyPayment + monthlyTax + monthlyInsurance + monthlyPMI;

    return {
      principal,
      monthlyPayment,
      monthlyInterest,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
      totalMonthly,
    };
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, homeInsurance, pmi]);

  const results = calculate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Home size={20} />
            Mortgage Details
          </h3>
          <div className="p-4 rounded-xl border space-y-4" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}>
            <div>
              <label className="label">Home Price ($)</label>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
                className="input w-full"
                placeholder="500000"
                min="0"
              />
            </div>
            <div>
              <label className="label">Down Payment ($)</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                className="input w-full"
                placeholder="100000"
                min="0"
              />
              {homePrice && (
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Down Payment: {((parseFloat(downPayment) || 0) / parseFloat(homePrice) * 100).toFixed(1)}%
                </div>
              )}
            </div>
            <div>
              <label className="label">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="input w-full"
                placeholder="3.5"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="label">Loan Term: {loanTerm} years</label>
              <input
                type="range"
                min="15"
                max="30"
                step="5"
                value={loanTerm}
                onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex gap-2 mt-2">
                {[15, 20, 25, 30].map(term => (
                  <button
                    key={term}
                    onClick={() => setLoanTerm(term)}
                    className={`btn-sm px-3 py-1 rounded-lg text-sm ${
                      loanTerm === term ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {term} years
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Annual Property Tax ($)</label>
              <input
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value)}
                className="input w-full"
                placeholder="6000"
                min="0"
              />
            </div>
            <div>
              <label className="label">Annual Home Insurance ($)</label>
              <input
                type="number"
                value={homeInsurance}
                onChange={(e) => setHomeInsurance(e.target.value)}
                className="input w-full"
                placeholder="1200"
                min="0"
              />
            </div>
            <div>
              <label className="label">Monthly PMI ($)</label>
              <input
                type="number"
                value={pmi}
                onChange={(e) => setPmi(e.target.value)}
                className="input w-full"
                placeholder="0"
                min="0"
              />
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                PMI is typically required if down payment is less than 20%
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Calculator size={20} />
            Monthly Payment Breakdown
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
                Total Monthly Payment
              </div>
              <div className="text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                ${results.totalMonthly.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Principal & Interest:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  ${results.monthlyPayment.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Property Tax:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  ${results.monthlyTax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Home Insurance:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  ${results.monthlyInsurance.toFixed(2)}
                </span>
              </div>
              {results.monthlyPMI > 0 && (
                <div className="flex justify-between items-center p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>PMI:</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ${results.monthlyPMI.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                <div className="mb-1">Loan Amount: <strong style={{ color: 'var(--text-primary)' }}>${results.principal.toLocaleString()}</strong></div>
                <div>Total over {loanTerm} years: <strong style={{ color: 'var(--text-primary)' }}>${(results.totalMonthly * loanTerm * 12).toLocaleString()}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

