'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import NewsCard from '@/components/en/NewsCard';
import { NEWS_DATA, NewsItem } from '@/lib/enData';
import { fetchEnglishNews } from '@/lib/enFirestore';

function NewsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [newsList, setNewsList] = useState<NewsItem[]>(NEWS_DATA);

  useEffect(() => {
    let active = true;
    fetchEnglishNews(50).then((data) => {
      if (active && data && data.length > 0) {
        setNewsList(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const currentCategory = searchParams.get('category') || 'all';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = 6;

  const categories = [
    { key: 'all', label: '全部动态 (All News)' },
    { key: 'work_updates', label: '工作动态 (Work Updates)' },
    { key: 'events', label: '会议与活动 (Events)' },
    { key: 'policy_insights', label: '政策与行业观察 (Insights)' },
  ];

  const handleCategoryChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === 'all') {
      params.delete('category');
    } else {
      params.set('category', key);
    }
    params.delete('page'); // 切换分类重置页码
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // 过滤分类
  const filteredNews = newsList.filter((item) => {
    if (currentCategory === 'all') return true;
    return item.category === currentCategory;
  });

  // 分页计算
  const totalPages = Math.ceil(filteredNews.length / pageSize) || 1;
  const paginatedNews = filteredNews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 面包屑 */}
        <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
          <Link href="/en" className="hover:text-[#1B4F8C]">Home</Link>
          <span>/</span>
          <span className="text-[#1B4F8C] font-semibold">News & Insights</span>
        </nav>

        {/* 标题 */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-3">
            新闻中心与资讯发布 (News & Insights)
          </h1>
          <p className="text-sm text-[#595959] max-w-3xl leading-relaxed">
            实时发布国专委涉外工作动态、产学研国际学术年会、跨国出访调研纪要，以及行业智库科技成果跨境转化合规观察。
          </p>
        </div>

        {/* 分类切换 Tab */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategoryChange(cat.key)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#1B4F8C] text-white shadow-xs'
                    : 'bg-white text-[#595959] hover:bg-slate-100 hover:text-[#1A1A1A] border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 新闻网格 */}
        {paginatedNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {paginatedNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 mb-12">
            当前分类下暂无最新资讯。
          </div>
        )}

        {/* 分页控制器 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1.5 rounded-md text-xs font-medium border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
            >
              上一页 (Previous)
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-md text-xs font-bold ${
                      currentPage === pageNum
                        ? 'bg-[#1B4F8C] text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1.5 rounded-md text-xs font-medium border border-slate-300 disabled:opacity-40 hover:bg-slate-100"
            >
              下一页 (Next)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">正在加载新闻中心...</div>}>
      <NewsContent />
    </Suspense>
  );
}
