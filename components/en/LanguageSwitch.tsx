'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitch() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith('/en');

  return (
    <div className="inline-flex items-center rounded-full bg-[#E9F0F8] p-1 text-xs font-medium">
      <Link
        href="/"
        className={`px-3 py-1 rounded-full transition-colors ${
          !isEnglish
            ? 'bg-[#1B4F8C] text-white shadow-xs'
            : 'text-[#595959] hover:text-[#1A1A1A]'
        }`}
        title="返回中文主站"
      >
        中文
      </Link>
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
