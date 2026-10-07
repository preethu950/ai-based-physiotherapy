import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DisclaimerBannerProps {
  variant?: 'compact' | 'full';
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ variant = 'full' }) => {
  const text = "PhysioAI provides AI-assisted exercise-form feedback and rehabilitation tracking. It is not a medical diagnosis tool and does not replace assessment, treatment, or supervision from a qualified physiotherapist or other healthcare professional. Stop exercising and seek appropriate professional advice if an exercise causes significant pain, dizziness, or other concerning symptoms.";

  if (variant === 'compact') {
    return (
      <div className="flex items-start gap-2 p-3 bg-surface rounded-lg text-xs text-navy-light">
        <AlertCircle size={14} className="shrink-0 mt-0.5" />
        <p>{text}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-surface-alt rounded-xl p-4 md:p-6 flex gap-4 items-start">
      <div className="p-2 bg-white rounded-full shrink-0">
        <AlertCircle className="text-navy" size={24} />
      </div>
      <div>
        <h4 className="font-semibold text-navy mb-1">Medical Disclaimer</h4>
        <p className="text-sm text-navy-light leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
};
