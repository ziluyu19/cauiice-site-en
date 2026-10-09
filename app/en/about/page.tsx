'use client';

import React from 'react';
import Link from 'next/link';
import CTASection from '@/components/en/CTASection';
import { COMMITTEE_DATA, ORGANISATION_DATA } from '@/lib/enData';

export default function AboutOverviewPage() {
  return (
    <div className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 顶部面包屑与标题区 */}
        <div className="mb-10 text-center sm:text-left">
          <div className="text-xs text-[#1B4F8C] font-semibold uppercase tracking-wider mb-2">
            About Us · 关于国专委
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
            中国高校校办产业国际合作与交流专业委员会
          </h1>
          <p className="text-sm text-[#595959] max-w-3xl leading-relaxed">
            立足全国高校产业界，全面承担中国高校校办产业涉外交流、产教融合出海与高新技术跨国转移转化的官方统筹使命。
          </p>
        </div>

        {/* 核心子栏目快速导览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* 子栏目 1: 国专委简介与背景 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:border-[#1B4F8C] transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E9F0F8] text-[#1B4F8C] flex items-center justify-center font-bold mb-5 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#1B4F8C] transition-colors">
                国专委简介 (About the Committee)
              </h2>
              <p className="text-xs sm:text-sm text-[#595959] leading-relaxed mb-6">
                深入了解国专委的历史沿革、教育部业务指导背景、中国高校校办产业协会分支机构法定属性，以及立足全国辐射全球的业务范围。
              </p>
            </div>
            <Link
              href="/en/about/committee"
              className="inline-flex items-center text-xs font-bold text-[#1B4F8C] group-hover:translate-x-1 transition-transform"
            >
              浏览简介、隶属关系与业务区域 →
            </Link>
          </div>

          {/* 子栏目 2: 组织架构与领导团队 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:border-[#1B4F8C] transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E9F0F8] text-[#1B4F8C] flex items-center justify-center font-bold mb-5 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#1B4F8C] transition-colors">
                组织架构与部门 (Organisation)
              </h2>
              <p className="text-xs sm:text-sm text-[#595959] leading-relaxed mb-6">
                查看国专委组织结构图、秘书处常设办事机构、项目部、会员网络部与智库标准委员会的职能分布与专家团队构成。
              </p>
            </div>
            <Link
              href="/en/about/organisation"
              className="inline-flex items-center text-xs font-bold text-[#1B4F8C] group-hover:translate-x-1 transition-transform"
            >
              浏览架构图、部门职责与专家团队 →
            </Link>
          </div>
        </div>

        {/* 关键信息摘要展板 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">
            国专委四大支柱 (Four Pillars)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[#1B4F8C] font-bold text-sm block mb-1">官方权威性</span>
              <p className="text-xs text-[#595959]">依托全国高校校办产业协会，具备严谨合规的公文运转与国家战略服务能力。</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[#1B4F8C] font-bold text-sm block mb-1">高校密集覆盖</span>
              <p className="text-xs text-[#595959]">聚合全国数十所重点高校产业投资平台与大学科技园核心创新实体。</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[#1B4F8C] font-bold text-sm block mb-1">专业孵化服务</span>
              <p className="text-xs text-[#595959]">提供跨国联合实验室、中试验证、知识产权梳理与投融资赋能。</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[#1B4F8C] font-bold text-sm block mb-1">全球开放协同</span>
              <p className="text-xs text-[#595959]">以开放、互利、严谨的原则，常年拓展全球高水平产学研合作伙伴关系。</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <CTASection
          title="希望进一步探讨与国专委的全面合作？"
          description="欢迎海外高校校领导、产业转化主管及跨国企业代表联系我们，建立一对一战略对话。"
        />
      </div>
    </div>
  );
}
