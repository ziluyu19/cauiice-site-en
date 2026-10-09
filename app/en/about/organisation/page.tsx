'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ORGANISATION_DATA } from '@/lib/enData';
import { fetchEnglishSiteConfig } from '@/lib/enFirestore';

export default function AboutOrganisationPage() {
  const [orgData, setOrgData] = useState(ORGANISATION_DATA);

  useEffect(() => {
    let active = true;
    fetchEnglishSiteConfig<typeof ORGANISATION_DATA>('organisation').then((data) => {
      if (active && data && data.departments && data.departments.length > 0) {
        setOrgData(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 面包屑导航 */}
        <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
          <Link href="/en" className="hover:text-[#1B4F8C]">Home</Link>
          <span>/</span>
          <Link href="/en/about" className="hover:text-[#1B4F8C]">About Us</Link>
          <span>/</span>
          <span className="text-[#1B4F8C] font-semibold">Organisation</span>
        </nav>

        {/* 标题 */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
            组织架构与领导团队 (Organisation & Governance)
          </h1>
          <p className="text-sm text-[#595959] max-w-3xl leading-relaxed">
            国专委设立严密高效的理事会领导体制、常设秘书处办事机构与专业工作委员会，确保各项国际产学研合作规范落地。
          </p>
        </div>

        {/* 1. 组织架构树状示意图 (Organisation Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs mb-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                国专委组织架构图 (Organisation Chart)
              </h2>
              <p className="text-xs text-[#595959] mt-1">
                分层治理、权责明晰的常态化跨国产学研协同管理架构
              </p>
            </div>
          </div>

          {/* 结构图示意视觉 */}
          <div className="max-w-3xl mx-auto flex flex-col items-center space-y-6 text-center">
            {/* 顶层：中国高校校办产业协会 */}
            <div className="w-full max-w-md bg-slate-100 border border-slate-300 rounded-xl p-4">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">指导与归口管理主管单位</span>
              <span className="text-sm font-bold text-[#1A1A1A]">中国高校校办产业协会 (CAUI)</span>
            </div>

            <div className="w-0.5 h-6 bg-slate-300" />

            {/* 第二层：国专委全体委员大会 / 主任委员常务会 */}
            <div className="w-full max-w-lg bg-[#0F3A6B] text-white rounded-xl p-4 shadow-sm">
              <span className="text-[11px] text-slate-300 uppercase font-semibold block">最高决策与统筹层</span>
              <span className="text-base font-bold">国专委主任委员与理事会常务机构</span>
            </div>

            <div className="w-0.5 h-6 bg-slate-300" />

            {/* 第三层：秘书处执行中枢 */}
            <div className="w-full max-w-md bg-[#1B4F8C] text-white rounded-xl p-3.5 shadow-xs">
              <span className="text-[11px] text-slate-200 uppercase font-semibold block">常设综合执行中枢</span>
              <span className="text-sm font-bold">国专委秘书处 (Secretariat)</span>
            </div>

            <div className="w-0.5 h-6 bg-slate-300" />

            {/* 第四层：四常设业务部门网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {orgData.departments.map((dept, idx) => (
                <div
                  key={dept.name}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left flex flex-col justify-between"
                >
                  <div>
                    <span className="w-5 h-5 rounded-full bg-[#E9F0F8] text-[#1B4F8C] text-[10px] font-bold flex items-center justify-center mb-2">
                      0{idx + 1}
                    </span>
                    <h3 className="text-xs font-bold text-[#1A1A1A] mb-2 leading-snug">
                      {dept.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#595959] leading-relaxed pt-2 border-t border-slate-200/60">
                    {dept.duty}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. 核心领导团队 (Leaders) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs mb-10">
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">
            核心领导架构 (Leadership Team)
          </h2>
          <p className="text-xs text-[#595959] mb-8">
            由全国高等院校骨干产业负责人、技术转移专家与涉外产学研学者共同担纲
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {orgData.leaders.map((leader) => (
              <div
                key={leader.title}
                className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-[#E9F0F8] text-[#1B4F8C] flex items-center justify-center font-bold text-xl border-2 border-white shadow-xs">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1B4F8C] block uppercase tracking-wider">
                    {leader.title}
                  </span>
                  <div className="text-base font-extrabold text-[#1A1A1A] mt-1">
                    {leader.name}
                  </div>
                  <p className="text-xs text-[#595959] mt-2 leading-relaxed">
                    {leader.org}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Resources (预留/隐藏结构，后台未来可以启用) */}
        {/*
          [RESOURCES SECTION PLACEHOLDER]
          按照英文方案要求：
          Resources 暂时作为隐藏/预留结构，供后台未来启用资料下载、双语白皮书、法规标准等内容。
          当前默认不展示复杂内容，保持结构预留。
        */}
        <div className="hidden border border-dashed border-slate-300 rounded-xl p-6 text-center text-xs text-slate-400">
          <span>（Resources 资源下载中心结构已预留，待后台录入后发布）</span>
        </div>

        {/* 底部导航链接 */}
        <div className="flex justify-between items-center text-xs pt-4">
          <Link href="/en/about/committee" className="text-[#595959] hover:text-[#1B4F8C]">
            ← 查看国专委简介与背景
          </Link>
          <Link href="/en/cooperation" className="font-bold text-[#1B4F8C] hover:underline">
            进入合作业务板块 (Cooperation) →
          </Link>
        </div>
      </div>
    </div>
  );
}
