export const METRO_CITIES = ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'];

export function calculateSalary({ ctc, city, basicPercent = 40, pfEnabled = true, esiEnabled = true, professionalTax = true }) {
  const monthlyCtc = ctc / 12;

  const basic = Math.round(monthlyCtc * (basicPercent / 100));
  const hra = Math.round(basic * (METRO_CITIES.includes(city) ? 0.50 : 0.40));
  const conveyance = 1600;
  const medical = 1250;
  const specialAllowance = Math.round(monthlyCtc - basic - hra - conveyance - medical - (pfEnabled ? basic * 0.12 : 0));

  const grossEarnings = basic + hra + conveyance + medical + Math.max(specialAllowance, 0);

  const pfBasicCapped = Math.min(basic, 15000);
  const employeePF = pfEnabled ? Math.round(pfBasicCapped * 0.12) : 0;
  const employerPF = pfEnabled ? Math.round(pfBasicCapped * 0.12) : 0;

  const employeeESI = (esiEnabled && grossEarnings <= 21000) ? Math.round(grossEarnings * 0.0075) : 0;
  const pt = professionalTax ? 200 : 0;
  const tds = 0;

  const totalDeductions = employeePF + employeeESI + pt + tds;
  const netSalary = grossEarnings - totalDeductions;

  return {
    earnings: {
      basic,
      hra,
      conveyance,
      medical,
      specialAllowance: Math.max(specialAllowance, 0),
    },
    deductions: {
      employeePF,
      employeeESI,
      professionalTax: pt,
      tds,
    },
    summary: {
      grossEarnings,
      totalDeductions,
      netSalary,
      employerPF,
      monthlyCtc: Math.round(monthlyCtc),
    }
  };
}

export function numberToWords(num) {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n) {
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + units[n % 10] : '');
    if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  }

  return convert(Math.round(num)) + ' Only';
}

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
