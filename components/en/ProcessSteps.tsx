'use client';

import React from 'react';
import { HOW_IT_WORKS, ProcessStepItem } from '@/lib/enData';

interface ProcessStepsProps {
  steps?: ProcessStepItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function ProcessSteps({
  steps = HOW_IT_WORKS,
  title = '标准化、高合规的国际合作落地全流程',
  subtitle = 'How It Works',
  className = '',
}: ProcessStepsProps) {
  return (
    <section className={`py-16 sm:py-20 bg-white ${className}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1B4F8C] block mb-2">
            {subtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={step.step}
              className="relative bg-slate-50 border border-slate-200/80 rounded-xl p-6 hover:border-[#1B4F8C] transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1B4F8C]/30 group-hover:text-[#1B4F8C] transition-colors font-mono">
                    {step.step}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#E9F0F8] text-[#1B4F8C] text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1A1A1A] mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-[#595959] leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 text-[11px] text-[#1B4F8C] font-medium bg-white/70 p-2.5 rounded-md">
                {step.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
