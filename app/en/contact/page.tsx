'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import InquiryForm from '@/components/en/InquiryForm';
import { CONTACT_DATA } from '@/lib/enData';
import { fetchEnglishSiteConfig } from '@/lib/enFirestore';

export default function ContactPage() {
  const [contactData, setContactData] = useState(CONTACT_DATA);

  useEffect(() => {
    let active = true;
    fetchEnglishSiteConfig<typeof CONTACT_DATA>('contact').then((data) => {
      if (active && data && data.cooperation) {
        setContactData(data);
      }
    });
    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="py-12 sm:py-16 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 面包屑 */}
        <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
          <Link href="/en" className="hover:text-[#1B4F8C]">Home</Link>
          <span>/</span>
          <span className="text-[#1B4F8C] font-semibold">Contact Us</span>
        </nav>

        {/* 标题 */}
        <div className="mb-12">
          <div className="text-xs text-[#1B4F8C] font-semibold uppercase tracking-wider mb-2">
            Contact Secretariat · 秘书处联络
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight mb-4">
            联系国专委秘书处与各专业部门
          </h1>
          <p className="text-sm text-[#595959] max-w-3xl leading-relaxed">
            如您有跨国产学研合作申报、学术年会参与、国际会员申请或媒体采访需求，欢迎通过以下官方渠道与秘书处取得联系。
          </p>
        </div>

        {/* 1. 三类业务专项联络人卡片 (Cooperation / Membership / Media) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Cooperation */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-[#1B4F8C] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#E9F0F8] text-[#1B4F8C] flex items-center justify-center font-bold mb-4">
                🤝
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A] mb-1">
                {contactData.cooperation.title}
              </h3>
              <p className="text-xs text-[#595959] mb-4">
                负责跨国联合实验室设立、先进技术跨境转移转化与国际项目申报评估。
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
              <div><strong>对接人：</strong>{contactData.cooperation.contactPerson}</div>
              <div><strong>邮箱：</strong><a href={`mailto:${contactData.cooperation.email}`} className="text-[#1155CC] hover:underline">{contactData.cooperation.email}</a></div>
              <div><strong>电话：</strong>{contactData.cooperation.phone}</div>
            </div>
          </div>

          {/* Membership */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-[#1B4F8C] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#E9F0F8] text-[#1B4F8C] flex items-center justify-center font-bold mb-4">
                🏛️
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A] mb-1">
                {contactData.membership.title}
              </h3>
              <p className="text-xs text-[#595959] mb-4">
                负责国内高校会员单位、海外友好伙伴的入网资质审验与常态化服务跟进。
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
              <div><strong>对接人：</strong>{contactData.membership.contactPerson}</div>
              <div><strong>邮箱：</strong><a href={`mailto:${contactData.membership.email}`} className="text-[#1155CC] hover:underline">{contactData.membership.email}</a></div>
              <div><strong>电话：</strong>{contactData.membership.phone}</div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-[#1B4F8C] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#E9F0F8] text-[#1B4F8C] flex items-center justify-center font-bold mb-4">
                📢
              </div>
              <h3 className="text-base font-bold text-[#1A1A1A] mb-1">
                {contactData.media.title}
              </h3>
              <p className="text-xs text-[#595959] mb-4">
                负责新闻稿发布、论坛路演外宣报道、官方白皮书转载与外事公关协调。
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
              <div><strong>对接人：</strong>{contactData.media.contactPerson}</div>
              <div><strong>邮箱：</strong><a href={`mailto:${contactData.media.email}`} className="text-[#1155CC] hover:underline">{contactData.media.email}</a></div>
              <div><strong>电话：</strong>{contactData.media.phone}</div>
            </div>
          </div>
        </div>

        {/* 2. 主体区：左侧表单，右侧地址办公时间与静态地图交通 (12-column grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* 左侧：在线提交表单 (7 列) */}
          <div className="lg:col-span-7">
            <InquiryForm sourcePageTitle="Contact Secretariat Page" />
          </div>

          {/* 右侧：地址、办公时间、静态地图与交通指南 (5 列) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 办公信息面板 */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1B4F8C]" />
                办公地址与时间 (Office Info)
              </h3>
              <div className="space-y-3 text-xs text-[#595959]">
                <div>
                  <strong className="text-slate-800 block mb-0.5">📍 办公通信地址：</strong>
                  <span>{contactData.office.address}</span>
                </div>
                <div>
                  <strong className="text-slate-800 block mb-0.5">📮 邮政编码：</strong>
                  <span>{contactData.office.postalCode}</span>
                </div>
                <div>
                  <strong className="text-slate-800 block mb-0.5">⏰ 官方工作时间：</strong>
                  <span>{contactData.office.workingHours}</span>
                </div>
                <div>
                  <strong className="text-slate-800 block mb-0.5">🚇 交通与到达指引 (Directions)：</strong>
                  <span>{contactData.office.directions}</span>
                </div>
              </div>
            </div>

            {/* 静态示意地图 (Static Map) */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-[#1A1A1A]">
                方位示意图 (Static Map)
              </h3>
              <div className="w-full h-48 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden text-center p-4">
                {/* 简易静态街区网格示意 */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="30" x2="100" y2="30" stroke="#1B4F8C" strokeWidth="2" />
                    <line x1="0" y1="70" x2="100" y2="70" stroke="#1B4F8C" strokeWidth="2" />
                    <line x1="40" y1="0" x2="40" y2="100" stroke="#1B4F8C" strokeWidth="2" />
                    <line x1="75" y1="0" x2="75" y2="100" stroke="#1B4F8C" strokeWidth="2" />
                  </svg>
                </div>
                <div className="relative z-10 bg-white/90 backdrop-blur-xs p-3 rounded-lg border border-slate-200 shadow-xs max-w-xs">
                  <div className="text-xs font-bold text-[#1B4F8C]">
                    📍 清华科技园创新大厦 A 座 12 层
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    北京市海淀区清华大学东门外
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                注：来访前请提前 1 个工作日通过电话或邮件预约外事会见登记。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
