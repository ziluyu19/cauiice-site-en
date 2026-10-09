'use client';

import React, { useState } from 'react';
import { FAQ_DATA, FAQItem } from '@/lib/enData';

interface FAQProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function FAQ({
  items = FAQ_DATA,
  title = '常见问题与答疑 (Frequently Asked Questions)',
  subtitle = 'Cooperation FAQ',
  className = '',
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {subtitle && (
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1B4F8C] block mb-1">
              {subtitle}
            </span>
          )}
          {title && (
            <h3 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              {title}
            </h3>
          )}
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={item.question}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-sm sm:text-base font-bold text-[#1A1A1A] flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#E9F0F8] text-[#1B4F8C] text-xs flex items-center justify-center shrink-0 font-bold">
                    Q
                  </span>
                  <span>{item.question}</span>
                </span>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#1B4F8C]' : ''}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#595959] leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  <div className="pt-2">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
