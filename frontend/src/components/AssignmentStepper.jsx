import { Check } from 'lucide-react';

const steps = ['Draft', 'Published', 'Completed'];

const AssignmentStepper = ({ status }) => {
  const activeIndex = steps.indexOf(status);
  const progressPercent = activeIndex <= 0 ? 0 : (activeIndex / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-sm">
      <div className="relative">
        <div className="absolute left-[16.6667%] right-[16.6667%] top-3 sm:top-4 h-1 rounded-full bg-slate-100" />
        <div
          className="absolute left-[16.6667%] top-3 sm:top-4 h-1 rounded-full bg-flux-blue transition-all"
          style={{ width: `${(2 / 3) * progressPercent}%` }}
        />

        <div className="grid grid-cols-3 items-center">
          {steps.map((step, index) => {
            const isActive = index <= activeIndex;
            const isCompletedStep = index < activeIndex;

            return (
              <div key={step} className="flex justify-center">
                <div
                  className={`flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs font-bold transition-colors z-10 ${
                    isActive
                      ? 'bg-flux-blue text-white shadow-md shadow-flux-blue/20'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompletedStep ? <Check size={14} className="sm:w-4 sm:h-4" /> : index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 items-center">
        {steps.map((step, index) => {
          const isActive = index <= activeIndex;
          return (
            <span
              key={step}
              className={`text-center text-[10px] sm:text-xs font-semibold ${
                isActive ? 'text-flux-navy' : 'text-slate-400'
              }`}
            >
              {step}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default AssignmentStepper;
