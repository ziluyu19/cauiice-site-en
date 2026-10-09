'use client';

import React from 'react';
import Link from 'next/link';
import { REGION_DISTRIBUTION, RegionDistributionItem } from '@/lib/enData';

interface DistributionSectionProps {
  regions?: RegionDistributionItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function DistributionSection({
  regions = REGION_DISTRIBUTION,
  title = '全国核心高校科技创新集群分布',
  subtitle = 'Member Distribution Across China',
  className = '',
}: DistributionSectionProps) {
  return (
    <section className={`py-16 sm:py-20 bg-slate-50/70 border-y border-slate-200/60 ${className}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1B4F8C] block mb-2">
            {subtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#595959] mt-2">
            国专委网络深度覆盖京津冀、长三角、粤港澳大湾区及中西部重点高校密集区
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 左侧静态地图与地理视觉 (6 列) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col items-center justify-center relative shadow-xs min-h-[380px]">
            {/* 静态示意地图视觉 */}
            <div className="relative w-full max-w-[360px] aspect-4/3 flex items-center justify-center">
              <svg
                viewBox="0 0 400 300"
                className="w-full h-full text-[#1B4F8C]/15"
                fill="currentColor"
              >
                {/* 静态示意多边形轮廓 */}
                <path d="M 120 40 Q 180 30 240 50 Q 300 70 340 120 Q 360 170 320 220 Q 280 260 210 270 Q 140 280 80 230 Q 40 180 50 120 Q 70 60 120 40 Z" />
                <path d="M 280 230 Q 320 250 350 280 Q 330 290 300 270 Z" />
              </svg>

              {/* 核心集群坐标点标注 (静态展示，非交互点击) */}
              <div className="absolute top-[32%] left-[62%] flex items-center gap-1.5 pointer-events-none">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B4F8C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1B4F8C]"></span>
                </span>
                <span className="bg-[#0F3A6B] text-white text-[10px] px-2 py-0.5 rounded shadow-xs font-semibold">
                  北京 (48)
                </span>
              </div>

              <div className="absolute top-[52%] left-[72%] flex items-center gap-1.5 pointer-events-none">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1B4F8C]"></span>
                <span className="bg-[#1B4F8C] text-white text-[10px] px-1.5 py-0.5 rounded shadow-xs font-semibold">
                  长三角 (82)
                </span>
              </div>

              <div className="absolute top-[72%] left-[65%] flex items-center gap-1.5 pointer-events-none">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1B4F8C]"></span>
                <span className="bg-[#1B4F8C] text-white text-[10px] px-1.5 py-0.5 rounded shadow-xs font-semibold">
                  粤港澳 (28)
                </span>
              </div>

              <div className="absolute top-[48%] left-[45%] flex items-center gap-1.5 pointer-events-none">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                <span className="bg-slate-700 text-white text-[10px] px-1.5 py-0.5 rounded shadow-xs">
                  中西部 (36)
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center mt-3">
              注：地图为静态创新地理示意，详细分布请点击右侧省份进入成员名录
            </div>
          </div>

          {/* 右侧重点区域列表 (6 列) - 点击可进入对应区域筛选 */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-semibold text-[#1B4F8C] uppercase tracking-wider mb-2">
              按地区浏览高校成员 (Click to view members by region)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {regions.map((item) => (
                <Link
                  key={item.code}
                  href={`/en/network/members?region=${encodeURIComponent(item.code)}`}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-[#1B4F8C] hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#1B4F8C] transition-colors">
                      {item.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-[#E9F0F8] text-[#1B4F8C]">
                      {item.count} 家
                    </span>
                  </div>

                  <p className="text-[11px] text-[#595959] line-clamp-1 mb-2">
                    {item.featuredInstitutions.join(' · ')}
                  </p>

                  <div className="text-[11px] text-[#1155CC] font-medium flex items-center gap-1 pt-1 border-t border-slate-100 group-hover:translate-x-0.5 transition-transform">
                    <span>进入该地区筛选</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/en/network/members"
                className="inline-flex items-center text-xs font-bold text-[#1B4F8C] hover:underline"
              >
                查看全部 180+ 会员单位完整名录 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
