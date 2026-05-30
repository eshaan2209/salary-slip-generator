import { useState } from 'react';
import { formatINR, calculateSalary } from './SalaryCalculator.js';

export default function BulkCSVGenerator() {
  const [csvData, setCsvData] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const exampleCSV = `employeeName,employeeId,designation,department,ctc,city,basicPercent
Rahul Sharma,EMP-001,Senior Engineer,Engineering,600000,Delhi,40
Priya Patel,EMP-002,Product Manager,Product,900000,Mumbai,45
Amit Singh,EMP-003,Designer,Design,480000,Bangalore,40
Neha Gupta,EMP-004,Marketing Lead,Marketing,720000,Delhi,40`;

  const parseCSV = () => {
    setError('');
    if (!csvData.trim()) { setError('Paste CSV data first'); return; }

    const lines = csvData.trim().split('\n');
    if (lines.length < 2) { setError('CSV needs at least a header + 1 data row'); return; }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const required = ['employeename', 'ctc'];
    const missing = required.filter(r => !headers.includes(r));
    if (missing.length) { setError(`Missing columns: ${missing.join(', ')}`); return; }

    const parsed = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((h, idx) => row[h] = vals[idx] || '');

      const ctc = +row.ctc;
      if (!ctc || ctc <= 0) continue;

      const result = calculateSalary({
        ctc,
        city: row.city || 'Delhi',
        basicPercent: +(row.basicpercent || 40),
        pfEnabled: true,
        esiEnabled: true,
        professionalTax: true,
      });

      parsed.push({
        name: row.employeename || `Employee ${i}`,
        id: row.employeeid || '',
        designation: row.designation || '',
        department: row.department || '',
        ctc,
        ...result,
      });
    }

    if (parsed.length === 0) { setError('No valid rows found'); return; }
    setResults(parsed);
  };

  const downloadCSV = () => {
    if (!results) return;
    const header = 'Employee Name,Employee ID,Designation,Department,Monthly CTC,Basic,HRA,Conveyance,Medical,Special Allowance,Gross Earnings,PF,ESI,Prof Tax,Total Deductions,Net Salary';
    const rows = results.map(r => [
      r.name, r.id, r.designation, r.department,
      r.summary.monthlyCtc, r.earnings.basic, r.earnings.hra, r.earnings.conveyance,
      r.earnings.medical, r.earnings.specialAllowance, r.summary.grossEarnings,
      r.deductions.employeePF, r.deductions.employeeESI, r.deductions.professionalTax,
      r.summary.totalDeductions, r.summary.netSalary
    ].join(','));
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'salary-bulk-calculation.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paste CSV Data</label>
        <textarea value={csvData} onChange={e => setCsvData(e.target.value)} rows={8}
          placeholder="employeeName,employeeId,designation,department,ctc,city,basicPercent&#10;Rahul Sharma,EMP-001,Senior Engineer,Engineering,600000,Delhi,40"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <div className="flex gap-3 mt-2">
          <button onClick={() => setCsvData(exampleCSV)} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Load example data</button>
          <button onClick={() => { setCsvData(''); setResults(null); }} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button onClick={parseCSV}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-base shadow-sm">
        Generate Bulk Slips ({csvData.split('\n').length - 1} employees)
      </button>

      {results && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{results.length} employees processed</p>
            <button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
              Download CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                  <th className="px-3 py-2 font-medium text-gray-600 dark:text-gray-300">Employee</th>
                  <th className="px-3 py-2 font-medium text-gray-600 dark:text-gray-300">Monthly CTC</th>
                  <th className="px-3 py-2 font-medium text-gray-600 dark:text-gray-300">Gross</th>
                  <th className="px-3 py-2 font-medium text-gray-600 dark:text-gray-300">Deductions</th>
                  <th className="px-3 py-2 font-medium text-gray-600 dark:text-gray-300">Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="px-3 py-2">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.id} &middot; {r.designation}</p>
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{formatINR(r.summary.monthlyCtc)}</td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{formatINR(r.summary.grossEarnings)}</td>
                    <td className="px-3 py-2 text-red-600 dark:text-red-400">{formatINR(r.summary.totalDeductions)}</td>
                    <td className="px-3 py-2 font-semibold text-gray-900 dark:text-gray-100">{formatINR(r.summary.netSalary)}</td>
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
