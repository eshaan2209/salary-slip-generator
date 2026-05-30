import { useState } from 'react';
import { formatINR, calculateSalary } from './SalaryCalculator.js';

export default function SalaryOfferComparison() {
  const [offerA, setOfferA] = useState({ name: 'Offer A', ctc: '', city: 'Delhi', basicPercent: 40 });
  const [offerB, setOfferB] = useState({ name: 'Offer B', ctc: '', city: 'Delhi', basicPercent: 40 });
  const [resultA, setResultA] = useState(null);
  const [resultB, setResultB] = useState(null);

  const setA = (k, v) => setOfferA(o => ({ ...o, [k]: v }));
  const setB = (k, v) => setOfferB(o => ({ ...o, [k]: v }));

  const compare = () => {
    const a = +offerA.ctc;
    const b = +offerB.ctc;
    if (!a || !b || a <= 0 || b <= 0) return;
    setResultA(calculateSalary({ ctc: a, city: offerA.city, basicPercent: +offerA.basicPercent, pfEnabled: true, esiEnabled: true, professionalTax: true }));
    setResultB(calculateSalary({ ctc: b, city: offerB.city, basicPercent: +offerB.basicPercent, pfEnabled: true, esiEnabled: true, professionalTax: true }));
  };

  const OfferCard = ({ offer, set, result, color }) => (
    <div className={`bg-white dark:bg-gray-900 border-2 ${color} rounded-2xl overflow-hidden`}>
      <div className={`px-5 py-3 text-white font-semibold`} style={{ backgroundColor: color === 'border-indigo-500' ? '#6366f1' : '#f59e0b' }}>
        {offer.name}
      </div>
      <div className="p-5 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Label</label>
          <input value={offer.name} onChange={e => set('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Annual CTC (₹)</label>
          <input type="number" value={offer.ctc} onChange={e => set('ctc', e.target.value)} placeholder="800000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">City</label>
          <select value={offer.city} onChange={e => set('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="Delhi">Delhi (Metro)</option>
            <option value="Mumbai">Mumbai (Metro)</option>
            <option value="Bangalore">Bangalore (Non-Metro)</option>
            <option value="Other">Other (Non-Metro)</option>
          </select>
        </div>
        {result && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Monthly CTC</span><span className="font-medium">{formatINR(result.summary.monthlyCtc)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Gross Earnings</span><span className="font-medium">{formatINR(result.summary.grossEarnings)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total Deductions</span><span className="font-medium text-red-600">{formatINR(result.summary.totalDeductions)}</span></div>
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2"><span className="font-semibold">Net Take Home</span><span className="font-bold text-lg text-green-600 dark:text-green-400">{formatINR(result.summary.netSalary)}</span></div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OfferCard offer={offerA} set={setA} result={resultA} color="border-indigo-500" />
        <OfferCard offer={offerB} set={setB} result={resultB} color="border-amber-500" />
      </div>

      <button onClick={compare}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-base shadow-sm">
        Compare Offers
      </button>

      {resultA && resultB && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Comparison Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div></div>
            <div className="text-indigo-600 dark:text-indigo-400 font-medium">{offerA.name}</div>
            <div className="text-amber-600 dark:text-amber-400 font-medium">{offerB.name}</div>

            <div className="text-left text-gray-500">Annual CTC</div>
            <div>{formatINR(+offerA.ctc)}</div>
            <div>{formatINR(+offerB.ctc)}</div>

            <div className="text-left text-gray-500">Monthly Net</div>
            <div className="font-medium">{formatINR(resultA.summary.netSalary)}</div>
            <div className="font-medium">{formatINR(resultB.summary.netSalary)}</div>

            <div className="text-left text-gray-500">Annual Net</div>
            <div className="font-medium">{formatINR(resultA.summary.netSalary * 12)}</div>
            <div className="font-medium">{formatINR(resultB.summary.netSalary * 12)}</div>

            <div className="text-left text-gray-500">PF (Employer)</div>
            <div>{formatINR(resultA.summary.employerPF)}</div>
            <div>{formatINR(resultB.summary.employerPF)}</div>
          </div>

          <div className={`mt-6 p-4 rounded-xl text-center ${resultA.summary.netSalary > resultB.summary.netSalary ? 'bg-indigo-50 dark:bg-indigo-900/20' : resultB.summary.netSalary > resultA.summary.netSalary ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {resultA.summary.netSalary === resultB.summary.netSalary
                ? 'Both offers give the same take-home pay'
                : `Higher take-home: ${resultA.summary.netSalary > resultB.summary.netSalary ? offerA.name : offerB.name} (+${formatINR(Math.abs(resultA.summary.netSalary - resultB.summary.netSalary))}/month)`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
