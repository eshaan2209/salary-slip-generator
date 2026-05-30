import { useState } from 'react';
import { formatINR } from './SalaryCalculator.js';

export default function PFCalculator() {
  const [basic, setBasic] = useState('');
  const [result, setResult] = useState(null);

  const calculate = () => {
    const b = Math.round(+basic);
    if (!b || b <= 0) return;
    const pfBasicCapped = Math.min(b, 15000);
    const employeePF = Math.round(pfBasicCapped * 0.12);
    const employerPF = Math.round(pfBasicCapped * 0.12);
    const totalPF = employeePF + employerPF;
    const annualEmployeePF = employeePF * 12;
    const annualEmployerPF = employerPF * 12;
    const annualTotal = totalPF * 12;

    setResult({
      pfBasicCapped,
      employeePF,
      employerPF,
      totalPF,
      annualEmployeePF,
      annualEmployerPF,
      annualTotal,
      isCapped: b > 15000,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Basic Salary (₹)</label>
        <input type="number" value={basic} onChange={e => setBasic(e.target.value)}
          placeholder="50000"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <button onClick={calculate}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-base shadow-sm">
        Calculate PF
      </button>

      {result && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-indigo-700 text-white px-5 py-3">
            <h3 className="font-semibold">PF Breakdown</h3>
          </div>
          {result.isCapped && (
            <div className="bg-yellow-50 border-b border-yellow-100 px-5 py-2">
              <p className="text-yellow-700 text-xs">Basic exceeds ₹15,000 cap. PF calculated on ₹15,000.</p>
            </div>
          )}
          <table className="w-full text-sm">
            <tbody>
              <Row label="PF Basic (capped at ₹15,000)" value={result.pfBasicCapped} />
              <Row label="Employee PF (12%)" value={result.employeePF} highlight />
              <Row label="Employer PF (12%)" value={result.employerPF} />
              <Row label="Total Monthly PF" value={result.totalPF} bold />
              <Row label="Annual Employee PF" value={result.annualEmployeePF} />
              <Row label="Annual Employer PF" value={result.annualEmployerPF} />
              <Row label="Total Annual PF" value={result.annualTotal} bold />
            </tbody>
          </table>
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">PF earns ~8.25% interest p.a. and is tax-exempt under Section 80C (up to ₹1.5 lakh).</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight, bold }) {
  return (
    <tr className="border-b border-gray-50 last:border-0">
      <td className={`px-5 py-3 ${highlight ? 'text-indigo-600' : 'text-gray-500'}`}>{label}</td>
      <td className={`px-5 py-3 text-right ${bold ? 'font-bold text-gray-900' : highlight ? 'font-semibold text-indigo-600' : 'text-gray-800 font-medium'}`}>{formatINR(value)}</td>
    </tr>
  );
}
