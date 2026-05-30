import { useState } from 'react';
import SalaryForm from './SalaryForm.jsx';
import SlipPreview from './SlipPreview.jsx';

export default function SalarySlipApp() {
  const [slipData, setSlipData] = useState(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div>
        <SalaryForm onCalculate={setSlipData} />
      </div>
      <div className="lg:sticky lg:top-8">
        {slipData ? (
          <SlipPreview data={slipData} />
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl h-96 flex flex-col items-center justify-center text-center p-8">
            <div className="text-5xl mb-4">&#128196;</div>
            <p className="text-gray-500 text-lg font-medium">Your salary slip will appear here</p>
            <p className="text-gray-400 text-sm mt-2">Fill in the form and click Generate</p>
          </div>
        )}
      </div>
    </div>
  );
}
