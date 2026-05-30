import { useState } from 'react';
import { formatINR } from './SalaryCalculator.js';

const OLD_SLABS = [
  { from: 0, to: 250000, rate: 0 },
  { from: 250000, to: 500000, rate: 0.05 },
  { from: 500000, to: 1000000, rate: 0.20 },
  { from: 1000000, to: Infinity, rate: 0.30 },
];

const NEW_SLABS = [
  { from: 0, to: 300000, rate: 0 },
  { from: 300000, to: 600000, rate: 0.05 },
  { from: 600000, to: 900000, rate: 0.10 },
  { from: 900000, to: 1200000, rate: 0.15 },
  { from: 1200000, to: 1500000, rate: 0.20 },
  { from: 1500000, to: Infinity, rate: 0.30 },
];

function calcTax(income, slabs) {
  let tax = 0;
  for (const s of slabs) {
    if (income > s.from) {
      const taxable = Math.min(income, s.to) - s.from;
      tax += taxable * s.rate;
    }
  }
  return Math.round(tax);
}

export default function TaxRegimeComparator() {
  const [grossIncome, setGrossIncome] = useState('');
  const [deductions80C, setDeductions80C] = useState('150000');
  const [deductions80D, setDeductions80D] = useState('25000');
  const [hraExempt, setHraExempt] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const gross = Math.round(+grossIncome);
    if (!gross || gross <= 0) return;

    const d80C = Math.min(Math.round(+deductions80C || 0), 150000);
    const d80D = Math.round(+deductions80D || 0);
    const hra = Math.round(+hraExempt || 0);

    // Old regime: taxable = gross - deductions
    const oldTaxable = Math.max(gross - d80C - d80D - hra - 50000, 0); // 50K standard deduction
    const oldTax = calcTax(oldTaxable, OLD_SLABS);
    const oldCess = Math.round(oldTax * 0.04);
    const oldTotal = oldTax + oldCess;

    // New regime: no deductions (except standard deduction 75K)
    const newTaxable = Math.max(gross - 75000, 0); // 75K standard deduction under new regime
    const newTax = calcTax(newTaxable, NEW_SLABS);
    const newCess = Math.round(newTax * 0.04);
    const newTotal = newTax + newCess;

    const savings = oldTotal - newTotal;
    const better = savings > 0 ? 'new' : savings < 0 ? 'old' : 'same';

    setResult({ oldTaxable, oldTax, oldCess, oldTotal, newTaxable, newTax, newCess, newTotal, savings: Math.abs(savings), better });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Annual Gross Income (₹)</label>
          <input type="number" value={grossIncome} onChange={e => setGrossIncome(e.target.value)}
            placeholder="1200000"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section 80C Deductions (₹)</label>
          <input type="number" value={deductions80C} onChange={e => setDeductions80C(e.target.value)}
            placeholder="150000"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <p className="text-xs text-gray-400 mt-1">Max ₹1,50,000 (PF, ELSS, LIC, etc.)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section 80D Deductions (₹)</label>
          <input type="number" value={deductions80D} onChange={e => setDeductions80D(e.target.value)}
            placeholder="25000"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <p className="text-xs text-gray-400 mt-1">Health insurance premium</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HRA Exemption (₹)</label>
          <input type="number" value={hraExempt} onChange={e => setHraExempt(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <button onClick={calculate}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-base shadow-sm">
        Compare Tax Regimes
      </button>

      {result && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 text-center ${result.better === 'new' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : result.better === 'old' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {result.better === 'new' ? 'New Tax Regime saves you' : result.better === 'old' ? 'Old Tax Regime saves you' : 'Both regimes are equal'}
            </p>
            {result.better !== 'same' && (
              <p className={`text-3xl font-bold ${result.better === 'new' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {formatINR(result.savings)}/year
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
              <div className="bg-blue-600 text-white px-5 py-3">
                <h3 className="font-semibold">Old Tax Regime</h3>
              </div>
              <div className="p-5 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Taxable Income</span><span className="font-medium">{formatINR(result.oldTaxable)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Income Tax</span><span className="font-medium">{formatINR(result.oldTax)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Health & Edu Cess (4%)</span><span className="font-medium">{formatINR(result.oldCess)}</span></div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2"><span className="font-semibold">Total Tax</span><span className="font-bold text-lg">{formatINR(result.oldTotal)}</span></div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
              <div className="bg-green-600 text-white px-5 py-3">
                <h3 className="font-semibold">New Tax Regime (Default)</h3>
              </div>
              <div className="p-5 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Taxable Income</span><span className="font-medium">{formatINR(result.newTaxable)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Income Tax</span><span className="font-medium">{formatINR(result.newTax)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Health & Edu Cess (4%)</span><span className="font-medium">{formatINR(result.newCess)}</span></div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2"><span className="font-semibold">Total Tax</span><span className="font-bold text-lg">{formatINR(result.newTotal)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
