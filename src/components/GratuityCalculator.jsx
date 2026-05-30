import { useState } from 'react';
import { formatINR } from './SalaryCalculator.js';

export default function GratuityCalculator() {
  const [basic, setBasic] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const b = Math.round(+basic);
    const y = Math.round(+years);
    if (!b || !y || y < 1) return;

    // Gratuity = (Basic * 15 * years) / 26
    const gratuity = Math.round((b * 15 * y) / 26);
    // Max exemption under Sec 10(10) is ₹20,00,000
    const maxExempt = 2000000;
    const exempt = Math.min(gratuity, maxExempt);
    const taxable = Math.max(gratuity - maxExempt, 0);

    setResult({ gratuity, exempt, taxable, years: y });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Drawn Basic Salary (₹/month)</label>
          <input type="number" value={basic} onChange={e => setBasic(e.target.value)}
            placeholder="50000"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Service</label>
          <input type="number" min="1" max="50" value={years} onChange={e => setYears(e.target.value)}
            placeholder="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <button onClick={calculate}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-base shadow-sm">
        Calculate Gratuity
      </button>

      {result && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-indigo-700 text-white px-5 py-3">
            <h3 className="font-semibold">Gratuity Calculation</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
              <p className="font-medium text-gray-800 mb-1">Formula: (Basic x 15 x Years) / 26</p>
              <p>= ({formatINR(+basic)} x 15 x {result.years}) / 26</p>
            </div>
            <div className="flex justify-between items-center bg-indigo-50 rounded-xl px-4 py-3">
              <span className="text-indigo-800 font-medium">Total Gratuity</span>
              <span className="text-indigo-700 font-bold text-lg">{formatINR(result.gratuity)}</span>
            </div>
            <div className="flex justify-between items-center bg-green-50 rounded-xl px-4 py-3">
              <span className="text-green-800 font-medium">Tax-Exempt (Sec 10(10))</span>
              <span className="text-green-700 font-bold text-lg">{formatINR(result.exempt)}</span>
            </div>
            {result.taxable > 0 && (
              <div className="flex justify-between items-center bg-red-50 rounded-xl px-4 py-3">
                <span className="text-red-800 font-medium">Taxable Amount</span>
                <span className="text-red-700 font-bold text-lg">{formatINR(result.taxable)}</span>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">Max exemption: ₹20,00,000 under Section 10(10). Gratuity is payable after 5+ years of continuous service.</p>
          </div>
        </div>
      )}
    </div>
  );
}
