'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { COMMITTEE_DATA } from '@/lib/enData';
import { fetchEnglishSiteConfig } from '@/lib/enFirestore';

export default function AboutCommitteePage() {
  const [committee, setCommittee] = useState(COMMITTEE_DATA);

  useEffect(() => {
    let active = true;
    fetchEnglishSiteConfig<typeof COMMITTEE_DATA>('committee').then((data) => {
      if (active && data && data.overview) {
        setCommittee(data);
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
          <span className="text-[#1B4F8C] font-semibold">About the Committee</span>
        </nav>

        {/* 标题 */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
            国专委简介与法定定位 (About the Committee)
          </h1>
          <p className="text-sm text-[#595959] max-w-3xl leading-relaxed">
            深入了解中国高校校办产业协会国际合作与交流专业委员会的设立宗旨、历史背景、法律地位与业务辐射网络。
          </p>
        </div>

        {/* 四大核心法定板块 (Overview, Background, Affiliation, Scope) */}
        <div className="space-y-8">
          {/* 1. 机构总览 (Overview) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#E9F0F8] text-[#1B4F8C] flex items-center justify-center font-bold text-sm">
                01
              </span>
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                机构总览 (Overview & Mandate)
              </h2>
            </div>
            <p className="text-sm text-[#595959] leading-relaxed mb-4">
              {committee.overview}
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
              作为全国高校产业对外合作的核心综合纽带，国专委始终坚持“搭平台、促合作、防风险、拓生态”的工作方针，全面赋能高校科技成果跨境出海与国际高水平团队落地合作。
            </div>
          </div>

          {/* 2. 成立背景与历史沿革 (Background) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#E9F0F8] text-[#1B4F8C] flex items-center justify-center font-bold text-sm">
                02
              </span>
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                成立背景与时代使命 (Historical Background)
              </h2>
            </div>
            <p className="text-sm text-[#595959] leading-relaxed mb-4">
              {committee.background}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl border border-slate-100 bg-[#E9F0F8]/30">
                <span className="font-bold text-xs text-[#1B4F8C] block mb-1">第一阶段：自发探索</span>
                <p className="text-xs text-[#595959]">各高校独立与海外院所尝试学术与初步产业合作，分散且缺乏统一合规标准。</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-[#E9F0F8]/30">
                <span className="font-bold text-xs text-[#1B4F8C] block mb-1">第二阶段：机制化设立</span>
                <p className="text-xs text-[#595959]">中国高校校办产业协会审议批准设立国专委，形成全国性统筹指导机制。</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-[#E9F0F8]/30">
                <span className="font-bold text-xs text-[#1B4F8C] block mb-1">第三阶段：全球生态互联</span>
                <p className="text-xs text-[#595959]">数字化门户与跨国项目库建立，迈入全流程、高合规与智库标准引领新阶段。</p>
              </div>
            </div>
          </div>

          {/* 3. 隶属关系与合规属性 (Affiliation Relationship) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#E9F0F8] text-[#1B4F8C] flex items-center justify-center font-bold text-sm">
                03
              </span>
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                隶属关系与法人性质 (Affiliation & Governance)
              </h2>
            </div>
            <p className="text-sm text-[#595959] leading-relaxed mb-4">
              {committee.affiliation}
            </p>
            <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              <strong>合规声明：</strong>国专委依据《社会团体登记管理条例》在中国高校校办产业协会章程规定范围内开展活动，不具有独立法人资格。对外公函、联合实验室授牌及协议合作均须严格遵循国专委规章制度并向主管协会报备。
            </div>
          </div>

          {/* 4. 业务辐射范围与区域节点 (Scope & Activity Regions) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#E9F0F8] text-[#1B4F8C] flex items-center justify-center font-bold text-sm">
                04
              </span>
              <h2 className="text-xl font-bold text-[#1A1A1A]">
                业务辐射范围与重点区域 (Scope & Regional Footprint)
              </h2>
            </div>
            <p className="text-sm text-[#595959] leading-relaxed mb-6">
              {committee.scope}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-xs font-bold text-[#1B4F8C] block mb-1">中国境内核心网络</span>
                <p className="text-[11px] text-[#595959]">覆盖京津冀、长三角、大湾区、成渝等高校集群城市。</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-xs font-bold text-[#1B4F8C] block mb-1">欧洲创新合作区</span>
                <p className="text-[11px] text-[#595959]">聚焦德国、瑞士、英国、法国，开展智能制造与生物医药协同。</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-xs font-bold text-[#1B4F8C] block mb-1">亚太创新网络</span>
                <p className="text-[11px] text-[#595959]">深度对接新加坡、日本、韩国，开展高新材料与绿色能源合作。</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-xs font-bold text-[#1B4F8C] block mb-1">一带一路科技伙伴</span>
                <p className="text-[11px] text-[#595959]">面向共建国家，推广大学科技园建设经验与数字教育装备出海。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部导航链接 */}
        <div className="mt-12 flex justify-between items-center text-xs">
          <Link href="/en/about" className="text-[#595959] hover:text-[#1B4F8C]">
            ← 返回 About Us 概览
          </Link>
          <Link href="/en/about/organisation" className="font-bold text-[#1B4F8C] hover:underline">
            下一步：查看国专委组织架构与领导团队 →
          </Link>
        </div>
      </div>
    </div>
  );
}
