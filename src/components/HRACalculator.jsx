import { useState } from 'react';
import { METRO_CITIES, formatINR } from './SalaryCalculator.js';

export default function HRACalculator() {
  const [form, setForm] = useState({
    basic: '',
    hraReceived: '',
    rentPaid: '',
    city: 'Delhi',
  });
  const [result, setResult] = useState(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const calculate = () => {
    const basic = Math.round(+form.basic);
    const hraReceived = Math.round(+form.hraReceived);
    const rentPaid = Math.round(+form.rentPaid);
    if (!basic || !hraReceived || !rentPaid) return;

    const isMetro = METRO_CITIES.includes(form.city);
    const hraPercent = isMetro ? 0.50 : 0.40;

    const a = hraReceived;
    const b = Math.round(basic * hraPercent);
    const c = Math.max(Math.round(rentPaid - basic * 0.10), 0);

    const exemptHRA = Math.min(a, b, c);
    const taxableHRA = Math.max(hraReceived - exemptHRA, 0);

    setResult({ a, b, c, exemptHRA, taxableHRA, isMetro });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Basic Salary (₹)</label>
          <input type="number" value={form.basic} onChange={e => set('basic', e.target.value)}
            placeholder="50000"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly HRA Received (₹)</label>
          <input type="number" value={form.hraReceived} onChange={e => set('hraReceived', e.target.value)}
            placeholder="20000"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent Paid (₹)</label>
          <input type="number" value={form.rentPaid} onChange={e => set('rentPaid', e.target.value)}
            placeholder="15000"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City of Residence</label>
          <select value={form.city} onChange={e => set('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="Delhi">Delhi (Metro - 50%)</option>
            <option value="Mumbai">Mumbai (Metro - 50%)</option>
            <option value="Kolkata">Kolkata (Metro - 50%)</option>
            <option value="Chennai">Chennai (Metro - 50%)</option>
            <option value="Bangalore">Bangalore (Non-Metro - 40%)</option>
            <option value="Hyderabad">Hyderabad (Non-Metro - 40%)</option>
            <option value="Pune">Pune (Non-Metro - 40%)</option>
            <option value="Other">Other (Non-Metro - 40%)</option>
          </select>
        </div>
      </div>
      <button onClick={calculate}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-base shadow-sm">
        Calculate HRA Exemption
      </button>

      {result && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-green-50 border-b border-green-100 px-5 py-3">
            <h3 className="font-semibold text-green-800">HRA Exemption Calculation</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">HRA exemption is the minimum of:</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">(a) Actual HRA received</span>
                  <span className="font-medium">{formatINR(result.a)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">(b) {result.isMetro ? '50%' : '40%'} of Basic ({result.isMetro ? 'Metro' : 'Non-Metro'})</span>
                  <span className="font-medium">{formatINR(result.b)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">(c) Rent paid - 10% of Basic</span>
                  <span className="font-medium">{formatINR(result.c)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center bg-green-50 rounded-xl px-4 py-3">
              <span className="text-green-800 font-medium">Exempt HRA (Tax-free)</span>
              <span className="text-green-700 font-bold text-lg">{formatINR(result.exemptHRA)}</span>
            </div>
            <div className="flex justify-between items-center bg-red-50 rounded-xl px-4 py-3">
              <span className="text-red-800 font-medium">Taxable HRA</span>
              <span className="text-red-700 font-bold text-lg">{formatINR(result.taxableHRA)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
