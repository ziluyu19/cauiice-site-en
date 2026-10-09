'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StatsSection from '@/components/en/StatsSection';
import DistributionSection from '@/components/en/DistributionSection';
import CTASection from '@/components/en/CTASection';
import { MEMBERS_DATA, MemberItem } from '@/lib/enData';
import { fetchEnglishMembers } from '@/lib/enFirestore';

export default function NetworkOverviewPage() {
  const [membersList, setMembersList] = useState<MemberItem[]>(MEMBERS_DATA);

  useEffect(() => {
    let active = true;
    fetchEnglishMembers(20).then((data) => {
      if (active && data && data.length > 0) {
        setMembersList(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const featuredMembers = membersList.slice(0, 4);

  return (
    <div className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 顶部标题区 */}
        <div className="mb-12 text-center sm:text-left">
          <div className="text-xs text-[#1B4F8C] font-semibold uppercase tracking-wider mb-2">
            Our Network · 协同网络
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
            全国高校骨干产业与全球创新伙伴网络
          </h1>
          <p className="text-sm text-[#595959] max-w-3xl leading-relaxed">
            汇聚全国一流高等院校资产管理公司、国家大学科技园与高水平技术转移示范平台，构建互利共赢的全球开放创新生态。
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/en/network/members"
              className="inline-flex items-center px-4 py-2.5 rounded-md text-xs font-bold text-white bg-[#1B4F8C] hover:bg-[#0F3A6B] transition-colors"
            >
              浏览全部会员单位名录 (Members Directory) →
            </Link>
            <Link
              href="#join-us"
              className="inline-flex items-center px-4 py-2.5 rounded-md text-xs font-semibold text-[#1B4F8C] bg-[#E9F0F8] hover:bg-blue-100 transition-colors"
            >
              加入国专委网络 (Join Us) ↓
            </Link>
          </div>
        </div>

        {/* 网络核心数据 */}
        <div className="mb-16">
          <StatsSection
            title="广泛且深具影响力的全国高校网络体系"
            subtitle="Network Coverage"
          />
        </div>

        {/* 成员全国地理分布 */}
        <div className="mb-16">
          <DistributionSection />
        </div>

        {/* 重点代表性成员单位速览 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                部分代表性骨干会员实体 (Featured Network Members)
              </h2>
              <p className="text-xs text-[#595959] mt-1">
                涵盖国家大学科技园、高校技术转移中心与高科技产业集团
              </p>
            </div>
            <Link
              href="/en/network/members"
              className="text-xs font-bold text-[#1B4F8C] hover:underline"
            >
              查看完整 180+ 名录 →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-[#1B4F8C] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#1B4F8C] bg-[#E9F0F8] px-2.5 py-0.5 rounded-full">
                      {member.typeName}
                    </span>
                    <span className="text-xs text-slate-500">📍 {member.regionName}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1A1A1A] mb-2">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#595959] leading-relaxed mb-4">
                    {member.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {member.keyFields.map((f) => (
                    <span key={f} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      #{f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Join Us (加入指引) */}
        <section id="join-us" className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs mb-12">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1B4F8C] block mb-2">
              Join Us · 加入我们
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4">
              如何加入国专委生态网络
            </h2>
            <p className="text-xs sm:text-sm text-[#595959] leading-relaxed mb-8">
              我们常年欢迎具有良好学术声誉与科技创新实力的中国高校校办企业、大学科技园，以及海外知名高校技术转移办公室、国际科研机构与跨国产业伙伴申请加入。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-sm font-bold text-[#1B4F8C] block">01. 提交资质申请</span>
                <p className="text-xs text-[#595959]">提交机构基本信息、科技创新成果优势及参与国际合作的工作规划。</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-sm font-bold text-[#1B4F8C] block">02. 秘书处合规审验</span>
                <p className="text-xs text-[#595959]">国专委秘书处依照《中国高校校办产业协会分支机构管理办法》组织评估。</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-sm font-bold text-[#1B4F8C] block">03. 授牌与资源接入</span>
                <p className="text-xs text-[#595959]">审议通过后颁发官方伙伴证书，全面接入跨国项目库与智库支持体系。</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/en/cooperation/enquiry?intent=MEMBERSHIP_ENQUIRY"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-md text-xs font-bold text-white bg-[#1B4F8C] hover:bg-[#0F3A6B] transition-colors"
              >
                在线提交入网申请 (Apply to Join Network)
              </Link>
              <Link
                href="/en/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-md text-xs font-semibold text-[#595959] border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                联系会员联络专员
              </Link>
            </div>
          </div>
        </section>
      </div>

      <CTASection
        title="与中国顶尖高校科技产业共同发展"
        description="国专委秘书处随时准备协助您链接最具实力的科研团队与大学科技园。"
      />
    </div>
  );
}
