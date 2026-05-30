import { useState } from 'react';
import { calculateSalary } from './SalaryCalculator.js';

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

const currentDate = new Date();

export default function SalaryForm({ onCalculate }) {
  const [form, setForm] = useState({
    companyName: '',
    companyAddress: '',
    companyLogo: null,
    employeeName: '',
    employeeId: '',
    designation: '',
    department: '',
    dateOfJoining: '',
    panNumber: '',
    pfAccountNo: '',
    esiNumber: '',
    bankName: '',
    accountNumber: '',
    ctc: '',
    city: 'Delhi',
    basicPercent: 40,
    month: MONTHS[currentDate.getMonth()],
    year: currentDate.getFullYear(),
    paymentDate: '',
    workingDays: 30,
    paidDays: 30,
    pfEnabled: true,
    esiEnabled: true,
    professionalTax: true,
  });

  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set('companyLogo', ev.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.companyName) e.companyName = 'Required';
    if (!form.employeeName) e.employeeName = 'Required';
    if (!form.ctc || isNaN(form.ctc) || +form.ctc <= 0) e.ctc = 'Enter a valid annual CTC';
    if (+form.paidDays > +form.workingDays) e.paidDays = 'Cannot exceed working days';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = calculateSalary({
      ctc: +form.ctc,
      city: form.city,
      basicPercent: +form.basicPercent,
      pfEnabled: form.pfEnabled,
      esiEnabled: form.esiEnabled,
      professionalTax: form.professionalTax,
    });
    onCalculate({ form, result });
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors[key] ? 'border-red-400' : 'border-gray-300'}`}
      />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section title="Company Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('Company Name *', 'companyName', 'text', 'Acme Technologies Pvt. Ltd.')}
          {field('Company Address', 'companyAddress', 'text', '123 MG Road, Bangalore')}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo (optional)</label>
          <input type="file" accept="image/*" onChange={handleLogoUpload}
            className="text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:text-sm file:bg-gray-50 hover:file:bg-gray-100" />
        </div>
      </Section>

      <Section title="Employee Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('Employee Name *', 'employeeName', 'text', 'Rahul Sharma')}
          {field('Employee ID', 'employeeId', 'text', 'EMP-1042')}
          {field('Designation', 'designation', 'text', 'Senior Software Engineer')}
          {field('Department', 'department', 'text', 'Engineering')}
          {field('Date of Joining', 'dateOfJoining', 'date')}
          {field('PAN Number', 'panNumber', 'text', 'ABCDE1234F')}
          {field('PF Account No.', 'pfAccountNo', 'text', 'MH/BAN/0012345')}
          {field('ESI Number', 'esiNumber', 'text', '1234567890')}
          {field('Bank Name', 'bankName', 'text', 'HDFC Bank')}
          {field('Account Number', 'accountNumber', 'text', '50100XXXXXXXX')}
        </div>
      </Section>

      <Section title="Salary Structure">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual CTC (₹) *</label>
            <input type="number" value={form.ctc} onChange={e => set('ctc', e.target.value)}
              placeholder="600000"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.ctc ? 'border-red-400' : 'border-gray-300'}`} />
            {errors.ctc && <p className="text-red-500 text-xs mt-1">{errors.ctc}</p>}
            {form.ctc && <p className="text-indigo-600 text-xs mt-1">Monthly: ₹{Math.round(form.ctc/12).toLocaleString('en-IN')}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City (for HRA %)</label>
            <select value={form.city} onChange={e => set('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="Delhi">Delhi (Metro — 50% HRA)</option>
              <option value="Mumbai">Mumbai (Metro — 50% HRA)</option>
              <option value="Kolkata">Kolkata (Metro — 50% HRA)</option>
              <option value="Chennai">Chennai (Metro — 50% HRA)</option>
              <option value="Bangalore">Bangalore (Non-Metro — 40% HRA)</option>
              <option value="Hyderabad">Hyderabad (Non-Metro — 40% HRA)</option>
              <option value="Pune">Pune (Non-Metro — 40% HRA)</option>
              <option value="Other">Other City (40% HRA)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Basic Salary: <span className="text-indigo-600 font-semibold">{form.basicPercent}%</span> of Monthly CTC
            </label>
            <input type="range" min="30" max="60" step="5" value={form.basicPercent}
              onChange={e => set('basicPercent', +e.target.value)}
              className="w-full accent-indigo-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>30%</span><span>45%</span><span>60%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <Toggle label="Provident Fund (PF)" value={form.pfEnabled} onChange={v => set('pfEnabled', v)} />
          <Toggle label="ESI (if applicable)" value={form.esiEnabled} onChange={v => set('esiEnabled', v)} />
          <Toggle label="Professional Tax" value={form.professionalTax} onChange={v => set('professionalTax', v)} />
        </div>
      </Section>

      <Section title="Pay Period">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select value={form.month} onChange={e => set('month', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select value={form.year} onChange={e => set('year', +e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {[2024,2025,2026,2027].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
            <input type="number" min="1" max="31" value={form.workingDays}
              onChange={e => set('workingDays', +e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid Days</label>
            <input type="number" min="1" max="31" value={form.paidDays}
              onChange={e => set('paidDays', +e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.paidDays ? 'border-red-400' : 'border-gray-300'}`} />
            {errors.paidDays && <p className="text-red-500 text-xs mt-1">{errors.paidDays}</p>}
          </div>
        </div>
        {field('Payment Date', 'paymentDate', 'date')}
      </Section>

      <button type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors text-base shadow-sm">
        Generate Salary Slip
      </button>
    </form>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
      <h3 className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div onClick={() => onChange(!value)}
        className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${value ? 'bg-indigo-600' : 'bg-gray-300'}`}>
        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
