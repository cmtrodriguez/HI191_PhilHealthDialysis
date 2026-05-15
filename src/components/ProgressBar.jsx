import React from 'react';

const steps = [
  { id: 1, label: 'Patient Info' },
  { id: 2, label: 'Address & Contact' },
  { id: 3, label: 'Benefits & History' },
  { id: 4, label: 'Dialysis Details' },
  { id: 5, label: 'Confirmation' },
];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="progress-bar" role="navigation" aria-label="Form steps">
      {steps.map((step, index) => {
        const status = step.id < currentStep ? 'completed' : step.id === currentStep ? 'active' : 'pending';
        return (
          <React.Fragment key={step.id}>
            <div className={`progress-step progress-step--${status}`}>
              <div className="progress-step-circle" aria-current={step.id === currentStep ? 'step' : undefined}>
                {status === 'completed' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className="progress-step-label">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`progress-connector ${step.id < currentStep ? 'progress-connector--done' : ''}`} aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
