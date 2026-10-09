'use client';

import React from 'react';
import Link from 'next/link';
import CTASection from '@/components/en/CTASection';
import { WHAT_WE_CAN_DO } from '@/lib/enData';

const PARTNER_TYPES = [
  {
    type: '海外高校 (Global Universities)',
    description: '面向全球知名高等学府与理工大学，支持校际科技园联盟互访、联合实验室共建与双向学者访问研修。',
    features: ['校际协同研发中心共建', '跨国研究生/博士后产业课题', '海外先进技术中国技术转移'],
    icon: '🎓',
  },
  {
    type: '科研机构 (Research Institutes)',
    description: '面向全球顶尖应用科学研究机构，推动重大科学发现的概念验证、中试试验与商业化应用落地。',
    features: ['重大前沿领域联合攻关', '跨国知识产权中试与验证', '双边科技成果转移专场路演'],
    icon: '🔬',
  },
  {
    type: '跨国企业 (Multinational Corporations)',
    description: '针对全球行业领军企业，开放中国高校优势学科创新链与人才链，共建联合研发中心与产业出海联合体。',
    features: ['企业定制化定向研发攻关', '中国高校顶尖人才招聘直通', '共建跨国产教融合团体标准'],
    icon: '🏢',
  },
  {
    type: '政府与行业组织 (Government & Organizations)',
    description: '面向外国驻华使领馆科技处、境外投资促进署、外国商会及国际科技组织，开展常态化双边多边科技经贸对话。',
    features: ['双边高校科技创新圆桌峰会', '国际大学科技园政策智库咨询', '多边产业协同合作备忘录缔结'],
    icon: '🌐',
  },
];

export default function CooperationOverviewPage() {
  return (
    <div className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 顶部标题区 */}
        <div className="mb-12 text-center sm:text-left">
          <div className="text-xs text-[#1B4F8C] font-semibold uppercase tracking-wider mb-2">
            Cooperation · 国际合作
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
            全球产学研协同合作与双向赋能体系
          </h1>
          <p className="text-sm text-[#595959] max-w-3xl leading-relaxed">
            国专委致力于消除跨国协同研发与成果转化的制度性与信息壁垒，为全球不同类型的创新伙伴提供量身定制的中国落地与双向合作路径。
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/en/cooperation/projects"
              className="inline-flex items-center px-4 py-2.5 rounded-md text-xs font-bold text-white bg-[#1B4F8C] hover:bg-[#0F3A6B] transition-colors"
            >
              浏览开放合作项目库 (Projects & Opportunities) →
            </Link>
            <Link
              href="/en/cooperation/enquiry"
              className="inline-flex items-center px-4 py-2.5 rounded-md text-xs font-semibold text-[#1B4F8C] bg-[#E9F0F8] hover:bg-blue-100 transition-colors"
            >
              提交合作意向与需求 (Submit Enquiry) →
            </Link>
          </div>
        </div>

        {/* 1. What We Do: 四大合作方向 */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              四大合作方向 (What We Do)
            </h2>
            <p className="text-xs text-[#595959] mt-1">
              围绕高水平产学研融合的核心业务体系
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHAT_WE_CAN_DO.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="w-10 h-10 rounded-lg bg-[#E9F0F8] text-[#1B4F8C] flex items-center justify-center font-bold mb-4">
                    ✓
                  </span>
                  <h3 className="text-base font-bold text-[#1A1A1A] mb-1">
                    {item.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-medium mb-3">
                    {item.subtitle}
                  </div>
                  <p className="text-xs text-[#595959] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  {item.features.map((feat) => (
                    <div key={feat} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#1B4F8C] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Partner Types: 四大伙伴类型 */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              核心合作对象与服务矩阵 (Partner Types)
            </h2>
            <p className="text-xs text-[#595959] mt-1">
              根据不同类型机构的发展诉求，匹配差异化协同资源
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARTNER_TYPES.map((partner) => (
              <div
                key={partner.type}
                className="bg-white rounded-2xl border border-slate-200 p-7 shadow-xs hover:border-[#1B4F8C] transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{partner.icon}</span>
                  <h3 className="text-base font-bold text-[#1A1A1A]">
                    {partner.type}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#595959] leading-relaxed mb-5">
                  {partner.description}
                </p>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-[#1B4F8C]">重点合作事项：</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {partner.features.map((f) => (
                      <div key={f} className="text-[11px] bg-slate-50 p-2 rounded border border-slate-100 text-slate-700 text-center truncate">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <CTASection
        title="已有明确项目对接意向？"
        subtitle="Submit Your Proposal"
        description="您可以直接在合作咨询专区提交具体技术需求，国专委项目组将为您启动定制化精准匹配。"
        primaryButtonText="提交意向需求 (Enquiry)"
        primaryButtonHref="/en/cooperation/enquiry"
      />
    </div>
  );
}
