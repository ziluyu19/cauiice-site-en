'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitch() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith('/en');

  const zhSiteUrl = process.env.NEXT_PUBLIC_ZH_SITE_URL || 'http://localhost:3000';

  return (
    <div className="inline-flex items-center rounded-full bg-[#E9F0F8] p-1 text-xs font-medium">
      <a
        href={zhSiteUrl}
        className={`px-3 py-1 rounded-full transition-colors ${
          !isEnglish
            ? 'bg-[#1B4F8C] text-white shadow-xs'
            : 'text-[#595959] hover:text-[#1A1A1A]'
        }`}
        title="跳转至中文主站"
      >
        中文
      </a>
      <Link
        href="/en"
        className={`px-3 py-1 rounded-full transition-colors ${
          isEnglish
            ? 'bg-[#1B4F8C] text-white shadow-xs'
            : 'text-[#595959] hover:text-[#1A1A1A]'
        }`}
        title="Switch to English Portal"
      >
        EN
      </Link>
    </div>
  );
}
