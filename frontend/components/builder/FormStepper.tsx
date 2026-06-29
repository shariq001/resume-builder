export function FormStepper({ currentStep, steps, onStepClick }: { currentStep: number, steps: string[], onStepClick?: (index: number) => void }) {
  return (
    <div className="flex items-center w-full overflow-x-auto pb-4 hide-scrollbar">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-shrink-0">
          <button 
            onClick={() => onStepClick && onStepClick(index)}
            className={`group flex items-center focus:outline-none ${onStepClick ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-all duration-300
              ${index < currentStep ? 'bg-primary border-primary text-white shadow-[0_0_10px_var(--color-primary)]' : 
                index === currentStep ? 'border-primary text-primary shadow-[0_0_10px_var(--color-primary)]' : 'border-border text-foreground opacity-50'}
              ${onStepClick ? 'group-hover:border-primary group-hover:opacity-100' : ''}
            `}>
              {index + 1}
            </div>
            <span className={`ml-2 text-sm font-medium transition-colors duration-300 ${index <= currentStep ? 'text-foreground font-bold' : 'text-foreground opacity-50'} ${onStepClick ? 'group-hover:text-primary group-hover:opacity-100' : ''}`}>
              {step}
            </span>
          </button>
          {index < steps.length - 1 && (
            <div className={`w-8 h-px mx-2 transition-colors duration-300 ${index < currentStep ? 'bg-primary shadow-[0_0_5px_var(--color-primary)]' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
