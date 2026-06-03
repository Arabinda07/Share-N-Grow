import React from 'react';

interface Step {
  label: string;
}

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps?: Step[];
  activeColor?: string;
}

export function WizardProgress({ currentStep, totalSteps, steps, activeColor = 'bg-ink' }: WizardProgressProps) {
  return (
    <>
      <div className="flex items-center gap-2 mt-8 max-w-sm">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          return (
            <div key={step} className="flex-1 h-2 rounded-full bg-whisper overflow-hidden flex">
              <div 
                className={`h-full ${activeColor} transition-all duration-500 ease-out`}
                style={{ width: currentStep >= step ? '100%' : '0%' }}
              />
            </div>
          );
        })}
      </div>
      {steps && steps.length === totalSteps && (
        <div className="flex justify-between max-w-sm mt-2">
            {steps.map((s, index) => (
              <span key={index} className={`text-xs font-medium ${currentStep >= index + 1 ? 'text-ink' : 'text-ink-light'}`}>
                {s.label}
              </span>
            ))}
        </div>
      )}
    </>
  );
}
