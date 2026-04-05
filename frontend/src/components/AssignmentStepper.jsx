const steps = ['Draft', 'Published', 'Completed'];

const AssignmentStepper = ({ status }) => {
  const activeIndex = steps.indexOf(status);

  return (
    <div className="mt-4 flex items-center gap-2">
      {steps.map((step, index) => {
        const isActive = index <= activeIndex;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                isActive ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {index + 1}
            </div>
            <span className={`text-xs ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
            {index < steps.length - 1 && (
              <div className={`h-0.5 w-6 ${index < activeIndex ? 'bg-brand-500' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AssignmentStepper;
