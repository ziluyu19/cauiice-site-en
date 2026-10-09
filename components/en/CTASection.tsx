'use client';

import React from 'react';
import Link from 'next/link';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  className?: string;
}

export default function CTASection({
  title = '携手开启全球高水平产学研合作新篇章',
  subtitle = 'Global Academic-Industry Collaboration',
  description = '我们诚挚邀请全球高校、科研机构及创新型跨国企业加入国专委合作生态网络，共同推动科技成果跨国转移转化。',
  primaryButtonText = '提交合作意向 (Enquiry)',
  primaryButtonHref = '/en/cooperation/enquiry',
  secondaryButtonText = '浏览会员网络 (Our Network)',
  secondaryButtonHref = '/en/network',
  className = '',
}: CTASectionProps) {
  return (
    <section className={`bg-[#0F3A6B] text-white py-16 sm:py-20 relative overflow-hidden ${className}`}>
      {/* 装饰底纹 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          {subtitle}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4 max-w-3xl mx-auto leading-tight">
          {title}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={primaryButtonHref}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold bg-white text-[#0F3A6B] hover:bg-slate-100 transition-colors shadow-md"
          >
            {primaryButtonText}
          </Link>
          {secondaryButtonText && (
            <Link
              href={secondaryButtonHref}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
