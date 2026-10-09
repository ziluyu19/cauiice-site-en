'use client';

import React from 'react';
import { HOME_STATS, StatItem } from '@/lib/enData';

interface StatsSectionProps {
  stats?: StatItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function StatsSection({
  stats = HOME_STATS,
  title = '连接中国与全球产学研的核心创新网络',
  subtitle = 'Network in Numbers',
  className = '',
}: StatsSectionProps) {
  return (
    <section className={`py-12 sm:py-16 bg-[#E9F0F8]/40 border-y border-slate-200/70 ${className}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center max-w-2xl mx-auto mb-10">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex flex-col items-center text-center group"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1B4F8C] tracking-tight group-hover:scale-105 transition-transform mb-2">
                {item.value}
                {item.suffix && <span className="text-base font-bold text-[#595959] ml-1">{item.suffix}</span>}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#1A1A1A] mb-1">
                {item.label}
              </div>
              <p className="text-[11px] sm:text-xs text-[#595959] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
