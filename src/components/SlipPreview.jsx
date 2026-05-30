import { useRef } from 'react';
import { numberToWords, formatINR } from './SalaryCalculator.js';

export default function SlipPreview({ data }) {
  const slipRef = useRef(null);
  const { form, result } = data;
  const { earnings, deductions, summary } = result;

  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    const { default: html2canvas } = await import('html2canvas');
    const { default: jsPDF } = await import('jspdf');

    const canvas = await html2canvas(slipRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`salary-slip-${form.employeeName.replace(/\s+/g, '-')}-${form.month}-${form.year}.pdf`);
  };

  const ratio = form.paidDays / form.workingDays;
  const adjustedEarnings = {
    basic: Math.round(earnings.basic * ratio),
    hra: Math.round(earnings.hra * ratio),
    conveyance: Math.round(earnings.conveyance * ratio),
    medical: Math.round(earnings.medical * ratio),
    specialAllowance: Math.round(earnings.specialAllowance * ratio),
  };
  const adjustedGross = Object.values(adjustedEarnings).reduce((a, b) => a + b, 0);
  const adjustedNet = adjustedGross - summary.totalDeductions;

  return (
    <div>
      <div className="flex gap-3 mb-6 print:hidden">
        <button onClick={handlePrint}
          className="flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-2.5 rounded-xl transition-colors text-sm">
          Print
        </button>
        <button onClick={handleDownloadPDF}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-sm">
          Download PDF
        </button>
      </div>

      <div ref={slipRef} id="salary-slip"
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm print:shadow-none print:border-0 print:rounded-none font-sans">

        <div className="bg-indigo-700 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              {form.companyLogo && (
                <img src={form.companyLogo} alt="Logo" className="h-12 mb-2 object-contain" />
              )}
              <h1 className="text-xl font-bold">{form.companyName || 'Company Name'}</h1>
              <p className="text-indigo-200 text-sm mt-0.5">{form.companyAddress}</p>
            </div>
            <div className="text-right">
              <p className="text-indigo-200 text-xs uppercase tracking-widest">Salary Slip</p>
              <p className="text-white font-semibold text-lg">{form.month} {form.year}</p>
              {form.paymentDate && (
                <p className="text-indigo-200 text-xs mt-1">Paid on: {form.paymentDate}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-gray-100 border-b border-gray-200">
          {[
            ['Employee Name', form.employeeName],
            ['Employee ID', form.employeeId],
            ['Designation', form.designation],
            ['Department', form.department],
            ['Date of Joining', form.dateOfJoining],
            ['PAN Number', form.panNumber],
            ['PF Account No.', form.pfAccountNo],
            ['Bank & Account', form.bankName ? `${form.bankName} — ${form.accountNumber}` : form.accountNumber],
            ['Working Days', form.workingDays],
            ['Paid Days', form.paidDays],
          ].map(([label, val]) => val ? (
            <div key={label} className="bg-white px-4 py-2.5">
              <p className="text-gray-400 text-xs">{label}</p>
              <p className="text-gray-800 text-sm font-medium mt-0.5">{val}</p>
            </div>
          ) : null)}
        </div>

        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <div>
            <div className="bg-green-50 px-4 py-2 border-b border-gray-200">
              <p className="text-green-800 text-xs font-semibold uppercase tracking-wide">Earnings</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <Row label="Basic Salary" value={adjustedEarnings.basic} />
                <Row label="HRA" value={adjustedEarnings.hra} />
                <Row label="Conveyance Allowance" value={adjustedEarnings.conveyance} />
                <Row label="Medical Allowance" value={adjustedEarnings.medical} />
                <Row label="Special Allowance" value={adjustedEarnings.specialAllowance} />
              </tbody>
            </table>
          </div>

          <div>
            <div className="bg-red-50 px-4 py-2 border-b border-gray-200">
              <p className="text-red-800 text-xs font-semibold uppercase tracking-wide">Deductions</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {deductions.employeePF > 0 && <Row label="Provident Fund (PF)" value={deductions.employeePF} />}
                {deductions.employeeESI > 0 && <Row label="ESI" value={deductions.employeeESI} />}
                {deductions.professionalTax > 0 && <Row label="Professional Tax" value={deductions.professionalTax} />}
                {deductions.tds > 0 && <Row label="TDS (Income Tax)" value={deductions.tds} />}
                {Object.values(deductions).every(v => v === 0) && (
                  <tr><td colSpan={2} className="px-4 py-3 text-gray-400 text-xs">No deductions</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-gray-200 bg-gray-50 border-t border-gray-200">
          <div className="px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">Gross Earnings</span>
            <span className="text-sm font-bold text-gray-800">{formatINR(adjustedGross)}</span>
          </div>
          <div className="px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">Total Deductions</span>
            <span className="text-sm font-bold text-red-600">{formatINR(summary.totalDeductions)}</span>
          </div>
        </div>

        <div className="bg-indigo-700 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-xs uppercase tracking-widest">Net Salary (Take Home)</p>
              <p className="text-3xl font-bold mt-1">{formatINR(Math.max(adjustedNet, 0))}</p>
              <p className="text-indigo-200 text-xs mt-1 italic">
                {numberToWords(Math.max(adjustedNet, 0))}
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="text-indigo-300">Monthly CTC</p>
              <p className="font-semibold">{formatINR(summary.monthlyCtc)}</p>
              {result.summary.employerPF > 0 && (
                <>
                  <p className="text-indigo-300 mt-1">Employer PF</p>
                  <p className="font-semibold">{formatINR(summary.employerPF)}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex justify-between items-end border-t border-gray-100">
          <div>
            <p className="text-gray-400 text-xs">This is a computer-generated salary slip.</p>
            <p className="text-gray-400 text-xs">No signature required.</p>
          </div>
          <div className="text-right">
            <div className="border-t border-gray-400 pt-1 mt-8 w-40">
              <p className="text-gray-500 text-xs">Authorised Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <tr className="border-b border-gray-50 last:border-0">
      <td className="px-4 py-2.5 text-gray-500">{label}</td>
      <td className="px-4 py-2.5 text-gray-800 font-medium text-right">{formatINR(value)}</td>
    </tr>
  );
}
