'use client';

import React from 'react';
import Link from 'next/link';
import { NewsItem } from '@/lib/enData';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  const getCategoryBadgeClass = (category: NewsItem['category']) => {
    switch (category) {
      case 'work_updates':
        return 'bg-blue-50 text-[#1B4F8C] border-blue-200';
      case 'events':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'policy_insights':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <article className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all hover:border-[#1B4F8C]/60 flex flex-col justify-between group">
      <div>
        {/* 缩略图区域 */}
        <div className="h-44 bg-slate-100 flex items-center justify-center relative overflow-hidden border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-white shadow-xs flex items-center justify-center p-3 text-[#1B4F8C] group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryBadgeClass(news.category)}`}>
            {news.categoryName}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span>📅 {news.date}</span>
            {news.readTime && <span>⏱️ {news.readTime}</span>}
          </div>

          <h3 className="text-base font-bold text-[#1A1A1A] group-hover:text-[#1B4F8C] transition-colors leading-snug mb-2 line-clamp-2">
            <Link href={`/en/news/${encodeURIComponent(news.id)}`} className="hover:underline">
              {news.title}
            </Link>
          </h3>

          <p className="text-xs text-[#595959] leading-relaxed line-clamp-3">
            {news.summary}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2">
        <Link
          href={`/en/news/${encodeURIComponent(news.id)}`}
          className="inline-flex items-center text-xs font-semibold text-[#1155CC] group-hover:translate-x-0.5 transition-transform"
        >
          查看全文
          <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
