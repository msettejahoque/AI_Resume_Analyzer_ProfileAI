/* eslint-disable react/no-unescaped-entities */
'use client';
import { useEffect, useState } from 'react';

const STEPS = [
  { label: 'Reading your resume', delay: 0 },
  { label: 'Analyzing job requirements', delay: 2500 },
  { label: 'Checking ATS keywords', delay: 5000 },
  { label: 'Generating recommendations', delay: 7500 },
  { label: 'Writing your cover letter', delay: 10000 },
];

export default function AnalysisLoader() {
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    const timers = STEPS.map((step, index) =>
      setTimeout(() => {
        setActiveStep(index);
      }, step.delay)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-[rgba(59,130,246,.2)]"
        style={{ background: 'rgba(59,130,246,.08)' }}
      >
        <svg
          className="w-8 h-8 animate-spin text-brand"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>

      {/* Title */}
      <h2 className="text-[22px] font-extrabold text-text-primary tracking-[-0.02em] mb-2">
        Analyzing your resume
      </h2>
      <p className="text-sm text-text-muted mb-10">
        Please don't close or refresh this page
      </p>

      {/* Steps */}
      <div className="flex flex-col gap-3 w-full max-w-85">
        {STEPS.map((step, index) => {
          const isDone = index < activeStep;
          const isActive = index === activeStep;
          const isPending = index > activeStep;

          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 transition-all duration-500 ${
                isPending ? 'opacity-30' : 'opacity-100'
              }`}
            >
              {/* Step indicator */}
              <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                {isDone ? (
                  // checkmark
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth={2.5}
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                ) : isActive ? (
                  // spinning
                  <svg
                    className="w-5 h-5 animate-spin text-brand"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  // pending dot
                  <div className="w-5 h-5 rounded-full border-2 border-border-default" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-sm font-medium ${
                  isDone
                    ? 'text-success'
                    : isActive
                      ? 'text-text-primary'
                      : 'text-text-muted'
                }`}
              >
                {step.label}
                {isActive && (
                  <span className="text-text-muted font-normal"> ...</span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Time estimate */}
      <p className="text-xs text-text-muted mt-10">
        This usually takes 10–15 seconds
      </p>
    </div>
  );
}


