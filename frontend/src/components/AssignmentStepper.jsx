import { Check } from 'lucide-react';

const steps = ['Draft', 'Published', 'Completed'];

const AssignmentStepper = ({ status }) => {
  const activeIndex = steps.indexOf(status);

  return (
    <div className="flex items-center w-full max-w-sm">
      {steps.map((step, index) => {
        const isActive = index <= activeIndex;
        const isCompletedStep = index < activeIndex;

        return (
          <div key={step} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex flex-col items-center relative">
                <div
                className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold transition-colors z-10 ${
                    isActive ? 'bg-flux-blue text-white shadow-md shadow-flux-blue/20' : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
                >
                {isCompletedStep ? <Check size={14} className="sm:w-4 sm:h-4" /> : index + 1}
                </div>
                <span className={`absolute -bottom-5 text-[10px] sm:text-xs font-semibold whitespace-nowrap ${isActive ? 'text-flux-navy' : 'text-slate-400'}`}>
                    {step}
                </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 px-2 mb-5">
                <div className={`h-1 w-full rounded-full transition-colors ${index < activeIndex ? 'bg-flux-blue' : 'bg-slate-100'}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AssignmentStepper;
