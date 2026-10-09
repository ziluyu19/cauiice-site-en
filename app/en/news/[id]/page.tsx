'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchEnglishNewsById } from '@/lib/enFirestore';
import { NewsItem } from '@/lib/enData';

export default function NewsDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const newsId = typeof rawId === 'string'
    ? decodeURIComponent(rawId)
    : Array.isArray(rawId)
    ? decodeURIComponent(rawId[0])
    : '';

  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!newsId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchEnglishNewsById(newsId)
      .then((item) => {
        if (active) {
          setNews(item);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('[NewsDetailPage] fetch error:', err);
        if (active) {
          setNews(null);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [newsId]);

  const getCategoryBadgeClass = (category?: NewsItem['category']) => {
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
    <div className="py-10 sm:py-16 bg-slate-50/50 min-h-[calc(100vh-200px)]">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 面包屑导航 */}
        <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6 flex-wrap gap-y-1">
          <Link href="/en" className="hover:text-[#1B4F8C] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/en/news" className="hover:text-[#1B4F8C] transition-colors">News & Insights</Link>
          <span>/</span>
          <span className="text-[#1B4F8C] font-semibold truncate max-w-[240px] sm:max-w-md">
            {loading ? 'Loading...' : news ? news.title : 'Not Found'}
          </span>
        </nav>

        {/* 顶部快捷返回条 */}
        <div className="mb-6">
          <Link
            href="/en/news"
            className="inline-flex items-center text-xs font-semibold text-[#1B4F8C] hover:text-[#1155CC] transition-colors group"
          >
            <svg
              className="w-4 h-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回新闻列表 (Back to News Listing)
          </Link>
        </div>

        {/* 加载中状态 */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[#1B4F8C] border-t-transparent mb-4" />
            <p className="text-sm text-slate-500 font-medium">正在读取新闻详情 (Loading news article)...</p>
          </div>
        )}

        {/* 404 / 未找到内容状态 */}
        {!loading && !news && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-14 shadow-xs text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
              未找到相关新闻内容 (Article Not Found)
            </h2>
            <p className="text-sm text-[#595959] max-w-md mx-auto mb-8 leading-relaxed">
              抱歉，您访问的新闻内容不存在、已被归档或尚未公开发布。您可以返回新闻中心浏览最新工作动态与资讯。
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/en/news"
                className="px-5 py-2.5 rounded-lg bg-[#1B4F8C] text-white text-xs font-semibold hover:bg-[#153e6d] transition-colors shadow-xs"
              >
                ← 返回新闻中心 (Back to News Center)
              </Link>
              <Link
                href="/en"
                className="px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                返回英文首页 (Home)
              </Link>
            </div>
          </div>
        )}

        {/* 新闻详情正文卡片 */}
        {!loading && news && (
          <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {/* 顶部题头区 */}
            <header className="p-6 sm:p-10 border-b border-slate-100 bg-linear-to-b from-white to-slate-50/40">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(news.category)}`}>
                  {news.categoryName}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-mono">📅 {news.date}</span>
                {news.readTime && (
                  <>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">⏱️ 阅读时长：{news.readTime}</span>
                  </>
                )}
                <span className="text-xs text-slate-400 hidden sm:inline">·</span>
                <span className="text-xs text-slate-500 hidden sm:inline font-medium">CAUIICE Official</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] leading-tight tracking-tight mb-4">
                {news.title}
              </h1>

              {/* 核心摘要框 */}
              {news.summary && (
                <div className="p-4 sm:p-5 rounded-xl bg-[#E9F0F8]/60 border-l-4 border-[#1B4F8C] text-xs sm:text-sm text-[#1B4F8C] leading-relaxed font-normal">
                  <div className="font-bold text-[11px] uppercase tracking-wider text-[#1B4F8C]/80 mb-1">
                    核心摘要 (Executive Summary)
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {news.summary}
                  </p>
                </div>
              )}
            </header>

            {/* 新闻主体正文区 */}
            <div className="p-6 sm:p-10">
              <div className="prose prose-slate max-w-none">
                <div className="text-sm sm:text-base text-[#2B2B2B] leading-relaxed sm:leading-8 whitespace-pre-line space-y-4">
                  {news.content || news.summary}
                </div>
              </div>

              {/* 官方审定落款 */}
              <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
                <div>
                  <span className="font-semibold text-slate-600">发布主体：</span>
                  中国高校校办产业协会国际合作与交流专业委员会
                </div>
                <div>
                  <span className="font-semibold text-slate-600">发布日期：</span>
                  {news.date}
                </div>
              </div>
            </div>

            {/* 底部合作引导与行动条 */}
            <footer className="bg-slate-50/80 border-t border-slate-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/en/news"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#1A1A1A] hover:bg-slate-50 transition-colors shadow-xs"
              >
                <svg className="w-3.5 h-3.5 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回全部新闻 (Back to News)
              </Link>

              <div className="w-full sm:w-auto flex items-center gap-3">
                <Link
                  href="/en/cooperation/enquiry"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#1B4F8C] text-xs font-semibold text-white hover:bg-[#153e6d] transition-colors shadow-xs"
                >
                  提交国际合作意向 (Partner with Us)
                  <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </footer>
          </article>
        )}
      </div>
    </div>
  );
}
